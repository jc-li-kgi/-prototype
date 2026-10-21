// 確認頁大金額（標題 + 幣別 + 大數字）｜Figma：detail content › currency & flag / amount
import { html } from '../../lib/preact.js';
import { num } from '../../lib/format.js';

/**
 * <AmountHero label="借款金額" amount=${20000} />
 */
export function AmountHero({ label, amount, currency = 'TWD', currencyName = '臺幣', flag = 'flag-twd.png' }) {
  return html`
    <div class="amount-hero">
      ${label && html`<p class="t-body-regular c-secondary">${label}</p>`}
      <div class="amount-hero__currency">
        <img class="amount-hero__flag" src=${`assets/icons/${flag}`} width="16" height="16" alt="" />
        <span class="n-body-regular">${currency}</span>
        <span class="t-body-regular">${currencyName}</span>
      </div>
      <p class="n-display-s amount-hero__value">${num(amount)}</p>
    </div>
  `;
}
