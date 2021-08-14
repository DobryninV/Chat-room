import './header.css';

const Header = ({ loginUser }) => {
  return (
    <header className="chat-header">
      <img className="chat-header-user-pic" src={loginUser.userImgUrl} alt="user pic"/>
      <h2>{loginUser.name}</h2>
    </header>
  )
}

export default Header;