const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require("dotenv").config();

console.log(process.env.PORT);

let typingUsers = [];

// app.use(express.static(__dirname + "/public"));
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("typing users", typingUsers);

  socket.on("new user", (msg) => {
    console.log("New user: " + msg);
    io.emit("chat message", `${msg} has joined the chat`);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("user typing", (name) => {
    if (!typingUsers.includes(name)) {
      typingUsers = [...typingUsers, name];
    }
    io.emit("typing users", typingUsers);
  });

  socket.on("user not typing", (name) => {
    typingUsers = typingUsers.filter((_name) => {
      return _name !== name;
    });
    io.emit("typing users", typingUsers);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
