// 借還款紀錄（股票借貸明細 › 借還款紀錄）
//   借款：到期前 DUE_SOON_DAYS 天顯示「即將到期」＋ 展延 / 還款；還款 → onRepay(借款)，由頁面開啟選擇還款方式
//         展延次數已滿（LOAN_RULES.maxExtensions）時「展延」改為「借新還舊」→ onRefinance(借款)
//         展開明細｜Figma 3167:192520：還款紀錄 → 切到還款子頁籤；展延紀錄未開放
//   還款：還款紀錄列表，可展開明細
import { html, useState, useEffect, useRef } from '../../lib/preact.js';
import {
  SegmentedTabs, FilterPill, Tag, Button, DetailRow, ListTable, ListRow, EmptyState,
} from '../../components/index.js';
import { showToast } from '../../store.js';
import { LOAN_RULES, isDueSoon, extensionsUsed, periodInterest } from '../../lib/calc.js';
import { twd, date, rate, dateTime } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

/**
 * initialSub   一開始顯示的子頁籤：borrow（預設）| repay
 * initialOpen  一開始展開的紀錄編號（完成頁「查看還款紀錄」會帶）
 * onRepay      點借款的「還款」(loan)
 * onRefinance  點借款的「借新還舊」(loan)
 */
export function LoanRecordList({ loans = [], repayments = [], initialSub = 'borrow', initialOpen = null, onRepay, onRefinance }) {
  const t = COPY.records;
  const [sub, setSub] = useState(initialSub);
  const [open, setOpen] = useState(initialOpen);
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const ref = useRef(null);

  // 從完成頁進來（initialOpen）：捲到展開的那一筆
  useEffect(() => {
    if (initialOpen) ref.current?.querySelector('[aria-expanded="true"]')?.scrollIntoView({ block: 'center' });
  }, []);

  const switchSub = (key) => {
    setSub(key);
    setOpen(null);
  };

  return html`
    <div class="records-section" ref=${ref}>
      <div class="records-section__controls">
        <${SegmentedTabs} tabs=${t.loanTabs} active=${sub} onChange=${switchSub} />
        <div class="records-filters">
          ${(sub === 'borrow' ? [t.periodFilter, t.statusFilter] : t.repayFilters).map(
            (label) => html`<${FilterPill} label=${label} onClick=${notAvailable} />`
          )}
        </div>
      </div>

      ${sub === 'borrow' && html`<${BorrowList} loans=${loans} open=${open} setOpen=${setOpen} onRepay=${onRepay} onRefinance=${onRefinance} onRepayRecords=${() => switchSub('repay')} />`}
      ${sub === 'repay' && html`<${RepayList} repayments=${repayments} open=${open} setOpen=${setOpen} />`}
    </div>
  `;
}

/** 借款紀錄：到期日最遠的在最上面 */
function BorrowList({ loans, open, setOpen, onRepay, onRefinance, onRepayRecords }) {
  const t = COPY.records;
  const d = t.borrowDetail;
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const rows = [...loans].sort((a, b) => b.dueDate.localeCompare(a.dueDate));

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
              <${DetailRow} label=${d.startDate} value=${date(l.startDate)} />
              <${DetailRow} label=${d.amount} value=${twd(l.amount)} />
              <${DetailRow} label=${d.rate} value=${rate(l.rate)} />
              <${DetailRow} label=${d.interest} value=${twd(periodInterest(l))} />
              <${DetailRow} label=${d.fee} value=${twd(l.fee ?? LOAN_RULES.fee)} />
              <${DetailRow} label=${d.extensions} value=${`${l.extensions ?? 0}/${LOAN_RULES.maxExtensions}`} />
              <${DetailRow} label=${d.applyDate} value=${applied(l)} />
              <${DetailRow} label=${d.serial} value=${l.id} />
              <${DetailRow} label=${d.channel} value=${l.channel ?? 'APP'} />
              <div class="records-detail-buttons">
                <${Button} variant="capsule" onClick=${onRepayRecords}>${t.repayRecords}<//>
                <${Button} variant="capsule" onClick=${notAvailable}>${t.extendRecords}<//>
              </div>
            `}
            footerAlign="between"
            footer=${isDueSoon(l) &&
            html`
              <${Tag} variant="warning">${t.dueSoon}<//>
              <div class="records-row-buttons">
                ${extensionsUsed(l)
                  ? html`<${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => onRefinance(l)}>${t.refinance}<//>`
                  : html`<${Button} variant="capsule" class="btn-capsule--sm" onClick=${notAvailable}>${t.extend}<//>`}
                <${Button} variant="capsule" class="btn-capsule--sm" onClick=${() => onRepay(l)}>${t.repay}<//>
              </div>
            `}
          />
        `
      )}
    <//>
  `;
}

/** 申請日：有申請時間時顯示日期 + 時間（兩行） */
function applied(l) {
  if (!l.appliedAt) return date(l.applyDate);
  const [day, time] = dateTime(new Date(l.appliedAt)).split(' ');
  return html`<p>${day}</p><p>${time}</p>`;
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
              <${DetailRow} label=${d.appliedAt} value=${day} />
              <${DetailRow} label=${d.principal} value=${twd(r.principal)} />
              <${DetailRow} label=${d.interest} value=${twd(r.interest)} />
              <${DetailRow} label=${d.fee} value=${twd(r.fee)} />
              <${DetailRow} label=${d.bank} value=${html`<p class="t-body-regular">${r.bank.name}</p><p class="n-body-regular">${r.bank.number}</p>`} />
              <${DetailRow} label=${d.serial} value=${r.id} />
              <${DetailRow} label=${d.channel} value=${r.channel} />
            `}
          />
        `;
      })}
    <//>
  `;
}
