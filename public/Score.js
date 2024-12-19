import { sendEvent, getGameAssets } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  currentStage = 1;
  currentStageId = 1000; // 현재 스테이지 정보 추가
  scorePerSecond = 1; // 기본 점수 증가율
  stages = null; // 스테이지 정보를 저장할 변수
  gameSpeed = 1; // 기본 게임 스피드

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;

    const assets = getGameAssets();

    if (assets?.stages?.data) {
      this.stages = assets.stages.data;
    }
  }

  update(deltaTime) {
    if (this.stages && this.stageChange) {
      // 현재 및 다음 스테이지 정보 찾기
      const currentStage = this.stages.find((stage) => stage.id === this.currentStageId);
      const nextStage = this.stages.find((stage) => stage.id === this.currentStageId + 1);

      // 현재 스테이지의 점수 증가율 적용
      if (currentStage) {
        this.scorePerSecond = currentStage.scorePerSecond;
        this.gameSpeed = currentStage.gameSpeed;
      }

      // 점수 증가 로직
      this.score += deltaTime * 0.001 * this.scorePerSecond;

      // 다음 스테이지가 존재하고, 현재 점수가 다음 스테이지의 minScore를 넘었을 경우
      if (nextStage && Math.floor(this.score) >= nextStage.minScore) {
        this.stageChange = false;

        this.currentStageId = nextStage.id;
        this.currentStage++;

        sendEvent(11, { currentStage: currentStage.id, targetStage: nextStage.id });

        // 다음 스테이지 변경을 위해 stageChange 초기화
        setTimeout(() => {
          this.stageChange = true;
        }, 1000);
      }

      //! 현재 스테이지가 마지막 스테이지고
      //! 현재 점수가 마지막 스테이지의 maxScore를 넘었을 경우
      if (!nextStage && this.score >= currentStage.maxScore) {
        // 게임 클리어 이벤트 전송 (handlerId: 4)
        sendEvent(4, {
          timestamp: Date.now(),
          score: this.score,
          clearedStageId: this.currentStageId,
        });

        // 게임 클리어 상태를 index.js에 알리기 위해 true 반환
        return true;
      }

      return false;
    }
  }

  getItem(itemId) {
    const assets = getGameAssets();
    if (!assets?.items?.data) return;

    // item.json에서 해당하는 아이템의 점수 찾기
    const itemData = assets.items.data.find((item) => item.id === itemId);
    if (itemData) {
      this.score += itemData.score;
      console.log(`아이템 획득!!! ID: ${itemId}, 점수: ${itemData.score}`);
    }
  }

  reset() {
    this.score = 0;
    this.stageChange = true;
    this.currentStage = 1;
    this.currentStageId = 1000;
    this.scorePerSecond = 1;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  getGameSpeed() {
    return this.gameSpeed;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const rightMargin = 20 * this.scaleRatio;
    const stageX = 20 * this.scaleRatio;
    const scoreX = this.canvas.width - 75 * this.scaleRatio - rightMargin;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(`STAGE ${this.currentStage}`, stageX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(scorePadded, scoreX, y);
  }
}

export default Score;
