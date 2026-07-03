import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { JwtService } from "../service/JwtService";
import { PatientService } from "../service/PatientService";
import { DoctorService } from "../service/DoctorService";
import { AdminService } from "../service/AdminService";
import { AppointmentService } from "../service/AppointmentService";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../middleware/AuthMiddleware";

const authService = new AuthService();
const jwtService = new JwtService();
const patientService = new PatientService();
const doctorService = new DoctorService();
const adminService = new AdminService();
const appointmentService = new AppointmentService();

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const result = await authService.patientSignUp({ name, email, password });
        if (!result) {
            return res.status(400).json({ success: false, error: "Email is already registered" });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            userDetails: {
                email: result.email,
                token: result.token,
                role: "Patient",
                name
            }
        });
    } catch (error: any) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to register" });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        // 1. Try Admin
        const admin = await adminService.getAdminByEmail(email);
        if (admin && admin.password && await bcrypt.compare(password, admin.password)) {
            const token = jwtService.generateToken((admin as any)._id, "Admin");
            return res.status(200).json({
                success: true,
                message: "Logged in successfully as Admin",
                userDetails: {
                    token,
                    email: admin.email,
                    role: "Admin",
                    name: "Administrator",
                    profile: "/images/user-default.png"
                }
            });
        }

        // 2. Try Patient
        const patient = await patientService.getPatientByEmail(email);
        if (patient && patient.password && await bcrypt.compare(password, patient.password)) {
            const token = jwtService.generateToken((patient as any)._id, "Patient");
            const isProfileComplete = Boolean(patient.name && (patient as any).phone);
            return res.status(200).json({
                success: true,
                message: "Logged in successfully as Patient",
                userDetails: {
                    token,
                    email: patient.email,
                    role: "Patient",
                    name: patient.name,
                    profile: (patient as any).profileUrl || "/images/user-default.png",
                    isProfileComplete
                }
            });
        }

        // 3. Try Doctor
        const doctor = await doctorService.getDoctorByEmail(email);
        if (doctor && doctor.password && await bcrypt.compare(password, doctor.password)) {
            const token = jwtService.generateToken((doctor as any)._id, "Doctor");
            const isProfileComplete = Boolean(doctor.name && doctor.specialisation && (doctor as any).phone);
            return res.status(200).json({
                success: true,
                message: "Logged in successfully as Doctor",
                userDetails: {
                    token,
                    email: doctor.email,
                    role: "Doctor",
                    name: doctor.name,
                    profile: "/images/user-default.png",
                    isProfileComplete
                }
            });
        }

        return res.status(401).json({ success: false, error: "Invalid email or password" });
    } catch (error: any) {
        console.error("Signin error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to login" });
    }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }

        const { userId, role } = req.user;

        if (role === "Admin") {
            const admin = await adminService.getAllAdmins();
            const matchedAdmin = admin.find(a => (a as any)._id.toString() === userId);
            if (!matchedAdmin) return res.status(404).json({ success: false, error: "Admin not found" });
            return res.status(200).json({
                success: true,
                user: {
                    id: `ADM_${userId}`,
                    email: matchedAdmin.email,
                    name: "Administrator",
                    role: "Admin"
                }
            });
        }

        if (role === "Patient") {
            const patients = await patientService.getAllPatients();
            const patient = patients.find(p => (p as any)._id.toString() === userId);
            if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });

            // Fetch and format appointments for this patient
            const allAppts = await appointmentService.getAllPopulatedAppointments();
            const myAppts = allAppts.filter(appt => appt.patientId && (appt.patientId as any)._id.toString() === userId);

            const formattedAppts = myAppts.map(appt => {
                const pad = (n: number) => n.toString().padStart(2, '0');
                const d = new Date(appt.scheduledTime);
                const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

                const hours = d.getHours();
                const minutes = d.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                const timeStr = `${pad(displayHours)}:${pad(minutes)} ${ampm}`;

                return {
                    id: (appt as any)._id,
                    type: (appt as any).type || "In-Person Consultation",
                    date: dateStr,
                    time: timeStr,
                    status: appt.status,
                    doctor: appt.doctorId ? {
                        id: (appt.doctorId as any)._id,
                        name: (appt.doctorId as any).name,
                        email: (appt.doctorId as any).email,
                        specialty: (appt.doctorId as any).specialisation,
                        qualifications: (appt.doctorId as any).qualifications || "M.D.",
                        address: (appt.doctorId as any).address || "WellNest Clinic",
                        phone: (appt.doctorId as any).phone || "N/A"
                    } : null,
                    patientInfo: {
                        name: patient.name,
                        email: patient.email,
                        phone: (patient as any).phone || "N/A",
                        age: String((patient as any).age || 30),
                        gender: (patient as any).gender || "Male",
                        address: (patient as any).address || "N/A",
                        concern: "General consultation"
                    }
                };
            });

            const upcomingAppointments = formattedAppts.filter(appt => appt.status === 'booked' || appt.status === 'rescheduled');
            const medicalRecords = formattedAppts.filter(appt => appt.status === 'completed' || appt.status === 'cancelled');

            return res.status(200).json({
                success: true,
                user: {
                    id: `PAT_${userId}`,
                    email: patient.email,
                    name: patient.name,
                    role: "Patient",
                    phone: (patient as any).phone,
                    address: (patient as any).address,
                    age: (patient as any).age,
                    profileUrl: (patient as any).profileUrl,
                    upcomingAppointments,
                    medicalRecords,
                    googleCalendar: patient.googleCalendar
                }
            });
        }

        if (role === "Doctor") {
            const doctors = await doctorService.getAllDoctors();
            const doctor = doctors.find(d => (d as any)._id.toString() === userId);
            if (!doctor) return res.status(404).json({ success: false, error: "Doctor not found" });

            // Fetch and format appointments for this doctor
            const allAppts = await appointmentService.getAllPopulatedAppointments();
            const myAppts = allAppts.filter(appt => appt.doctorId && (appt.doctorId as any)._id.toString() === userId);

            const formattedAppts = myAppts.map(appt => {
                const pad = (n: number) => n.toString().padStart(2, '0');
                const d = new Date(appt.scheduledTime);
                const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

                const hours = d.getHours();
                const minutes = d.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12;
                const timeStr = `${pad(displayHours)}:${pad(minutes)} ${ampm}`;

                return {
                    id: (appt as any)._id,
                    type: (appt as any).type || "In-Person Consultation",
                    date: dateStr,
                    time: timeStr,
                    status: appt.status,
                    doctor: {
                        id: `DOC_${userId}`,
                        name: doctor.name,
                        email: doctor.email,
                        specialty: doctor.specialisation,
                        qualifications: (doctor as any).qualifications || "M.D.",
                        address: (doctor as any).address || "WellNest Clinic",
                        phone: (doctor as any).phone || "N/A"
                    },
                    patientInfo: appt.patientId ? {
                        name: (appt.patientId as any).name,
                        email: (appt.patientId as any).email,
                        phone: (appt.patientId as any).phone || "N/A",
                        age: String((appt.patientId as any).age || 30),
                        gender: (appt.patientId as any).gender || "Male",
                        address: (appt.patientId as any).address || "N/A",
                        concern: "General consultation"
                    } : {
                        name: "Unknown",
                        email: "N/A",
                        phone: "N/A",
                        age: "30",
                        gender: "Male",
                        address: "N/A",
                        concern: "General consultation"
                    }
                };
            });

            const upcomingAppointments = formattedAppts.filter(appt => appt.status === 'booked' || appt.status === 'rescheduled');
            const medicalRecords = formattedAppts.filter(appt => appt.status === 'completed' || appt.status === 'cancelled');

            return res.status(200).json({
                success: true,
                user: {
                    id: `DOC_${userId}`,
                    email: doctor.email,
                    name: doctor.name,
                    role: "Doctor",
                    specialty: doctor.specialisation,
                    qualifications: (doctor as any).qualifications || "M.D. / Specialist",
                    phone: (doctor as any).phone,
                    address: (doctor as any).address,
                    experience: (doctor as any).experience,
                    workingHours: doctor.workingHours,
                    slotDuration: doctor.slotDuration,
                    leaveDays: doctor.leaveDays,
                    upcomingAppointments,
                    medicalRecords,
                    googleCalendar: doctor.googleCalendar
                }
            });
        }

        return res.status(400).json({ success: false, error: "Unknown user role" });
    } catch (error: any) {
        console.error("Auth me error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to retrieve session" });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        if (typeof token !== "string") {
            return res.status(400).send("<h1>Verification failed</h1><p>Invalid verification token format.</p>");
        }
        const verified = await authService.verifyToken(token);
        if (!verified) {
            return res.status(400).send("<h1>Verification failed</h1><p>Invalid or expired verification token.</p>");
        }
        return res.status(200).send("<h1>Verification successful</h1><p>Your email has been verified. You can now log in.</p>");
    } catch (error: any) {
        console.error("Verification error:", error);
        return res.status(500).send("<h1>Verification error</h1><p>An internal error occurred.</p>");
    }
};

