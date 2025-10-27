// src/socket/socket.js (or your current socket file)
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Map userId → socketId
const userSocketMap = {};

// Helper: Get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://talknest-real-time-chat-application.onrender.com/"], // your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // 🧩 Track user connection
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`📡 User ${userId} is online`);
  }

  // Notify all users about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing indicator
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from: userId });
    }
  });

  // Stop typing indicator
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { from: userId });
    }
  });

  // Optional: handle reconnect attempts cleanly
  socket.on("reconnect_attempt", () => {
    console.log(`🔄 Reconnection attempt by ${userId || socket.id}`);
  });

  // Handle user disconnect
  socket.on("disconnect", (reason) => {
    console.log(`❌ User disconnected: ${socket.id} (${reason})`);

    // Cleanup user mapping
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    // Update everyone’s online user list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
