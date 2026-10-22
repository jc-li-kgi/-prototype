// 任務 T5：已開戶，有一筆借款即將到期且已展延 2 次（不能再展延），到股票借貸明細用借新還舊
// 借款日期依「今天」計算，任何一天測試都有即將到期的借款：
//   L000123  6 天後到期、展延 2/2 → 借款紀錄顯示「借新還舊」
//   L000131  15 天後到期、展延 2/2、尚未收借款手續費 → 也可借新還舊，可一併勾選
//   L000098  90 天後到期 → 不在借新還舊清單
import { BASE_ACCOUNT, scenarioLoan as loan } from './base-account.js';

export default {
  id: 'T5',
  title: '借新還舊',
  instruction: '你有一筆借款快到期了，而且已經展延 2 次、不能再展延。請用借新還舊處理這筆借款，完成後查看新的借款。',
  entry: 'account',
  startPath: '/home',
  account: {
    ...BASE_ACCOUNT,
    loans: [
      loan({ id: 'L000123', amount: 1000000, purpose: '資金周轉', dueIn: 6, extensions: 2, feePaid: true }),
      loan({ id: 'L000131', amount: 500000, purpose: '投資理財', dueIn: 15, extensions: 2, feePaid: false }),
      loan({ id: 'L000098', amount: 1000000, purpose: '投資理財', dueIn: 90, extensions: 0, feePaid: false }),
    ],
  },
};
