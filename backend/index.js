import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiRoute from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { app as socketApp, server } from "./socket/socket.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Proper dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize Express app (shared with Socket.io)
const app = socketApp;

// ✅ Port configuration
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// ✅ CORS setup (adjust origin for production later)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://talknest-real-time-chat-application.onrender.com", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// ✅ Serve uploaded files (publicly accessible)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v2/message", messageRoutes);
app.use("/api/v1/ai", aiRoute);
app.use("/api/auth", authRoutes);
app.use("/api/v1/friends", friendRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// ✅ Start Server after connecting to MongoDB
server.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server listening at port ${PORT}`);
});
