// 精選擔保品卡（股票名稱 + 並排數據）｜Figma：貸款卡_v2
// 不給 onClick 時是純展示的行銷卡片（不可點擊）
import { html } from '../../lib/preact.js';
import { StatGroup } from './StatGroup.js';

/**
 * <StockPickCard
 *   name="元大台灣50" code="0050"
 *   stats=${[
 *     { label: '庫存可借款', value: '63', unit: '萬', highlight: true },
 *     { label: '預估每日利息', value: '48', unit: 'TWD' },
 *   ]}
 *   onClick=${() => …}
 * />
 * 常搭配 <Carousel> 使用；疊在 Surface Blue 上用 Basic 陰影
 */
export function StockPickCard({ name, code, stats, onClick }) {
  const body = html`
    <p class="t-title c-primary">${name} ${code}</p>
    <${StatGroup} items=${stats} />
  `;
  return onClick
    ? html`<button class="card card--shadow stock-pick-card" onClick=${onClick}>${body}</button>`
    : html`<div class="card card--shadow stock-pick-card">${body}</div>`;
}
