// 假資料庫：所有功能都透過這裡讀寫，功能之間不互相 import
// 存在 localStorage，受測者重新整理不會遺失進度
import { useReducer, useEffect } from './lib/preact.js';
import { LOAN_RULES, addMonths, today, repayPlan, refinancePlan } from './lib/calc.js';

const KEY = 'lending-proto-state-v5'; // 資料結構改版時遞增，避免讀到舊格式
const CARRY_KEY = 'lending-proto-carry-v1'; // 任務三 → 任務四～七連動的資料（見 scenarios/carry.js），換任務不會清掉
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
  return { taskId: null, entry: null, flow: null, flowReturn: null, account: null, draft: {}, collateralDraft: {}, repayDraft: {}, refiDraft: {}, introShown: false, completeOnFlows: null, taskDone: false, toast: null };
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

/* ---------- 任務連動（任務三 → 四～七） ---------- */

function loadCarry() {
  try {
    return JSON.parse(localStorage.getItem(CARRY_KEY));
  } catch {
    return null;
  }
}

function saveCarry(carry) {
  try {
    if (carry) localStorage.setItem(CARRY_KEY, JSON.stringify(carry));
    else localStorage.removeItem(CARRY_KEY);
  } catch { /* 私密瀏覽模式時忽略 */ }
}

/** 是否有任務三的資料（主持人頁顯示用） */
export function hasCarry() {
  return !!loadCarry();
}

export function loadScenario(scenario) {
  // 重新開始任務三（記錄端）：清掉上一位受測者的資料
  if (scenario.carryOut) saveCarry(null);
  // 帶入端：有可用的任務三資料就用，否則用固定資料
  const carried = scenario.carryIn ? scenario.carryIn(loadCarry()) : null;
  state = {
    ...emptyState(),
    taskId: scenario.id,
    entry: scenario.entry,
    startPath: scenario.startPath,
    completeOnFlows: scenario.completeOnFlows || null, // 開始這些流程時任務完成（見 flows.js startFlow）
    introShown: !!scenario.introSeen, // 前一個任務已看過介紹頁 → 進專區不再自動開啟
    carryOut: !!scenario.carryOut,     // 完成首次借款時記下帳戶給後面的任務
    carried: !!carried,                // 這次是否帶入了任務三的資料
    account: structuredClone(carried || scenario.account),
  };
  save();
  listeners.forEach((fn) => fn());
}

export function resetAll() {
  saveCarry(null);
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
  // 異動紀錄每檔一筆（歷史紀錄、單檔異動明細用）
  const now = new Date();
  const base = Date.now().toString().slice(-4);
  const records = items.map(({ code, lots }, i) => ({
    id: `M${base}${i}`,
    type: '匯入',
    code,
    lots,
    status: '成功', // 匯入不會有處理中的狀態
    appliedAt: now.toISOString(),
    channel: 'APP',
  }));
  setState((s) => {
    const a = s.account;
    const take = (list, code, lots, sign) => {
      const found = list.find((x) => x.code === code);
      if (found) return list.map((x) => (x.code === code ? { ...x, lots: x.lots + sign * lots } : x));
      // 新擔保的股票給一個存入序號
      return sign > 0 ? [...list, { code, lots, serial: String(8200000 + ((Date.now() + list.length) % 100000)) }] : list;
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
        collateralRecords: [...records, ...(a.collateralRecords || [])],
      },
      collateralDraft: {},
    };
  });
  return records;
}

/** 首次借款：匯入擔保品 + 開戶 + 借款，一次送出 */
export function firstLoan(items, draft) {
  pledgeCollateral(items);
  const loan = borrow(draft);
  setState((s) => ({ account: { ...s.account, opened: true } }));
  // 任務三：記下受測者的帳戶，給任務四～七帶入
  if (state.carryOut) {
    const a = state.account;
    saveCarry({
      collateral: a.collateral,
      holdings: a.holdings,
      collateralRecords: a.collateralRecords,
      loan: { ...loan },
    });
  }
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
    extensions: 0,
    fee: LOAN_RULES.fee,
    appliedAt: new Date().toISOString(),
    channel: 'APP',
  };
  setState((s) => ({
    account: { ...s.account, loans: [loan, ...s.account.loans] },
    draft: {},
  }));
  return loan;
}

