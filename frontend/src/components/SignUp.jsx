import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Signup = () => {
  const [User, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGenderChange = (event) => {
    setUser({ ...User, gender: event.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !User.fullName ||
      !User.userName ||
      !User.password ||
      !User.confirmPassword ||
      !User.gender
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (User.password !== User.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/user/register`,
        User,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }

      setUser({
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: "",
        gender: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
      console.log("Signup Error:", error);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Animated overlay gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-indigo-900/40 to-purple-700/40"
      ></motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Create Account
        </motion.h2>

        <motion.form
          onSubmit={onSubmitHandler}
          className="space-y-5 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: "Full Name", key: "fullName", type: "text" },
            { label: "Username", key: "userName", type: "text" },
          ].map((input, i) => (
            <motion.div
              key={input.key}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="form-control"
            >
              <label className="text-sm text-gray-200">{input.label}</label>
              <input
                type={input.type}
                value={User[input.key]}
                onChange={(e) => setUser({ ...User, [input.key]: e.target.value })}
                placeholder={`Enter your ${input.label.toLowerCase()}`}
                className="input input-bordered w-full bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </motion.div>
          ))}

          {/* Password work is here !*/}
          {[
            { label: "Password", key: "password", show: showPassword, setShow: setShowPassword },
            {
              label: "Confirm Password",
              key: "confirmPassword",
              show: showConfirmPassword,
              setShow: setShowConfirmPassword,
            },
          ].map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="form-control relative"
            >
              <label className="text-sm text-gray-200">{field.label}</label>
              <input
                type={field.show ? "text" : "password"}
                value={User[field.key]}
                onChange={(e) => setUser({ ...User, [field.key]: e.target.value })}
                placeholder={field.label}
                className="input input-bordered w-full bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:ring-2 focus:ring-blue-400 pr-10 transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-300 hover:text-white transition-colors"
                onClick={() => field.setShow(!field.show)}
              >
                {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>
          ))}

          {/* Gender Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-6 text-sm mt-3"
          >
            {["Male", "Female"].map((gender) => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={User.gender === gender}
                  onChange={handleGenderChange}
                  className="radio radio-info"
                />
                <span>{gender}</span>
              </label>
            ))}
          </motion.div>

          {/* Signup Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139,92,246,0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            type="submit"
            className="btn w-full mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-none text-white font-semibold shadow-lg"
          >
            Sign Up
          </motion.button>

          {/* Divider */}
          <div className="divider text-gray-400 mt-6">or</div>

          

          <p className="text-sm text-center mt-4 text-gray-300">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Login here
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signup;
