import express from "express";
import { getStats, getAllAppointments } from "../controller/AdminController";
import { authenticateToken, requireRole } from "../middleware/AuthMiddleware";

const router = express.Router();

router.get("/stats", authenticateToken as any, requireRole(["Admin"]) as any, getStats as any);
router.get("/appointments", authenticateToken as any, requireRole(["Admin"]) as any, getAllAppointments as any);

export default router;
