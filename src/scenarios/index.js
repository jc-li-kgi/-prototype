// 任務清單：新增情境 = 複製一個檔案 + 在這裡加一行
import T1 from './T1-first-loan.js';
import T2 from './T2-existing-borrow.js';
import T3 from './T3-import-collateral.js';
import T4 from './T4-cash-repay.js';

export const SCENARIOS = [T1, T2, T3, T4];

export const findScenario = (id) => SCENARIOS.find((s) => s.id === id);
