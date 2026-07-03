import mongoose from "mongoose";
import dotenv from 'dotenv';
import { Admin } from "../model/Admin";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            const hashedPassword = await bcrypt.hash("admin@123", 10);
            const defaultAdmin = new Admin({
                email: "admin@wellnest.com",
                password: hashedPassword
            });
            await defaultAdmin.save();
            console.log("Default admin seeded successfully!");
        }
    } catch (err) {
        console.error("Failed to seed default admin:", err);
    }
};

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare';

        await mongoose.connect(uri);
        console.log("MongoDB connected successfully!");
        await seedAdmin();
    } catch (error) {
        console.error("MongoDB connection failed! ", error);
        process.exit(1);
    }
};

export default connectDB;