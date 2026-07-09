import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: null,
    profileData: null,
    following: null,
    notifications: [],
    savedPostsData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setSavedPostsData: (state, action) => {
      state.savedPostsData = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  setFollowing,
  setNotifications,
  setSavedPostsData,
} = userSlice.actions;
export default userSlice.reducer;
