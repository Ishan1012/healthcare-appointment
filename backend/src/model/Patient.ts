import mongoose from "mongoose";
import { IPatientDocument } from "../types/Types";

const patientSchema = new mongoose.Schema<IPatientDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String, required: false },
  age: { type: Number, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  gender: { type: String, required: false },
  profileUrl: { type: String, required: false },
  googleCalendar: {
    connected: { type: Boolean, default: false },
    refreshToken: { type: String, required: false },
    accessToken: { type: String, required: false },
    tokenExpiry: { type: Date, required: false }
  }
}, { timestamps: true });

export const Patient = mongoose.model<IPatientDocument>('patient', patientSchema);