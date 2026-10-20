// 現金還款 第 1 步：輸入還款金額｜Figma 1804:117306
//   部分：預設帶入即將到期金額，可用 − ＋ 調整
//   全部：帶入全部借款金額，金額鎖定
// 網址帶 ?loan=借款編號（從借款紀錄的「還款」進來）
import { html, useState } from '../../lib/preact.js';
import { FlowPage, SummaryCard, DetailRow, RadioGroup, AmountField, Button } from '../../components/index.js';
import { useStore, updateRepayDraft } from '../../store.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { loanBalance, maintenanceRatio, isDueSoon, repayPlan, repayRange, clampAmount } from '../../lib/calc.js';
import { twd, pct, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/repay/amount';

export function RepayAmount({ query }) {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.repayDraft || {});
  const t = COPY.repay;

  const total = loanBalance(account);
  const range = repayRange(account);
  const dueSoon = account.loans.filter(isDueSoon).reduce((sum, l) => sum + l.balance, 0);
  const loanId = draft.loanId ?? query.loan ?? account.loans.find(isDueSoon)?.id;
  const partialDefault = clampAmount(dueSoon || range.min, range);

  const [mode, setMode] = useState(draft.mode ?? 'partial');
  const [partial, setPartial] = useState(draft.mode === 'partial' && draft.principal ? draft.principal : partialDefault);
  const principal = mode === 'full' ? total : partial;
  const plan = repayPlan(account, principal);
  const overBalance = plan.total > (account.bankBalance ?? Infinity);
  const bank = account.payoutBank;

  const submit = () => {
    if (overBalance) return;
    updateRepayDraft({ loanId, mode, principal });
    nextStep(PATH);
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      actions=${html`<${Button} disabled=${overBalance} onClick=${submit}>${COPY.common.next}<//>`}
    >
      <div class="loan-summary">
        <${SummaryCard}
          variant="flow"
          label=${t.ratio}
          value=${pct(maintenanceRatio(account))}
          rows=${[
            [t.borrowed, twd(total)],
            ...(dueSoon ? [[t.dueSoonAmount, twd(dueSoon), 'warning']] : []),
          ]}
        />
      </div>

      <section class="card card--full loan-form">
        <${RadioGroup} label=${t.modeTitle} options=${t.modes} value=${mode} onChange=${setMode} />

        <${AmountField}
          label=${t.principal}
          prefix="TWD"
          value=${principal}
          onChange=${setPartial}
          ...${range}
          disabled=${mode === 'full'}
          hints=${dueSoon ? [t.suggestHint(num(dueSoon))] : []}
        />

        <${DetailRow}
          label=${t.ratioAfter}
          labelClass="t-body-bold c-primary"
          value=${pct(maintenanceRatio(account, -principal))}
          valueClass="n-subtitle-bold"
          info=${t.ratioSheet}
        />

        <div class="repay-breakdown">
          <${DetailRow} label=${t.interest} value=${twd(plan.interest)} />
          <${DetailRow} label=${t.fee} value=${twd(plan.fee)} />
          <${DetailRow} label=${t.total} value=${twd(plan.total)} />
          <${DetailRow} label=${t.bankAccount} value=${html`<p class="t-body-regular">${bank.name}</p><p class="n-body-regular">${bank.number}</p>`} />
          ${account.bankBalance != null &&
          html`<${DetailRow} label=${t.bankBalance} value=${twd(account.bankBalance)} />`}
          ${overBalance && html`<p class="t-caption-regular field__error">${t.balanceError}</p>`}
        </div>
      </section>
    <//>
  `;
}
