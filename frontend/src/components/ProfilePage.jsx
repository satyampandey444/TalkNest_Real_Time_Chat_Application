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

  // ✅ Image Change Handler
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

  // ✅ Profile Submit Handler
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden px-4 sm:px-6 py-10">
      {/* Animated Glows */}
      <div className="absolute -top-40 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md sm:max-w-lg p-6 sm:p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-xl text-white"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          My Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowImageModal(true)}
          >
            <motion.img
              src={
                previewImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500/60 shadow-md transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-2 rounded-full cursor-pointer shadow-md"
              onClick={(e) => e.stopPropagation()}
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
          <p className="text-gray-400 text-xs mt-2 text-center">
            Tap the picture to view full size
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "fullName", type: "text" },
            { label: "Username", key: "userName", type: "text" },
            { label: "New Password", key: "password", type: "password" },
            { label: "Confirm Password", key: "confirmPassword", type: "password" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-gray-300 text-sm mb-1">{label}</label>
              <input
                type={type}
                value={profile[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="w-full bg-white/20 text-white rounded-lg px-4 py-2 focus:bg-white/30 outline-none transition text-sm sm:text-base placeholder-gray-400"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Gender Dropdown */}
          <div>
            <label className="block text-gray-300 text-sm mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="w-full bg-white/20 text-white rounded-lg px-4 py-2 focus:bg-white/30 outline-none transition text-sm sm:text-base"
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

          {/* Update Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 sm:py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-700/30 transition text-sm sm:text-base"
          >
            {loading ? "Updating..." : "Save Changes"}
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm px-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.img
              src={
                previewImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Full Preview"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[95%] max-h-[85%] rounded-2xl shadow-2xl object-contain border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
