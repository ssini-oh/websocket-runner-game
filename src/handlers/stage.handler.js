// 스테이지 진행 관련 핸들러
// 유저는 스테이지를 하나씩 올라갈 수 있음 (1스테이지 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동함

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

//---- 스테이지 이동을 처리하는 핸들러 함수
export const moveStageHandler = (userId, payload) => {
  // console.log('=== Move Stage Handler Debug ===');
  // console.log('Payload:', payload);

  const currentStages = getStage(userId);
  // console.log('Current Stages:', currentStages);

  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const currentStageId = currentStages[currentStages.length - 1];

  // console.log('Before setStage - Current Stage ID:', currentStageId);

  if (currentStageId.id !== payload.currentStage) {
    console.log('Stage mismatch:', {
      serverStage: currentStageId.id,
      clientStage: payload.currentStage,
    });
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  const serverTime = Date.now();

  // console.log('Setting new stage:', payload.targetStage);
  setStage(userId, payload.targetStage, serverTime);

  const afterSetStage = getStage(userId);
  // console.log('After setStage:', afterSetStage);

  return { status: 'success' };
};
