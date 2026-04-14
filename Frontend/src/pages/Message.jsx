import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSend,
  FiMoreVertical,
  FiImage,
  FiArrowLeft,
} from "react-icons/fi";
import profileImage from "../assets/userImage.avif";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, setSelectedUser } from "../redux/slice/message.slice";
import BottomNavbar from "../components/BottomNavbar";

export default function SocialNovaMessages() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const selectedUser = useSelector((state) => state.message.selectedUser);
  const messages = useSelector((state) => state.message.messages) || [];
  const userData = useSelector((state) => state.user.userData);
  const scrollRef = useRef();
  const userFollowing = useSelector((state) => state.user.following);
  const onlineUsers = useSelector((state) => state.socket.onlineUsers);
  const oldChatUsers = useSelector((state) => state.message.oldChatUsers);
  const socket = useSelector((state) => state.socket.socket);

  // ✅ MERGE USERS (NO DUPLICATES)
  const allUsers = useMemo(() => {
    const map = new Map();

    userFollowing.forEach((u) => map.set(u._id, u));
    oldChatUsers.forEach((u) => {
      if (!map.has(u._id)) map.set(u._id, u);
    });

    return Array.from(map.values());
  }, [userFollowing, oldChatUsers]);

  // ✅ FETCH MESSAGES
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages();
    }
  }, [selectedUser]);

  // ✅ SOCKET LISTENER (FIXED)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch(setMessages([...messages, message]));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser?._id) return;

    const newMsg = {
      _id: Date.now(),
      message: text,
      sender: userData._id,
      createdAt: new Date(),
    };

    dispatch(setMessages([...messages, newMsg]));
    setText("");

    try {
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/messages/",
        {
          receiverId: selectedUser._id,
          message: text,
        },
        { withCredentials: true },
      );

      dispatch(setMessages([...messages, response.data.message]));
    } catch (err) {
      console.log(err);
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser?._id) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("receiverId", selectedUser._id);

    try {
      const response = await axios.post(
        "https://socialnova-backend.onrender.com/messages/",
        formData,
        { withCredentials: true },
      );

      dispatch(setMessages([...messages, response.data.message]));
    } catch (err) {
      console.log(err);
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `https://socialnova-backend.onrender.com/messages/${selectedUser._id}`,
        { withCredentials: true },
      );
      dispatch(setMessages(response.data.messages || []));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ TIME FORMAT
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-screen w-full bg-[#020617] text-white flex">
      {/* ===== USERS LIST (MOBILE + DESKTOP) ===== */}
      <div
        className={`${
          isMobileChatOpen ? "hidden" : "flex"
        } md:flex flex-col w-full md:w-[340px] border-r border-slate-800`}
      >
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                dispatch(setSelectedUser(user));
                setIsMobileChatOpen(true);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#0F172A]"
            >
              <div className="relative">
                <img
                  src={user?.profilePicture || profileImage}
                  className="w-11 h-11 rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#020617]" />
                )}
              </div>

              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-slate-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <BottomNavbar />
      </div>

      {/* ===== CHAT SECTION ===== */}
      <div
        className={`flex flex-col flex-1 ${
          !selectedUser ? "hidden md:flex" : ""
        } ${!isMobileChatOpen ? "hidden md:flex" : "flex"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* MOBILE BACK */}
            <button
              onClick={() => setIsMobileChatOpen(false)}
              className="md:hidden p-2 bg-[#0F172A] rounded-lg"
            >
              <FiArrowLeft />
            </button>

            <img
              src={selectedUser?.profilePicture || profileImage}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-medium">{selectedUser?.fullName || "User"}</p>
              <p className="text-sm text-blue-400">
                {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <FiMoreVertical />
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {messages.map((msg) => (
            <div key={msg._id}>
              {msg.sender === userData?._id ? (
                <div ref={scrollRef} className="flex gap-2 justify-end">
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className=" rounded-xl overflow-hidden shadow-lg text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black">
                      {msg?.message && (
                        <div className="px-4 py-2">{msg.message}</div>
                      )}
                      {msg?.image && (
                        <img
                          src={msg.image}
                          className="max-h-[250px] w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <img
                    src={userData?.profilePicture || profileImage}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <img
                    src={selectedUser?.profilePicture || profileImage}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col items-start gap-2">
                    <div className=" rounded-xl overflow-hidden shadow-lg text-sm bg-[#0F172A] border border-slate-800">
                      {msg?.message && (
                        <div className="px-4 py-2">{msg.message}</div>
                      )}
                      {msg?.image && (
                        <img
                          src={msg.image}
                          className="max-h-[250px] w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={() => fileRef.current.click()}
            className="p-2 bg-[#0F172A] rounded-xl"
          >
            <FiImage />
          </button>

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={sendImage}
          />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-[#0F172A] px-4 py-2 rounded-xl"
            placeholder="Message..."
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black rounded-xl"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
