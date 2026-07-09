import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiSend } from "react-icons/fi";
import profileImage from "../assets/userImage.avif";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../redux/slice/user.slice";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const notifications = useSelector((state) => state.user.notifications);

  const dispatch = useDispatch();

  const clickHandler = async (username) => {
    try {
      console.log("handler called");
      const res = await axios.get(
        `https://socialnova-backend.onrender.com/users/${username}`,
        {
          withCredentials: true,
        },
      );
      console.log("button clicked");
      console.log("user profile data : ", res.data.user);
      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch (err) {
      navigate("/home");
    }
  };

  const markAsReadHandler = async (notificationId) => {
    try {
      await axios.put(
        "https://socialnova-backend.onrender.com/users/notifications",
        {
          notificationId,
        },
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const isUnread = notifications.some((n) => !n.isRead);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0B1120]/70 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}

        <div
          onClick={() => navigate("/home")}
          className="cursor-pointer select-none"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition duration-300">
            SocialNova
          </h1>
        </div>

        {/* Right */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification */}

          <button
            onClick={() => {
              const unreadNotification = notifications.map((n) => n._id);

              if (unreadNotification.length > 0) {
                markAsReadHandler(unreadNotification);
              }

              navigate("/notifications");
            }}
            className="relative group flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
          >
            <FiBell
              size={21}
              className="text-gray-200 group-hover:text-cyan-400 transition"
            />

            {isUnread && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-[10px] font-semibold flex items-center justify-center text-white animate-pulse shadow-lg">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Messages */}

          <button
            onClick={() => navigate("/message")}
            className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-300"
          >
            <FiSend
              size={20}
              className="text-gray-200 group-hover:text-violet-400 transition group-hover:-rotate-12"
            />
          </button>

          {/* Avatar */}

          <button
            onClick={() => clickHandler(userData?.username)}
            className="relative rounded-full p-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/20"
          >
            <img
              src={
                userData?.profilePicture
                  ? userData.profilePicture
                  : profileImage
              }
              alt="profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-[#0B1120]"
            />

            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[#0B1120]" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
