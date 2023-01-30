import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { Link } from 'react-router-dom';


function Chat({ socket, username, rooms }) {
    const room = JSON.parse(localStorage.getItem('group')).name
    const photo = JSON.parse(localStorage.getItem('group')).photo
    const id = JSON.parse(localStorage.getItem('group')).id
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

   
    const sendMessage = async () => {
        if (currentMessage !== '') {
        const messageData = {
            rooms: rooms,
            author: username,
            message: currentMessage,
            time:
            new Date(Date.now()).getHours() +
            ':' +
            new Date(Date.now()).getMinutes(),
        };

        await socket.emit('send_message_group', messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage('');
        }
  };

  useEffect(() => {
    socket.on('receive_message_group', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  

  return (
    <div className='chat-window col-lg-9 '>
      <div className='chat-header'>
        <div className='d-flex justify-content-between py-4'>
          <div className='d-flex'>
             <img src={photo} width={50} height={50} alt=''/> <p><b className='text-primary'>{room}</b> </p>
          </div>
          <Link to={`/updateGroup/${id}`} ><butoon className='btn btn-primary text-white' style={{ backgroundColor: '#7E98DF' }}>update Group</butoon></Link>
        </div>
      </div>
      <div className='chat-body border-white' style={{backgroundColor:'#fafafa'}}>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div
                className='message'
                id={username === messageContent.author ? 'you' : 'other'}
              >
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='author'>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          value={currentMessage}
          placeholder='Type your messages....'
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;