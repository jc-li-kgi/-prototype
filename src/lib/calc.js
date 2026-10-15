// 所有計算公式集中在這裡（借款、試算共用）
import { STOCKS, LOT_SIZE } from '../mock/stocks.js';

/* 借款規則：調整利率、上下限只改這裡 */
export const LOAN_RULES = {
  min: 10000,          // 單筆最低
  step: 1000,          // 累加金額
  singleMax: 1000000,  // 單筆上限
  rate: 0.028,         // 參考年利率
  fee: 2,              // 借款手續費（每筆）
  termMonths: 6,       // 借款期間
};

/* 借款目的選項 */
export const LOAN_PURPOSES = ['資金周轉', '投資理財', '個人消費', '其他'];

/* ---------- 股票 / 擔保品（數量單位：張） ---------- */

export function stockOf(code) {
  return STOCKS[code] || { name: code, price: 0, ratio: 0, type: 'ineligible', reason: '查無資料' };
}

/** 每張市值 */
export function lotValue(code) {
  return stockOf(code).price * LOT_SIZE;
}

/** 每張可借金額 = 每張市值 × 成數 */
export function perLotLoan(code) {
  // 用 round 避免浮點誤差（例如 180000 × 0.7 = 125999.99999）
  return Math.round(lotValue(code) * stockOf(code).ratio);
}

/** 一組 { code, lots } 的總市值 */
export function marketValueOf(items) {
  return items.reduce((sum, c) => sum + c.lots * lotValue(c.code), 0);
}

/** 一組 { code, lots } 的可借額度 */
export function loanableOf(items) {
  return items.reduce((sum, c) => sum + c.lots * perLotLoan(c.code), 0);
}

/** 擔保品市值 */
export function collateralValue(account) {
  return marketValueOf(account.collateral);
}

/** 可借總額 = Σ 擔保品市值 × 成數 */
export function creditLimit(account) {
  return loanableOf(account.collateral);
}

/** 庫存依擔保資格分組：eligible / ratioOnly / ineligible */
export function groupHoldings(account) {
  const groups = { eligible: [], ratioOnly: [], ineligible: [] };
  account.holdings.forEach((h) => groups[stockOf(h.code).type].push(h));
  return groups;
}

/** 尚可匯入（可借貸）的庫存，匯入後可借總額可提升多少 */
export function importablePotential(account) {
  return loanableOf(groupHoldings(account).eligible);
}

/* 庫存排序方式 */
export const HOLDING_SORTS = [
  { value: 'perLotDesc', label: '每張可借金額高至低', fn: (a, b) => perLotLoan(b.code) - perLotLoan(a.code) },
  { value: 'perLotAsc', label: '每張可借金額低至高', fn: (a, b) => perLotLoan(a.code) - perLotLoan(b.code) },
  { value: 'lotsDesc', label: '可擔保張數多至少', fn: (a, b) => b.lots - a.lots },
];

/* ---------- 借款 ---------- */

/** 已借款金額（未還餘額） */
export function loanBalance(account) {
  return account.loans.reduce((sum, l) => sum + l.balance, 0);
}

/** 剩餘可借額度（以累加金額為單位無條件捨去） */
export function remainingCredit(account) {
  const raw = Math.max(0, creditLimit(account) - loanBalance(account));
  return Math.floor(raw / LOAN_RULES.step) * LOAN_RULES.step;
}

/** 整戶維持率（%），沒有借款時回傳 null */
export function maintenanceRatio(account, extraLoan = 0) {
  const balance = loanBalance(account) + extraLoan;
  if (balance <= 0) return null;
  return Math.floor((collateralValue(account) / balance) * 100);
}

/** 本次可借範圍 */
export function loanRange(account) {
  return {
    min: LOAN_RULES.min,
    max: Math.min(LOAN_RULES.singleMax, remainingCredit(account)),
    step: LOAN_RULES.step,
  };
}

/** 把輸入金額修正到合法範圍與級距 */
export function clampAmount(value, range) {
  const n = Number(value) || 0;
  const stepped = Math.round(n / range.step) * range.step;
  return Math.min(range.max, Math.max(range.min, stepped));
}

/** 預估每日利息（以參考年利率計算） */
export function dailyInterest(amount) {
  return Math.round((amount * LOAN_RULES.rate) / 365);
}

/** 首次借款：把還沒送出的擔保品（{ code: lots }）先算進帳戶，用來計算可借額度 */
export function withPendingCollateral(account, selected = {}) {
  const pending = Object.entries(selected).map(([code, lots]) => ({ code, lots }));
  if (!pending.length) return account;
  return { ...account, collateral: [...account.collateral, ...pending] };
}

/** 借款期間利息（預設半年） */
export function interestFor(amount, months = LOAN_RULES.termMonths) {
  return Math.round((amount * LOAN_RULES.rate * months) / 12);
}

/* ---------- 日期 ---------- */

/** 距離今天幾天（負數 = 已過期） */
export function daysUntil(isoDate) {
  return Math.round((new Date(isoDate) - new Date(today())) / 86400000);
}

/** 即將到期的天數門檻 */
export const DUE_SOON_DAYS = 30;

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function addMonths(isoDate, months) {
  const d = new Date(isoDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
