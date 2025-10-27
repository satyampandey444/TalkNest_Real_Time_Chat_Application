import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, UserPlus, Check } from "lucide-react";

const FindFriends = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]); // incoming
  const [sentRequests, setSentRequests] = useState([]); // outgoing
  const [friends, setFriends] = useState([]); // confirmed friends ✅

  // ✅ Fetch incoming & sent friend requests
  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get(
        "https://talknest-real-time-chat-application.onrender.com//api/v1/friends/requests",
        { withCredentials: true }
      );
      setFriendRequests(data.received || []);
      setSentRequests(data.sent || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load friend requests");
    }
  };

  // ✅ Fetch confirmed friends
  const fetchFriendsList = async () => {
    try {
      const { data } = await axios.get(
        "https://talknest-real-time-chat-application.onrender.com//api/v1/friends/list",
        { withCredentials: true }
      );
      setFriends(data.friends || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load friends list");
    }
  };

  // ✅ Search users
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://talknest-real-time-chat-application.onrender.com//api/v1/user/search?query=${query}`,
        { withCredentials: true }
      );
      setResults(data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send friend request
  const handleSendRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `https://talknest-real-time-chat-application.onrender.com//api/v1/friends/send-request/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message || "Request sent!");
      fetchFriendRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  // ✅ Accept friend request
  const handleAcceptRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `https://talknest-real-time-chat-application.onrender.com//api/v1/friends/accept-request/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message || "Friend request accepted!");
      fetchFriendRequests();
      fetchFriendsList(); // ✅ refresh confirmed friends
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  // ✅ Load all data initially
  useEffect(() => {
    fetchFriendRequests();
    fetchFriendsList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 flex flex-col md:flex-row gap-10">
      {/* =================== LEFT SIDE - Requests & Friends =================== */}
      <div className="md:w-1/2 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Friend Requests 💌
        </h2>

        {/* Received Requests */}
        <div className="space-y-4">
          {friendRequests.length > 0 ? (
            friendRequests.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-white/10 p-4 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                  />
                  <div>
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-gray-400 text-sm">@{user.userName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptRequest(user._id)}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Check size={18} /> Accept
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No pending requests</p>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700" />

        {/* Sent Requests */}
        <h3 className="text-xl font-semibold text-gray-300 mb-3">
          Sent Requests 📤
        </h3>
        <div className="space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-white/5 p-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-10 h-10 rounded-full border border-blue-400"
                  />
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <span className="text-sm text-gray-400">@{user.userName}</span>
                  </div>
                </div>
                <span className="text-yellow-400 font-medium">⏳ Sent</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No sent requests</p>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700" />

        {/* ✅ Friends List */}
        <h3 className="text-xl font-semibold text-gray-300 mb-3">
          Friends 👥
        </h3>
        <div className="space-y-4">
          {friends.length > 0 ? (
            friends.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-white/5 p-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-10 h-10 rounded-full border border-green-400"
                  />
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <span className="text-sm text-gray-400">@{user.userName}</span>
                  </div>
                </div>
                <span className="text-green-400 font-medium">✅ Friends</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No friends yet</p>
          )}
        </div>
      </div>

      {/* =================== RIGHT SIDE - Find Friends =================== */}
      <div className="md:w-1/2 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Find Friends 🔍
        </h2>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white/10 rounded-full px-4 py-2 border border-white/20"
        >
          <Search className="text-gray-300 mr-3" />
          <input
            type="text"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-white w-full outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="ml-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Results */}
        <div className="mt-8 space-y-4">
          {results.length > 0 ? (
            results.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-gray-400">@{user.userName}</p>
                  </div>
                </div>

                {user.status === "friends" ? (
                  <span className="text-green-400 font-medium">✅ Friends</span>
                ) : user.status === "sent" ? (
                  <span className="text-yellow-400 font-medium">⏳ Sent</span>
                ) : user.status === "pending" ? (
                  <button
                    onClick={() => handleAcceptRequest(user._id)}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <Check size={18} /> Accept
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <UserPlus size={18} /> Add Friend
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-6">
              {loading ? "Searching..." : "No users found"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
