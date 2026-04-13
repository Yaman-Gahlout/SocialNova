import React from "react";
import { FiGrid, FiBookmark, FiUser, FiMapPin, FiLink } from "react-icons/fi";
import BottomNavbar from "../components/BottomNavbar";
import ProfileHeader from "../components/ProfileHeader";
import { useNavigate } from "react-router-dom";
import Posts from "../components/Posts";

// ===== Main Profile Page =====
export default function Profile() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProfileHeader />
        <Posts />
      </div>
      <BottomNavbar />
    </div>
  );
}
