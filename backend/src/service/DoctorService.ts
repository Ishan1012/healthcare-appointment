import { IDoctor, IDoctorDocument } from "../types/Types";
import { DoctorRepository } from "../repository/DoctorRepository";

export class DoctorService {
    private doctorRepository: DoctorRepository;

    constructor() {
        this.doctorRepository = new DoctorRepository();
    }

    async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctorDocument | null> {
        return await this.doctorRepository.create(doctorData);
    }

    async getDoctorByEmail(email: string): Promise<IDoctorDocument | null> {
        return await this.doctorRepository.findByEmail(email);
    }

    async getDoctorById(id: string): Promise<IDoctorDocument | null> {
        return await this.doctorRepository.findById(id);
    }

    async updateDoctor(email: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
        return await this.doctorRepository.updateByEmail(email, updateData);
    }

    async updateDoctorById(id: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
        return await this.doctorRepository.updateById(id, updateData);
    }

    async getByVerificationToken(verificationToken: string): Promise<IDoctorDocument | null> {
        return await this.doctorRepository.getByVerificationToken(verificationToken);
    }

    async getAllDoctors(): Promise<IDoctor[]> {
        return await this.doctorRepository.getAll();
    }

    async removeDoctor(id: string): Promise<void> {
        await this.doctorRepository.delete(id);
    }
}