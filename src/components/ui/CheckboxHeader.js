// 勾選標題（勾選框 + 標題 + 補充說明）｜Figma：MDS Comp Lib › CheckBox Title（標準字級，node 24434:7885）
//   標題 Subtitle-B、附註 Caption-R secondary；勾選框→文字 8、標題→附註 4
// 標題與補充說明左側對齊（都在勾選框右邊），勾選框與標題第一行垂直置中
import { html } from '../../lib/preact.js';
import { Checkbox } from './Checkbox.js';

/**
 * <CheckboxHeader
 *   title="僅可用於提升維持率 (2)"
 *   desc="可以匯入提高擔保品市值，提升維持率"
 *   checked=${all} onChange=${(on) => …}
 *   label="全選僅可用於提升維持率"     ← 勾選框的無障礙名稱
 * />
 * 不含左右邊距，由外層決定
 */
export function CheckboxHeader({ title, desc, checked = false, disabled = false, onChange, label = title }) {
  return html`
    <div class="checkbox-header">
      <span class="checkbox-header__box">
        <${Checkbox} checked=${checked} disabled=${disabled} onChange=${onChange} label=${label} />
      </span>
      <div class="checkbox-header__text">
        <p class="t-subtitle-bold c-primary">${title}</p>
        ${desc && html`<p class="t-caption-regular c-secondary">${desc}</p>`}
      </div>
    </div>
  `;
}
