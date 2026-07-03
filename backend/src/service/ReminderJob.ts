import { Summary } from "../model/Summary";
import { Appointment } from "../model/Appointment";
import { Patient } from "../model/Patient";
import { EmailService } from "./EmailService";

const emailService = new EmailService();

export const startReminderJob = () => {
    console.log("[Background Job] Medication reminder job scheduler started.");
    
    // Poll every 1 hour (3600000 ms) - for demo we can make it shorter or just log
    const INTERVAL = 3600000; 

    setInterval(async () => {
        console.log("[Background Job] Scanning prescriptions for medication reminders...");
        try {
            const activeSummaries = await Summary.find({ 
                prescription: { $exists: true, $ne: "" } 
            }).exec();

            for (const summary of activeSummaries) {
                const appointment = await Appointment.findById(summary.appointmentId).exec();
                if (appointment && appointment.status === "completed") {
                    const patient = await Patient.findById(appointment.patientId).exec();
                    if (patient) {
                        console.log(`[Background Job] Sending reminder to ${patient.name} for prescription: ${summary.prescription}`);
                        await emailService.sendMedicationReminder(
                            patient.name,
                            patient.email,
                            summary.prescription || "Take your medication as advised."
                        );
                    }
                }
            }
        } catch (error: any) {
            console.error("[Background Job] Error in medication reminder scanner:", error.message);
        }
    }, INTERVAL);
};
