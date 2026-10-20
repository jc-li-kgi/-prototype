// 現金還款 第 2 步：確認資料｜Figma 1804:117858
import { html, useEffect } from '../../lib/preact.js';
import { FlowPage, DetailCard, DetailRow, Button, AmountHero } from '../../components/index.js';
import { useStore, repay } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { repayPlan, today } from '../../lib/calc.js';
import { twd, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/repay/confirm';

export function RepayConfirm() {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.repayDraft || {});
  const t = COPY.repay;

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!draft.principal) navigate('/repay/amount', { replace: true });
  }, []);
  if (!draft.principal) return null;

  const plan = repayPlan(account, draft.principal);
  const loan = account.loans.find((l) => l.id === draft.loanId);
  const bank = account.payoutBank;

  const submit = () => {
    const record = repay(draft);
    // 完成頁的「查看還款紀錄」要展開這一筆
    nextStep(PATH, { query: { record: record.id } });
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      sticky=${html`<${Button} onClick=${submit}>${t.submit}<//>`}
      stickyPlain
    >
      <div class="card-stack">
        <${DetailCard}>
          <${AmountHero} label=${t.total} amount=${plan.total} />
          <${DetailRow} label=${t.principal} value=${twd(plan.principal)} />
          <${DetailRow} label=${t.interest} value=${twd(plan.interest)} />
          <${DetailRow} label=${t.fee} value=${twd(plan.fee)} />
          <${DetailRow} label=${t.applyDate} value=${date(today())} />
          ${loan && html`<${DetailRow} label=${t.purpose} value=${loan.purpose} valueClass="t-body-regular" />`}
          <${DetailRow} label=${t.bankAccount} value=${html`<p class="t-body-regular">${bank.name}</p><p class="n-body-regular">${bank.number}</p>`} />
        <//>
      </div>
    <//>
  `;
}
