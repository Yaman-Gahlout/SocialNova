import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import profileImage from "../assets/userImage.avif";
import { setStoryData } from "../redux/slice/story.slice";
import { FaEye } from "react-icons/fa";

function StoryViewPage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const userStories = useSelector((state) => state.story.storyData) || [];
  const userData = useSelector((state) => state.user.userData);

  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  const story = userStories?.[storyIndex];
  const isOwnStory = story?.author?._id === userData?._id;

  /* ---------------- FETCH STORIES ---------------- */

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/stories/${username}`,
          { withCredentials: true },
        );

        dispatch(setStoryData(res.data.story || []));
      } catch (err) {
        console.log(err);
        navigate("/home");
      }
    };

    fetchStory();
  }, [username, dispatch, navigate]);

  /* ---------------- IMAGE TIMER ---------------- */

  useEffect(() => {
    if (!story || story.mediaType !== "image") return;

    setProgress(0);

    const duration = 10000; // 10 seconds (change to 30000 for 30s)
    const interval = 100;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => prev + increment);
    }, interval);

    return () => clearInterval(timer);
  }, [story]);

  /* ---------------- VIDEO PROGRESS ---------------- */

  const videoProgressHandler = () => {
    const video = videoRef.current;
    if (!video) return;

    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  /* ---------------- AUTO NEXT STORY ---------------- */

  useEffect(() => {
    if (progress >= 100) nextStory();
  }, [progress]);

  /* ---------------- NEXT STORY ---------------- */

  const nextStory = () => {
    if (storyIndex < userStories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      navigate("/home");
    }
  };

  /* ---------------- PREV STORY ---------------- */

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  /* ---------------- CLICK NAVIGATION ---------------- */

  const clickHandler = (e) => {
    const x = e.clientX;

    if (x < window.innerWidth / 2) prevStory();
    else nextStory();
  };

  /* ---------------- LOADING ---------------- */

  if (!story) {
    navigate("/upload");
    return null;
  }

  return (
    <div
      className="h-screen w-screen bg-black flex justify-center items-center relative"
      onClick={clickHandler}
    >
      {" "}
      <div className="relative w-full max-w-125 h-full">
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
          {userStories.map((_, i) => (
            <div key={i} className="flex-1 bg-gray-600 h-0.75 rounded">
              <div
                className="bg-white h-0.75"
                style={{
                  width:
                    i < storyIndex
                      ? "100%"
                      : i === storyIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
        {/* User Info */}
        <div className="absolute top-8 left-4 flex items-center gap-3 text-white z-20">
          <img
            src={story.author?.profilePicture || profileImage}
            className="w-10 h-10 rounded-full object-cover"
            alt="profile"
          />
          <p className="font-semibold">{story.author?.username}</p>
        </div>
        {/* MEDIA */}
        {story.mediaType === "image" ? (
          <img
            src={story.media}
            alt="story"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={story.media}
            autoPlay
            muted
            playsInline
            onTimeUpdate={videoProgressHandler}
            className="h-full w-full object-cover"
          />
        )}
        {/* VIEWERS BUTTON (Only for own story) */}
        {isOwnStory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowViewers(true);
            }}
            className="absolute bottom-6 left-4 flex gap-2 items-center text-white text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md"
          >
            <FaEye /> <span>{story?.viewers.length || 0}</span>
          </button>
        )}
        {/* Close Button */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-8 right-4 text-white text-2xl"
        >
          ✕
        </button>

        {/* VIEWERS PANEL */}
        {showViewers && (
          <div className="absolute bottom-0 w-full bg-[#020617] p-4 max-h-[50%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="font-semibold">Story Viewers</h3>
              <button onClick={() => setShowViewers(false)}> ✕</button>
            </div>

            {story.viewers?.length === 0 && (
              <p className="text-gray-400 text-sm">No viewers yet</p>
            )}

            {story.viewers?.map((viewer) => (
              <div key={viewer._id} className="flex items-center gap-3 py-2">
                <img
                  src={viewer.profilePicture || profileImage}
                  className="w-9 h-9 rounded-full object-cover"
                  alt="viewer"
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    {viewer.username}
                  </p>
                  <p className="text-xs text-gray-400">{viewer.fullName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryViewPage;
