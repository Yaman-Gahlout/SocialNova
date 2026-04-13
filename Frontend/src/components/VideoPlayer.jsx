import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { MdVolumeOff } from "react-icons/md";

function VideoPlayer({ source, className }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);

  const clickHandler = () => {
    if (paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

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
    <div className="w-full h-full relative">
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        className={className}
        onClick={clickHandler}
      >
        <source src={source} type="video/mp4" />
      </video>

      <div className="absolute top-3 left-3 text-white text-xl cursor-pointer opacity-80 hover:opacity-100 transition">
        {muted ? (
          <MdVolumeOff onClick={() => setMuted((prev) => !prev)} size={24} />
        ) : (
          <FaVolumeUp onClick={() => setMuted((prev) => !prev)} size={24} />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
