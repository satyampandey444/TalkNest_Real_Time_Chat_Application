// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../../redux/userSlice";
import { setMessages, clearMessages } from "../../redux/messageSlice";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers, authUser } = useSelector((store) => store.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fetch all messages on mount (for preview)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("https://talknest-real-time-chat-application.onrender.com//api/v2/message/all", {
          withCredentials: true,
        });
        if (res.data?.messages) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };

    if (authUser) fetchMessages();
  }, [authUser, dispatch]);

  // ✅ Logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "https://talknest-real-time-chat-application.onrender.com//api/v1/user/logout",
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message || "Logged out");
      dispatch(setAuthUser(null));
      dispatch(clearMessages());
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
      navigate("/login");
    } catch (err) {
      console.error("❌ Logout Error:", err);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // ✅ Search handler
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const conversationUser = otherUsers?.find((u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    if (conversationUser) {
      dispatch(setOtherUsers([conversationUser]));
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <div
      className="flex flex-col h-full w-full 
      bg-gradient-to-b from-[#101010] to-[#181818]
      border-r border-white/10 overflow-hidden"
    >
      {/* 🔍 Search Bar */}
      <div className="p-3 border-b border-white/10 bg-zinc-900/60">
        <form
          onSubmit={searchSubmitHandler}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-zinc-800/60"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
            placeholder="Search user..."
          />
          <button
            type="submit"
            className="p-2 rounded-md bg-zinc-700/80 hover:bg-zinc-600 transition"
          >
            <BiSearchAlt2 className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>

      {/* 👥 Other Users (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent px-2 py-2">
        {/* ✅ Pass messages so previews show instantly */}
        <OtherUsers />
      </div>

      {/* 🚪 Logout Button */}
      <div className="border-t border-white/10 bg-zinc-900/60 p-3">
        <button
          onClick={logoutHandler}
          className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
