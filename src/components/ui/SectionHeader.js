// 區塊標題｜Figma：更多服務 / 尚可匯入擔保品 / 可借貸（勾選分組）
import { html } from '../../lib/preact.js';
import { Button } from './Button.js';

/**
 * <SectionHeader title="尚可匯入擔保品" action=${{ label: '查看全部', onClick }} desc=${'匯入後…'} />
 * 標題左邊要放勾選框（全選）時改用 CheckboxHeader，補充說明才會和標題對齊
 *   action     右側文字連結
 *   desc       標題下方說明（字串或 html）
 * 不含左右邊距，由外層決定
 */
export function SectionHeader({ title, action, desc, descClass = 't-body-regular' }) {
  return html`
    <div class="section-header">
      <div class="section-header__row">
        <p class="section-header__title t-subtitle-bold c-primary">${title}</p>
        ${action && html`<${Button} variant="text" onClick=${action.onClick}>${action.label}<//>`}
      </div>
      ${desc && html`<p class=${descClass + ' c-secondary'}>${desc}</p>`}
    </div>
  `;
}
