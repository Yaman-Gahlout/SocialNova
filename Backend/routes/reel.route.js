const express = require("express");
const isAuthorized = require("../middlewares/isAuthorized");

const upload = require("../middlewares/multer");
const {
  uploadReel,
  getAllReels,
  likeReel,
  commentOnReel,
  saveReel,
} = require("../controllers/reel.controller");
const Router = express.Router();

Router.post("/", isAuthorized, upload.single("media"), uploadReel);
Router.get("/", isAuthorized, getAllReels);
Router.post("/like/:reelId", isAuthorized, likeReel);
Router.post("/comment/:reelId", isAuthorized, commentOnReel);
Router.post("/save/:reelId", isAuthorized, saveReel);

module.exports = Router;
