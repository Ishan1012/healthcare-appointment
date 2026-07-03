import { Document, Types } from 'mongoose';

// Helper Interfaces

export type AppointmentStatus = 'booked' | 'rescheduled' | 'cancelled' | 'completed';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface IWorkingHours {
  start: string; // e.g., "09:00"
  end: string;   // e.g., "17:00"
}

export interface IGoogleCalendar {
  connected: boolean;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date;
}

// Entity Interfaces

export interface IAdmin {
  email: string;
  password?: string; // Optional for security when returning to frontend
  googleCalendar?: IGoogleCalendar;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatient {
  email: string;
  name: string;
  password?: string; // Optional for security
  verificationToken?: string | undefined;
  age?: number;
  phone?: string;
  address?: string;
  gender?: string;
  profileUrl?: string;
  googleCalendar?: IGoogleCalendar;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDoctor {
  adminId?: Types.ObjectId;
  email: string;
  name: string;
  password?: string;
  verificationToken?: string | undefined;
  specialisation: string;
  workingHours: IWorkingHours;
  slotDuration: number;
  leaveDays: Date[];
  phone?: string;
  address?: string;
  experience?: string;
  profileUrl?: string;
  qualifications?: string;
  googleCalendar?: IGoogleCalendar;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointment {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduledTime: Date;
  status: AppointmentStatus;
  type?: string;
  googleEventId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISummary {
  appointmentId: Types.ObjectId;
  preVisitSummary?: string;
  urgencyLevel?: UrgencyLevel;
  doctorNotes?: string;
  prescription?: string;
  postVisitSummary?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISymptom {
  appointmentId: Types.ObjectId;
  symptomText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Request and Response Interfaces

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: 'Patient' | 'Doctor' | 'Admin';
  isProfileComplete: boolean;
  name?: string;
  profileUrl?: string | undefined;
}

export interface VerificationResponse {
  token: string;
  email: string;
  message?: string;
}

// Document Interfaces

export interface IAdminDocument extends IAdmin, Document { }
export interface IPatientDocument extends IPatient, Document { }
export interface IDoctorDocument extends IDoctor, Document { }
export interface IAppointmentDocument extends IAppointment, Document { }
export interface ISummaryDocument extends ISummary, Document { }
export interface ISymptomDocument extends ISymptom, Document { }

// Populated Interfaces

export interface IPopulatedAppointment extends Omit<IAppointment, 'patientId' | 'doctorId'> {
  _id: Types.ObjectId;
  patientId: Omit<IPatient, 'password'>;
  doctorId: IDoctor;
}

export interface IPopulatedSummary extends Omit<ISummary, 'appointmentId'> {
  _id: Types.ObjectId;
  appointmentId: IPopulatedAppointment | IAppointment;
}

// API Endpoints

const BASE_BACKEND_URL = process.env.BASE_BACKEND_URL || "http://localhost:5000/api"

export const API_ENDPOINTS = {
  baseUrl: BASE_BACKEND_URL,
  auth: {
    verificationUrl: (token: string) => `${BASE_BACKEND_URL}/auth/verify/${token}`
  }
}