// 已擔保的股票列表（股票借貸明細 › 擔保品 › 已擔保）
// Figma 尚無此頁，沿用「尚可匯入擔保品」列表版型（暫用）
// 欄位最多 2 行，展開明細可看完整商品名稱
import { html, useState } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, AmountCell, DetailRow } from '../../components/index.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num, price } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const ALIGN = ['left', 'center', 'right'];

export function PledgedList({ collateral, emptyText = COPY.records.emptyPledged }) {
  const t = COPY.holdings;
  const tc = COPY.collateral;
  const r = COPY.records;
  const [open, setOpen] = useState(null);
  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colName[0]}<br />${t.colName[1]}` },
        { label: r.colPledgedLots, width: '108px', align: 'center' },
        { label: r.colPledgedLoan, width: '104px', align: 'right' },
      ]}
      expandable
      empty=${emptyText}
    >
      ${collateral.map((c) => {
        const stock = stockOf(c.code);
        return html`
          <${ListRow}
            align=${ALIGN}
            cells=${[
              html`<${StockName} name=${stock.name} code=${c.code} />`,
              html`<p class="n-body-regular c-primary">${num(c.lots)}</p>`,
              html`<${AmountCell} amount=${c.lots * perLotLoan(c.code)} />`,
            ]}
            expanded=${open === c.code}
            onToggle=${() => setOpen(open === c.code ? null : c.code)}
            detail=${html`
              <${DetailRow} label=${t.detail.name} value=${stock.name} valueClass="t-body-regular text-wrap" />
              <${DetailRow} label=${t.detail.price} value=${price(stock.price)} />
              <${DetailRow} label=${tc.perLot} value=${num(perLotLoan(c.code))} />
              <${DetailRow} label=${tc.ratio} value=${`${Math.round(stock.ratio * 100)}%`} />
            `}
          />
        `;
      })}
    <//>
  `;
}
