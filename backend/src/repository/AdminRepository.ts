import { Admin } from '../model/Admin';
import { IAdmin } from '../types/Types';

export class AdminRepository {
    async create(adminData: Partial<IAdmin>): Promise<IAdmin | null> {
        const newAdmin = new Admin(adminData);
        return await newAdmin.save();
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        return await Admin.findOne({ email }).exec();
    }

    async updateByEmail(email: string, updateData: Partial<IAdmin>): Promise<IAdmin | null> {
        return await Admin.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }
    
    async getAll(): Promise<IAdmin[]> {
        return await Admin.find().sort({ createdAt: -1 }).exec();
    }
};