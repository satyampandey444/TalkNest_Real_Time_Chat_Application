// ✅ Imports
import { Conversation } from "../models/conversationalModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// SEND MESSAGE (text, image, video, etc.)
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const { message } = req.body;

    // Files from Multer middleware
    const files = req.files || [];

    if (!message && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Either text or media is required to send a message.",
      });
    }

    //Upload media files to Cloudinary
    let uploadedMedia = [];
    if (files.length > 0) {
      uploadedMedia = await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(file.path);
          const mimeType = file.mimetype;

          let type = "other";
          if (mimeType.startsWith("image")) type = "image";
          else if (mimeType.startsWith("video")) type = "video";
          else if (mimeType.startsWith("audio")) type = "audio";
          else if (
            mimeType === "application/pdf" ||
            mimeType.includes("word") ||
            mimeType.includes("excel")
          )
            type = "document";

          return { url: result, type };
        })
      );
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message?.trim() || "",
      media: uploadedMedia,
      messageType:
        uploadedMedia.length > 0 && message
          ? "mixed"
          : uploadedMedia.length > 0
          ? "media"
          : "text",
    });

    // Update conversation
    conversation.messages.push(newMessage._id);
    conversation.updatedAt = new Date();
    await conversation.save();

    // Emit real-time event to both users
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);
    if (senderSocketId) io.to(senderSocketId).emit("newMessage", newMessage);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL MESSAGES BETWEEN TWO USERS
export const getMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
      })
      .lean();

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("❌ getMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 🆕 GET ALL LATEST MESSAGES (for sidebar previews)
export const getAllMessages = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 },
      })
      .lean();

    const latestMessages = conversations
      .map((conv) => conv.messages?.[0])
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: latestMessages.length,
      messages: latestMessages,
    });
  } catch (error) {
    console.error("❌ getAllMessages error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
