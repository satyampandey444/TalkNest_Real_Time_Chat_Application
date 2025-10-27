# 🌐 TalkNest – Real-Time Chat Application

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/Node.js-18+-blue.svg)
![React](https://img.shields.io/badge/React.js-18+-informational.svg)
![Socket.io](https://img.shields.io/badge/Socket.IO-Live_Chat-orange.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)

---

## **Demo Video**
[![Talk Nest GIF]()
---

## Chats & Friends

<p align="center">
  <img src="./Chat_SS.png" alt="Chats" width="45%" />
  <img src="./Friend request SS.png" alt="friends" width="45%" />
</p>


---

## 🏠 Live Link

🔗 [TalkNest on Render](https://talknest-real-time-chat-application.onrender.com)

---

## 🚀 Overview

**TalkNest** is a full-stack **real-time chat platform** that enables users to connect, chat instantly, share media, and manage friendships securely.
It features **Twilio OTP authentication**, **JWT-based security**, and **Socket.IO-powered messaging** for an instant communication experience.

---

## ✨ Features

### ✅ Authentication & Access

* OTP-based login via **Twilio**
* Password-based login with **JWT authorization**
* Secure session management

### 💬 Real-Time Messaging

* 1:1 private chat powered by **Socket.IO**
* Live message delivery and online presence
* Chat only with approved friends

### 👥 Friend System

* Send, accept, or decline friend requests
* Chat only between connected users (friends)

### 📎 Media Sharing

* Share images, videos, audio, and documents
* Preview support for **PDF, Excel, Docs, and Photos**

### 🎨 UI / UX

* Responsive design built with **React + Tailwind CSS**
* Smooth, modern chat interface
* Real-time updates and animations

---

## 🧱 Architecture Overview

TalkNest follows a **modular client–server architecture** for scalability, maintainability, and real-time performance.

### 🖥️ Frontend (React + Vite)

* Built with **React.js**, **Vite**, and **Tailwind CSS**
* State management via **Redux Toolkit**
* Real-time updates via **Socket.IO client**
* API communication through Axios

### ⚙️ Backend (Node.js + Express)

* RESTful APIs for authentication, friends, and chat
* **Twilio integration** for OTP
* **JWT middleware** for route protection
* File upload handling
* **Socket.IO server** for real-time chat events

### 🗄️ Database (MongoDB + Mongoose)

* Stores user data, messages, and friend relationships
* Optimized queries and schema validation

### ☁️ Deployment

* Hosted on **Render**
* Environment variables secured via `.env`
* CI/CD support for seamless deployment

---

## 🛠️ Tech Stack

| Layer          | Technologies                                |
| -------------- | ------------------------------------------- |
| Frontend       | React.js, Vite, Redux Toolkit, Tailwind CSS |
| Backend        | Node.js, Express.js                         |
| Real-Time      | Socket.IO                                   |
| Database       | MongoDB + Mongoose                          |
| Authentication | JWT + Twilio OTP                            |
| Deployment     | Render                                      |

---

## ⚡ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/satyampandey444/TalkNest.git
cd TalkNest
```

---


#### Create a `.env` file inside the **backend** directory:

```
# Example .env file for TalkNest

PORT=3000||or any other
MONGO_URI=<your-mongodb-uri>
JWT_SECRET_KEY=<your-jwt-secret>
GEMINI_API_KEY=<your-gemini-api-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-phone>

```

---

## 📂 Folder Structure

```
TalkNest/
│
├── backend/                         # Node.js Backend
│   ├── config/                      # Database / Server Config
│   ├── controllers/                 # API Controllers
│   ├── middleware/                  # Auth / Error Middleware
│   ├── models/                      # Mongoose Models
│   ├── routes/                      # API Routes
│   ├── socket/                      # Socket.IO Events
│   ├── index.js                     # Entry Point
│   ├── .env                         # Environment Variables
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   └── .gitignore
│
├── frontend/                        # React Frontend (Vite)
│   ├── public/                      # Static Assets
│   ├── src/
│   │   ├── assets/                  # Images / Icons
│   │   ├── components/              # Reusable Components
│   │   ├── context/                 # Auth & Socket Contexts
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── redux/                   # Redux Slices & Store
│   │   ├── App.jsx                  # Root Component
│   │   ├── index.css                # Global Styles
│   │   └── main.jsx                 # Entry File
│   ├── eslint.config.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
└── README.md
```

---

## 🧑‍💻 Contributing

Contributions are welcome!
If you’d like to improve the project:
Feel free to Contact

---

## 📜 License

This project is licensed under the **MIT License** 

---

## 🤝 Connect

Created with ❤️ by Satyam Pandey
📧 Email: [satyampandey5505@gmail.com](mailto:satyampandey5505@gmail.com)
🌍 GitHub: [satyampandey444](https://github.com/satyampandey444)
