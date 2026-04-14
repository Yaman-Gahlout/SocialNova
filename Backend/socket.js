const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://socialnova-6uat.onrender.com",
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      console.log("Socket Origin:", origin);

      // allow non-browser clients (Postman, mobile)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Socket CORS blocked: " + origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userIdToSocketIdsMap = {};

const getSocketId = (receiverId) => {
  return userIdToSocketIdsMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userIdToSocketIdsMap[userId] = socket.id;
  }

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userIdToSocketIdsMap));

  socket.on("disconnect", () => {
    delete userIdToSocketIdsMap[userId];

    io.emit("getOnlineUsers", Object.keys(userIdToSocketIdsMap));
  });
});
module.exports = { app, io, server, getSocketId };
