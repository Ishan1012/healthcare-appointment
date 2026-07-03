import express from "express";
import { updatePatientProfile, getPatients, updatePatient, deletePatient } from "../controller/PatientController";
import { authenticateToken, requireRole } from "../middleware/AuthMiddleware";

const router = express.Router();

// Patient self-update profile
router.put("/", authenticateToken as any, requireRole(["Patient"]) as any, updatePatientProfile as any);

// Admin-only management endpoints
router.get("/", authenticateToken as any, requireRole(["Admin"]) as any, getPatients as any);
router.put("/:id", authenticateToken as any, requireRole(["Admin"]) as any, updatePatient as any);
router.delete("/:id", authenticateToken as any, requireRole(["Admin"]) as any, deletePatient as any);

export default router;
