// 彈窗選項列表｜Figma：Atom_service picker_Mobile（選中項淡藍底）｜放在 <Sheet> 裡使用
import { html } from '../../lib/preact.js';

/**
 * <Sheet open=${open} title="選擇排序方式" onClose=${close}>
 *   <SheetOptions options=${[{ value, label, desc }]} value=${current} onSelect=${(v) => …} />
 * </Sheet>
 * options 也可以直接給字串陣列
 */
export function SheetOptions({ options, value, onSelect }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return html`
    <div class="sheet__options" role="listbox">
      ${items.map(
        (o) => html`
          <button
            class=${'sheet__option' + (o.value === value ? ' sheet__option--selected' : '')}
            role="option"
            aria-selected=${o.value === value}
            onClick=${() => onSelect(o.value)}
          >
            <span class="t-subtitle-regular c-primary">${o.label}</span>
            ${o.desc && html`<span class="t-caption-regular c-secondary">${o.desc}</span>`}
          </button>
        `
      )}
    </div>
  `;
}
