// 文字 + ⓘ 說明（點 ⓘ 開說明彈窗）｜Figma：Stroke Icon/Basic/info 搭配標題
import { html, useState } from '../../lib/preact.js';
import { Icon } from './Icon.js';
import { InfoDialog } from '../overlay/Dialog.js';

/**
 * <InfoLabel label="可借額度總計" info=${{ title, body }} />      ← 自己開說明彈窗
 * <InfoLabel label="…" onInfo=${() => …} />                       ← 由外部處理
 * labelClass：文字樣式，預設 t-body-regular（顏色跟外層）
 */
export function InfoLabel({ label, info, onInfo, labelClass = 't-body-regular', class: extra = '' }) {
  const [open, setOpen] = useState(false);
  const hasInfo = info || onInfo;
  return html`
    <span class=${'info-label ' + extra}>
      <span class=${labelClass}>${label}</span>
      ${hasInfo &&
      html`<button class="icon-btn" onClick=${onInfo || (() => setOpen(true))} aria-label=${label + '說明'}>
        <${Icon} name="info.svg" size=${16} />
      </button>`}
      ${info && html`<${InfoDialog} info=${open ? info : null} onClose=${() => setOpen(false)} />`}
    </span>
  `;
}
