// 底部彈窗｜Figma：Action Sheet_service list_Mobile（Atom_Section Header + list）
// 用在選單（排序、借款目的）與明細；ⓘ 說明改用 overlay/Dialog.js 的 InfoDialog
import { html } from '../../lib/preact.js';
import { Icon } from '../ui/Icon.js';
import { Portal } from './Portal.js';

/**
 * 選單：
 *   <Sheet open=${open} title="選擇排序方式" onClose=${close}>
 *     <SheetOptions options=${…} value=${v} onSelect=${…} />
 *   </Sheet>
 * 其他內容（自己需要左右邊距時包 .sheet__content）：
 *   <Sheet open=${open} title="匯入明細" onClose=${close}>
 *     <div class="sheet__content">…</div>
 *   </Sheet>
 * 搜尋類（內容會因搜尋結果變多變少）加 fullHeight：固定 90% 高，內容由上往下排、下方留白，不會跟著結果數量變矮
 *   <Sheet open=${open} title="選擇可擔保標的" fullHeight onClose=${close}>…</Sheet>
 * 點遮罩或右上 ✕ 關閉
 */
export function Sheet({ open, title, fullHeight = false, onClose, children }) {
  if (!open) return null;
  return html`<${Portal}>
    <div class="sheet-mask" onClick=${(e) => { e.stopPropagation(); onClose?.(); }}>
      <div class=${'sheet' + (fullHeight ? ' sheet--full-height' : '')} onClick=${(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label=${title}>
        <div class="sheet__header">
          <p class="sheet__title t-body-regular c-secondary">${title}</p>
          <button class="icon-btn" onClick=${onClose} aria-label="關閉"><${Icon} name="close.svg" /></button>
        </div>
        ${children}
      </div>
    </div>
  <//>`;
}
