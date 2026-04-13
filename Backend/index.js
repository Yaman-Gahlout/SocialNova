const express = require("express");
const connectDB = require("./utils/database");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const postRoute = require("./routes/post.route");
const reelRoute = require("./routes/reel.route");
const storyRoute = require("./routes/story.route");
const messageRoute = require("./routes/message.route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket");
require("dotenv").config();
const path = require("path");

app.use(
  cors({
    origin: "https://socialnova-6uat.onrender.com",
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/reels", reelRoute);
app.use("/stories", storyRoute);
app.use("/messages", messageRoute);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

connectDB();

app.get((req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
});
