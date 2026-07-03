import mongoose from "mongoose";
import { IAppointmentDocument } from "../types/Types";
import "./Patient";
import "./Doctor";

const appointmentSchema = new mongoose.Schema<IAppointmentDocument>({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  scheduledTime: { type: Date, required: true },
  type: { type: String, required: false, default: 'In-Person Consultation' },
  status: { 
    type: String, 
    enum: ['booked', 'rescheduled', 'cancelled', 'completed'], 
    default: 'booked'
  },
  googleEventId: { type: String, required: false }
}, { timestamps: true });

export const Appointment = mongoose.model<IAppointmentDocument>('appointment', appointmentSchema);