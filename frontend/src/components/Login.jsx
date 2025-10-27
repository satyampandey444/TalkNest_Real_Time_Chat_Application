import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { setAuthUser } from "../../redux/userSlice";

const Login = () => {
  const [User, setUser] = useState({
    userName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/user/login",
        User,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const userData = res.data.user || res.data;
      const normalizedUser = {
        ...userData,
        fullName: userData.fullName || userData.userName,
      };

      dispatch(setAuthUser(normalizedUser));
      localStorage.setItem("authUser", JSON.stringify(normalizedUser));

      toast.success(res.data.message || "Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }

    setUser({ userName: "", password: "" });
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 card w-full max-w-md shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-white"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h2>

        <motion.form
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-5"
        >
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="form-control"
          >
            <label className="label">
              <span className="text-sm p-2 text-gray-200">Username</span>
            </label>
            <input
              value={User.userName}
              onChange={(e) => setUser({ ...User, userName: e.target.value })}
              type="text"
              placeholder="Enter your username"
              className="input input-bordered w-full bg-white/20 placeholder-gray-300 focus:bg-white/30 text-white"
              required
            />
          </motion.div>

          {/* Password with Eye Toggle 👁️ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="form-control"
          >
            <label className="label">
              <span className="text-sm p-2 text-gray-200">Password</span>
            </label>

            <div className="relative w-full">
              <input
                value={User.password}
                onChange={(e) => setUser({ ...User, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full bg-white/20 placeholder-gray-300 focus:bg-white/30 text-white pr-12"
                required
              />

              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </motion.button>
            </div>
          </motion.div>

          {/* Remember Me + Forgot Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-between items-center text-sm mt-3"
          >
            
              {/*<a href="/forgot-password" className="text-blue-400 hover:underline">
                Forgot password?
              </a>?*/}
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="submit"
            className="btn w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform"
          >
            Login
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="divider text-gray-300"
          >
            or
          </motion.div>


          {/* Signup Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-sm text-center mt-4"
          >
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Create one
            </a>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
