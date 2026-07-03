# WellNest Healthcare - Appointment Management System

Welcome to the **WellNest Healthcare Appointment Management System**. This repository is a full-stack application that enables patients to book appointments with doctors, get AI-powered pre-visit symptom analysis and post-visit summaries, and synchronize scheduled appointments with Google Calendar.

---

## 🚀 Running the Project (Quick Start)

If you are a new user running this project, you do not need to manually configure separate terminals to start the server. We have provided batch script command files (`.cmd`) inside the `scripts` folder to streamline setup.

**Please run the scripts in the [scripts](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts) folder one by one:**

1. **Step 1: Install Dependencies**
   Run the [install-dependencies.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/install-depandencies.cmd) file to download and install all backend and frontend dependencies automatically:
   ```cmd
   .\scripts\install-depandencies.cmd
   ```
2. **Step 2: Start the Backend Server**
   Run the [start-backend.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/start-backend.cmd) file. This starts the backend node server (usually running on port `5000`):
   ```cmd
   .\scripts\start-backend.cmd
   ```
3. **Step 3: Start the Frontend Application**
   Run the [start-frontend.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/start-frontend.cmd) file. This starts the Next.js development server (usually running on port `3000`):
   ```cmd
   .\scripts\start-frontend.cmd
   ```

---

## 📁 Project Documentation Directory

All assignment deliverables and technical documentations are located within this `docs` folder. Please refer to them below:

* 🔧 **[Setup & Installation Guide](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/docs/setup_guide.md)**
  Detailed instructions on setting up environment configurations (`.env`), Google Calendar Integration, OAuth credentials, and running the application.
* 📝 **[System Design Write-up](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/docs/system_design.md)**
  A system architecture overview (max 800 words) detailing double-booking prevention, doctor leave conflicts, slot hold mechanisms, and notification failure handlings.
* 🔗 **[API Documentation](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/docs/api_docs.md)**
  Complete reference for all REST endpoints across Authentication, Patient, Doctor, Appointment, and Google Calendar services.
* 🗄️ **[Database Schema Design](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/docs/db_schema.md)**
  Detailed view of MongoDB collection schemas (Mongoose models) for Patients, Doctors, Admins, Appointments, Symptoms, and Summaries.
* 🤖 **[LLM Prompts and AI Flow](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/docs/llm_prompts.md)**
  Detailed prompts, response schemas, and logic flow of the Gemini AI integration for pre-visit symptom analysis and post-visit patient summaries.

---

## 🌍 Live Deployment

**https://wellnestdaffodil.netlify.app/**

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons, Sonner (Toasts)
- **Backend**: Node.js, Express, TypeScript, Mongoose (MongoDB)
- **Integrations**: Gemini API (Google AI), Google Calendar API (Google OAuth2), Nodemailer (Email notifications)
