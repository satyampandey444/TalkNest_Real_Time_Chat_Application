import express from "express";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsList,
  getFriendRequests, // ✅ Added
} from "../controllers/friendController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();


router.get("/search", isAuthenticated, searchUsers);


router.post("/send-request/:id", isAuthenticated, sendFriendRequest);


router.post("/accept-request/:id", isAuthenticated, acceptFriendRequest);

router.get("/list", isAuthenticated, getFriendsList);


router.get("/requests", isAuthenticated, getFriendRequests);

export default router;
