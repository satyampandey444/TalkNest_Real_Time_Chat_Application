// ✅ config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); // Load environment variables

// ✅ Ensure all env vars exist
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Missing Cloudinary environment variables!");
  process.exit(1);
}

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ Utility function to upload any media file (image/video/docs)
export const uploadToCloudinary = async (localFilePath, folder = "chat_media") => {
  try {
    if (!localFilePath) throw new Error("No file path provided");

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "auto", // auto-detect (image/video/pdf/etc.)
    });

    // delete temp file after upload
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    // cleanup if upload fails
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    throw error;
  }
};

export default cloudinary;
