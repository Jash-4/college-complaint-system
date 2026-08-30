# Smart College Complaint Management System

A modern, production-grade digital grievance redressal and facilities maintenance platform designed to streamline issue reporting, lifecycle tracking, staff dispatch, and resolution audits across college campuses.

---

## 1. Project Name
**Smart College Complaint Management System** (CampusResolve)

---

## 2. Problem Statement
Traditional paper-based or uncoordinated college grievance reporting processes suffer from significant delays, lack of accountability, lost tickets, and poor communication between students, department heads, and campus maintenance engineers. 

The **Smart College Complaint Management System** provides an end-to-end digital ecosystem where students can file, track, and monitor incident tickets in real-time, while administrators can triage issues, dispatch specialized personnel, and monitor campus-wide facilities health through data-driven analytics.

---

## 3. Features

- **Role-Based Access Control (RBAC)**: Secure authentication and custom interfaces for **Students** and **Administrators**.
- **Comprehensive Incident Submission**: Fast complaint logging with category tagging (`Classroom`, `Hostel`, `Wi-Fi`, `Infrastructure`, `Cleanliness`, `Labs`, `Other`), location details, and visual priority levels (`Low`, `Medium`, `High`, `Critical`).
- **Interactive Lifecycle Milestone Timeline**: Real-time visual tracking through 6 standardized stages:
  $$\text{Submitted} \longrightarrow \text{Under Review} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved} \longrightarrow \text{Closed}$$
- **Student Ownership Controls**: Students can view their personal complaint histories, monitor progress updates, and cancel/delete tickets while still in `Submitted` status.
- **Administrative Triage & Staff Dispatch**: Administrators can update ticket statuses, assign dedicated maintenance personnel/teams, adjust priority ratings, and append official resolution notes.
- **Master Admin Console & Quick Modal**: In-table quick triage and update modals for managing campus grievances without page reloads.
- **Multi-Criteria Search & Filter Toolbar**: Real-time filtering by status, category, priority, and free-text search across locations, student names, and titles.
- **Aggregated Analytics & KPIs**: Instant calculation of total logged complaints, active/pending review counts, in-progress tasks, and completed resolutions.

---

## 4. Technology Stack

- **Frontend**: Next.js 14 (Pages Router), React 18, Tailwind CSS 3, Axios, Lucide React
- **Backend API**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, CORS, Dotenv
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Deployment & Hosting**: Vercel (Frontend Client), Render (Backend REST API)

---

## 5. Screenshots

### 🖥️ 1. Landing Page & Live Statistics
![Landing Page](https://raw.githubusercontent.com/placeholder/college-complaint-system/main/docs/screenshots/landing-page.png)
*Figure 1: Landing page featuring campus category channels, workflow steps, and real-time grievance counters.*

### 📊 2. Role-Adaptive Dashboard (Student & Admin)
![Dashboard](https://raw.githubusercontent.com/placeholder/college-complaint-system/main/docs/screenshots/dashboard.png)
*Figure 2: Unified dashboard displaying personal ticket metrics, recent complaints, and quick action controls.*

### 📝 3. Grievance Submission with Live Card Preview
![New Complaint Form](https://raw.githubusercontent.com/placeholder/college-complaint-system/main/docs/screenshots/new-complaint.png)
*Figure 3: Interactive ticket creation form with category selectors, priority cards, and real-time live preview.*

### ⏱️ 4. Visual Milestone Timeline & Details View
![Complaint Detail Timeline](https://raw.githubusercontent.com/placeholder/college-complaint-system/main/docs/screenshots/complaint-timeline.png)
*Figure 4: 6-stage milestone tracker, student information panel, and administrator update console.*

### 🛠️ 5. Admin Management Console & Quick Triage
![Admin Console](https://raw.githubusercontent.com/placeholder/college-complaint-system/main/docs/screenshots/admin-console.png)
*Figure 5: Advanced administration ledger with search, category distribution metrics, and modal staff assignment.*

---

## 6. Live Demo
- **Frontend Web Application (Vercel)**: [https://college-complaint-system.vercel.app](https://college-complaint-system.vercel.app)

---

## 7. Backend URL
- **REST API Service (Render)**: [https://college-complaint-api.onrender.com](https://college-complaint-api.onrender.com)
- **API Health Check**: `https://college-complaint-api.onrender.com/api/health`

---

## 8. Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB Database (Local instance or MongoDB Atlas cluster URI)

---

### Step 1: Clone and Navigate to Repository
```bash
git clone https://github.com/your-username/college-complaint-system.git
cd college-complaint-system
```

---

### Step 2: Backend Configuration & Startup

1. Open a terminal and enter the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` file (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Populate `.env` with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend REST API will be active on `http://localhost:5000`.*

---

### Step 3: Frontend Configuration & Startup

1. Open a second terminal and enter the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create the `.env.local` file (or copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. Verify the API target:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

5. Start the Next.js frontend client:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your web browser.*

---

## 9. Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port number on which Express listens | `5000` |
| `NODE_ENV` | Runtime environment mode | `development` / `production` |
| `MONGODB_URI` | MongoDB Atlas or Local connection URI | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/complaint_db` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_secure_random_string` |
| `JWT_EXPIRE` | Token validity duration | `7d` |
| `FRONTEND_URL` | Allowed origin for CORS validation | `http://localhost:3000` or `*` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API server | `http://localhost:5000` |

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
