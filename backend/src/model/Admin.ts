import mongoose from "mongoose";
import { IAdminDocument } from "../types/Types";

const adminSchema = new mongoose.Schema<IAdminDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleCalendar: {
    connected: { type: Boolean, default: false },
    refreshToken: { type: String, required: false },
    accessToken: { type: String, required: false },
    tokenExpiry: { type: Date, required: false }
  }
}, { timestamps: true });

export const Admin = mongoose.model<IAdminDocument>('admin', adminSchema);