# API Documentation

The WellNest backend exposes a RESTful API on `http://localhost:5000/api/v1`. All JSON payloads require the `Content-Type: application/json` header. Protected endpoints require the `Authorization: Bearer <jwt_token>` header.

---

## 🔑 Authentication Endpoints

### 1. Sign Up (Patient)
- **Endpoint**: `POST /auth/signup`
- **Description**: Registers a new Patient account.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Registration successful! Please check your email to verify your account.",
    "userDetails": {
      "email": "jane@example.com",
      "token": "jwt_session_token_here",
      "role": "Patient",
      "name": "Jane Doe"
    }
  }
  ```

### 2. Sign In
- **Endpoint**: `POST /auth/signin`
- **Description**: Authenticates users (Patients, Doctors, or Admins) and returns a session JWT.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully as Patient",
    "userDetails": {
      "token": "jwt_session_token_here",
      "email": "jane@example.com",
      "role": "Patient",
      "name": "Jane Doe",
      "profile": "/images/user-default.png",
      "isProfileComplete": true
    }
  }
  ```

### 3. Verify Account
- **Endpoint**: `GET /auth/verify?token=<token>&role=<role>`
- **Description**: Verifies a newly registered user using a link emailed to them.

### 4. Fetch Current User Profile
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "PAT_60d5ec4b1234567890abcdef",
      "email": "jane@example.com",
      "name": "Jane Doe",
      "role": "Patient",
      "phone": "1234567890",
      "address": "123 Main St",
      "age": 28,
      "profileUrl": "/uploads/jane.png",
      "upcomingAppointments": [],
      "medicalRecords": [],
      "googleCalendar": {
        "connected": false
      }
    }
  }
  ```

---

## 👩‍⚕️ Doctor Endpoints

### 1. Fetch All Doctors
- **Endpoint**: `GET /doctors`
- **Description**: Retrieves a list of all doctors, their specialisations, and coordinates (for mapping).

### 2. Update Doctor Details
- **Endpoint**: `PUT /doctors/update`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Description**: Updates profile details for the logged-in doctor.
- **Request Body**:
  ```json
  {
    "specialisation": "Cardiologist",
    "workingHours": { "start": "09:00", "end": "17:00" },
    "slotDuration": 30,
    "phone": "9876543210",
    "address": "456 Oak Ave",
    "experience": "10 Years",
    "qualifications": "MD, DM Card"
  }
  ```

### 3. Declare Leave
- **Endpoint**: `PUT /doctors/leave`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "leaveDays": ["2026-07-10", "2026-07-11"]
  }
  ```

---

## 📅 Appointment Endpoints

### 1. Book Appointment
- **Endpoint**: `POST /appointment/book`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "doctorId": "60d5ec4b1234567890abcdef",
    "date": "2026-07-05",
    "time": "10:00",
    "type": "In-Person Consultation",
    "patientInfo": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "1234567890",
      "age": "28",
      "address": "123 Main St",
      "concern": "High fever and persistent dry cough for the past 3 days."
    }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Appointment booked successfully!",
    "appointment": {
      "_id": "60d5fccb1234567890abcdef",
      "patientId": "60d5ec4b1234567890abcdef",
      "doctorId": "60d5ec4b1234567890abcdef",
      "scheduledTime": "2026-07-05T10:00:00.000Z",
      "status": "booked",
      "type": "In-Person Consultation"
    }
  }
  ```

### 2. Reschedule Appointment
- **Endpoint**: `PUT /appointment/reschedule`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "appointmentId": "60d5fccb1234567890abcdef",
    "date": "2026-07-06",
    "time": "11:30"
  }
  ```

### 3. Cancel Appointment
- **Endpoint**: `PUT /appointment/cancel`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "appointmentId": "60d5fccb1234567890abcdef",
    "reason": "Personal conflicts"
  }
  ```

---

## 🗓️ Google Calendar Integration

### 1. OAuth Authentication URL
- **Endpoint**: `GET /calendar/auth?userId=<id>`
- **Description**: Generates and redirects to the Google OAuth2 consent screen URL for calendar integration.

### 2. OAuth Callback
- **Endpoint**: `GET /calendar/callback`
- **Description**: Google OAuth callback URL. Receives authorization code, requests tokens, and saves them to the patient/doctor database model.

### 3. Sync Calendar Appointment
- **Endpoint**: `POST /calendar/sync-event`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**:
  ```json
  {
    "appointmentId": "60d5fccb1234567890abcdef"
  }
  ```
- **Description**: Automatically synchronizes/posts a booked appointment as an event on the user's Google Calendar.
