// 單選按鈕組（橫排平分）｜Figma：📱 Radio button（.Atom/Radio atom-Mobile + title）
import { html } from '../../lib/preact.js';

/**
 * <RadioGroup
 *   label="還款額度"
 *   options=${[{ value: 'partial', label: '部分' }, { value: 'full', label: '全部' }]}
 *   value=${mode} onChange=${setMode}
 * />
 */
export function RadioGroup({ label, options, value, onChange, name = label }) {
  return html`
    <div class="field" role="radiogroup" aria-label=${label}>
      ${label && html`<p class="t-body-bold c-primary">${label}</p>`}
      <div class="radio-group">
        ${options.map(
          (o) => html`
            <label class="radio">
              <input
                type="radio"
                class="radio__input"
                name=${name}
                value=${o.value}
                checked=${o.value === value}
                onChange=${() => onChange(o.value)}
              />
              <span class="radio__circle" aria-hidden="true" />
              <span class="t-subtitle-regular c-primary">${o.label}</span>
            </label>
          `
        )}
      </div>
    </div>
  `;
}
