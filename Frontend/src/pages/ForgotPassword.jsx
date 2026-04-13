import axios from "axios";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/auth/sendOtp",
        { email },
        { withCredentials: true },
      );

      console.log(response);
      setLoading(false);
      toast.success("Verification code sent to your email.");
      setStep(2);
    } catch (e) {
      toast.error("Error while sending Verification code.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/auth/verifyOtp",
        { email, otp },
        { withCredentials: true },
      );

      console.log(response);
      setLoading(false);
      toast.success("Verified sucessfully.");
      setOtp("");
      setStep(3);
    } catch (e) {
      toast.error("Error while verifying Verification code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Password are not same");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/auth/resetPassword",
        { email, newPassword, confirmPassword },
        { withCredentials: true },
      );

      console.log(response);
      setLoading(false);
      toast.success("Password reset successfully.");
      setEmail("");
      setStep(4);
    } catch (e) {
      toast.error("Error while resetting password.");
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

          {/* STEP 1 — Email */}
          {step === 1 && (
            <>
              <p className="text-center text-gray-400 mb-6">
                Enter your email to receive a verification code
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-[#E5E7EB]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB]"
                    placeholder="Enter your registered email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center"
                >
                  {loading ? <div className="loader"></div> : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <>
              <p className="text-center text-gray-400 mb-6">
                Enter the OTP sent to your email
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-[#E5E7EB]">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-2 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB] tracking-widest text-center"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center"
                >
                  {loading ? <div className="loader"></div> : "Verify OTP"}
                </button>
              </form>
            </>
          )}

          {/* STEP 3 — New Password */}
          {step === 3 && (
            <>
              <p className="text-center text-gray-400 mb-6">
                Set your new password
              </p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-[#E5E7EB]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 pr-12 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB]"
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#00D4FF] hover:text-[#6C5CE7] font-medium"
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-[#E5E7EB]">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 pr-12 rounded-xl bg-[#0F172A] border border-gray-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none text-[#E5E7EB]"
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#00D4FF] hover:text-[#6C5CE7] font-medium"
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center"
                >
                  {loading ? <div className="loader"></div> : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <div className="text-center py-6">
              <p className="text-[#E5E7EB] font-medium">
                Your password has been successfully reset.
              </p>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6 cursor-pointer">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#FF6B6B] cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
