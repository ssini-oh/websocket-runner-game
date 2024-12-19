import { moveStageHandler } from './stage.handler.js';
import { gameStart, gameEnd, gameClear } from './game.handler.js';
import { itemCollectHandler } from './item.handler.js';

const handlerMapping = {
  2: gameStart,
  3: gameEnd,
  4: gameClear,
  11: moveStageHandler,
  12: itemCollectHandler,
};

export default handlerMapping;
