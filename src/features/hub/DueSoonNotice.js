// 到期通知：有即將到期（DUE_SOON_DAYS 天內）的借款時顯示，點擊 → 股票借貸明細 › 借還款紀錄 › 借款
// 專區總覽、帳務 › 授信管理共用；沒有即將到期的借款就不顯示
import { html } from '../../lib/preact.js';
import { NoticeCard } from '../../components/index.js';
import { useStore } from '../../store.js';
import { navigate } from '../../router.js';
import { isDueSoon } from '../../lib/calc.js';
import { COPY } from '../../content/copy.js';

/** back：明細頁按返回回到哪裡（帳務帶 '/account'；專區不用帶） */
export function DueSoonNotice({ back }) {
  const count = useStore((s) => s.account.loans.filter(isDueSoon).length);
  if (!count) return null;
  const to = `/records?tab=loans&sub=borrow${back ? `&back=${back}` : ''}`;
  return html`<${NoticeCard} text=${COPY.hub.dueSoonNotice(count)} onClick=${() => navigate(to)} />`;
}
