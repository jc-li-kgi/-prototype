// 圓形圖示 + 文字的功能捷徑｜Figma：專區快捷功能（還款 / 查看借還款紀錄 / 管理擔保品 / 更多）
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <IconAction icon="action-repay.png" label="還款" onClick=${…} />
 * icon 用 tint 顯示，顏色跟著文字主色
 */
export function IconAction({ icon, label, onClick }) {
  return html`
    <button class="icon-action" onClick=${onClick}>
      <span class="icon-action__circle"><${Icon} name=${icon} tint /></span>
      <span class="t-caption-regular c-primary">${label}</span>
    </button>
  `;
}
