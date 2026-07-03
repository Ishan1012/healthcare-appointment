import express from "express";
import {
  getRegisteredDoctors,
  createDoctor,
  updateDoctor,
  getDoctorAppointments,
  getDoctorSlots,
  updateDoctorProfile
} from "../controller/DoctorController";
import { authenticateToken, requireRole } from "../middleware/AuthMiddleware";

const router = express.Router();

router.get("/registered", getRegisteredDoctors);
router.get("/:id/slots", getDoctorSlots);
router.post("/", authenticateToken as any, requireRole(["Admin"]) as any, createDoctor as any);
router.put("/", authenticateToken as any, requireRole(["Doctor"]) as any, updateDoctorProfile as any);
router.put("/:id", authenticateToken as any, requireRole(["Admin"]) as any, updateDoctor as any);
router.get("/appointments", authenticateToken as any, requireRole(["Doctor"]) as any, getDoctorAppointments as any);

export default router;
