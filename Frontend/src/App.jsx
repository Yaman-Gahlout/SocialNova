import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import Upload from "./pages/Upload";
import Reels from "./pages/Reels";
import StoryViewPage from "./components/StoryViewPage";
import Message from "./pages/Message";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./redux/slice/socket.slice";
import SearchPage from "./pages/Search";
import NotificationPage from "./pages/Notification";
import useGetAllNotifications from "./hooks/useGetAllNotifications";
import { setNotifications } from "./redux/slice/user.slice";
import { setPostsData } from "./redux/slice/post.slice";

function App() {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const notifications = useSelector((state) => state.user.notifications);
  const postsData = useSelector((state) => state.post.postsData);
  const profileData = useSelector((state) => state.user.profileData);
  const messages = useSelector((state) => state.message.messages);
  const userFollowing = useSelector((state) => state.user.following);

  useEffect(() => {
    console.log("socket in Post.jsx: ", socket);
    socket?.on("likedPost", (updatedData) => {
      console.log("Received postLiked event: ", updatedData);
      const updatedPosts = postsData.map((post) => {
        if (post._id === updatedData.postId) {
          return { ...post, likes: updatedData.likes };
        }
        return post;
      });
      dispatch(setPostsData(updatedPosts));
    });

    socket?.on("commentedPost", (updatedData) => {
      console.log("Received postCommented event: ", updatedData);
      const updatedPosts = postsData.map((post) => {
        if (post._id === updatedData.postId) {
          return { ...post, comments: updatedData.comments };
        }
        return post;
      });
      dispatch(setPostsData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (userData) {
      const socketIO = io("https://socialnova-backend.onrender.com", {
        query: {
          userId: userData._id,
        },
        withCredentials: true, // 🔥 REQUIRED
        transports: ["websocket"],
      });
      socketIO.on("connect", () => {
        console.log("✅ CONNECTED:", socketIO.id);
        dispatch(setSocket(socketIO)); // 🔥 ONLY HERE
      });

      socketIO.on("getOnlineUsers", (users) => {
        console.log("Online users: ", users);
        dispatch(setOnlineUsers(users));
      });
      return () => {
        socketIO.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  socket?.on("newNotification", (notification) => {
    console.log("New notification received: ", notification);
    if (notification)
      dispatch(setNotifications([...notifications, notification]));
  });

  useGetAllNotifications();
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile"
          element={
            profileData ? <Profile /> : <Navigate to={"/home"}></Navigate>
          }
        />
        <Route
          path="/editProfile"
          element={
            profileData ? <EditProfile /> : <Navigate to={"/home"}></Navigate>
          }
        />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/upload" element={<Upload />} />
        <Route
          path="/reels"
          element={postsData ? <Reels /> : <Navigate to={"/home"}></Navigate>}
        />
        <Route
          path="/message"
          element={
            messages && userFollowing ? (
              <Message />
            ) : (
              <Navigate to={"/home"}></Navigate>
            )
          }
        />

        <Route path="/story/:username" element={<StoryViewPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/notifications"
          element={
            userData ? <NotificationPage /> : <Navigate to={"/home"}></Navigate>
          }
        />
      </Routes>
    </>
  );
}

export default App;
