import { Request, Response, NextFunction } from "express";
import { JwtService } from "../service/JwtService";

const jwtService = new JwtService();

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: "Patient" | "Doctor" | "Admin";
    };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: "Access token required" });
    }

    const payload = jwtService.verifyToken(token);
    if (!payload) {
        return res.status(403).json({ success: false, error: "Invalid or expired token" });
    }

    req.user = {
        userId: payload.userId,
        role: payload.role
    };
    next();
};

export const requireRole = (roles: ("Patient" | "Doctor" | "Admin")[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: "Unauthorized access for this role" });
        }
        next();
    };
};
