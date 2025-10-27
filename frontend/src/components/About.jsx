import React from "react";
import { motion } from "framer-motion";
import { FaComments, FaHeart, FaUsers, FaBrain } from "react-icons/fa";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-16">

      {/* Animated background glows */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      ></motion.div>
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity }}
      ></motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
      >
        About TalkNest
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-2xl text-center text-gray-300 text-lg mb-12"
      >
        TalkNest is your cozy corner of the internet — a place to connect, chat, and collaborate
        with people worldwide. Built with love and powered by modern AI.
      </motion.p>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {[
          {
            icon: <FaComments className="w-10 h-10 text-blue-400" />,
            title: "Seamless Chat",
            desc: "Enjoy real-time, secure, and private conversations in an elegant chat interface.",
          },
          {
            icon: <FaBrain className="w-10 h-10 text-purple-400" />,
            title: "AI-Powered",
            desc: "Get smart suggestions, summaries, and creative replies using AI integration.",
          },
          {
            icon: <FaUsers className="w-10 h-10 text-pink-400" />,
            title: "Global Community",
            desc: "Meet people from all over the world in a safe and engaging environment.",
          },
          {
            icon: <FaHeart className="w-10 h-10 text-red-400" />,
            title: "Built with Passion",
            desc: "Crafted by developers who care about meaningful digital communication.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.05] transition-transform"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-16 text-center max-w-xl"
      >
        <p className="text-gray-400 text-sm">
          Designed and developed with ❤️ by the Satyam Pandey.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
