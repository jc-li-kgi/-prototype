// 選擇還款方式（底部彈窗）｜Figma 3087:61871
// 入口：專區快捷功能「還款」、股票借貸明細 › 借款紀錄「還款」
// 由入口頁（shell / page）放置，再把開啟的動作傳給各功能模組
// 借新還舊：只有展延次數已滿（LOAN_RULES.maxExtensions）的借款才顯示，選了進 refinance 流程
//   有指定借款 → 看這一筆；沒指定（專區快捷功能）→ 有任何一筆可借新還舊才顯示
import { html } from '../../lib/preact.js';
import { Sheet, SheetOptions } from '../../components/index.js';
import { useStore, showToast, clearRepayDraft } from '../../store.js';
import { startFlow } from '../../flows/flows.js';
import { extensionsUsed, canRefinance } from '../../lib/calc.js';
import { COPY } from '../../content/copy.js';

/**
 * <RepayMethodSheet open=${open} loanId=${id} onClose=${close} />
 *   loanId  要還的借款（不給時現金還款第 1 步會帶入最早即將到期的那筆）
 */
export function RepayMethodSheet({ open, loanId, onClose }) {
  const t = COPY.repay;
  const loans = useStore((s) => s.account?.loans || []);
  const loan = loans.find((l) => l.id === loanId);
  // 可借新還舊的借款：指定的那筆（展延已滿），或沒指定時第一筆符合條件的
  const refiLoan = loan ? (extensionsUsed(loan) ? loan : null) : loans.find(canRefinance);
  const options = t.methods.filter((m) => m.value !== 'refinance' || refiLoan);

  const choose = (value) => {
    const method = t.methods.find((m) => m.value === value);
    onClose();
    if (value === 'refinance') return startFlow('refinance', { query: { loan: refiLoan.id } });
    if (!method?.available) return showToast(COPY.common.notAvailable);
    clearRepayDraft(); // 每次重新選擇還款方式都從頭開始
    startFlow('cashRepay', loanId ? { query: { loan: loanId } } : undefined);
  };
  return html`
    <${Sheet} open=${open} title=${t.methodTitle} onClose=${onClose}>
      <${SheetOptions} chevron options=${options} onSelect=${choose} />
    <//>
  `;
}
