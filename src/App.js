import './App.css';
import Login from '../src/pages/Login';
import Register from '../src/pages/Registrasi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Edit from '../src/pages/EditProfile';
import Home from '../src/pages/Home';
import Otp from './pages/Otp';
import Chat from './pages/Group_chat/chat';
import JoinGroups from './pages/Group_chat/join_group';
import UpdateRoom from './pages/Group_chat/updateRoom';
import MakeRoom from './pages/Group_chat/insertRoom';
import ChatGrups from './pages/Group_chat/ChatByGrups';


function App() {
  const socket = socketIO.connect(process.env.REACT_APP_BACKEND_USER);
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/chat" element={<Chat />} />  */}
        <Route path="/" element={<Login />} /> 
        <Route path="/otp" element={<Otp />} /> 
        <Route path="/chat" element={<Chat socket={socket} />} />
        <Route path="/JoinGroups" element={<JoinGroups />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/editProfile" element={<Edit />} />
        <Route path="/ChatGrups" element={<ChatGrups />} />
        <Route path="/updateGroup/:id" element={<UpdateRoom />} />
        <Route path="/insertGroup" element={<MakeRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
