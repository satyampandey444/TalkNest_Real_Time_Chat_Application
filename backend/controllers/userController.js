import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    if (!fullName || !userName || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username already exists. Try another one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?/${userName}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?/${userName}`;

    await User.create({
      fullName,
      userName,
      password: hashedPassword,
      profilePhoto:
        gender.toLowerCase() === "male" ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });

    return res
      .status(201)
      .json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect username.", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password.", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        _id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed", error });
  }
};

// ================== LOGOUT ==================
export const logout = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      })
      .json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};

// ================== GET OTHER USERS ==================
export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    return res.status(200).json(otherUsers);
  } catch (error) {
    console.error("Get other users error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================== UPDATE PROFILE ==================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, userName, password, gender, profilePhoto } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    let uploadedPhoto = user.profilePhoto;
    if (profilePhoto && profilePhoto.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(profilePhoto, {
        folder: "chatApp_profiles",
      });
      uploadedPhoto = uploadRes.secure_url;
    }

    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    user.fullName = fullName || user.fullName;
    user.userName = userName || user.userName;
    user.gender = gender || user.gender;
    user.password = hashedPassword;
    user.profilePhoto = uploadedPhoto;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== SEARCH USERS ==================
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Exclude the logged-in user
    const users = await User.find({
      _id: { $ne: req.userId }, // <-- prevent showing the logged-in user
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({ users });
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ message: "Server error while searching users" });
  }
};

