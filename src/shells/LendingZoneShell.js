// 入口二：股票借貸專區
// 證券主頁 → 股票借貸專區；或 帳務 › 授信管理 ›「前往專區」
//   尚未借款（account.opened = false）→ 專區初始頁：可借額度試算 + 庫存精選擔保品 + 馬上借貸一筆
//   已借款                          → 專區總覽：摘要卡 + 快捷功能 + 尚可匯入擔保品
import { html, useState } from '../lib/preact.js';
import {
  Icon, SegmentedTabs, SectionHeader, StatGroup, NoticeBar, Carousel, StockPickCard, Button, StickyFooter,
} from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { startFlow } from '../flows/flows.js';
import { groupHoldings, importablePotential, perLotLoan, stockOf, dailyInterest } from '../lib/calc.js';
import { twd, wan, num, dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { QuickActions } from '../features/hub/QuickActions.js';
import { HoldingsTable } from '../features/collateral/HoldingsTable.js';

export function LendingZoneShell() {
  const account = useStore((s) => s.account);
  const t = COPY.zone;
  const [tab, setTab] = useState('overview');
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const switchTab = (key) => (key === 'overview' ? setTab(key) : notAvailable());

  return html`
    <div class="page zone-page">
      <header class="zone-header">
        <button class="icon-btn page-header__slot" onClick=${() => navigate('/account')} aria-label="返回">
          <${Icon} name="chevron-back.svg" />
        </button>
        <button class="icon-btn page-header__slot" onClick=${notAvailable} aria-label="產品說明">
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
            <${SegmentedTabs} tabs=${t.tabs} active=${tab} onChange=${switchTab} />
          </div>
        </div>

        ${account.opened ? html`<${ZoneOverview} account=${account} />` : html`<${ZoneIntro} account=${account} />`}
      </div>
    </div>
  `;
}

/** 已借款：專區總覽 */
function ZoneOverview({ account }) {
  const t = COPY.zone;
  return html`
    <div class="zone-overview">
      <p class="t-caption-regular c-secondary">${COPY.account.updatedAt} ${dateTime()}</p>
      <${LendingSummaryCard} variant="zone" />
    </div>

    <${QuickActions} />

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
  const potential = importablePotential(account);
  const picks = [...groupHoldings(account).eligible]
    .map((h) => ({ ...h, loanable: h.lots * perLotLoan(h.code) }))
    .sort((a, b) => b.loanable - a.loanable);

  const borrow = (code) => startFlow('newAccountLoan', code ? { query: { code } } : undefined);

  return html`
    <section class="card zone-intro">
      <p class="t-subtitle-bold c-primary">${t.introTitle}</p>
      <${StatGroup}
        items=${[
          { label: t.introLoanable, value: wan(potential), unit: t.wan, highlight: true },
          { label: t.introDailyInterest, value: num(dailyInterest(potential)), unit: 'TWD' },
        ]}
      />
      <${NoticeBar}>${t.introNotice}<//>
    </section>

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
              onClick=${() => borrow(p.code)}
            />
          `
        )}
      <//>
    </section>

    <${StickyFooter} plain>
      <${Button} onClick=${() => borrow()}>${t.borrowNow}<//>
    <//>
  `;
}
