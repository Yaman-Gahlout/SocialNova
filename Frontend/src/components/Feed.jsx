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
  // async function likeHandler(postId) {
  //   try {
  //     const response = await axios.post(
  //       `https://socialnova-backend.onrender.com/posts/like/${postId}`,
  //       {},
  //       { withCredentials: true },
  //     );

  //     const message = response.data?.message || response.data;

  //     const updatedPosts = postsData.map((post) => {
  //       if (post._id !== postId) return post;

  //       let updatedLikes = [...post.likes];

  //       const alreadyLiked = updatedLikes.some(
  //         (id) => id.toString() === userData._id.toString(),
  //       );

  //       if (message === "Post liked" && !alreadyLiked) {
  //         updatedLikes.push(userData._id);
  //       }

  //       if (message === "Post unliked") {
  //         updatedLikes = updatedLikes.filter(
  //           (id) => id.toString() !== userData._id.toString(),
  //         );
  //       }

  //       return { ...post, likes: updatedLikes };
  //     });

  //     dispatch(setPostsData(updatedPosts));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async function likeHandler(postId) {
    // Save previous state for rollback
    const previousPosts = postsData;

    // Optimistic update
    const updatedPosts = postsData.map((post) => {
      if (post._id !== postId) return post;

      const alreadyLiked = post.likes.includes(userData._id);

      return {
        ...post,
        likes: alreadyLiked
          ? post.likes.filter((id) => id !== userData._id)
          : [...post.likes, userData._id],
      };
    });

    // Update UI immediately
    dispatch(setPostsData(updatedPosts));

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
      dispatch(setPostsData(previousPosts));
      console.error(err);
    }
  }

  // ================= SAVE =================
  async function saveHandler(postId) {
    // Save previous state for rollback
    const previousSavedPosts = [...userData.savedPosts];

    const alreadySaved = userData.savedPosts.some(
      (id) => id.toString() === postId.toString(),
    );

    // Optimistic update
    const updatedSavedPosts = alreadySaved
      ? userData.savedPosts.filter((id) => id.toString() !== postId.toString())
      : [...userData.savedPosts, postId];

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
      // Rollback on failure
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

    // Temporary comment for instant UI update
    const tempComment = {
      _id: `temp-${Date.now()}`,
      message,
      author: {
        _id: userData._id,
        username: userData.username,
        profilePicture: userData.profilePicture,
      },
      createdAt: new Date(),
    };

    // Save previous state for rollback
    const previousPosts = postsData;

    // Optimistic update
    const updatedPosts = postsData.map((post) => {
      if (post._id !== postId) return post;

      return {
        ...post,
        comments: [...post.comments, tempComment],
      };
    });

    dispatch(setPostsData(updatedPosts));

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

      // Replace temporary comment with server comment
      const finalPosts = updatedPosts.map((post) => {
        if (post._id !== postId) return post;

        const comments = [...post.comments];

        const index = comments.findIndex((c) => c._id === tempComment._id);

        if (index !== -1) {
          comments[index] = {
            ...res.data.comment,
            author: {
              _id: userData._id,
              username: userData.username,
              profilePicture: userData.profilePicture,
            },
          };
        }

        return {
          ...post,
          comments,
        };
      });

      dispatch(setPostsData(finalPosts));

      toast.success("Comment added!");
    } catch (err) {
      // Rollback if request fails
      dispatch(setPostsData(previousPosts));

      toast.error("Failed to add comment.");

      console.error(err);
    }
  }

  async function followHandler(targetUserId) {
    // Save previous state for rollback
    const previousFollowing = [...userData.following];

    const alreadyFollowing = userData.following.some(
      (id) => id.toString() === targetUserId.toString(),
    );

    // Optimistic update
    const updatedFollowing = alreadyFollowing
      ? userData.following.filter(
          (id) => id.toString() !== targetUserId.toString(),
        )
      : [...userData.following, targetUserId];

    dispatch(
      setUserData({
        ...userData,
        following: updatedFollowing,
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
      // Rollback on failure
      dispatch(
        setUserData({
          ...userData,
          following: previousFollowing,
        }),
      );

      toast.error("Failed to update follow status.");
      console.error(err);
    }
  }

  //================= RENDER =================
  // return (
  //   <div className="lg:col-span-8 space-y-6">
  //     {postsData?.map((post) => {
  //       const isLiked = post?.likes?.some(
  //         (id) => id.toString() === userData?._id?.toString(),
  //       );

  //       const isSaved = userData?.savedPosts?.some(
  //         (id) => id.toString() === post?._id?.toString(),
  //       );

  //       const isFollowing = userData?.following?.some(
  //         (id) => id.toString() === post?.author?._id?.toString(),
  //       );

  //       return (
  //         <div
  //           key={post._id}
  //           className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden"
  //         >
  //           {/* ===== HEADER ===== */}
  //           <div className="flex items-center justify-between border-b border-slate-800">
  //             <div className="p-4 flex items-center gap-3">
  //               <img
  //                 className="w-10 h-10 rounded-full cursor-pointer object-cover"
  //                 onClick={() => clickHandler(post?.author.username)}
  //                 src={post?.author?.profilePicture || profileImage}
  //                 alt="user"
  //               />
  //               <div>
  //                 <p
  //                   className="font-medium cursor-pointer"
  //                   onClick={() => clickHandler(post?.author.username)}
  //                 >
  //                   {post?.author.username}
  //                 </p>
  //                 <p className="text-xs text-slate-400">
  //                   {formatDistanceToNow(new Date(post.createdAt), {
  //                     addSuffix: true,
  //                   })}
  //                 </p>
  //               </div>
  //             </div>

  //             <div className="pr-4">
  //               {isFollowing ? (
  //                 <button
  //                   onClick={() => followHandler(post?.author?._id)}
  //                   className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
  //                 >
  //                   Following
  //                 </button>
  //               ) : (
  //                 <button
  //                   onClick={() => followHandler(post?.author?._id)}
  //                   className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
  //                 >
  //                   Follow +
  //                 </button>
  //               )}
  //             </div>
  //           </div>

  //           {/* ===== MEDIA ===== */}
  //           <div className="h-100 bg-slate-900 flex items-center justify-center">
  //             {post?.mediaType === "image" ? (
  //               <img
  //                 src={post?.media}
  //                 alt="Post Media"
  //                 className="h-full w-full object-cover"
  //               />
  //             ) : (
  //               <VideoPlayer source={post?.media} className="h-full w-full" />
  //             )}
  //           </div>

  //           {/* ===== ACTIONS ===== */}
  //           <div className="p-4 flex flex-col gap-5 text-slate-300">
  //             <p className="text-md">{post?.caption}</p>

  //             <div className="flex items-center justify-between">
  //               <div className="flex gap-4">
  //                 {/* ❤️ LIKE */}
  //                 <div className="flex gap-3 items-center">
  //                   {isLiked ? (
  //                     <FaHeart
  //                       className="text-xl text-red-500 cursor-pointer"
  //                       onClick={() => likeHandler(post._id)}
  //                     />
  //                   ) : (
  //                     <FaRegHeart
  //                       className="text-xl cursor-pointer"
  //                       onClick={() => likeHandler(post._id)}
  //                     />
  //                   )}
  //                   <span>{post?.likes?.length}</span>
  //                 </div>

  //                 {/* 💬 COMMENT */}
  //                 <div className="flex gap-2 items-center">
  //                   <FaRegComment
  //                     className="text-xl cursor-pointer"
  //                     onClick={() => toggleComments(post._id)}
  //                   />
  //                   <span>{post?.comments?.length}</span>
  //                 </div>
  //               </div>

  //               {/* 🔖 SAVE */}
  //               <div>
  //                 {isSaved ? (
  //                   <FaBookmark
  //                     className="text-xl cursor-pointer"
  //                     onClick={() => saveHandler(post._id)}
  //                   />
  //                 ) : (
  //                   <FiBookmark
  //                     className="text-xl cursor-pointer"
  //                     onClick={() => saveHandler(post._id)}
  //                   />
  //                 )}
  //               </div>
  //             </div>
  //           </div>

  //           {/* ===== COMMENTS PANEL ===== */}
  //           {openComments[post._id] && (
  //             <div className="px-4 pb-4 border-t border-b border-t-slate-800 border-b-slate-800 space-y-3 pt-3">
  //               {post.comments?.slice(-5).map((c, idx) => (
  //                 <div className="flex gap-2">
  //                   <img
  //                     className="w-6 h-6 rounded-full cursor-pointer bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]"
  //                     onClick={() => clickHandler(c?.author?.username)}
  //                     src={
  //                       c?.author?.profilePicture
  //                         ? c?.author?.profilePicture
  //                         : profileImage
  //                     }
  //                   />{" "}
  //                   <p
  //                     key={idx}
  //                     className="text-sm text-slate-300 flex flex-col gap-1"
  //                   >
  //                     <span className="font-semibold mr-2">
  //                       {c?.author?.username || "user"}
  //                     </span>
  //                     <span>{c?.message}</span>
  //                   </p>
  //                 </div>
  //               ))}

  //               <div className="flex items-center gap-2 mt-2">
  //                 <input
  //                   type="text"
  //                   value={commentText[post._id] || ""}
  //                   onChange={(e) =>
  //                     setCommentText((prev) => ({
  //                       ...prev,
  //                       [post._id]: e.target.value,
  //                     }))
  //                   }
  //                   placeholder="Add a comment..."
  //                   className="flex-1 px-3 py-2 rounded-lg bg-[#020617] border border-slate-700 focus:border-[#00D4FF] outline-none text-sm"
  //                 />

  //                 <button
  //                   onClick={() => commentHandler(post._id)}
  //                   className="p-2 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition"
  //                 >
  //                   <FiSend />
  //                 </button>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <div className="w-full space-y-8">
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

        const isOwnPost =
          userData?._id?.toString() === post?.author?._id?.toString();

        return (
          <article
            className="
w-[96%]
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#111827]
shadow-xl
"
          >
            {/* HEADER */}

            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => clickHandler(post.author.username)}
                  className="
                rounded-full
                bg-gradient-to-r
                from-violet-500
                to-cyan-400
                p-[2px]
                cursor-pointer
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
                  h-11
                  w-11
                  sm:h-12
                  sm:w-12
                  rounded-full
                  object-cover
                  border-2
                  border-[#111827]
                  "
                  />
                </div>

                <div>
                  <h3
                    onClick={() => clickHandler(post.author.username)}
                    className="
                  font-semibold
                  text-white
                  cursor-pointer
                  hover:text-cyan-400
                  transition
                  "
                  >
                    {post.author.username}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {!isOwnPost && (
                <button
                  onClick={() => followHandler(post.author._id)}
                  className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                duration-300
                ${
                  isFollowing
                    ? "bg-slate-700 hover:bg-red-500"
                    : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105"
                }
                `}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* MEDIA */}

            <div
              className="
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
                  className="
w-full
max-h-[80vh]
object-contain
bg-black
"
                  onDoubleClick={() => likeHandler(post._id)}
                />
              ) : (
                <div className="w-full flex justify-center">
                  <VideoPlayer
                    source={post.media}
                    className="
w-full
max-h-[80vh]
object-contain
bg-black
"
                  />
                </div>
              )}
            </div>

            {/* CAPTION */}

            <div className="px-5 pt-5">
              <p className="text-slate-300 leading-7 break-words">
                <span
                  onClick={() => clickHandler(post.author.username)}
                  className="
                mr-2
                font-semibold
                text-white
                cursor-pointer
                hover:text-cyan-400
                "
                >
                  {post.author.username}
                </span>

                {post.caption}
              </p>
            </div>

            {/* ACTIONS START HERE */}

            {/* ================= ACTIONS ================= */}

            <div className="px-5 py-4">
              {/* Top Action Bar */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* ❤️ Like */}

                  <button
                    onClick={() => likeHandler(post._id)}
                    className="group flex items-center gap-2"
                  >
                    {isLiked ? (
                      <FaHeart
                        className="
            text-red-500
            text-2xl
            transition-all
            duration-300
            group-hover:scale-125
            "
                      />
                    ) : (
                      <FaRegHeart
                        className="
            text-2xl
            transition-all
            duration-300
            group-hover:text-red-500
            group-hover:scale-125
            "
                      />
                    )}

                    <span className="text-sm font-medium text-slate-300">
                      {post.likes.length}
                    </span>
                  </button>

                  {/* 💬 Comment */}

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="group flex items-center gap-2"
                  >
                    <FaRegComment
                      className="
          text-2xl
          transition-all
          duration-300
          group-hover:text-cyan-400
          group-hover:scale-125
          "
                    />

                    <span className="text-sm font-medium text-slate-300">
                      {post.comments.length}
                    </span>
                  </button>

                  {/* 📤 Share */}

                  <button
                    className="
        group
        transition-all
        duration-300
        hover:scale-110
        "
                  >
                    <FiSend
                      className="
          text-2xl
          group-hover:text-cyan-400
          group-hover:-rotate-12
          transition-all
          duration-300
          "
                    />
                  </button>
                </div>

                {/* 🔖 Save */}

                <button onClick={() => saveHandler(post._id)} className="group">
                  {isSaved ? (
                    <FaBookmark
                      className="
          text-cyan-400
          text-2xl
          transition-all
          duration-300
          group-hover:scale-125
          "
                    />
                  ) : (
                    <FiBookmark
                      className="
          text-2xl
          transition-all
          duration-300
          group-hover:text-cyan-400
          group-hover:scale-125
          "
                    />
                  )}
                </button>
              </div>

              {/* Likes */}

              <p className="mt-5 text-sm font-semibold text-white">
                {post.likes.length}
                {post.likes.length === 1 ? " Like" : " Likes"}
              </p>

              {/* Comments Button */}

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
                {/* Comments */}

                <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
                  {post.comments.length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                      Be the first one to comment ❤️
                    </div>
                  ) : (
                    post.comments
                      .slice()
                      .reverse()
                      .map((c, index) => (
                        <div
                          key={c._id || index}
                          className="flex gap-3 items-start"
                        >
                          {/* Avatar */}

                          <img
                            src={
                              c.author?.profilePicture
                                ? c.author.profilePicture
                                : profileImage
                            }
                            alt=""
                            onClick={() => clickHandler(c.author.username)}
                            className="
                h-10
                w-10
                rounded-full
                object-cover
                cursor-pointer
                ring-2
                ring-transparent
                hover:ring-cyan-400
                transition
                "
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
                    cursor-pointer
                    hover:text-cyan-400
                    transition
                    "
                              >
                                {c.author.username}
                              </p>

                              <p className="mt-1 text-slate-300 break-words">
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
                      alt=""
                      className="
          h-10
          w-10
          rounded-full
          object-cover
          "
                    />

                    <div className="relative flex-1">
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
            w-full
            rounded-full
            bg-slate-900
            border
            border-slate-700
            py-3
            pl-5
            pr-14
            outline-none
            transition
            focus:border-cyan-400
            focus:ring-2
            focus:ring-cyan-400/20
            "
                      />

                      <button
                        onClick={() => commentHandler(post._id)}
                        className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            h-10
            w-10
            rounded-full
            bg-gradient-to-r
            from-violet-600
            to-cyan-500
            flex
            items-center
            justify-center
            hover:scale-110
            active:scale-95
            transition-all
            duration-300
            "
                      >
                        <FiSend size={18} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default Feed;
