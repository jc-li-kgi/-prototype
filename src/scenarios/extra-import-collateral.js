// （目前不列入任務列表）已開戶，從「股票借貸專區」匯入擔保品；要加回去時在 index.js 註冊並給新編號
import { BASE_ACCOUNT } from './base-account.js';

export default {
  id: 'import',
  title: '匯入擔保品',
  instruction: '你想提高可借額度，請從股票借貸專區，把 10 張凱基金匯入成擔保品，完成後查看擔保品紀錄。',
  entry: 'lendingZone',
  startPath: '/home',
  account: BASE_ACCOUNT,
};
