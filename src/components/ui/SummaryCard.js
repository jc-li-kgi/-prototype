// 摘要卡（大數字 + 資料列 + 按鈕）｜Figma：總貸款金額卡牌 / 負債卡牌
import { html } from '../../lib/preact.js';
import { Icon } from './Icon.js';

/**
 * <SummaryCard
 *   label="整戶維持率" value="285%"
 *   rows=${[['擔保品市值', 'TWD 5,700,000'], ['即將到期金額', 'TWD 1,000,000', 'warning'], …]}   ← 第 3 個值 warning = 整列橘字
 *   actions=${html`<Button …/>…`}
 *   onBell=${…}                 ← 右上角通知鈴（不給就不顯示）
 *   variant="overview"          ← overview：大數字在標題下方、內距 16（資訊瀏覽）
 *                                  flow：大數字與標題同一行、內距 24（流程申請）
 * />
 */
export function SummaryCard({ label, value, rows = [], actions, onBell, variant = 'overview' }) {
  const head =
    variant === 'flow'
      ? html`
          <div class="detail-row">
            <span class="detail-row__label t-body-bold c-primary">${label}</span>
            <span class="detail-row__value n-title">${value}</span>
          </div>
        `
      : html`
          <div class="summary-card__head">
            <div>
              <p class="t-body-regular c-primary">${label}</p>
              <p class="n-title c-primary">${value}</p>
            </div>
            ${onBell &&
            html`<button class="icon-btn" onClick=${onBell} aria-label="維持率通知">
              <${Icon} name="notification.svg" />
            </button>`}
          </div>
        `;

  return html`
    <section class=${'card card--shadow summary-card summary-card--' + variant}>
      ${head}
      ${rows.map(
        ([l, v, tone]) => html`
          <div class=${'detail-row' + (tone ? ' detail-row--' + tone : '')}>
            <span class="detail-row__label t-body-regular">${l}</span>
            <span class="detail-row__value n-body-regular">${v}</span>
          </div>
        `
      )}
      ${actions && html`<div class="summary-card__actions">${actions}</div>`}
    </section>
  `;
}
