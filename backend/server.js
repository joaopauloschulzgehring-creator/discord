const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// store connected users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  // when a user joins, store their info
  socket.on("join", (data) => {
    onlineUsers[socket.id] = { username: data.username, avatar: data.avatar };
    io.emit("online users", Object.values(onlineUsers));
  });

  // chat messages
  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  // when a user disconnects
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("online users", Object.values(onlineUsers));
    console.log("a user disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
