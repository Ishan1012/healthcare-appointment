import express from "express";
import {
  signup,
  signin,
  me,
  verify,
  patientSignup,
  patientSignin,
  patientGoogleAuth,
  doctorSignup,
  doctorSignin,
  doctorGoogleAuth,
  adminSignup,
  adminSignin,
  adminGoogleAuth
} from "../controller/AuthController";
import { authenticateToken } from "../middleware/AuthMiddleware";

const router = express.Router();

// General / Legacy routes
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authenticateToken as any, me as any);
router.get("/verify/:token", verify);

// Patient routes
router.post("/patient/signup", patientSignup);
router.post("/patient/signin", patientSignin);
router.post("/patient/google", patientGoogleAuth);

// Doctor routes
router.post("/doctor/signup", doctorSignup);
router.post("/doctor/signin", doctorSignin);
router.post("/doctor/google", doctorGoogleAuth);

// Admin routes
router.post("/admin/signup", adminSignup);
router.post("/admin/signin", adminSignin);
router.post("/admin/google", adminGoogleAuth);

export default router;
