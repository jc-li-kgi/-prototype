// 完成頁（成功插圖 + 標題 + 說明 + 按鈕）｜Figma：完成頁 / App_S01_02_EmptyPage_TitlenDescription
import { html } from '../../lib/preact.js';
import { PageHeader } from './PageHeader.js';
import { Button } from '../ui/Button.js';
import { BottomActions } from './BottomActions.js';

/**
 * <ResultPage
 *   header="申請借款" title="成功送出申請" desc="我們將在…"
 *   primary=${{ label: '查看借款紀錄', onClick }}
 *   secondary=${{ label: '完成', onClick }}
 * />
 */
export function ResultPage({ header, title, desc, primary, secondary }) {
  return html`
    <div class="page page--white result-page">
      <${PageHeader} title=${header} showShare=${false} />

      <div class="result-page__content">
        <div class="result-page__image">
          <img src="assets/icons/success.svg" width="111.648" height="105.419" alt="" />
        </div>
        <div class="result-page__text">
          <p class="t-headline c-primary">${title}</p>
          ${desc && html`<p class="t-body-regular c-secondary">${desc}</p>`}
        </div>
      </div>

      <${BottomActions}>
        ${primary && html`<${Button} onClick=${primary.onClick}>${primary.label}<//>`}
        ${secondary && html`<${Button} variant="text" block onClick=${secondary.onClick}>${secondary.label}<//>`}
      <//>
    </div>
  `;
}
