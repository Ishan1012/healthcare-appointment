import { ISymptom } from "../types/Types";
import { SymptomRepository } from "../repository/SymptomRepository";

export class SymptomService {
    private symptomRepository: SymptomRepository;

    constructor() {
        this.symptomRepository = new SymptomRepository();
    }

    async createSymptom(symptomData: Partial<ISymptom>): Promise<ISymptom | null> {
        return await this.symptomRepository.create(symptomData);
    }

    async getSymptomById(id: string): Promise<ISymptom | null> {
        return await this.symptomRepository.findById(id);
    }

    async updateSymptom(id: string, updateData: Partial<ISymptom>): Promise<ISymptom | null> {
        return await this.symptomRepository.updateById(id, updateData);
    }

    async getAllSymptoms(): Promise<ISymptom[]> {
        return await this.symptomRepository.getAll();
    }

    async deleteSymptom(id: string): Promise<void> {
        await this.symptomRepository.deleteById(id);
    }
}