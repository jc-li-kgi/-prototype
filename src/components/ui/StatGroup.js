// 並排數據（標題 + 大數字 + 單位，中間直線分隔）｜Figma：貸款方案卡片 / 貸款卡_v2 › 優惠資訊
import { html } from '../../lib/preact.js';

/**
 * <StatGroup items=${[
 *   { label: '預估庫存可借貸', value: '100', unit: '萬', highlight: true },   ← highlight：橘色強調
 *   { label: '預估每日利息', value: '178', unit: 'TWD' },
 * ]} />
 * 單位是中文時用 t- 樣式、英文時用 n- 樣式（自動判斷）
 */
export function StatGroup({ items }) {
  return html`
    <div class="stat-group">
      ${items.map(
        (s, i) => html`
          ${i > 0 && html`<span class="stat-group__divider" aria-hidden="true" />`}
          <div class=${'stat' + (s.highlight ? ' stat--highlight' : '')}>
            <p class="t-caption-regular c-secondary">${s.label}</p>
            <p class="stat__value">
              <span class="n-title">${s.value}</span>
              ${s.unit && html`<span class=${/[一-鿿]/.test(s.unit) ? 't-body-bold' : 'n-body-bold'}>${s.unit}</span>`}
            </p>
          </div>
        `
      )}
    </div>
  `;
}
