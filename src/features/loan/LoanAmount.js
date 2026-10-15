// 借款：填寫借款金額
// 首次借款流程中，可借額度以「這次要匯入的擔保品」計算（尚未送出）
import { html, useState } from '../../lib/preact.js';
import { FlowPage, SummaryCard, DetailRow, InfoSheet, PickerField, AmountField, FeeCard, Button } from '../../components/index.js';
import { useStore, updateDraft } from '../../store.js';
import { flowPosition, nextStep, prevStep, flowTitle, isFlow } from '../../flows/flows.js';
import {
  LOAN_RULES, LOAN_PURPOSES, loanBalance, remainingCredit, maintenanceRatio, loanRange, clampAmount, interestFor,
  collateralValue, withPendingCollateral,
} from '../../lib/calc.js';
import { twd, pct, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/loan/amount';
const DEFAULT_AMOUNT = 20000;

export function LoanAmount() {
  const firstLoan = isFlow('newAccountLoan');
  const account = useStore((s) => (firstLoan ? withPendingCollateral(s.account, s.collateralDraft.selected) : s.account));
  const draft = useStore((s) => s.draft);
  const t = COPY.loan;
  const range = loanRange(account);

  const [amount, setAmount] = useState(clampAmount(draft.amount ?? DEFAULT_AMOUNT, range));
  const [purpose, setPurpose] = useState(draft.purpose ?? '');
  const [purposeError, setPurposeError] = useState(false);
  const [info, setInfo] = useState(null);

  const choosePurpose = (p) => {
    setPurpose(p);
    setPurposeError(false);
  };

  const submit = () => {
    if (!purpose) {
      setPurposeError(true);
      return;
    }
    updateDraft({ amount, purpose });
    nextStep(PATH);
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      actions=${html`<${Button} onClick=${submit}>${COPY.common.next}<//>`}
    >
      <div class="loan-summary">
        ${firstLoan
          ? html`<${SummaryCard}
              variant="flow"
              label=${t.remaining}
              value=${twd(remainingCredit(account))}
              rows=${[[t.pendingCollateralValue, twd(collateralValue(account))]]}
            />`
          : html`<${SummaryCard}
              variant="flow"
              label=${t.ratio}
              value=${pct(maintenanceRatio(account))}
              rows=${[
                [t.remaining, twd(remainingCredit(account))],
                [t.borrowed, twd(loanBalance(account))],
              ]}
            />`}
      </div>

      <div class="loan-cards">
        <section class="card card--full loan-form">
          <${PickerField}
            label=${t.purpose}
            placeholder=${t.purposePlaceholder}
            value=${purpose}
            options=${LOAN_PURPOSES}
            onChange=${choosePurpose}
            error=${purposeError && t.purposeError}
          />

          <${AmountField}
            label=${t.amount}
            prefix="TWD"
            value=${amount}
            onChange=${setAmount}
            ...${range}
            action=${{ label: t.limitLink, onClick: () => setInfo(t.limitSheet) }}
            hints=${[t.rangeHint(num(range.min), num(range.max)), t.stepHint(num(range.step))]}
          />

          <${DetailRow}
            label=${t.ratioAfter}
            labelClass="t-body-bold c-primary"
            value=${pct(maintenanceRatio(account, amount))}
            valueClass="n-subtitle-bold"
            info=${t.ratioSheet}
          />
        </section>

        <${FeeCard}
          full
          title=${t.feeTitle}
          rows=${[
            { label: t.refRate, value: `${+(LOAN_RULES.rate * 100).toFixed(2)}%` },
            { label: t.halfYearInterest, value: twd(interestFor(amount)) },
            { label: t.fee, value: twd(LOAN_RULES.fee), info: t.feeSheet },
          ]}
          note=${t.feeNote}
        />
      </div>

      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    <//>
  `;
}
