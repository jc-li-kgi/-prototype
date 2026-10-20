// 頁面底部按鈕區（不固定）｜規則見 CLAUDE.md「底部按鈕」
//   ・與上方內容至少 32px（Guideline：內容→按鈕）
//   ・內容不滿一屏時，按鈕自動置底（與內容距離 > 32px）
//   ・下方留頁尾：流程申請 48、資訊瀏覽 40（含 iPhone 安全區）
// 必須放在「撐滿畫面高度的直式 flex 容器」的最後一個（.page 已是 min-height 100dvh）
// 固定在畫面底部的按鈕用 StickyFooter，不適用本規則
import { html } from '../../lib/preact.js';

/**
 * <BottomActions>
 *   <Button>下一步</Button>
 *   <Button variant="text" block>完成</Button>   ← 多顆按鈕直排，間距 16
 * </BottomActions>
 *   context  'flow'（預設，流程申請：頁尾 48）| 'browse'（資訊瀏覽：頁尾 40）
 *   class    額外 class（例如限制按鈕寬度）
 */
export function BottomActions({ context = 'flow', class: extra = '', children }) {
  return html`<div class=${`bottom-actions bottom-actions--${context} ${extra}`.trim()}>${children}</div>`;
}
