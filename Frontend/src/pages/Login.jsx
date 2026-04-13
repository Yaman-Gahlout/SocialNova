import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#111827] rounded-2xl shadow-2xl p-8 border border-gray-800">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
            SocialNova
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Welcome back! Please login to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm mb-1 text-[#E5E7EB]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB]"
                placeholder="Enter username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-[#E5E7EB]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-12 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB]"
                  placeholder="Enter password"
                />

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#00D4FF] hover:text-[#6C5CE7] font-medium"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <p
              className="text-[#6C5CE7] cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
