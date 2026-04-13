const Reel = require("../models/reel.model");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const uploadReel = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json("Media is not found to upload");
    }

    const media = await uploadOnCloudinary(req.file.path);

    const reel = await Reel.create({
      author: req.userId,
      media,
      caption,
    });

    const user = await User.findById(req.userId);
    user.reels.unshift(reel._id);
    await user.save();
    return res
      .status(200)
      .json({ message: "Reel uploaded Successfully", reel });
  } catch (e) {
    console.log(e);
  }
};

const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find({})
      .populate("author", "username fullName profilePicture")
      .populate("comments.author", "username fullName profilePicture")
      .sort({ createdAt: -1 });

    const filteredReels = reels.filter((reel) => {
      return reel.author._id.toString() !== req.userId;
    });
    return res.status(200).json({
      reels: filteredReels,
    });
  } catch (e) {
    console.log(e);
  }
};

const likeReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json("reel not found");
    }
    if (reel.likes.includes(req.userId)) {
      reel.likes = reel.likes.filter((id) => id.toString() !== req.userId);
      io.emit("likedReel", { reelId: reel._id, likes: reel.likes });

      await reel.save();
      return res.status(200).json("reel unliked");
    }
    reel.likes.push(req.userId);
    if (reel.author.toString() !== req.userId) {
      const notification = await Notification.create({
        receiver: reel.author,
        sender: req.userId,
        type: "like",
        reel: reel._id,
        message: "liked your reel",
      });

      const populatedNotification = await notification
        .findById(notification._id)
        .populate(
          "sender receiver reel",
          "username fullName profilePicture media",
        );
      const receiverSocketId = getSocketId(reel.author.toString());
      if (receiverSocketId)
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
    }
    io.emit("likedReel", { reelId: reel._id, likes: reel.likes });
    await reel.save();
    return res.status(200).json("reel liked");
  } catch (e) {
    console.log(e);
  }
};

const commentOnReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const { message } = req.body;

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json("reel not found");
    }
    reel.comments.push({
      author: req.userId,
      message,
    });
    if (reel.author.toString() !== req.userId) {
      const notification = await Notification.create({
        receiver: reel.author,
        sender: req.userId,
        type: "comment",
        reel: reel._id,
        message: "commented on your reel",
      });

      const populatedNotification = await notification
        .findById(notification._id)
        .populate(
          "sender receiver reel",
          "username fullName profilePicture media",
        );
      const receiverSocketId = getSocketId(reel.author.toString());
      if (receiverSocketId)
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
    }
    io.emit("commentedReel", { reelId: reel._id, comments: reel.comments });
    await reel.save();
    return res.status(200).json({ message: "Comment added", reel });
  } catch (e) {
    console.log(e);
  }
};

const saveReel = async (req, res) => {
  try {
    const { reelId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 safe ObjectId check
    const alreadySaved = user.savedPosts.some(
      (id) => id.toString() === reelId.toString(),
    );

    // ================= UNSAVE =================
    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId.toString(),
      );
      await user.save();

      return res.status(200).json({
        message: "Reel unsaved",
      });
    }

    // ================= SAVE =================
    user.savedPosts.push(postId);
    await user.save();

    return res.status(200).json({
      message: "Reel saved",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { uploadReel, getAllReels, likeReel, commentOnReel, saveReel };
