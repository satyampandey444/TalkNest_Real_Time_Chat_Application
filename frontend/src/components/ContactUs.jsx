// src/components/ContactUs.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon ✨");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-16">
      {/* Background glowing blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
      >
        Contact Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-gray-300 mb-12 max-w-2xl text-center"
      >
        Have questions, feedback, or just want to say hi? We’d love to hear from you.
      </motion.p>

      {/* Contact Info + Form */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 w-full max-w-6xl">

        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:w-1/3 shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
        >
          <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Made by Satyam Pandey 💻
          </h2>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-white">Email</h3>
              <p className="text-gray-300 text-sm">satyam@talknest.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-green-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-white">Phone</h3>
              <p className="text-gray-300 text-sm">+91 6388895505</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-pink-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-white">Location</h3>
              <p className="text-gray-300 text-sm">India</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full md:w-2/3 shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className="input input-bordered w-full bg-white/20 placeholder-gray-300 focus:bg-white/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@gmail.com"
              className="input input-bordered w-full bg-white/20 placeholder-gray-300 focus:bg-white/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Message</label>
            <textarea
              rows="4"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your message..."
              className="textarea textarea-bordered w-full bg-white/20 placeholder-gray-300 focus:bg-white/30 text-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Send Message 🚀
          </motion.button>
        </motion.form>
      </div>

      {/* Footer */}
      <div className="mt-12 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} Made with ❤️ by{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">
          Satyam Pandey
        </span>
      </div>
    </div>
  );
};

export default ContactUs;
