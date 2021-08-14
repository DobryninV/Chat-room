import { generateRandomName } from "../utils";
import { getUserPicUrl, socket } from "../services";


// actions for work with images
const addImageStarted = () => ({ 
  type: "ADD_IMAGE_STARTED" 
});
const addImageLoaded = ( userId, name, userImgUrl) => ({
  type: "ADD_IMAGE_LOADED",
  payload: {
    userId,
    name,
    userImgUrl
  }
});
const addImageError = (error) => ({
  type: "ADD_IMAGE_ERROR",
  payload: error
});

const AddUser = () => {
  let userId = socket.id;
  let name = generateRandomName();

  return (dispatch) => {
    dispatch(addImageStarted());
    getUserPicUrl()
      .then(userImgUrl => {
        socket.emit('USER:CONNECT', { userId, name, userImgUrl });
        dispatch(addImageLoaded( userId, name, userImgUrl ));
      })
      .catch(error => dispatch(addImageError(error)));
  }
}

const UpdateUsers = (users) => {
  return {
    type: "UPDATE_USERS",
    payload: users
  }
}

const RemoveUser = (userId) => {
  return {
    type: "REMOVE_USER",
    payload: userId
  }
}

const SendMessage = (message) => {
  socket.emit('MESSAGE:SEND', message);
  return {
    type: "NEW_MESSAGE",
    payload: message
  }
}

const NewMessage = (message) => {
  return {
    type: "NEW_MESSAGE",
    payload: message
  }
}

const UpdateMessages = (messages) => {
  return {
    type: "UPDATE_MESSAGE",
    payload: messages
  }
}

const RemoveMessage = (messageId) => {
  return {
    type: "REMOVE_MESSAGE",
    payload: messageId
  }
}

export {
  AddUser,
  UpdateUsers,
  RemoveUser,
  SendMessage,
  NewMessage,
  UpdateMessages,
  RemoveMessage
}