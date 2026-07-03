# Setup & Installation Guide

This guide will help you configure and run the WellNest Healthcare Appointment System from scratch.

---

## 💻 Running the Application with Scripts

A new user can run the project using the preconfigured command script (`.cmd`) files in the [scripts](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts) folder one by one:

1. **Step 1: Install Dependencies**
   Run the [install-dependencies.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/install-depandencies.cmd) file:
   ```cmd
   .\scripts\install-depandencies.cmd
   ```
2. **Step 2: Start the Backend Server**
   Run the [start-backend.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/start-backend.cmd) file:
   ```cmd
   .\scripts\start-backend.cmd
   ```
3. **Step 3: Start the Frontend Application**
   Run the [start-frontend.cmd](file:///E:/Class%20Notes/important%20projects/daffodil%20software/healthcare-appointment/scripts/start-frontend.cmd) file:
   ```cmd
   .\scripts\start-frontend.cmd
   ```

---

## ⚙️ Environment Variables Configuration

You will need to create a `.env` file in the root of the `backend` folder and a `.env.local` file in the root of the `frontend` folder. Below are the template configurations.

### 🔌 Backend Environment variables (`backend/.env`)

```ini
# Application configuration
PORT=5000
BASE_BACKEND_URL=http://localhost:5000/api

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/healthcare

# JWT Secret Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_TIMEOUT=1d

# Gemini AI API Configuration (for pre/post-visit summaries)
GEMINI_API_KEY=your_gemini_api_key_here

# Nodemailer Email Configuration (SMTP)
# Leave blank to run Nodemailer in "Mock Mode" (prints email HTML output to console logs)
EMAIL_ID=your_smtp_email@gmail.com
EMAIL_PASS=your_smtp_app_password

# Google API Credentials (for Google Calendar Integration)
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/calendar/callback
```

### 🖥️ Frontend Environment variables (`frontend/.env.local`)

```ini
# Backend URI Endpoint
NEXT_PUBLIC_BACKEND_URI=http://localhost:5000/api/v1

# Google Client ID (Must match the one in backend configuration for OAuth consistency)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

---

## 📅 Google Calendar & OAuth Setup Steps

To synchronize appointments with Google Calendar, you must configure a Google Cloud Platform (GCP) project and obtain OAuth credentials:

### 1. Create a GCP Project
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown list and click **New Project**. Name it `WellNest Healthcare` and click **Create**.

### 2. Enable the Google Calendar API
1. In the left-side navigation menu, go to **APIs & Services** > **Library**.
2. Search for `Google Calendar API`.
3. Click on the API and click **Enable**.

### 3. Configure the OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** user type and click **Create**.
3. Fill in the app registration details:
   - **App name**: `WellNest Healthcare`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click **Save and Continue**.
5. **Scopes**: Click **Add or Remove Scopes**. Search for and select the following scope:
   - `.../auth/calendar` (Read, write, edit, and permanently delete all the calendars you can access using Google Calendar).
6. **Test users**: Since the app runs in Testing mode, you must add the Google accounts you want to test with. Add your personal Google account.

### 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** and select **OAuth client ID**.
3. Select **Web application** as the application type.
4. Set the name to `WellNest App`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (Frontend URL)
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:5000/api/v1/calendar/callback` (Backend OAuth callback redirect URI)
7. Click **Create**. Copy the **Client ID** and **Client Secret** generated and paste them into your backend `.env` file and frontend `.env.local` file.
