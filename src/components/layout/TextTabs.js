// 文字型頁籤（選中項下方藍線）｜Figma：.Atom/text tab-Mobile
import { html } from '../../lib/preact.js';

/**
 * <TextTabs tabs=${[{ key: 'loans', label: '借還款紀錄' }, …]} active="loans" onChange=${setTab} />
 * 放在卡片內時加 class="text-tabs--flush"（不留左右邊距），置中加 text-tabs--center
 */
export function TextTabs({ tabs, active, onChange, class: extra = '' }) {
  return html`
    <div class=${`text-tabs ${extra}`.trim()} role="tablist">
      ${tabs.map((t) =>
        t.key === active
          ? html`<span role="tab" aria-selected="true" class="text-tabs__item text-tabs__item--active t-body-regular">${t.label}<i /></span>`
          : html`<button role="tab" aria-selected="false" class="text-tabs__item t-body-regular" onClick=${() => onChange(t.key)}>${t.label}</button>`
      )}
    </div>
  `;
}
