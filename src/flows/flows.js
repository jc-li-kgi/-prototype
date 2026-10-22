// 流程定義：每個流程 = 依序的步驟 + 完成頁
// 調整步驟順序、或組合新流程（例如未開戶 = 開戶 + 匯入擔保品 + 借款），只改這裡
import { getState, setState } from '../store.js';
import { navigate, parseHash } from '../router.js';

export const FLOWS = {
  existingLoan: {
    title: '申請借款',
    steps: [
      { path: '/loan/amount', label: '填寫借款金額' },
      { path: '/loan/confirm', label: '確認資料' },
    ],
    done: '/loan/result',
  },

  collateralIn: {
    title: '匯入擔保品',
    steps: [
      { path: '/collateral-in/select', label: '匯入擔保品' },
      { path: '/collateral-in/confirm', label: '確認資料' },
    ],
    done: '/collateral-in/result',
  },

  // 首次借款（未開戶）：匯入擔保品 → 借款，最後一次送出
  newAccountLoan: {
    title: '申請借款',
    steps: [
      { path: '/collateral-in/select', label: '匯入擔保品' },
      { path: '/loan/amount', label: '填寫借款金額' },
      { path: '/loan/confirm', label: '確認資料' },
    ],
    done: '/loan/result',
  },

  // 現金還款：從股票借貸明細 › 借款紀錄「還款」→ 選擇還款方式 → 現金還款
  cashRepay: {
    title: '現金還款',
    steps: [
      { path: '/repay/amount', label: '輸入還款金額' },
      { path: '/repay/confirm', label: '確認資料' },
    ],
    done: '/repay/result',
  },

  // 借新還舊：從股票借貸明細 › 借款紀錄「借新還舊」（即將到期、展延次數已滿）→ 選取借款契約 → 確認資料
  refinance: {
    title: '申請借新還舊',
    steps: [
      { path: '/refinance/select', label: '選取借款契約' },
      { path: '/refinance/confirm', label: '確認資料' },
    ],
    done: '/refinance/result',
  },
};

/** 目前是否在某個流程中 */
export function isFlow(flowId) {
  return getState().flow === flowId;
}

/** 頁首標題：依流程決定（同一頁在不同流程可有不同標題），沒有就用頁面預設 */
export function flowTitle(fallback) {
  return FLOWS[getState().flow]?.title || fallback;
}

/* 各入口的首頁（完成、返回時回到這裡） */
export const ENTRY_HOME = {
  account: '/account',
  lendingZone: '/lending-zone',
};

export function entryHome() {
  return ENTRY_HOME[getState().entry] || '/account';
}

/**
 * 開始流程；會記住從哪一頁進來，完成或在第 1 步返回時回到那一頁
 *   query     帶給第 1 步的參數，例如 startFlow('collateralIn', { query: { code: '2330' } })
 *   returnTo  指定結束後回到哪一頁（預設 = 目前頁面）
 */
export function startFlow(flowId, { query, returnTo } = {}) {
  const from = returnTo || location.hash.slice(1) || entryHome();
  // 每次開始流程都從空白草稿開始，避免帶到上次沒完成的資料
  setState({ flow: flowId, flowReturn: from, draft: {}, collateralDraft: {}, repayDraft: {}, refiDraft: {} });
  const qs = query ? '?' + new URLSearchParams(query) : '';
  navigate(FLOWS[flowId].steps[0].path + qs);
}

/** 流程結束後回去的頁面 */
export function flowReturnPath() {
  return getState().flowReturn || entryHome();
}

/** 目前流程；直接開網址時依路徑推斷 */
function currentFlow() {
  const flow = FLOWS[getState().flow];
  if (flow) return flow;
  const { path } = parseHash();
  return Object.values(FLOWS).find((f) => f.steps.some((s) => s.path === path) || f.done === path) || FLOWS.existingLoan;
}

/** 目前頁面在流程中的位置，給 StepBar 用 */
export function flowPosition(path) {
  const { steps } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  return { index, total: steps.length, label: steps[index]?.label };
}

/** 前往下一步；query 會帶給下一頁，例如完成頁要知道剛送出的紀錄編號 */
export function nextStep(path, { query } = {}) {
  const { steps, done } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  const next = steps[index + 1];
  const qs = query ? '?' + new URLSearchParams(query) : '';
  // 進完成頁時用 replace，避免按返回又回到確認頁重複送出
  if (next) navigate(next.path + qs);
  else navigate(done + qs, { replace: true });
}

export function prevStep(path) {
  const { steps } = currentFlow();
  const index = steps.findIndex((s) => s.path === path);
  navigate(index > 0 ? steps[index - 1].path : flowReturnPath());
}

/** 結束流程；to 不給時回到進入流程前的頁面 */
export function exitFlow(to) {
  const target = to || flowReturnPath();
  setState({ flow: null, flowReturn: null });
  navigate(target);
}
