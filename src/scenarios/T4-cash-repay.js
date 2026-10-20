// 任務 T4：已開戶，有一筆借款即將到期，到股票借貸明細用現金還款
import { BASE_ACCOUNT } from './base-account.js';

export default {
  id: 'T4',
  title: '現金還款',
  instruction: '你有一筆借款快到期了，想用現金把這筆即將到期的借款還掉，完成後查看還款紀錄。',
  entry: 'account',
  startPath: '/home',
  account: BASE_ACCOUNT,
};
