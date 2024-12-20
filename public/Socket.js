// 클라이언트 버전을 Constants.js 파일에서 가져옴
import { CLIENT_VERSION } from './Constants.js';

// 웹소켓 연결 설정
// localhost:3000 서버에 연결하며, 연결 시 클라이언트 버전 정보를 쿼리로 전달
const socket = io(['http://localhost:3000', 'http://54.180.95.244:3000'], {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

// 사용자 ID를 저장할 변수 초기화
let userId = null;

// 게임 에셋을 저장할 변수 초기화
let gameAssets = null;

// 서버로부터 'response' 이벤트 수신 시 처리
socket.on('response', (data) => {
  console.log(data);

  // 게임 종료 응답 처리
  if (data.message === 'Game ended') {
    console.log('게임 종료 점수:', data.score);
  }
});

// 서버와 연결 성공 시 실행되는 이벤트 핸들러
// 서버가 생성한 UUID를 userId 변수에 저장
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

// 서버로부터 'assets' 이벤트 수신 시 처리
socket.on('assets', (data) => {
  gameAssets = data;

  // assets 로드 완료 후 게임 초기화
  if (window.onAssetsLoaded) {
    window.onAssetsLoaded(gameAssets);
  }
});

export function getGameAssets() {
  return gameAssets;
}

// 서버로 이벤트를 전송하는 함수
// handlerId: 서버에서 처리할 이벤트 핸들러 식별자
// payload: 전송할 데이터
export const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId, // 저장된 사용자 ID
    clientVersion: CLIENT_VERSION, // 클라이언트 버전
    handlerId, // 이벤트 핸들러 ID
    payload, // 전송할 데이터
  });
};
