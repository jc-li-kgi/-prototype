// 日期＋時間（兩行）：申請日、交易申請日、申請時間等｜借款紀錄、還款紀錄、擔保品歷史紀錄、對帳單共用
import { html } from '../../lib/preact.js';
import { dateTimeParts } from '../../lib/format.js';

/**
 * <DateTimeLines value=${'2025-12-28T11:45:11'} />                         ← 放在 DetailRow 的 value（沿用資料列字級）
 * <DateTimeLines value=${iso} class="n-body-regular c-primary" />          ← 放在列表欄位時指定字級與顏色
 * 只要日期或時間其中一個時，用 format.js 的 dateTimeParts
 */
export function DateTimeLines({ value, class: cls }) {
  const [day, time] = dateTimeParts(value);
  return html`<p class=${cls}>${day}</p><p class=${cls}>${time}</p>`;
}
