// 借還款紀錄（股票借貸明細 › 借還款紀錄）
//   借款：到期前 DUE_SOON_DAYS 天顯示「即將到期」＋ 展延 / 還款；還款 → 選擇還款方式（底部彈窗）
//   還款：還款紀錄列表，可展開明細
import { html, useState } from '../../lib/preact.js';
import {
  SegmentedTabs, FilterPill, Tag, Button, DetailRow, ListTable, ListRow, EmptyState, Sheet, SheetOptions,
} from '../../components/index.js';
import { showToast } from '../../store.js';
import { startFlow } from '../../flows/flows.js';
import { isDueSoon } from '../../lib/calc.js';
import { twd, date, rate, dateTime } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

/**
 * initialSub   一開始顯示的子頁籤：borrow（預設）| repay
 * initialOpen  一開始展開的紀錄編號（完成頁「查看還款紀錄」會帶）
 */
export function LoanRecordList({ loans = [], repayments = [], initialSub = 'borrow', initialOpen = null }) {
  const t = COPY.records;
  const [sub, setSub] = useState(initialSub);
  const [open, setOpen] = useState(initialOpen);
  const [repayLoan, setRepayLoan] = useState(null); // 正在選擇還款方式的借款
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const switchSub = (key) => {
    setSub(key);
    setOpen(null);
  };

  const chooseMethod = (value) => {
    const method = COPY.repay.methods.find((m) => m.value === value);
    const loan = repayLoan;
    setRepayLoan(null);
    if (!method?.available) return notAvailable();
    startFlow('cashRepay', { query: { loan: loan.id } });
  };

  return html`
    <div class="records-section">
      <div class="records-section__controls">
        <${SegmentedTabs} tabs=${t.loanTabs} active=${sub} onChange=${switchSub} />
        <div class="records-filters">
          ${(sub === 'borrow' ? [t.periodFilter, t.statusFilter] : t.repayFilters).map(
            (label) => html`<${FilterPill} label=${label} onClick=${notAvailable} />`
          )}
        </div>
      </div>

      ${sub === 'borrow' && html`<${BorrowList} loans=${loans} open=${open} setOpen=${setOpen} onRepay=${setRepayLoan} />`}
      ${sub === 'repay' && html`<${RepayList} repayments=${repayments} open=${open} setOpen=${setOpen} />`}

      <${Sheet} open=${!!repayLoan} title=${COPY.repay.methodTitle} onClose=${() => setRepayLoan(null)}>
        <${SheetOptions} chevron options=${COPY.repay.methods} onSelect=${chooseMethod} />
      <//>
    </div>
  `;
}

/** 借款紀錄：最近到期的在最上面 */
function BorrowList({ loans, open, setOpen, onRepay }) {
  const t = COPY.records;
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const rows = [...loans].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colBalance[0]}<br />${t.colBalance[1]}` },
        { label: t.colDue, width: 'auto', align: 'right' },
      ]}
      expandable
      headAlign="end"
      empty=${t.empty}
    >
      ${rows.map(
        (l) => html`
          <${ListRow}
            align=${['left', 'right']}
            cells=${[
              html`
                <p class="n-body-regular c-primary">${twd(l.balance)}</p>
                <p class="t-body-regular c-secondary">${l.status}</p>
              `,
              html`<p class="n-body-regular c-primary">${date(l.dueDate)}</p>`,
            ]}
            expanded=${open === l.id}
            onToggle=${() => setOpen(open === l.id ? null : l.id)}
            detail=${html`
              <${DetailRow} label="借款金額" value=${twd(l.amount)} />
              <${DetailRow} label="借款日" value=${date(l.startDate)} />
              <${DetailRow} label="參考利率" value=${rate(l.rate)} />
              <${DetailRow} label="借款目的" value=${l.purpose} valueClass="t-body-regular" />
            `}
            footerAlign="between"
            footer=${isDueSoon(l) &&
            html`
              <${Tag} variant="warning">${t.dueSoon}<//>
              <div class="records-row-buttons">
                <${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${t.extend}<//>
                <${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => onRepay(l)}>${t.repay}<//>
              </div>
            `}
          />
        `
      )}
    <//>
  `;
}

/** 還款紀錄：最新申請的在最上面｜Figma 3089:63010 */
function RepayList({ repayments, open, setOpen }) {
  const t = COPY.records;
  const d = t.repayDetail;
  const rows = [...repayments].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

  return html`
    <${ListTable}
      columns=${[
        { label: html`${t.colRepay[0]}<br />${t.colRepay[1]}` },
        { label: t.colMethod, width: 'auto', align: 'center' },
        { label: t.colAppliedAt, width: '97px', align: 'right' },
      ]}
      expandable
      headAlign="end"
      empty=${t.emptyRepay}
    >
      ${rows.map((r) => {
        const [day, time] = dateTime(new Date(r.appliedAt)).split(' ');
        return html`
          <${ListRow}
            align=${['left', 'center', 'right']}
            cells=${[
              html`
                <p class="n-body-regular c-primary">${twd(r.total)}</p>
                <p class="t-body-regular c-secondary">${r.status}</p>
              `,
              html`<p class="t-body-regular c-primary nowrap">${r.method}</p>`,
              html`
                <p class="n-body-regular c-primary">${day}</p>
                <p class="n-body-regular c-primary">${time}</p>
              `,
            ]}
            expanded=${open === r.id}
            onToggle=${() => setOpen(open === r.id ? null : r.id)}
            detail=${html`
              <div class="card repay-record-detail">
                <${DetailRow} label=${d.appliedAt} value=${day} />
                <${DetailRow} label=${d.principal} value=${twd(r.principal)} />
                <${DetailRow} label=${d.interest} value=${twd(r.interest)} />
                <${DetailRow} label=${d.fee} value=${twd(r.fee)} />
                <${DetailRow} label=${d.bank} value=${html`<p class="t-body-regular">${r.bank.name}</p><p class="n-body-regular">${r.bank.number}</p>`} />
                <${DetailRow} label=${d.serial} value=${r.id} />
                <${DetailRow} label=${d.channel} value=${r.channel} />
              </div>
            `}
          />
        `;
      })}
    <//>
  `;
}
