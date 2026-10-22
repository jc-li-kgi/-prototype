// 列表展開明細（白色卡片 + 資料列）｜Figma：還款紀錄展開明細（3089:63010）
// ListRow 的 detail 會自動包在這個元件裡；也可以單獨使用
import { html } from '../../lib/preact.js';

/**
 * <DetailPanel>
 *   <DetailRow label="交易申請日" value="2026/10/20" />
 *   <DetailRow label="還款本金" value="TWD 20,000" />
 * </DetailPanel>
 * 白底圓角卡（6）、內距 16×16（資訊瀏覽）、資料列間距 12（Figma）
 * 放在白色卡片裡時加 tone="blue"，改淡藍底（Figma 1804:117906 借新還舊展開明細）
 */
export function DetailPanel({ tone = 'white', children }) {
  return html`<div class=${'card detail-panel' + (tone === 'blue' ? ' detail-panel--blue' : '')}>${children}</div>`;
}
