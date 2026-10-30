// 任務連動：任務三（首次借款）完成時記下受測者的帳戶，任務四～七開始時帶入
//   記錄（store.firstLoan）：擔保品、剩下的庫存、擔保品異動紀錄、借的那筆款
//   帶入（情境的 carryIn）：擔保品 / 庫存 / 紀錄用受測者的，借款總額沿用他借的金額，
//     再依各任務需要拆成「快到期」「已展延 2 次」等借款
//   沒有任務三資料、或額度不夠時，回傳 null → 改用情境的固定資料
import { loanableOf, LOAN_RULES, addDays } from '../lib/calc.js';
import { BASE_ACCOUNT, scenarioLoan } from './base-account.js';

/** 任務三的資料是否可用：可借總額度要放得下借款；needRemaining = 還要留多少可借額度（例如再借一筆） */
export function carryOk(carry, { needRemaining = 0 } = {}) {
  if (!carry?.loan?.amount || !carry.collateral?.length) return false;
  return loanableOf(carry.collateral) - carry.loan.amount >= needRemaining;
}

/** 受測者在任務三借的那筆（後續任務中已撥款） */
export function userLoan(carry) {
  return { ...carry.loan, balance: carry.loan.amount, status: '已撥款', extensions: 0, feePaid: false };
}

/** 把借款總額依比例拆成幾筆，以 1,000 元為單位，最後一筆補足差額 */
export function splitAmount(total, ratios) {
  const step = LOAN_RULES.step;
  const parts = ratios.slice(0, -1).map((r) => Math.round((total * r) / step) * step);
  return [...parts, total - parts.reduce((a, b) => a + b, 0)];
}

/** 依受測者的擔保品組出帳戶；擔保品紀錄的日期若晚於最早的借款起息日，往前移到起息日前一天（借款前要先有擔保品） */
export function carriedAccount(carry, loans, extra = {}) {
  const earliest = loans.map((l) => l.startDate).sort()[0];
  const records = (carry.collateralRecords || []).map((r) =>
    earliest && r.appliedAt.slice(0, 10) >= earliest ? { ...r, appliedAt: `${addDays(earliest, -1)}T${r.appliedAt.slice(11)}` } : r
  );
  return {
    ...BASE_ACCOUNT,
    collateral: carry.collateral,
    holdings: carry.holdings,
    collateralRecords: records,
    loans,
    repayments: [],
    ...extra,
  };
}

export { scenarioLoan };