// ==========================================
// PATIENT AUTH
// ==========================================

export const patientSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const result = await authService.patientSignUp({ name, email, password });
        if (!result) {
            return res.status(400).json({ success: false, error: "Email is already registered" });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            userDetails: {
                email: result.email,
                token: result.token,
                role: "Patient",
                name
            }
        });
    } catch (error: any) {
        console.error("Patient signup error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to register" });
    }
};

export const patientSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const result = await authService.patientSignIn(email, password);
        if (!result) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        return res.status(200).json({
            success: true,
            message: "Logged in successfully as Patient",
            userDetails: {
                token: result.token,
                email: result.email,
                role: "Patient",
                name: result.name || "Patient",
                profile: result.profileUrl || "/images/user-default.png",
                isProfileComplete: result.isProfileComplete
            }
        });
    } catch (error: any) {
        console.error("Patient signin error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to login" });
    }
};

export const patientGoogleAuth = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: "Authorization code is required" });
        }

        const result = await authService.googleAuth(code, "Patient");
        if (!result) {
            return res.status(400).json({ success: false, error: "Failed to authenticate with Google" });
        }

        return res.status(200).json({
            success: true,
            message: "Logged in successfully via Google",
            userDetails: {
                token: result.token,
                email: result.email,
                role: "Patient",
                name: result.name || "Patient",
                profile: result.profileUrl || "/images/user-default.png",
                isProfileComplete: result.isProfileComplete
            }
        });
    } catch (error: any) {
        console.error("Patient Google OAuth error:", error);
        return res.status(500).json({ success: false, error: error.message || "Google authentication failed" });
    }
};

