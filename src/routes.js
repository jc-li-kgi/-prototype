// 路由表：網址 → 頁面
import { HomeShell } from './shells/HomeShell.js';
import { AccountShell } from './shells/AccountShell.js';
import { LendingZoneShell } from './shells/LendingZoneShell.js';
import { LoanAmount } from './features/loan/LoanAmount.js';
import { LoanConfirm } from './features/loan/LoanConfirm.js';
import { LoanResult } from './features/loan/LoanResult.js';
import { CollateralSelect } from './features/collateral/CollateralSelect.js';
import { CollateralConfirm } from './features/collateral/CollateralConfirm.js';
import { CollateralResult } from './features/collateral/CollateralResult.js';
import { RepayAmount } from './features/repay/RepayAmount.js';
import { RepayConfirm } from './features/repay/RepayConfirm.js';
import { RepayResult } from './features/repay/RepayResult.js';
import { RefinanceSelect } from './features/refinance/RefinanceSelect.js';
import { RefinanceConfirm } from './features/refinance/RefinanceConfirm.js';
import { RefinanceResult } from './features/refinance/RefinanceResult.js';
import { SimulateResult } from './features/simulate/SimulateResult.js';
import { LendingRecords } from './pages/LendingRecords.js';
import { TaskStart } from './pages/TaskStart.js';
import { Moderator } from './pages/Moderator.js';

export const ROUTES = {
  '/start': TaskStart,
  '/moderator': Moderator,

  // 入口
  '/home': HomeShell,               // 證券主頁「我的」（所有任務的起點）
  '/account': AccountShell,         // 帳務 › 授信管理
  '/lending-zone': LendingZoneShell, // 股票借貸專區

  // 借款
  '/loan/amount': LoanAmount,
  '/loan/confirm': LoanConfirm,
  '/loan/result': LoanResult,

  // 匯入擔保品
  '/collateral-in/select': CollateralSelect,
  '/collateral-in/confirm': CollateralConfirm,
  '/collateral-in/result': CollateralResult,

  // 現金還款
  '/repay/amount': RepayAmount,
  '/repay/confirm': RepayConfirm,
  '/repay/result': RepayResult,

  // 借新還舊
  '/refinance/select': RefinanceSelect,
  '/refinance/confirm': RefinanceConfirm,
  '/refinance/result': RefinanceResult,

  // 可借貸額度試算結果（輸入在專區「試算」頁籤）
  '/simulate/result': SimulateResult,

  // 股票借貸明細（?tab=loans|collateral|statement）
  '/records': LendingRecords,
};

// 不需要情境資料就能開的頁面
export const PUBLIC_ROUTES = ['/start', '/moderator'];
