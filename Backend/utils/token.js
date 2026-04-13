const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (userId) => {
  if (userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });
    return token;
  }
};

module.exports = generateToken;
