import { Request, Response } from 'express';
import { SummaryService } from '../service/SummaryService';

const summaryService: SummaryService = new SummaryService();

export const getSummaries = async (req: Request, res: Response) => {
    try {
        const summarys = await summaryService.getAllSummaries();
        res.status(200).json({ success: true, data: summarys });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch summaries' });
    }
};

export const getSummaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("id parameter not given");
        }
        const summary = await summaryService.getSummaryById(id as string);

        if (!summary) {
            return res.status(404).json({ success: false, message: 'Summary not found' });
        }
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch summarys', error });
    }
};

export const addSummary = async (req: Request, res: Response) => {
    try {
        const newSummary = await summaryService.createSummary(req.body);
        res.status(201).json({ success: true, data: newSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create summary' });
    }
};

export const editSummary = async (req: Request, res: Response) => {
    try {
        const updatedSummary = await summaryService.updateSummary(req.params.id as string, req.body);
        res.status(200).json({ success: true, data: updatedSummary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update summary' + error });
    }
};

export const removeSummary = async (req: Request, res: Response) => {
    try {
        await summaryService.deleteSummary(req.params.id as string);
        res.status(200).json({ success: true, message: 'Summary deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete summary ' });
    }
};
