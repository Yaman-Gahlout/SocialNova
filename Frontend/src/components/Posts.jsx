import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiBookmark, FiUser, FiMapPin, FiLink } from "react-icons/fi";
import { setPostsData } from "../redux/slice/post.slice";
import SavePost from "./SavePost";

function Posts() {
  const [tab, setTab] = useState("Post");
  const profileData = useSelector((state) => state.user.profileData);
  console.log("Profile Data in profile page : ", profileData);
  const userData = useSelector((state) => state.user.userData);
  const postsData = useSelector((state) => state.post.postsData);

  return (
    <div className="mb-[60px]">
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111827]/80 p-2 backdrop-blur-xl shadow-lg">
          {/* Posts */}

          <button
            onClick={() => setTab("Post")}
            className={`
        relative
        flex
        items-center
        gap-2
        rounded-xl
        px-5
        py-3
        text-sm
        font-medium
        transition-all
        duration-300
        ${
          tab === "Post"
            ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }
      `}
          >
            <FiGrid size={18} />

            <span className="hidden sm:block">Posts</span>
          </button>

          {/* Saved */}

          {userData._id === profileData._id && (
            <button
              onClick={() => setTab("Saved")}
              className={`
          relative
          flex
          items-center
          gap-2
          rounded-xl
          px-5
          py-3
          text-sm
          font-medium
          transition-all
          duration-300
          ${
            tab === "Saved"
              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }
        `}
            >
              <FiBookmark size={18} />

              <span className="hidden sm:block">Saved</span>
            </button>
          )}
        </div>
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
            <Post
              key={post._id}
              post={post}
              profileData={profileData}
              currentTab={"post"}
            />
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
            <SavePost
              key={post._id}
              post={post}
              profileData={profileData}
              //savePostsData={savePostsData}
              //setSavePostsData={setSavePostsData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Posts;
