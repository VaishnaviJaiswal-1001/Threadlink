---

# 🚀 Threadlink

## A Modern Team Collaboration & Task Management Platform

**🌐 Live Application:** [https://threadlink-ivory.vercel.app/](https://threadlink-ivory.vercel.app/)
**📦 Repository:** [https://github.com/VaishnaviJaiswal-1001/Threadlink](https://github.com/VaishnaviJaiswal-1001/Threadlink)

---

## 🧭 Overview

**Threadlink** is a scalable and intuitive **team collaboration platform** designed to streamline task management, enhance productivity, and provide real-time visibility into team workflows.

Built with a modern tech stack, Threadlink enables teams to:

* Organize work efficiently
* Track progress in real-time
* Collaborate seamlessly across projects

It serves as a lightweight yet powerful alternative to traditional tools like Notion, Trello, and Asana.

---

## ✨ Core Features

### 🧑‍💼 Unified Team Dashboard

* Real-time overview of team activities
* Task insights and performance tracking
* Clean and minimal UI for better focus

### 📋 Advanced Task Management

* Create, assign, and manage tasks
* Priority and deadline management
* Task lifecycle tracking (Pending → In Progress → Completed)

### 📊 Progress & Analytics

* Visual tracking of task completion
* Team productivity insights
* Performance monitoring

### 👥 Team Collaboration

* Multi-user environment
* Role-based task ownership
* Transparent workflow tracking

### ⚡ High Performance UX

* Fast, responsive UI
* Optimized rendering
* Smooth navigation experience

---

## 🏗️ System Architecture

```id="arch123"
Client (React)  →  API Layer (Node/Express)  →  Database
```

* **Frontend:** Handles UI/UX and user interaction
* **Backend:** Manages business logic and APIs
* **Database:** Stores tasks, users, and team data

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vite / Next.js (update if needed)

### Backend

* Node.js
* Express.js

### Database

* MongoDB / Firebase *(update accordingly)*

### Deployment

* Vercel (Frontend)
* Backend Hosting (if applicable)

---

## 📁 Project Structure

```id="proj001"
Threadlink/
├── client/              # Frontend application
├── server/              # Backend services (if included)
├── components/          # Reusable UI components
├── pages/               # Application views
├── services/            # API calls & logic
├── utils/               # Helper functions
├── public/              # Static assets
└── config/              # Environment & configuration
```

---

## ⚙️ Getting Started

### 1. Clone Repository

```bash id="clone01"
git clone https://github.com/VaishnaviJaiswal-1001/Threadlink.git
cd Threadlink
```

### 2. Install Dependencies

```bash id="install01"
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```# =========================
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
# 🔑 Google OAuth (Login)
# =========================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# =========================
# 📧 Gmail API (Email Automation)
# =========================
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
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
```

---

### 4. Run Development Server

```bash id="run01"
npm run dev
```

---

## 🔌 API Documentation

> Base URL:

```
https://your-backend-url/api
```

---

### 🔐 Authentication

#### Register User

```http id="api01"
POST /auth/register
```

**Request Body:**

```json id="api02"
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

---

#### Login User

```http id="api03"
POST /auth/login
```

**Response:**

```json id="api04"
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "john@example.com"
  }
}
```

---

### 📋 Tasks

#### Create Task

```http id="api05"
POST /tasks
```

**Body:**

```json id="api06"
{
  "title": "Complete UI",
  "description": "Finish dashboard UI",
  "priority": "high",
  "deadline": "2026-06-01"
}
```

---

#### Get All Tasks

```http id="api07"
GET /tasks
```

---

#### Update Task

```http id="api08"
PUT /tasks/:id
```

---

#### Delete Task

```http id="api09"
DELETE /tasks/:id
```

---

### 👥 Team

#### Add Member

```http id="api10"
POST /team/add
```

#### Get Team Members

```http id="api11"
GET /team
```

---

## 🔒 Security Practices

* JWT-based authentication
* Secure API routes
* Environment variable protection
* Input validation and sanitization

---

## 🚀 Deployment

### Frontend (Vercel)

* Connect GitHub repository
* Auto-deploy on push

### Backend

* Deploy on platforms like:

  * Render


---

## 📈 Roadmap

* 🔔 Real-time notifications
* 📅 Calendar & scheduling integration
* 📧 Gmail automation integration
* 🤖 AI-based task prioritization
* 📊 Advanced analytics dashboard

---


---

## 🤝 Contributing

We welcome contributions to improve Threadlink.

```bash id="contri01"
1. Fork the repository
2. Create a feature branch (git checkout -b feature-name)
3. Commit changes (git commit -m "Add feature")
4. Push to branch (git push origin feature-name)
5. Open a Pull Request
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Author

**Vaishnavi Jaiswal, Vaishnavi maurya,Jay gautam,Pooja gond**
GitHub: [https://github.com/VaishnaviJaiswal-1001](https://github.com/VaishnaviJaiswal-1001)

---

## ⭐ Acknowledgment

If you find this project useful, consider giving it a ⭐ on GitHub.

---

## 💼 Final Note

Threadlink is designed with scalability and simplicity in mind, making it suitable for:

* Startups
* Student teams
* Freelancers
* Small to mid-sized organizations

---
