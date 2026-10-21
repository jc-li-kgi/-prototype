// 下拉選單｜Figma：📱 Text picker
import { html, useState } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { Sheet } from '../overlay/Sheet.js';
import { SheetOptions } from '../overlay/SheetOptions.js';

/** options 可給字串陣列，或 { value, label, desc } 物件陣列 */
function normalize(option) {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

/**
 * <PickerField label="借款目的" value=${v} options=${['資金周轉', '其他']} onChange=${setV} error=${err} />
 *
 * 自訂選擇畫面（例如有搜尋的股票清單）：不給 options，改給 displayValue + onOpen
 * <PickerField displayValue="元大高股息 0056" placeholder="請選擇標的" onOpen=${openSheet} hint="收盤價 60，持有 3000 張" />
 *   hint  底線下方的輔助說明（Caption）
 */
export function PickerField({ label, value, options = [], onChange, placeholder = '請選擇', error, sheetTitle, displayValue, onOpen, hint }) {
  const [open, setOpen] = useState(false);
  const items = options.map(normalize);
  const shown = displayValue ?? items.find((o) => o.value === value)?.label;

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
  };

  return html`
    <div class="field">
      ${label && html`<p class="t-body-bold c-primary">${label}</p>`}
      <button class="field__picker" onClick=${onOpen || (() => setOpen(true))}>
        <span class=${'t-subtitle-regular ' + (shown ? 'c-primary' : 'c-tertiary')}>${shown ?? placeholder}</span>
        <${Icon} name="pull.svg" level="subtitle" />
      </button>
      <span class=${'field__line' + (error ? ' field__line--error' : '')} />
      ${error && html`<p class="t-caption-regular field__error">${error}</p>`}
      ${hint && html`<p class="t-caption-regular c-secondary">${hint}</p>`}

      <${Sheet} open=${!onOpen && open} title=${sheetTitle ?? `選擇${label}`} onClose=${() => setOpen(false)}>
        <${SheetOptions} options=${items} value=${value} onSelect=${(v) => pick(items.find((o) => o.value === v))} />
      <//>
    </div>
  `;
}
