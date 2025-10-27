import express from "express";
import multer from "multer";
import {
  sendMessage,
  getMessage,
  getAllMessages,
} from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// 🖼️ Multer setup — for uploading images, videos, or other media
const upload = multer({
  dest: "uploads/", // temporary folder before uploading to cloud storage
  limits: { fileSize: 25 * 1024 * 1024 }, // max 25MB per file
});

router.get("/all", isAuthenticated, getAllMessages);


// POST https://talknest-real-time-chat-application.onrender.com//api/v2/message/send/:id
router.post(
  "/send/:id",
  isAuthenticated,
  upload.array("media", 5), // max to 5 media files
  sendMessage
);


// GET https://talknest-real-time-chat-application.onrender.com//api/v2/message/:id
router.get("/:id", isAuthenticated, getMessage);

export default router;
