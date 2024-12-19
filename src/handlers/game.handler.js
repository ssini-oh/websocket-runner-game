import { getGameAssets } from '../init/assets.js';
import { setStage, getStage, clearStage } from '../models/stage.model.js';
import { getUserItems, clearUserItems } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getUserItems(uuid);
  const assets = getGameAssets();

  // 기본 점수 계산 (시간 기반)
  let totalScore = calculateTimeBasedScore(stages, gameEndTime);

  // 아이템 점수 추가
  userItems.forEach((item) => {
    const itemData = assets.items.data.find((i) => i.id === item.itemId);
    if (itemData) {
      totalScore += itemData.score;
    }
  });

  // 점수 검증 (오차 범위 5)
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score validation failed' };
  }

  console.log('==========게임 종료 시 - 아이템 정보==========');
  console.log('userItems: ', userItems);
  console.log('==================================', `\n`);

  clearUserItems(uuid); // 게임 종료 시 아이템 정보 초기화
  return { status: 'success', message: 'Game ended', score };
};

export const gameClear = (uuid, payload) => {
  const { timestamp: clearTime, score, clearedStageId } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 마지막 스테이지가 맞는지 검증
  const { stages: stagesAssets } = getGameAssets();
  const lastStage = stagesAssets.data[stagesAssets.data.length - 1];

  if (clearedStageId !== lastStage.id) {
    return { status: 'fail', message: 'Invalid stage clear' };
  }

  // 점수 검증 로직은 gameEnd와 동일하게 적용
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime = index === stages.length - 1 ? clearTime : stages[index + 1].timestamp;
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration;
  });

  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score validation failed' };
  }

  return {
    status: 'success',
    message: 'Game cleared',
    score,
    clearedStageId,
  };
};
