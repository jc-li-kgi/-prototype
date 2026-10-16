// 已開戶客戶的基本資料（多個情境共用；個別情境要不同時再覆寫）
// 數量單位一律是「張」；股價、成數見 src/mock/stocks.js
export const BASE_ACCOUNT = {
  opened: true,
  id: '9999-999999',
  name: '流川楓',
  payoutBank: { name: '凱基銀行', number: '12122323232' },

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
  loans: [
    {
      id: 'L000123',
      amount: 1000000,
      balance: 1000000,
      purpose: '資金周轉',
      rate: 0.028,
      applyDate: '2026-04-28',
      startDate: '2026-04-28',
      dueDate: '2026-10-28',
      status: '已撥款',
    },
    {
      id: 'L000098',
      amount: 1000000,
      balance: 1000000,
      purpose: '投資理財',
      rate: 0.028,
      applyDate: '2026-07-15',
      startDate: '2026-07-15',
      dueDate: '2027-01-15',
      status: '已撥款',
    },
  ],
  repayments: [],

  // 擔保品匯入 / 取回紀錄
  collateralRecords: [
    { id: 'C000045', type: '匯入', date: '2026-04-27', items: [{ code: '2330', lots: 2 }, { code: '0050', lots: 5 }], status: '已完成' },
  ],
};
