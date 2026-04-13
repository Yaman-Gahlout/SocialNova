const Notification = require("../models/notification.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { io, getSocketId } = require("../socket");
const uploadOnCloudinary = require("../utils/cloudinary");

const createPost = async (req, res) => {
  try {
    const { mediaType, caption } = req.body;

    if (!req.file) {
      return res.status(400).json("Media is not found to upload");
    }

    const media = await uploadOnCloudinary(req.file.path);

    const post = await Post.create({
      author: req.userId,
      mediaType,
      media,
      caption,
    });

    const user = await User.findById(req.userId);
    user.posts.unshift(post._id);
    await user.save();
    return res.status(200).json({ message: "Post created Successfully", post });
  } catch (e) {
    console.log(e);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username fullName profilePicture")
      .populate("comments.author", "username fullName profilePicture")
      .sort({ createdAt: -1 });

    const filteredPosts = posts.filter((post) => {
      return post.author._id.toString() !== req.userId;
    });
    return res.status(200).json({
      posts: filteredPosts,
    });
  } catch (e) {
    console.log(e);
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    if (post.likes.includes(req.userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
      console.log("emitting likedPost event with:", {
        postId: post._id,
        likes: post.likes,
      });
      io.emit("likedPost", { postId: post._id, likes: post.likes });

      await post.save();
      return res.status(200).json("Post unliked");
    }
    post.likes.push(req.userId);
    if (post.author.toString() !== req.userId) {
      const notification = await Notification.create({
        receiver: post.author,
        sender: req.userId,
        type: "like",
        post: post._id,
        message: "liked your post",
      });

      const populatedNotification = await Notification.findById(
        notification._id,
      ).populate("sender receiver post");
      const receiverSocketId = getSocketId(post.author.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }
    console.log("emitting likedPost event with:", {
      postId: post._id,
      likes: post.likes,
    });
    io.emit("likedPost", { postId: post._id, likes: post.likes });
    console.log("event emitted, now saving post...");
    await post.save();
    return res.status(200).json("Post liked");
  } catch (e) {
    console.log(e);
  }
};

const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { message } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    post.comments.push({
      author: req.userId,
      message,
    });
    if (post.author.toString() !== req.userId) {
      const notification = await Notification.create({
        receiver: post.author,
        sender: req.userId,
        type: "comment",
        post: post._id,
        message: "commented on your post",
      });

      const populatedNotification = await Notification.findById(
        notification._id,
      ).populate("sender receiver post");
      const receiverSocketId = getSocketId(post.author.toString());
      if (receiverSocketId)
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
    }
    io.emit("commentedPost", { postId: post._id, comments: post.comments });
    await post.save();
    await post.populate("comments.author", "username fullName profilePicture");
    return res.status(200).json({ message: "Comment added", post });
  } catch (e) {
    console.log(e);
  }
};

const savePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 safe ObjectId check
    const alreadySaved = user.savedPosts.some(
      (id) => id.toString() === postId.toString(),
    );

    // ================= UNSAVE =================
    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId.toString(),
      );

      await user.save();

      return res.status(200).json({
        message: "Post unsaved",
      });
    }

    // ================= SAVE =================
    user.savedPosts.push(postId);
    await user.save();

    return res.status(200).json({
      message: "Post saved",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { createPost, getAllPosts, likePost, commentOnPost, savePost };
