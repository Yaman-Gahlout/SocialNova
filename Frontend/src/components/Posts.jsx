import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiBookmark, FiUser, FiMapPin, FiLink } from "react-icons/fi";
import { setPostsData } from "../redux/slice/post.slice";

function Posts() {
  const [tab, setTab] = useState("Post");
  const profileData = useSelector((state) => state.user.profileData);
  const userData = useSelector((state) => state.user.userData);
  const postsData = useSelector((state) => state.post.postsData);
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="mb-[60px]">
      <div className="flex justify-center gap-12 mt-8 border-b border-slate-800">
        <button
          className={`flex items-center gap-2 py-3 text-slate-400 hover:text-white transition ${tab === "Post" && "text-[#00D4FF] border-b-2 border-[#00D4FF] font-medium"}`}
          onClick={() => setTab("Post")}
        >
          <FiGrid /> <span className="text-sm">Posts</span>
        </button>

        {userData._id === profileData._id && (
          <button
            className={`flex items-center gap-2 py-3 text-slate-400 hover:text-white transition ${tab === "Saved" && "text-[#00D4FF] border-b-2 border-[#00D4FF] font-medium"}`}
            onClick={() => setTab("Saved")}
          >
            <FiBookmark /> <span className="text-sm">Saved</span>
          </button>
        )}
      </div>
      {tab === "Post" && profileData.posts.length === 0 ? (
        <div className="flex  justify-center items-center">
          <button
            onClick={() => navigate("/createPost")}
            className="px-5 py-2 mt-[40px] rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition shadow-lg"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-wrap gap-4 mt-8 items-center justify-center ${tab !== "Post" && "hidden"}`}
        >
          {profileData.posts.map((post) => (
            <Post key={post._id} post={post} profileData={profileData} />
          ))}
        </div>
      )}
      {tab === "Saved" && profileData.savedPosts.length === 0 ? (
        <div className="flex justify-center items-center">
          <button className="px-5 py-2 mt-[40px] rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition shadow-lg">
            No Saved Post
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-wrap gap-4 mt-8 items-center justify-center ${tab !== "Saved" && "hidden"}`}
        >
          {profileData.savedPosts.map((post) => (
            <Post key={post._id} post={post} profileData={profileData} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;
