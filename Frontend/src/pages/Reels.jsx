import React from "react";
import { useDispatch, useSelector } from "react-redux";
import profileImage from "../assets/userImage.avif";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect } from "react";
import Reel from "../components/Reel";

function Reels() {
  const postsData = useSelector((state) => state.post.postsData);
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const reels = postsData.filter((post) => post.mediaType === "video");
  console.log("Reels Data:", reels);

  const shuffleReels = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const randomReels = shuffleReels(reels);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entry) => {
        const videoElement = videoRef.current;
        if (entry[0].isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      },
      {
        threshold: 0.8,
      },
    );
    const videoElement = videoRef.current;
    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);
  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-3 px-6 py-4">
          <MdKeyboardBackspace
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/home")}
          />
          <h1 className="text-xl  text-white">Reels</h1>
        </div>
      </div>
      {/* Reels Container */}
      <div className="w-full max-w-[480px] h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {randomReels.length > 0 &&
          randomReels.map((reel) => (
            <Reel
              key={reel._id}
              reel={reel}
              userData={userData}
              profileImage={profileImage}
              postsData={postsData}
            />
          ))}
        {randomReels.length === 0 && (
          <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h2 className="text-2xl text-white">No Reels Available</h2>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2 mt-[40px] rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition shadow-lg"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reels;
