// 證券主頁「我的」（總覽）：所有任務的起點
//   快捷功能「股票借貸」→ 股票借貸專區；底部導覽「帳務」→ 帳務 › 授信管理
//   只做到快捷功能，下方的行事曆、自選、市場日曆、新聞不在測試範圍
import { html } from '../lib/preact.js';
import { Icon, BottomNav, SectionHeader } from '../components/index.js';
import { showToast } from '../store.js';
import { dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { MARKET_INDEX } from '../mock/home.js';
import { FinanceCards } from '../features/home/FinanceCards.js';
import { Shortcuts } from '../features/home/Shortcuts.js';

export function HomeShell() {
  const t = COPY.home;
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const up = MARKET_INDEX.change >= 0;

  return html`
    <div class="page home-page">
      <header class="home-header">
        <button class="icon-btn" onClick=${notAvailable} aria-label="AI 助理"><${Icon} name="ai-chat.svg" /></button>
        <button class="home-search" onClick=${notAvailable}>
          <${Icon} name="search.svg" />
          <span class="t-body-regular c-tertiary home-search__text">${t.searchPlaceholder}</span>
        </button>
        <button class="home-version" onClick=${notAvailable}>
          <span class="t-body-regular c-secondary">${t.newVersion}</span>
          <${Icon} name="toggle-on.svg" width=${36} height=${24} />
        </button>
        <button class="icon-btn" onClick=${notAvailable} aria-label="通知"><${Icon} name="home-notification.svg" /></button>
      </header>

      <main class="home-content">
        <div class="home-overview">
          <button class="home-index" onClick=${notAvailable}>
            <span class="t-caption-regular c-primary">${MARKET_INDEX.name}</span>
            <span class=${'n-body-bold ' + (up ? 'c-ascend' : 'c-descend')}>${MARKET_INDEX.value.toFixed(2)}</span>
            <span class=${'home-index__change n-body-bold ' + (up ? 'c-ascend' : 'c-descend')}>
              <${Icon} name="ascend-triangle.svg" size=${16} tint />${Math.abs(MARKET_INDEX.change).toFixed(2)}
            </span>
            <span class="home-index__toggle"><${Icon} name="chevron-down.svg" /></span>
          </button>

          <div class="home-overview__head">
            <${SectionHeader} title=${t.overviewTitle} action=${{ label: t.edit, onClick: notAvailable }} />
          </div>
          <div class="home-overview__time">
            <span class="t-caption-regular c-secondary">${COPY.account.updatedAt} ${dateTime()}</span>
            <button onClick=${notAvailable} aria-label="重新整理"><${Icon} name="refresh.svg" level="caption" /></button>
          </div>
          <${FinanceCards} />
        </div>

        <${Shortcuts} />
      </main>

      <${BottomNav} active="mine" />
    </div>
  `;
}
