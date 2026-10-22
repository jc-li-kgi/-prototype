// 借新還舊 第 2 步：確認資料｜Figma 1804:118296
//   扣款資訊：扣款總額（應還利息 + 借款手續費）、扣款帳號、餘額、申請日
//   新借款契約：選取的舊借款整併成一筆
import { html, useEffect } from '../../lib/preact.js';
import { FlowPage, SectionHeader, DetailCard, DetailRow, AmountHero, Button } from '../../components/index.js';
import { useStore, refinance } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { refinancePlan, today } from '../../lib/calc.js';
import { twd, rate, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/refinance/confirm';

export function RefinanceConfirm() {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.refiDraft || {});
  const t = COPY.refinance;
  const ready = draft.loanIds?.length > 0;

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!ready) navigate('/refinance/select', { replace: true });
  }, []);
  if (!ready) return null;

  const plan = refinancePlan(account, draft.loanIds);
  const n = plan.newLoan;
  const bank = account.payoutBank;
  const overBalance = plan.total > (account.bankBalance ?? Infinity);

  const submit = () => {
    if (overBalance) return;
    const loan = refinance(draft);
    // 完成頁的「查看借款紀錄」要展開新的借款
    nextStep(PATH, { query: { loan: loan.id } });
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      actions=${html`<${Button} disabled=${overBalance} onClick=${submit}>${COPY.common.submit}<//>`}
    >
      <div class="refi-confirm">
        <section class="refi-section">
          <div class="refi-section__head"><${SectionHeader} title=${t.payTitle} /></div>
          <div class="card-stack">
            <${DetailCard}>
              <${DetailRow} label=${t.total} value=${twd(plan.total)} />
              <${DetailRow} label=${t.bankAccount} value=${html`<p class="t-body-regular">${bank.name}</p><p class="n-body-regular">${bank.number}</p>`} />
              ${account.bankBalance != null && html`<${DetailRow} label=${t.bankBalance} value=${twd(account.bankBalance)} />`}
              ${overBalance && html`<p class="t-caption-regular field__error">${t.balanceError}</p>`}
              <${DetailRow} label=${t.applyDate} value=${date(today())} />
            <//>
          </div>
        </section>

        <section class="refi-section">
          <div class="refi-section__head"><${SectionHeader} title=${t.newTitle} desc=${t.newDesc} descClass="t-caption-regular" /></div>
          <div class="card-stack">
            <${DetailCard}>
              <${AmountHero} label=${t.amount} amount=${n.amount} />
              <${DetailRow} label=${t.rate} value=${rate(n.rate)} />
              <${DetailRow} label=${t.estInterest} value=${twd(n.interest)} />
              <${DetailRow} label=${t.estFee} value=${twd(n.fee)} />
              <${DetailRow} label=${t.startDate} value=${date(n.startDate)} />
              <${DetailRow} label=${t.dueDate} value=${date(n.dueDate)} />
              <${DetailRow} label=${t.applyDate} value=${date(today())} />
              <${DetailRow} label=${t.purpose} value=${n.purpose} valueClass="t-body-regular" />
            <//>
          </div>
        </section>
      </div>
    <//>
  `;
}
