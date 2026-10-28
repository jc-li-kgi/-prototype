// 任務清單：新增情境 = 複製一個檔案 + 在這裡加一行
import T1 from './T1-browse-simulate.js';
import T3 from './T3-first-loan.js';
import T4 from './T4-existing-borrow.js';
import T5 from './T5-browse-records.js';
import T6 from './T6-partial-repay.js';
import T7 from './T7-refinance.js';

// 任務列表依這個順序顯示；編號用各情境的 no（例如 T1 = 任務一＆二）
// 匯入擔保品（extra-import-collateral.js）目前不列入
export const SCENARIOS = [T1, T3, T4, T5, T6, T7];

export const findScenario = (id) => SCENARIOS.find((s) => s.id === id);
