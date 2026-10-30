// 展開 / 收闔明細文字按鈕（文字＋箭頭，展開時箭頭朝上）｜Figma：對帳單卡片、借新還舊卡片的「展開明細」
// 用文字按鈕（Button variant="text"）組成，改文字按鈕樣式會一起變
import { html } from '../../lib/preact.js';
import { Button } from './Button.js';
import { Icon } from './Icon.js';
import { COPY } from '../../content/copy.js';

/**
 * <ExpandButton expanded=${open} onClick=${() => setOpen(!open)} />
 *   文字預設「展開明細 / 收闔明細」，要換文字傳 labels=${['看更多', '收合']}
 *   位置（置中、上方間距）由外層 class 決定
 */
export function ExpandButton({ expanded = false, onClick, labels = [COPY.common.expand, COPY.common.collapse], class: extra = '' }) {
  return html`
    <${Button} variant="text" class=${'expand-button ' + extra} aria-expanded=${expanded} onClick=${onClick}>
      ${expanded ? labels[1] : labels[0]}
      <${Icon} name=${expanded ? 'chevron-up.svg' : 'chevron-down.svg'} level="body" tint />
    <//>
  `;
}
