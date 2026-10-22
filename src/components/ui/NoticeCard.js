// 公告卡（公告 icon + 一行訊息 + ›，整張可點）｜Figma：wk25/card/3（專區 3177:194338、帳務 2720:159497 到期通知）
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <NoticeCard text="有 2 筆借款，即將到期" onClick=${() => navigate('/records?tab=loans')} />
 * 白底圓角卡（6）、Basic 陰影；左右內距 16、上下 16；icon 與文字 16
 * icon 一律 24px（公告、›；不跟文字層級，見 CLAUDE.md「Icon 尺寸」）
 * 不含左右外距，由外層決定
 */
export function NoticeCard({ text, onClick }) {
  return html`
    <button class="card card--shadow notice-card" onClick=${onClick}>
      <${Icon} name="announce.svg" />
      <span class="notice-card__text t-body-regular c-primary">${text}</span>
      <${Icon} name="chevron-forward-24.svg" />
    </button>
  `;
}
