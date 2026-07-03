import { Symptom } from '../model/Symptom';
import { ISymptom } from '../types/Types';

export class SymptomRepository {
    async create(symptomData: Partial<ISymptom>): Promise<ISymptom | null> {
        const newSymptom = new Symptom(symptomData);
        return await newSymptom.save();
    }

    async findById(id: string): Promise<ISymptom | null> {
        return await Symptom.findById(id).exec();
    }

    async updateById(id: string, updateData: any): Promise<ISymptom | null> {
        return await Symptom.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async getAll(): Promise<ISymptom[]> {
        return await Symptom.find().sort({ createdAt: -1 }).exec();
    }

    async deleteById(id: string): Promise<void> {
        await Symptom.findByIdAndDelete(id).exec();
    }
};