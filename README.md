# 💼 Job Search App

A full-scale job search platform built with NestJS, featuring real-time chat, instant notifications, and advanced admin controls via GraphQL.

---

## 🚀 Features

- 👔 Role-based access for Admins, Employers, and Job Seekers
- 📋 Job posting, application, and approval workflows with advanced filtering
- 💬 Real-time chat between HR and Job Seekers via Socket.io
- 🔔 Instant notifications to HR upon new job applications
- 🛡️ GraphQL APIs for admin operations (ban/unban users & companies, approve companies)
- 🐳 Dockerized for consistent development and deployment environments
- 🔐 JWT authentication with Role-Based Access Control (RBAC)

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | NestJS |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| API | GraphQL, REST |
| Auth | JWT, RBAC |
| DevOps | Docker |

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── user/
│   ├── company/
│   ├── job/
│   ├── application/
│   └── chat/
├── auth/
├── graphql/
└── main.ts
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/Eman-mohamed33/JobSearchApp.git

# Install dependencies
npm install

# Run with Docker
docker-compose up

# Or run locally
npm run start:dev
```

---

## 🔑 Environment Variables

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

## 👩‍💻 Author

**Eman Gesraha** · [LinkedIn](https://linkedin.com/in/eman-gesraha) · [GitHub](https://github.com/Eman-mohamed33)
