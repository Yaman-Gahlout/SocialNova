import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import BottomNavbar from "../components/BottomNavbar";
import { useDispatch } from "react-redux";
import { setProfileData } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchResults = async (searchQuery) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://socialnova-backend.onrender.com/users/search?query=${searchQuery}`,
        { withCredentials: true },
      );
      console.log("Search results:", res.data.users);
      setResults(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clickHandler = async (username) => {
    try {
      const res = await axios.get(
        `https://socialnova-backend.onrender.com/users/${username}`,
        {
          withCredentials: true,
        },
      );
      dispatch(setProfileData(res.data.user));
      navigate("/profile");
    } catch (err) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="flex items-center bg-[#0F172A] border border-slate-700 rounded-2xl px-4 py-3 shadow-lg">
          <FiSearch className="text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Search users, posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-4 text-slate-400">Searching...</p>
        )}

        {/* Results */}
        <div className="mt-6 space-y-4">
          {results.length === 0 && query && !loading && (
            <p className="text-center text-slate-500">No results found</p>
          )}

          {results.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-[#0F172A] border border-slate-800 p-4 rounded-xl hover:bg-[#1E293B] transition cursor-pointer"
              onClick={() => clickHandler(item.username)}
            >
              <img
                src={item.profilePicture || "https://via.placeholder.com/40"}
                alt="user"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{item.username}</p>
                <p className="text-xs text-slate-400">{item?.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
