import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import doctorRoutes from "./routes/DoctorRoutes";
import patientRoutes from "./routes/PatientRoutes";
import adminRoutes from "./routes/AdminRoutes";
import appointmentRoutes from "./routes/AppointmentRoutes";
import summaryRoutes from "./routes/SummaryRoutes";
import symptomRoutes from "./routes/SymptomRoutes";
import calendarRoutes from "./routes/CalendarRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).send("Healthcare API is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/summary", summaryRoutes);
app.use("/api/v1/symptom", symptomRoutes);
app.use("/api/v1/calendar", calendarRoutes);

export default app;