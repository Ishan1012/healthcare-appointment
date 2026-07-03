import { Doctor } from '../model/Doctor';
import { IDoctor, IDoctorDocument } from '../types/Types';

export class DoctorRepository {
    async create(doctorData: Partial<IDoctor>): Promise<IDoctorDocument | null> {
        const newDoctor = new Doctor(doctorData);
        return await newDoctor.save();
    }

    async findByEmail(email: string): Promise<IDoctorDocument | null> {
        return await Doctor.findOne({ email }).exec();
    }

    async findById(id: string): Promise<IDoctorDocument | null> {
        return await Doctor.findById(id).exec();
    }

    async updateByEmail(email: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
        return await Doctor.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async updateById(id: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
        return await Doctor.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async getByVerificationToken(verificationToken: string): Promise<IDoctorDocument | null> {
        return await Doctor.findOne({ verificationToken }).select('-password').exec();
    }

    async getAll(): Promise<IDoctor[]> {
        return await Doctor.find().sort({ createdAt: -1 }).exec();
    }

    async delete(id: string): Promise<void> {
        await Doctor.findByIdAndDelete(id).exec();
    }
};