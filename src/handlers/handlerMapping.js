import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd, gameClear } from './game.handler.js';

const handlerMapping = {
  2: gameStart,
  3: gameEnd,
  4: gameClear,
  11: moveStageHandler,
};

export default handlerMapping;
