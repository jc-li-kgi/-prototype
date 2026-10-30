// 任務 T6：已開戶，有一筆借款即將到期，到股票借貸明細用現金還款
import { BASE_ACCOUNT, scenarioLoan } from './base-account.js';
import { carryOk, carriedAccount, splitAmount } from './carry.js';

export default {
  id: 'T6',
  no: '六',
  title: '現金還款',
  instruction: '你有一筆借款快到期了，想用現金把這筆即將到期的借款還掉，完成後查看還款紀錄。',
  entry: 'account',
  startPath: '/home',
  // 有任務三資料：用受測者的擔保品，借款總額沿用他借的金額，拆成快到期 60% + 未到期 40%
  carryIn: (carry) => {
    if (!carryOk(carry)) return null;
    const [due, later] = splitAmount(carry.loan.amount, [0.6, 0.4]);
    return carriedAccount(carry, [
      scenarioLoan({ id: 'L000123', amount: due, purpose: carry.loan.purpose, dueIn: 6 }),
      scenarioLoan({ id: 'L000098', amount: later, purpose: carry.loan.purpose, dueIn: 85 }),
    ]);
  },
  account: {
    ...BASE_ACCOUNT,
    // 一筆 6 天後到期 → 專區、帳務顯示到期通知，借款紀錄顯示「即將到期」
    loans: [
      scenarioLoan({ id: 'L000123', amount: 240000, purpose: '資金周轉', dueIn: 6 }),
      scenarioLoan({ id: 'L000098', amount: 160000, purpose: '投資理財', dueIn: 85 }),
    ],
  },
};
