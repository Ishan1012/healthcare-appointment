import { Request, Response } from 'express';
import { SymptomService } from '../service/SymptomService';

const symptomService: SymptomService = new SymptomService();

export const getSymptoms = async (req: Request, res: Response) => {
    try {
        const symptoms = await symptomService.getAllSymptoms();
        res.status(200).json({ success: true, data: symptoms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch symptoms' });
    }
};

export const getSymptomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error("id parameter not given");
        }
        const symptom = await symptomService.getSymptomById(id as string);

        if (!symptom) {
            return res.status(404).json({ success: false, message: 'Symptom not found' });
        }
        res.status(200).json({ success: true, data: symptom });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch symptoms', error });
    }
};

export const addSymptom = async (req: Request, res: Response) => {
    try {
        const newSymptom = await symptomService.createSymptom(req.body);
        res.status(201).json({ success: true, data: newSymptom });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create symptom' });
    }
};

export const editSymptom = async (req: Request, res: Response) => {
    try {
        const updatedSymptom = await symptomService.updateSymptom(req.params.id as string, req.body);
        res.status(200).json({ success: true, data: updatedSymptom });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update symptom' + error });
    }
};

export const removeSymptom = async (req: Request, res: Response) => {
    try {
        await symptomService.deleteSymptom(req.params.id as string);
        res.status(200).json({ success: true, message: 'Symptom deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete symptom ' });
    }
};
