import React, { useState, useMemo } from "react";
import VideoPlayer from "./VideoPlayer";
import { FaRegHeart, FaHeart, FaRegComment, FaBookmark } from "react-icons/fa";
import {
  FiBookmark,
  FiSend,
  FiMoreHorizontal,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";

import { BsFillPatchCheckFill } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

import { setPostsData } from "../redux/slice/post.slice";

import { setProfileData, setUserData } from "../redux/slice/user.slice";

import profileImage from "../assets/userImage.avif";

import { formatDistanceToNow } from "date-fns";

function Post({ post, profileData, currentTab }) {
  const isSave = currentTab === "save";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postsData = useSelector((state) => state.post.postsData);

  const userData = useSelector((state) => state.user.userData);

  const socket = useSelector((state) => state.socket.socket);

  /* ----------------------------- LOCAL STATE ----------------------------- */

  const [openComments, setOpenComments] = useState({});

  const [commentText, setCommentText] = useState({});

  const [imageLoaded, setImageLoaded] = useState(false);

  const [loadingLike, setLoadingLike] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingFollow, setLoadingFollow] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);

  /* --------------------------- DERIVED VALUES ---------------------------- */

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
    // Save previous state for rollback
    const previousProfileData = profileData;

    // Optimistic update
    const updatedPosts = profileData.posts.map((post) => {
      if (post._id !== postId) return post;

      const alreadyLiked = post.likes.some(
        (id) => id.toString() === userData._id.toString(),
      );

      return {
        ...post,
        likes: alreadyLiked
          ? post.likes.filter((id) => id.toString() !== userData._id.toString())
          : [...post.likes, userData._id],
      };
    });

    // Update UI immediately
    dispatch(
      setProfileData({
        ...profileData,
        posts: updatedPosts,
      }),
    );

    try {
      await axios.post(
        `https://socialnova-backend.onrender.com/posts/like/${postId}`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      // Rollback if API fails
      dispatch(setProfileData(previousProfileData));

      toast.error("Failed to update like.");
      console.error(err);
    }
  }

  // ================= SAVE =================
  async function saveHandler(postId) {
    // Save previous state for rollback
    const previousSavedPosts = userData.savedPosts;

    const alreadySaved = userData.savedPosts.some(
      (id) => id.toString() === postId.toString(),
    );

    // Optimistic update
    const updatedSavedPosts = alreadySaved
      ? userData.savedPosts.filter((id) => id.toString() !== postId.toString())
      : [...userData.savedPosts, postId];

    // Update UI immediately
    dispatch(
      setUserData({
        ...userData,
        savedPosts: updatedSavedPosts,
      }),
    );

    try {
      await axios.post(
        `https://socialnova-backend.onrender.com/posts/save/${postId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (alreadySaved) {
        toast.info("Post removed from saved posts.");
      } else {
        toast.success("Post saved successfully!");
      }
    } catch (err) {
      // Rollback
      dispatch(
        setUserData({
          ...userData,
          savedPosts: previousSavedPosts,
        }),
      );

      toast.error("Failed to update saved posts.");
      console.error(err);
    }
  }

  // ================= COMMENT =================
  async function commentHandler(postId) {
    const message = commentText[postId]?.trim();

    if (!message) return;

    // Save previous state for rollback
    const previousPosts = profileData.posts;

    // Temporary comment
    const tempComment = {
      _id: `temp-${Date.now()}`,
      message,
      author: {
        _id: userData._id,
        username: userData.username,
        profilePicture: userData.profilePicture,
      },
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    const updatedPosts = profileData.posts.map((post) => {
      if (post._id !== postId) return post;

      return {
        ...post,
        comments: [...(post.comments || []), tempComment],
      };
    });

    dispatch(
      setProfileData({
        ...profileData,
        posts: updatedPosts,
      }),
    );

    // Clear input immediately
    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));

    try {
      const res = await axios.post(
        `https://socialnova-backend.onrender.com/posts/comment/${postId}`,
        { message },
        {
          withCredentials: true,
        },
      );

      // Replace temporary comment with real comment
      const finalPosts = updatedPosts.map((post) => {
        if (post._id !== postId) return post;

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment._id === tempComment._id
              ? {
                  ...res.data.comment,
                  author: {
                    _id: userData._id,
                    username: userData.username,
                    profilePicture: userData.profilePicture,
                  },
                }
              : comment,
          ),
        };
      });

      dispatch(
        setProfileData({
          ...profileData,
          posts: finalPosts,
        }),
      );

      toast.success("Comment added!");
    } catch (err) {
      // Rollback
      dispatch(
        setProfileData({
          ...profileData,
          posts: previousPosts,
        }),
      );

      // Restore input
      setCommentText((prev) => ({
        ...prev,
        [postId]: message,
      }));

      toast.error("Failed to add comment.");
      console.error(err);
    }
  }

  async function followHandler(targetUserId) {
    // Save previous state for rollback
    const previousFollowing = userData.following;
    const previousFollowers = profileData.followers;

    const alreadyFollowing = userData.following.some(
      (id) => id.toString() === targetUserId.toString(),
    );

    // Update current user's following
    const updatedFollowing = alreadyFollowing
      ? userData.following.filter(
          (id) => id.toString() !== targetUserId.toString(),
        )
      : [...userData.following, targetUserId];

    // Update viewed user's followers
    const updatedFollowers = alreadyFollowing
      ? profileData.followers.filter(
          (id) => id.toString() !== userData._id.toString(),
        )
      : [...profileData.followers, userData._id];

    // Optimistic UI
    dispatch(
      setUserData({
        ...userData,
        following: updatedFollowing,
      }),
    );

    dispatch(
      setProfileData({
        ...profileData,
        followers: updatedFollowers,
      }),
    );

    try {
      await axios.post(
        `https://socialnova-backend.onrender.com/users/follow/${targetUserId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (alreadyFollowing) {
        toast.info("User unfollowed.");
      } else {
        toast.success("User followed!");
      }
    } catch (err) {
      // Rollback
      dispatch(
        setUserData({
          ...userData,
          following: previousFollowing,
        }),
      );

      dispatch(
        setProfileData({
          ...profileData,
          followers: previousFollowers,
        }),
      );

      toast.error("Failed to update follow status.");
      console.error(err);
    }
  }
  const isLiked = post?.likes?.some(
    (id) => id.toString() === profileData?._id?.toString(),
  );

  const isSaved = userData?.savedPosts?.some(
    (id) => id.toString() === post?._id?.toString(),
  );

  const isFollowing = userData?.following?.some(
    (id) => id.toString() === post?.author?._id?.toString(),
  );

  const isOwnPost = userData?._id?.toString() === post?.author?._id?.toString();
  async function deletePostHandler(postId) {
    // Save previous state for rollback
    const previousProfileData = profileData;
    const previousUserData = userData;

    // Optimistic update
    const updatedProfilePosts = profileData.posts.filter(
      (post) => post._id.toString() !== postId.toString(),
    );

    dispatch(
      setProfileData({
        ...profileData,
        posts: updatedProfilePosts,
      }),
    );

    // If userData also contains posts, update it as well
    if (userData.posts) {
      dispatch(
        setUserData({
          ...userData,
          posts: userData.posts.filter(
            (postIdOrPost) =>
              (postIdOrPost._id
                ? postIdOrPost._id.toString()
                : postIdOrPost.toString()) !== postId.toString(),
          ),
        }),
      );
    }

    try {
      await axios.delete(
        `https://socialnova-backend.onrender.com/posts/${postId}`,
        {
          withCredentials: true,
        },
      );

      toast.success("Post deleted successfully.");
    } catch (err) {
      // Rollback
      dispatch(setProfileData(previousProfileData));

      dispatch(setUserData(previousUserData));

      toast.error("Failed to delete post.");
      console.error(err);
    }
  }
  return (
    <div
      key={post._id}
      className="
    w-full
    max-w-2xl
    mx-auto
    rounded-3xl
    overflow-hidden
    bg-[#111827]
    border
    border-white/10
    shadow-xl
    shadow-black/30
    hover:shadow-cyan-500/10
    hover:-translate-y-1
    transition-all
    duration-300
    "
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          {/* Avatar */}

          <div
            onClick={() => clickHandler(post.author.username)}
            className="
          cursor-pointer
          rounded-full
          p-[2px]
          bg-gradient-to-r
          from-violet-500
          to-cyan-400
          "
          >
            <img
              src={
                post.author.profilePicture
                  ? post.author.profilePicture
                  : profileImage
              }
              alt=""
              className="
            h-12
            w-12
            rounded-full
            object-cover
            border-2
            border-[#111827]
            "
            />
          </div>

          {/* User Info */}

          <div>
            <div className="flex items-center gap-2">
              <p
                onClick={() => clickHandler(post.author.username)}
                className="
              font-semibold
              cursor-pointer
              hover:text-cyan-400
              transition
              "
              >
                {post.author.username}
              </p>

              <BsFillPatchCheckFill className="text-cyan-400" size={14} />
            </div>

            <p className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">
          {!isOwnPost && (
            <button
              disabled={loadingFollow}
              onClick={() => followHandler(post.author._id)}
              className={`
            px-4
            py-2
            rounded-full
            text-sm
            font-medium
            transition
            ${
              isFollowing
                ? "bg-slate-700 text-white hover:bg-red-500"
                : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:scale-105"
            }
            `}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}

          {isOwnPost && (
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === post._id ? null : post._id)
                }
                className="
      p-2
      rounded-full
      hover:bg-slate-700
      transition
      "
              >
                <FiMoreHorizontal size={22} />
              </button>

              {openMenuId === post._id && (
                <div
                  className="
        absolute
        right-0
        top-12
        w-48
        rounded-2xl
        border
        border-white/10
        bg-[#111827]
        shadow-2xl
        overflow-hidden
        z-50
        "
                >
                  <button
                    className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          hover:bg-slate-800
          transition
          "
                  >
                    <FiEdit2 size={18} />
                    Edit Post
                  </button>

                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      setSelectedPostId(post._id);
                      setShowDeleteModal(true);
                    }}
                    className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-red-400
          hover:bg-red-500/10
          transition
          "
                  >
                    <FiTrash2 size={18} />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div
                className="
      w-[90%]
      max-w-md
      rounded-3xl
      border
      border-white/10
      bg-[#111827]
      p-6
      shadow-2xl
      animate-in
      fade-in
      zoom-in-95
      duration-200
      "
              >
                {/* Icon */}

                <div className="flex justify-center">
                  <div
                    className="
          h-16
          w-16
          rounded-full
          bg-red-500/10
          flex
          items-center
          justify-center
          "
                  >
                    <FiTrash2 size={30} className="text-red-500" />
                  </div>
                </div>

                {/* Title */}

                <h2 className="mt-5 text-center text-2xl font-bold">
                  Delete Post?
                </h2>

                {/* Description */}

                <p className="mt-3 text-center text-slate-400 leading-7">
                  This action cannot be undone.
                  <br />
                  Are you sure you want to permanently delete this post?
                </p>

                {/* Buttons */}

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedPostId(null);
                    }}
                    className="
          flex-1
          rounded-xl
          border
          border-slate-600
          py-3
          font-medium
          hover:bg-slate-800
          transition
          "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      deletePostHandler(selectedPostId);

                      setShowDeleteModal(false);

                      setSelectedPostId(null);
                    }}
                    className="
          flex-1
          rounded-xl
          bg-gradient-to-r
          from-red-500
          to-red-600
          py-3
          font-semibold
          text-white
          hover:scale-[1.02]
          active:scale-95
          transition
          "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MEDIA ================= */}

      <div
        className="
      relative
      w-full
      bg-black
      flex
      justify-center
      items-center
      overflow-hidden
      "
      >
        {post.mediaType === "image" ? (
          <img
            src={post.media}
            alt=""
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onDoubleClick={() => likeHandler(post._id)}
            className="
          w-full
          max-h-[80vh]
          object-contain
          transition-transform
          duration-500
          hover:scale-[1.02]
          cursor-pointer
          "
          />
        ) : (
          <VideoPlayer
            source={post.media}
            className="
          w-full
          max-h-[80vh]
          object-contain
          bg-black
          "
          />
        )}
      </div>

      {/* Caption */}

      <div className="px-5 pt-4 pb-2">
        <p className="text-slate-300 leading-7">
          <span className="font-semibold text-white mr-2">
            {post.author.username}
          </span>

          {post.caption}
        </p>
      </div>

      {/* ===== ACTIONS START BELOW ===== */}

      {/* ================= ACTIONS ================= */}

      <div className="px-5 pb-4 pt-2">
        {/* Action Icons */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* ❤️ Like */}

            <button
              disabled={loadingLike}
              onClick={() => likeHandler(post._id)}
              className="
        flex
        items-center
        gap-2
        group
        transition
        "
            >
              {isLiked ? (
                <FaHeart
                  size={24}
                  className="
            text-red-500
            drop-shadow-lg
            transition
            duration-300
            group-hover:scale-125
            "
                />
              ) : (
                <FaRegHeart
                  size={24}
                  className="
            text-white
            transition
            duration-300
            group-hover:text-red-500
            group-hover:scale-125
            "
                />
              )}

              <span className="text-sm font-medium">{post.likes.length}</span>
            </button>

            {/* 💬 Comment */}

            <button
              onClick={() => toggleComments(post._id)}
              className="
        flex
        items-center
        gap-2
        group
        transition
        "
            >
              <FaRegComment
                size={22}
                className="
          group-hover:text-cyan-400
          group-hover:scale-125
          transition
          "
              />

              <span className="text-sm font-medium">
                {post.comments.length}
              </span>
            </button>

            {/* 📤 Share */}

            <button
              className="
        group
        transition
        "
            >
              <FiSend
                size={22}
                className="
          group-hover:text-cyan-400
          group-hover:-rotate-12
          transition
          "
              />
            </button>
          </div>

          {/* 🔖 Save */}

          {!isOwnPost && (
            <button
              disabled={loadingSave}
              onClick={() => saveHandler(post._id)}
              className="group"
            >
              {isSaved ? (
                <FaBookmark
                  size={22}
                  className="
            text-cyan-400
            transition
            duration-300
            group-hover:scale-125
            "
                />
              ) : (
                <FiBookmark
                  size={22}
                  className="
            transition
            duration-300
            group-hover:text-cyan-400
            group-hover:scale-125
            "
                />
              )}
            </button>
          )}
        </div>

        {/* Likes */}

        <p className="mt-4 text-sm font-semibold text-white">
          {post.likes.length}

          {post.likes.length === 1 ? " Like" : " Likes"}
        </p>

        {/* View Comments */}

        {post.comments.length > 0 && (
          <button
            onClick={() => toggleComments(post._id)}
            className="
      mt-3
      text-sm
      text-slate-400
      hover:text-cyan-400
      transition
      "
          >
            {openComments[post._id]
              ? "Hide comments"
              : `View all ${post.comments.length} comments`}
          </button>
        )}
      </div>

      {/* ================= COMMENTS ================= */}

      {openComments[post._id] && (
        <div className="border-t border-slate-800 bg-[#0B1120]">
          {/* Comments List */}

          <div className="max-h-72 overflow-y-auto px-5 py-4 space-y-4">
            {post.comments?.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No comments yet.
              </div>
            ) : (
              post.comments
                ?.slice()
                .reverse()
                .map((c, idx) => (
                  <div key={c._id || idx} className="flex gap-3 items-start">
                    {/* Avatar */}

                    <img
                      src={
                        c?.author?.profilePicture
                          ? c.author.profilePicture
                          : profileImage
                      }
                      onClick={() => clickHandler(c.author.username)}
                      className="
                h-9
                w-9
                rounded-full
                object-cover
                cursor-pointer
                ring-2
                ring-transparent
                hover:ring-cyan-400
                transition
                "
                      alt=""
                    />

                    {/* Bubble */}

                    <div className="flex-1">
                      <div
                        className="
                  rounded-2xl
                  bg-slate-800
                  px-4
                  py-3
                  "
                      >
                        <p
                          onClick={() => clickHandler(c.author.username)}
                          className="
                    font-semibold
                    text-white
                    cursor-pointer
                    hover:text-cyan-400
                    transition
                    "
                        >
                          {c.author.username}
                        </p>

                        <p className="text-slate-300 break-words mt-1">
                          {c.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Add Comment */}

          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  userData.profilePicture
                    ? userData.profilePicture
                    : profileImage
                }
                className="
          h-10
          w-10
          rounded-full
          object-cover
          "
                alt=""
              />

              <input
                type="text"
                value={commentText[post._id] || ""}
                placeholder="Write a comment..."
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commentHandler(post._id);
                  }
                }}
                className="
          flex-1
          rounded-full
          bg-slate-900
          border
          border-slate-700
          px-5
          py-3
          outline-none
          focus:border-cyan-400
          transition
          "
              />

              <button
                onClick={() => commentHandler(post._id)}
                className="
          h-11
          w-11
          rounded-full
          bg-gradient-to-r
          from-violet-600
          to-cyan-500
          flex
          items-center
          justify-center
          hover:scale-110
          active:scale-95
          transition
          "
              >
                <FiSend className="text-white" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
