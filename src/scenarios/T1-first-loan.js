// 任務 T1：尚未借款（未開戶），從「股票借貸專區」完成首次借款（匯入擔保品 + 借款）
import { BASE_ACCOUNT } from './base-account.js';

export default {
  id: 'T1',
  title: '首次借款',
  instruction: '你還沒有使用過股票借貸，想用手上的股票借 10 萬元做資金周轉，請從股票借貸專區完成申請。',
  entry: 'lendingZone',
  startPath: '/home',
  account: {
    ...BASE_ACCOUNT,
    opened: false,
    collateral: [],
    loans: [],
    repayments: [],
    collateralRecords: [],
    // 庫存全部匯入約可借 100 萬
    holdings: [
      { code: '0050', lots: 4 },
      { code: '2883', lots: 15 },
      { code: '0056', lots: 5 },
      { code: '00915', lots: 10 },
      { code: '009816', lots: 10 },
      { code: '2882', lots: 5 },  // 僅可提升維持率
      { code: '8299', lots: 1 },  // 無法作為擔保品
    ],
  },
};
