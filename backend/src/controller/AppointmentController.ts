import { Response } from "express";
import { AppointmentService } from "../service/AppointmentService";
import { DoctorService } from "../service/DoctorService";
import { PatientService } from "../service/PatientService";
import { SummaryService } from "../service/SummaryService";
import { GeminiService } from "../service/GeminiService";
import { CalendarService } from "../service/CalendarService";
import { EmailService } from "../service/EmailService";
import { Summary } from "../model/Summary";
import { Symptom } from "../model/Symptom";
import { Appointment } from "../model/Appointment";
import { Patient } from "../model/Patient";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";

const appointmentService = new AppointmentService();
const doctorService = new DoctorService();
const patientService = new PatientService();
const summaryService = new SummaryService();
const geminiService = new GeminiService();
const calendarService = new CalendarService();
const emailService = new EmailService();

export const getAppointments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId, role } = req.user!;
        let appointments = [];

        if (role === "Admin") {
            appointments = await appointmentService.getAllPopulatedAppointments();
        } else if (role === "Patient") {
            // Find appointments for patient
            const allAppts = await appointmentService.getAllPopulatedAppointments();
            appointments = allAppts.filter(appt => appt.patientId && (appt.patientId as any)._id.toString() === userId);
        } else {
            // Doctor
            const allAppts = await appointmentService.getAllPopulatedAppointments();
            appointments = allAppts.filter(appt => appt.doctorId && (appt.doctorId as any)._id.toString() === userId);
        }

        const formatted = appointments.map(appt => {
            const pad = (n: number) => n.toString().padStart(2, '0');
            const d = new Date(appt.scheduledTime);
            const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

            const hours = d.getHours();
            const minutes = d.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const timeStr = `${pad(displayHours)}:${pad(minutes)} ${ampm}`;

            return {
                id: (appt as any)._id,
                type: (appt as any).type || "In-Person Consultation",
                date: dateStr,
                time: timeStr,
                status: appt.status,
                doctor: appt.doctorId ? {
                    id: (appt.doctorId as any)._id,
                    name: (appt.doctorId as any).name,
                    email: (appt.doctorId as any).email,
                    specialty: (appt.doctorId as any).specialisation,
                    qualifications: (appt.doctorId as any).qualifications || "M.D.",
                    address: (appt.doctorId as any).address || "WellNest Clinic",
                    phone: (appt.doctorId as any).phone || "N/A"
                } : null,
                patientInfo: appt.patientId ? {
                    name: (appt.patientId as any).name,
                    email: (appt.patientId as any).email,
                    phone: (appt.patientId as any).phone || "N/A",
                    age: String((appt.patientId as any).age || 30),
                    gender: (appt.patientId as any).gender || "Male",
                    address: (appt.patientId as any).address || "N/A",
                    concern: "General consultation"
                } : {
                    name: "Unknown",
                    email: "N/A",
                    phone: "N/A",
                    age: "30",
                    gender: "Male",
                    address: "N/A",
                    concern: "General consultation"
                }
            };
        });

        res.status(200).json({ success: true, appointments: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAppointmentById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const appointment = await appointmentService.getPopulatedAppointmentById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }

        const pad = (n: number) => n.toString().padStart(2, '0');
        const d = new Date(appointment.scheduledTime);
        const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        const hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const timeStr = `${pad(displayHours)}:${pad(minutes)} ${ampm}`;

        const formatted = {
            id: (appointment as any)._id,
            type: (appointment as any).type || "In-Person Consultation",
            date: dateStr,
            time: timeStr,
            status: appointment.status,
            doctor: appointment.doctorId ? {
                id: (appointment.doctorId as any)._id,
                name: (appointment.doctorId as any).name,
                email: (appointment.doctorId as any).email,
                specialty: (appointment.doctorId as any).specialisation,
                qualifications: (appointment.doctorId as any).qualifications || "M.D.",
                address: (appointment.doctorId as any).address || "WellNest Clinic",
                phone: (appointment.doctorId as any).phone || "N/A"
            } : null,
            patientInfo: appointment.patientId ? {
                name: (appointment.patientId as any).name,
                email: (appointment.patientId as any).email,
                phone: (appointment.patientId as any).phone || "N/A",
                age: String((appointment.patientId as any).age || 30),
                gender: (appointment.patientId as any).gender || "Male",
                address: (appointment.patientId as any).address || "N/A",
                concern: "General consultation"
            } : {
                name: "Unknown",
                email: "N/A",
                phone: "N/A",
                age: "30",
                gender: "Male",
                address: "N/A",
                concern: "General consultation"
            }
        };

        // Fetch pre-visit/post-visit summaries if any
        const summary = await Summary.findOne({ appointmentId: id as any }).exec();

        res.status(200).json({ success: true, appointment: formatted, summary });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addAppointment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { date, time, patientInfo, type } = req.body;
        const doctorId = req.body.doctorId || req.body.doctor?.id || req.body.doctor?._id;
        const patientUserId = req.user?.userId;

        if (!doctorId || !date || !time || !patientInfo) {
            return res.status(400).json({ success: false, error: "Doctor, date, time, and patient details are required" });
        }

        const doctor = await doctorService.getDoctorById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, error: "Doctor not found" });
        }

        // Combine date and time
        const scheduledTime = new Date(`${date}T${time}`);
        if (isNaN(scheduledTime.getTime())) {
            return res.status(400).json({ success: false, error: "Invalid date or time format" });
        }

        // 1. Prevent double-booking
        const existing = await Appointment.findOne({
            doctorId,
            scheduledTime,
            status: { $in: ["booked", "rescheduled"] }
        }).exec();

        if (existing) {
            return res.status(409).json({ success: false, error: "This slot is already booked. Please choose another slot." });
        }

        // 2. Check if doctor is on leave
        const dateString = scheduledTime.toDateString();
        const isOnLeave = (doctor.leaveDays || []).some(leaveDate => new Date(leaveDate).toDateString() === dateString);
        if (isOnLeave) {
            return res.status(400).json({ success: false, error: "Doctor is unavailable on this date" });
        }

        // 3. Fetch patient details or mock if patient details are supplied
        let patient = await patientService.getPatientByEmail(patientInfo.email);
        if (!patient) {
            // Patient needs to exist
            return res.status(400).json({ success: false, error: "Patient user account not found" });
        }

        // Update patient info details if blank
        if (!patient.phone || !patient.age) {
            await patientService.updatePatient(patient.email, {
                phone: patientInfo.phone,
                address: patientInfo.address,
                age: Number(patientInfo.age)
            });
            // Re-fetch
            patient = await patientService.getPatientByEmail(patientInfo.email);
        }

        // 4. Call LLM for pre-visit summary
        const concernText = patientInfo.concern || "General consultation request";
        console.log(`[LLM Pre-Visit] Generating summary for concerns: "${concernText}"`);
        const aiSummary = await geminiService.generatePreVisitSummary(concernText);

        // 5. Create Appointment
        const appointment = await appointmentService.createAppointment({
            patientId: patient?._id as any,
            doctorId: doctor._id as any,
            scheduledTime,
            status: "booked",
            type: type || "In-Person Consultation"
        });

        if (!appointment) {
            return res.status(500).json({ success: false, error: "Failed to create appointment in database" });
        }

        // Save Raw Symptom
        const symptom = new Symptom({
            appointmentId: (appointment as any)._id,
            symptomText: concernText
        });
        await symptom.save();

        // Save AI Summary
        const summary = new Summary({
            appointmentId: (appointment as any)._id,
            preVisitSummary: `Chief Complaint: ${aiSummary.chiefComplaint}\nSuggested Questions: ${aiSummary.suggestedQuestions.join(", ")}`,
            urgencyLevel: aiSummary.urgencyLevel
        });
        await summary.save();

        // 6. Create Google Calendar event
        const googleEventId = await calendarService.createEvent(appointment, doctor, patient!);
        appointment.googleEventId = googleEventId;
        await (appointment as any).save();

        // 7. Send confirmation email
        await emailService.sendBookingConfirmation(patient!, doctor, appointment);

        res.status(201).json({ success: true, data: appointment, summary });
    } catch (error: any) {
        console.error("Booking error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const editAppointment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const { date, time } = req.body;

        const appointment = await appointmentService.getAppointmentById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }

        const scheduledTime = new Date(`${date}T${time}`);
        if (isNaN(scheduledTime.getTime())) {
            return res.status(400).json({ success: false, error: "Invalid date or time format" });
        }

        // Prevent double booking
        const existing = await Appointment.findOne({
            _id: { $ne: id },
            doctorId: appointment.doctorId,
            scheduledTime,
            status: { $in: ["booked", "rescheduled"] }
        }).exec();

        if (existing) {
            return res.status(409).json({ success: false, error: "Slot already booked by another patient" });
        }

        appointment.scheduledTime = scheduledTime;
        appointment.status = "rescheduled";
        await (appointment as any).save();

        const doctor = await doctorService.getDoctorById(appointment.doctorId.toString());
        const patient = await Patient.findById(appointment.patientId).exec();

        if (doctor && patient) {
            if (appointment.googleEventId) {
                await calendarService.updateEvent(appointment.googleEventId, appointment, doctor, patient);
            }
            await emailService.sendRescheduleNotification(patient, doctor, appointment);
        }

        res.status(200).json({ success: true, message: "Appointment rescheduled successfully", appointment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const removeAppointment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const appointment = await appointmentService.getAppointmentById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }

        appointment.status = "cancelled";
        await (appointment as any).save();

        const doctor = await doctorService.getDoctorById(appointment.doctorId.toString());
        const patient = await Patient.findById(appointment.patientId).exec();

        if (doctor && patient) {
            if (appointment.googleEventId) {
                await calendarService.deleteEvent(appointment.googleEventId);
            }
            await emailService.sendCancellationNotification(patient, doctor, appointment.scheduledTime, "Cancelled by user");
        }

        res.status(200).json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const submitPostVisitSummary = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params; // appointment ID
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const { doctorNotes, prescription } = req.body;

        if (!doctorNotes || !prescription) {
            return res.status(400).json({ success: false, error: "Clinical notes and prescription are required" });
        }

        const appointment = await appointmentService.getAppointmentById(id);
        if (!appointment) {
            return res.status(404).json({ success: false, error: "Appointment not found" });
        }

        // 1. Call Gemini LLM to generate patient friendly summary
        console.log(`[LLM Post-Visit] Generating patient-friendly summary...`);
        const postVisitSummary = await geminiService.generatePostVisitSummary(doctorNotes);

        // 2. Find or Create Summary record
        let summaryObj = await Summary.findOne({ appointmentId: id }).exec();
        if (!summaryObj) {
            summaryObj = new Summary({ appointmentId: id });
        }

        summaryObj.doctorNotes = doctorNotes;
        summaryObj.prescription = prescription;
        summaryObj.postVisitSummary = postVisitSummary;
        await summaryObj.save();

        // 3. Mark appointment completed
        appointment.status = "completed";
        await (appointment as any).save();

        // 4. Notify patient
        const doctor = await doctorService.getDoctorById(appointment.doctorId.toString());
        const patient = await Patient.findById(appointment.patientId).exec();
        if (patient && doctor) {
            await emailService.sendPostVisitSummary(patient, doctor, postVisitSummary, prescription);
        }

        res.status(200).json({ success: true, message: "Post-visit notes submitted successfully", summary: summaryObj });
    } catch (error: any) {
        console.error("Post-visit submit error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
