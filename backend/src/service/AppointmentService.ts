import { IAppointment, IPopulatedAppointment } from "../types/Types";
import { AppointmentRepository } from "../repository/AppointmentRepository";

export class AppointmentService {
    private appointmentRepository: AppointmentRepository;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
    }

    async createAppointment(appointmentData: Partial<IAppointment>): Promise<IAppointment | null> {
        return await this.appointmentRepository.create(appointmentData);
    }

    async getAppointmentById(id: string): Promise<IAppointment | null> {
        return await this.appointmentRepository.findById(id);
    }

    async getPopulatedAppointmentById(id: string): Promise<IPopulatedAppointment | null> {
        return await this.appointmentRepository.findPopulatedById(id);
    }

    async updateAppointment(id: string, updateData: Partial<IAppointment>): Promise<IAppointment | null> {
        return await this.appointmentRepository.updateById(id, updateData);
    }

    async getAllAppointments(): Promise<IAppointment[]> {
        return await this.appointmentRepository.getAll();
    }

    async getAllPopulatedAppointments(): Promise<IPopulatedAppointment[]> {
        return await this.appointmentRepository.getAllPopulated();
    }

    async deleteAppointment(id: string): Promise<void> {
        await this.appointmentRepository.deleteById(id);
    }
}