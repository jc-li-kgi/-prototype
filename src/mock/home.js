// 證券主頁「我的」的假資料（大盤、帳務總覽卡片）
// 台股庫存總市值由情境的持股計算（見 features/home/FinanceCards.js），其他卡片用固定數字

export const MARKET_INDEX = { name: '加權指數', value: 23597.32, change: 173.29 };

// 參考損益率（台股庫存用）
export const TW_PROFIT_RATE = 0.0641;

export const OTHER_FINANCE_CARDS = [
  { label: '海外庫存總市值（約當台幣）', value: 1286450, profit: 52310, rate: 0.0424, ad: '使用美股即時行情，動態一手掌握！', badge: 'account-sub.svg' },
  { label: '財富管理總資產市值', value: 530000, profit: -8120, rate: -0.0151, ad: '新財管投資平台，上線摟！', badge: 'account-wm.svg' },
  { label: '權益總值（約當台幣）', value: 320000, profit: 12800, rate: 0.04, ad: '期貨策略交易，掌握最前線', badge: 'account-futures.svg' },
];
