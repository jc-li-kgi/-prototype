// 任務 T4：已開戶，從「帳務 → 授信管理」再借一筆
import { BASE_ACCOUNT } from './base-account.js';

export default {
  id: 'T4',
  no: '四',
  title: '再借一筆',
  instruction: '你已經有股票借貸帳戶，想再借 5 萬元做資金周轉，請完成借款申請。',
  entry: 'account',          // 'account' = 帳務→授信管理；'lendingZone' = 股票借貸專區
  startPath: '/home',
  account: BASE_ACCOUNT,
};
