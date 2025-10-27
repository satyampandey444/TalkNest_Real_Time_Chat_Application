import React, { useRef, useEffect, useState } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react"; // install lucide-react or replace icon

const MessageContainer = ({ onBack }) => {
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const messagesEndRef = useRef(null);
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white text-center rounded-r-2xl">
        <h1 className="text-4xl font-bold mb-2">Hi, {authUser?.fullName || "Friend"} 👋</h1>
        <p className="text-lg text-gray-400 max-w-sm">Select a user from the sidebar to start chatting 💬</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 backdrop-blur-xl rounded-r-2xl overflow-hidden border border-zinc-800">
        {/* header */}
        <div className="sticky top-0 z-30 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-700/50 px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 rounded-md hover:bg-zinc-800">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full overflow-hidden ring-2 cursor-pointer ${
                isOnline ? "ring-green-500/70" : "ring-zinc-600/60"
              }`}
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={selectedUser.profilePhoto || "/default-avatar.png"}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold truncate max-w-[200px]">{selectedUser.fullName || selectedUser.userName}</span>
              <span className="text-sm text-gray-400">{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        {/* messages area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <Messages />
          <div ref={messagesEndRef} />
        </div>

        {/* input */}
        <div className="sticky bottom-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-700/50 px-4 py-3">
          <SendInput />
        </div>
      </div>

      {/* ✅ Modal for profile photo */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={selectedUser.profilePhoto || "/default-avatar.png"}
            alt="Profile Full"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default MessageContainer;
