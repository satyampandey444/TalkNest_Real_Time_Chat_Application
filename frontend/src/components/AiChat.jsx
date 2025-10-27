import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

const AIFriendChat = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "💫 Hey there! I’m Nova — your AI friend. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://talknest-real-time-chat-application.onrender.com/api/v1/ai/chat", {
        message: input,
      });

      const aiReply =
        res.data.reply ||
        "🌸 Sorry, I didn’t quite catch that. Could you say it another way?";

      const aiMsg = { sender: "ai", text: aiReply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Oops! I’m having trouble replying right now. Try again soon!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white px-4 relative overflow-hidden">
      {/* Floating Glow Effect */}
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Chat Box */}
      <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <header className="text-center py-4 border-b border-white/10 bg-white/5 shadow-md">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            Nova 🌙 — Your AI Friend
          </motion.h1>
          <p className="text-gray-300 text-sm mt-1">
            Always here to listen and chat with you 💖
          </p>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={`flex items-end gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {msg.sender === "ai" && (
                <div className="p-2 rounded-full bg-white/10 border border-white/20">
                  <Bot size={20} className="text-pink-400" />
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                    : "bg-white/15 text-gray-100 border border-white/10 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="p-2 rounded-full bg-white/10 border border-white/20">
                  <User size={20} className="text-blue-300" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-full bg-white/10 border border-white/20">
                <Bot size={20} className="text-pink-400" />
              </div>
              <div className="bg-white/10 text-gray-300 px-4 py-2 rounded-2xl border border-white/10">
                <span className="animate-pulse">Nova is typing...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center gap-3 backdrop-blur-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message to Nova..."
            className="flex-1 bg-white/10 rounded-full px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
          />
          <motion.button
            onClick={sendMessage}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 rounded-full font-semibold shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            {loading ? "..." : "Send 💌"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AIFriendChat;
