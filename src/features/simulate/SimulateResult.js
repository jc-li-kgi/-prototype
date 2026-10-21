// 可借貸額度試算結果｜Figma 2631:58837（收合）、2631:57852（追繳風險評估展開）、3131:186975（預期匯入擔保品展開）
// 情境：資訊瀏覽；下方兩張卡片預設收合
import { html, useEffect } from '../../lib/preact.js';
import { PageHeader, InfoLabel, AmountHero, DetailRow, CollapsibleCard, Button, BottomActions } from '../../components/index.js';
import { useStore, updateCollateralDraft } from '../../store.js';
import { navigate } from '../../router.js';
import { startFlow } from '../../flows/flows.js';
import { LOAN_RULES, simulate, stockOf } from '../../lib/calc.js';
import { num, twd } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';
import { canSimulate } from './SimulateForm.js';
import { RatioChart } from './RatioChart.js';

export function SimulateResult() {
  const t = COPY.simulate;
  const account = useStore((s) => s.account);
  const items = useStore((s) => (s.simDraft?.items || []).filter((i) => i.code && i.lots > 0));
  const back = () => navigate('/lending-zone?tab=simulate', { replace: true });

  // 沒有試算資料（例如直接開網址）就回專區試算頁籤
  useEffect(() => {
    if (!canSimulate(items)) back();
  }, []);
  if (!canSimulate(items)) return null;

  const r = simulate(items);

  // 立即借貸：未借款 → 首次借款（預先勾選有庫存的試算標的）；已借款 → 再借一筆
  const borrow = () => {
    if (account.opened) return startFlow('existingLoan');
    startFlow('newAccountLoan');
    const selected = {};
    items.forEach((i) => {
      const held = account.holdings.find((h) => h.code === i.code)?.lots ?? 0;
      if (held) selected[i.code] = Math.min(i.lots, held);
    });
    updateCollateralDraft({ selected });
  };

  return html`
    <div class="page sim-result">
      <${PageHeader} title=${t.resultTitle} onBack=${back} showShare=${false} />

      <main class="sim-result__content">
        <section class="card card--shadow sim-summary">
          <${InfoLabel} label=${t.loanable} labelClass="t-subtitle-bold" class="c-primary" info=${t.loanableSheet} />
          <${AmountHero} amount=${r.loan} currencyName=${t.currencyName} />
          <${DetailRow} label=${t.maxTerm} value=${t.maxTermValue(LOAN_RULES.maxTermMonths)} valueClass="t-body-bold" />
          <${DetailRow} label=${t.dailyInterest} info=${t.dailyInterestSheet} value=${twd(r.dailyInterest)} valueClass="n-body-bold" />
        </section>

        <${CollapsibleCard} title=${t.riskTitle} defaultOpen=${false} variant="overview">
          <div class="sim-risk">
            <div class="sim-risk__ratio">
              <p class="t-body-regular c-primary">${t.initialRatio}</p>
              <p class="n-display-s c-primary">${Math.floor(r.ratio)}%</p>
            </div>
            <div class="sim-risk__call">
              <p class="t-body-regular c-secondary">
                ${t.callDrop} <span class="c-descend nowrap">${twd(r.callDropValue)}( -${Math.round(r.callDrop * 100)}% )</span>
              </p>
              <p class="t-body-regular c-warning">
                ${t.callRepay} <span class="nowrap">${twd(r.repayOnCall)}</span>
              </p>
            </div>
            <${RatioChart} ratio=${r.ratio} />
            <p class="t-caption-regular c-secondary">${t.riskNote}</p>
          </div>
        <//>

        <${CollapsibleCard} title=${t.itemsTitle} defaultOpen=${false} variant="overview">
          ${items.map(
            (i) => html`<${DetailRow} label=${`${stockOf(i.code).name} ${i.code}`} value=${`${num(i.lots)} ${t.lotUnit}`} valueClass="t-body-regular" />`
          )}
        <//>

        <p class="sim-result__note t-body-regular c-secondary">${t.note}</p>
      </main>

      <${BottomActions}>
        <${Button} onClick=${borrow}>${t.borrow}<//>
      <//>
    </div>
  `;
}
