// 可收合卡片（標題 + 展開/收起箭頭）｜Figma：card/special/amount/complete
import { html, useState } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <CollapsibleCard title="擔保品匯入明細" defaultOpen>…內容…</CollapsibleCard>
 */
export function CollapsibleCard({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return html`
    <section class="card collapsible">
      <button class="collapsible__head" aria-expanded=${open} onClick=${() => setOpen(!open)}>
        <span class="t-subtitle-bold c-primary">${title}</span>
        <span class=${'collapsible__chevron' + (open ? '' : ' collapsible__chevron--closed')}>
          <${Icon} name="chevron-up.svg" level="subtitle" />
        </span>
      </button>
      ${open && html`<div class="collapsible__body">${children}</div>`}
    </section>
  `;
}
