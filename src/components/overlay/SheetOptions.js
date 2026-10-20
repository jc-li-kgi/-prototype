// 彈窗選項列表｜Figma：Atom_service picker_Mobile（選中項淡藍底）｜放在 <Sheet> 裡使用
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';

/**
 * <Sheet open=${open} title="選擇排序方式" onClose=${close}>
 *   <SheetOptions options=${[{ value, label, desc }]} value=${current} onSelect=${(v) => …} />
 * </Sheet>
 * options 也可以直接給字串陣列
 * chevron：選單是「前往」用途（例如選擇還款方式），每列右側顯示 ›，不標示選中項
 */
export function SheetOptions({ options, value, onSelect, chevron = false }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return html`
    <div class="sheet__options" role="listbox">
      ${items.map(
        (o) => html`
          <button
            class=${'sheet__option' + (!chevron && o.value === value ? ' sheet__option--selected' : '') + (chevron ? ' sheet__option--nav' : '')}
            role="option"
            aria-selected=${!chevron && o.value === value}
            onClick=${() => onSelect(o.value)}
          >
            <span class="sheet__option-text">
              <span class="t-subtitle-regular c-primary">${o.label}</span>
              ${o.desc && html`<span class="t-caption-regular c-secondary">${o.desc}</span>`}
            </span>
            ${chevron && html`<${Icon} name="chevron-forward-24.svg" level="subtitle" />`}
          </button>
        `
      )}
    </div>
  `;
}
