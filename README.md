# SmartSociety — Intelligent Residential Management & Gatekeeper ERP

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-REST_API-black.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_Realtime-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, production-grade **Society Management System** engineered for gated residential communities, housing societies, and apartment complexes. Designed to streamline **Visitor Gatekeeping**, **Maintenance Helpdesk Ticketing**, and **Society Notices & Broadcasts** with role-based access control and high-performance REST APIs.

---

## 🏛️ Live Demo Credentials (1-Click Switcher in UI)

The application includes a built-in top bar **Instant Role Switcher** so reviewers can experience all workflows seamlessly:

| Role | Name / Designation | Unit | Email | Default Password | Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Rajesh Sharma (Secretary) | A-101 | `admin@smartsociety.com` | `admin123password` | Full society operations, ticket dispatch, publish notices, stats |
| **Resident** | Vikram Malhotra (Owner) | B-402 | `resident@smartsociety.com` | `resident123password` | Pre-approve passes, gate approvals, file tickets, read notices |
| **Security Guard** | Ramesh Singh (Head Guard) | Gate Alpha | `guard@smartsociety.com` | `guard123password` | Gate scanner, passcode lookup (`VP-XXXX`), fast check-in / check-out |

---

## 🚀 Key Modules & Capabilities

### 1. 🛡️ Visitor & Gatekeeper Management
- **Digital Visitor Gate Passes**: Generate passes with unique verification codes (`VP-4821`), QR pattern simulation, host flat authorization, and Apple Wallet style printable pass badges.
- **Resident Pre-Approval**: Residents can pre-approve expected guests, Amazon/Swiggy delivery partners, or cabs.
- **Gate Alpha Scanner Terminal**: Dedicated security post interface for instant pass code verification and one-click **Check-In** and **Check-Out**.
- **Movement Ledger**: Real-time logging of pedestrian and vehicular entries with license plate recognition records.

### 2. 🔧 Maintenance Helpdesk & Complaints
- **Category Routing**: Categorized ticketing for Plumbing, Electrical, Elevator AMC, Common Area, Cleanliness, Security, and Carpentry.
- **Priority SLAs**: Urgent (4-hour SLA), High, Medium, and Routine Low.
- **Lifecycle Tracking**: Linear/Jira-style lifecycle (`Submitted` → `Under Review` → `In Progress` → `Resolved` → `Closed`).
- **Vendor Dispatch**: Admins assign specialized technicians with contact information and estimated completion dates.
- **Resident Feedback**: 5-star rating system and resident review remarks upon service completion.

### 3. 📢 Notices, Circulars & Emergency Broadcasts
- **Emergency Red Alerts**: High-priority alert banner for municipal water cuts, lift breakdowns, or urgent security alerts.
- **Audience Targeting**: Target notices to *All Residents*, *Owners Only*, *Tenants Only*, or specific blocks (*Block A*, *Block B*).
- **Read Receipts & Acknowledgement**: One-click *"Acknowledge Notice"* button for residents with live acknowledgment counters.
- **Circular Attachments**: Downloadable meeting agendas, audited accounts, and maintenance circulars.

### 4. 🏢 Society Directory & Amenities
- **Resident Directory**: Filterable by Block (A, B, C, D) with direct phone and unit mappings.
- **Managing Committee**: Direct contacts for Secretary, Treasurer, Security Convener, and Cultural Committee.
- **Amenities Guide**: Operational timings, capacity, and booking rules for Clubhouse, Swimming Pool, Gym, and EV Fast Charging Bays.
- **Emergency Hotlines**: Instant 1-click dial sheet for Gate Security, Hospital, Ambulance, Police, and Emergency Plumbers.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts (analytics charts), Vite.
- **Backend**: Express.js REST API with modular controllers, JWT authentication, and RBAC middleware.
- **Database**: Dual architecture:
  - **MongoDB + Mongoose** for persistent collections (`Users`, `Visitors`, `Complaints`, `Notices`).
  - **Resilient Fallback Storage**: Self-initializing high-speed in-memory store if running standalone.
- **Supabase**: Integrated client for cloud authentication and real-time subscription readiness.

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Sohamkale122/smart-society.git
cd smart-society
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure Environment Variables
Create `server/.env` based on `server/.env.example`:
```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/smart_society
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

### 5. Run Development Servers
- Backend Server:
  ```bash
  npm run server
  ```
- Frontend Client:
  ```bash
  npm run client
  ```
Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment

### Deploy to Railway
```bash
railway login
railway init
railway up
```

### Deploy to Vercel
```bash
cd client
vercel
```

---

## 📄 License
MIT License © 2026 Greenfield Heights CHS / Soham Kale
