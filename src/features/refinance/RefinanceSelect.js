// 借新還舊 第 1 步：選取借款契約｜Figma 1804:117905（展開明細 1804:117906）
// 網址帶 ?loan=借款編號（從借款紀錄的「借新還舊」進來）：預設勾選這一筆
// 清單 = 近 DUE_SOON_DAYS 天內到期、且展延 2 次的借款，可一併勾選；下方總計 = 扣款總額（應還利息 + 借款手續費）
import { html, useState } from '../../lib/preact.js';
import {
  FlowPage, SummaryCard, Checkbox, SelectableItem, DetailRow, DetailPanel, ExpandButton, Button, TotalBar,
} from '../../components/index.js';
import { useStore, updateRefiDraft } from '../../store.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { LOAN_RULES, refinanceCandidates, refinanceDue, refinancePlan, accruedInterest } from '../../lib/calc.js';
import { twd, num, rate, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/refinance/select';

export function RefinanceSelect({ query }) {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.refiDraft || {});
  const t = COPY.refinance;
  const loans = refinanceCandidates(account);

  const [selected, setSelected] = useState(() => {
    const ids = draft.loanIds ?? (query.loan ? [query.loan] : []);
    return ids.filter((id) => loans.some((l) => l.id === id));
  });
  const [open, setOpen] = useState(null); // 展開明細的借款
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const plan = refinancePlan(account, selected);
  const all = loans.length > 0 && selected.length === loans.length;
  const toggle = (id, on) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)));

  const submit = () => {
    updateRefiDraft({ loanIds: selected });
    nextStep(PATH);
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      sticky=${html`
        <${TotalBar}
          label=${t.total}
          note=${t.selectedCount(selected.length)}
          value=${twd(plan.total)}
          expanded=${breakdownOpen}
          onToggle=${() => setBreakdownOpen(!breakdownOpen)}
        >
          <p class="t-body-bold c-primary">${t.breakdownTitle}</p>
          <${DetailRow} label=${t.totalInterest} value=${twd(plan.interest)} />
          <${DetailRow} label=${t.totalFee} value=${twd(plan.fee)} />
        <//>
        <${Button} disabled=${selected.length === 0} onClick=${submit}>${COPY.common.next}<//>
      `}
    >
      <div class="refi-select">
        <div class="loan-summary">
          <${SummaryCard} variant="flow" label=${t.refRate} value=${rate(LOAN_RULES.rate)} />
        </div>

        <section class="refi-group">
          <div class="refi-group__head">
            <div class="refi-group__title">
              <p class="t-subtitle-bold c-primary">${t.listTitle}</p>
              <label class="refi-all">
                <${Checkbox} checked=${all} disabled=${!loans.length} onChange=${(on) => setSelected(on ? loans.map((l) => l.id) : [])} label=${t.selectAll} />
                <span class="t-subtitle-regular c-primary" aria-hidden="true">${t.selectAll}</span>
              </label>
            </div>
            <p class="t-caption-regular c-secondary">${t.listDesc}</p>
          </div>

          <div class="refi-list">
            ${loans.map((l) => {
              const due = refinanceDue(l);
              const expanded = open === l.id;
              return html`
                <div class="card card--full refi-card">
                  <${SelectableItem} checked=${selected.includes(l.id)} onChange=${(on) => toggle(l.id, on)} label=${twd(l.balance)}>
                    <div class="refi-card__title">
                      <p class="n-subtitle-bold c-primary">${twd(l.balance)}</p>
                      <p class="t-body-regular c-secondary">${t.due(date(l.dueDate))}</p>
                    </div>
                    <div class="refi-card__rows">
                      <${DetailRow} label=${t.extensions} value=${`${l.extensions ?? 0}/${LOAN_RULES.maxExtensions}`} valueClass="n-body-bold" />
                      <${DetailRow}
                        label=${due.fee ? t.interestAndFee : t.interest}
                        value=${html`<span class="n-body-regular">TWD </span><span class="n-subtitle-bold">${num(due.total)}</span>`}
                      />
                    </div>
                    ${expanded &&
                    html`
                      <${DetailPanel} tone="blue">
                        <${DetailRow} label=${t.detail.amount} value=${twd(l.amount)} />
                        <${DetailRow} label=${t.detail.startDate} value=${date(l.startDate)} />
                        <${DetailRow} label=${t.detail.accrued} value=${twd(accruedInterest(l))} />
                        <${DetailRow} label=${t.detail.serial} value=${l.id} />
                        <${DetailRow} label=${t.detail.applyDate} value=${date(l.applyDate)} />
                        <${DetailRow} label=${t.detail.channel} value=${l.channel ?? 'APP'} />
                      <//>
                    `}
                    <${ExpandButton} class="refi-card__toggle" expanded=${expanded} onClick=${() => setOpen(expanded ? null : l.id)} />
                  <//>
                </div>
              `;
            })}
          </div>
        </section>
      </div>
    <//>
  `;
}
