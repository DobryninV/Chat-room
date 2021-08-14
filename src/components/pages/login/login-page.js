import { connect } from 'react-redux';
import { AddUser } from "../../../actions";
import './login-page.css';

const LoginPage = ({onConnect}) => {
  return (
    <div className="login-page">
      <div className="login-page-card">
        <h1>Welcome to best Chat Room ever</h1>
        <p><samp>To enjoy this simple project just click this button</samp></p>
        <button
          type="button" 
          className="btn-join"
          onClick={onConnect}>
          Start messaging
        </button>
      </div>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => { 
  return {
    onConnect: () => dispatch(AddUser()) 
  }
}

export default connect(null, mapDispatchToProps)(LoginPage);