import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class GeminiService {
    private apiKey: string;
    private apiUrl: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || "";
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    }

    async generatePreVisitSummary(symptomsText: string): Promise<{ urgencyLevel: "low" | "medium" | "high" | "critical", chiefComplaint: string, suggestedQuestions: string[] }> {
        if (!this.apiKey) {
            console.warn("GEMINI_API_KEY is not set. Using fallback values.");
            return this.fallbackPreVisit(symptomsText);
        }
        
        try {
            const prompt = `Analyse these symptoms and return a JSON object with fields: "urgencyLevel" (must be one of "low", "medium", "high", "critical"), "chiefComplaint" (short summary), and "suggestedQuestions" (array of 3 strings). Symptoms: ${symptomsText}`;
            
            const response = await axios.post(this.apiUrl, {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });

            const responseText = response.data.candidates[0].content.parts[0].text;
            const parsed = JSON.parse(responseText.trim());
            return {
                urgencyLevel: parsed.urgencyLevel || "medium",
                chiefComplaint: parsed.chiefComplaint || "Symptom check",
                suggestedQuestions: parsed.suggestedQuestions || ["What makes it worse?", "How long has this been happening?", "Any other symptoms?"]
            };
        } catch (error) {
            console.error("Gemini API error during pre-visit analysis:", error);
            return this.fallbackPreVisit(symptomsText);
        }
    }

    async generatePostVisitSummary(clinicalNotes: string): Promise<string> {
        if (!this.apiKey) {
            console.warn("GEMINI_API_KEY is not set. Using fallback post-visit summary.");
            return `Post-Visit Summary (Fallback):\nNotes: ${clinicalNotes}\nMedication: Take as prescribed by the doctor.\nFollow-up: Contact clinic if symptoms persist.`;
        }

        try {
            const prompt = `Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: ${clinicalNotes}`;
            const response = await axios.post(this.apiUrl, {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            });
            return response.data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error("Gemini API error during post-visit summary:", error);
            return `Patient Friendly Summary:\n${clinicalNotes}\n(Please follow the doctor's instructions for medications and scheduling.)`;
        }
    }

    private fallbackPreVisit(symptoms: string): { urgencyLevel: "low" | "medium" | "high" | "critical", chiefComplaint: string, suggestedQuestions: string[] } {
        return {
            urgencyLevel: "medium",
            chiefComplaint: symptoms.length > 50 ? symptoms.substring(0, 50) + "..." : symptoms,
            suggestedQuestions: [
                "When did these symptoms first appear?",
                "Have you noticed any triggers that make the symptoms worse or better?",
                "Have you taken any medication or treatments for these symptoms?"
            ]
        };
    }
}
