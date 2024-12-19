// init 폴더 안에 있는 것은 서버가 구동될 때 항상 같이 구동되는 것들
// init/socket.js

import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

// 소켓 서버를 초기화하는 함수
const initSocket = (server) => {
  const io = new SocketIO();
  // 생성된 socket.IO 서버를 HTTP 서버에 연결
  io.attach(server);

  // 소켓 이벤트 핸들러 등록
  registerHandler(io);
};

export default initSocket;
