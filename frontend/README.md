# CampusResolve — College Complaint Management System (Frontend)

Modern, responsive web frontend for the College Complaint Management System built with **Next.js (Pages Router)**, **React 18**, **Tailwind CSS**, **Axios**, and **Lucide React**.

---

## 📁 Architecture & File Structure

```plaintext
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js              # Sticky responsive navigation with role badges
│   │   ├── Layout.js              # Page shell wrapper with header and footer
│   │   ├── StatusBadge.js         # Color-coded badges for status & priority
│   │   ├── ProtectedRoute.js      # RBAC protection wrapper (student/admin)
│   │   └── MetricCard.js          # Polished analytics cards with micro-animations
│   ├── context/
│   │   └── AuthContext.js         # Global auth state, persistent login, & token handling
│   ├── pages/
│   │   ├── _app.js                # Next.js App root with AuthProvider
│   │   ├── index.js               # Landing page with hero, categories, & workflow
│   │   ├── login.js               # Sign in with quick-fill demo credentials
│   │   ├── register.js            # Registration with role & department selector
│   │   ├── dashboard.js           # Role-aware dashboard (Student / Admin views)
│   │   ├── complaints/
│   │   │   ├── new.js             # Grievance submission with live ticket preview
│   │   │   └── [id].js            # Ticket details, milestone timeline & admin updater
│   │   └── admin/
│   │       └── index.js           # Admin management console with analytics & triage modal
│   ├── services/
│   │   └── api.js                 # Axios instance with interceptors & API client methods
│   └── styles/
│       └── globals.css            # Tailwind directives and custom scrollbars
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variables template
└── .env.local                     # Local environment configuration
```

---

## ⚡ Key Features

- **JWT Authentication & Session Persistence**: Seamless token extraction, storage in `localStorage`, and auto-hydration on page refresh.
- **Role-Based Access Control (RBAC)**: Distinct interfaces for Students (filing tickets, tracking milestones, cancelling pending requests) and Admins (system analytics, triage, dispatching staff, updating status, publishing resolution notes).
- **Interactive Resolution Milestone Timeline**: Visual status tracker progressing through `Submitted` ➔ `Under Review` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
- **Live Ticket Preview**: Real-time card previewing priority badge, category, location, and description as the student types.
- **Admin Quick Triage Modal**: Triage issues, assign maintenance staff, and update resolutions without navigating away from the table.
- **Full Search & Multi-Filter Toolbar**: Search by keyword, student, location, staff name, status, category, and priority.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
