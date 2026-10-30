// 任務 T5：已開戶，瀏覽股票借貸明細（借還款紀錄、擔保品、歷史紀錄）
// 帳戶資料同共用基本資料，另外多一筆已還清的借款與它的還款紀錄，讓「還款」頁籤有內容
import { BASE_ACCOUNT, scenarioLoan } from './base-account.js';
import { carryOk, carriedAccount, userLoan } from './carry.js';

const paid = { ...scenarioLoan({ id: 'L000077', amount: 100000, purpose: '資金周轉', dueIn: -60 }), balance: 0, status: '已還清' };

const paidRepayment = {
  id: 'A0000077',
  method: '現金還款',
  status: '扣款成功',
  appliedAt: `${paid.dueDate}T10:30:00`,
  loanId: paid.id,
  principal: 100000,
  interest: 1400,
  fee: 80,
  total: 101480,
  bank: BASE_ACCOUNT.payoutBank,
  channel: 'APP',
};

export default {
  id: 'T5',
  no: '五',
  title: '瀏覽借貸明細',
  instruction: '請到股票借貸明細，查看你的借款、還款紀錄和擔保品。',
  entry: 'account',
  startPath: '/home',
  // 有任務三資料：用受測者的擔保品與借款，再加上已還清的那筆；否則用固定資料
  carryIn: (carry) =>
    carryOk(carry) ? carriedAccount(carry, [userLoan(carry), paid], { repayments: [paidRepayment] }) : null,
  account: {
    ...BASE_ACCOUNT,
    loans: [...BASE_ACCOUNT.loans, paid],
    repayments: [paidRepayment],
  },
};
