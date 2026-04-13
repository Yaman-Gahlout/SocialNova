const express = require("express");
const isAuthorized = require("../middlewares/isAuthorized");
const upload = require("../middlewares/multer");
const {
  uploadStory,
  viewStory,
  getStoryByUsername,
} = require("../controllers/story.controller");
const Router = express.Router();

Router.post("/", isAuthorized, upload.single("media"), uploadStory);
Router.get("/:username", isAuthorized, getStoryByUsername);
Router.post("/:storyId", isAuthorized, viewStory);

module.exports = Router;
