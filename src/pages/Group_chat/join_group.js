import "./chat.module.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./chat.js";

const socket = io.connect("http://localhost:4000");

function JoinGroups() {
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && rooms !== "") {
      socket.emit("join_room_group", rooms);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="userName..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRooms(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} rooms={rooms} />
      )}
    </div>
  );
}

export default JoinGroups;