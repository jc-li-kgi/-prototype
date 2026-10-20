// 列表（表頭 + 排序 + 分隔線 + 列）｜Figma：尚可匯入擔保品 / 借還款紀錄
import { html } from '../../lib/preact.js';
import { InfoLabel } from '../ui/InfoLabel.js';
import { ExpandToggle } from '../ui/ExpandToggle.js';
import { EmptyState } from '../ui/EmptyState.js';
import { DetailPanel } from '../ui/DetailPanel.js';

/**
 * <ListTable
 *   columns=${[
 *     { label: html`商品名稱<br/>代碼`, sortKey: 'code' },
 *     { label: '剩餘可匯入張數', width: '108px', align: 'center', sortKey: 'lots' },
 *     { label: '預估可借總額', width: '104px', align: 'right', info: { title, body } },
 *   ]}
 *   expandable                  ← 多一欄放展開箭頭
 *   sort=${sort} onSort=${setSort}
 *   empty="目前沒有資料"
 *   headAlign="end"             ← 表頭垂直對齊：center（預設）/ end（對齊兩行表頭的第二行）
 * >
 *   ${rows.map((r) => html`<ListRow cells=${[…]} … />`)}
 * </ListTable>
 * 欄寬：沒給 width 的欄平分剩餘寬度；全部都有 width 時，多出的寬度平均分到欄與欄之間
 *       窄螢幕要能縮的欄用 'minmax(0, 71px)'（最寬 71，不夠時縮小）
 */
export function ListTable({ columns, expandable = false, sort, onSort, empty, headAlign = 'center', children }) {
  const template = columns.map((c) => c.width || 'minmax(0, 1fr)').join(' ') + (expandable ? ' 24px' : '');
  const rows = [].concat(children || []).filter(Boolean);

  return html`
    <div class="list-table" style=${`--list-cols: ${template}`}>
      <div class=${'list-table__head list-table__head--' + headAlign + ' t-caption-regular c-secondary'}>
        ${columns.map(
          (c) => html`
            <span class=${'list-table__cell list-table__cell--' + (c.align || 'left')}>
              ${c.sortKey
                ? html`
                    <button class="sort-head" onClick=${() => onSort?.(sort === c.sortKey ? null : c.sortKey)} aria-pressed=${sort === c.sortKey}>
                      <span>${c.label}</span>
                      <span class="sort-head__icon"><img src="assets/icons/sort.svg" width="6" height="11" alt="" /></span>
                    </button>
                  `
                : c.info
                ? html`<${InfoLabel} label=${c.label} labelClass="" level="caption" info=${c.info} />`
                : c.label}
            </span>
          `
        )}
      </div>
      ${rows.length === 0 && empty ? html`<${EmptyState} text=${empty} />` : rows}
    </div>
  `;
}

/**
 * 列表的一列
 * <ListRow
 *   cells=${[<StockName/>, '20', <AmountCell/>]}   ← 對應 columns
 *   align=${['left', 'center', 'right']}
 *   expanded=${open} onToggle=${toggle}             ← 有 onToggle 時整列可點、最右側顯示箭頭
 *   detail=${html`<DetailRow …/>…`}              ← 展開內容，自動包在 DetailPanel（白色明細卡）裡
 *   footer=${html`…列下方的標籤 / 按鈕…`}
 * />
 */
export function ListRow({ cells, align = [], expanded = false, onToggle, detail, footer, footerAlign = 'end' }) {
  const main = html`
    ${cells.map((c, i) => html`<div class=${'list-table__cell list-table__cell--' + (align[i] || 'left')}>${c}</div>`)}
    ${onToggle && html`<${ExpandToggle} expanded=${expanded} />`}
  `;
  return html`
    <div class="list-table__row">
      ${onToggle
        ? html`<button class="list-table__main" onClick=${onToggle} aria-expanded=${expanded}>${main}</button>`
        : html`<div class="list-table__main">${main}</div>`}
      ${expanded && detail && html`<div class="list-table__detail"><${DetailPanel}>${detail}<//></div>`}
      ${footer && html`<div class=${'list-table__footer list-table__footer--' + footerAlign}>${footer}</div>`}
    </div>
  `;
}
