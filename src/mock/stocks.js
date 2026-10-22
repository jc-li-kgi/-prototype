// 假股價與擔保規則：所有情境共用
//   price    收盤價（每股）；1 張 = 1,000 股
//   ratio    可借貸成數（可借貸股票一律 60%：用戶最多可借市值的 60%，初始維持率 166%）
//   type     eligible  可借貸
//            ratioOnly 僅可用於提升維持率（無法借款）
//            ineligible 無法作為擔保品（reason 為原因）
export const LOT_SIZE = 1000;

// 全站只用這 5 檔（都可借貸）；資料來源：專案根目錄「產品資料.md」，更新時兩邊一起改
export const STOCKS = {
  '0050': { name: '元大台灣50', price: 106.9, ratio: 0.6, type: 'eligible' },
  '0056': { name: '元大高股息', price: 56.3, ratio: 0.6, type: 'eligible' },
  '00915': { name: '凱基優選高股息30', price: 24, ratio: 0.6, type: 'eligible' }, // 收盤價待確認
  '009816': { name: '凱基台灣TOP50', price: 15.93, ratio: 0.6, type: 'eligible' },
  '2883': { name: '凱基金', price: 37.75, ratio: 0.6, type: 'eligible' },
};
