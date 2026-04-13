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
    <nav className="flex items-center justify-between px-6 py-4  border-b border-slate-800 ">
      <h1 className="text-xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
        SocialNova
      </h1>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const unreadNotification = notifications.map((n) => n._id);
            if (unreadNotification) {
              markAsReadHandler(unreadNotification);
            }
            navigate("/notifications");
          }}
          className="p-2 relative text-2xl rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <FiBell />
          {notifications.length > 0 && isUnread && (
            <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate("/message")}
          className="p-2 text-2xl rounded-lg hover:bg-slate-800 transition"
        >
          <FiSend />
        </button>
        <img
          className="w-9 h-9 rounded-full cursor-pointer bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]"
          onClick={() => clickHandler(userData?.username)}
          src={
            userData?.profilePicture ? userData?.profilePicture : profileImage
          }
        />
      </div>
    </nav>
  );
}

export default Navbar;
