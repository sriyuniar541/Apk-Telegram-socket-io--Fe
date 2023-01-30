import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import GambarIcon from '../assets/Gmb.png';
import { Badge, Card, Dropdown, Form, Tab, Tabs } from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link } from 'react-router-dom';

const Edit = () => {
  const receiver = JSON.parse(localStorage.getItem('receiver'));
  const [socketio, setSocketIo] = useState(null);
  const [listchat, setListchat] = useState([]);
  const [message, setMessage] = useState();
  const [login, setLogin] = useState({});
  const [list, setList] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState({});
  const [activeChat, setActiveChat] = useState(1);
  const [get, setGet] = useState('')
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const self = user;
  const token = user.token;


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = user;

    setLogin(user);

    console.log(data, 'ini data');
    // console.log(socketio.id, 'ini data id');

    const users_id = user.id;


    axios
      .get(process.env.REACT_APP_BACKEND_USER + `/users/Get/${users_id}`, {
        'content-type': 'multipart/form-data',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response, 'response');
        setList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_USER);
    socket.on('send-message-response', (response) => {
      // set receiver
      const receiver = JSON.parse(localStorage.getItem('receiver'));
      // Kondisi nampilkan data receiver
      if (
        receiver.fullname === response[0].sender ||
        receiver.fullname === response[0].receiver
      ) {
        setListchat(response);
      }
    });
    setSocketIo(socket);
  }, []);

  const SubmitMessage = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const receiver = JSON.parse(localStorage.getItem('receiver'));

    // list history saat submit message
    const payload = {
      id: socketio.id,
      sender: user.fullname,
      receiver: receiver.fullname,
      message,
    };

    setListchat([...listchat, payload]);

    const data = {
      sender: user.id,
      receiver: activeReceiver.id,
      message,
    };

    socketio.emit('send-message', data);

    setMessage('');
  };

  const selectReceiver = (item) => {
    setListchat([]);
    setActiveReceiver(item);
    setActiveChat(2);

    //set receiver
    localStorage.setItem('receiver', JSON.stringify(item));
    socketio.emit('join-room', login);

    const data = {
      sender: login.id,
      receiver: item.id,
    };

    socketio.emit('chat-history', data);
  };


  //get profile
  const getProfile = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_USER + `/users/get/by/usersId`, {
        'content-type': 'multipart/form-data',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.data, 'get profile');
        setDataProfile(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    getProfile()
  }, [])

  const [dataProfile, setDataProfile] = useState({
    fullname: '',
    email: ''
  })
  const [photo, setPhoto] = useState(null)

  //edit profile
  const editProfile = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append('email', dataProfile.email)
    formdata.append('fullname', dataProfile.fullname)
    formdata.append('photo', photo)

    axios
      .put(process.env.REACT_APP_BACKEND_USER + `/users/update`, formdata, {
        'content-type': 'multipart/form-data',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response, 'response');
        getProfile()
        alert('sukses')
      })
      .catch((error) => {
        console.log(error);
        alert('eror')
      });
  }

  const handleUpdate = (e) => {
    setDataProfile({
      ...dataProfile,
      [e.target.name]: e.target.value
    })

  }

  const handleLeaveChat = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };
  return (
    <div className="row">
      <div
        className="left col-md-3 d-flex align-items-start justify-content-center flex-direction-column pt-5"
        style={{
          paddingLeft: '30px',
          height: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className="header">
          <div className="row">
            <div className="col-md-9">
              <Link to='/home' style={{ color: '#7E98DF', textTransform: 'none' }}>
                <h3>Telegram</h3>
              </Link>
            </div>
            <div className="col-md-3" style={{ paddingLeft: '10px' }}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  <img style={{}} src={GambarIcon} alt="menu icon" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/edit">Edit profile </Dropdown.Item>
                  <Dropdown.Item onClick={handleLeaveChat}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="col-md-8 offset-md-2 mt-4 " align="center" style={{}}>
            <img width={140} height={140} src={dataProfile.photo} alt="asset icon" style={{ borderRadius: '20px' }} /><br />
            <Form.Control type='file' name='photo' onChange={((e) => setPhoto(e.target.files[0]))} className=' mt-2 col-6' />
            <Form.Control type="text" value={dataProfile.fullname} name='fullname' onChange={handleUpdate} className='text-center border-white' />
            <Form.Control type="text" value={dataProfile.email} name='email' onChange={handleUpdate} className='text-center border-white' />
            <button onClick={editProfile} className='btn btn-white border'>ubah</button>
          </div>

          <div className="chats">
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="all" title="All">
                {list.map((user) => (
                  <Card className="mt-2">
                    <Card.Body
                      key={user.id}
                      onClick={() => selectReceiver(user)}
                    >
                      <div className="row ">
                        <div className="col-md-3">
                          <img width={50} height={50} src={user.photo} alt=" "   style={{borderRadius:'15px'}}/>
                        </div>
                        <div className="col-md-9"><b>{user.fullname}</b></div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Tab>
              <Tab eventKey="important" title="Important">
                folder empty
              </Tab>
              <Tab eventKey="unread" title="Unread">
                folder empty
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      <div
        className='right col-md-9' style={{backgroundColor:'#fafafa'}}>
        <div className=' chat-window'>
          <div className='chat-header bg-white py-4 px-3'>
            <img src={receiver?receiver.photo:'photo'} alt='' height={40} width={40} />
            <b className='ms-2' style={{color: '#7E98DF', fontSize: '20px',}}>  {receiver?receiver.fullname:'please select users'}</b>
          </div>
          <div className='container' style={{ backgroundColor: '#fafafa' }}>
            <ScrollToBottom className='message-container'>
              {listchat.map((item) => (
                <div key={item.id}>
                  {item.sender === login.fullname ? (
                    <div className=''>
                      <Card className='mt-2 col-md-4 offset-md-8 col-6 offset-6' style={{ borderRadius: '25px' }}>
                        <Card.Body key={item.id}>
                          <div className='row '>
                            <p className='text-secondary'>
                              <Badge bg='success'>{item.sender}</Badge>{' '}
                            </p>
                            <p>{item.message}</p>
                            <p
                              style={{ fontSize: '13px' }}
                              className='text-secondary'
                              align='right'
                            >
                              {item.created_at}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : (
                    <div className=''>
                      <Card align='left' className='mt-2 col-md-3 col-6' style={{ backgroundColor: '#7E98DF', color: 'white', borderColor: 'white', borderRadius: '25px' }}>
                        <Card.Body key={item.id}>
                          <div className='row '>
                            <p className='text-secondary'>
                              <Badge bg='primary'>{item.sender}</Badge>{' '}
                            </p>
                            <p>{item.message}</p>
                            <p style={{ fontSize: '13px' }} className='text-secondary' align='right'>
                              {item.created_at}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </ScrollToBottom>
          </div>
          <div className='container fixed-bottom offset-lg-3 col-lg-9'>
            <form className='row' onSubmit={SubmitMessage}>
              <div className='col-md-12 d-flex align-items-center justify-content-center'>
                <Form.Control type='text' placeholder='Type your messages....' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type='submit' className='btn btn-primary ms-2 ' style={{}}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Edit;
