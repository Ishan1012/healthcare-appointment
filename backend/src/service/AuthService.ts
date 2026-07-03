import bcrypt from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import { PatientService } from "./PatientService";
import { DoctorService } from "./DoctorService";
import { AdminService } from "./AdminService";
import { JwtService } from "./JwtService";
import { Types } from "mongoose";
import { API_ENDPOINTS, AuthResponse, SignUpRequest, VerificationResponse } from "../types/Types";
import transporter from "../config/Nodemailer";
import { Message } from "../utils/Message";

export class AuthService {
    private patientService: PatientService;
    private doctorService: DoctorService;
    private adminService: AdminService;
    private jwtService: JwtService;

    constructor() {
        this.patientService = new PatientService();
        this.doctorService = new DoctorService();
        this.adminService = new AdminService();
        this.jwtService = new JwtService();
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async sendVerificationEmail(email: string, token: string) {
        const verificationUrl = API_ENDPOINTS.auth.verificationUrl(token);
        await transporter.sendMail({
            from: `no reply <${process.env.EMAIL_ID}>`,
            to: email,
            subject: 'Verify Your Email',
            html: Message(verificationUrl),
        });
    }

    async patientSignUp(req: SignUpRequest): Promise<VerificationResponse | null> {
        const existing = await this.patientService.getPatientByEmail(req.email);
        if (existing) {
            const token = this.jwtService.generateToken(existing._id as Types.ObjectId, "Patient");
            return { token, email: existing.email };
        }

        const hashedPassword = await this.hashPassword(req.password as string);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const createdPatient = await this.patientService.createPatient({
            name: req.name,
            email: req.email,
            password: hashedPassword,
            verificationToken
        });

        if (!createdPatient) throw new Error("Unable to create new Patient!");

        const token = this.jwtService.generateToken(createdPatient._id as Types.ObjectId, "Patient");
        await this.sendVerificationEmail(createdPatient.email, verificationToken);

        return { token, email: createdPatient.email };
    }

    async patientSignIn(email: string, password: string): Promise<AuthResponse | null> {
        const patient = await this.patientService.getPatientByEmail(email);
        if (!patient || !(await bcrypt.compare(password, patient.password as string))) {
            return null;
        }

        const isProfileComplete = Boolean(
            patient.name && patient.name.trim().length > 0
        );

        const token = this.jwtService.generateToken(patient._id as Types.ObjectId, "Patient");
        return {
            token,
            userId: patient._id.toString(),
            email: patient.email,
            role: "Patient",
            isProfileComplete,
            name: patient.name,
            profileUrl: patient.profileUrl
        };
    }

    // async patientSignInByGoogle(code: string): Promise<AuthResponse | null> {
    //     // Fetch google user data...
    //     // Check if patient exists, if not, create them...
    //     // Return token and data with role "Patient"
    // }

    async doctorSignUp(req: SignUpRequest): Promise<VerificationResponse | null> {
        if (await this.doctorService.getDoctorByEmail(req.email)) return null;

        const hashedPassword = await this.hashPassword(req.password as string);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const createdDoctor = await this.doctorService.createDoctor({
            name: req.name,
            email: req.email,
            password: hashedPassword,
            verificationToken,
        });

        if (!createdDoctor) throw new Error("Unable to create new Doctor!");

        const token = this.jwtService.generateToken(createdDoctor._id as Types.ObjectId, "Doctor");
        await this.sendVerificationEmail(createdDoctor.email, verificationToken);

        return { token, email: createdDoctor.email };
    }

    async doctorSignIn(email: string, password: string): Promise<AuthResponse | null> {
        const doctor = await this.doctorService.getDoctorByEmail(email);
        if (!doctor || !(await bcrypt.compare(password, doctor.password as string))) {
            return null;
        }

        const isProfileComplete = Boolean(
            doctor.name && doctor.name.trim().length > 0 &&
            doctor.specialisation && doctor.specialisation.trim().length > 0
        );

        const token = this.jwtService.generateToken(doctor._id as Types.ObjectId, "Doctor");
        return {
            token,
            userId: doctor._id.toString(),
            email: doctor.email,
            role: "Doctor",
            isProfileComplete,
            name: doctor.name,
            profileUrl: doctor.profileUrl
        };
    }

    async exchangeGoogleCodeForTokens(code: string): Promise<{ email: string; name: string; picture?: string } | null> {
        try {
            const client_id = process.env.GOOGLE_CLIENT_ID;
            const client_secret = process.env.GOOGLE_CLIENT_SECRET;

            if (!client_id || !client_secret) {
                console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET env variables.");
                throw new Error("Google authentication is not fully configured on the server.");
            }

            const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
                code,
                client_id,
                client_secret,
                redirect_uri: "postmessage",
                grant_type: "authorization_code",
            });

            const { access_token } = tokenResponse.data;
            if (!access_token) {
                throw new Error("Failed to retrieve access token from Google.");
            }

            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            const { email, name, picture } = userInfoResponse.data;
            if (!email) {
                throw new Error("Failed to retrieve user email from Google.");
            }

            return { email, name, picture };
        } catch (error: any) {
            console.error("Error in exchangeGoogleCodeForTokens:", error.response?.data || error.message);
            throw error;
        }
    }

    async googleAuth(code: string, role: 'Patient' | 'Doctor' | 'Admin'): Promise<AuthResponse | null> {
        const profile = await this.exchangeGoogleCodeForTokens(code);
        if (!profile) return null;

        const { email, name, picture } = profile;

        if (role === "Admin") {
            throw new Error("Google OAuth is not supported for Administrator role.");
        }

        if (role === "Patient") {
            const isDoctor = await this.doctorService.getDoctorByEmail(email);
            if (isDoctor) {
                throw new Error("This email is registered as a Doctor. Please log in as a Doctor.");
            }

            let patient = await this.patientService.getPatientByEmail(email);
            if (!patient) {
                patient = await this.patientService.createPatient({
                    email,
                    name: name || email.split('@')[0] || "User",
                    password: await this.hashPassword(crypto.randomBytes(16).toString('hex')),
                    profileUrl: picture || "/images/user-default.png"
                });
            }
            if (!patient) return null;
            const token = this.jwtService.generateToken(patient._id as Types.ObjectId, "Patient");
            const isProfileComplete = Boolean(patient.name && (patient as any).phone);
            return {
                token,
                userId: patient._id.toString(),
                email: patient.email,
                role: "Patient",
                isProfileComplete,
                name: patient.name,
                profileUrl: patient.profileUrl
            };
        }

        if (role === "Doctor") {
            const isPatient = await this.patientService.getPatientByEmail(email);
            if (isPatient) {
                throw new Error("This email is registered as a Patient. Please log in as a Patient.");
            }

            let doctor = await this.doctorService.getDoctorByEmail(email);
            if (!doctor) {
                throw new Error("Doctor profile not found in database. Please ask the administrator to register you.");
            }
            const token = this.jwtService.generateToken(doctor._id as Types.ObjectId, "Doctor");
            const isProfileComplete = Boolean(doctor.name && doctor.specialisation && (doctor as any).phone);
            return {
                token,
                userId: doctor._id.toString(),
                email: doctor.email,
                role: "Doctor",
                isProfileComplete,
                name: doctor.name,
                profileUrl: doctor.profileUrl
            };
        }

        return null;
    }

    async adminSignUp(req: SignUpRequest): Promise<AuthResponse | null> {
        if (await this.adminService.getAdminByEmail(req.email)) return null;

        const hashedPassword = await this.hashPassword(req.password as string);
        const createdAdmin = await this.adminService.createAdmin({
            email: req.email,
            password: hashedPassword
        });

        if (!createdAdmin) throw new Error("Unable to create new Admin!");

        const token = this.jwtService.generateToken((createdAdmin as any)._id as Types.ObjectId, "Admin");
        return {
            token,
            userId: (createdAdmin as any)._id.toString(),
            email: createdAdmin.email,
            role: "Admin",
            isProfileComplete: true
        };
    }

    async adminSignIn(email: string, password: string): Promise<AuthResponse | null> {
        const admin = await this.adminService.getAdminByEmail(email);
        if (!admin || !(await bcrypt.compare(password, admin.password as string))) {
            return null;
        }

        const token = this.jwtService.generateToken((admin as any)._id as Types.ObjectId, "Admin");
        return {
            token,
            userId: (admin as any)._id.toString(),
            email: admin.email,
            role: "Admin",
            isProfileComplete: true
        };
    }


    async verifyToken(token: string): Promise<boolean | null> {
        const doctor = await this.doctorService.getByVerificationToken(token);

        if (!doctor) {
            const patient = await this.patientService.getByVerificationToken(token);

            if (!patient) {
                return false;
            }

            patient.verificationToken = undefined;
            await patient.save();

            return true;
        } else {
            doctor.verificationToken = undefined;
            await doctor.save();

            return true;
        }
    }
}