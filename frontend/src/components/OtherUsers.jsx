import React, { useEffect, useState } from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";
import axios from "axios";

const OtherUsers = () => {
  useGetOtherUsers(); // Fetch other users
  const { otherUsers, authUser, loading } = useSelector((store) => store.user);
  const [latestMessages, setLatestMessages] = useState([]);

  // ✅ Fetch latest messages for sidebar previews
  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const res = await axios.get("https://talknest-real-time-chat-application.onrender.com//api/v2/message/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          setLatestMessages(res.data.messages);
        }
      } catch (error) {
        console.error("❌ Error fetching latest messages:", error);
      }
    };

    fetchLatestMessages();
  }, []);

  // 🧠 Helper: get latest message for a specific user
  const getLastMessage = (userId) => {
    return latestMessages.find(
      (msg) =>
        msg.senderId === userId || msg.receiverId === userId
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-400 text-center flex-1 flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  if (!Array.isArray(otherUsers) || otherUsers.length === 0) {
    return (
      <div className="p-4 text-gray-400 text-center flex-1 flex items-center justify-center">
        No users found.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      {otherUsers.map((user) => {
        const lastMsg = getLastMessage(user._id);
        return (
          <OtherUser
            key={user._id}
            user={user}
            lastMessage={lastMsg}
            isOwn={lastMsg?.senderId === authUser?._id}
          />
        );
      })}
    </div>
  );
};

export default OtherUsers;
