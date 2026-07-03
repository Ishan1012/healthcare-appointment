import { Appointment } from '../model/Appointment';
import { IAppointment, IPopulatedAppointment } from '../types/Types';

export class AppointmentRepository {
    async create(appointmentData: Partial<IAppointment>): Promise<IAppointment | null> {
        const newAppointment = new Appointment(appointmentData);
        return await newAppointment.save();
    }

    async findById(id: string): Promise<IAppointment | null> {
        return await Appointment.findById(id).exec();
    }

    async findPopulatedById(id: string): Promise<IPopulatedAppointment | null> {
        return await Appointment.findById(id)
            .populate('patientId', '-password')
            .populate('doctorId')
            .lean()
            .exec() as unknown as IPopulatedAppointment; 
    }

    async updateById(id: string, updateData: any): Promise<IAppointment | null> {
        return await Appointment.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async getAll(): Promise<IAppointment[]> {
        return await Appointment.find().sort({ createdAt: -1 }).exec();
    }

    async getAllPopulated(): Promise<IPopulatedAppointment[]> {
        return await Appointment.find()
            .populate('patientId', '-password')
            .populate('doctorId')
            .sort({ createdAt: -1 })
            .lean()
            .exec() as unknown as IPopulatedAppointment[];
    }

    async deleteById(id: string): Promise<void> {
        await Appointment.findByIdAndDelete(id).exec();
    }
};