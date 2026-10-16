// 任務 T3：已開戶，從「股票借貸專區」匯入擔保品
import { BASE_ACCOUNT } from './base-account.js';

export default {
  id: 'T3',
  title: '匯入擔保品',
  instruction: '你想提高可借額度，請從股票借貸專區，把 2 張聯發科匯入成擔保品，完成後查看擔保品紀錄。',
  entry: 'lendingZone',
  startPath: '/home',
  account: BASE_ACCOUNT,
};
