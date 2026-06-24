# PainCare Assistant — System Architecture Document

## Project Summary

**PainCare Assistant** is a full-stack web application for a pain management clinic. It allows patients to log daily pain reports, manage medication reminders, and interact with an AI-powered chatbot. Doctors get a real-time dashboard that aggregates patient data, displays high-pain alerts, and supports writing clinical notes.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Structure](#3-frontend-structure)
4. [Backend Structure](#4-backend-structure)
5. [MongoDB Collections & Schemas](#5-mongodb-collections--schemas)
6. [Authentication Flow](#6-authentication-flow)
7. [Chatbot Flow](#7-chatbot-flow)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [Data Flow: React → Express → MongoDB](#9-data-flow-react--express--mongodb)
10. [File-by-File Reference](#10-file-by-file-reference)
11. [Security Analysis](#11-security-analysis)

---

## 1. System Overview

```
┌──────────────────────┐        HTTP/JSON        ┌─────────────────────────┐
│   React Frontend     │  ──────────────────────▶ │   Express Backend       │
│   (Vite, port 5173)  │  ◀──────────────────────  │   (Node.js, port 5000)  │
└──────────────────────┘                           └─────────────┬───────────┘
                                                                 │ Mongoose ODM
                                                   ┌─────────────▼───────────┐
                                                   │   MongoDB               │
                                                   │   (localhost:27017)     │
                                                   │   DB: paincare_assistant│
                                                   └─────────────────────────┘
                                                                 │
                                                   ┌─────────────▼───────────┐
                                                   │   Google Gemini API     │
                                                   │   (gemini-2.5-flash)    │
                                                   └─────────────────────────┘
```

**Three-tier architecture**: React (presentation) → Express (business logic) → MongoDB (persistence)  
**External integration**: Google Gemini API for AI chatbot responses

---

## 2. Technology Stack

| Layer | Technology | Version | Role |
|---|---|---|---|
| Frontend Framework | React | 19.2.6 | Component-based UI |
| Frontend Build Tool | Vite | 8.0.12 | Dev server + bundler |
| Styling | Tailwind CSS | 4.3.0 | Utility-first CSS |
| Backend Framework | Express | 5.2.1 | HTTP REST API |
| Runtime | Node.js | LTS | Server runtime |
| ODM | Mongoose | 9.7.1 | MongoDB object modeling |
| Database | MongoDB | Local | Document storage |
| AI Integration | Google Gemini | gemini-2.5-flash | Chatbot responses |
| Security | Helmet | 8.2.0 | HTTP security headers |
| CORS | cors | 2.8.6 | Cross-origin requests |
| Logging | Morgan | 1.11.0 | HTTP request logs |
| Rate Limiting | express-rate-limit | 8.5.2 | Request throttling |

---

## 3. Frontend Structure

### 3.1 Directory Layout

```
paincare-assistant/
├── index.html                        # Single HTML shell
├── vite.config.js                    # Vite + Tailwind config
├── package.json                      # Frontend dependencies
└── src/
    ├── main.jsx                      # React entry point
    ├── App.jsx                       # Root router + auth state
    ├── index.css                     # Tailwind CSS directives
    ├── components/
    │   ├── auth/
    │   │   ├── Login.jsx             # Login form
    │   │   └── Register.jsx          # Patient registration form
    │   ├── patient/
    │   │   └── PatientHome.jsx       # Patient dashboard shell
    │   ├── doctor/
    │   │   └── DoctorHome.jsx        # Doctor dashboard shell
    │   ├── painReport/
    │   │   └── DailyPainReport.jsx   # Pain logging form
    │   ├── medication/
    │   │   ├── MedicationReminder.jsx       # Medication manager
    │   │   └── MedicationReminderCard.jsx   # Single medication card
    │   ├── chatbot/
    │   │   └── PainAssistantChatbot.jsx     # AI chat interface
    │   ├── trends/
    │   │   ├── PainTrends.jsx        # Statistics + chart
    │   │   └── TrendBarChart.jsx     # Bar chart component
    │   ├── doctorDashboard/
    │   │   ├── DoctorDashboard.jsx         # Main doctor view
    │   │   ├── DoctorStatsCards.jsx        # KPI cards
    │   │   ├── AbnormalPainAlerts.jsx      # High-pain alerts
    │   │   ├── PatientTable.jsx            # Patient list table
    │   │   ├── PatientClinicalSummary.jsx  # Priority analysis
    │   │   └── DoctorNotesPanel.jsx        # Clinical notes UI
    │   └── common/
    │       └── Header.jsx            # Navigation header
    └── services/
        ├── authService.js            # Login / register API calls
        ├── painReportService.js      # Pain report API + local logic
        ├── medicationService.js      # Medication CRUD API calls
        ├── chatbotService.js         # Chatbot API call
        ├── doctorService.js          # Doctor dashboard API + aggregation
        ├── doctorNotesService.js     # Doctor notes API calls
        └── trendsService.js          # Local statistics utilities
```

### 3.2 Component Tree

```
App.jsx
│
├── [NOT authenticated]
│   ├── Login.jsx
│   └── Register.jsx
│
├── [role === "patient"]
│   └── PatientHome.jsx
│       ├── Header.jsx (patient nav)
│       ├── DailyPainReport.jsx
│       ├── MedicationReminder.jsx
│       │   └── MedicationReminderCard.jsx (×N)
│       ├── PainAssistantChatbot.jsx
│       └── PainTrends.jsx
│           └── TrendBarChart.jsx
│
└── [role === "doctor"]
    └── DoctorHome.jsx
        ├── Header.jsx (doctor nav)
        └── DoctorDashboard.jsx
            ├── DoctorStatsCards.jsx
            ├── AbnormalPainAlerts.jsx
            ├── PatientTable.jsx
            ├── PatientClinicalSummary.jsx
            └── DoctorNotesPanel.jsx
```

### 3.3 State Management

There is no global state library (no Redux, no Zustand). State is managed at two levels:

**App-level state** (`App.jsx`):
- `currentUser` — the logged-in user object, null if not authenticated
- `authMode` — `"login"` or `"register"`, controls which auth form is shown

**Component-level state** — each component owns its own local state via `useState` and `useEffect` for fetching data on mount.

### 3.4 API Communication Pattern

All API calls go through service files in `src/services/`. Every service uses the native `fetch()` API. Base URL is hardcoded as `http://localhost:5000`.

```javascript
// Pattern used in every service
const response = await fetch(`http://localhost:5000/api/...`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const data = await response.json();
```

---

## 4. Backend Structure

### 4.1 Directory Layout

```
server/
├── package.json              # Backend dependencies
├── .env                      # Environment variables (secret)
└── src/
    ├── index.js              # Server entry point (Express app)
    ├── config/
    │   └── db.js             # MongoDB connection setup
    ├── models/
    │   ├── User.js           # users collection schema
    │   ├── PainReport.js     # painreports collection schema
    │   ├── DoctorNote.js     # doctornotes collection schema
    │   └── Medication.js     # medications collection schema
    └── routes/
        ├── users.route.js        # POST /register, POST /login, GET /
        ├── painReports.route.js  # CRUD for pain reports
        ├── doctorNotes.route.js  # CRUD for doctor notes
        ├── medications.route.js  # CRUD for medications
        └── chatbot.route.js      # POST /message → Gemini API
```

### 4.2 Express Server Setup (`server/src/index.js`)

The server initializes in this order:

1. Load `.env` via `dotenv`
2. Connect to MongoDB via `connectDB()`
3. Mount middleware stack:
   - `helmet()` — security headers
   - `morgan('dev')` — HTTP logging
   - `cors()` — allow cross-origin from React dev server
   - `express.json()` — parse JSON bodies
   - Cache-Control headers — prevent browser caching
   - `rateLimit()` — 100 requests per 60 seconds per IP
4. Mount route handlers
5. `app.listen(5000)`

### 4.3 Middleware Stack (Order Matters)

```
Incoming Request
      │
      ▼
  helmet()         — Adds X-Frame-Options, CSP, etc.
      │
  morgan('dev')    — Logs: GET /api/users 200 12ms
      │
  cors()           — Allows http://localhost:5173
      │
  express.json()   — Parses body to req.body
      │
  cacheControl     — Sets Cache-Control: no-store
      │
  rateLimit()      — Blocks if > 100 req/min/IP
      │
  Route Handlers   — Business logic
      │
      ▼
  Response JSON
```

---

## 5. MongoDB Collections & Schemas

**Database name**: `paincare_assistant`

### 5.1 `users` Collection

```javascript
// server/src/models/User.js
{
  username:   String  — unique, required, trimmed (login key)
  password:   String  — required (stored plain-text — see Security)
  role:       String  — enum: ["patient", "doctor"]
  name:       String  — required, trimmed (display name)
  age:        Number  — optional
  diagnosis:  String  — optional, default: ""
  physician:  String  — optional, default: ""
  createdAt:  Date    — auto (Mongoose timestamps)
  updatedAt:  Date    — auto
}
```

**Indexes**: `username` (unique)  
**Relationships**: Referenced by username in all other collections

### 5.2 `painreports` Collection

```javascript
// server/src/models/PainReport.js
{
  patientUsername:  String  — required, foreign key → users.username
  painLevel:        Number  — required, 0–10 scale
  location:         String  — required (e.g., "Lower back")
  painType:         String  — required, enum: [Burning, Pressing, Stabbing, Sharp, Dull]
  duration:         String  — required (e.g., "45 minutes")
  medicationTaken:  String  — default: "No" ("Yes" or "No")
  notes:            String  — optional, default: ""
  createdAt:        Date    — auto
  updatedAt:        Date    — auto
}
```

**Query patterns**: Filtered by `patientUsername`, sorted by `createdAt` descending

### 5.3 `doctornotes` Collection

```javascript
// server/src/models/DoctorNote.js
{
  patientUsername:  String  — required, foreign key → users.username
  doctorUsername:   String  — required, foreign key → users.username
  note:             String  — required, clinical text
  createdAt:        Date    — auto
  updatedAt:        Date    — auto
}
```

### 5.4 `medications` Collection

```javascript
// server/src/models/Medication.js
{
  patientUsername:  String   — required, foreign key → users.username
  medicationName:   String   — required (e.g., "Ibuprofen")
  dose:             String   — required (e.g., "500mg")
  time:             String   — required, HH:MM format (e.g., "08:00")
  notes:            String   — optional, default: ""
  taken:            Boolean  — default: false
  createdAt:        Date     — auto
  updatedAt:        Date     — auto
}
```

**Query patterns**: Filtered by `patientUsername`, sorted by `time` ascending

### 5.5 Collection Relationships Diagram

```
users (username: "patient1")
    │
    ├──▶ painreports (patientUsername: "patient1")  [1→N]
    │
    ├──▶ medications (patientUsername: "patient1")  [1→N]
    │
    └──▶ doctornotes (patientUsername: "patient1")  [1→N]
              ▲
              │
         doctornotes (doctorUsername: "doctor1")    [M→N via username strings]
```

Note: There are no MongoDB `$ref` foreign keys. Relationships are maintained via matching username strings. MongoDB does not enforce referential integrity.

---

## 6. Authentication Flow

### 6.1 Login Flow

```
User enters username + password
          │
          ▼
Login.jsx calls loginUser(username, password)
          │
          ▼
authService.js: POST /api/users/login
  body: { username, password }
          │
          ▼
users.route.js:
  1. User.findOne({ username })
  2. if not found → 401 "Invalid credentials"
  3. if password doesn't match → 401 "Invalid credentials"
  4. if match → return user object (password field excluded)
          │
          ▼
App.jsx: handleLogin(user) → setCurrentUser(user)
          │
          ▼
App.jsx conditional rendering:
  user.role === "patient" → <PatientHome user={currentUser} />
  user.role === "doctor"  → <DoctorHome user={currentUser} />
```

### 6.2 Registration Flow

```
User fills register form (name, username, password, confirm, age, diagnosis, physician)
          │
Client-side validation:
  - All required fields filled?
  - Age between 1–120?
  - password === confirmPassword?
          │
          ▼
Register.jsx calls registerPatient(patientData)
          │
          ▼
authService.js: POST /api/users/register
  body: { username, password, role: "patient", name, age, diagnosis, physician }
          │
          ▼
users.route.js:
  1. User.findOne({ username }) — check uniqueness
  2. if exists → 400 "Username already taken"
  3. new User(data).save()
  4. return user object (password excluded)
          │
          ▼
App.jsx: handleRegister(user) → setCurrentUser(user)
```

### 6.3 Logout Flow

```
User clicks "Logout" button
          │
          ▼
PatientHome/DoctorHome calls onLogout()
          │
          ▼
App.jsx: handleLogout()
  setCurrentUser(null)
  setAuthMode("login")
          │
          ▼
App renders Login component
```

### 6.4 Authentication Limitations

- **No JWT tokens**: Authentication state lives only in React's in-memory state (`currentUser`). Refreshing the browser logs the user out.
- **No session cookies**: Server is stateless — it does not track who is logged in.
- **No password hashing**: Passwords stored and compared as plain text.
- **No route protection**: Backend routes do not verify that the caller is authenticated before returning data.

---

## 7. Chatbot Flow

### 7.1 Request Flow

```
User types message in PainAssistantChatbot.jsx
          │
          ▼
Component builds patientContext object:
{
  username, name, age, diagnosis, physician,
  latestPainLevel, latestPainLocation,
  latestPainType, latestPainDuration, medicationTaken
}
(populated from the latest pain report fetched on component mount)
          │
          ▼
chatbotService.js: POST /api/chatbot/message
  body: { message, patientContext }
          │
          ▼
chatbot.route.js receives request
          │
          ├── [GEMINI_API_KEY present?]
          │         │
          │         ▼
          │   Build system prompt with:
          │   - Clinic name, assistant name
          │   - Patient name, age, diagnosis, physician
          │   - Latest pain data (level, location, type, duration, medication)
          │   - Safety rules:
          │       * Don't diagnose
          │       * Don't recommend medication changes
          │       * If pain >= 8, escalate to medical staff
          │   - Temperature: 0.4, maxOutputTokens: 220
          │         │
          │         ▼
          │   POST to Gemini API:
          │   https://generativelanguage.googleapis.com/v1beta/
          │   models/gemini-2.5-flash:generateContent?key=GEMINI_API_KEY
          │         │
          │         ▼
          │   Extract reply text from response
          │   return { success: true, reply, source: "gemini" }
          │
          └── [No API key / Gemini error]
                    │
                    ▼
              Fallback logic (keyword matching):
              - pain >= 8 → emergency guidance
              - "burning" in message → burning pain advice
              - "stabbing"/"sharp" → sharp pain advice
              - "medication"/"medicine" → medication guidance
              - default → general recommendation
              return { success: true, reply, source: "fallback" }
          │
          ▼
PainAssistantChatbot.jsx:
  Appends { sender: "bot", text: reply, source } to messages[]
  Renders with left-aligned white bubble
```

### 7.2 Quick Reply Buttons

The chatbot shows 4 preset messages that bypass typing:

| Button Label | Message Sent |
|---|---|
| I have high pain today | "I have high pain today" |
| I feel burning pain | "I feel burning pain" |
| What should I write in my pain report? | "What should I write in my pain report?" |
| How can I track my medication? | "How can I track my medication?" |

---

## 8. API Endpoints Reference

Base URL: `http://localhost:5000/api`

### 8.1 User Endpoints

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/users/register` | Register new patient | `{ username, password, role, name, age?, diagnosis?, physician? }` | `{ success, user }` |
| POST | `/users/login` | Authenticate user | `{ username, password }` | `{ success, user }` |
| GET | `/users` | Get all users | — | `[...users]` (no passwords) |

### 8.2 Pain Report Endpoints

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/pain-reports` | Save a pain report | `{ patientUsername, painLevel, location, painType, duration, medicationTaken?, notes? }` | Saved report object |
| GET | `/pain-reports` | Get all reports | — | `[...reports]` sorted desc |
| GET | `/pain-reports/:username` | Get reports for patient | — | `[...reports]` sorted desc |

### 8.3 Doctor Notes Endpoints

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/doctor-notes` | Add clinical note | `{ patientUsername, doctorUsername, note }` | Saved note object |
| GET | `/doctor-notes/:username` | Get notes for patient | — | `[...notes]` sorted desc |

### 8.4 Medication Endpoints

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/medications` | Add medication reminder | `{ patientUsername, medicationName, dose, time, notes? }` | Saved medication object |
| GET | `/medications/:username` | Get patient medications | — | `[...medications]` sorted by time |
| PUT | `/medications/:id/taken` | Mark medication taken | — | Updated medication object |
| DELETE | `/medications/:id` | Delete medication | — | `{ message: "Deleted" }` |

### 8.5 Chatbot Endpoint

| Method | Path | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/chatbot/message` | Send message to AI | `{ message, patientContext? }` | `{ success, reply, source }` |

`source` is either `"gemini"` or `"fallback"` — tells the frontend which engine answered.

---

## 9. Data Flow: React → Express → MongoDB

### 9.1 Saving a Pain Report (Full Trace)

```
1. REACT (DailyPainReport.jsx)
   User fills form fields: painLevel=7, location="Lower back",
   painType="Burning", duration="1 hour", medicationTaken="Yes"
   User clicks "Save Pain Report"
   │
   handleSubmit() is called
   Calls savePainReport(reportData) from painReportService.js

2. SERVICE (painReportService.js)
   fetch("http://localhost:5000/api/pain-reports", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       patientUsername: "patient1",
       painLevel: 7,
       location: "Lower back",
       painType: "Burning",
       duration: "1 hour",
       medicationTaken: "Yes",
       notes: ""
     })
   })

3. EXPRESS (index.js → painReports.route.js)
   Request passes through middleware stack:
   helmet → morgan → cors → json parser → rateLimit
   Routed to POST /api/pain-reports handler

4. ROUTE HANDLER (painReports.route.js)
   Reads req.body fields
   Creates: new PainReport({ patientUsername, painLevel, ... })
   Calls: report.save()

5. MONGOOSE → MONGODB
   Mongoose validates schema (painLevel 0-10, required fields)
   INSERT document into painreports collection
   Returns: saved document with _id and timestamps

6. EXPRESS → REACT
   res.status(201).json(savedReport)
   fetch() resolves with response
   data = await response.json()

7. REACT (DailyPainReport.jsx)
   Shows success message "Pain report saved!"
   Calls getSelfRecommendation(reportData) — LOCAL, no API call
   Displays recommendation: "Burning pain detected — try relaxation breathing..."
   Resets form fields
```

### 9.2 Doctor Dashboard Load (Full Trace)

```
1. REACT (DoctorDashboard.jsx)
   useEffect on mount calls getDoctorDashboardData()

2. SERVICE (doctorService.js)
   Two parallel fetch() calls:
   a) GET /api/users         → all registered users
   b) GET /api/pain-reports  → all pain reports from all patients

3. EXPRESS HANDLERS
   users.route.js: User.find({}, { password: 0 }).sort({ createdAt: -1 })
   painReports.route.js: PainReport.find({}).sort({ createdAt: -1 })

4. MONGODB
   Queries both collections, returns documents

5. SERVICE (doctorService.js)
   Filters users by role === "patient"
   For each patient: finds their latest pain report by matching patientUsername
   Builds enriched patient array:
   [
     {
       username, name, age, diagnosis, physician,
       lastPain: Number,        // from latest PainReport.painLevel
       lastLocation: String,    // from latest PainReport.location
       totalReports: Number,    // count of all their reports
       lastReportDate: String,  // formatted date
       status: "High Alert" | "Needs Follow-up" | "Stable" | "No Reports"
     },
     ...
   ]

6. REACT (DoctorDashboard.jsx)
   Passes enriched data down to child components:
   - DoctorStatsCards  receives: patients[]
   - AbnormalPainAlerts receives: patients[] (filtered to pain >= 8)
   - PatientTable      receives: patients[]
   - PatientClinicalSummary receives: patients[]
```

---

## 10. File-by-File Reference

### 10.1 Backend Files

---

#### `server/src/index.js`
**Purpose**: Express application entry point — bootstraps the server  
**Inputs**: Environment variables (PORT, MONGO_URI from .env)  
**Outputs**: Running HTTP server on port 5000  
**Dependencies**: express, helmet, cors, morgan, express-rate-limit, dotenv, db.js, all route files  
**Key logic**: Applies middleware in order; mounts all 5 route groups; starts the listener

---

#### `server/src/config/db.js`
**Purpose**: Establishes and manages the MongoDB connection  
**Inputs**: `MONGO_URI` environment variable (falls back to `mongodb://127.0.0.1:27017/paincare_assistant`)  
**Outputs**: Active Mongoose connection; logs success or error  
**Dependencies**: mongoose  
**Key logic**: `async connectDB()` → `mongoose.connect(uri)` with try/catch; called once from index.js at startup

---

#### `server/src/models/User.js`
**Purpose**: Defines the Mongoose schema and model for user accounts  
**Inputs**: User data objects passed to `new User(data).save()`  
**Outputs**: Mongoose Model exported as `User`; enforces field types, unique username, role enum  
**Dependencies**: mongoose  
**Key logic**: `{ username (unique), password, role: enum["patient","doctor"], name, age, diagnosis, physician }` + timestamps

---

#### `server/src/models/PainReport.js`
**Purpose**: Schema for daily pain reports logged by patients  
**Inputs**: Pain report data from the POST /api/pain-reports route  
**Outputs**: Validated and persisted pain report documents  
**Dependencies**: mongoose  
**Key logic**: painLevel (0–10), location, painType, duration are required; medicationTaken defaults to "No"

---

#### `server/src/models/DoctorNote.js`
**Purpose**: Schema for clinical notes written by doctors about specific patients  
**Inputs**: Note data from POST /api/doctor-notes  
**Outputs**: Persisted note documents with patientUsername + doctorUsername cross-reference  
**Dependencies**: mongoose

---

#### `server/src/models/Medication.js`
**Purpose**: Schema for medication reminders belonging to a patient  
**Inputs**: Medication data from POST /api/medications  
**Outputs**: Persisted medication documents; `taken` boolean tracks adherence  
**Dependencies**: mongoose  
**Key logic**: `taken` defaults to `false`; updated to `true` via the PUT `/taken` route

---

#### `server/src/routes/users.route.js`
**Purpose**: Handles all user authentication and retrieval operations  
**Inputs**: HTTP request body for register/login; no body for GET  
**Outputs**: JSON user objects (password field always excluded from responses)  
**Dependencies**: express.Router, User model  
**Key logic**:  
- Register: checks unique username → saves → returns user  
- Login: finds by username → compares password → returns user or 401  
- GET all: `User.find({}, { password: 0 })`

---

#### `server/src/routes/painReports.route.js`
**Purpose**: CRUD operations for patient pain reports  
**Inputs**: Report data in POST body; optional `:username` URL param for GET  
**Outputs**: Saved report object (POST); array of reports (GET)  
**Dependencies**: express.Router, PainReport model  
**Key logic**: GET by username uses `PainReport.find({ patientUsername: req.params.username })`

---

#### `server/src/routes/doctorNotes.route.js`
**Purpose**: Create and retrieve clinical notes per patient  
**Inputs**: Note data in POST body; `:username` param for GET  
**Outputs**: Saved note (POST); array of notes sorted newest first (GET)  
**Dependencies**: express.Router, DoctorNote model

---

#### `server/src/routes/medications.route.js`
**Purpose**: Full CRUD for patient medication reminders  
**Inputs**: Medication data in POST body; `:username` or `:id` in URL params  
**Outputs**: Saved/updated/deleted medication objects  
**Dependencies**: express.Router, Medication model  
**Key logic**: PUT `/taken` uses `Medication.findByIdAndUpdate(id, { taken: true }, { new: true })`

---

#### `server/src/routes/chatbot.route.js`
**Purpose**: AI chatbot endpoint — routes user messages to Gemini or fallback  
**Inputs**: `{ message, patientContext }` in POST body  
**Outputs**: `{ success, reply, source }` — source indicates "gemini" or "fallback"  
**Dependencies**: express.Router, node-fetch (or axios), GEMINI_API_KEY env var  
**Key logic**:  
1. Builds a system prompt that injects patient context (name, age, diagnosis, latest pain data)  
2. Appends safety constraints (no diagnosis, no medication changes, escalate if pain ≥ 8)  
3. POST to Gemini REST API with temperature 0.4, maxTokens 220  
4. On failure or missing key: runs keyword-matching fallback over `message.toLowerCase()`

---

### 10.2 Frontend Service Files

---

#### `src/services/authService.js`
**Purpose**: Abstracts login and registration API calls  
**Inputs**: `(username, password)` for login; patient data object for register  
**Outputs**: Promise resolving to `{ success: Boolean, user: Object, message: String }`  
**Dependencies**: fetch (browser native)

---

#### `src/services/painReportService.js`
**Purpose**: Pain report API calls + local recommendation logic  
**Inputs**: Report data for save; username for fetch; report object for recommendations  
**Outputs**: Saved reports (API); recommendation object `{ title, message }` (local)  
**Dependencies**: fetch  
**Key local logic**: `getSelfRecommendation(report)` — decision tree based on painLevel, painType, medicationTaken

---

#### `src/services/medicationService.js`
**Purpose**: All CRUD operations for medication reminders  
**Inputs**: Medication data; patient username; medication MongoDB `_id`  
**Outputs**: API responses for each operation  
**Dependencies**: fetch

---

#### `src/services/chatbotService.js`
**Purpose**: Sends chat messages with patient context to backend  
**Inputs**: `(message: String, patientContext: Object)`  
**Outputs**: `{ success, reply, source }`  
**Dependencies**: fetch

---

#### `src/services/doctorService.js`
**Purpose**: Fetches all users and pain reports, aggregates dashboard data locally  
**Inputs**: None (fetches everything)  
**Outputs**: Enriched patient array with status, lastPain, totalReports, etc.  
**Dependencies**: fetch  
**Key logic**: Two separate API calls + client-side join and aggregation; `getPatientStatus()` classifies patients by pain level

---

#### `src/services/doctorNotesService.js`
**Purpose**: Create and retrieve doctor notes  
**Inputs**: Note data for add; patient username for get  
**Outputs**: Saved note or array of notes  
**Dependencies**: fetch

---

#### `src/services/trendsService.js`
**Purpose**: Local utility functions for pain trend calculations (no API calls)  
**Inputs**: Array of pain report objects  
**Outputs**: Statistics values and visual helpers  
**Dependencies**: None  
**Key functions**: `sortReportsByDate`, `getAveragePainLevel`, `getHighestPainReport`, `getBarHeight(level → level × 18px)`

---

### 10.3 Frontend Component Files

---

#### `src/main.jsx`
**Purpose**: React application entry point  
**Inputs**: None  
**Outputs**: Mounts `<App />` into `document.getElementById('root')`  
**Dependencies**: react, react-dom, App.jsx, index.css

---

#### `src/App.jsx`
**Purpose**: Root component — manages auth state and renders the correct view  
**Inputs**: None  
**Outputs**: Renders either auth forms or the appropriate role dashboard  
**Dependencies**: Login, Register, PatientHome, DoctorHome  
**Key logic**: Single `currentUser` state drives all conditional rendering; `role` field on user object decides which dashboard to show

---

#### `src/components/auth/Login.jsx`
**Purpose**: Login form with credential input and error display  
**Inputs**: `onLogin` callback, `onSwitchToRegister` callback (from App.jsx)  
**Outputs**: Calls `onLogin(user)` on successful authentication  
**Dependencies**: authService.loginUser

---

#### `src/components/auth/Register.jsx`
**Purpose**: Patient registration form with client-side validation  
**Inputs**: `onRegister` callback, `onSwitchToLogin` callback (from App.jsx)  
**Outputs**: Calls `onRegister(user)` on successful registration  
**Dependencies**: authService.registerPatient  
**Key logic**: Validates required fields, age range (1–120), and password match before calling API

---

#### `src/components/patient/PatientHome.jsx`
**Purpose**: Patient dashboard layout shell — assembles all patient sections  
**Inputs**: `user` prop (logged-in patient), `onLogout` callback  
**Outputs**: Renders Header + 4 main patient sections  
**Dependencies**: Header, DailyPainReport, MedicationReminder, PainAssistantChatbot, PainTrends

---

#### `src/components/painReport/DailyPainReport.jsx`
**Purpose**: Pain logging form with emergency alert and self-recommendations  
**Inputs**: `user` prop (for patientUsername)  
**Outputs**: Saves report to backend; displays recommendation and emergency alert  
**Dependencies**: painReportService (savePainReport, getSelfRecommendation, isHighPainLevel)  
**Key logic**: Slider input for painLevel (0–10); if painLevel ≥ 8, renders red emergency banner; after save, runs getSelfRecommendation() locally and displays result

---

#### `src/components/medication/MedicationReminder.jsx`
**Purpose**: Full medication management UI — add, view, mark taken, delete  
**Inputs**: `user` prop  
**Outputs**: Manages medications via API; renders list of `MedicationReminderCard`  
**Dependencies**: medicationService (all 4 functions), MedicationReminderCard

---

#### `src/components/medication/MedicationReminderCard.jsx`
**Purpose**: Single medication display card with actions  
**Inputs**: `medication` object, `onMarkTaken` callback, `onDelete` callback  
**Outputs**: Renders medication details; status badge (Pending/Taken); action buttons  
**Dependencies**: None (pure presentational)

---

#### `src/components/chatbot/PainAssistantChatbot.jsx`
**Purpose**: AI chat interface with patient context injection  
**Inputs**: `user` prop  
**Outputs**: Renders scrollable chat history; sends messages to Gemini via backend  
**Dependencies**: chatbotService, painReportService.getPainReportsByPatient  
**Key logic**: On mount, fetches latest pain report to build `patientContext`; auto-scrolls chat box; 4 quick-reply buttons; Enter key submits message

---

#### `src/components/trends/PainTrends.jsx`
**Purpose**: Statistics summary and visual bar chart of pain history  
**Inputs**: `user` prop  
**Outputs**: Renders 3 stat cards + TrendBarChart  
**Dependencies**: painReportService.getPainReportsByPatient, trendsService, TrendBarChart

---

#### `src/components/trends/TrendBarChart.jsx`
**Purpose**: Visual bar chart of pain levels over time  
**Inputs**: `reports` array  
**Outputs**: Horizontal-scrollable bar chart (bar height = painLevel × 18px)  
**Dependencies**: trendsService.getBarHeight, trendsService.formatReportDate

---

#### `src/components/doctor/DoctorHome.jsx`
**Purpose**: Doctor dashboard layout shell  
**Inputs**: `user` prop (logged-in doctor), `onLogout` callback  
**Outputs**: Renders doctor Header + DoctorDashboard  
**Dependencies**: Header, DoctorDashboard

---

#### `src/components/doctorDashboard/DoctorDashboard.jsx`
**Purpose**: Main doctor view — loads and distributes all patient data  
**Inputs**: `user` prop (doctor)  
**Outputs**: Renders all 5 doctor sub-components with aggregated data  
**Dependencies**: doctorService.getDoctorDashboardData + all child dashboard components  
**Key logic**: Fetches and aggregates all patients + reports on mount; classifies each patient's status; passes down as props

---

#### `src/components/doctorDashboard/DoctorStatsCards.jsx`
**Purpose**: Top-level KPI cards for the doctor view  
**Inputs**: `patients` array (enriched)  
**Outputs**: Three cards: Total Patients, High Pain Alerts (≥8), Average Pain Level  
**Dependencies**: doctorService (getTotalPatients, getHighPainPatients, getAveragePainLevel)

---

#### `src/components/doctorDashboard/AbnormalPainAlerts.jsx`
**Purpose**: Highlights patients with pain level ≥ 8  
**Inputs**: `patients` array  
**Outputs**: Alert cards for each high-pain patient; green "all clear" if none  
**Dependencies**: None (filters props locally)

---

#### `src/components/doctorDashboard/PatientTable.jsx`
**Purpose**: Tabular overview of all patients with color-coded status  
**Inputs**: `patients` array  
**Outputs**: Table with columns: Name, Age, Diagnosis, Last Pain, Location, Reports, Date, Status  
**Dependencies**: None  
**Key logic**: Status badge color — Red (High Alert), Yellow (Needs Follow-up), Green (Stable), Gray (No Reports)

---

#### `src/components/doctorDashboard/PatientClinicalSummary.jsx`
**Purpose**: Per-patient priority analysis cards  
**Inputs**: `patients` array  
**Outputs**: Priority card per patient (High/Medium/Low/No Data) with recommendation text  
**Dependencies**: doctorService.buildClinicalSummary

---

#### `src/components/doctorDashboard/DoctorNotesPanel.jsx`
**Purpose**: Write and view clinical notes per patient  
**Inputs**: `user` prop (doctor); `patients` array (for selector)  
**Outputs**: Saves note via API; renders past notes for selected patient  
**Dependencies**: doctorNotesService (addDoctorNote, getDoctorNotesByPatient)

---

#### `src/components/common/Header.jsx`
**Purpose**: Sticky navigation header — different buttons for patient vs doctor  
**Inputs**: `user` prop (for role detection), `onLogout` callback  
**Outputs**: Smooth-scrolls to section on button click; renders role-appropriate buttons  
**Dependencies**: None  
**Key logic**: `document.getElementById(sectionId).scrollIntoView()` on click; conditional rendering based on `user.role`

---

## 11. Security Analysis

The following table summarizes the current security posture for academic review:

| Vulnerability | Status | Location | Mitigation |
|---|---|---|---|
| Plain-text passwords | Present | `User.js`, `users.route.js` | Use `bcrypt.hash()` before save; `bcrypt.compare()` on login |
| No JWT authentication | Missing | All routes | Issue JWT on login; verify on every protected route |
| No authorization middleware | Missing | All routes | Add `authenticateToken` + `authorizeRole("doctor")` middleware |
| GET /api/users exposes all users | Present | `users.route.js` | Restrict to admin or remove entirely |
| No server-side input validation | Missing | All routes | Use `express-validator` or Joi for schema validation |
| Passwords excluded from response but not at schema level | Partial | `users.route.js` | Use `select: false` on password field in schema |
| Hardcoded backend URL in frontend | Present | All service files | Use `.env` for `VITE_API_URL` |
| No HTTPS | Dev only | Global | Terminate TLS at reverse proxy (Nginx) in production |
| Gemini API key in server .env | Acceptable | `.env` | Never commit `.env` — already in `.gitignore` |

---

*Document generated for academic defense of the PainCare Assistant project.*
