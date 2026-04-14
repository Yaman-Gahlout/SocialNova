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

const allowedOrigins = [
  "http://localhost:5173",
  "https://socialnova-6uat.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin:", origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

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
