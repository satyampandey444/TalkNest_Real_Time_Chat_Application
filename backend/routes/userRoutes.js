import express from "express";
import {
  getOtherUsers,
  login,
  logout,
  register,
  updateProfile, 
  searchUsers,   
} from "../controllers/userController.js";

import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ Register route
router.post("/register", register);

// ✅ Login route
router.post("/login", login);

// ✅ Logout route
router.post("/logout", logout);

// ✅ Get all users except logged-in one
router.get("/", isAuthenticated, getOtherUsers);

// ✅ Update profile route
router.put("/update-profile", isAuthenticated, updateProfile);

// ✅ Search users by name or username
router.get("/search", isAuthenticated, searchUsers);

export default router;
