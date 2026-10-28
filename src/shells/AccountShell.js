// 入口一：證券主頁 → 帳務 →「授信管理」頁籤
//   已借款：摘要卡 + 更多服務
//   尚未借款（account.opened = false）：方案卡 + 認識並開立借貸戶
import { html, useRef, useEffect, useState } from '../lib/preact.js';
import { Icon, BottomNav, AccountPicker, TextTabs, SectionHeader, ServiceCardList } from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { startFlow } from '../flows/flows.js';
import { dateTime } from '../lib/format.js';
import { COPY } from '../content/copy.js';
import { LendingSummaryCard } from '../features/hub/LendingSummaryCard.js';
import { MoreServices } from '../features/hub/MoreServices.js';
import { LoanIntroCard } from '../features/hub/LoanIntroCard.js';
import { DueSoonNotice } from '../features/hub/DueSoonNotice.js';
import { IntroSheet } from '../features/intro/IntroSheet.js';

export function AccountShell() {
  const account = useStore((s) => s.account);
  const t = COPY.account;
  const tabsRef = useRef();
  const notAvailable = () => showToast(COPY.common.notAvailable);

  // 產品頁籤捲到最右邊，讓「授信管理」露出（同 Figma）
  useEffect(() => {
    const el = tabsRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return html`
    <div class="page account-page">
      <div>
        <header class="account-header">
          <p class="t-headline c-primary account-header__title">${t.title}</p>
          <button class="icon-btn" onClick=${notAvailable} aria-label="帳戶資訊"><${Icon} name="account-info.svg" /></button>
          <button class="icon-btn" onClick=${notAvailable} aria-label="客服"><${Icon} name="customer-service.svg" /></button>
        </header>

        <div class="product-tabs" ref=${tabsRef}>
          ${t.productTabs.map((tab) =>
            tab === '授信管理'
              ? html`<span class="product-tabs__item product-tabs__item--active t-body-regular">${tab}</span>`
              : html`<button class="product-tabs__item t-body-regular" onClick=${notAvailable}>${tab}</button>`
          )}
        </div>
      </div>

      <main class="account-content">
        <div class="account-overview">
          <div class="account-overview__meta">
            <div class="account-overview__picker">
              <${AccountPicker} account=${account} onClick=${notAvailable} />
            </div>

            <${TextTabs}
              tabs=${t.creditTabs.map((label, i) => ({ key: i, label }))}
              active=${0}
              onChange=${notAvailable}
            />

            ${account.opened &&
            html`<p class="t-caption-regular c-secondary account-overview__time">${t.updatedAt} ${dateTime()}</p>`}
          </div>

          <div class="account-overview__card">
            ${account.opened ? html`<${LendingSummaryCard} />` : html`<${LoanIntroCard} />`}
          </div>

          ${account.opened && html`<div class="account-overview__card"><${DueSoonNotice} back="/account" /></div>`}
        </div>

        ${account.opened ? html`<${MoreServices} />` : html`<${IntroServices} />`}
      </main>

      <${BottomNav} active="account" />
    </div>
  `;
}

/** 尚未借款：認識並開立借貸戶 */
function IntroServices() {
  const t = COPY.hub;
  const [learn, borrow] = t.introServices;
  const [introOpen, setIntroOpen] = useState(false);
  return html`
    <section class="account-intro-services">
      <${SectionHeader} title=${t.introSection} />
      <${ServiceCardList}
        items=${[
          { icon: 'service-learn.png', ...learn, onClick: () => setIntroOpen(true) },
          { icon: 'service-borrow.png', ...borrow, onClick: () => startFlow('newAccountLoan') },
        ]}
      />
      <${IntroSheet}
        open=${introOpen}
        onClose=${() => setIntroOpen(false)}
        onSimulate=${() => { setIntroOpen(false); navigate('/lending-zone?tab=simulate'); }}
      />
    </section>
  `;
}