/* ---------- 還款草稿：{ loanId, mode: 'partial' | 'full', principal } ---------- */

export function updateRepayDraft(patch) {
  setState((s) => ({ repayDraft: { ...(s.repayDraft || {}), ...patch } }));
}

export function clearRepayDraft() {
  setState({ repayDraft: {} });
}

/** 現金還款：依試算扣減各筆借款餘額，並新增一筆還款紀錄（回傳紀錄，完成頁用來展開明細） */
export function repay({ loanId, principal }) {
  const account = state.account;
  const plan = repayPlan(account, principal);
  const now = new Date();
  const record = {
    id: 'A' + Date.now().toString().slice(-7),
    method: '現金還款',
    status: '扣款中',
    appliedAt: now.toISOString(),
    loanId,
    principal: plan.principal,
    interest: plan.interest,
    fee: plan.fee,
    total: plan.total,
    bank: account.payoutBank,
    channel: 'APP',
  };
  const paid = Object.fromEntries(plan.allocations.map((a) => [a.loanId, a.amount]));
  setState((s) => ({
    account: {
      ...s.account,
      loans: s.account.loans.map((l) => {
        if (!paid[l.id]) return l;
        const balance = l.balance - paid[l.id];
        return { ...l, balance, status: balance === 0 ? '已還清' : l.status };
      }),
      repayments: [record, ...(s.account.repayments || [])],
    },
    repayDraft: {},
  }));
  return record;
}

/* ---------- 介紹頁：未借款進專區時只自動開一次（每個任務重新計算） ---------- */

export function markIntroShown() {
  setState({ introShown: true });
}

/* ---------- 可借貸額度試算：{ items: [{ code, lots }] }（code / lots 可為 null = 未填） ---------- */

export function updateSimDraft(patch) {
  setState((s) => ({ simDraft: { ...(s.simDraft || {}), ...patch } }));
}

/* ---------- 借新還舊草稿：{ loanIds } ---------- */

export function updateRefiDraft(patch) {
  setState((s) => ({ refiDraft: { ...(s.refiDraft || {}), ...patch } }));
}

/** 借新還舊：選取的舊借款還清，整併成一筆新借款（回傳新借款，完成頁用來展開這一筆） */
export function refinance({ loanIds }) {
  const plan = refinancePlan(state.account, loanIds);
  const n = plan.newLoan;
  const loan = {
    id: 'L' + Date.now().toString().slice(-6),
    amount: n.amount,
    balance: n.amount,
    purpose: n.purpose,
    rate: n.rate,
    applyDate: n.startDate,
    startDate: n.startDate,
    dueDate: n.dueDate,
    status: '已撥款', // 借新還舊不撥現金（直接償還舊借款），新借款直接生效
    extensions: 0,
    fee: n.fee,
    appliedAt: new Date().toISOString(),
    channel: 'APP',
    refinancedFrom: loanIds,
  };
  // 舊借款的還款紀錄（還款方式＝借新還舊）：本金由新借款償還，扣款帳戶只扣利息＋手續費
  const principal = plan.loans.reduce((sum, l) => sum + l.balance, 0);
  const record = {
    id: 'A' + Date.now().toString().slice(-7),
    method: '借新還舊',
    status: '已扣款',
    appliedAt: loan.appliedAt,
    loanId: loanIds[0],
    loanIds,
    principal,
    interest: plan.interest,
    fee: plan.fee,
    total: principal + plan.interest + plan.fee,
    bank: state.account.payoutBank,
    channel: 'APP',
  };
  setState((s) => ({
    account: {
      ...s.account,
      loans: [
        loan,
        ...s.account.loans.map((l) => (loanIds.includes(l.id) ? { ...l, balance: 0, status: '已還清' } : l)),
      ],
      repayments: [record, ...(s.account.repayments || [])],
    },
    refiDraft: {},
  }));
  return loan;
}
