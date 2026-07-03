import mongoose from "mongoose";
import { IDoctorDocument } from "../types/Types";

const doctorSchema = new mongoose.Schema<IDoctorDocument>({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  verificationToken: { type: String, required: false },
  specialisation: { type: String, required: false },
  workingHours: {
    start: { type: String, required: false }, // e.g., "09:00"
    end: { type: String, required: false }    // e.g., "17:00"
  },
  slotDuration: { type: Number, required: false }, // In minutes (e.g., 30)
  leaveDays: [{ type: Date }], // Array of dates the doctor is unavailable
  phone: { type: String, required: false },
  address: { type: String, required: false },
  experience: { type: String, required: false },
  profileUrl: { type: String, required: false },
  qualifications: { type: String, required: false },
  googleCalendar: {
    connected: { type: Boolean, default: false },
    refreshToken: { type: String, required: false },
    accessToken: { type: String, required: false },
    tokenExpiry: { type: Date, required: false }
  }
}, { timestamps: true });

export const Doctor = mongoose.model<IDoctorDocument>('doctor', doctorSchema);