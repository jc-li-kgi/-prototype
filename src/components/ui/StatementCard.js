// 對帳單卡片（標題金額 + 類型標籤 + 資料列，可展開淡藍明細）｜Figma 1822:124697（收合）、1822:124845（展開）
import { html, useState } from '../../lib/preact.js';
import { Tag } from './Tag.js';
import { DetailRow } from './DetailRow.js';
import { DetailPanel } from './DetailPanel.js';
import { Icon } from './Icon.js';
import { COPY } from '../../content/copy.js';

/**
 * <StatementCard
 *   title="TWD 9,445,000,000"             ← 標題（金額用預設 n-body-bold；中文標題傳 titleClass="t-body-bold"）
 *   tag="借款"
 *   rows=${[['起息日', '2025/12/28'], ['到期日', '2026/06/28'], ['申請日', html`<p>2025/12/28</p><p>11:45:11</p>`]]}
 *   detail=${[['利息', 'TWD 500'], ['手續費', 'TWD 500']]}   ← 展開後的淡藍明細；沒有就不顯示展開按鈕
 * />
 * 資料列的值預設英數樣式；中文值用 [label, value, 't-body-regular']
 * 白底圓角卡（6）、Basic 陰影；不含左右外距
 */
export function StatementCard({ title, titleClass = 'n-body-bold', tag, tagVariant = 'highlight', rows = [], detail = [] }) {
  const [open, setOpen] = useState(false);
  const t = COPY.common;
  const row = ([label, value, valueClass]) => html`<${DetailRow} label=${label} value=${value} valueClass=${valueClass} />`;

  return html`
    <article class="card card--shadow statement-card">
      <div class="statement-card__head">
        <p class=${titleClass + ' c-primary'}>${title}</p>
        ${tag && html`<${Tag} variant=${tagVariant}>${tag}<//>`}
      </div>
      <div class="statement-card__body">
        <div class="statement-card__rows">${rows.map(row)}</div>
        ${open && detail.length > 0 && html`<${DetailPanel} tone="blue">${detail.map(row)}<//>`}
        ${detail.length > 0 &&
        html`
          <button class="statement-card__toggle icon-text--body c-active" aria-expanded=${open} onClick=${() => setOpen(!open)}>
            <span class="t-body-regular">${open ? t.collapse : t.expand}</span>
            <${Icon} name=${open ? 'chevron-up.svg' : 'chevron-down.svg'} level="body" tint />
          </button>
        `}
      </div>
    </article>
  `;
}
