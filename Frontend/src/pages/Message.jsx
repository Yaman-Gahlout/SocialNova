import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSend,
  FiMoreVertical,
  FiImage,
  FiSmile,
  FiArrowLeft,
} from "react-icons/fi";
import profileImage from "../assets/userImage.avif";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages, setSelectedUser } from "../redux/slice/message.slice";

export default function SocialNovaMessages() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
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
  // ✅ FIX: fetch messages when user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      dispatch(setMessages([...messages, message]));
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages]);
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser?._id) return;

    const newMsg = {
      _id: Date.now(),
      message: text,
      sender: userData._id,
    };

    // ✅ optimistic UI
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

      console.log(response);
      // replace with actual response
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
        {
          withCredentials: true,
        },
      );

      console.log(response);
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

  // useEffect(
  //   () => {
  //     scrollRef.current.scrollIntoView({ behavior: "smooth" });
  //   },
  //   [messages.message],
  //   [messages.image],
  // );

  return (
    <div className="h-screen w-full bg-[#020617] text-white flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-[340px] border-r border-slate-800 bg-[#020617]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2
            onClick={() => navigate("/home")}
            className="text-xl cursor-pointer font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] bg-clip-text text-transparent"
          >
            SocialNova
          </h2>
          <FiMoreVertical />
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-2 rounded-xl border border-slate-800">
            <FiSearch className="text-slate-400" />
            <input
              placeholder="Search conversations"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userFollowing.map((user) => (
            <div
              key={user.id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-[#0F172A]`}
            >
              <div className="relative">
                <img
                  src={user?.profilePicture || profileImage}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 -right-1 w-4 h-4 bg-blue-600 border-2 border-[#020617] rounded-full " />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-slate-400 truncate">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-blue-500">Online</span>
                  ) : (
                    <span className="text-slate-400">Offline</span>
                  )}
                </p>
              </div>
            </div>
          ))}
          {console.log("old chat users : ", oldChatUsers)}
          {oldChatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`flex ${userData.following.includes(user._id) ? "hidden" : ""} items-center gap-3 px-4 py-3 cursor-pointer transition hover:bg-[#0F172A]`}
            >
              <div className="relative">
                <img
                  src={user?.profilePicture || profileImage}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 -right-1 w-4 h-4 bg-blue-600 border-2 border-[#020617] rounded-full " />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-slate-400 truncate">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-blue-500">Online</span>
                  ) : (
                    <span className="text-slate-400">Offline</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#020617]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-xl bg-[#0F172A] border border-slate-800 hover:bg-slate-800 transition"
            >
              <FiArrowLeft />
            </button>
            <img
              src={
                selectedUser?.profilePicture
                  ? selectedUser?.profilePicture
                  : profileImage
              }
              className="w-10 h-10 rounded-full object-cover"
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-gradient-to-b from-[#020617] to-[#020617]/70">
          {messages.length > 0 &&
            messages.map((msg) => (
              <div key={msg._id}>
                {msg.sender === userData?._id ? (
                  <div
                    ref={scrollRef}
                    className={"flex gap-2 justify-end items-baseline"}
                  >
                    <div className="max-w-[70%] rounded-2xl overflow-hidden shadow-lg text-sm bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black">
                      {msg?.message && typeof msg.message === "string" && (
                        <div className="px-4 py-2">{msg.message}</div>
                      )}
                      {msg?.image && (
                        <img
                          src={msg?.image}
                          className="max-h-[250px] w-full object-cover"
                        />
                      )}
                    </div>
                    <img
                      src={
                        userData?.profilePicture
                          ? userData?.profilePicture
                          : profileImage
                      }
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={"flex gap-2 justify-start items-baseline"}>
                    <img
                      src={
                        selectedUser?.profilePicture
                          ? selectedUser?.profilePicture
                          : profileImage
                      }
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="max-w-[70%] rounded-2xl overflow-hidden shadow-lg text-sm bg-[#0F172A] border border-slate-800">
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
                  </div>
                )}
              </div>
            ))}
        </div>

        <div>
          {messages.length === 0 && (
            <div className="flex flex-col items-center mb-25 gap-4 mt-20">
              <p className="text-slate-400 text-2xl opacity-65">
                No messages yet
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-[#020617]">
          <button
            onClick={() => fileRef.current.click()}
            className="p-2 rounded-xl bg-[#0F172A] border border-slate-800 hover:bg-slate-800 transition"
          >
            <FiImage />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={sendImage}
            className="hidden"
          />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-[#0F172A] border border-slate-800 px-4 py-2 rounded-xl outline-none"
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-black font-medium flex items-center gap-2 hover:scale-105 transition"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
