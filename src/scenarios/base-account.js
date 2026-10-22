// 已開戶客戶的基本資料（多個情境共用；個別情境要不同時再覆寫）
// 數量單位一律是「張」；股價、成數見 src/mock/stocks.js
// 日期一律依「今天」計算（scenarioLoan），任何一天測試，即將到期等狀態都一樣
import { addDays, addMonths, today } from '../lib/calc.js';

/**
 * 情境用的借款：dueIn = 幾天後到期；每期 6 個月，展延幾次就往前推幾期作為起息日
 *   scenarioLoan({ id: 'L000123', amount: 1000000, purpose: '資金周轉', dueIn: 6 })
 *   extensions  已展延次數（預設 0）；feePaid  借款手續費是否已收（預設 false）
 */
export function scenarioLoan({ id, amount, purpose, dueIn, extensions = 0, feePaid = false }) {
  const dueDate = addDays(today(), dueIn);
  const startDate = addMonths(dueDate, -6 * (extensions + 1));
  return {
    id,
    amount,
    balance: amount,
    purpose,
    rate: 0.028,
    applyDate: startDate,
    startDate,
    dueDate,
    status: '已撥款',
    extensions,
    feePaid,
    fee: 2,
    appliedAt: `${startDate}T10:15:30`,
    channel: 'APP',
  };
}

const loans = [
  scenarioLoan({ id: 'L000123', amount: 1000000, purpose: '資金周轉', dueIn: 6 }),  // 即將到期（現金還款任務用）
  scenarioLoan({ id: 'L000098', amount: 1000000, purpose: '投資理財', dueIn: 85 }),
];
export const BASE_ACCOUNT = {
  opened: true,
  id: '9999-999999',
  name: '流川楓',
  payoutBank: { name: '凱基銀行', number: '12122323232' }, // 撥款 / 還款扣款帳號
  bankBalance: 30000000,                                     // 扣款帳戶餘額

  // 已擔保（已匯入專區）的股票
  collateral: [
    { code: '2330', lots: 2 },
    { code: '0050', lots: 5 },
  ],

  // 證券庫存中，尚未匯入的股票
  holdings: [
    { code: '2330', lots: 20 },
    { code: '2454', lots: 15 },
    { code: '2357', lots: 12 },
    { code: '0056', lots: 5 },
    { code: '2317', lots: 10 },
    { code: '2308', lots: 3 },
    { code: '2382', lots: 6 },
    { code: '3711', lots: 4 },
    { code: '2603', lots: 8 },
    { code: '2412', lots: 5 },
    { code: '2891', lots: 20 },
    { code: '2883', lots: 30 },
    { code: '006208', lots: 15 },
    { code: '00878', lots: 40 },
    { code: '2882', lots: 12 },
    { code: '2881', lots: 8 },
    { code: '3661', lots: 3 },
    { code: '8299', lots: 5 },
  ],

  // 借款
  loans,
  repayments: [],

  // 擔保品匯入 / 取回紀錄
  collateralRecords: [
    { id: 'C000045', type: '匯入', date: addDays(loans[0].startDate, -1), items: [{ code: '2330', lots: 2 }, { code: '0050', lots: 5 }], status: '已完成' },
  ],
};
