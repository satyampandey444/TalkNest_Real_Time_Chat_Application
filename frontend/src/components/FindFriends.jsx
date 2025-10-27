import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, UserPlus, Check } from "lucide-react";

const FindFriends = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchFriendRequests = async () => {
    try {
      const { data } = await axios.get(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/friends/requests",
        { withCredentials: true }
      );
      setFriendRequests(data.received || []);
      setSentRequests(data.sent || []);
    } catch (error) {
      toast.error("Failed to load friend requests");
    }
  };

  const fetchFriendsList = async () => {
    try {
      const { data } = await axios.get(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/friends/list",
        { withCredentials: true }
      );
      setFriends(data.friends || []);
    } catch (error) {
      toast.error("Failed to load friends list");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://talknest-real-time-chat-application.onrender.com/api/v1/user/search?query=${query}`,
        { withCredentials: true }
      );
      setResults(data.users || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `https://talknest-real-time-chat-application.onrender.com/api/v1/friends/send-request/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message || "Request sent!");
      fetchFriendRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      const { data } = await axios.post(
        `https://talknest-real-time-chat-application.onrender.com/api/v1/friends/accept-request/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message || "Friend request accepted!");
      fetchFriendRequests();
      fetchFriendsList();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendsList();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10">
      {/* =================== LEFT SIDE =================== */}
      <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Friend Requests 💌
        </h2>

        {/* Received Requests */}
        <div className="space-y-3 sm:space-y-4">
          {friendRequests.length > 0 ? (
            friendRequests.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-white/10 p-3 sm:p-4 rounded-xl"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-400"
                  />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {user.fullName}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      @{user.userName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcceptRequest(user._id)}
                  className="bg-green-600 hover:bg-green-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full flex items-center gap-1.5 sm:gap-2"
                >
                  <Check size={16} /> Accept
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-sm">
              No pending requests
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-4 sm:my-6 border-t border-gray-700" />

        {/* Sent Requests */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3">
          Sent Requests 📤
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {sentRequests.length > 0 ? (
            sentRequests.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-blue-400"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {user.fullName}
                    </p>
                    <span className="text-xs sm:text-sm text-gray-400">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <span className="text-yellow-400 font-medium text-xs sm:text-sm">
                  ⏳ Sent
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-sm">
              No sent requests
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-4 sm:my-6 border-t border-gray-700" />

        {/* Friends */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-3">
          Friends 👥
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {friends.length > 0 ? (
            friends.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-green-400"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {user.fullName}
                    </p>
                    <span className="text-xs sm:text-sm text-gray-400">
                      @{user.userName}
                    </span>
                  </div>
                </div>
                <span className="text-green-400 font-medium text-xs sm:text-sm">
                  ✅ Friends
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-sm">
              No friends yet
            </p>
          )}
        </div>
      </div>

      {/* =================== RIGHT SIDE =================== */}
      <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Find Friends 🔍
        </h2>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 rounded-full px-3 sm:px-4 py-2 border border-white/20"
        >
          <div className="flex items-center w-full sm:w-auto gap-2">
            <Search className="text-gray-300" />
            <input
              type="text"
              placeholder="Search by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white w-full outline-none placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-5 py-2 rounded-full font-semibold hover:scale-105 transition text-sm sm:text-base"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Search Results */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          {results.length > 0 ? (
            results.map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white/10 p-3 sm:p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={
                      user.profilePhoto ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-400"
                  />
                  <div>
                    <h3 className="text-sm sm:text-lg font-semibold">
                      {user.fullName}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      @{user.userName}
                    </p>
                  </div>
                </div>

                {user.status === "friends" ? (
                  <span className="text-green-400 font-medium text-xs sm:text-sm">
                    ✅ Friends
                  </span>
                ) : user.status === "sent" ? (
                  <span className="text-yellow-400 font-medium text-xs sm:text-sm">
                    ⏳ Sent
                  </span>
                ) : user.status === "pending" ? (
                  <button
                    onClick={() => handleAcceptRequest(user._id)}
                    className="bg-green-600 hover:bg-green-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                  >
                    <Check size={16} /> Accept
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className="bg-blue-600 hover:bg-blue-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                  >
                    <UserPlus size={16} /> Add Friend
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-4 sm:mt-6 text-sm">
              {loading ? "Searching..." : "No users found"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindFriends;
