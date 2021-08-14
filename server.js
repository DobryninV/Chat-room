const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/**
 * @roomData - хранит на сервере данные пользователей подключенных к комнате и сообщения с картинками 
 */
const roomData = new Map();

app.get('/', (req, res) => {
  res.json('Hello World')
});

io.on('connection', (socket) => {
  socket.on('USER:CONNECT', (data) => {
    if (!roomData.get('users')) {
      roomData
        .set('users', new Map( [[data.userId, data]] ));
    } else {
      roomData
        .get('users')
        .set(socket.id, data);
    }
    io.emit('USER:UPDATE', [ ...roomData.get('users').values()]);
    if (roomData.get('messages')) {
      io.emit('MESSAGE:UPDATE', [ ...roomData.get('messages').values()])
    }
  });

  socket.on('disconnect', (reason) => {
    if (reason === "io server disconnect") {
      socket.connect();
    }
    if (roomData.get('users')) {
      roomData
        .get('users')
        .delete(socket.id);
      if (roomData.get('users')) {
        if (roomData.get('messages')) {

          const indxArr = [ ...roomData.get('messages').values() ].map((msg) => {
            return msg.userId === socket.id ? msg.messageId : null
          });
          
          indxArr.forEach((id) => {
            roomData.get('messages').delete(id);
          })
          socket.broadcast.emit( 'MESSAGE:DELETE', indxArr ); 
        }
        socket.broadcast.emit('USER:UPDATE',[ ...roomData.get('users').values()])
      }
    }
  });

  socket.on("MESSAGE:SEND", (msg) => {
    if (!roomData.get('messages')) {
      roomData.set('messages', new Map([[ msg.messageId, msg ]]))
    } else {
      roomData.get('messages').set( msg.messageId, msg);
    }
    socket.broadcast.emit('MESSAGE:NEW', msg); 
  });

});


server.listen(9090, () => {
  console.log('app staring on 9090 port...');
});