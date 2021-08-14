import { useState, useEffect, useCallback } from 'react';
import { connect } from "react-redux";
import { NewMessage, UpdateUsers, RemoveMessage, UpdateMessages } from "../../../actions";
import { socket } from "../../../services";
import Message from '../../message';
import Header from './header';

import "./chat-room-page.css";
import Footer from './footer/footer';


const ChatRoomPage = ({ loginUser, users, messages, updateUsers, newMessage, delMessage, updateMessages }) => {

  const [isNewMessages, setNewMessages] = useState(false); // флаг сигнализирующий что пришло новое сообщение

  const scrollDown = () => {
    document.getElementById(messages[messages.length - 1].messageId.toString()).scrollIntoView();
  }

  const takeElementsParam = () => {
    const chatScrollHeight = document.querySelector('.chat-list').scrollHeight;
    const chatScrollTop= document.querySelector('.chat-list').scrollTop;
    const chatClientHeight = document.querySelector('.chat-list').clientHeight;
    const headerClientHeight = document.querySelector('.chat-header').clientHeight;

    return [ chatScrollHeight, chatScrollTop, chatClientHeight, headerClientHeight ]
  }

  const checkScroll = useCallback((e) => {
    const [ chatScrollHeight, chatScrollTop, chatClientHeight ] = takeElementsParam()

    if (chatScrollHeight - chatScrollTop - 100 <= chatClientHeight) {
      document.querySelector('.chat-list').removeEventListener('scroll', checkScroll)
      setNewMessages(false)
    }
  }, [])

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

  useEffect(() => {
    if (messages.length !== 0) {
      const [ chatScrollHeight, chatScrollTop, chatClientHeight, headerClientHeight ] = takeElementsParam()

      if (chatScrollHeight - chatScrollTop - headerClientHeight - (chatClientHeight * 0.1) < chatClientHeight) {
        scrollDown()
      } else {
        setNewMessages(true)
      }
    }
  }, [ messages ])

  useEffect(() => {
    if (isNewMessages) {
      document.querySelector('.chat-list').addEventListener('scroll', checkScroll)
    }
  }, [ isNewMessages ])

  return (
    <div className="chat">
      <Header loginUser={loginUser}/>
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
      <Footer scrollDown={scrollDown}/>
    </div>
  )
}
const mapStateToProps = ({ loginUser, users, messages }) => { return { loginUser, users, messages } };

const mapDispatchToProps = (dispatch) => { 
  return {
    updateUsers: (users) => dispatch(UpdateUsers(users)),
    newMessage: (msg) => dispatch(NewMessage(msg)),
    updateMessages: (msgs) => dispatch(UpdateMessages(msgs)),
    delMessage: (msgId) => dispatch(RemoveMessage(msgId))
  }
};
const connector = connect(mapStateToProps, mapDispatchToProps);


export default connector(ChatRoomPage);