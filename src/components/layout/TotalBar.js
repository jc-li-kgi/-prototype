// 置底總計列（標題 ⓘ ／ 金額 ^）｜Figma：置底下單 › Predict；展開樣式見 node 2975:148335
// 通常放在 <StickyFooter> 裡、按鈕上方
import { html } from '../../lib/preact.js';
import { InfoLabel } from '../ui/InfoLabel.js';
import { Icon } from '../ui/Icon.js';

/**
 * <TotalBar label="可借額度總計" info=${{ title, body }} value="TWD 800,000" />
 *
 * 可展開明細（在置底區內「向上推開」，不是另開彈窗）：
 *   <TotalBar label=… value=… expanded=${open} onToggle=${() => setOpen(!open)}>
 *     …明細內容…
 *   </TotalBar>
 *   置底區最高為畫面 90%，明細太多時只有明細區可以捲動
 *   不給 onToggle 就不顯示 ^
 */
export function TotalBar({ label, info, value, expanded = false, onToggle, children }) {
  return html`
    <div class="total-bar">
      <${InfoLabel} class="c-secondary" label=${label} info=${info} />
      <button class="total-bar__value icon-text--subtitle" onClick=${onToggle} disabled=${!onToggle} aria-expanded=${onToggle ? expanded : undefined} aria-label=${label + '明細'}>
        <span class="n-subtitle-bold c-primary">${value}</span>
        ${onToggle && html`<${Icon} name=${expanded ? 'chevron-down.svg' : 'chevron-up.svg'} level="subtitle" />`}
      </button>
    </div>
    ${expanded && html`<div class="total-bar__detail">${children}</div>`}
  `;
}
