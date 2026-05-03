# 🚀 Threadlink

> **AI-Powered Workflow Automation & Collaboration Platform**

🌐 **Live Demo:** https://threadlink-ivory.vercel.app/

📦 **GitHub Repo:** https://github.com/VaishnaviJaiswal-1001/Threadlink

**Demo Video** ![https://youtu.be/j08WEkRd8Gk](https://youtu.be/j08WEkRd8Gk)

---

## 🧭 Overview

**Threadlink** is a modern, AI-driven collaboration platform designed to streamline workflows, automate repetitive tasks, and provide real-time productivity insights.

It integrates directly with **Gmail** and **Google Calendar**, transforming emails into actionable tasks and enabling intelligent automation using **Groq LLaMA 3 AI**.

> 💡 Think of it as a smarter, automated alternative to tools like Notion, Trello, and Asana.

---

## ✨ Features

### 🤖 AI Automation

* **Smart Mailbot**
  Converts emails into structured tasks automatically.
* **Auto Email Replies**
  Generates context-aware responses.
* **AI Assistant Chat**
  Conversational interface for task and workflow queries.

### 📊 Dashboard

* Unified workspace for tasks, deadlines, and schedules
* Real-time updates
* Minimal, glassmorphic UI design

### 📋 Task Management

* Workflow automation (Trigger → Action)
* Task lifecycle tracking:

  * Pending → In Progress → Completed
* Priority & deadline handling

---

## 🏗️ Architecture

```
Frontend (React/Vite)
        ↓
Backend API (Node.js/Express)
        ↓
Database (MongoDB)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js
* Mongoose
* Groq API (LLaMA 3)

### Database & Deployment

* MongoDB Atlas
* Vercel (Frontend)
* Render (Backend)

---

## 📁 Project Structure

```
Threadlink/
│
├── frontend/      # React application
├── backend/       # Express API
├── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/VaishnaviJaiswal-1001/Threadlink.git
cd Threadlink
```

---

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file inside `/backend`:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Database
MONGO_URI=your_mongodb_uri

# Auth
JWT_SECRET=your_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# AI
GROQ_API_KEY=your_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Gmail API
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:5000/api/email/oauth/callback
```

---

### 4️⃣ Run the App

```bash
# Backend
cd backend
npm run dev
```

```bash
# Frontend
cd frontend
npm run dev
```

---

## 🔌 API Endpoints

### 🔐 Authentication

* `POST /auth/signup`
* `POST /auth/login`
* `GET /auth/google`

### 🤖 AI

* `POST /ai/chat`
* `POST /email/sync`

### 📋 Tasks

* `GET /tasks`
* `POST /tasks`

### ⚙️ Workflows

* `POST /workflows`

---

## 🔒 Security

* JWT-based authentication
* Protected routes with middleware
* Environment variable protection
* Input validation using Zod

---

## 🚀 Deployment

### Backend (Render)

* Root: `/backend`
* Build: `npm install`
* Start: `node server.js`

### Frontend (Vercel)

* Root: `/frontend`
* Add env: `VITE_API_URL`

---

## 🤝 Contributing

```bash
1. Fork the repo
2. Create a branch (git checkout -b feature-name)
3. Commit changes
4. Push to GitHub
5. Open PR
```

---

## 📜 License

MIT License

---

## 👩‍💻 Authors

* Vaishnavi Jaiswal
* Vaishnavi Maurya
* Jay Gautam
* Pooja Gond

GitHub: https://github.com/VaishnaviJaiswal-1001
