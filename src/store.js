// 假資料庫：所有功能都透過這裡讀寫，功能之間不互相 import
// 存在 localStorage，受測者重新整理不會遺失進度
import { useReducer, useEffect } from './lib/preact.js';
import { LOAN_RULES, addMonths, today } from './lib/calc.js';

const KEY = 'lending-proto-state-v2'; // 資料結構改版時遞增，避免讀到舊格式
const listeners = new Set();

let state = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || emptyState();
  } catch {
    return emptyState();
  }
}

function emptyState() {
  return { taskId: null, entry: null, flow: null, flowReturn: null, account: null, draft: {}, collateralDraft: {}, toast: null };
}

function save() {
  try {
    const { toast, ...persist } = state;
    localStorage.setItem(KEY, JSON.stringify(persist));
  } catch { /* 私密瀏覽模式時忽略 */ }
}

export function getState() {
  return state;
}

export function setState(patch) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  save();
  listeners.forEach((fn) => fn());
}

export function useStore(selector = (s) => s) {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);
  return selector(state);
}

/* ---------- 情境 ---------- */

export function loadScenario(scenario) {
  state = {
    ...emptyState(),
    taskId: scenario.id,
    entry: scenario.entry,
    startPath: scenario.startPath,
    account: structuredClone(scenario.account),
  };
  save();
  listeners.forEach((fn) => fn());
}

export function resetAll() {
  state = emptyState();
  save();
  listeners.forEach((fn) => fn());
}

/* ---------- 共用 UI ---------- */

let toastTimer;
export function showToast(message) {
  clearTimeout(toastTimer);
  setState({ toast: message });
  toastTimer = setTimeout(() => setState({ toast: null }), 1800);
}

/* ---------- 借款草稿 ---------- */

export function updateDraft(patch) {
  setState((s) => ({ draft: { ...s.draft, ...patch } }));
}

export function clearDraft() {
  setState({ draft: {} });
}

/* ---------- 業務動作 ---------- */

/* ---------- 匯入擔保品草稿：{ selected: { [code]: lots }, sort } ---------- */

export function updateCollateralDraft(patch) {
  setState((s) => ({ collateralDraft: { ...s.collateralDraft, ...patch } }));
}

export function clearCollateralDraft() {
  setState({ collateralDraft: {} });
}

/** 匯入擔保品：庫存 → 擔保品，並新增一筆紀錄 */
export function pledgeCollateral(items) {
  const record = {
    id: 'C' + Date.now().toString().slice(-6),
    type: '匯入',
    date: today(),
    items,
    status: '處理中',
  };
  setState((s) => {
    const a = s.account;
    const take = (list, code, lots, sign) => {
      const found = list.find((x) => x.code === code);
      if (found) return list.map((x) => (x.code === code ? { ...x, lots: x.lots + sign * lots } : x));
      return sign > 0 ? [...list, { code, lots }] : list;
    };
    let holdings = a.holdings;
    let collateral = a.collateral;
    items.forEach(({ code, lots }) => {
      holdings = take(holdings, code, lots, -1);
      collateral = take(collateral, code, lots, +1);
    });
    return {
      account: {
        ...a,
        holdings: holdings.filter((h) => h.lots > 0),
        collateral,
        collateralRecords: [record, ...(a.collateralRecords || [])],
      },
      collateralDraft: {},
    };
  });
  return record;
}

/** 首次借款：匯入擔保品 + 開戶 + 借款，一次送出 */
export function firstLoan(items, draft) {
  pledgeCollateral(items);
  const loan = borrow(draft);
  setState((s) => ({ account: { ...s.account, opened: true } }));
  return loan;
}

export function borrow({ amount, purpose }) {
  const date = today();
  const loan = {
    id: 'L' + Date.now().toString().slice(-6),
    amount,
    balance: amount,
    purpose,
    rate: LOAN_RULES.rate,
    applyDate: date,
    startDate: date,
    dueDate: addMonths(date, LOAN_RULES.termMonths),
    status: '撥款中',
  };
  setState((s) => ({
    account: { ...s.account, loans: [loan, ...s.account.loans] },
    draft: {},
  }));
  return loan;
}
