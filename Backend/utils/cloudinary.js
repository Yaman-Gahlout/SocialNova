const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

async function uploadOnCloudinary(file) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    fs.unlinkSync(file);
    return res.secure_url;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(file);
  }
}
module.exports = uploadOnCloudinary;
