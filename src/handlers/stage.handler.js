// 스테이지 진행 관련 핸들러
// 유저는 스테이지를 하나씩 올라갈 수 있음 (1스테이지 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동함

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

//---- 스테이지 이동을 처리하는 핸들러 함수
export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보를 메모리에서 조회
  const currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 스테이지 배열을 ID 기준으로 오름차순 정렬하여
  // 가장 마지막 요소(현재 스테이지)를 조회
  currentStages.sort((a, b) => a.id - b.id);
  const currentStageId = currentStages[currentStages.length - 1];

  // 클라이언트가 보낸 현재 스테이지 정보와
  // 서버에 저장된 스테이지 정보가 일치하는지 검증
  if (currentStageId.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 스테이지 클리어 시간 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStageId.timestamp) / 1000; // 초 단위

  // 스테이지 클리어 시간이 유효한지 검증
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 목표 스테이지가 게임 에셋에 존재하는 유효한 스테이지인지 검증
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 모든 검증 통과 시, 새로운 스테이지 정보를 저장하고 성공 응답 반환
  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success' };
};
