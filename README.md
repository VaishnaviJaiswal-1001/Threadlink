# 🚀 Threadlink

## A Modern Team Collaboration & Task Management Platform

**🌐 Live Application:** [https://threadlink-ivory.vercel.app/](https://threadlink-ivory.vercel.app/)  
**📦 Repository:** [https://github.com/VaishnaviJaiswal-1001/Threadlink](https://github.com/VaishnaviJaiswal-1001/Threadlink)

---

## 🧭 Overview

**Threadlink** is an AI-powered, scalable, and intuitive **collaboration platform** designed to streamline task management, automate your workflow, and provide real-time visibility into your day.

Built with a modern tech stack, Threadlink connects directly to your Gmail and Google Calendar to extract tasks, set deadlines, and automate responses using cutting-edge AI (Groq Llama 3). 

It serves as a lightweight, intelligent alternative to traditional tools like Notion, Trello, and Asana.

---

## ✨ Core Features

### 🤖 AI-Powered Automation
* **Smart Mailbot:** Automatically reads incoming emails, categorizes them, and generates actionable tasks.
* **Auto-Replies:** Generates context-aware, professional email draft replies.
* **AI Chat Assistant:** A conversational AI that understands your tasks, workflows, and schedule.

### 🧑‍💼 Unified Team Dashboard
* Real-time overview of your daily agenda and tasks.
* Clean, minimalist, glassmorphic UI for better focus.
* Seamless integrations with Google Calendar.

### 📋 Advanced Task Management
* Custom automation workflows (Trigger → Action).
* Priority and deadline management.
* Task lifecycle tracking (Pending → In Progress → Completed).

---

## 🏗️ System Architecture


Client (React/Vite)  →  API Layer (Node/Express)  →  Database (MongoDB)

# Frontend: Handles UI/UX, animations, and user interaction.

# Backend: Manages business logic, AI interactions, OAuth, and APIs.

# Database: Stores tasks, workflows, users, and app configurations.

## 🛠️ Tech Stack

# Frontend
* React.js (Vite)
* Tailwind CSS & Framer Motion
* 
# Backend
* Node.js & Express.js
* Mongoose
* Groq API (Llama 3 Model)
# Database & Deployment
* MongoDB Atlas
* Vercel (Frontend Hosting)
* Render (Backend API Hosting)

# 📁 Project Structure

Threadlink/
├── frontend/            # React/Vite application
├── backend/             # Node/Express API services
├── README.md            # Documentation

## ⚙️ Getting Started
1. Clone Repository
bash
git clone https://github.com/VaishnaviJaiswal-1001/Threadlink.git
cd Threadlink
2. Install Dependencies
You will need to install dependencies for both the frontend and backend.

bash
# Install backend dependencies
cd backend
npm install
# Install frontend dependencies
cd ../frontend
npm install
3. Setup Environment Variables
Create a .env file in the backend/ directory:

env
bash
# =========================
# 🌐 Server Configuration
# =========================
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
# =========================
# 🗄️ Database (MongoDB)
# =========================
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/threadlink
# =========================
# 🔐 Authentication (JWT)
# =========================
JWT_SECRET=your_64_char_random_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
# =========================
# 🤖 AI Configuration (Groq)
# =========================
GROQ_API_KEY=your_groq_api_key_here
# =========================
# 🔑 Google OAuth (Login)
# =========================
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
# =========================
# 📧 Gmail API (Email Automation)
# =========================
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:5000/api/email/oauth/callback
# =========================
# 📁 File Upload
# =========================
UPLOAD_DIR=uploads/
MAX_FILE_SIZE_MB=5
# =========================
# 🚦 Rate Limiting
# =========================
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
GENERAL_RATE_LIMIT_MAX=100

4. Run Development Servers
You will need two terminal windows open.

Terminal 1 (Backend):

bash
cd backend
npm run dev
Terminal 2 (Frontend):

bash
cd frontend
npm run dev
🔌 API Documentation
Base URL: https://your-backend-url/api

# 🔐 Authentication
POST /auth/signup - Register a new user
POST /auth/login - Login with email/password
GET /auth/google - Initiate Google OAuth flow
🤖 AI Engine
POST /ai/chat - Interact with the AI context assistant
POST /email/sync - Trigger Mailbot to fetch and parse unread emails
📋 Tasks & Workflows
GET /tasks - Retrieve all user tasks
POST /tasks - Create a new task manually
POST /workflows - Define a new automation trigger
🔒 Security Practices
JWT-based secure authentication.
Protected API routes using middleware.
Environment variables safely omitted from version control.
Strict input validation and sanitization using Zod.
🚀 Deployment
Backend (Render)
Create a Web Service on Render.
Set Root Directory to backend.
Build command: npm install, Start command: node server.js.
Inject .env variables and update OAuth callback URLs.
Frontend (Vercel)
Import repository to Vercel.
Set Root Directory to frontend.
Add VITE_API_URL environment variable pointing to your Render backend.
Deploy! (A vercel.json is included for SPA routing).

# 🤝 Contributing
We welcome contributions to improve Threadlink!

bash
1. Fork the repository
2. Create a feature branch (git checkout -b feature-name)
3. Commit changes (git commit -m "Add feature")
4. Push to branch (git push origin feature-name)
5. Open a Pull Request

# 📜 License
This project is licensed under the MIT License.

# 👩‍💻 Authors
Vaishnavi Jaiswal, Vaishnavi Maurya, Jay Gautam, Pooja Gond
GitHub: https://github.com/VaishnaviJaiswal-1001
