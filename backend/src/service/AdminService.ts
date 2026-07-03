import { IAdmin } from "../types/Types";
import { AdminRepository } from "../repository/AdminRepository";

export class AdminService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin | null> {
        return await this.adminRepository.create(adminData);
    }

    async getAdminByEmail(email: string): Promise<IAdmin | null> {
        return await this.adminRepository.findByEmail(email);
    }

    async updateAdmin(email: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
        return await this.adminRepository.updateByEmail(email, updateData);
    }

    async getAllAdmins(): Promise<IAdmin[]> {
        return await this.adminRepository.getAll();
    }
}