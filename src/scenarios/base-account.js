// 已開戶客戶的基本資料（多個情境共用；個別情境要不同時再覆寫）
// 數量單位一律是「張」；股價、成數見 src/mock/stocks.js
// 日期一律依「今天」計算（scenarioLoan），任何一天測試，即將到期等狀態都一樣
import { addDays, addMonths, today } from '../lib/calc.js';

/**
 * 情境用的借款：dueIn = 幾天後到期；每期 6 個月，展延幾次就往前推幾期作為起息日
 *   scenarioLoan({ id: 'L000123', amount: 120000, purpose: '資金周轉', dueIn: 6 })
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

// 已開戶任務（T2～T5）的已借款總額一律 TWD 200,000
// 共用的借款都還沒到期（不會出現到期通知）；需要即將到期的任務（T4、T5）自己覆寫 loans
/** 擔保品異動紀錄：daysBefore = 幾天前申請（要早於借款起息日，T5 的借款約 18 個月前起息） */
function collateralRecord({ id, type, code, lots, status, daysBefore, time }) {
  return { id, type, code, lots, status, appliedAt: `${addDays(today(), -daysBefore)}T${time}`, channel: 'APP' };
}

const loans = [
  scenarioLoan({ id: 'L000123', amount: 120000, purpose: '資金周轉', dueIn: 40 }),
  scenarioLoan({ id: 'L000098', amount: 80000, purpose: '投資理財', dueIn: 85 }),
];
export const BASE_ACCOUNT = {
  opened: true,
  id: '9999-999999',
  name: '流川楓',
  payoutBank: { name: '凱基銀行', number: '12122323232' }, // 撥款 / 還款扣款帳號
  bankBalance: 30000000,                                     // 扣款帳戶餘額

  // 已擔保（已匯入專區）的股票
  // 已擔保市值 TWD 1,621,300 → 可借總額度約 97 萬
  // 0050 總共只有 5 張：已擔保 2 張 + 庫存 3 張
  //   serial = 存入序號（擔保品展開明細）
  collateral: [
    { code: '0050', lots: 2, serial: '8200011' },
    { code: '0056', lots: 25, serial: '8200012' },
  ],

  // 證券庫存中，尚未匯入的股票（全部匯入約可再借 94 萬）
  holdings: [
    { code: '0050', lots: 3 },
    { code: '2883', lots: 15 }, // T3 要匯入的標的，放前面（專區只列前 4 筆）
    { code: '0056', lots: 5 },
    { code: '00915', lots: 10 },
    { code: '009816', lots: 10 },
    { code: '2882', lots: 5 },  // 僅可提升維持率
    { code: '3481', lots: 5 },  // 無法作為擔保品
  ],

  // 借款
  loans,
  repayments: [],

  // 擔保品異動紀錄（每檔一筆，新的在前）：type 匯入 / 匯出；status 成功 / 失敗 / 處理中
  //   結果要對得上 collateral：0050 匯入 2（另一筆失敗）；0056 匯入 30、匯出 5 = 25；失敗的不影響
  collateralRecords: [
    collateralRecord({ id: 'M0014', type: '匯出', code: '0056', lots: 5, status: '成功', daysBefore: 30, time: '14:20:36' }),
    collateralRecord({ id: 'M0013', type: '匯入', code: '00915', lots: 3, status: '失敗', daysBefore: 300, time: '09:12:48' }),
    collateralRecord({ id: 'M0013A', type: '匯入', code: '0050', lots: 3, status: '失敗', daysBefore: 400, time: '10:05:27' }),
    collateralRecord({ id: 'M0012', type: '匯入', code: '0056', lots: 30, status: '成功', daysBefore: 600, time: '11:45:11' }),
    collateralRecord({ id: 'M0011', type: '匯入', code: '0050', lots: 2, status: '成功', daysBefore: 600, time: '11:45:11' }),
  ],
};
