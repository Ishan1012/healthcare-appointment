import mongoose from "mongoose";
import { ISummaryDocument } from "../types/Types";

const summarySchema = new mongoose.Schema<ISummaryDocument>({
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'appointment', 
    required: true, 
    unique: true
  },
  preVisitSummary: { type: String }, // LLM generated for doctor
  urgencyLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  doctorNotes: { type: String },
  prescription: { type: String },    // Used to trigger medication reminders
  postVisitSummary: { type: String } // LLM generated for patient
}, { timestamps: true });

export const Summary = mongoose.model<ISummaryDocument>('summary', summarySchema);