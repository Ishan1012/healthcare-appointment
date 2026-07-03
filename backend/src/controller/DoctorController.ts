import { Request, Response } from "express";
import { DoctorService } from "../service/DoctorService";
import { Appointment } from "../model/Appointment";
import { Patient } from "../model/Patient";
import { EmailService } from "../service/EmailService";
import { CalendarService } from "../service/CalendarService";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";

const doctorService = new DoctorService();
const emailService = new EmailService();
const calendarService = new CalendarService();

export const getRegisteredDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        // Return only relevant public fields
        const formatted = doctors.map(doc => ({
            id: (doc as any)._id,
            name: doc.name,
            email: doc.email,
            specialty: doc.specialisation || "General Practitioner",
            qualifications: (doc as any).qualifications || "M.D.",
            address: (doc as any).address || "WellNest Clinic",
            phone: (doc as any).phone || "N/A",
            experience: (doc as any).experience || "5",
            workingHours: doc.workingHours || { start: "09:00", end: "17:00" },
            slotDuration: doc.slotDuration || 30,
            leaveDays: doc.leaveDays || [],
            profileUrl: (doc as any).profileUrl || "/images/user-default.png",
            timeSlots: generateSlots(doc.workingHours?.start || "09:00", doc.workingHours?.end || "17:00", doc.slotDuration || 30)
        }));

        res.status(200).json({ success: true, doctors: formatted });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createDoctor = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, email, password, specialisation, workingHours, slotDuration, phone, address, experience, profileUrl, qualifications } = req.body;
        const adminId = req.user?.userId;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Name, email and password are required" });
        }

        const existing = await doctorService.getDoctorByEmail(email);
        if (existing) {
            return res.status(200).json({ success: true, message: "Doctor already exists", doctor: existing });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const created = await doctorService.createDoctor({
            adminId: adminId as any,
            name,
            email,
            password: hashedPassword,
            specialisation: specialisation || "General Medicine",
            workingHours: workingHours || { start: "09:00", end: "17:00" },
            slotDuration: slotDuration || 30,
            leaveDays: [],
            phone,
            address,
            experience,
            profileUrl,
            qualifications
        });

        res.status(201).json({ success: true, message: "Doctor profile created successfully", doctor: created });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateDoctor = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const updateData = req.body;

        const doctor = await doctorService.getDoctorById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, error: "Doctor not found" });
        }

        // Check if leaveDays are updated
        if (updateData.leaveDays) {
            const oldLeaveStrings = (doctor.leaveDays || []).map(d => new Date(d).toDateString());
            const newLeaveDates = updateData.leaveDays.map((d: string) => new Date(d));
            
            // Find newly added leave days
            const addedLeaves = newLeaveDates.filter((d: Date) => !oldLeaveStrings.includes(d.toDateString()));

            for (const leaveDate of addedLeaves) {
                const startOfDay = new Date(leaveDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(leaveDate);
                endOfDay.setHours(23, 59, 59, 999);

                // Find all booked appointments for this doctor on this day
                const conflictingAppointments = await Appointment.find({
                    doctorId: doctor._id,
                    scheduledTime: { $gte: startOfDay, $lte: endOfDay },
                    status: { $in: ["booked", "rescheduled"] }
                }).exec();

                for (const appt of conflictingAppointments) {
                    appt.status = "cancelled";
                    await appt.save();

                    const patient = await Patient.findById(appt.patientId).exec();
                    if (patient) {
                        // Notify patient & doctor
                        await emailService.sendCancellationNotification(
                            patient,
                            doctor,
                            appt.scheduledTime,
                            "Doctor is marked on leave for this date."
                        );
                    }
                    if (appt.googleEventId) {
                        await calendarService.deleteEvent(appt.googleEventId);
                    }
                }
            }
        }

        const updated = await doctorService.updateDoctorById(id, updateData);
        res.status(200).json({ success: true, message: "Doctor profile updated", doctor: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getDoctorAppointments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const doctorId = req.user?.userId;
        if (!doctorId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const appointments = await Appointment.find({ doctorId: doctorId as any })
            .populate("patientId", "-password")
            .sort({ scheduledTime: 1 })
            .exec();

        res.status(200).json({ success: true, appointments });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getDoctorSlots = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date } = req.query; // YYYY-MM-DD

        if (typeof id !== "string" || typeof date !== "string") {
            return res.status(400).json({ success: false, error: "Doctor ID and date are required" });
        }

        const doctor = await doctorService.getDoctorById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, error: "Doctor not found" });
        }

        // Check if doctor is on leave
        const checkDate = new Date(date);
        const isOnLeave = (doctor.leaveDays || []).some(leaveDate => new Date(leaveDate).toDateString() === checkDate.toDateString());
        if (isOnLeave) {
            return res.status(200).json({ success: true, slots: [], message: "Doctor is on leave on this date" });
        }

        const allSlots = generateSlots(doctor.workingHours?.start || "09:00", doctor.workingHours?.end || "17:00", doctor.slotDuration || 30);
        
        // Find existing bookings
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctorId: doctor._id,
            scheduledTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["booked", "rescheduled"] }
        }).exec();

        const bookedTimes = bookedAppointments.map(appt => {
            const time = new Date(appt.scheduledTime);
            return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
        });

        // Map slots to availability status
        const slotsWithAvailability = allSlots.map(time => ({
            time,
            available: !bookedTimes.includes(time)
        }));

        res.status(200).json({ success: true, slots: slotsWithAvailability });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper to generate slots
function generateSlots(start: string, end: string, duration: number): string[] {
    const slots: string[] = [];
    let current = parseTime(start);
    const endTime = parseTime(end);

    while (current < endTime) {
        slots.push(formatTime(current));
        current += duration;
    }
    return slots;
}

function parseTime(timeStr: string): number {
    const parts = timeStr.split(":");
    const hours = Number(parts[0] || 0);
    const minutes = Number(parts[1] || 0);
    return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export const updateDoctorProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const doctorId = req.user?.userId;
        if (!doctorId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const updateData = req.body;
        const updated = await doctorService.updateDoctorById(doctorId, updateData);
        res.status(200).json({ success: true, message: "Doctor profile updated", doctor: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
