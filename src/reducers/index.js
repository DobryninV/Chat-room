
const reducer = (state, action) => {
  if (state === undefined) {
    return {
      loading: false,
      loginUser: null, 
      users: [],
      messages: []
    }
  }

  switch (action.type) {
    case "ADD_IMAGE_STARTED":
      return {
        loading: true,
        ...state
      }
    case "ADD_IMAGE_LOADED":
      const { userId, name, userImgUrl } = action.payload;
      return {
        ...state,
        loading: false,
        loginUser: { userId, name, userImgUrl }
      }
    case "ADD_IMAGE_ERROR":
      return {
        loading: false,
        ...state
      }
    case "ADD_USER":
      return {
        loginUser: action.payload,
        ...state
      };
    case "UPDATE_USERS":
      console.log(action.payload);
      return {
        ...state,
        users: action.payload
      }
    case "REMOVE_MESSAGE":
      return {
        ...state,
        messages: state.messages.filter(msg => msg.messageId !== action.payload),
      }
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: action.payload,
      }
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload
        ]
      };
    default:
      return state
  }
}

export default reducer;