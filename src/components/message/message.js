import { connect } from "react-redux";

import "./message.css";

const Message = ({ msg, loginUser, users }) => {

  return <li
    className={loginUser.userId === msg.userId ? 'chat-item-self' : 'chat-item'}
    id={msg.messageId}>
    <img
      className="chat-item-user-image" 
      src={users.find(user => user.userId === msg.userId)?.userImgUrl} 
      alt='user pic'/>
    <div className='chat-item-message'>
      <p className='chat-item-message-header'>{users.find(user => user.userId === msg.userId)?.name} :</p>
      <p>{msg.text}</p>
      {msg.img && 
        <img 
          src={msg.img}
          className="chat-item-message-image" 
          alt="some pic and you are pig(we have error and we care about it)" />
      }
    </div>
  </li>
}

const mapStateToProps = ({ loginUser, users }) => { return { loginUser, users } };

export default connect(mapStateToProps)(Message);