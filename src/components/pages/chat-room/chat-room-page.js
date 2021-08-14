import { useState, useEffect, useCallback } from 'react';
import { connect } from "react-redux";
import { NewMessage, UpdateUsers, SendMessage, RemoveMessage, UpdateMessages } from "../../../actions";
import { socket } from "../../../services";
import Message from '../../message';
import SendIcon from '@material-ui/icons/Send';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PlusOneIcon from '@material-ui/icons/PlusOne';

import "./chat-room-page.css";

const getBase64 = (file) => new Promise((res, rej) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => res(reader.result);
  reader.onerror = (error) => rej(error);
})

const ChatRoomPage = ({ loginUser, users, messages, updateUsers, sendMessage, newMessage, delMessage, updateMessages }) => {

  const [message, setMessage] = useState('');
  const [picture, setPicture] = useState(null);
  const [isNewMessages, setNewMessages] = useState(false); // флаг сигнализирующий что пришло новое сообщение

  const onSendMessage = () => {
    const indx = messages.length ? messages[messages.length -1].messageId + 1 : 0;
    sendMessage({messageId: indx, userId: loginUser.userId, text: message, img: picture});
    if (messages.length !== 0) {
      scrollDown();
    }
    setMessage('');
    setPicture(null);
  }

  const pressHandler = (event) => {
    if (event.key === 'Enter' ) {
      onSendMessage()
    }
  }

  useEffect(() => {
    socket.on('USER:UPDATE', (users) => {
      updateUsers(users);
    });
    socket.on('MESSAGE:UPDATE', (msgs) => {
      updateMessages(msgs);
    })
    socket.on('MESSAGE:NEW', (msg) => {
      newMessage(msg);
    });
    socket.on('MESSAGE:DELETE', (arr) => {
      arr.forEach((msgId) => {
        if (msgId !== null) {
          delMessage(msgId);
        }
      })
    })

  }, [newMessage, updateUsers, updateMessages, delMessage]);

  const scrollDown = () => {
    document.getElementById(messages[messages.length - 1].messageId.toString()).scrollIntoView();
  }

  useEffect(() => {
    if (messages.length !== 0) {
      const chatScrollHeight = document.querySelector('.chat-list').scrollHeight;
      const chatScrollTop= document.querySelector('.chat-list').scrollTop;
      const chatClientHeight = document.querySelector('.chat-list').clientHeight;
      const headerClientHeight = document.querySelector('.chat-header').clientHeight;

      if (chatScrollHeight - chatScrollTop - headerClientHeight - (chatClientHeight * 0.1) < chatClientHeight) {
        scrollDown()
      } else {
        setNewMessages(true)
      }
    }
  }, [ messages ])

  const checkScroll = useCallback((e) => {
    const chatScrollHeight = document.querySelector('.chat-list').scrollHeight;
    const chatScrollTop= document.querySelector('.chat-list').scrollTop;
    const chatClientHeight = document.querySelector('.chat-list').clientHeight;

    if (chatScrollHeight - chatScrollTop - 100 <= chatClientHeight) {
      document.querySelector('.chat-list').removeEventListener('scroll', checkScroll)
      setNewMessages(false)
    }
  }, [])

  useEffect(() => {
    if (isNewMessages) {
      document.querySelector('.chat-list').addEventListener('scroll', checkScroll)
    }
  }, [ isNewMessages ])

  return (
    <div className="chat">
      <header className="chat-header">
        <img className="user-pic" src={loginUser.userImgUrl} alt="user pic"/>
        <h2>{loginUser.name}</h2>
      </header>
      <div className="chat-container">
        <div className="sidebar">
          <ul>
            {users.map((user) => {
              return <li key={user.userId}>{user.name}</li>
            })}
          </ul>
        </div>
        <div className="chat-list">
          <ul>
            {messages.map((msg) => {
              return <Message 
                key={msg.messageId}
                msg={msg}/>
            })}
          </ul>
        </div>
        { isNewMessages && <button className='new-message' onClick={scrollDown}>Что-то пришло</button>}
      </div>
      <footer className="chat-footer">
        <input 
          type="text" 
          className="chat-footer-text-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={pressHandler}/>
        <label 
          className="chat-footer-image-label">
          <input 
            type="file"
            onChange={(e) => e.target.files && getBase64(e.target.files[0]).then((o) => setPicture(o))}
            accept='image/,.png,.jpeg,.jpg'
            className="chat-footer-image-input"/>

            { picture ? <PlusOneIcon />
            : <LibraryAddIcon />
            }
        </label>
        
        <button 
          className="chat-footer-button"
          onClick={onSendMessage} >
          <SendIcon />
        </button>
      </footer>
    </div>
  )
}
const mapStateToProps = ({ loginUser, users, messages }) => { return { loginUser, users, messages } };

const mapDispatchToProps = (dispatch) => { 
  return {
    updateUsers: (users) => dispatch(UpdateUsers(users)),
    sendMessage: (msg) => dispatch(SendMessage(msg)),
    newMessage: (msg) => dispatch(NewMessage(msg)),
    updateMessages: (msgs) => dispatch(UpdateMessages(msgs)),
    delMessage: (msgId) => dispatch(RemoveMessage(msgId))
  }
};
const connector = connect(mapStateToProps, mapDispatchToProps);


export default connector(ChatRoomPage);