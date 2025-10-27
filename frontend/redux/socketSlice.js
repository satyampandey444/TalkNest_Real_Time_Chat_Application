// src/redux/socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,       // stores the socket instance
    isConnected: false, // flag to track connection status
  },
  reducers: {
    setSocket: (state, action) => {
      const socket = action.payload;
      state.socket = socket;

      // ✅ safer: if socket exists and is connected, mark true
      state.isConnected = !!(socket && socket.connected);
    },

    clearSocket: (state) => {
      // safely clear socket when user logs out or disconnects
      if (state.socket) {
        try {
          if (state.socket.connected) {
            state.socket.disconnect();
          }
        } catch (err) {
          console.warn("⚠️ Socket already disconnected or invalid:", err);
        }
      }

      state.socket = null;
      state.isConnected = false;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
