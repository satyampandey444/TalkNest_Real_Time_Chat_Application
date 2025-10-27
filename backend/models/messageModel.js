import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    media: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video", "audio", "document", "other"],
        },
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "media", "mixed"],
      default: "text",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
