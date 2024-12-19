import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 게임 에셋을 저장할 객체 초기화
let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 파일의 절대 경로를 가져옴
const __dirname = path.dirname(__filename); // 현재 파일이 위치한 디렉토리 경로를 가져옴
const basePath = path.join(__dirname, '../../assets'); // assets 폴더의 절대 경로를 생성

// 파일을 비동기적으로 읽는 함수
// Promise를 반환하여 비동기 처리를 용이하게 함
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // 파일 읽기 성공 시 JSON 파싱하여 반환
      resolve(JSON.parse(data));
    });
  });
};

// 게임에 필요한 에셋을 로드하는 함수
export const loadGameAssets = async () => {
  try {
    // Promise.all을 사용하여 여러 파일을 병렬로 읽음
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    // 로드된 데이터를 gameAssets 객체에 저장
    gameAssets = {
      stages, // 스테이지 정보
      items, // 아이템 정보
      itemUnlocks, // 아이템 잠금해제 조건 정보
    };
    return gameAssets;
  } catch (e) {
    // 에셋 로딩 실패 시 에러 발생
    throw new Error('Failed to load game assets' + e.message);
  }
};

// 현재 로드된 게임 에셋을 반환하는 함수
export const getGameAssets = () => {
  return gameAssets;
};
