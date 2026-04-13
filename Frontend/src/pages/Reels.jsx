import React from "react";
import { useSelector } from "react-redux";
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
        {reels.map((reel) => (
          <Reel
            key={reel._id}
            reel={reel}
            userData={userData}
            profileImage={profileImage}
            postsData={postsData}
          />
        ))}
      </div>
    </div>
  );
}

export default Reels;
