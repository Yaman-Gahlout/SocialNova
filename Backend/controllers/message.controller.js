const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { getSocketId, io } = require("../socket");
const uploadOnCloudinary = require("../utils/cloudinary");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.body.receiverId;
    const { message } = req.body;

    console.log("Received message:", {
      senderId,
      receiverId,
      message,
      file: req.file,
    });
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    console.log("conversation after update:", conversation);

    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);
    return res
      .status(200)
      .json({ message: "Message sent successfully", message: newMessage });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    console.log("Fetching messages for:", { senderId, receiverId });
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res
        .status(204)
        .json({ message: "Conversation not found", messages: [] });
    }

    return res.status(200).json({ messages: conversation.messages });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getPrevUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "username profilePicture fullName");

    const prevUsers = conversations.map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => participant._id.toString() !== userId,
      );
      return otherUser;
    });

    return res.status(200).json({ prevUsers });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getPrevUsers,
};
