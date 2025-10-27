// src/components/ChatPage.jsx
import React from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../../redux/userSlice";

const ChatPage = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleBack = () => dispatch(setSelectedUser(null));

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#0a0a0a] overflow-hidden pt-[64px]">
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      {/* Main chat container */}
      <div
        className="relative z-10 flex flex-1 min-h-0 mx-auto w-[95%] md:w-[85%] lg:w-[75%]
                   rounded-3xl border border-white/10 backdrop-blur-2xl bg-white/5 overflow-hidden"
      >
        {/* 🧭 Sidebar Section */}
        <div
          className={`${
            selectedUser ? "hidden" : "flex"
          } md:flex flex-shrink-0 flex-col h-full w-full md:w-[28%]
            bg-zinc-900/70 border-r border-white/10 overflow-hidden`}
        >
          <Sidebar />
        </div>

        {/* 💬 Chat Section */}
        <div
          className={`${
            selectedUser ? "flex" : "hidden"
          } md:flex flex-1 flex-col min-h-0 bg-zinc-800/60
            backdrop-blur-xl overflow-hidden`}
        >
          <MessageContainer onBack={handleBack} />
        </div>
      </div>

      {/* Soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};

export default ChatPage;
