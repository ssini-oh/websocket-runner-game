import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 이 파일의 절대 경로
const __dirname = path.dirname(__filename); // 현재 이 파일의 디렉토리 경로
const basePath = path.join(__dirname, '../../assets'); // 현재 이 파일의 디렉토리 경로에서 assets 폴더까지 경로를 찾는다.

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = {
      stages,
      items,
      itemUnlocks,
    };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
