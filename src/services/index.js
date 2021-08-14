import io from "socket.io-client"; 

const socket = io('http://localhost:9090'); // 'http://localhost:9090', { transports: ['websocket', 'polling', 'flashsocket'] }

const getUserPicUrl = () => {
  return new Promise((res) => {
    const imageId = Math.floor(Math.random() * 50);
    setTimeout(() => {
      res(`https://starwars-visualguide.com/assets/img/characters/${imageId}.jpg`);
    }, 500);
  })
}

export{
  getUserPicUrl,
  socket
}