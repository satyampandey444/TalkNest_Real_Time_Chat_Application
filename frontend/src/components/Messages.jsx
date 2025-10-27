import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();

  const { messages } = useSelector((store) => store.message);
  const { socket } = useSelector((store) => store.socket);
  const { selectedUser, authUser } = useSelector((store) => store.user);

  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // ✅ Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser?._id]);

  // ✅ Typing indicator (text or media)
  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    const handleTyping = ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(true);

        // Reset timeout to hide typing indicator after 2s of inactivity
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    };

    const handleStopTyping = ({ from }) => {
      if (from === selectedUser._id) setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, selectedUser?._id]);

  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4
      scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-transparent
      hover:scrollbar-thumb-zinc-600/70 transition-all duration-300"
    >
      {messages.length > 0 ? (
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Message message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <div className="text-gray-400 text-center mt-10">
          <p className="text-lg font-medium">No messages yet...</p>
          <p className="text-sm text-gray-500">Start the conversation ✨</p>
        </div>
      )}

      {/* ✅ Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            key="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-400 text-sm italic ml-4 mt-1"
          >
            {selectedUser?.fullName?.split(" ")[0] || "User"} is typing...
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
