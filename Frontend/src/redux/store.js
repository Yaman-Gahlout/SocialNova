import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user.slice";
import postReducer from "./slice/post.slice";
import storyReducer from "./slice/story.slice";
import messageReducer from "./slice/message.slice";
import socketReducer from "./slice/socket.slice";
const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    story: storyReducer,
    message: messageReducer,
    socket: socketReducer,
  },
});

export default store;
