import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Left - Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">
            Talk<span className="text-blue-400">Nest</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Connect, chat, and grow with AI-driven conversations that feel human.
          </p>
        </div>

        

        {/* Right - Social Icons */}
        <div className="flex space-x-4 text-lg">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} TalkNest. All rights reserved.
        <p className="text-gray-400 text-sm">
          Designed and developed with ❤️ by Satyam.
        </p>
      </div>

      
        
    </footer>
  );
};

export default Footer;
