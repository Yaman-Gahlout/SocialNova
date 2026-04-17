import { useSelector } from "react-redux";
import profileImage from "../assets/userImage.avif";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import useGetUserFollowing from "../hooks/useGetUserFollowing";

function Story() {
  const userData = useSelector((state) => state.user.userData);
  const followingUsers = useSelector((state) => state.user.following);

  const navigate = useNavigate();
  useGetUserFollowing();

  const isStorySeen = (stories) => {
    console.log(
      "Checking if story is seen. UserData:",
      userData,
      "Stories:",
      stories,
    );
    if (!stories || stories.length === 0) return true;

    return stories.every((story) =>
      story.viewers?.some((viewer) => viewer._id === userData?._id),
    );
  };

  return (
    <div>
      {" "}
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto">
        <div className="relative flex flex-col items-center min-w-17.5">
          <div
            className={`w-20 h-20 rounded-full p-0.5 ${
              userData?.story?.length > 0
                ? "bg-linear-to-r from-[#6C5CE7] to-[#00D4FF]"
                : "bg-gray-300"
            }`}
          >
            <img
              src={userData?.profilePicture || profileImage}
              className="w-full h-full rounded-full object-cover cursor-pointer"
              onClick={() => navigate(`/story/${userData?.username}`)}
            />
          </div>

          <div
            onClick={() => navigate("/upload")}
            className={`absolute bottom-5 right-0 w-6 h-6 rounded-full bg-blue-500 border-2 border-[#020617] flex items-center justify-center cursor-pointer ${userData?.story?.length > 0 ? "hidden" : ""}`}
          >
            <FaPlus className="text-white text-xs" />
          </div>

          <span className="text-xs text-slate-400 mt-1">Your Story</span>
        </div>
        {followingUsers?.map((user) => {
          if (!user.story || user.story.length === 0) return null;

          const seen = isStorySeen(user.story);

          return (
            <div
              key={user._id}
              className="flex flex-col items-center min-w-17.5"
            >
              <div
                className={`w-20 h-20 rounded-full p-0.5 ${
                  seen
                    ? "bg-gray-400"
                    : "bg-linear-to-r from-[#6C5CE7] to-[#00D4FF]"
                }`}
              >
                <img
                  src={user.profilePicture || profileImage}
                  className="w-full h-full rounded-full object-cover cursor-pointer"
                  onClick={() => navigate(`/story/${user.username}`)}
                />
              </div>

              <span className="text-xs text-slate-400 mt-1 truncate w-17.5 text-center">
                {user.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Story;
