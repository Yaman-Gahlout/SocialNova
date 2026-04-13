const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection failed: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
