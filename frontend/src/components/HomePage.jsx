import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    // Redirect to chat interface (you can change path as needed)
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"
      ></div>

      {/* Glowing animated blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to TalkNest
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
          Connect, chat, and share moments — all in one place.  
          Start your journey with the people that matter most.
        </p>

        {/* 🪄 Animated “Open Your Chat” button */}
        <button
          onClick={handleOpenChat}
          className="relative px-10 py-4 text-xl font-semibold text-white rounded-full
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                     shadow-lg shadow-purple-500/30
                     hover:scale-105 transition-transform duration-300
                     overflow-hidden"
        >
          <span className="relative z-10">Open Your Chats</span>
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-100 blur-2xl transition duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
