// 尚未借款時的方案卡（預估庫存可借貸 / 預估每日利息 / 提示條）｜Figma：貸款方案卡片
// 用在：股票借貸專區初始頁、帳務 › 授信管理（尚未借款）
import { html } from '../../lib/preact.js';
import { StatGroup, NoticeBar } from '../../components/index.js';
import { useStore } from '../../store.js';
import { importablePotential, dailyInterest } from '../../lib/calc.js';
import { wan, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

export function LoanIntroCard() {
  const account = useStore((s) => s.account);
  const t = COPY.zone;
  const potential = importablePotential(account);

  return html`
    <section class="card loan-intro-card">
      <p class="t-subtitle-bold c-primary">${t.introTitle}</p>
      <${StatGroup}
        items=${[
          { label: t.introLoanable, value: wan(potential), unit: t.wan, highlight: true },
          { label: t.introDailyInterest, value: num(dailyInterest(potential)), unit: 'TWD' },
        ]}
      />
      <${NoticeBar}>${t.introNotice}<//>
    </section>
  `;
}
