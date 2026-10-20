// 底部導覽｜Figma：B_Navi
// 「我的」→ 證券主頁、「帳務」→ 帳務 › 授信管理，其他未開放
// icon 一律用 tint，顏色跟著文字：選取 = content active，未選取 = primary 透明度 40%
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

const FundIcon = () => html`
  <span class="nav-fund">
    <span class="nav-fund__bar" style="left:2.7px;top:10.8px;height:5.53px" />
    <span class="nav-fund__bar" style="left:7.79px;top:8.1px;height:8.756px" />
    <span class="nav-fund__bar" style="left:12.69px;top:10px;height:6.452px" />
    <span class="nav-fund__line"><${Icon} name="nav-fund-line.svg" width=${15.4293} height=${6.15369} tint /></span>
  </span>
`;

const ITEMS = [
  { key: 'mine', label: '我的', to: '/home', icon: html`<${Icon} name="nav-rate.svg" size=${20} tint />` },
  { key: 'pick', label: '選股', icon: html`<${FundIcon} />` },
  { key: 'watch', label: '自選', icon: html`<${Icon} name="nav-watchlist.svg" width=${13.334} height=${16.666} tint />` },
  { key: 'order', label: '下單', icon: html`<${Icon} name="nav-transfer.svg" size=${20} tint />` },
  { key: 'account', label: '帳務', to: '/account', icon: html`<${Icon} name="nav-account.svg" width=${14.5839} height=${14.5834} tint />` },
  { key: 'more', label: '更多', icon: html`<${Icon} name="nav-menu.svg" width=${16.6667} height=${11.25} tint />` },
];

export function BottomNav({ active = 'account' }) {
  return html`
    <nav class="bottom-nav">
      ${ITEMS.map(
        (item) => html`
          <button
            class=${'bottom-nav__item ' + (item.key === active ? 'bottom-nav__item--active t-body-bold' : 't-body-regular')}
            onClick=${() => item.key !== active && (item.to ? navigate(item.to) : showToast(COPY.common.notAvailable))}
          >
            <span class="bottom-nav__icon">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `
      )}
    </nav>
  `;
}
