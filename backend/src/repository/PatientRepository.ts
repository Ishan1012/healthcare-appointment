import { Patient } from '../model/Patient';
import { IPatient, IPatientDocument } from '../types/Types';

export class PatientRepository {
    async create(patientData: Partial<IPatient>): Promise<IPatientDocument | null> {
        const newPatient = new Patient(patientData);
        return await newPatient.save();
    }

    async findByEmail(email: string): Promise<IPatientDocument | null> {
        return await Patient.findOne({ email }).exec();
    }

    async updateByEmail(email: string, updateData: Partial<IPatient>): Promise<IPatient | null> {
        return await Patient.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async updateById(id: string, updateData: Partial<IPatient>): Promise<IPatient | null> {
        return await Patient.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async getByVerificationToken(verificationToken: string): Promise<IPatientDocument | null> {
        return await Patient.findOne({ verificationToken }).select('-password').exec();
    }

    async getAll(): Promise<IPatient[]> {
        return await Patient.find().sort({ createdAt: -1 }).exec();
    }

    async delete(id: string): Promise<void> {
        await Patient.findByIdAndDelete(id).exec();
    }
};