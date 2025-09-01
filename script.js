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
    methods: ["GET","POST"]
  }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (data) => {
    onlineUsers[socket.id] = { username: data.username, avatar: data.avatar };
    io.emit("online users", Object.values(onlineUsers));
  });

  socket.on("chat message", (data) => {
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("online users", Object.values(onlineUsers));
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
