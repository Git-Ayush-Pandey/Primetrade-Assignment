# PrimeTrade Backend Assignment

A scalable REST API with authentication, role-based access control, and a simple frontend UI for interacting with the APIs.

## Overview
This project demonstrates how to design a backend service with secure authentication, modular architecture, and scalable structure.  
Users can register, log in, receive JWT tokens, and manage notes via protected endpoints.

The project includes:
- JWT authentication
- Role-based access control (user / admin)
- CRUD APIs for notes
- MongoDB database schema
- Swagger API documentation
- React frontend UI for testing APIs

---

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- Swagger (swagger-jsdoc + swagger-ui-express)

### Frontend
- React
- Vite
- Axios

---

## Features

### Authentication
- User registration
- Password hashing with bcrypt
- JWT token generation
- Login authentication

### Authorization
- Role-based access control
- Middleware to protect routes

### Notes API
Users can:
- Create notes
- Read notes
- Update notes
- Delete notes

Admins can:
- View all notes
- Manage any note

### API Documentation
Interactive Swagger documentation:
http://localhost:5000/api-docs

---

## Environment Variables

Create `.env` inside the backend folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Environment variables are loaded via `src/config/env.ts`.

---

## Project Structure

```
primetrade-assignment
│
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── env.ts
│   │   │
│   │   ├── middleware
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── models
│   │   │   ├── User.ts
│   │   │   └── Note.ts
│   │   │
│   │   ├── routes
│   │   │   ├── auth.routes.ts
│   │   │   └── notes.routes.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── src
│   └── package.json
│
├── README.md
└── SCALABILITY.md
```

---

## Setup Instructions

### Clone Repository

```
git clone https://github.com/Git-Ayush-Pandey/Primetrade-Assignment.git
cd primetrade-assignment
```

### Backend Setup

```
cd backend
npm install
npm run dev
```

Server runs at:
http://localhost:5000

Swagger API docs:
http://localhost:5000/api-docs

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:
http://localhost:5173

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|------|------|------|
POST | /api/v1/auth/register | Register new user |
POST | /api/v1/auth/login | Login and get JWT |

### Notes

| Method | Endpoint | Description |
|------|------|------|
GET | /api/v1/notes | Get notes |
POST | /api/v1/notes | Create note |
PUT | /api/v1/notes/:id | Update note |
DELETE | /api/v1/notes/:id | Delete note |

---

## Security Practices

- Passwords hashed with bcrypt
- JWT authentication for protected routes
- Input validation with express-validator
- Environment variables for sensitive configuration
- Middleware-based authorization

---

## Screenshots

### API Documentation
![Swagger API](Screenshots/swagger.bmp)

### Register Page
![Register](Screenshots/Signup.bmp)

### Login Page
![Login](Screenshots/Login.bmp)

### Dashboard
![Dashboard](Screenshots/dashboard.bmp)

---

## Author

Ayush Pandey  
B.Tech Computer Science & Engineering  
IIT Jammu

---

## Assignment

PrimeTrade Backend Developer Internship Task

Completed on: 2026-03-13
