const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require('dotenv').config()

app.use(cors());
app.use('/', (req, res) => {
  res.send('deh socket io server parna!')
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://oniquickchat.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("deh user connected", socket.id);

  socket.on("join_chat", (data) => {
    socket.join(data.room);
    console.log(`user ${data.username} has joined room ${data.room}`);
    io.to(data.room).emit("user_connected", ` ${data.username} has connected`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("get_message", data);
  });


  socket.on("exit_chat", data => {
    console.log(`${data.username} has disconnected`);
    io.to(data.room).emit("user_disconnected", ` ${data.username} has disconnected`);
})

  socket.on("disconnect", () => {
    console.log("deh user deconnected", socket.id);
    
  });
});


server.listen(process.env.PORT || 4000, () => {
  console.log("yoo deh server running");
});
