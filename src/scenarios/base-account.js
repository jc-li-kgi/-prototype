// 已開戶客戶的基本資料（多個情境共用；個別情境要不同時再覆寫）
// 數量單位一律是「張」；股價、成數見 src/mock/stocks.js
// 日期一律依「今天」計算（scenarioLoan），任何一天測試，即將到期等狀態都一樣
import { addDays, addMonths, today } from '../lib/calc.js';

/**
 * 情境用的借款：dueIn = 幾天後到期；每期 6 個月，展延幾次就往前推幾期作為起息日
 *   scenarioLoan({ id: 'L000123', amount: 300000, purpose: '資金周轉', dueIn: 6 })
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

// 共用的借款都還沒到期（不會出現到期通知）；需要即將到期的任務（T4、T5）自己覆寫 loans
const loans = [
  scenarioLoan({ id: 'L000123', amount: 300000, purpose: '資金周轉', dueIn: 40 }),
  scenarioLoan({ id: 'L000098', amount: 200000, purpose: '投資理財', dueIn: 85 }),
];
export const BASE_ACCOUNT = {
  opened: true,
  id: '9999-999999',
  name: '流川楓',
  payoutBank: { name: '凱基銀行', number: '12122323232' }, // 撥款 / 還款扣款帳號
  bankBalance: 30000000,                                     // 扣款帳戶餘額

  // 已擔保（已匯入專區）的股票
  // 已擔保市值 TWD 1,632,000 → 可借總額度約 98 萬
  collateral: [
    { code: '0050', lots: 10 },
    { code: '0056', lots: 10 },
  ],

  // 證券庫存中，尚未匯入的股票（全部匯入約可再借 100 萬）
  holdings: [
    { code: '0050', lots: 4 },
    { code: '2883', lots: 15 }, // T3 要匯入的標的，放前面（專區只列前 4 筆）
    { code: '0056', lots: 5 },
    { code: '00915', lots: 10 },
    { code: '009816', lots: 10 },
    { code: '2882', lots: 5 },  // 僅可提升維持率
    { code: '8299', lots: 1 },  // 無法作為擔保品
  ],

  // 借款
  loans,
  repayments: [],

  // 擔保品匯入 / 取回紀錄
  collateralRecords: [
    { id: 'C000045', type: '匯入', date: addDays(loans[0].startDate, -1), items: [{ code: '0050', lots: 10 }, { code: '0056', lots: 10 }], status: '已完成' },
  ],
};
