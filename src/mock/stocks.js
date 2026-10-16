// 假股價與擔保規則：所有情境共用
//   price    收盤價（每股）；1 張 = 1,000 股
//   ratio    可借貸成數
//   type     eligible  可借貸
//            ratioOnly 僅可用於提升維持率（無法借款）
//            ineligible 無法作為擔保品（reason 為原因）
export const LOT_SIZE = 1000;

export const STOCKS = {
  '2330': { name: '台積電', price: 2400, ratio: 0.5, type: 'eligible' },
  '2454': { name: '聯發科', price: 1600, ratio: 0.5, type: 'eligible' },
  '2357': { name: '華碩', price: 1200, ratio: 0.5, type: 'eligible' },
  '0050': { name: '元大台灣50', price: 180, ratio: 0.7, type: 'eligible' },
  '0056': { name: '元大高股息', price: 36, ratio: 0.6, type: 'eligible' },
  '2317': { name: '鴻海', price: 220, ratio: 0.6, type: 'eligible' },
  '2308': { name: '台達電', price: 1000, ratio: 0.5, type: 'eligible' },
  '2382': { name: '廣達', price: 300, ratio: 0.5, type: 'eligible' },
  '3711': { name: '日月光投控', price: 180, ratio: 0.5, type: 'eligible' },
  '2603': { name: '長榮', price: 200, ratio: 0.5, type: 'eligible' },
  '2412': { name: '中華電', price: 130, ratio: 0.6, type: 'eligible' },
  '2891': { name: '中信金', price: 45, ratio: 0.6, type: 'eligible' },
  '2883': { name: '凱基金', price: 18, ratio: 0.6, type: 'eligible' },
  '006208': { name: '富邦台50', price: 120, ratio: 0.7, type: 'eligible' },
  '00878': { name: '國泰永續高股息', price: 22, ratio: 0.6, type: 'eligible' },
  '2882': { name: '國泰金', price: 60, ratio: 0, type: 'ratioOnly' },
  '2881': { name: '富邦金', price: 90, ratio: 0, type: 'ratioOnly' },
  '3661': { name: '世芯-KY', price: 3000, ratio: 0, type: 'ineligible', reason: '目前被列為處置股' },
  '8299': { name: '群聯', price: 600, ratio: 0, type: 'ineligible', reason: '流動性低' },
};
