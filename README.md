# 🎓 Project ALMA — AI-Powered Alumni Management & Career Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React_19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2F_Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn_%2F_XGBoost-orange?logo=python)](https://scikit-learn.org/)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?logo=socket.io)](https://socket.io/)

---

## 📌 Overview

**Project ALMA** is a modern, unified platform designed to connect **Students**, **Alumni**, and **Institutions**. It integrates traditional alumni networking with **Machine Learning** tools to provide career guidance, mentorship, intelligent resume scoring, and campus placement probability predictions.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **🤖 ML Placement Predictor**: Predicts campus placement probability and estimated hiring tier (Product, Tech, Enterprise) using ensemble machine learning models.
- **📄 AI Resume Analyzer & Skill Gap**: Evaluates resumes with NLP, detects missing skills for target roles, and suggests actionable improvements.
- **🤝 Mentorship & Networking**: Connect with alumni in top companies for guidance and 1-on-1 mentorship.
- **💼 Job & Internship Board**: Discover verified opportunities and referral openings posted directly by alumni.
- **🪪 Digital Smart Card**: Access digital student verification card with integrated QR code.

### 🧑‍💼 For Alumni
- **🌐 Global Alumni Directory**: Filter and discover fellow graduates by batch, company, department, and location.
- **✍️ Knowledge Sharing & Blogs**: Share career experiences, articles, and advice with the student community.
- **📢 Events & Meetups**: Explore and RSVP to college reunions, webinars, and tech talks.
- **💬 Real-Time Messaging**: Built-in chat powered by Socket.IO for direct 1-on-1 communication.

### 🏛️ For College Administrators
- **✅ Member Verification**: Secure portal to verify and approve student and alumni profiles.
- **📊 Batch CSV Onboarding**: Bulk import student and alumni records quickly.
- **📋 Dynamic Surveys**: Build and distribute surveys to gather feedback and track alumni career outcomes.
- **📢 Official Circulars**: Broadcast announcements and notices directly to students and alumni.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, Socket.IO, JWT, Role-Based Access Control (RBAC) |
| **Database** | MongoDB & Mongoose |
| **Machine Learning** | Python 3, Scikit-Learn, XGBoost, TF-IDF NLP Pipeline |
| **DevOps & Containers** | Docker, Docker Compose, Nginx |

---

## ⚡ Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
- [Python](https://www.python.org/) (v3.9 or higher, optional for ML backend)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/ProjectALMA.git
cd ProjectALMA

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/alumniconnect
JWT_SECRET=your_jwt_secret_key
```

### 4. Run Development Server
```bash
# Start both client and server concurrently
npm run dev:all
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`

---

## 🚢 Production Deployment

Project ALMA is fully containerized and production-ready.

### 🐳 Quick Deploy with Docker Compose
```bash
# Copy and configure environment variables
cp .env.example .env

# Build and start all services in detached mode
docker compose up -d --build
```
- **Frontend**: `http://localhost:5173`
- **Backend Health**: `http://localhost:5000/health`

For complete cloud deployment instructions (Render, Railway, Fly.io, Vercel, VPS with Nginx SSL), see the **[Production Deployment Guide](DEPLOYMENT.md)**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

