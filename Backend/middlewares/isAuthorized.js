const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  try {
    console.log("cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedToken.userId;

    next(); // ✅ only runs if everything is valid
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isAuthorized;
