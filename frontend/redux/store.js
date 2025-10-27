import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import messageReducer from "./messageSlice";
import socketReducer from "./socketSlice";

// ✅ Safely load user from localStorage
const savedUser = localStorage.getItem("authUser");
const parsedUser =
  savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;

const preloadedState = {
  user: {
    authUser: parsedUser,
    otherUsers: null, // ✅ lowercase fix
    selectedUser: null,
    onlineUsers: null, // ✅ include to prevent undefined later
  },
};

const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    socket: socketReducer,
  },
  preloadedState, // ✅ preload Redux with localStorage user
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"], // ✅ ignore non-serializable socket
      },
    }),
});

export default store;
