import express from 'express';
import { 
    getAppointments, 
    addAppointment, 
    editAppointment, 
    removeAppointment, 
    getAppointmentById,
    submitPostVisitSummary
} from '../controller/AppointmentController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

const router = express.Router();

router.get('/', authenticateToken as any, getAppointments as any);
router.get('/:id', authenticateToken as any, getAppointmentById as any);
router.post('/', authenticateToken as any, addAppointment as any);
router.put('/:id', authenticateToken as any, editAppointment as any);
router.delete('/:id', authenticateToken as any, removeAppointment as any);
router.post('/:id/summary', authenticateToken as any, requireRole(['Doctor']) as any, submitPostVisitSummary as any);

export default router;