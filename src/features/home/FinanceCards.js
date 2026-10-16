// 帳務總覽卡片（橫向滑動）｜Figma：證券主頁 › 總覽 › card list › Finance Card_Mobile
// 第一張「台股庫存總市值」由情境持股計算，其餘用 mock/home.js 的固定數字
import { html, useState } from '../../lib/preact.js';
import { Icon } from '../../components/index.js';
import { useStore, showToast } from '../../store.js';
import { marketValueOf } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';
import { TW_PROFIT_RATE, OTHER_FINANCE_CARDS } from '../../mock/home.js';

export function FinanceCards() {
  const account = useStore((s) => s.account);
  const t = COPY.home;
  const twValue = marketValueOf([...account.holdings, ...account.collateral]);
  const cards = [
    {
      label: t.twStockValue,
      value: twValue,
      profit: Math.round((twValue * TW_PROFIT_RATE) / (1 + TW_PROFIT_RATE)),
      rate: TW_PROFIT_RATE,
      ad: t.twAd,
      badge: 'account-sec.svg',
    },
    ...OTHER_FINANCE_CARDS,
  ];

  return html`
    <div class="finance-cards">
      ${cards.map((c) => html`<${FinanceCard} card=${c} accountId=${account.id} />`)}
    </div>
  `;
}

function FinanceCard({ card, accountId }) {
  const [hidden, setHidden] = useState(false);
  const notAvailable = () => showToast(COPY.common.notAvailable);
  const up = card.profit >= 0;
  const sign = up ? '+' : '-';
  const masked = '*****';

  return html`
    <article class="finance-card">
      <div class="finance-card__body">
        <div class="finance-card__top">
          <button class="finance-card__account" onClick=${notAvailable}>
            <span class="finance-card__badge"><${Icon} name=${card.badge} size=${15} /></span>
            <span class="n-subtitle-regular">${accountId}</span>
            <${Icon} name="chevron-pull-white.svg" size=${16} />
          </button>
          <button class="finance-card__expand" onClick=${notAvailable} aria-label="展開">
            <${Icon} name="expand.svg" />
          </button>
        </div>

        <div class="finance-card__asset">
          <div class="finance-card__value">
            <p class="t-caption-regular">${card.label}</p>
            <div class="finance-card__amount">
              <span class="n-subtitle-bold">TWD</span>
              <span class="n-title finance-card__number">${hidden ? masked : num(card.value)}</span>
              <button onClick=${() => setHidden(!hidden)} aria-label=${hidden ? '顯示金額' : '隱藏金額'}>
                <${Icon} name="eye-show.svg" />
              </button>
            </div>
          </div>
          <div class="finance-card__profit">
            <span class="t-caption-regular">${COPY.home.profit}</span>
            <span class=${'n-body-bold finance-card__change ' + (up ? 'c-ascend' : 'c-descend')}>
              <span class=${'finance-card__triangle' + (up ? '' : ' finance-card__triangle--down')}>
                <${Icon} name="ascend-triangle.svg" size=${16} tint />
              </span>
              ${hidden ? masked : `TWD ${num(Math.abs(card.profit))}`}
              <span>${sign}${(Math.abs(card.rate) * 100).toFixed(2)}%</span>
            </span>
          </div>
        </div>
      </div>

      <button class="finance-card__ad" onClick=${notAvailable}>
        <${Icon} name="invest.svg" />
        <span class="t-body-regular c-primary">${card.ad}</span>
        <${Icon} name="chevron-forward-24.svg" />
      </button>
    </article>
  `;
}
