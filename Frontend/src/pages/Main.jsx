import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#0B0F19] text-[#F1F5F9]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#111827] shadow-lg">
        <h1 className="text-2xl font-bold bg-linear-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
          SocialNova
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 cursor-pointer py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4ee6] transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 cursor-pointer py-2 rounded-xl bg-[#22D3EE] text-black hover:bg-[#18c2db] transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex h-full flex-col justify-center items-center px-6 py-16 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-[#22D3EE]">SocialNova</span>
        </h2>
        <p className="max-w-5xl mx-auto text-gray-300 mb-8">
          Connect with people who inspire you, share your favorite moments
          effortlessly, and explore a vibrant world of stories that keep you
          engaged, entertained, and always in the loop.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-3 cursor-pointer rounded-2xl bg-linear-to-r from-[#8B5CF6] to-[#22D3EE] text-black font-semibold hover:scale-105 transition"
        >
          Get Started
        </button>
      </section>

      {/* Cards Section */}
      {/* <section className="grid md:grid-cols-3 gap-6 px-6 pb-16">
        {["Share Moments", "Discover People", "Real-time Chat"].map(
          (title, i) => (
            <div
              key={i}
              className="bg-[#111827] p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-xl mb-4 bg-linear-to-r from-[#8B5CF6] to-[#22D3EE]" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">
                Experience lightning-fast social interactions with a sleek
                futuristic interface.
              </p>
            </div>
          ),
        )}
      </section> */}

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-400">
        © {new Date().getFullYear()}. Made with ❤️ by Yaman Gahlout.
      </footer>
    </div>
  );
}
