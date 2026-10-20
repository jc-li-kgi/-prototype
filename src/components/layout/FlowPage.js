// 流程頁框架（頁首 + 步驟條 + 內容 + 底部按鈕）｜流程申請的每一步都用這個
import { html } from '../../lib/preact.js';
import { PageHeader } from './PageHeader.js';
import { StepBar } from './StepBar.js';
import { StickyFooter } from './StickyFooter.js';

/**
 * <FlowPage title="申請借款" step=${flowPosition(PATH)} onBack=${…} actions=${html`<Button>下一步</Button>`}>
 *   …內容…
 * </FlowPage>
 *
 *   actions        內容下方的按鈕（距內容 32，Guideline：內容→按鈕）
 *   actionsClass   按鈕區額外 class（例如限制按鈕寬度）
 *   sticky         固定在畫面底部的操作區（例如總計 + 下一步），和 actions 擇一
 *   stickyPlain    置底區只有一顆按鈕時：透明底、無分隔線（按鈕滿版、左右 16）
 * 間距：頁首→內容 24、內容區塊之間 24（Guideline：流程申請）
 */
export function FlowPage({ title, step, onBack, actions, actionsClass = '', sticky, stickyPlain = false, children }) {
  return html`
    <div class="page flow-page">
      <div>
        <${PageHeader} title=${title} onBack=${onBack} />
        ${step && html`<${StepBar} ...${step} />`}
      </div>

      <div class="flow-page__body">
        <div class="flow-page__content">${children}</div>
        ${actions && html`<div class=${'bottom-actions ' + actionsClass}>${actions}</div>`}
      </div>

      ${sticky && html`<${StickyFooter} plain=${stickyPlain}>${sticky}<//>`}
    </div>
  `;
}
