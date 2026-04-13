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
      const res = await axios.get(`http://localhost:8000/users/${username}`, {
        withCredentials: true,
      });

      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch (err) {
      navigate("/home");
    }
  };

  // 🔥 Helper function for active style
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800">
      <div className="flex items-center justify-around py-3 text-slate-300">
        {/* HOME */}
        <GoHome
          className={`text-2xl cursor-pointer transition ${
            isActive("/home") ? "text-[#00D4FF] scale-110" : "hover:text-white"
          }`}
          onClick={() => navigate("/home")}
        />

        {/* SEARCH */}
        <FiSearch
          className={`text-2xl cursor-pointer transition ${
            isActive("/search")
              ? "text-[#00D4FF] scale-110"
              : "hover:text-white"
          }`}
          onClick={() => navigate("/search")}
        />

        {/* UPLOAD */}
        <FaRegSquarePlus
          className={`text-2xl cursor-pointer transition ${
            isActive("/upload")
              ? "text-[#00D4FF] scale-110"
              : "hover:text-white"
          }`}
          onClick={() => navigate("/upload")}
        />

        {/* REELS */}
        <RxVideo
          className={`text-2xl cursor-pointer transition ${
            isActive("/reels") ? "text-[#00D4FF] scale-110" : "hover:text-white"
          }`}
          onClick={() => navigate("/reels")}
        />

        {/* PROFILE */}
        <img
          className={`w-6 h-6 rounded-full cursor-pointer border-2 transition ${
            isActive("/profile")
              ? "border-[#00D4FF] scale-110"
              : "border-transparent"
          }`}
          onClick={() => clickHandler(userData?.username)}
          src={
            userData?.profilePicture ? userData?.profilePicture : profileImage
          }
          alt="profile"
        />
      </div>
    </div>
  );
}

export default BottomNavbar;
