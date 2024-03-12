import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
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

  const handleSendMessage = () => {
    socket.emit("send-to-my-server", message);
    setMessage("");
  }

  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send Message</button>
      {messages.length > 0 ? <>{messages[messages.length - 1]}</> : <>empty</>}
    </div>
  );
}

export default App;