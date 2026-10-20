// 庫存列表（商品 / 剩餘可匯入張數 / 預估可借總額 / 匯入）
// 用在：股票借貸專區總覽（只放可借貸）、股票借貸明細 › 擔保品 › 未擔保（全部庫存）
//   預估可借總額：可借貸 → 金額；僅可提升維持率 / 無法作為擔保品 → 文字，且沒有「匯入」按鈕
import { html, useState } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, AmountCell, DetailRow, Button } from '../../components/index.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

const SORTS = {
  code: (a, b) => a.code.localeCompare(b.code),
  lots: (a, b) => b.lots - a.lots,
};

const ALIGN = ['left', 'right', 'right']; // 張數靠右，與表頭右緣對齊

/**
 * <HoldingsTable holdings=${eligibleHoldings} limit=${4} />
 */
export function HoldingsTable({ holdings, limit, emptyText = COPY.holdings.empty }) {
  const t = COPY.holdings;
  const tc = COPY.collateral;
  const [sort, setSort] = useState(null);
  const [open, setOpen] = useState(null);

  let rows = sort ? [...holdings].sort(SORTS[sort]) : holdings;
  if (limit) rows = rows.slice(0, limit);

  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colName[0]}<br />${t.colName[1]}`, width: 'minmax(0, 71px)', sortKey: 'code' },
        { label: t.colLots, width: '115px', align: 'right', sortKey: 'lots' },
        { label: t.colAmount, width: '102px', align: 'right', info: t.amountSheet },
      ]}
      expandable
      sort=${sort}
      onSort=${setSort}
      empty=${emptyText}
    >
      ${rows.map((h) => {
        const stock = stockOf(h.code);
        const eligible = stock.type === 'eligible';
        return html`
          <${ListRow}
            align=${ALIGN}
            cells=${[
              html`<${StockName} name=${stock.name} code=${h.code} />`,
              html`<p class="n-body-regular c-primary">${num(h.lots)}</p>`,
              eligible
                ? html`<${AmountCell} amount=${h.lots * perLotLoan(h.code)} />`
                : html`<p class="t-caption-regular c-secondary nowrap">${t.typeLabel[stock.type]}</p>`,
            ]}
            expanded=${open === h.code}
            onToggle=${() => setOpen(open === h.code ? null : h.code)}
            detail=${eligible
              ? html`
                  <${DetailRow} label=${tc.perLot} value=${num(perLotLoan(h.code))} />
                  <${DetailRow} label=${tc.ratio} value=${`${Math.round(stock.ratio * 100)}%`} />
                `
              : html`<p class="t-body-regular c-secondary">${stock.type === 'ineligible' ? `${tc.reason}${stock.reason}` : tc.groups.ratioOnly.desc}</p>`}
            footer=${eligible &&
            html`
              <${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => startFlow('collateralIn', { query: { code: h.code } })}>
                ${t.importBtn}
              <//>
            `}
          />
        `;
      })}
    <//>
  `;
}
