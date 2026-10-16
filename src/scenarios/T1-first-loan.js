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
    holdings: [
      { code: '2330', lots: 1 },
      { code: '0050', lots: 5 },
      { code: '0056', lots: 10 },
      { code: '2882', lots: 3 },
      { code: '3661', lots: 1 },
    ],
  },
};
