import React from "react";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";

function SuggestedUsers() {
  const suggestedUsers = useSelector((state) => state.user.suggestedUsers);
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] rounded-2xl p-4 border border-slate-800">
        <h3 className="font-semibold mb-3">Suggested for you</h3>

        <div className="space-y-3">
          {suggestedUsers?.map((i) => {
            const isFollowing = userData?.following?.some(
              (id) => id.toString() === i._id.toString(),
            );

            if (userData?._id === i._id || isFollowing) return null;

            return <UserProfile key={i._id} i={i} />;
          })}
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-2xl p-4 border border-slate-800">
        <h3 className="font-semibold mb-3">Trending Reels</h3>

        <div className="aspect-[9/16] rounded-xl bg-gradient-to-br from-[#6C5CE7]/30 to-[#00D4FF]/30 flex items-center justify-center text-slate-300">
          🎬 Trending Reel
        </div>
      </div>
    </div>
  );
}

export default SuggestedUsers;
