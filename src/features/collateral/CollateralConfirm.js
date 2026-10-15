// 匯入擔保品 第 2 步：確認資料
import { html, useEffect } from '../../lib/preact.js';
import { FlowPage, DetailCard, DetailRow, Button, AmountHero, CollapsibleCard } from '../../components/index.js';
import { useStore, pledgeCollateral } from '../../store.js';
import { navigate } from '../../router.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { stockOf, loanableOf, marketValueOf, today } from '../../lib/calc.js';
import { twd, date } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/collateral-in/confirm';

export function CollateralConfirm() {
  const draft = useStore((s) => s.collateralDraft);
  const t = COPY.collateral;
  const items = Object.entries(draft.selected || {}).map(([code, lots]) => ({ code, lots }));

  // 沒有草稿（例如直接開網址）就回第 1 步
  useEffect(() => {
    if (!items.length) navigate('/collateral-in/select', { replace: true });
  }, []);
  if (!items.length) return null;

  const submit = () => {
    pledgeCollateral(items);
    nextStep(PATH);
  };

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      actions=${html`<${Button} onClick=${submit}>${t.submit}<//>`}
    >
      <div class="card-stack">
        <${DetailCard}>
          <${AmountHero} label=${t.total} amount=${loanableOf(items)} />
          <${DetailRow} label=${t.marketValue} value=${twd(marketValueOf(items))} />
          <${DetailRow} label=${t.importDate} value=${date(today())} />
          <${DetailRow} label=${t.channel} value=${t.channelValue} />
        <//>

        <${CollapsibleCard} title=${t.detailTitle}>
          ${items.map(
            (i) => html`
              <${DetailRow}
                label=${`${stockOf(i.code).name} ${i.code}`}
                value=${`${i.lots} ${t.lotUnit}`}
                valueClass="t-body-regular"
              />
            `
          )}
        <//>
      </div>
    <//>
  `;
}
