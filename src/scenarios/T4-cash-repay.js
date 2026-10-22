// 任務 T4：已開戶，有一筆借款即將到期，到股票借貸明細用現金還款
import { BASE_ACCOUNT, scenarioLoan } from './base-account.js';

export default {
  id: 'T4',
  title: '現金還款',
  instruction: '你有一筆借款快到期了，想用現金把這筆即將到期的借款還掉，完成後查看還款紀錄。',
  entry: 'account',
  startPath: '/home',
  account: {
    ...BASE_ACCOUNT,
    // 一筆 6 天後到期 → 專區、帳務顯示到期通知，借款紀錄顯示「即將到期」
    loans: [
      scenarioLoan({ id: 'L000123', amount: 300000, purpose: '資金周轉', dueIn: 6 }),
      scenarioLoan({ id: 'L000098', amount: 200000, purpose: '投資理財', dueIn: 85 }),
    ],
  },
};
