// 篩選 / 排序下拉膠囊（文字 + ▼）｜Figma：.Atom/Filter pulldown-Mobile
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <FilterPill label="每張可借金額高至低" onClick=${openSheet} />
 */
export function FilterPill({ label, onClick }) {
  return html`
    <button class="filter-pill" onClick=${onClick}>
      <span class="t-body-regular">${label}</span>
      <${Icon} name="triangle-down.svg" level="body" tint />
    </button>
  `;
}
