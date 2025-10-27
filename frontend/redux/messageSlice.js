// src/redux/messageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [], // ✅ Always an array for easy mapping
  },
  reducers: {
    // ✅ Replace all messages (e.g., when fetching from API)
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },

    // ✅ Add a single new message (e.g., socket.io incoming)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // ✅ Clear messages on logout or user switch
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
