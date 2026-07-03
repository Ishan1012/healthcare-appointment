import { Response } from "express";
import { Doctor } from "../model/Doctor";
import { Patient } from "../model/Patient";
import { Appointment } from "../model/Appointment";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const docCount = await Doctor.countDocuments();
        const patientCount = await Patient.countDocuments();
        const apptCount = await Appointment.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                doctors: docCount,
                patients: patientCount,
                appointments: apptCount
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllAppointments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const appointments = await Appointment.find()
            .populate("patientId", "-password")
            .populate("doctorId", "-password")
            .sort({ scheduledTime: -1 })
            .exec();

        res.status(200).json({ success: true, appointments });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
