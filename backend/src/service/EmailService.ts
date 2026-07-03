import transporter from "../config/Nodemailer";
import { IAppointment, IDoctor, IPatient } from "../types/Types";

export class EmailService {
    private async sendEmail(to: string, subject: string, htmlContent: string) {
        if (!process.env.EMAIL_ID || !process.env.EMAIL_PASS) {
            console.log(`\n======================================\n[EMAIL NOTIFICATION (MOCK MODE)]\nTo: ${to}\nSubject: ${subject}\nContent:\n${htmlContent.replace(/<[^>]*>/g, '')}\n======================================\n`);
            return;
        }

        try {
            await transporter.sendMail({
                from: `"WellNest Healthcare" <${process.env.EMAIL_ID}>`,
                to,
                subject,
                html: htmlContent
            });
            console.log(`[Email Sent] Successfully notified ${to} regarding "${subject}"`);
        } catch (error: any) {
            console.error(`[Email Failed] Could not send email to ${to}:`, error.message);
            // DO NOT THROW: handle notification failures gracefully
        }
    }

    async sendBookingConfirmation(patient: IPatient, doctor: IDoctor, appointment: IAppointment) {
        const patientHtml = `
            <h2>Appointment Confirmed!</h2>
            <p>Dear ${patient.name},</p>
            <p>Your appointment with <strong>${doctor.specialisation}</strong> has been successfully booked.</p>
            <ul>
                <li><strong>Doctor:</strong> Dr. ${doctor.name}</li>
                <li><strong>Date:</strong> ${new Date(appointment.scheduledTime).toLocaleDateString()}</li>
                <li><strong>Time:</strong> ${new Date(appointment.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
            </ul>
            <p>Thank you for choosing WellNest!</p>
        `;
        const doctorHtml = `
            <h2>New Appointment Scheduled</h2>
            <p>Dear Dr. ${doctor.name},</p>
            <p>A patient has booked a slot with you.</p>
            <ul>
                <li><strong>Patient Name:</strong> ${patient.name}</li>
                <li><strong>Date:</strong> ${new Date(appointment.scheduledTime).toLocaleDateString()}</li>
                <li><strong>Time:</strong> ${new Date(appointment.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
            </ul>
            <p>Please log in to your dashboard to review the patient's symptoms and the AI pre-visit summary.</p>
        `;

        await this.sendEmail(patient.email, "Your WellNest Appointment Confirmation", patientHtml);
        await this.sendEmail(doctor.email, "New WellNest Appointment Booked", doctorHtml);
    }

    async sendRescheduleNotification(patient: any, doctor: any, appointment: any) {
        const patientHtml = `
            <h2>Appointment Rescheduled</h2>
            <p>Dear ${patient.name},</p>
            <p>Your appointment with Dr. ${doctor.name} has been rescheduled.</p>
            <ul>
                <li><strong>New Date:</strong> ${new Date(appointment.scheduledTime).toLocaleDateString()}</li>
                <li><strong>New Time:</strong> ${new Date(appointment.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
            </ul>
        `;
        const doctorHtml = `
            <h2>Appointment Rescheduled</h2>
            <p>Dear Dr. ${doctor.name},</p>
            <p>Your appointment with patient ${patient.name} has been rescheduled to <strong>${new Date(appointment.scheduledTime).toLocaleString()}</strong>.</p>
        `;

        await this.sendEmail(patient.email, "Appointment Rescheduled - WellNest", patientHtml);
        await this.sendEmail(doctor.email, "Appointment Rescheduled - WellNest", doctorHtml);
    }

    async sendCancellationNotification(patient: any, doctor: any, date: Date, reason: string) {
        const patientHtml = `
            <h2>Appointment Cancelled</h2>
            <p>Dear ${patient.name},</p>
            <p>We regret to inform you that your appointment with Dr. ${doctor.name} scheduled for <strong>${new Date(date).toLocaleString()}</strong> has been cancelled.</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>Please log in to book another time slot.</p>
        `;
        const doctorHtml = `
            <h2>Appointment Cancelled</h2>
            <p>Dear Dr. ${doctor.name},</p>
            <p>The appointment with patient ${patient.name} on <strong>${new Date(date).toLocaleString()}</strong> has been cancelled.</p>
            <p><strong>Reason:</strong> ${reason}</p>
        `;

        await this.sendEmail(patient.email, "Appointment Cancelled - WellNest", patientHtml);
        await this.sendEmail(doctor.email, "Appointment Cancelled - WellNest", doctorHtml);
    }

    async sendPostVisitSummary(patient: any, doctor: any, postVisitSummary: string, prescription: string) {
        const html = `
            <h2>Your WellNest Visit Summary & Prescription</h2>
            <p>Dear ${patient.name},</p>
            <p>Dr. ${doctor.name} has submitted your clinical notes and prescriptions. Below is your personalized post-visit summary generated by our AI health assistant:</p>
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px;">
                <strong>Patient-Friendly Summary:</strong>
                <p style="white-space: pre-line;">${postVisitSummary}</p>
            </div>
            <h3>Prescription details:</h3>
            <p style="white-space: pre-line; background: #f8fafc; padding: 10px; border-radius: 4px;">${prescription}</p>
            <p>Take care of yourself! We will send you medication reminders according to your schedule.</p>
        `;
        await this.sendEmail(patient.email, "Post-Visit Summary & Prescription - WellNest", html);
    }

    async sendMedicationReminder(patientName: string, patientEmail: string, medicationText: string) {
        const html = `
            <h2>Medication Reminder</h2>
            <p>Dear ${patientName},</p>
            <p>This is a reminder from WellNest to take your medication as prescribed by your doctor:</p>
            <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 15px 0; border-radius: 4px;">
                <strong>Instructions:</strong>
                <p>${medicationText}</p>
            </div>
            <p>Please do not reply to this email.</p>
        `;
        await this.sendEmail(patientEmail, "Medication Reminder - WellNest", html);
    }
}
