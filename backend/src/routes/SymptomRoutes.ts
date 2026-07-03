import express from 'express';
import { getSymptoms, addSymptom, editSymptom, removeSymptom, getSymptomById } from '../controller/SymptomController';

const router = express.Router();

router.get('/', getSymptoms);
router.get('/:id', getSymptomById);
router.post('/', addSymptom);
router.put('/:id', editSymptom);
router.delete('/:id', removeSymptom);

export default router;