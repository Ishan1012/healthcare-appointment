import { google } from "googleapis";
import { Patient } from "../model/Patient";
import { Doctor } from "../model/Doctor";
import { Admin } from "../model/Admin";

export class CalendarService {
    private getOAuth2Client(): any {
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/v1/calendar/callback";
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );
    }

    private async findUserById(userId: string) {
        // Strip role prefixes (e.g. PAT_, DOC_, ADM_) if present
        const cleanId = userId.replace(/^(PAT_|DOC_|ADM_)/, "");

        let patient = await Patient.findById(cleanId).exec();
        if (patient) return { doc: patient, role: "Patient" };

        let doctor = await Doctor.findById(cleanId).exec();
        if (doctor) return { doc: doctor, role: "Doctor" };

        let admin = await Admin.findById(cleanId).exec();
        if (admin) return { doc: admin, role: "Admin" };

        return null;
    }

    getAuthUrl(userId: string): string {
        const oauth2Client = this.getOAuth2Client();
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events'
            ],
            state: userId
        });
    }

    async handleOAuthCallback(code: string, userId: string): Promise<boolean> {
        try {
            const oauth2Client = this.getOAuth2Client();
            const { tokens } = await oauth2Client.getToken(code);

            const userResult = await this.findUserById(userId);
            if (!userResult) {
                console.error(`User not found during calendar OAuth callback: ${userId}`);
                return false;
            }

            const calendarData = {
                connected: true,
                refreshToken: tokens.refresh_token || undefined,
                accessToken: tokens.access_token || undefined,
                tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
            };

            if (userResult.role === "Patient") {
                await Patient.findByIdAndUpdate(userResult.doc._id, { $set: { googleCalendar: calendarData } }).exec();
            } else if (userResult.role === "Doctor") {
                await Doctor.findByIdAndUpdate(userResult.doc._id, { $set: { googleCalendar: calendarData } }).exec();
            } else {
                await Admin.findByIdAndUpdate(userResult.doc._id, { $set: { googleCalendar: calendarData } }).exec();
            }

            return true;
        } catch (err: any) {
            console.error('OAuth callback failed:', err.message);
            return false;
        }
    }

    async getAuthedClient(userId: string) {
        try {
            const userResult = await this.findUserById(userId);
            if (!userResult || !userResult.doc.googleCalendar?.connected || !userResult.doc.googleCalendar?.refreshToken) {
                return null;
            }

            const oauth2Client = this.getOAuth2Client();
            oauth2Client.setCredentials({
                refresh_token: userResult.doc.googleCalendar.refreshToken,
                access_token: userResult.doc.googleCalendar.accessToken || null
            });

            // Auto refresh handler
            oauth2Client.on('tokens', async (tokens: any) => {
                console.log(`[Google Calendar] Auto-refreshed access token for user ${userId}. Saving to database...`);
                const updates: any = {};
                if (tokens.access_token) updates['googleCalendar.accessToken'] = tokens.access_token;
                if (tokens.expiry_date) updates['googleCalendar.tokenExpiry'] = new Date(tokens.expiry_date);
                if (tokens.refresh_token) updates['googleCalendar.refreshToken'] = tokens.refresh_token;

                if (userResult.role === "Patient") {
                    await Patient.findByIdAndUpdate(userResult.doc._id, { $set: updates }).exec();
                } else if (userResult.role === "Doctor") {
                    await Doctor.findByIdAndUpdate(userResult.doc._id, { $set: updates }).exec();
                } else {
                    await Admin.findByIdAndUpdate(userResult.doc._id, { $set: updates }).exec();
                }
            });

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client as any });
            return { oauth2Client, calendar };
        } catch (err: any) {
            console.error('getAuthedClient failed:', err.message);
            return null;
        }
    }

    async createEvent(appointment: any, doctor: any, patient: any): Promise<string> {
        console.log(`[Google Calendar] Scheduling event for appointment on ${appointment.scheduledTime} with Dr. ${doctor.name}`);
        
        const patientIdStr = patient._id.toString();
        const doctorIdStr = doctor._id.toString();

        let client = await this.getAuthedClient(patientIdStr);
        let activeUserId = patientIdStr;

        if (!client) {
            client = await this.getAuthedClient(doctorIdStr);
            activeUserId = doctorIdStr;
        }

        if (!client) {
            const admins = await Admin.find().exec();
            for (const admin of admins) {
                const adminClient = await this.getAuthedClient(admin._id.toString());
                if (adminClient) {
                    client = adminClient;
                    activeUserId = admin._id.toString();
                    break;
                }
            }
        }

        if (!client) {
            console.log(`[Google Calendar] Mock Mode: No connected user calendar found. EventID: mock_event_${Date.now()}`);
            return `mock_event_${Date.now()}`;
        }

        try {
            const startTime = new Date(appointment.scheduledTime);
            const duration = doctor.slotDuration || 30;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            const event = {
                summary: `Medical Checkup: ${patient.name} & Dr. ${doctor.name}`,
                description: `Appointment type: ${appointment.type || "In-Person Consultation"}. pre-visit summary by WellNest.`,
                start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
                end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
                attendees: [
                    { email: patient.email },
                    { email: doctor.email }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            const res = await client.calendar.events.insert({
                calendarId: 'primary',
                requestBody: event
            });

            console.log(`[Google Calendar] Event successfully created on user ${activeUserId} calendar. Google EventID: ${res.data.id}`);
            return res.data.id || `mock_event_${Date.now()}`;
        } catch (error: any) {
            console.error("[Google Calendar] Failed to create event on Google Calendar:", error.message);
            return `failed_event_${Date.now()}`;
        }
    }

    async updateEvent(eventId: string, appointment: any, doctor: any, patient: any): Promise<boolean> {
        console.log(`[Google Calendar] Updating event ${eventId} to ${appointment.scheduledTime}`);
        if (!eventId || eventId.startsWith("mock_") || eventId.startsWith("failed_")) {
            return true;
        }

        const patientIdStr = patient._id.toString();
        const doctorIdStr = doctor._id.toString();

        let client = await this.getAuthedClient(patientIdStr);
        if (!client) {
            client = await this.getAuthedClient(doctorIdStr);
        }
        if (!client) {
            const admins = await Admin.find().exec();
            for (const admin of admins) {
                const adminClient = await this.getAuthedClient(admin._id.toString());
                if (adminClient) {
                    client = adminClient;
                    break;
                }
            }
        }

        if (!client) {
            return true;
        }

        try {
            const startTime = new Date(appointment.scheduledTime);
            const duration = doctor.slotDuration || 30;
            const endTime = new Date(startTime.getTime() + duration * 60000);

            const event = {
                summary: `RESCHEDULED: Medical Checkup: ${patient.name} & Dr. ${doctor.name}`,
                start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
                end: { dateTime: endTime.toISOString(), timeZone: 'UTC' }
            };

            await client.calendar.events.patch({
                calendarId: 'primary',
                eventId,
                requestBody: event
            });
            return true;
        } catch (error: any) {
            console.error("[Google Calendar] Failed to update calendar event:", error.message);
            return false;
        }
    }

    async deleteEvent(eventId: string): Promise<boolean> {
        console.log(`[Google Calendar] Cancelling/Deleting event ${eventId}`);
        if (!eventId || eventId.startsWith("mock_") || eventId.startsWith("failed_")) {
            return true;
        }

        try {
            const { Appointment } = require("../model/Appointment");
            const appointment = await Appointment.findOne({ googleEventId: eventId }).exec();
            
            let client = null;
            if (appointment) {
                client = await this.getAuthedClient(appointment.patientId.toString());
                if (!client) {
                    client = await this.getAuthedClient(appointment.doctorId.toString());
                }
            }

            if (!client) {
                const admins = await Admin.find().exec();
                for (const admin of admins) {
                    const adminClient = await this.getAuthedClient(admin._id.toString());
                    if (adminClient) {
                        client = adminClient;
                        break;
                    }
                }
            }

            if (!client) {
                return true;
            }

            await client.calendar.events.delete({
                calendarId: 'primary',
                eventId
            });
            return true;
        } catch (error: any) {
            console.error("[Google Calendar] Failed to delete calendar event:", error.message);
            return false;
        }
    }
}
