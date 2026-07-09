import axios from "axios";
import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdBadge } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/auth/signup",
        form,
        { withCredentials: true },
      );

      console.log("response : ", response);
      toast.success("Account Created Successfully");
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error(e.response?.data?.message || "error while creating account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08111F] via-[#111827] to-[#0F172A] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Logo */}

        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-3xl shadow-lg">
            🚀
          </div>
        </div>

        {/* Heading */}

        <h1 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
          SocialNova
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Create your account and start connecting with people.
        </p>

        {/* Form */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Username */}

          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            />
          </div>

          {/* Full Name */}

          <div className="relative">
            <MdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-xl" />

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            />
          </div>

          {/* Email */}

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            />
          </div>

          {/* Password */}

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 py-3 pl-12 pr-12 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-cyan-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Terms */}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="accent-cyan-400" required />I
              agree to Terms
            </label>
          </div>

          {/* Button */}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 active:scale-95"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-700"></div>

          <span className="text-sm text-gray-500">OR</span>

          <div className="h-px flex-1 bg-slate-700"></div>
        </div>

        {/* Footer */}

        <p className="text-center text-gray-400">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
