const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const { io, getSocketId } = require("../socket");
const uploadOnCloudinary = require("../utils/cloudinary");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(404).json({
        message: "userId not found",
      });
    }

    const user = await User.findById(userId)
      .select("-password")

      .populate("posts")
      .populate("story")
      .lean();

    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password",
    );
    return res.status(200).json({
      users,
    });
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { username, fullName, bio, gender, profession } = req.body;
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sameUserWithUsername = await User.findOne({ username }).select(
      "-password",
    );
    if (
      sameUserWithUsername &&
      sameUserWithUsername._id.toString() !== req.userId
    ) {
      return res.status(400).json({ message: "username already exists" });
    }

    let profileImage;
    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
    }

    user.fullName = fullName;
    user.username = username;
    user.bio = bio;
    user.gender = gender;
    user.profession = profession;
    if (profileImage) {
      user.profilePicture = profileImage;
    }
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (e) {
    console.log(e);
  }
};

const getProfile = async (req, res) => {
  try {
    const username = req.params.userName;
    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "author comments.author",
          select: "username fullName profilePicture",
        },
      })
      .populate("followers")
      .populate("following")
      .populate({
        path: "savedPosts",
        populate: {
          path: "author comments.author",
          select: "username fullName profilePicture",
        },
      })
      .populate("story");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

const follow = async (req, res) => {
  try {
    const userId = req.userId;
    const targetUserId = req.params.targetUser;

    if (!targetUserId) {
      return res.status(400).json({
        message: "Target user id not found",
      });
    }

    const user = await User.findById(userId);
    const targetedUser = await User.findById(targetUserId);

    if (!user || !targetedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ===== UNFOLLOW =====
    if (user.following.includes(targetUserId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId,
      );

      targetedUser.followers = targetedUser.followers.filter(
        (id) => id.toString() !== userId,
      );

      await user.save();
      await targetedUser.save();

      return res.status(200).json({
        message: "User unfollowed",
      });
    }

    // ===== FOLLOW =====
    user.following.push(targetUserId);
    targetedUser.followers.push(userId);

    const notification = await Notification.create({
      receiver: targetedUser._id,
      sender: user._id,
      type: "follow",
      message: "started following you",
    });

    const populatedNotification = await notification
      .findById(notification._id)
      .populate("sender receiver post reel");
    const receiverSocketId = getSocketId(targetedUser._id.toString());
    if (receiverSocketId)
      io.to(receiverSocketId).emit("newNotification", populatedNotification);

    await user.save();
    await targetedUser.save();

    return res.status(200).json({
      message: "User followed",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "following",
      select: "username fullName profilePicture story",
      populate: {
        path: "story",
        select: "author media mediaType viewers",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      following: user.following,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const search = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Search query:", query);
    if (!query) {
      return res.status(400).json({ message: "Query not found" });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("username fullName profilePicture");
    console.log("Search results:", users);

    return res.status(200).json({ users });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.userId })
      .populate("sender receiver post reel")
      .sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (Array.isArray(notificationId)) {
      await Notification.updateMany(
        { _id: { $in: notificationId }, receiver: req.userId },
        { $set: { isRead: true } },
      );
    } else {
      await Notification.findOneAndUpdate(
        { _id: notificationId, receiver: req.userId },
        { $set: { isRead: true } },
      );
    }
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCurrentUser,
  suggestedUsers,
  editUser,
  getProfile,
  follow,
  getUserFollowing,
  search,
  getAllNotifications,
  markNotificationAsRead,
};
