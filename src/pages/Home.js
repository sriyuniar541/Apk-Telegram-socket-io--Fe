import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import GambarIcon from '../assets/Gmb.png';
import { Badge, Card, Dropdown, Form, Tab, Tabs } from 'react-bootstrap';
import ScrollToBottom from 'react-scroll-to-bottom';
import Swal from 'sweetalert2';


const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const [groups, setGroups] = useState([]);
  const [socketio, setSocketIo] = useState(null);
  const [listchat, setListchat] = useState([]);
  const [message, setMessage] = useState();
  const [login, setLogin] = useState({});
  const [list, setList] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState({});
  const [activeChat, setActiveChat] = useState(1);
  const [dataProfile,setDataProfile] = useState('');
  const navigate = useNavigate();
  const self = user;
  const receiver = JSON.parse(localStorage.getItem('receiver'));


  //get contack
  useEffect(() => {
    const users_id = user.id;
    setLogin(user);
   
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


 //get data profile
  useEffect(()=> {
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
 
  },[])


  //chat
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


  //get group chat
  const getGroup = () => {
    axios 
    .get(process.env.REACT_APP_BACKEND_USER + `/group/All`, {
      'content-type': 'multipart/form-data',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data.data, 'get group');
      setGroups(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(()=> {
    getGroup()
  },[])

  //delete group
  const deleteGroup = (id) => {
    axios 
    .delete(process.env.REACT_APP_BACKEND_USER + `/group/${id}`, {
      'content-type': 'multipart/form-data',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response, 'delete group success');
      Swal.fire('Success', 'delete success', 'success');
      getGroup()
      
    })
    .catch((error) => {
      console.log(error);
      Swal.fire('Error',  'error');
    });
  }


  const SubmitMessage = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const receiver = JSON.parse(localStorage.getItem('receiver'));

    // data dari chat serta save ke database
    const payload = { 
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

  //select user
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

  //select grups
  const selectGroup = (item) => {
    localStorage.setItem('group', JSON.stringify(item));
    navigate('/ChatGrups')
  };

  //logout
  const handleLeaveChat = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };


  return (
    <div className='row'>
      <div
        className='left col-md-3 d-flex align-items-start justify-content-center flex-direction-column pt-5 '
        style={{ paddingLeft: '30px', height: '100vh', overflowX: 'hidden'}}>
        <div className='header'>
          <div className='row'>
            <div className='col-9'>
              <h3 style={{ color: '#7E98DF' }}>Telegram</h3>
            </div>
            <div className='col-3' style={{ paddingLeft: '10px' }}>
              <Dropdown>
                <Dropdown.Toggle style={{ color: 'white' }} variant='' id='dropdown-basic'>
                  <img style={{}} src={GambarIcon} alt='menu icon' />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ backgroundColor: '#7E98DF' }} className='text-white'>
                  <Dropdown.Item href='/editProfile' >Edit profile </Dropdown.Item>
                  <Dropdown.Item onClick={handleLeaveChat}>Logout</Dropdown.Item>
                  <Dropdown.Item><Link to='/insertGroup' style={{textDecoration:'none',color:'black'}}>Insert Groups</Link></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className='col-md-8 offset-md-2 mt-4 ' align='center' style={{}}>
            <img width={120} height={120} src={dataProfile.photo} alt='profile' style={{borderRadius:'20px'}}/>
            <p className='mt-2'>
              <b>{dataProfile.fullname}</b>
            </p>
          </div>
          <div className='chat'>
            <Tabs defaultActiveKey='profile' id='uncontrolled-tab-example' className='mb-3'>
              {/* get user */}
              <Tab eventKey='all' title='All'>
                {list.map((user) => (
                  <Card className='mt-2 '>
                    <Card.Body key={user.id} onClick={() => selectReceiver(user)}>
                      <div className='row '>
                        <div className='col-md-3 col-4'>
                          <img width={50} height={50} style={{borderRadius:'15px'}} src={user.photo} alt=''/>
                        </div>
                        <div className='col-md-9 '><b>{user.fullname}</b></div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
                
                 {/* get group */}
                {groups.map((p) => (
                  <Card className='mt-2 '>
                    <Card.Body key={p.id} onClick={() => selectGroup(p)}>
                      <div className='row '>
                        <div className='col-md-3 col-4'>
                          <img width={50} height={50} style={{borderRadius:'15px'}} src={p.photo} alt=''/>
                        </div>
                        <div className='col-md-5 '><b>{p.name}</b></div>
                        <div className='col-md-3 '>
                          <button className='bg-white  text-end mt-0 border-white'  style={{height:'auto', color:'red'}}  onClick={()=> deleteGroup(p.id)}>Delete</button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Tab>
              <Tab eventKey='important' title='Important'>
                folder empty
              </Tab>
              <Tab eventKey='unread' title='Unread'>
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
          <div className='container' style={{backgroundColor:'#fafafa'}}>
            <ScrollToBottom className='message-container'>
              {listchat.map((item) => (
                <div key={item.id}>
                  {item.sender === login.fullname ? (
                    <div className=''>
                      <Card className='mt-2 col-md-4 offset-md-8 col-6 offset-6' style={{borderRadius:'25px'}}>
                        <Card.Body key={item.id}>
                          <div className='row '>
                            <p className='text-secondary'>
                              <Badge bg='success'>{item.sender}</Badge>{' '}
                            </p>
                            <p>{item.message}</p>
                            <p style={{ fontSize: '13px' }} className='text-secondary' align='right'>
                              {item.created_at}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : (
                    <div className=''>
                      <Card align='left' className='mt-2 col-md-3 col-6' style={{ backgroundColor: '#7E98DF' ,color:'white',borderColor:'white', borderRadius:'25px'}}>
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
export default Home;
