import { Request, Response } from "express";
import { PatientService } from "../service/PatientService";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";

const patientService = new PatientService();

export const updatePatientProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const patientId = req.user?.userId;
        if (!patientId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const updateData = req.body;
        const updated = await patientService.updatePatientById(patientId, updateData);
        res.status(200).json({ success: true, message: "Patient profile updated successfully", patient: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPatients = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const patients = await patientService.getAllPatients();
        res.status(200).json({ success: true, patients });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePatient = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        const updateData = req.body;
        const updated = await patientService.updatePatientById(id, updateData);
        res.status(200).json({ success: true, message: "Patient profile updated by Admin", patient: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePatient = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, error: "Invalid ID parameter" });
        }
        await patientService.removePatient(id);
        res.status(200).json({ success: true, message: "Patient profile deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
