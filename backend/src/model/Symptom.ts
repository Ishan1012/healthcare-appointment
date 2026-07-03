import mongoose from "mongoose";
import { ISymptomDocument } from "../types/Types";

const symptomSchema = new mongoose.Schema<ISymptomDocument>({
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'appointment', 
    required: true, 
    unique: true // Enforces the 1:1 relationship
  },
  symptomText: { type: String, required: true } // Raw input from patient
}, { timestamps: true });

export const Symptom = mongoose.model<ISymptomDocument>('symptom', symptomSchema);