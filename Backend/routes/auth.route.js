const express = require("express");
const {
  signup,
  login,
  logout,
  sendOTP,
  verifyOTP,
  resetPassword,
} = require("../controllers/auth.controller");
const isAuthorized = require("../middlewares/isAuthorized");
const Router = express.Router();

Router.post("/signup", signup);
Router.post("/login", login);
Router.get("/logout", isAuthorized, logout);
Router.post("/sendOtp", sendOTP);
Router.post("/verifyOtp", verifyOTP);
Router.post("/resetPassword", resetPassword);

module.exports = Router;
