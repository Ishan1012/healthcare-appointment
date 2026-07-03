import { ISummary, IPopulatedSummary } from "../types/Types";
import { SummaryRepository } from "../repository/SummaryRepository";

export class SummaryService {
    private summaryRepository: SummaryRepository;

    constructor() {
        this.summaryRepository = new SummaryRepository();
    }

    async createSummary(summaryData: Partial<ISummary>): Promise<ISummary | null> {
        return await this.summaryRepository.create(summaryData);
    }

    async getSummaryById(id: string): Promise<ISummary | null> {
        return await this.summaryRepository.findById(id);
    }

    async getPopulatedSummaryById(id: string): Promise<IPopulatedSummary | null> {
        return await this.summaryRepository.findPopulatedById(id);
    }

    async updateSummary(id: string, updateData: Partial<ISummary>): Promise<ISummary | null> {
        return await this.summaryRepository.updateById(id, updateData);
    }

    async getAllSummaries(): Promise<ISummary[]> {
        return await this.summaryRepository.getAll();
    }

    async getAllPopulatedSummarys(): Promise<IPopulatedSummary[]> {
        return await this.summaryRepository.getAllPopulated();
    }

    async deleteSummary(id: string): Promise<void> {
        await this.summaryRepository.deleteById(id);
    }
}