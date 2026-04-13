const Story = require("../models/story.model");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");

const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { mediaType } = req.body;
    if (!req.file) {
      return res.status(404).json("media not found");
    }
    const media = await uploadOnCloudinary(req.file.path);

    const story = await Story.create({
      author: req.userId,
      mediaType,
      media,
    });

    user.story.push(story._id);
    await user.save();

    return res.status(201).json({ message: "story uploaded successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const viewStory = async (req, res) => {
  try {
    const storyId = req.params;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json("story not found");
    }

    if (story.viewers.includes(req.userId)) {
      return res.status(200).json("already seen");
    }

    story.viewers.push(req.userId);
    await story.save();
    return res.status(200).json({ message: "story has been seen" });
  } catch (e) {
    res.status(500).json(err);
  }
};

const getStoryByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stories = await Story.find({ author: user._id })
      .populate("author", "username profilePicture fullName")
      .populate("viewers", "username profilePicture fullName");

    if (!stories || stories.length === 0) {
      return res.status(200).json({ story: [] });
    }

    for (let story of stories) {
      if (
        req.userId &&
        req.userId.toString() !== story.author._id.toString() &&
        !story.viewers.some(
          (viewer) => viewer._id.toString() === req.userId.toString(),
        )
      ) {
        story.viewers.push(req.userId);
        await story.save();
      }
    }

    const updatedStories = await Story.find({ author: user._id })
      .populate("author", "username profilePicture fullName")
      .populate("viewers", "username profilePicture fullName");

    return res.status(200).json({ story: updatedStories });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadStory, viewStory, getStoryByUsername };
