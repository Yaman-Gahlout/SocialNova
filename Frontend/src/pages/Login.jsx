import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("form data : ", form);
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/auth/login",
        form,
        { withCredentials: true },
      );

      console.log("response : ", response);
      toast.success("login Successfully");
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#08111F] via-[#111827] to-[#0F172A] flex items-center justify-center px-4">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 rounded-full bg-pink-500/20 blur-[120px]" />

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Logo */}

        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-3xl shadow-lg">
            🌌
          </div>
        </div>

        {/* Heading */}

        <h1 className="mt-6 text-center text-4xl font-bold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Login to continue your SocialNova journey.
        </p>

        {/* Form */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}

          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember & Forgot */}

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30 active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Footer */}

        <p className="mt-8 text-center text-gray-400">
          Don't have an account?
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            SignUp
          </button>
        </p>
      </div>
    </div>
  );
}
