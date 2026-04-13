import React, { useState } from "react";
import profileImage from "../assets/userImage.avif";
import { FiCamera, FiSave } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNavbar from "../components/BottomNavbar";

export default function EditProfile() {
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    bio: "",
    profession: "",
    gender: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
      setForm({ ...form, file: f });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("username", form.username || userData.username);
    data.append("fullName", form.fullName || userData.fullName);
    data.append("bio", form.bio || userData.bio);
    data.append("profession", form.profession || userData.profession);
    data.append("gender", form.gender || userData.gender);
    if (preview) {
      console.log("preview", preview);
      data.append("image", form.file);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/users/edit`,
        data,
        { withCredentials: true },
      );

      console.log("Profile updated:", response.data);
      toast.success("Profile updated successfully!");
      setLoading(false);
      navigate("/home");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
          Edit Profile
        </h1>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          {/* Profile Image Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF]">
                <img
                  src={preview || userData?.profilePicture || profileImage}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover bg-slate-900"
                />
              </div>

              {/* upload overlay */}
              <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                <FiCamera className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="text-center md:text-left">
              <p className="font-semibold">Change Profile Photo</p>
              <p className="text-xs text-slate-400">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form?.username ? form?.username : userData?.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName ? form.fullName : userData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Profession
              </label>
              <input
                type="text"
                name="profession"
                value={form.profession ? form.profession : userData.profession}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-2 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm mb-1 text-slate-300">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender ? form.gender : userData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm mb-1 text-slate-300">Bio</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Write your bio here"
                value={form.bio ? form.bio : userData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition shadow-lg"
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
