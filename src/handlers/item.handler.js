import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';
import { addUserItem, getUserItems } from '../models/item.model.js';

export const itemCollectHandler = (userId, payload) => {
  const { itemId, timestamp } = payload;
  const assets = getGameAssets();
  const stages = getStage(userId);
  const currentStage = stages[stages.length - 1];

  console.log('==========스테이지 정보 (getStage)==========');
  console.log('stages: ', stages);
  console.log('==================================', `\n`);

  // console.log('==== Item Collection Event ====');
  // console.log('User ID:', userId);
  // console.log('Item ID:', itemId);
  // console.log('Current Stage:', currentStage.id);

  // 현재까지 획득한 모든 아이템 확인
  const allUserItems = getUserItems(userId);
  console.log('==========획득한 아이템 정보==========');
  console.log('All collected items:', allUserItems);
  console.log('==================================', `\n`);

  // 아이템 정보 확인
  const itemInfo = assets.items.data.find((item) => item.id === itemId);

  console.log('==========아이템 정보==========');
  console.log('Item Info:', itemInfo);
  console.log('currentStage: ', currentStage.id);
  console.log('==================================', `\n`);

  // 현재 스테이지까지의 아이템만 필터링 진행
  const availableItemIds = assets.itemUnlocks.data
    .filter((unlock) => unlock.stage_id <= currentStage.id)
    .map((unlock) => unlock.item_id);

  const isItemUnlocked = availableItemIds.includes(itemId);

  console.log('==========아이템 해금 여부==========');
  console.log('itemId: ', itemId);
  console.log('isItemUnlocked: ', isItemUnlocked);
  console.log('==================================', `\n`);

  if (!isItemUnlocked) {
    console.log('현재 스테이지의 아이템이 아님');
    return { status: 'fail', message: 'Item not unlocked in this stage' };
  }

  addUserItem(userId, itemId, timestamp);

  return { status: 'success', message: `Item collected: itemId - ${itemId}` };
};
