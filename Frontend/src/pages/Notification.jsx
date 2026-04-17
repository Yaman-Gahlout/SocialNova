import React from "react";
import { FiHeart, FiUserPlus, FiMessageCircle } from "react-icons/fi";
import BottomNavbar from "../components/BottomNavbar";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import useGetAllNotifications from "../hooks/useGetAllNotifications";

function NotificationPage() {
  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <FiHeart className="text-red-500 text-xl" />;
      case "follow":
        return <FiUserPlus className="text-[#00D4FF] text-xl" />;
      case "comment":
        return <FiMessageCircle className="text-green-400 text-xl" />;
      default:
        return null;
    }
  };

  const notifications = useSelector((state) => state.user.notifications);

  useGetAllNotifications();
  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 ">
      <div className="max-w-xl mx-auto mb-[60px]">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-6">Notifications</h1>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center gap-4 bg-[#0F172A] border border-slate-800 p-4 rounded-xl hover:bg-[#1E293B] transition"
            >
              {/* Icon */}
              <div className="p-2 rounded-full bg-[#020617]">
                {getIcon(n.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold text-md">
                    {n?.sender?.username}
                  </span>{" "}
                  {n.message}.
                </p>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
}

export default NotificationPage;
