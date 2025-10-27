import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { clearAuthUser } from "../../redux/userSlice"; // adjust path if needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Fixed logout handler
  const handleLogout = async () => {
    try {
      // 1️⃣ Call backend to clear the JWT cookie
      await axios.post(
        "https://talknest-real-time-chat-application.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true } // Important for cookies
      );

      // 2️⃣ Clear Redux and localStorage
      dispatch(clearAuthUser());
      localStorage.removeItem("authUser");

      // 3️⃣ Show confirmation
      toast.success("Logged out successfully!");

      // 4️⃣ Redirect to login page
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
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            TalkNest
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8 items-center">
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

            {/* Logout Button */}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 transition text-sm"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-200 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700">
            <ul className="flex flex-col space-y-2 px-6 py-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 ${
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

              {/* Logout for mobile */}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left py-2 text-sm bg-red-600 rounded-md hover:bg-red-500"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
