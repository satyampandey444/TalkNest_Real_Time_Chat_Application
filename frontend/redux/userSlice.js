import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: null,
    typingUser: null, // 🆕 Track which user is typing
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    clearAuthUser: (state) => {
      state.authUser = null;
      state.otherUsers = null;
      state.selectedUser = null;
      state.onlineUsers = null;
      state.typingUser = null; // 🧹 Clear typing state too
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // 🆕 Typing indicator reducers
    setTypingUser: (state, action) => {
      state.typingUser = action.payload; // store the ID of user who is typing
    },
    clearTypingUser: (state) => {
      state.typingUser = null; // clear when they stop typing
    },
  },
});

export const {
  setAuthUser,
  clearAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  setTypingUser,     // 🆕
  clearTypingUser,   // 🆕
} = userSlice.actions;

export default userSlice.reducer;
