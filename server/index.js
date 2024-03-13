// server.js
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  })
);

app.get("/", (req, res) => {
  res.send("Connected and live");
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("send-to-my-server", (message, room) => {
    console.log(message);
    if (room === '') {
      // io.emit("send-to-all-clients", message); if u wanna send to everyone including yourself
      
      //if u wanna send to all othere except yourself
      socket.broadcast.emit("send-to-all-clients", message);
    } else {
      io.to(room).emit("send-to-room", message);//this means message will go to all users including u who has joined the room

      // socket.to(room).emit("send-to-room", message);
      //means message will only go to all people joined room but not to you
    }
  });


  socket.on("join-room",(room)=>{
    console.log(`Room joined by ${socket.id} and ${room}`);
    socket.join(room)
  })

});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});

export { app, server };
