const express = require("express");
const {
  getCurrentUser,
  suggestedUsers,
  editUser,
  getProfile,
  follow,
  getUserFollowing,
  getAllNotifications,
  markNotificationAsRead,
} = require("../controllers/user.controller");
const isAuthorized = require("../middlewares/isAuthorized");
const Router = express.Router();
const upload = require("../middlewares/multer");
const { search } = require("../controllers/user.controller");

Router.get("/", isAuthorized, getCurrentUser);
Router.get("/suggestedUsers", isAuthorized, suggestedUsers);
Router.put("/edit", isAuthorized, upload.single("image"), editUser);
Router.post("/follow/:targetUser", isAuthorized, follow);
Router.get("/following", isAuthorized, getUserFollowing);
Router.get("/search", isAuthorized, search);
Router.get("/notifications", isAuthorized, getAllNotifications);
Router.put("/notifications", isAuthorized, markNotificationAsRead);
Router.get("/:userName", isAuthorized, getProfile);

module.exports = Router;
