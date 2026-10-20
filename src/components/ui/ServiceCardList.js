// 服務卡片清單（圖示 + 標題 + 說明 + 前往箭頭）｜Figma：📱 Service Card - Onboarding / Function List
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <ServiceCardList items=${[
 *   { icon: 'service-learn.png', title: '認識股票借貸', desc: '瀏覽實際案例、試算以及常見問題', onClick },
 *   { icon: 'service-borrow.png', title: '馬上借貸一筆', desc: '匯入擔保品與借款一次完成', onClick },
 * ]} />
 * icon 為彩色插圖（36px），不換色
 */
export function ServiceCardList({ items }) {
  return html`
    <div class="card service-list">
      ${items.map(
        (s) => html`
          <button class="service-card" onClick=${s.onClick}>
            <img class="service-card__icon" src=${`assets/icons/${s.icon}`} width="36" height="36" alt="" />
            <span class="service-card__text">
              <span class="service-card__title">
                <span class="t-subtitle-bold c-primary">${s.title}</span>
                <${Icon} name="chevron-forward-24.svg" level="subtitle" />
              </span>
              ${s.desc && html`<span class="t-caption-regular c-secondary">${s.desc}</span>`}
            </span>
          </button>
        `
      )}
    </div>
  `;
}
