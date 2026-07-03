import { Summary } from '../model/Summary';
import { ISummary, IPopulatedSummary } from '../types/Types';

export class SummaryRepository {
    async create(summaryData: Partial<ISummary>): Promise<ISummary | null> {
        const newSummary = new Summary(summaryData);
        return await newSummary.save();
    }

    async findById(id: string): Promise<ISummary | null> {
        return await Summary.findById(id).exec();
    }

    async findPopulatedById(id: string): Promise<IPopulatedSummary | null> {
        return await Summary.findById(id)
            .populate('appointmentId')
            .lean()
            .exec() as IPopulatedSummary | null; 
    }

    async updateById(id: string, updateData: any): Promise<ISummary | null> {
        return await Summary.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async getAll(): Promise<ISummary[]> {
        return await Summary.find().sort({ createdAt: -1 }).exec();
    }

    async getAllPopulated(): Promise<IPopulatedSummary[]> {
        return await Summary.find()
            .populate('appointmentId')
            .sort({ createdAt: -1 })
            .lean()
            .exec() as unknown as IPopulatedSummary[];
    }

    async deleteById(id: string): Promise<void> {
        await Summary.findByIdAndDelete(id).exec();
    }
};