// 借款：確認資料
// 首次借款流程中，同時列出要匯入的擔保品，按確認時一起送出
import { html, useEffect } from '../../lib/preact.js';
import { FlowPage, DetailCard, DetailRow, Button, AmountHero, CollapsibleCard } from '../../components/index.js';
import { useStore, borrow, firstLoan } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep, flowTitle, isFlow } from '../../flows/flows.js';
import { LOAN_RULES, interestFor, today, addMonths, stockOf } from '../../lib/calc.js';
import { twd, rate, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/loan/confirm';

export function LoanConfirm() {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.draft);
  const selected = useStore((s) => s.collateralDraft.selected || {});
  const t = COPY.loan;
  const isFirstLoan = isFlow('newAccountLoan');
  const items = Object.entries(selected).map(([code, lots]) => ({ code, lots }));

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!draft.amount) navigate('/loan/amount', { replace: true });
  }, []);
  if (!draft.amount) return null;

  const start = today();
  const bank = account.payoutBank;

  const submit = () => {
    if (isFirstLoan) firstLoan(items, draft);
    else borrow(draft);
    nextStep(PATH);
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      actionsClass="confirm-actions"
      actions=${html`<${Button} class="confirm-actions__btn" onClick=${submit}>${COPY.common.confirm}<//>`}
    >
      <div class="card-stack">
        <${DetailCard}>
          <${AmountHero} label=${t.amount} amount=${draft.amount} />

          <${DetailRow} label=${t.refRate} value=${rate(LOAN_RULES.rate)} />
          <${DetailRow} label=${t.estInterest} value=${twd(interestFor(draft.amount))} />
          <${DetailRow} label=${t.fee} value=${twd(LOAN_RULES.fee)} />
          <${DetailRow} label=${t.startDate} value=${date(start)} />
          <${DetailRow} label=${t.dueDate} value=${date(addMonths(start, LOAN_RULES.termMonths))} />
          <${DetailRow} label=${t.applyDate} value=${date(start)} />
          <${DetailRow} label=${t.purpose} value=${draft.purpose} valueClass="t-body-regular" />
          <${DetailRow} label=${t.payout} value=${html`<p class="t-body-regular">${bank.name}</p><p class="n-body-regular">${bank.number}</p>`} />
        <//>

        ${isFirstLoan &&
        html`
          <${CollapsibleCard} title=${COPY.collateral.detailTitle}>
            ${items.map(
              (i) => html`
                <${DetailRow}
                  label=${`${stockOf(i.code).name} ${i.code}`}
                  value=${`${i.lots} ${COPY.collateral.lotUnit}`}
                  valueClass="t-body-regular"
                />
              `
            )}
          <//>
        `}
      </div>
    <//>
  `;
}
