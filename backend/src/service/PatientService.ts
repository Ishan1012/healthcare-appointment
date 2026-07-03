import { IPatient, IPatientDocument } from "../types/Types";
import { PatientRepository } from "../repository/PatientRepository";

export class PatientService {
    private patientRepository: PatientRepository;

    constructor() {
        this.patientRepository = new PatientRepository();
    }

    async createPatient(patientData: Partial<IPatient>): Promise<IPatientDocument | null> {
        return await this.patientRepository.create(patientData);
    }

    async getPatientByEmail(email: string): Promise<IPatientDocument | null> {
        return await this.patientRepository.findByEmail(email);
    }

    async updatePatient(email: string, updateData: Partial<IPatient>): Promise<IPatient | null> {
        return await this.patientRepository.updateByEmail(email, updateData);
    }

    async updatePatientById(id: string, updateData: Partial<IPatient>): Promise<IPatient | null> {
        return await this.patientRepository.updateById(id, updateData);
    }

    async getByVerificationToken(verificationToken: string): Promise<IPatientDocument | null> {
        return await this.patientRepository.getByVerificationToken(verificationToken);
    }

    async getAllPatients(): Promise<IPatient[]> {
        return await this.patientRepository.getAll();
    }

    async removePatient(id: string): Promise<void> {
        await this.patientRepository.delete(id);
    }
}