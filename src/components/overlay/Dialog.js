// 置中對話框｜Figma：Dialog_Mobile（content + Atom_Dialog Button_Mobile）
// 用在點 ⓘ、注意事項等說明，以及需要使用者確認的提示
import { html } from '../../lib/preact.js';
import { COPY } from '../../content/copy.js';
import { Portal } from './Portal.js';

/**
 * 說明（一顆「我知道了」）：
 *   <Dialog open=${open} title="借款手續費規則" body="首次還款或展延…" onClose=${close} />
 *
 * 確認（兩顆按鈕，左邊次要、右邊主要）：
 *   <Dialog open=${open} title="即將前往匯入擔保品" body="…" bodyAlign="center" onClose=${close}
 *     actions=${[{ label: '返回', secondary: true }, { label: '確認前往', onClick: go }]} />
 *
 *   body       字串或 html；也可以用 children
 *   bodyAlign  'left'（預設）| 'center'
 *   actions    沒有 onClick 的按鈕 = 關閉；點遮罩也會關閉
 */
export function Dialog({ open, title, body, bodyAlign = 'left', actions, onClose, children }) {
  if (!open) return null;
  const buttons = actions ?? [{ label: COPY.common.gotIt }];
  return html`<${Portal}>
    <div class="dialog-mask" onClick=${(e) => { e.stopPropagation(); onClose?.(); }}>
      <div class="dialog" role="dialog" aria-modal="true" aria-label=${title} onClick=${(e) => e.stopPropagation()}>
        <div class="dialog__content">
          ${title && html`<p class="dialog__title t-subtitle-bold c-primary">${title}</p>`}
          ${body && html`<p class=${'t-body-regular c-primary dialog__body--' + bodyAlign}>${body}</p>`}
          ${children}
        </div>
        <div class="dialog__actions">
          ${buttons.map(
            (b) => html`
              <button
                class=${'dialog__btn t-body-regular ' + (b.secondary ? 'c-secondary' : 'c-active')}
                onClick=${b.onClick || onClose}
              >${b.label}</button>
            `
          )}
        </div>
      </div>
    </div>
  <//>`;
}

/** 說明型對話框：info = { title, body }，null 時關閉 */
export function InfoDialog({ info, onClose }) {
  return html`<${Dialog} open=${!!info} title=${info?.title} body=${info?.body} onClose=${onClose} />`;
}
