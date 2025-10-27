import React, { useState, useEffect, useRef } from "react";
import { IoSend, IoImageOutline } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";
import { motion } from "framer-motion";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]); // Track individual file uploads
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const { selectedUser, authUser } = useSelector((store) => store.user);
  const { messages } = useSelector((store) => store.message);
  const { socket } = useSelector((store) => store.socket);

  // Typing indicator
  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    if (message.trim() || files.length > 0) {
      socket.emit("typing", { to: selectedUser._id, from: authUser?._id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { to: selectedUser._id, from: authUser?._id });
      }, 1500);
    } else {
      socket.emit("stopTyping", { to: selectedUser._id, from: authUser?._id });
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message, files, socket, selectedUser?._id, authUser?._id]);

  // Remove a selected file from preview
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setUploadingFiles(uploadingFiles.filter((_, i) => i !== index));
  };

  // Send message
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if ((!message.trim() && files.length === 0) || isSending) return;

    setIsSending(true);

    // Initialize uploading state
    setUploadingFiles(files.map(() => true));

    try {
      const formData = new FormData();
      formData.append("message", message);
      files.forEach((file) => formData.append("media", file));

      const res = await axios.post(
        `https://talknest-real-time-chat-application.onrender.com/api/v2/message/send/${selectedUser._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newMsg = res.data?.newMessage;
      if (newMsg) {
        dispatch(setMessages([...messages, newMsg]));
        socket?.emit("newMessage", newMsg);
      }

      setMessage("");
      setFiles([]);
      setUploadingFiles([]);
      socket.emit("stopTyping", { to: selectedUser._id, from: authUser?._id });
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
      setUploadingFiles([]); // Reset on error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="relative w-full bg-zinc-800/60 backdrop-blur-md border border-zinc-700/60 rounded-xl px-4 py-2 shadow-inner transition-all flex flex-col gap-2"
    >
      {/* Media Preview (horizontal scroll) */}
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto max-h-24 py-1">
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file);
            const type = file.type;
            const isUploading = uploadingFiles[idx];

            const previewStyle =
              type.startsWith("image") || type.startsWith("video")
                ? "object-cover"
                : "";

            return (
              <div key={idx} className="relative">
                {type.startsWith("image") && (
                  <img
                    src={url}
                    alt="preview"
                    className={`w-20 h-20 rounded border border-gray-500 ${previewStyle} ${
                      isUploading ? "opacity-60" : ""
                    }`}
                  />
                )}
                {type.startsWith("video") && (
                  <video
                    src={url}
                    className={`w-24 h-20 rounded border border-gray-500 ${isUploading ? "opacity-60" : ""}`}
                    controls
                  />
                )}
                {type.startsWith("audio") && (
                  <audio src={url} controls className="w-48" />
                )}
                {!type.startsWith("image") &&
                  !type.startsWith("video") &&
                  !type.startsWith("audio") && (
                    <span className="px-2 py-1 bg-gray-600 rounded text-sm text-white">
                      {file.name}
                    </span>
                  )}

                {/* Remove button */}
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  onClick={() => removeFile(idx)}
                >
                  ×
                </span>

                {/* Loading spinner overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                    <div className="w-5 h-5 border-2 border-t-blue-400 border-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xlsx"
          className="hidden"
          id="mediaInput"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <label htmlFor="mediaInput" className="cursor-pointer p-2">
          <IoImageOutline size={22} className="text-gray-400 hover:text-blue-400" />
        </label>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400 px-2 py-1 rounded"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={(!message.trim() && files.length === 0) || isSending}
          className={`p-2 rounded-full transition-all duration-300 ${
            message.trim() || files.length > 0
              ? "text-blue-400 hover:text-blue-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
              : "text-gray-500 cursor-not-allowed"
          }`}
        >
          <IoSend size={22} />
        </motion.button>
      </div>
    </form>
  );
};

export default SendInput;
