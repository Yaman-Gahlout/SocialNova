import useGetCurrentUser from "../hooks/useGetCurrentUser";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";
import SuggestedUsers from "../components/SuggestedUsers";
import Navbar from "../components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import { useSelector } from "react-redux";
import Story from "../components/Story";
import useGetAllPosts from "../hooks/useGetAllPosts";
import Feed from "../components/Feed";
import useGetUserFollowing from "../hooks/useGetUserFollowing";
import useGetOldChatUsers from "../hooks/useGetOldChatUsers";
import useGetAllNotifications from "../hooks/useGetAllNotifications";

// ---------- Main Page ----------
export default function SocialNovaDashboard() {
  const { Currloading } = useGetCurrentUser();
  const { loading } = useGetSuggestedUsers();
  const { loading: allPostsLoading } = useGetAllPosts();
  useGetUserFollowing();
  useGetOldChatUsers();

  const userData = useSelector((state) => state.user.userData);

  console.log("user data in home : ", userData);
  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20">
      <Navbar />
      <Story />
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {!Currloading && !allPostsLoading && <Feed />}
        <div className="lg:col-span-4 hidden lg:block">
          {!loading && <SuggestedUsers />}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}
