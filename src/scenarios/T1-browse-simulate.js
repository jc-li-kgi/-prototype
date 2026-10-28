// 任務一＆二（T1）：尚未借款（未開戶），瀏覽股票借貸專區並試算可借金額
// 帳戶資料同 T3 首次借款（未開戶、只有庫存）
// 受測者按下任何「借款」（開始借款流程）時，不進入流程，改跳「任務完成」並引導回任務列表
import T3 from './T3-first-loan.js';

export default {
  id: 'T1',
  no: '一＆二', // 任務一、二合在同一個情境
  title: '瀏覽借貸專區＋試算',
  instruction: '你想了解股票借貸，請瀏覽股票借貸專區，並試算看看手上的股票可以借多少錢。',
  entry: 'lendingZone',
  startPath: '/home',
  completeOnFlows: ['newAccountLoan', 'existingLoan'], // 開始這些流程 = 任務完成
  account: T3.account,
};
