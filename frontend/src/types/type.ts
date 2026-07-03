import React from "react";
import { LucideIcon } from "lucide-react";

export interface UserSession {
  email: string;
  name: string;
  token: string;
  profile: string;
  role: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface PatientRequest {
  patient?: Patient;
}

export interface SignUpRequest {
  role: string;
  name: string;
  email: string;
  password: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  password: string;
  detailsComplete: boolean;
  specialty: string;
  qualifications: string;
  address: string;
  phone: string;
  experience: string;
  profileUrl: string;
  availability: string[];
  timeSlots: string[];
  upcomingAppointments: AppointmentDetails[];
  medicalRecords: AppointmentDetails[];
  lat: number;
  lng: number;
  notifications: {
    appointmentReminders: boolean;
    healthTips: boolean;
    promotionalUpdates: boolean;
  };
  googleCalendar?: GoogleCalendar;
}

export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  concern: string;
}

export interface AppointmentDetails {
  id: string;
  type: string;
  doctor: Doctor | null;
  date: string;
  time: string;
  patientInfo: PatientInfo;
  reportUrl?: string;
}

export interface AppointmentType {
  title: string;
  description: string;
  icon: React.ReactElement<LucideIcon>;
}

export interface GoogleCalendar {
  connected: boolean;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date | string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  password?: string;
  isOAuth: boolean;
  detailsComplete: boolean;
  status: string;
  isVerified: boolean;
  verificationToken?: string | undefined;
  profileUrl?: string;
  age: number;
  phone: string;
  isPhoneVerified: boolean;
  address: string;
  upcomingAppointments: AppointmentDetails[];
  medicalRecords: AppointmentDetails[];
  createdAt: Date;
  updatedAt: Date;
  googleCalendar?: GoogleCalendar;
}

export type PatientFormData = Omit<Patient, 'id' | 'name' | 'email' | 'password' | 'profileUrl' | 'isOAuth' | 'status' | 'isVerified' | 'verificationToken' | 'upcomingAppointments' | 'medicalRecords' | 'createdAt' | 'updatedAt'> & {
  profileUrl: string | File | null;
};

export type DoctorFormData = Omit<Doctor, 'id' | 'name' | 'email' | 'password' | 'profileUrl' | 'isOAuth' | 'status' | 'isVerified' | 'verificationToken' | 'upcomingAppointments' | 'medicalRecords' | 'createdAt' | 'updatedAt'> & {
  profileUrl: string | File | null;
};

export type UserType = 'Patient' | 'Doctor';

interface PredictedCondition {
  disease: string;
  probability: "High" | "Moderate" | "Low";
}

export interface Consult {
  symptoms: string;
  description: string;
  specialist: string;
  predictedConditions: PredictedCondition[];
  suggestedActions: string[];
}

// ---------------------------------------------------

export interface Testimonial {
  id: number;
  image: string;
  name: string;
  status: string;
  testimonial: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Value {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: {
    name: string;
    profileUrl: string;
    speciality: string;
  };
  readTime: string;
  createdAt: string;
}

export interface FormDataConsult {
  patientid: string;
  personalInfo: {
    name: string;
    age: string;
    gender: string;
  };
  symptoms: {
    primarySymptom: string;
    duration: string;
    severity: string;
    additionalSymptoms: string;
    image: File | null;
  };
}

export interface Step {
  id: string;
  title: string;
  icon: LucideIcon;
}

export interface RecordDetails extends AppointmentDetails {
  summary?: {
    preVisitSummary?: string;
    doctorNotes?: string;
    prescription?: string;
    postVisitSummary?: string;
    urgencyLevel?: string;
  };
}