import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // check login status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("https://talknest-real-time-chat-application.onrender.com//api/auth/check", {
          withCredentials: true,
        });
        setIsAuthenticated(res.data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // logout function
  const logout = async () => {
    await axios.post("https://talknest-real-time-chat-application.onrender.com//api/auth/logout", {}, { withCredentials: true });
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
