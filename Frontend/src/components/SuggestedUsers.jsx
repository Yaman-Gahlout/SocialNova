import React from "react";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";

function SuggestedUsers() {
  const suggestedUsers = useSelector((state) => state.user.suggestedUsers);
  console.log("suggested : ", suggestedUsers);
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className={`space-y-6 ${suggestedUsers?.length === 0 && "hidden"}`}>
      <div className="bg-[#0F172A] rounded-2xl p-4 border border-slate-800">
        <h3 className="font-semibold mb-3">Suggested for you</h3>

        <div className="space-y-3">
          {suggestedUsers?.map((i) => {
            return <UserProfile key={i._id} i={i} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default SuggestedUsers;
