import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please type something." });

    const systemPrompt = `
      You are Nova 🌙 — a friendly AI friend.
      Always reply warmly, casually, and use emojis naturally.
    `;

    const result = await model.generateContent(`${systemPrompt}\nUser: ${message}\nNova:`);

    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini Chat Error:", error);
    res.status(500).json({
      reply: "⚠️ Oops! Something went wrong. Try again later.",
    });
  }
});

export default router;
