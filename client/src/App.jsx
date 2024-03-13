import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomJoined,setRoomJoined] = useState(false)

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      setSocketId(socket.id);
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("send-to-all-clients", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("send-to-room", (data) => {
        setMessages((prev) => [...prev, data + " ---- In my personal room ---- "]);
      });
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message && socket) {
      socket.emit("send-to-my-server", message, room);
      setMessage("");
      // setRoom("");
    }
  };

  const handleJoinRoom = () =>{
    if(room  && socket)
    {
      socket.emit("join-room",room)
      setRoomJoined(true);
      // setRoom("")
    }
  }

  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
      <button onClick={handleJoinRoom}>Join room</button>

      <button onClick={handleSendMessage}>Send Message</button>
      {
        roomJoined ? <div>Room joined</div> : <div>Room Not joined yet</div>
      }
      <div>
        <br/>
        <div>You are connected with : {socketId}</div>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </div>
    </div>
  );
}

export default App;
