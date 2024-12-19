import socket from '../init/socket.js';
import { v4 as uuidv4 } from 'uuid';
import { handleDisconnect, handleConnection, handleEvent } from './helper.js';
import { addUser } from '../models/user.model.js';
import { getGameAssets } from '../init/assets.js';

//---- Socket.IO 서버에 이벤트 핸들러를 등록하는 함수
const registerHandler = (io) => {
  // 클라이언트가 서버에 연결될 때 실행되는 이벤트 핸들러
  io.on('connection', (socket) => {
    // 사용자 고유 식별자(UUID) 생성
    const userUUID = uuidv4();

    // 생성된 사용자 정보를 메모리에 저장
    addUser({ uuid: userUUID, socketId: socket.id });

    // 연결된 클라이언트에 사용자 정보 전달
    handleConnection(socket, userUUID);

    // 게임 에셋 전달
    socket.emit('assets', getGameAssets());

    // 클라이언트에서 'event' 메세지 받았을 때 실행되는 이벤트 핸들러
    socket.on('event', (data) => handleEvent(io, socket, data));

    // 접속 해제 시 실행되는 이벤트 핸들러
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
