// 提示條（淡黃底、置中文字）｜Figma：貸款方案卡片 › 動用不受限…
import { html } from '../../lib/preact.js';

/**
 * <NoticeBar>動用不受限，最快 1 小時撥款，隨借隨還</NoticeBar>
 */
export function NoticeBar({ children }) {
  return html`<p class="notice-bar t-caption-regular c-secondary">${children}</p>`;
}
