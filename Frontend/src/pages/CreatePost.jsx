import axios from "axios";
import React, { useRef, useState } from "react";
import { FiImage, FiVideo, FiUpload, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BottomNavbar from "../components/BottomNavbar";

export default function CreatePost() {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePick = () => {
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    fileRef.current.value = "";
  };

  const isVideo = file?.type?.startsWith("video");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("caption", caption);
      if (isVideo) {
        formData.append("mediaType", "video");
      } else {
        formData.append("mediaType", "image");
      }
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/posts",
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
      toast.success("Post created successfully!");
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent">
          Create Post
        </h1>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            {!preview && (
              <div
                onClick={handlePick}
                className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center cursor-pointer hover:border-[#00D4FF] hover:bg-[#020617]/60 transition"
              >
                <div className="flex justify-center gap-4 text-3xl text-slate-400 mb-4">
                  <FiImage />
                  <FiVideo />
                </div>
                <p className="font-semibold">Upload photo or video</p>
                <p className="text-sm text-slate-400 mt-1">
                  Drag & drop or click to browse
                </p>

                <button
                  type="button"
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black hover:scale-105 transition"
                >
                  Select File
                </button>
              </div>
            )}

            {/* Preview */}
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
                  <video
                    src={preview}
                    controls
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

            {/* Caption */}
            <div>
              <label className="block text-sm mb-2 text-slate-300">
                Caption
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full px-4 py-3 rounded-xl bg-[#020617] border border-slate-700 focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/30 outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={handlePick}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
              >
                <FiUpload /> Change File
              </button>

              <button
                type="submit"
                disabled={!file}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] hover:scale-[1.02] active:scale-[0.98] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <div className="loader"></div> : <>Post</>}
              </button>
            </div>
          </form>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
