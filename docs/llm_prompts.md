# LLM Prompts & AI Workflows

WellNest utilizes the **Gemini 1.5 Flash** model via Google's generative language endpoints to power automated clinical summarization, saving doctors time and improving patient communication.

---

## 📋 1. Pre-Visit Symptom Analysis

Executed immediately during the appointment booking process. It evaluates patient-submitted concerns to determine triage urgency, synthesize a chief complaint, and draft initial diagnostic questions for the doctor's review.

### 💬 System Prompt
```text
Analyse these symptoms and return a JSON object with fields: "urgencyLevel" (must be one of "low", "medium", "high", "critical"), "chiefComplaint" (short summary), and "suggestedQuestions" (array of 3 strings). Symptoms: {{symptomsText}}
```

### ⚙️ API Configuration
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Output Mime-Type**: `application/json` (ensures structured parsing compatibility)

### 📥 Expected JSON Response Format
```json
{
  "urgencyLevel": "critical",
  "chiefComplaint": "Severe chest pain accompanied by radiation to left arm.",
  "suggestedQuestions": [
    "Does the pain get worse with deep breathing or physical activity?",
    "Are you experiencing any shortness of breath, dizziness, or sweating?",
    "Do you have a personal or family history of heart disease or hypertension?"
  ]
}
```

### 🛡️ Fallback Triage logic
If `GEMINI_API_KEY` is not configured in `.env`, the system defaults to:
- **Urgency Level**: `medium`
- **Chief Complaint**: Truncated symptom input (first 50 characters)
- **Suggested Questions**: Standard template questions:
  1. *When did these symptoms first appear?*
  2. *Have you noticed any triggers that make the symptoms worse or better?*
  3. *Have you taken any medication or treatments for these symptoms?*

---

## 💊 2. Post-Visit Patient-Friendly Summary

Executed when a doctor submits clinical diagnoses and prescriptions inside the doctor dashboard. It converts dense clinical notation, Latin codes (e.g., *q.d.*, *b.i.d.*), and abbreviations into patient-friendly instructions.

### 💬 System Prompt
```text
Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: {{clinicalNotes}}
```

### ⚙️ API Configuration
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Output Mime-Type**: `text/plain` (markdown/text summary)

### 📥 Example Output Format
```text
### 📝 Your Summary
Dr. Carter evaluated your persistent dry cough and diagnosed it as acute bronchitis. The lungs are clear, but your throat is irritated.

### 💊 Medication Schedule
1. **Amoxicillin (500mg)**
   - Take 1 capsule three times daily for 7 days. Make sure to complete the entire course.
2. **Cough Syrup (Guaifenesin)**
   - Take 10ml every 4-6 hours as needed for coughing.

### 🚶 Next Steps & Tips
- Rest as much as possible and drink warm fluids to soothe your throat.
- Follow up in 7 days if the cough does not improve or worsens.
```

### 🛡️ Fallback Logic
If `GEMINI_API_KEY` is not set:
- Returns a mock post-visit template appending the raw doctor clinical notes.
