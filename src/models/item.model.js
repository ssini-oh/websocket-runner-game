const userItems = new Map();

//---- // 특정 유저의 획득한 아이템 정보 저장
export const addUserItem = (userId, itemId, timestamp) => {
  if (!userItems.has(userId)) {
    userItems.set(userId, []);
  }

  userItems.get(userId).push({ itemId, timestamp });
};

export const getUserItems = (userId) => {
  return userItems.get(userId) || [];
};

export const clearUserItems = (userId) => {
  userItems.delete(userId);
};
