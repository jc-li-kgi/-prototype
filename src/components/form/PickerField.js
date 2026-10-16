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
 */
export function PickerField({ label, value, options, onChange, placeholder = '請選擇', error, sheetTitle }) {
  const [open, setOpen] = useState(false);
  const items = options.map(normalize);
  const selected = items.find((o) => o.value === value);

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
  };

  return html`
    <div class="field">
      ${label && html`<p class="t-body-bold c-primary">${label}</p>`}
      <button class="field__picker" onClick=${() => setOpen(true)}>
        <span class=${'t-subtitle-regular ' + (selected ? 'c-primary' : 'c-tertiary')}>${selected?.label ?? placeholder}</span>
        <span class="field__picker-icon"><${Icon} name="pull.svg" size=${16} /></span>
      </button>
      <span class=${'field__line' + (error ? ' field__line--error' : '')} />
      ${error && html`<p class="t-caption-regular field__error">${error}</p>`}

      <${Sheet} open=${open} title=${sheetTitle ?? `選擇${label}`} onClose=${() => setOpen(false)}>
        <${SheetOptions} options=${items} value=${value} onSelect=${(v) => pick(items.find((o) => o.value === v))} />
      <//>
    </div>
  `;
}