// ==========================================
// DOCTOR AUTH
// ==========================================

export const doctorSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const result = await authService.doctorSignUp({ name, email, password });
        if (!result) {
            return res.status(400).json({ success: false, error: "Email is already registered" });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email to verify your account.",
            userDetails: {
                email: result.email,
                token: result.token,
                role: "Doctor",
                name
            }
        });
    } catch (error: any) {
        console.error("Doctor signup error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to register" });
    }
};

export const doctorSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const result = await authService.doctorSignIn(email, password);
        if (!result) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        return res.status(200).json({
            success: true,
            message: "Logged in successfully as Doctor",
            userDetails: {
                token: result.token,
                email: result.email,
                role: "Doctor",
                name: result.name || "Doctor",
                profile: "/images/user-default.png",
                isProfileComplete: result.isProfileComplete
            }
        });
    } catch (error: any) {
        console.error("Doctor signin error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to login" });
    }
};

export const doctorGoogleAuth = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, error: "Authorization code is required" });
        }

        const result = await authService.googleAuth(code, "Doctor");
        if (!result) {
            return res.status(400).json({ success: false, error: "Failed to authenticate with Google" });
        }

        return res.status(200).json({
            success: true,
            message: "Logged in successfully via Google",
            userDetails: {
                token: result.token,
                email: result.email,
                role: "Doctor",
                name: result.name || "Doctor",
                profile: "/images/user-default.png",
                isProfileComplete: result.isProfileComplete
            }
        });
    } catch (error: any) {
        console.error("Doctor Google OAuth error:", error);
        return res.status(500).json({ success: false, error: error.message || "Google authentication failed" });
    }
};

// ==========================================
// ADMIN AUTH
// ==========================================

export const adminSignup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const result = await authService.adminSignUp({ name: "Administrator", email, password });
        if (!result) {
            return res.status(400).json({ success: false, error: "Email is already registered as Admin" });
        }

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            userDetails: {
                email: result.email,
                token: result.token,
                role: "Admin",
                name: "Administrator"
            }
        });
    } catch (error: any) {
        console.error("Admin signup error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to register Admin" });
    }
};

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const result = await authService.adminSignIn(email, password);
        if (!result) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        return res.status(200).json({
            success: true,
            message: "Logged in successfully as Admin",
            userDetails: {
                token: result.token,
                email: result.email,
                role: "Admin",
                name: "Administrator",
                profile: "/images/user-default.png",
                isProfileComplete: true
            }
        });
    } catch (error: any) {
        console.error("Admin signin error:", error);
        return res.status(500).json({ success: false, error: error.message || "Failed to login" });
    }
};

export const adminGoogleAuth = async (req: Request, res: Response) => {
    return res.status(400).json({ success: false, error: "Google OAuth is not supported for Administrator role" });
};
