import React from "react";
import { FiSearch } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "../assets/userImage.avif";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../redux/slice/user.slice";
import axios from "axios";

function BottomNavbar() {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 important
  const dispatch = useDispatch();

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

  // 🔥 Helper function for active style
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4 w-full flex justify-center">
      <div
        className="
      w-full
      max-w-sm
      sm:max-w-md
      flex
      items-center
      justify-between
      px-6
      py-3
      rounded-full
      border
      border-white/10
      bg-[#111827]/80
      backdrop-blur-2xl
      shadow-[0_10px_40px_rgba(0,0,0,0.35)]
    "
      >
        {/* Icons */}
        <button
          onClick={() => navigate("/home")}
          className={`group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 cursor-pointer
        ${
          isActive("/home")
            ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-110"
            : "text-slate-300 hover:bg-white/10 hover:text-cyan-400"
        }`}
        >
          <GoHome size={24} />
        </button>

        {/* SEARCH */}

        <button
          onClick={() => navigate("/search")}
          className={`group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 cursor-pointer
        ${
          isActive("/search")
            ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-110"
            : "text-slate-300 hover:bg-white/10 hover:text-cyan-400"
        }`}
        >
          <FiSearch size={22} />
        </button>

        {/* UPLOAD */}

        <button
          onClick={() => navigate("/upload")}
          className={`group flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 cursor-pointer
        ${
          isActive("/upload")
            ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white scale-110 shadow-xl"
            : "bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:scale-110"
        }`}
        >
          <FaRegSquarePlus size={24} />
        </button>

        {/* REELS */}

        <button
          onClick={() => navigate("/reels")}
          className={`group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 cursor-pointer
        ${
          isActive("/reels")
            ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-110"
            : "text-slate-300 hover:bg-white/10 hover:text-cyan-400"
        }`}
        >
          <RxVideo size={23} />
        </button>

        {/* PROFILE */}

        <button
          onClick={() => clickHandler(userData?.username)}
          className={`
        rounded-full
        p-[2px]
        transition-all
        duration-300
        cursor-pointer
        ${
          isActive("/profile")
            ? "bg-gradient-to-r from-violet-500 to-cyan-400 scale-110"
            : "hover:scale-105"
        }
      `}
        >
          <img
            src={
              userData?.profilePicture ? userData.profilePicture : profileImage
            }
            alt="profile"
            className="h-10 w-10 rounded-full object-cover border-2 border-[#0B1120]"
          />
        </button>
      </div>
    </div>
  );
}

export default BottomNavbar;
