import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import profileImage from "../assets/userImage.avif";

import { FiMoreVertical, FiShare2, FiLogOut, FiEdit } from "react-icons/fi";

import { FaPlus, FaUserFriends } from "react-icons/fa";

import { BsPatchCheckFill } from "react-icons/bs";

import { motion } from "framer-motion";

import { setUserData } from "../redux/slice/user.slice";
import { setSelectedUser } from "../redux/slice/message.slice";

function ProfileHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const profileData = useSelector((state) => state.user.profileData);

  /* ----------------------- LOCAL STATE ----------------------- */

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  /* --------------------- OUTSIDE CLICK ---------------------- */

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------- LOGOUT ---------------------- */

  async function logoutHandler() {
    try {
      await axios.get("https://socialnova-backend.onrender.com/auth/logout", {
        withCredentials: true,
      });

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (err) {
      console.error(err);

      toast.error("Unable to logout.");
    }
  }

  /* --------------------- FOLLOW USER --------------------- */

  async function followHandler(targetUserId) {
    const previousFollowing = [...userData.following];

    const alreadyFollowing = userData.following.some(
      (id) => id.toString() === targetUserId.toString(),
    );

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

  /* ---------------------- HELPERS ---------------------- */

  const isOwnProfile = userData?._id === profileData?._id;

  const isFollowing = userData?.following?.some(
    (id) => id.toString() === profileData?._id?.toString(),
  );

  const stats = [
    {
      label: "Posts",
      value: profileData?.posts?.length || 0,
    },
    {
      label: "Followers",
      value: profileData?.followers?.length || 0,
    },
    {
      label: "Following",
      value: profileData?.following?.length || 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl"
    >
      {/* ================= Cover ================= */}

      <div className="relative h-40 md:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-500" />

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* ================= Profile Content ================= */}

      <div className="relative px-5 pb-8 md:px-8">
        {/* Avatar */}

        <div className="-mt-16 flex flex-col items-center md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center md:flex-row md:items-end gap-5">
            <div className="relative">
              <div className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 p-1 shadow-[0_0_40px_rgba(34,211,238,.35)]">
                <img
                  src={
                    profileData?.profilePicture
                      ? profileData.profilePicture
                      : profileImage
                  }
                  alt="profile"
                  className="h-36 w-36 rounded-full object-cover border-4 border-[#111827]"
                />
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => navigate("/editProfile")}
                  className="
                absolute
                bottom-2
                right-2
                h-10
                w-10
                rounded-full
                bg-gradient-to-r
                from-violet-600
                to-cyan-500
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-110
                transition
                "
                >
                  <FaPlus className="text-white text-sm" />
                </button>
              )}
            </div>

            {/* Username */}

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-3xl font-bold">{profileData?.username}</h2>

                <BsPatchCheckFill className="text-cyan-400" size={18} />
              </div>

              <p className="mt-2 text-slate-300 font-medium">
                {profileData?.fullName}
              </p>
            </div>
          </div>

          {/* Three Dot Menu */}

          <div
            className="absolute top-5 right-5 md:static mt-5 md:mt-0"
            ref={menuRef}
          >
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="
            h-11
            w-11
            rounded-full
            bg-white/5
            border
            border-white/10
            flex
            items-center
            justify-center
            hover:bg-slate-700
            transition
            "
            >
              <FiMoreVertical size={20} />
            </button>

            {openMenu && (
              <div
                className="
              absolute
              right-0
              mt-3
              w-56
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#111827]
              shadow-2xl
              z-50
              "
              >
                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/editProfile");
                    }}
                    className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-5
                  py-3
                  hover:bg-slate-800
                  transition
                  "
                  >
                    <FiEdit />
                    Edit Profile
                  </button>
                )}

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Profile link copied!");
                    setOpenMenu(false);
                  }}
                  className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-3
                hover:bg-slate-800
                transition
                "
                >
                  <FiShare2 />
                  Share Profile
                </button>

                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      logoutHandler();
                    }}
                    className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-5
                  py-3
                  text-red-400
                  hover:bg-red-500/10
                  transition
                  "
                  >
                    <FiLogOut />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== Stats start below ===== */}
        {/* ================= Stats ================= */}

        <div className="mt-8 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
      rounded-2xl
      bg-slate-800/70
      border
      border-white/5
      p-5
      text-center
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-cyan-400/40
      hover:shadow-lg
      hover:shadow-cyan-500/10
      "
            >
              <h3 className="text-2xl font-bold">{stat.value}</h3>

              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ================= Bio ================= */}

        <div
          className="
  mt-8
  rounded-2xl
  border
  border-white/5
  bg-slate-900/60
  p-5
  "
        >
          <h3 className="text-lg font-semibold">About</h3>

          <p className="mt-3 font-medium text-white">{profileData?.fullName}</p>

          {profileData?.bio ? (
            <p className="mt-2 leading-7 text-slate-300 break-words">
              {profileData.bio}
            </p>
          ) : (
            <p className="mt-2 text-slate-500">No bio added yet.</p>
          )}
        </div>

        {/* ================= Buttons ================= */}

        {!isOwnProfile && (
          <div
            className="
    mt-8
    flex
    flex-col
    sm:flex-row
    gap-4
    "
          >
            {/* Follow */}

            <button
              onClick={() => followHandler(profileData._id)}
              className={`
      flex-1
      rounded-full
      py-3
      font-semibold
      transition-all
      duration-300
      shadow-lg
      ${
        isFollowing
          ? "bg-slate-700 hover:bg-red-500"
          : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-[1.02]"
      }
      `}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </button>

            {/* Message */}

            <button
              onClick={() => {
                dispatch(setSelectedUser(profileData));
                navigate("/message");
              }}
              className="
      flex-1
      rounded-full
      border
      border-cyan-400
      py-3
      font-semibold
      text-cyan-400
      transition-all
      duration-300
      hover:bg-cyan-400
      hover:text-black
      "
            >
              Message
            </button>
          </div>
        )}

        {/* ================= Own Profile ================= */}

        {isOwnProfile && (
          <div className="mt-8">
            <button
              onClick={() => navigate("/editProfile")}
              className="
      w-full
      rounded-full
      bg-gradient-to-r
      from-violet-600
      to-cyan-500
      py-3
      font-semibold
      shadow-lg
      transition-all
      duration-300
      hover:scale-[1.02]
      "
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ProfileHeader;
