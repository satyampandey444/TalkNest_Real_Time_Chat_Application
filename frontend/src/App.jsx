import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import ChatPage from "./components/ChatPage";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import AIChat from "./components/AiChat";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import ProfilePage from "./components/ProfilePage";
import FindFriends from "./components/FindFriends";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocket, clearSocket } from "../redux/socketSlice";
import { setOnlineUsers } from "../redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socket);
  const { authUser } = useSelector((store) => store.user);

  // ✅ Socket.IO connection logic
  useEffect(() => {
    // If no user is logged in, ensure socket is disconnected
    if (!authUser?._id) {
      if (socket && socket.connected) {
        socket.disconnect();
      }
      dispatch(clearSocket());
      return;
    }

    // Prevent duplicate connections
    if (socket && socket.connected) return;

    // Create a new socket connection
    const newSocket = io("https://talknest-real-time-chat-application.onrender.com", {
      query: { userId: authUser._id },
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 5, // retry a few times if it fails
      reconnectionDelay: 1000,
    });

    // Store in Redux
    dispatch(setSocket(newSocket));

    // Listen for online users
    newSocket.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    // ✅ Safe cleanup
    return () => {
      if (newSocket && newSocket.connected) {
        newSocket.off("getOnlineUsers");
        newSocket.disconnect();
      }
      dispatch(clearSocket());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?._id, dispatch]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Routes>
          {/* ✅ Protected Pages */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aichat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <FindFriends />
              </ProtectedRoute>
            }
          />

          {/* 🟢 Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
