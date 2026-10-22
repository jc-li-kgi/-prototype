// 選擇可擔保標的（底部彈窗：搜尋 + 股票清單）｜Figma 2565:50433
// 清單 = 所有可借貸的股票；有庫存的顯示庫存張數
import { html, useState } from '../../lib/preact.js';
import { Sheet, SearchField, EmptyState } from '../../components/index.js';
import { useStore } from '../../store.js';
import { STOCKS } from '../../mock/stocks.js';
import { num, price } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

/** <StockPickerSheet open=${open} exclude=${['0056']} onSelect=${(code) => …} onClose=${close} /> */
export function StockPickerSheet({ open, exclude = [], onSelect, onClose }) {
  const t = COPY.simulate;
  const holdings = useStore((s) => s.account.holdings);
  const [keyword, setKeyword] = useState('');
  const held = (code) => holdings.find((h) => h.code === code)?.lots ?? 0;

  const list = Object.entries(STOCKS)
    .filter(([code, s]) => s.type === 'eligible' && !exclude.includes(code))
    .filter(([code, s]) => !keyword || s.name.includes(keyword) || code.includes(keyword))
    // 有庫存的排前面
    .sort(([a], [b]) => held(b) - held(a));

  const close = () => {
    setKeyword('');
    onClose();
  };

  return html`
    <${Sheet} open=${open} title=${t.sheetTitle} fullHeight onClose=${close}>
      <div class="sheet__content stock-picker__search">
        <${SearchField} value=${keyword} onChange=${setKeyword} placeholder=${t.searchPlaceholder} />
      </div>
      ${list.length === 0
        ? html`<${EmptyState} text=${t.emptySearch} />`
        : html`
            <div class="stock-picker">
              ${list.map(
                ([code, s]) => html`
                  <button class="stock-picker__item" onClick=${() => { setKeyword(''); onSelect(code); }}>
                    <span class="stock-picker__name">
                      <span class="t-subtitle-regular c-primary">${s.name}</span>
                      <span class="n-subtitle-regular c-secondary">${code}</span>
                    </span>
                    <span class="stock-picker__metrics">
                      <span><span class="t-caption-regular c-secondary">${t.price}</span> <span class="n-body-regular c-primary">${price(s.price)}</span></span>
                      ${held(code) > 0 &&
                      html`<span><span class="t-caption-regular c-secondary">${t.holding}</span> <span class="t-caption-regular c-primary">${num(held(code))} 張</span></span>`}
                    </span>
                  </button>
                `
              )}
            </div>
          `}
    <//>
  `;
}
