const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token");
const sendEmail = require("../utils/email");
const generateOTP = require("../utils/generateOTP");
const OTP = require("../models/otp.model");

const signup = async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (!username || !email || !fullName || !password) {
    return res.status(404).json({
      message: "Missing Credentials",
    });
  }

  const sameUserWithUsername = await User.findOne({ username }).select(
    "-password",
  );

  if (sameUserWithUsername) {
    return res.status(400).json({
      message: "User with this username exists",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must have atleast 6 letters",
    });
  }

  const isExistsEmail = await User.findOne({ email: email });

  if (isExistsEmail) {
    return res.status(400).json({
      message: "User with this email address exists",
    });
  }
  const isExistsUsername = await User.findOne({ username: username });

  if (isExistsUsername) {
    return res.status(400).json({
      message: "User with this username exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    username,
    email,
    password: hashPassword,
  });
  return res.status(201).json({
    message: "Account Created Successfully",
    user: user,
  });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({
        message: "Missing Credentials",
      });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User login successfully",
      user,
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json("Logged out successfully");
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email) {
    return res.status(404).json({ message: "email is undefined" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "account with this email doesn't exists" });
  }

  const response = await OTP.findOne({ userId: user._id });

  if (response.otp !== otp) {
    return res.status(400).json({ message: "Invalid Verification code" });
  }
  return res
    .status(200)
    .json({ message: "Verification code verified successfully" });
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "email is undefined" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "account with this email doesn't exists" });
  }

  const otp = generateOTP();

  const response = await OTP.create({
    userId: user._id,
    otp,
  });

  console.log(response);

  await sendEmail(email, otp);

  return res
    .status(200)
    .json({ message: "Verification code send successfully" });
};

const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(404).json({ message: "Missing Credentials" });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  const response = await User.findOneAndUpdate(
    { email },
    { password: hashPassword },
  );

  console.log(response);

  return res
    .status(200)
    .json({ message: "Password has been reset successfully" });
};

module.exports = { signup, login, logout, sendOTP, verifyOTP, resetPassword };
