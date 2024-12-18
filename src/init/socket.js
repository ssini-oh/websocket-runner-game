// init 폴더 안에 있는 것은 서버가 구동될 때 항상 같이 구동되는 것들
// init/socket.js

import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
  const io = new SocketIO();
  io.attach(server);

  registerHandler(io);
};

export default initSocket;
