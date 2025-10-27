# 🌐 TalkNest – Real-Time Chat Application

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/Node.js-18+-blue.svg)
![React](https://img.shields.io/badge/React.js-18+-informational.svg)
![Socket.io](https://img.shields.io/badge/Socket.IO-Live_Chat-orange.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)

---

## 🏠 Live Demo

🔗 [TalkNest on Render](https://talknest-real-time-chat-application.onrender.com)

---

## 🚀 Overview

**TalkNest** is a modern **real-time chat platform** that allows users to connect, chat instantly, share media, and manage friendships.
It offers OTP-based authentication using **Twilio**, JWT-secured login, and lightning-fast communication via **Socket.IO**.

---

## ✨ Features

### ✅ Authentication & User Access

* OTP-based authentication via **Twilio**
* Password login with secure **JWT authorization**
* Protected routes and sessions

### 💬 Real-Time Messaging

* 1:1 private chat powered by **Socket.IO**
* Real-time message delivery and typing indicators
* Online/offline status tracking

### 👥 Social Interaction

* Send, accept, and decline friend requests
* Only connected (friend) users can chat

### 📎 Media Sharing

* Send **images, videos, audio, and documents**
* Supports **PDF, Excel, Docs, and Photos**
* File preview before sending

### 🎨 UI / UX

* Fully responsive **React + Tailwind CSS** interface
* Modern and intuitive chat layout
* Real-time UI updates and animations

---

## 🧱 Architecture

TalkNest follows a **modular client-server architecture** designed for scalability and performance.

### 🖥️ Frontend (React + Redux Toolkit)

* React for dynamic UI and component-based architecture
* Redux Toolkit for global state management
* Tailwind CSS for styling
* Communicates with backend via REST API and WebSockets

### ⚙️ Backend (Node.js + Express)

* REST APIs for authentication, friends, and chat management
* Twilio integration for OTP-based login
* JWT middleware for authorization
* File uploads and user management

### 🔌 Real-Time (Socket.IO)

* Handles real-time messaging events
* Maintains online/offline user states
* Pushes message delivery status updates

### 🗄️ Database (MongoDB + Mongoose)

* Stores users, messages, and friend data
* Indexed queries for fast retrieval
* Schema validation via Mongoose models

### ☁️ Deployment

* Hosted on **Render**
* Environment variables for secrets and configuration
* CI/CD supported

---

## 🛠️ Tech Stack

| Layer          | Technologies                          |
| -------------- | ------------------------------------- |
| Frontend       | React.js, Redux Toolkit, Tailwind CSS |
| Backend        | Node.js, Express.js                   |
| Real-Time      | Socket.IO                             |
| Database       | MongoDB + Mongoose                    |
| Authentication | JWT + Twilio OTP                      |
| Deployment     | Render                                |

---

## ⚡ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/TalkNest.git
cd TalkNest
```

### 2️⃣ Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3️⃣ Environment Variables

Create `.env` files in both `server/` and `client/` directories:

#### **Server `.env`**

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_PHONE_NUMBER=<twilio-phone-number>
CLIENT_URL=http://localhost:3000
```

#### **Client `.env`**

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 4️⃣ Run the project

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm start
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser 🚀

---

## 📂 Folder Structure

```
TalkNest/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   └── server.js
│
└── README.md
```

---

## 🧑‍💻 Contributing

Contributions are always welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 🎉

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Connect

Created with ❤️ by [Your Name]
📧 Email: [your.email@example.com](mailto:your.email@example.com)
🌍 GitHub: [your-github-profile](https://github.com/your-github-profile)
