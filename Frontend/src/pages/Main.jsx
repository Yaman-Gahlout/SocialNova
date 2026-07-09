import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaComments, FaImages, FaRocket } from "react-icons/fa";

export default function Main() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaImages size={35} />,
      title: "Share Moments",
      desc: "Upload photos and videos and let the world experience your memories.",
    },
    {
      icon: <FaComments size={35} />,
      title: "Real-Time Chat",
      desc: "Talk instantly with friends using lightning-fast messaging.",
    },
    {
      icon: <FaRocket size={35} />,
      title: "Explore",
      desc: "Discover creators, trending posts and communities every day.",
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#08111F] via-[#111827] to-[#0F172A] text-white">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-pink-500/20 blur-[120px]" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
            🌌 SocialNova
          </h1>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-full border border-cyan-400 hover:bg-cyan-400 hover:text-black transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Connect.
              <br />
              Create.
              <br />
              <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                Inspire.
              </span>
            </h1>

            <p className="mt-8 text-gray-300 text-lg leading-8 max-w-xl">
              SocialNova is a modern social media platform where you can share
              moments, discover creators, chat in real-time and build meaningful
              connections across the world.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 font-semibold hover:scale-105 transition"
              >
                Join SocialNova
              </button>

              <button className="px-8 py-4 rounded-full border border-cyan-400 hover:bg-cyan-400 hover:text-black transition">
                Explore
              </button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative w-[340px] rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* App Header */}

              <div className="flex justify-between items-center p-5 border-b border-white/10">
                <h2 className="font-semibold">Social Feed</h2>

                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              {/* Stories */}

              <div className="flex gap-3 p-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 p-[2px]"
                  >
                    <div className="h-full w-full rounded-full bg-slate-800"></div>
                  </div>
                ))}
              </div>

              {/* Posts */}

              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="mx-4 mb-4 rounded-2xl bg-slate-800 overflow-hidden"
                >
                  <div className="h-44 bg-gradient-to-r from-violet-600 to-cyan-500"></div>

                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex gap-2">❤️ 💬 📤</div>⭐
                    </div>

                    <div className="mt-3 h-3 bg-gray-700 rounded w-3/4"></div>

                    <div className="mt-2 h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "20K+",
              sub: "Active Users",
            },
            {
              title: "150K+",
              sub: "Posts Shared",
            },
            {
              title: "99%",
              sub: "Happy Community",
            },
          ].map((item) => (
            <motion.div
              whileHover={{ y: -8 }}
              key={item.title}
              className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 text-center"
            >
              <h2 className="text-4xl font-bold text-cyan-400">{item.title}</h2>

              <p className="mt-2 text-gray-400">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-14">
          Why Choose SocialNova?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -10 }}
              className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8"
            >
              <div className="text-cyan-400">{feature.icon}</div>

              <h3 className="text-2xl font-semibold mt-6">{feature.title}</h3>

              <p className="text-gray-400 mt-4 leading-7">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}

      <footer className="border-t border-white/10 py-8 text-center text-gray-400">
        © {new Date().getFullYear()} SocialNova • Made with ❤️ by Yaman Gahlout
      </footer>
    </div>
  );
}
