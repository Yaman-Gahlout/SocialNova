const express = require("express");
const isAuthorized = require("../middlewares/isAuthorized");
const upload = require("../middlewares/multer");
const {
  sendMessage,
  getMessages,
  getPrevUsers,
} = require("../controllers/message.controller");
const Router = express.Router();

Router.post("/", isAuthorized, upload.single("media"), sendMessage);
Router.get("/prevUsers", isAuthorized, getPrevUsers);
Router.get("/:receiverId", isAuthorized, getMessages);

module.exports = Router;
