const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://socialnova-6uat.onrender.com",
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
