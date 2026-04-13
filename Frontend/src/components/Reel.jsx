import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaBookmark } from "react-icons/fa";
import { FiBookmark, FiSend } from "react-icons/fi";
import { FaVolumeUp } from "react-icons/fa";
import { MdVolumeOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setProfileData, setUserData } from "../redux/slice/user.slice";
import { setPostsData } from "../redux/slice/post.slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Reel({ reel, userData, profileImage, postsData }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const [openComments, setOpenComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = reel.likes?.includes(userData?._id);
  const isSaved = userData?.savedPosts?.includes(reel._id);
  const isFollowing = userData?.following?.includes(reel.author?._id);

  /* ---------------- VIDEO PROGRESS ---------------- */

  const timeHandler = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
  };

  /* ---------------- PLAY / PAUSE ---------------- */

  const togglePlay = () => {
    if (paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  /* ---------------- PROFILE ---------------- */

  const openProfile = async (username) => {
    try {
      const res = await axios.get(`http://localhost:8000/users/${username}`, {
        withCredentials: true,
      });

      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch {
      navigate("/home");
    }
  };

  /* ---------------- LIKE ---------------- */

  async function likeHandler(postId) {
    try {
      const res = await axios.post(
        `http://localhost:8000/posts/like/${postId}`,
        {},
        { withCredentials: true },
      );

      const message = res.data?.message || res.data;

      const updatedPosts = postsData.map((post) => {
        if (post._id !== postId) return post;

        let updatedLikes = [...post.likes];

        if (message === "Post liked") {
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
    } catch (err) {
      console.log(err);
    }
  }

  /* ---------------- SAVE ---------------- */

  async function saveHandler(postId) {
    try {
      const res = await axios.post(
        `http://localhost:8000/posts/save/${postId}`,
        {},
        { withCredentials: true },
      );

      const message = res.data?.message || res.data;

      let updatedSavedPosts;

      if (message === "Post saved") {
        updatedSavedPosts = [...userData.savedPosts, postId];
        toast.success("Post saved successfully!"); // Show toast on save
      }

      if (message === "Post unsaved") {
        updatedSavedPosts = userData.savedPosts.filter(
          (id) => id.toString() !== postId.toString(),
        );

        toast.info("Post unsaved successfully!"); // Show toast on unsave
      }

      dispatch(
        setUserData({
          ...userData,
          savedPosts: updatedSavedPosts,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  /* ---------------- FOLLOW ---------------- */

  async function followHandler(targetUserId) {
    try {
      const res = await axios.post(
        `http://localhost:8000/users/follow/${targetUserId}`,
        {},
        { withCredentials: true },
      );

      const message = res.data?.message || res.data;

      let updatedFollowing;

      if (message === "User followed") {
        updatedFollowing = [...userData.following, targetUserId];
      }

      if (message === "User unfollowed") {
        updatedFollowing = userData.following.filter(
          (id) => id.toString() !== targetUserId.toString(),
        );
      }

      dispatch(
        setUserData({
          ...userData,
          following: updatedFollowing,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  /* ---------------- COMMENT ---------------- */

  async function commentHandler(postId) {
    try {
      if (!commentText.trim()) return;

      const res = await axios.post(
        `http://localhost:8000/posts/comment/${postId}`,
        { message: commentText },
        { withCredentials: true },
      );

      const newComment = {
        ...res.data.comment,
        author: {
          _id: userData._id,
          username: userData.username,
          profilePicture: userData.profilePicture,
        },
        message: commentText,
      };

      const updatedPosts = postsData.map((post) => {
        if (post._id !== postId) return post;

        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      });

      dispatch(setPostsData(updatedPosts));
      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  }

  /* ---------------- AUTO PLAY ---------------- */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (!video) return;

        if (entries[0].isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.8 },
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="h-screen w-full relative snap-start flex items-center justify-center">
      {/* VOLUME */}
      <div className="absolute top-6 right-4 text-white z-20">
        {muted ? (
          <MdVolumeOff size={24} onClick={() => setMuted(false)} />
        ) : (
          <FaVolumeUp size={24} onClick={() => setMuted(true)} />
        )}
      </div>

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={reel.media}
        autoPlay
        loop
        muted={muted}
        playsInline
        onClick={togglePlay}
        onTimeUpdate={timeHandler}
        className="h-[97%] max-md:h-full w-full object-cover md:border border-gray-600 rounded-lg"
      />

      {/* RIGHT ACTIONS */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 text-white items-center">
        {/* LIKE */}
        <button onClick={() => likeHandler(reel._id)}>
          {isLiked ? (
            <FaHeart className="text-3xl text-red-500" />
          ) : (
            <FaRegHeart className="text-3xl" />
          )}
          <span className="text-xs">{reel.likes.length}</span>
        </button>

        {/* COMMENT */}
        <button onClick={() => setOpenComments(true)}>
          <FaRegComment className="text-3xl" />
          <span className="text-xs">{reel.comments.length}</span>
        </button>

        {/* SHARE */}
        <FiSend className="text-3xl cursor-pointer" />

        {/* SAVE */}
        <button onClick={() => saveHandler(reel._id)}>
          {isSaved ? (
            <FaBookmark className="text-3xl" />
          ) : (
            <FiBookmark className="text-3xl" />
          )}
        </button>
      </div>

      {/* USER INFO */}
      <div className="absolute bottom-10 left-4 right-20 text-white">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={reel.author?.profilePicture || profileImage}
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            onClick={() => openProfile(reel.author.username)}
          />

          <p
            className="font-semibold cursor-pointer"
            onClick={() => openProfile(reel.author.username)}
          >
            {reel.author.username}
          </p>

          {userData?._id !== reel.author?._id && (
            <button
              onClick={() => followHandler(reel.author._id)}
              className="ml-2 px-3 py-2 text-sm text-white border border-white rounded-xl"
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <p className="text-sm opacity-90 line-clamp-2">{reel.caption}</p>
      </div>

      {/* COMMENT DRAWER */}
      {openComments && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/60 backdrop-blur-sm">
          {/* Panel */}
          <div className="w-full bg-[#020617] rounded-t-3xl h-[65%] flex flex-col animate-slideUp">
            {/* Drag indicator */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-500"></div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-700 text-white">
              <h3 className="font-semibold text-lg">
                Comments ({reel.comments?.length || 0})
              </h3>

              <button
                onClick={() => setOpenComments(false)}
                className="text-sm opacity-70 hover:opacity-100"
              >
                Close
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {reel.comments?.length === 0 && (
                <p className="text-center text-gray-400 mt-10">
                  No comments yet
                </p>
              )}

              {reel.comments?.map((c) => (
                <div key={c._id} className="flex gap-3 items-start">
                  <img
                    src={c.author?.profilePicture || profileImage}
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div className="bg-[#0F172A] px-3 py-2 rounded-xl max-w-[80%]">
                    <p className="text-sm text-white font-semibold">
                      {c.author?.username}
                    </p>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {c.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-3 flex items-center gap-3">
              <img
                src={userData?.profilePicture || profileImage}
                className="w-9 h-9 rounded-full"
              />

              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-[#0F172A] text-white px-3 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />

              <button
                onClick={() => commentHandler(reel._id)}
                className="bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] p-2 rounded-full hover:scale-110 transition"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-white md:hidden"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default Reel;
