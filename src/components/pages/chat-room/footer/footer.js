import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { SendMessage } from '../../../../actions';
import SendIcon from '@material-ui/icons/Send';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PlusOneIcon from '@material-ui/icons/PlusOne';

import './footer.css';

const Footer = ({ sendMessage, loginUser, messages, scrollDown }) => {

  const [message, setMessage] = useState('');
  const [picture, setPicture] = useState(null);

  const getBase64 = (file) => new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (error) => rej(error);
  });
  
  const pressHandler = (event) => {
    if (event.key === 'Enter' ) {
      onSendMessage()
    }
  };
  
  const onSendMessage = (event) => {
    if (message.length > 0 || picture) {
      const indx = messages.length ? messages[messages.length -1].messageId + 1 : 0;
      sendMessage({messageId: indx, userId: loginUser.userId, text: message, img: picture});
      if (messages.length !== 0) {
        scrollDown();
      }
      setMessage('');
      setPicture(null);
    }
    event.preventDefault();
  }

  return (
    <footer className="chat-footer">
      <form
        className="chat-form"
        onSubmit={onSendMessage}>
        <input 
          type="text" 
          className="chat-form-text-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={pressHandler}/>
        <label 
          className="chat-form-image-label">
          <input 
            type="file"
            onChange={(e) => e.target.files && getBase64(e.target.files[0]).then((o) => setPicture(o))}
            accept='image/,.png,.jpeg,.jpg'
            className="chat-form-image-input"/>

            { picture ? <PlusOneIcon />
            : <LibraryAddIcon />
            }
        </label>
        
        { 
          (message || picture) &&
          <button 
            className="chat-form-button"
            type="submit">
            <SendIcon />
          </button>
        }
        
      </form>
    </footer>
  )
}

const mapStateToProps = ({ loginUser, messages }) => { return { loginUser, messages } };

const mapDispatchToProps = (dispatch) => { 
  return {
    sendMessage: (msg) => dispatch(SendMessage(msg))
  }
};
const connector = connect(mapStateToProps, mapDispatchToProps);


export default connector(Footer);