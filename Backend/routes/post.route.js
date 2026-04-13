const express = require("express");
const isAuthorized = require("../middlewares/isAuthorized");
const {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  savePost,
} = require("../controllers/post.controller");
const upload = require("../middlewares/multer");
const Router = express.Router();

Router.post("/", isAuthorized, upload.single("media"), createPost);
Router.get("/", isAuthorized, getAllPosts);
Router.post("/like/:postId", isAuthorized, likePost);
Router.post("/comment/:postId", isAuthorized, commentOnPost);
Router.post("/save/:postId", isAuthorized, savePost);

module.exports = Router;
