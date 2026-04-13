import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postsData: null,
  },
  reducers: {
    setPostsData: (state, action) => {
      state.postsData = action.payload;
    },
  },
});

export const { setPostsData } = postSlice.actions;
export default postSlice.reducer;
