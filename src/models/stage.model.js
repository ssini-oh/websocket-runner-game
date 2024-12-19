// 유저의 스테이지 정보를 저장하는 인메모리 객체
// key: 유저의 uuid
// value: 해당 유저의 스테이지 기록 배열 ([{id: 스테이지ID, timestamp: 시작시간}, ...])
const stages = {};

//---- 새로운 유저의 스테이지 정보를 초기화하는 함수
export const createStage = (uuid) => {
  stages[uuid] = []; // 빈 배열로 초기화
};

//---- 특정 유저의 스테이지 기록을 조회하는 함수
export const getStage = (uuid) => {
  return stages[uuid];
};

//---- 특정 유저의 스테이지 기록을 추가하는 함수
// uuid: 유저의 고유 식별자
// id: 스테이지 ID
// timestamp: 스테이지 시작 시간
export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

//---- 특정 유저의 스테이지 기록을 초기화하는 함수
export const clearStage = (uuid) => {
  stages[uuid] = [];
};
