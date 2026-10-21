// 入口二：股票借貸專區
// 證券主頁 › 快捷功能「股票借貸」→ 股票借貸專區（返回回到主頁）；或 帳務 › 授信管理 ›「前往專區」
//   尚未借款（account.opened = false）→ 專區初始頁：可借額度試算 + 庫存精選擔保品 + 馬上借貸一筆
//   已借款                          → 專區總覽：摘要卡 + 快捷功能 + 尚可匯入擔保品
import { html, useState, useEffect } from '../lib/preact.js';
import {
  Icon, SegmentedTabs, SectionHeader, Carousel, StockPickCard, Button, BottomActions,
} from '../components/index.js';
import { useStore, showToast, markIntroShown } from '../store.js';
import { navigate } from '../router.js';
import { startFlow } from '../flows/flows.js';
import { groupHoldings, importablePotential, perLotLoan, stockOf, dailyInterest } from '../lib/calc.js';
import { twd, wan, num, dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { LoanIntroCard } from '../features/hub/LoanIntroCard.js';
import { QuickActions } from '../features/hub/QuickActions.js';
import { RepayMethodSheet } from '../features/repay/RepayMethodSheet.js';
import { IntroSheet } from '../features/intro/IntroSheet.js';
import { SimulateForm, simItems, canSimulate } from '../features/simulate/SimulateForm.js';
import { HoldingsTable } from '../features/collateral/HoldingsTable.js';

// 庫存精選擔保品：取可借金額最高的前幾檔
const PICKS_COUNT = 3;

export function LendingZoneShell({ query }) {
  const account = useStore((s) => s.account);
  const simDraft = useStore((s) => s.simDraft);
  const t = COPY.zone;
  // 頁籤：總覽 / 試算（試算結果頁返回時帶 ?tab=simulate）
  const [tab, setTab] = useState(query.tab === 'simulate' ? 'simulate' : 'overview');
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const simulating = tab === 'simulate';
  const showActions = simulating || !account.opened;

  // 介紹頁：未借款第一次進專區自動從底部開啟；右上「產品說明」也可以打開
  const introShown = useStore((s) => s.introShown);
  const [introOpen, setIntroOpen] = useState(false);
  useEffect(() => {
    if (!account.opened && !introShown) {
      setIntroOpen(true);
      markIntroShown();
    }
  }, []);

  return html`
    <div class=${'page zone-page' + (showActions ? ' zone-page--with-actions' : '')}>
      <header class="zone-header">
        <button class="icon-btn page-header__slot" onClick=${() => navigate('/home')} aria-label="返回">
          <${Icon} name="chevron-back.svg" />
        </button>
        <button class="icon-btn page-header__slot" onClick=${() => setIntroOpen(true)} aria-label="產品說明">
          <${Icon} name="book-info.svg" />
        </button>
      </header>

      <div class="zone-content">
        <div class="zone-top">
          <section class="zone-hero">
            <div class="zone-hero__text">
              <h1 class="t-title c-primary">${t.heroTitle}</h1>
              <p class="t-body-regular c-secondary">${t.heroDesc}</p>
            </div>
            <img class="zone-hero__image" src="assets/illustrations/lending-hero.png" width="80" height="80" alt="" />
          </section>
          <div class="zone-tabs">
            <${SegmentedTabs} tabs=${t.tabs} active=${tab} onChange=${setTab} />
          </div>
        </div>

        ${simulating
          ? html`<${SimulateForm} />`
          : account.opened
          ? html`<${ZoneOverview} account=${account} />`
          : html`<${ZoneIntro} account=${account} />`}
      </div>

      ${simulating &&
      html`
        <${BottomActions}>
          <${Button} disabled=${!canSimulate(simItems(simDraft))} onClick=${() => navigate('/simulate/result')}>${COPY.simulate.submit}<//>
        <//>
      `}
      ${!simulating &&
      !account.opened &&
      html`
        <${BottomActions}>
          <${Button} onClick=${() => startFlow('newAccountLoan')}>${t.borrowNow}<//>
        <//>
      `}
      <${IntroSheet} open=${introOpen} onClose=${() => setIntroOpen(false)} />
    </div>
  `;
}

/** 已借款：專區總覽 */
function ZoneOverview({ account }) {
  const t = COPY.zone;
  const [repayOpen, setRepayOpen] = useState(false);
  return html`
    <div class="zone-overview">
      <p class="t-caption-regular c-secondary">${COPY.account.updatedAt} ${dateTime()}</p>
      <${LendingSummaryCard} variant="zone" />
    </div>

    <${QuickActions} onRepay=${() => setRepayOpen(true)} />
    <${RepayMethodSheet} open=${repayOpen} onClose=${() => setRepayOpen(false)} />

    <section class="zone-importable">
      <div class="zone-section-head">
        <${SectionHeader}
          title=${t.importableTitle}
          action=${{ label: t.viewAll, onClick: () => navigate('/records?tab=collateral&sub=unpledged') }}
          desc=${html`${t.importableHint} <span class="n-body-bold c-primary">${twd(importablePotential(account))}</span>`}
        />
      </div>
      <${HoldingsTable} holdings=${groupHoldings(account).eligible} limit=${4} />
    </section>
  `;
}

/** 尚未借款：專區初始頁 */
function ZoneIntro({ account }) {
  const t = COPY.zone;
  const picks = [...groupHoldings(account).eligible]
    .map((h) => ({ ...h, loanable: h.lots * perLotLoan(h.code) }))
    .sort((a, b) => b.loanable - a.loanable)
    .slice(0, PICKS_COUNT);

  return html`
    <div class="zone-intro">
      <${LoanIntroCard} />
    </div>

    <section class="zone-picks">
      <div class="zone-section-head">
        <${SectionHeader} title=${t.picksTitle} />
      </div>
      <${Carousel} label=${t.picksTitle}>
        ${picks.map(
          (p) => html`
            <${StockPickCard}
              name=${stockOf(p.code).name}
              code=${p.code}
              stats=${[
                { label: t.pickLoanable, value: wan(p.loanable), unit: t.wan, highlight: true },
                { label: t.introDailyInterest, value: num(dailyInterest(p.loanable)), unit: 'TWD' },
              ]}
            />
          `
        )}
      <//>
    </section>

  `;
}
