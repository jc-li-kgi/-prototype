// 文字 + ⓘ 說明（點 ⓘ 開說明彈窗）｜Figma：Stroke Icon/Basic/info 搭配標題
import { html, useState } from '../../lib/preact.js';
import { Icon } from './Icon.js';
import { InfoDialog } from '../overlay/Dialog.js';

/**
 * <InfoLabel label="可借額度總計" info=${{ title, body }} />      ← 自己開說明彈窗
 * <InfoLabel label="…" onInfo=${() => …} />                       ← 由外部處理
 * labelClass：文字樣式，預設 t-body-regular（顏色跟外層）
 * level：ⓘ 的尺寸層級（caption / body / subtitle），不給時依 labelClass 判斷
 */
const levelOf = (cls = '') => (cls.includes('caption') ? 'caption' : cls.includes('subtitle') ? 'subtitle' : 'body');

export function InfoLabel({ label, info, onInfo, labelClass = 't-body-regular', level, class: extra = '' }) {
  const lv = level || levelOf(labelClass);
  const [open, setOpen] = useState(false);
  const hasInfo = info || onInfo;
  return html`
    <span class=${`info-label icon-text--${lv} ${extra}`}>
      <span class=${labelClass}>${label}</span>
      ${hasInfo &&
      html`<button class="icon-btn" onClick=${onInfo || (() => setOpen(true))} aria-label=${label + '說明'}>
        <${Icon} name="info.svg" level=${lv} />
      </button>`}
      ${info && html`<${InfoDialog} info=${open ? info : null} onClose=${() => setOpen(false)} />`}
    </span>
  `;
}
