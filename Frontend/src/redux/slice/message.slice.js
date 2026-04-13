import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    oldChatUsers: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setOldChatUsers: (state, action) => {
      state.oldChatUsers = action.payload;
    },
  },
});

export const { setSelectedUser, setMessages, setOldChatUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
