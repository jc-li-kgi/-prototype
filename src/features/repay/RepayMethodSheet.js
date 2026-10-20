// 選擇還款方式（底部彈窗）｜Figma 3087:61871
// 入口：專區快捷功能「還款」、股票借貸明細 › 借款紀錄「還款」
// 由入口頁（shell / page）放置，再把開啟的動作傳給各功能模組
import { html } from '../../lib/preact.js';
import { Sheet, SheetOptions } from '../../components/index.js';
import { showToast, clearRepayDraft } from '../../store.js';
import { startFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

/**
 * <RepayMethodSheet open=${open} loanId=${id} onClose=${close} />
 *   loanId  要還的借款（不給時現金還款第 1 步會帶入最早即將到期的那筆）
 */
export function RepayMethodSheet({ open, loanId, onClose }) {
  const t = COPY.repay;
  const choose = (value) => {
    const method = t.methods.find((m) => m.value === value);
    onClose();
    if (!method?.available) return showToast(COPY.common.notAvailable);
    clearRepayDraft(); // 每次重新選擇還款方式都從頭開始
    startFlow('cashRepay', loanId ? { query: { loan: loanId } } : undefined);
  };
  return html`
    <${Sheet} open=${open} title=${t.methodTitle} onClose=${onClose}>
      <${SheetOptions} chevron options=${t.methods} onSelect=${choose} />
    <//>
  `;
}
