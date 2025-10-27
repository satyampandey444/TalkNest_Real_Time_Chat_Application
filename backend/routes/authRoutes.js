import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Check if user is logged in
router.get("/check", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.json({ authenticated: true });
  } catch {
    return res.json({ authenticated: false });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out" });
});

export default router;
