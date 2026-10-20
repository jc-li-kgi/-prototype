// 金額 / 數量輸入框（含 − ＋）｜Figma：.Atom/Text input-Mobile
import { html, useState } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { Button } from '../ui/Button.js';
import { clampAmount } from '../../lib/calc.js';
import { num } from '../../lib/format.js';

/**
 * <AmountField
 *   label="借款金額" value=${amount} onChange=${setAmount}
 *   min=${10000} max=${830000} step=${1000}
 *   prefix="TWD"                         // 或 suffix="股"
 *   action=${{ label: '額度限制', onClick }}
 *   hints=${['可借款金額…', '累加金額…']}
 *   error="超過可借額度"
 *   disabled                            // 鎖定金額（例如還款選「全部」）
 *   placeholder="請輸入借款金額"          // value 為 null 時顯示（tertiary 色），＋ 會從 min 開始
 * />
 * 直接輸入時，離開欄位會自動修正到 min～max 並對齊 step；清空則回到未填狀態（null）
 */
export function AmountField({ label, value, onChange, min, max, step = 1, prefix, suffix, action, hints = [], error, disabled = false, placeholder }) {
  const [text, setText] = useState(null); // 編輯中的字串；null = 沒在編輯
  const range = { min, max, step };
  const filled = value != null;

  const change = (delta) => onChange(filled ? clampAmount(value + delta, range) : delta > 0 ? min : null);
  const commit = () => {
    if (text !== null) {
      const digits = text.replace(/\D/g, '');
      onChange(digits ? clampAmount(digits, range) : null);
    }
    setText(null);
  };
  const shown = text ?? (filled ? num(value) : '');
  const empty = shown === ''; // 未填：顯示 placeholder，隱藏幣別，改用中文字樣式

  return html`
    <div class="field">
      <div class="field__title">
        <p class="t-body-bold c-primary">${label}</p>
        ${action && html`<${Button} variant="text" onClick=${action.onClick}>${action.label}<//>`}
      </div>

      <div class="amount-input">
        <button class="icon-btn amount-input__btn" onClick=${() => change(-step)} disabled=${disabled || !filled || value <= min} aria-label="減少">
          <${Icon} name="minus.svg" width=${16.25} height=${1.25} tint />
        </button>
        <label class=${'amount-input__value ' + (empty ? 't-subtitle-regular' : 'n-title')}>
          ${prefix && !empty && html`<span>${prefix}</span>`}
          <input
            inputmode="numeric"
            readOnly=${disabled}
            value=${shown}
            placeholder=${placeholder}
            size=${empty && placeholder ? placeholder.length * 2 : Math.max(4, shown.length)}
            onFocus=${() => setText(filled ? String(value) : '')}
            onInput=${(e) => setText(e.currentTarget.value)}
            onBlur=${commit}
            onKeyDown=${(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
          ${suffix && !empty && html`<span>${suffix}</span>`}
        </label>
        <button class="icon-btn amount-input__btn" onClick=${() => change(step)} disabled=${disabled || (filled && value >= max)} aria-label="增加">
          <${Icon} name="add.svg" width=${16.25} height=${16.25} tint />
        </button>
      </div>
      <span class=${'field__line' + (error ? ' field__line--error' : '')} />

      ${error && html`<p class="t-caption-regular field__error">${error}</p>`}
      ${hints.length > 0 && html`<div class="t-caption-regular c-secondary">${hints.map((h) => html`<p>${h}</p>`)}</div>`}
    </div>
  `;
}
