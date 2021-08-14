import { connect } from "react-redux";
import { LoginPage, ChatRoomPage } from "../pages";

import "./app.css";

const App = ({ loginUser }) => {
  
  return (
    <div className="app">
      { !loginUser 
        ? <LoginPage /> 
        : <ChatRoomPage />
      }
    </div>
  )
}
const mapStateToProps = ({ loginUser }) => { return { loginUser } };

const connector = connect(mapStateToProps);


export default connector(App);