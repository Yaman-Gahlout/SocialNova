import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileImage from "../assets/userImage.avif";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { setUserData } from "../redux/slice/user.slice";
import { setSelectedUser } from "../redux/slice/message.slice";

function ProfileHeader() {
  const userData = useSelector((state) => state.user.userData);
  const profileData = useSelector((state) => state.user.profileData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function logoutHandler() {
    try {
      const res = await axios.get(
        "https://socialnova-backend.onrender.com/auth/logout",
        {
          withCredentials: true,
        },
      );
      console.log(res);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  async function followHandler(targetUserId) {
    try {
      const response = await axios.post(
        `https://socialnova-backend.onrender.com/users/follow/${targetUserId}`,
        {},
        { withCredentials: true },
      );

      const message = response.data?.message || response.data;

      let updatedFollowing;
      if (message === "User followed") {
        updatedFollowing = [...userData.following, targetUserId];
        toast.success("User followed!");
      }

      if (message === "User unfollowed") {
        updatedFollowing = userData.following.filter(
          (id) => id.toString() !== targetUserId.toString(),
        );
        toast.info("User unfollowed.");
      }

      dispatch(
        setUserData({
          ...userData,
          following: updatedFollowing,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  const isFollowing = userData?.following?.some(
    (id) => id.toString() === profileData?._id?.toString(),
  );
  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#020617] rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full p-[3px] shadow-lg">
              <img
                className="w-full h-full rounded-full cursor-pointer object-cover"
                onClick={() => navigate("/profile")}
                src={profileData?.profilePicture || profileImage}
                alt="profile"
              />
            </div>
            {profileData._id === userData._id && (
              <div
                onClick={() => navigate("/editProfile")}
                className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#020617] flex items-center justify-center text-xl cursor-pointer"
              >
                <FaPlus className="text-white text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              {profileData?.username}
            </h2>

            {/* Three dot menu */}
            <div className="relative ml-auto" ref={menuRef}>
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="p-2 rounded-lg hover:bg-slate-800 transition"
              >
                <FiMoreVertical />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0F172A] border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                  {userData?.username === profileData?.username && (
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate("/editProfile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
                    >
                      Edit Profile
                    </button>
                  )}

                  <button
                    onClick={() => setOpenMenu(false)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
                  >
                    Share Profile
                  </button>

                  {userData?.username === profileData?.username && (
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        logoutHandler();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mt-6">
            {[
              { label: "Posts", value: profileData?.posts?.length || 0 },
              {
                label: "Followers",
                value: profileData?.followers?.length || 0,
              },
              {
                label: "Following",
                value: profileData?.following?.length || 0,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mt-6 text-sm text-slate-300 space-y-1">
            <p className="font-semibold text-white">{profileData?.fullName}</p>
            <p>{profileData?.bio ? profileData?.bio : ""}</p>
          </div>

          <div className="mt-6 flex items-center gap-4 justify-center md:justify-start">
            {isFollowing && profileData?._id !== userData?._id && (
              <button
                onClick={() => followHandler(profileData?._id)}
                className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
              >
                Following
              </button>
            )}{" "}
            {!isFollowing && profileData?._id !== userData?._id && (
              <button
                onClick={() => followHandler(profileData?._id)}
                className="px-3 py-1 text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-lg"
              >
                Follow +
              </button>
            )}
            {profileData?._id !== userData?._id && (
              <button
                onClick={() => {
                  console.log(profileData);
                  dispatch(setSelectedUser(profileData));
                  navigate("/message");
                }}
                className="px-3 py-1 text-sm border border-[#6C5CE7] hover:bg-linear-to-r from-[#6C5CE7] to-[#00D4FF] hover:text-black rounded-lg"
              >
                Message
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
