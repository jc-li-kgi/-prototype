// 數字輸入框（標題 + 輸入 + 單位 + 底線）｜Figma：Text Input_Mobile（擔保張數）
import { html } from '../../lib/preact.js';

/**
 * <NumberField label="擔保張數" value=${lots} onChange=${setLots} placeholder="請輸入數字" suffix="張" max=${9999} />
 *   value  數字或 null（未填，顯示 placeholder，tertiary 色）
 *   只接受整數；超過 max 時自動改成 max
 */
export function NumberField({ label, value, onChange, placeholder, suffix, max }) {
  const input = (e) => {
    const digits = e.currentTarget.value.replace(/\D/g, '');
    const n = digits ? Number(digits) : null;
    const next = n != null && max != null ? Math.min(n, max) : n;
    e.currentTarget.value = next ?? '';
    onChange(next);
  };
  return html`
    <label class="field">
      ${label && html`<span class="t-body-bold c-primary">${label}</span>`}
      <span class="field__picker number-field">
        <input class="t-subtitle-regular" inputmode="numeric" value=${value ?? ''} placeholder=${placeholder} onInput=${input} />
        ${suffix && html`<span class="t-subtitle-regular c-primary">${suffix}</span>`}
      </span>
      <span class="field__line" />
    </label>
  `;
}
