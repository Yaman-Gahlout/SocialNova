import React, { useRef, useState } from "react";
import { FiUpload, FiImage, FiVideo, FiClock, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import BottomNavbar from "../components/BottomNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";

// SocialNova Universal Upload Page (Improved)
// ✅ Post → image/video
// ✅ Story → image/video
// ✅ Reel → VIDEO ONLY (Instagram behavior)

export default function Upload() {
  const fileRef = useRef(null);

  const [activeType, setActiveType] = useState("post");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isVideo = file?.type?.startsWith("video");

  // ================= PICK FILE =================
  const handlePick = () => fileRef.current?.click();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError("");

    // 🔥 Reel must be video
    if (activeType === "reel" && !selected.type.startsWith("video")) {
      setError("Reels must be uploaded as videos only.");
      toast.error("Reels must be uploaded as videos only.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("media", file);
      if (activeType !== "story") {
        formData.append("caption", caption);
      }
      if (isVideo) {
        formData.append("mediaType", "video");
      } else {
        formData.append("mediaType", "image");
      }
      setLoading(true);

      const url =
        activeType === "post"
          ? "posts"
          : activeType === "story"
            ? "stories"
            : "reels";
      const response = await axios.post(
        `https://socialnova-backend.onrender.com/${url}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Post created:", response.data);
      setLoading(false);
      toast.success(
        `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} uploaded successfully!`,
      );
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  // ================= ACCEPT RULE =================
  const getAcceptType = () => {
    if (activeType === "reel") return "video/*";
    return "image/*,video/*";
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ===== HEADER ===== */}
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
          Upload Content
        </h1>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          {/* ===== TYPE SELECTOR ===== */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { key: "post", label: "Post", icon: <FiImage /> },
              { key: "story", label: "Story", icon: <FiClock /> },
              { key: "reel", label: "Reel", icon: <FiVideo /> },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveType(item.key);
                  handleRemove(); // reset when switching type
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition text-sm font-medium
                  ${
                    activeType === item.key
                      ? "bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black border-transparent"
                      : "border-slate-700 hover:bg-slate-800"
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ===== ERROR ===== */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* ===== UPLOAD AREA ===== */}
            {!preview && (
              <div
                onClick={handlePick}
                className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center cursor-pointer hover:border-[#00D4FF] hover:bg-[#020617]/60 transition"
              >
                <div className="flex justify-center gap-4 text-3xl text-slate-400 mb-4">
                  <FiImage />
                  <FiVideo />
                </div>
                <p className="font-semibold">
                  Upload {activeType === "reel" ? "video" : "photo or video"}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Click to browse files
                </p>

                <button
                  type="button"
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition"
                >
                  Select File
                </button>
              </div>
            )}

            {/* ===== PREVIEW ===== */}
            {preview && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black transition"
                >
                  <FiX />
                </button>

                {isVideo ? (
                  //   <video
                  //     src={preview}
                  //     controls
                  //     playsInline
                  //     className="w-full max-h-[420px] object-contain bg-black"
                  //   />
                  <VideoPlayer
                    source={preview}
                    className="w-full max-h-[420px] object-contain bg-black"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full max-h-[420px] object-contain bg-black"
                  />
                )}
              </div>
            )}

            {/* ===== CAPTION ===== */}
            {activeType !== "story" && (
              <div>
                <label className="block text-sm mb-2 text-slate-300">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={`Write a ${activeType} caption...`}
                  className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none resize-none"
                />
              </div>
            )}

            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept={getAcceptType()}
              className="hidden"
              onChange={handleFileChange}
            />

            {/* ===== ACTIONS ===== */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={handlePick}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
              >
                <FiUpload /> Change File
              </button>

              <button
                type="submit"
                disabled={!file || loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="loader"></div>
                ) : (
                  <>Upload {activeType}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}
