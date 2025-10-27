import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../redux/userSlice";
import moment from "moment";
import axios from "axios";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);

  const [lastMessage, setLastMessage] = useState(null);

  // ✅ Fetch the latest message between logged-in user and this user
  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const res = await axios.get(
          `https://talknest-real-time-chat-application.onrender.com//api/v2/message/${user._id}`,
          { withCredentials: true }
        );

        const msgs = res.data?.messages || [];
        if (msgs.length > 0) {
          setLastMessage(msgs[msgs.length - 1]);
        } else {
          setLastMessage(null);
        }
      } catch (err) {
        console.error("❌ Error fetching last message:", err);
      }
    };

    fetchLastMessage();

    // ✅ Listen for real-time incoming messages (Socket.IO)
    if (socket) {
      const handleNewMessage = (newMsg) => {
        // Update only if message involves this user
        if (
          (newMsg.senderId === user._id && newMsg.receiverId === authUser._id) ||
          (newMsg.senderId === authUser._id && newMsg.receiverId === user._id)
        ) {
          setLastMessage(newMsg);
        }
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [user._id, socket, authUser._id]);

  // 🟩 Handle user selection
  const handleSelectUser = () => {
    dispatch(setSelectedUser(user));
  };

  // 🧠 Format last message + time
  const lastText = lastMessage
    ? lastMessage.message?.length > 30
      ? `${lastMessage.message.substring(0, 30)}...`
      : lastMessage.message
    : "No messages yet";

  const lastTime = lastMessage ? moment(lastMessage.createdAt).fromNow() : "";

  // 🟢 Check if this user is online
  const isOnline = onlineUsers?.includes(user._id);

  return (
    <div
      onClick={handleSelectUser}
      className={`flex gap-2 items-center hover:bg-gray-700 rounded-lg p-2 cursor-pointer transition duration-200 ease-in-out ${
        selectedUser?._id === user._id ? "bg-gray-800" : ""
      }`}
    >
      {/* 🖼️ Avatar + Online Indicator */}
      <div className="relative">
        <img
          src={
            user?.profilePhoto ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt={user?.fullName || "User"}
          className="w-12 h-12 rounded-full object-cover border border-gray-600"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
        )}
      </div>

      {/* 🧾 User Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-white font-medium truncate">
            {user?.fullName || "Unknown"}
          </p>
          {lastTime && (
            <p className="text-xs text-gray-400 whitespace-nowrap">{lastTime}</p>
          )}
        </div>

        <p className="text-gray-400 text-sm truncate italic">{lastText}</p>
      </div>
    </div>
  );
};

export default OtherUser;
