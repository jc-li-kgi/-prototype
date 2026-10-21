// 收合問答（標題 + ＋／－，展開顯示內容，下方分隔線）｜Figma：aFAQ（CollapseBtn + AnswerContainer）
import { html, useState } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <Accordion items=${[{ q: '誰可以開股票借貸戶？', a: '年滿 20 歲…' }, …]} defaultOpen=${0} />
 *   defaultOpen  一開始展開第幾題（不給 = 全部收合）；一次只展開一題
 */
export function Accordion({ items, defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return html`
    <div class="accordion">
      ${items.map(
        (it, i) => html`
          <div class="accordion__item">
            <button class="accordion__head" aria-expanded=${open === i} onClick=${() => setOpen(open === i ? null : i)}>
              <span class="t-subtitle-bold c-primary">${it.q}</span>
              <${Icon} name=${open === i ? 'faq-minus.svg' : 'faq-plus.svg'} level="subtitle" />
            </button>
            ${open === i && html`<p class="accordion__body t-body-regular c-primary">${it.a}</p>`}
          </div>
        `
      )}
    </div>
  `;
}
