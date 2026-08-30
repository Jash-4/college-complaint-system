# Smart College Complaint Management System

## 1. Project Name
**Smart College Complaint Management System** (CampusResolve)

---

## 2. Problem Statement
Manual campus grievance processes often lead to lost tickets, lack of accountability, and zero visibility into resolution progress. The Smart College Complaint Management System solves this by providing a centralized digital portal for students to lodge, categorize, and track campus issues while enabling college administrators to review, assign, prioritize, and resolve grievances systematically.

---

## 3. Features
- **Role-Based Authentication**: Secure JWT-based login/registration for Students and Administrators.
- **Student Portal**:
  - Lodge complaints with category (Hostel, Classroom, Wi-Fi, Infrastructure, Cleanliness, Labs, Other), priority, and location.
  - Track complaint status through an interactive visual lifecycle (Submitted → Under Review → Assigned → In Progress → Resolved → Closed).
  - View detailed complaint history and resolution remarks.
  - Cancel/delete tickets while still in `Submitted` status.
- **Admin Management Console**:
  - Filter and search complaints by status, category, and urgency.
  - Assign complaints to specific staff/departments.
  - Real-time status transitions with administrative resolution notes.
  - Aggregated campus grievance analytics and metric counters.
- **Responsive UI/UX**: Built with Tailwind CSS and Lucide icons for mobile and desktop screens.

---

## 4. Technology Stack
- **Frontend**: Next.js (Pages Router), React, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, CORS
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Deployment**: Vercel (Frontend), Render (Backend API), MongoDB Atlas (Database)

---

## 5. Screenshots
- **Landing Page**: `docs/screenshots/landing.png`
- **Student Dashboard**: `docs/screenshots/dashboard.png`
- **Lodge Complaint View**: `docs/screenshots/new-complaint.png`
- **Complaint Lifecycle & Timeline**: `docs/screenshots/timeline.png`
- **Admin Control Panel**: `docs/screenshots/admin.png`

---

## 6. Live Demo
- **Frontend Application**: [https://college-complaint-system-bice.vercel.app/](https://college-complaint-system-bice.vercel.app/)

---

## 7. Backend URL
- **REST API Endpoint**: [https://college-complaint-system-s116.onrender.com](https://college-complaint-system-s116.onrender.com)
- **API Health Check**: [https://college-complaint-system-s116.onrender.com/api/health](https://college-complaint-system-s116.onrender.com/api/health)

---

## 8. Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:3000`.*

---

## 9. Environment Variables

### Backend Environment Variables (`backend/.env`)
| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `PORT` | Server listener port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGODB_URI` | MongoDB Atlas / Local Connection URI | `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` or `*` |

### Frontend Environment Variables (`frontend/.env.local`)
| Variable | Description | Example / Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend REST API Base URL | `http://localhost:5000` |

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
