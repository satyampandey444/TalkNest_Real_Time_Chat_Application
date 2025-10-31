import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { clearAuthUser } from "../../redux/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      dispatch(clearAuthUser());
      localStorage.removeItem("authUser");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const isAuthenticated = !!authUser;

  const loggedOutLinks = [
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/register" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const loggedInLinks = [
    { name: "AI Friend", path: "/aichat" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Chats", path: "/chat" },
    { name: "Profile", path: "/profile" },
    { name: "Find Friends", path: "/friends" },
  ];

  const navLinks = isAuthenticated ? loggedInLinks : loggedOutLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/70 backdrop-blur-md text-white shadow-md border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            TalkNest
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-blue-400 transition ${
                      isActive ? "text-blue-400 font-semibold" : "text-gray-200"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition text-sm"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-200 focus:outline-none p-2 rounded-md hover:bg-gray-700 active:scale-95 transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 w-full">
            <ul className="flex flex-col space-y-3 px-5 py-4 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-base ${
                        isActive
                          ? "text-blue-400 font-semibold"
                          : "text-gray-300 hover:text-blue-400"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left py-2 text-base bg-red-600 rounded-md hover:bg-red-500 transition"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav height */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;
