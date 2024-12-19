// 접속한 유저들의 정보를 저장하는 배열
// 각 유저 객체 형태: { uuid: '유저의 고유ID', socketId: '소켓 연결 ID' }
const users = [];

//---- 새로운 유저를 배열에 추가하는 함수
export const addUser = (user) => {
  users.push(user);
};

//---- 소켓 연결이 끊긴 유저를 배열에서 제거하는 함수
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//---- 현재 접속한 모든 유저를 조회하는 함수
export const getUser = () => {
  return users;
};
