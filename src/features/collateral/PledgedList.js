// 已擔保的股票列表（股票借貸明細 › 擔保品 › 已擔保）｜Figma 3061:69619
//   預設依可借款金額高到低；每列下方「賣股還款」（本次測試不開放）
//   展開明細：商品名稱 / 核准狀況 / 收盤價 / 存入序號 / 類別（值為粗體，Figma）＋「查看異動明細」→ onViewChanges(code)
// 欄位最多 2 行，展開明細可看完整商品名稱
import { html, useState } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, AmountCell, DetailRow, Button } from '../../components/index.js';
import { showToast } from '../../store.js';
import { stockOf, perLotLoan } from '../../lib/calc.js';
import { num, price } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const ALIGN = ['left', 'right', 'right'];

export function PledgedList({ collateral, emptyText = COPY.records.emptyPledged, onViewChanges }) {
  const t = COPY.holdings;
  const r = COPY.records;
  const d = r.pledgedDetail;
  const [open, setOpen] = useState(null);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  return html`
    <${ListTable}
      columns=${[
        // 欄寬比照未擔保（HoldingsTable）：全部固定寬，多出的寬度平均分到欄與欄之間；商品名稱 91（Figma）
        { label: html`${t.colName[0]}<br />${t.colName[1]}`, width: 'minmax(0, 91px)' },
        { label: r.colPledgedLots, width: '96px', align: 'right' },
        { label: r.colPledgedLoan, width: '102px', align: 'right', info: r.pledgedLoanSheet },
      ]}
      expandable
      empty=${emptyText}
    >
      ${[...collateral].sort((a, b) => b.lots * perLotLoan(b.code) - a.lots * perLotLoan(a.code)).map((c) => {
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
            footer=${html`<${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${r.sellRepay}<//>`}
            detail=${html`
              <${DetailRow} label=${d.name} value=${stock.name} valueClass="t-body-bold text-wrap" />
              <${DetailRow} label=${d.approval} value=${r.approvalLabel[stock.type] ?? '-'} valueClass="t-body-bold" />
              <${DetailRow} label=${d.price} value=${price(stock.price)} valueClass="n-body-bold" />
              <${DetailRow} label=${d.serial} value=${c.serial ?? '-'} valueClass="n-body-bold" />
              <${DetailRow} label=${d.category} value=${r.categoryValue} valueClass="t-body-bold" />
              <div class="records-detail-buttons records-detail-buttons--single">
                <${Button} variant="capsule" onClick=${() => onViewChanges?.(c.code)}>${r.viewChanges}<//>
              </div>
            `}
          />
        `;
      })}
    <//>
  `;
}
