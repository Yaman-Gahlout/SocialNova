import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart, FaBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { FiBookmark, FiSend } from "react-icons/fi";
import axios from "axios";
import { setPostsData } from "../redux/slice/post.slice";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/userImage.avif";
import { setProfileData, setUserData } from "../redux/slice/user.slice";
import VideoPlayer from "./VideoPlayer";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

function Feed() {
  const postsData = useSelector((state) => state.post.postsData);
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================= LOCAL STATE =================
  const [openComments, setOpenComments] = useState({});
  const [commentText, setCommentText] = useState({});

  if (!userData?._id) return null;

  // ================= PROFILE CLICK =================
  const clickHandler = async (username) => {
    try {
      const res = await axios.get(
        `https://socialnova-backend.onrender.com/users/${username}`,
        {
          withCredentials: true,
        },
      );
      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch (err) {
      navigate("/home");
    }
  };

  // ================= TOGGLE COMMENTS =================
  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // ================= LIKE =================
  async function likeHandler(postId) {
    try {
      const response = await axios.post(
        `https://socialnova-backend.onrender.com/posts/like/${postId}`,
        {},
        { withCredentials: true },
      );

      const message = response.data?.message || response.data;

      const updatedPosts = postsData.map((post) => {
        if (post._id !== postId) return post;

        let updatedLikes = [...post.likes];

        const alreadyLiked = updatedLikes.some(
          (id) => id.toString() === userData._id.toString(),
        );

        if (message === "Post liked" && !alreadyLiked) {
          updatedLikes.push(userData._id);
        }

        if (message === "Post unliked") {
          updatedLikes = updatedLikes.filter(
            (id) => id.toString() !== userData._id.toString(),
          );
        }

        return { ...post, likes: updatedLikes };
      });

      dispatch(setPostsData(updatedPosts));
    } catch (e) {
      console.log(e);
    }
  }

  // ================= SAVE =================
  async function saveHandler(postId) {
    try {
      const response = await axios.post(
        `https://socialnova-backend.onrender.com/posts/save/${postId}`,
        {},
        { withCredentials: true },
      );

      const message = response.data?.message || response.data;

      let updatedSavedPosts;

      if (message === "Post saved") {
        const alreadySaved = userData.savedPosts.some(
          (id) => id.toString() === postId.toString(),
        );

        updatedSavedPosts = alreadySaved
          ? userData.savedPosts
          : [...userData.savedPosts, postId];

        toast.success("Post saved successfully!");
      }

      if (message === "Post unsaved") {
        updatedSavedPosts = userData.savedPosts.filter(
          (id) => id.toString() !== postId.toString(),
        );
        toast.info("Post removed from saved posts.");
      }

      dispatch(
        setUserData({
          ...userData,
          savedPosts: updatedSavedPosts,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  // ================= COMMENT =================
  async function commentHandler(postId) {
    try {
      const message = commentText[postId]?.trim();
      if (!message) return;

      const res = await axios.post(
        `https://socialnova-backend.onrender.com/posts/comment/${postId}`,
        { message },
        { withCredentials: true },
      );

      const newComment = {
        ...res.data.comment,
        author: {
          _id: userData._id,
          username: userData.username,
          profilePicture: userData.profilePicture,
        },
        message,
      };

      const updatedPosts = postsData.map((post) => {
        if (post._id !== postId) return post;

        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      });

      dispatch(setPostsData(updatedPosts));

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      toast.success("Comment added!");
    } catch (e) {
      console.log(e);
    }
  }

  async function followHandler(targetUserId) {
    try {
      const response = await axios.post(
        `https://socialnova-backend.onrender.com/users/follow/${targetUserId}`,
        {},
        { withCredentials: true },
      );

      const message = response.data?.message || response.data;

      let updatedFollowing;
      if (message === "User followed") {
        updatedFollowing = [...userData.following, targetUserId];
        toast.success("User followed!");
      }

      if (message === "User unfollowed") {
        updatedFollowing = userData.following.filter(
          (id) => id.toString() !== targetUserId.toString(),
        );
        toast.info("User unfollowed.");
      }

      dispatch(
        setUserData({
          ...userData,
          following: updatedFollowing,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  // ================= RENDER =================
  return (
    <div className="lg:col-span-8 space-y-6">
      {postsData?.map((post) => {
        const isLiked = post?.likes?.some(
          (id) => id.toString() === userData?._id?.toString(),
        );

        const isSaved = userData?.savedPosts?.some(
          (id) => id.toString() === post?._id?.toString(),
        );

        const isFollowing = userData?.following?.some(
          (id) => id.toString() === post?.author?._id?.toString(),
        );

        return (
          <div
            key={post._id}
            className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden"
          >
            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between border-b border-slate-800">
              <div className="p-4 flex items-center gap-3">
                <img
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                  onClick={() => clickHandler(post?.author.username)}
                  src={post?.author?.profilePicture || profileImage}
                  alt="user"
                />
                <div>
                  <p
                    className="font-medium cursor-pointer"
                    onClick={() => clickHandler(post?.author.username)}
                  >
                    {post?.author.username}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="pr-4">
                {isFollowing ? (
                  <button
                    onClick={() => followHandler(post?.author?._id)}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={() => followHandler(post?.author?._id)}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
                  >
                    Follow +
                  </button>
                )}
              </div>
            </div>

            {/* ===== MEDIA ===== */}
            <div className="h-100 bg-slate-900 flex items-center justify-center">
              {post?.mediaType === "image" ? (
                <img
                  src={post?.media}
                  alt="Post Media"
                  className="h-full w-full object-cover"
                />
              ) : (
                <VideoPlayer source={post?.media} className="h-full w-full" />
              )}
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="p-4 flex flex-col gap-5 text-slate-300">
              <p className="text-md">{post?.caption}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {/* ❤️ LIKE */}
                  <div className="flex gap-3 items-center">
                    {isLiked ? (
                      <FaHeart
                        className="text-xl text-red-500 cursor-pointer"
                        onClick={() => likeHandler(post._id)}
                      />
                    ) : (
                      <FaRegHeart
                        className="text-xl cursor-pointer"
                        onClick={() => likeHandler(post._id)}
                      />
                    )}
                    <span>{post?.likes?.length}</span>
                  </div>

                  {/* 💬 COMMENT */}
                  <div className="flex gap-2 items-center">
                    <FaRegComment
                      className="text-xl cursor-pointer"
                      onClick={() => toggleComments(post._id)}
                    />
                    <span>{post?.comments?.length}</span>
                  </div>
                </div>

                {/* 🔖 SAVE */}
                <div>
                  {isSaved ? (
                    <FaBookmark
                      className="text-xl cursor-pointer"
                      onClick={() => saveHandler(post._id)}
                    />
                  ) : (
                    <FiBookmark
                      className="text-xl cursor-pointer"
                      onClick={() => saveHandler(post._id)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ===== COMMENTS PANEL ===== */}
            {openComments[post._id] && (
              <div className="px-4 pb-4 border-t border-b border-t-slate-800 border-b-slate-800 space-y-3 pt-3">
                {post.comments?.slice(-5).map((c, idx) => (
                  <div className="flex gap-2">
                    <img
                      className="w-6 h-6 rounded-full cursor-pointer bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]"
                      onClick={() => clickHandler(c?.author?.username)}
                      src={
                        c?.author?.profilePicture
                          ? c?.author?.profilePicture
                          : profileImage
                      }
                    />{" "}
                    <p
                      key={idx}
                      className="text-sm text-slate-300 flex flex-col gap-1"
                    >
                      <span className="font-semibold mr-2">
                        {c?.author?.username || "user"}
                      </span>
                      <span>{c?.message}</span>
                    </p>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#020617] border border-slate-700 focus:border-[#00D4FF] outline-none text-sm"
                  />

                  <button
                    onClick={() => commentHandler(post._id)}
                    className="p-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition"
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Feed;
