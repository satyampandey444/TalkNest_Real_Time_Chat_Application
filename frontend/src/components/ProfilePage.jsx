import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { setAuthUser } from "../../redux/userSlice";

const ProfilePage = () => {
  const { authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    fullName: authUser?.fullName || "",
    userName: authUser?.userName || "",
    password: "",
    confirmPassword: "",
    gender: authUser?.gender || "",
    profilePhoto: authUser?.profilePhoto || "",
  });

  const [previewImage, setPreviewImage] = useState(authUser?.profilePhoto || "");
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle image selection + size validation (max 5 MB)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setProfile({ ...profile, profilePhoto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.password && profile.password !== profile.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/user/update-profile",
        profile,
        { withCredentials: true }
      );

      toast.success(data.message || "Profile updated successfully!");

      dispatch(setAuthUser(data.user));
      localStorage.setItem("authUser", JSON.stringify(data.user));

      setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-lg p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Edit Profile
        </h2>

        {/* Profile Picture (clickable) */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={
                previewImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/50 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-2 rounded-full cursor-pointer transition"
              onClick={(e) => e.stopPropagation()} // prevent opening modal when editing
            >
              ✎
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Click the picture to view full size
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="input input-bordered w-full bg-white/20 text-white focus:bg-white/30"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Username</label>
            <input
              type="text"
              value={profile.userName}
              onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
              className="input input-bordered w-full bg-white/20 text-white focus:bg-white/30"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">New Password</label>
            <input
              type="password"
              value={profile.password}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
              className="input input-bordered w-full bg-white/20 text-white focus:bg-white/30"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={profile.confirmPassword}
              onChange={(e) =>
                setProfile({ ...profile, confirmPassword: e.target.value })
              }
              className="input input-bordered w-full bg-white/20 text-white focus:bg-white/30"
              placeholder="Confirm new password"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="select select-bordered w-full bg-white/20 text-white focus:bg-white/55"
            >
              <option value="" className="text-black">
                Select Gender
              </option>
              <option value="Male" className="text-black">
                Male
              </option>
              <option value="Female" className="text-black">
                Female
              </option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn w-full bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white font-semibold shadow-lg mt-4"
          >
            {loading ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </motion.div>

      {/* ✅ Full Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={
                previewImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Full Preview"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90%] max-h-[80%] rounded-2xl shadow-2xl object-contain border border-white/20"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking on image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
