# Shikhar360 - India's Premier Education Discovery & Admission Platform

Shikhar360 is a full-stack platform designed to simplify college admissions, exam preparation, career guidance, and academic administration.

## 🚀 Key Features

- **College & Course Discovery**: Search, filter, and compare top universities, colleges, and courses across India.
- **Exams & Cutoffs**: Comprehensive entrance exam tracking, syllabus, cutoff trends, and mock tests.
- **Scholarships & Financial Aid**: Discover verified government and merit-based scholarship opportunities.
- **Multi-Role Portals**: Role-based dashboards for Students, Parents, Faculty, Counsellors, College Representatives, and Administrators.
- **Career Assessment & Counseling**: AI-guided and counselor-assisted career recommendations.
- **Academic & Fee Management**: Real-time attendance, grades, ledger, and fee payment tracking.

## 🏗️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **HTTP Client**: Axios

### Backend (`/server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: SQLite (via Sequelize ORM)
- **Authentication**: JWT & Cookie-based session management

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dev21sept/shikar360.com.git
cd shikar360.com
```

### 2. Setup & Start Backend
```bash
cd server
npm install
npm run seed     # Seeds initial demo data (optional)
npm run dev      # Starts server on http://localhost:5000
```

### 3. Setup & Start Frontend
```bash
cd ../client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---
Made with ❤️ for higher education discovery in India.
