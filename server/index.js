import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("send-to-my-server", (data) => {
    io.emit("send-to-all-clients", data);
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});
