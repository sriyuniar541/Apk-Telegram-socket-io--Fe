import "./chat.module.css";
import io from "socket.io-client";
import { useState ,useEffect} from "react";
import Chat from "./chat";
import Sidebar from "../../components/sidebar";


const socket = io.connect(process.env.REACT_APP_BACKEND_USER);

function ChatGrups() {
  const [username, setUsername] = useState("sri");
  const [rooms, setRooms] = useState("global");

  useEffect(()=>{
    const username = JSON.parse(localStorage.getItem('user')).fullname
    const rooms = JSON.parse(localStorage.getItem('group')).name
    setUsername(username)
    setRooms(rooms)
    console.log(username,rooms,'ini data select localstroge')

    if (username !== "" && rooms !== "") {
      socket.emit("join_room_group", rooms);
    }
 
  },[])
  

  return (
    <div className="ChatGrup">
      <div className="row  ">
        <div className="col-12">
          <div className='d-flex  '>
          <Sidebar />
          <Chat socket={socket} username={username} rooms={rooms} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGrups;