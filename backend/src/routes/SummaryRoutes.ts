import express from 'express';
import { getSummaries, addSummary, editSummary, removeSummary, getSummaryById } from '../controller/SummaryController';

const router = express.Router();

router.get('/', getSummaries);
router.get('/:id', getSummaryById);
router.post('/', addSummary);
router.put('/:id', editSummary);
router.delete('/:id', removeSummary);

export default router;