// 對帳單（股票借貸明細 › 對帳單）：借款、還款、擔保品匯入 / 匯出彙整成卡片，最新的在最上面
// 對帳單只列成功的交易，所以不顯示狀態（失敗的擔保品匯入不列入）
// 卡片內容與各明細表格（借款紀錄、還款紀錄、擔保品歷史紀錄）的展開明細相同｜卡片：StatementCard
// 上方篩選：時間（預設全部期間）、交易類別（預設全部類別），點了開底部選單
import { html, useState } from '../../lib/preact.js';
import { StatementCard, EmptyState, FilterPill, Sheet, SheetOptions } from '../../components/index.js';
import { LOAN_RULES, stockOf, periodInterest, today, addDays } from '../../lib/calc.js';
import { twd, num, rate, date, dateTime } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

/** 日期 + 時間（兩行） */
function dateTimeLines(iso) {
  const [day, time] = dateTime(new Date(iso)).split(' ');
  return html`<p>${day}</p><p>${time}</p>`;
}

/** 借款 → 卡片 */
function loanCard(l) {
  const t = COPY.records;
  const s = t.statement.loan;
  const d = t.borrowDetail;
  return {
    key: l.id,
    type: 'loan',
    at: l.appliedAt || l.applyDate,
    title: twd(l.amount),
    tag: t.statement.tags.loan,
    rows: [
      [s.startDate, date(l.startDate)],
      [s.dueDate, date(l.dueDate)],
      [s.applyDate, l.appliedAt ? dateTimeLines(l.appliedAt) : date(l.applyDate)],
    ],
    detail: [
      [t.colBalance[0], twd(l.balance)],
      [d.rate, rate(l.rate)],
      [d.interest, twd(periodInterest(l))],
      [d.fee, twd(l.fee ?? LOAN_RULES.fee)],
      [d.extensions, `${l.extensions ?? 0}/${LOAN_RULES.maxExtensions}`],
      [d.serial, l.id],
      [d.channel, l.channel ?? 'APP'],
    ],
  };
}

/** 還款 → 卡片 */
function repayCard(r) {
  const t = COPY.records;
  const s = t.statement.repay;
  const d = t.repayDetail;
  return {
    key: r.id,
    type: 'repay',
    at: r.appliedAt,
    title: twd(r.total),
    tag: t.statement.tags.repay,
    rows: [
      [d.appliedAt, dateTimeLines(r.appliedAt)],
      [s.method, r.method, 't-body-regular'],
    ],
    detail: [
      [d.principal, twd(r.principal)],
      [d.interest, twd(r.interest)],
      [d.fee, twd(r.fee)],
      [d.bank, html`<p class="t-body-regular">${r.bank.name}</p><p class="n-body-regular">${r.bank.number}</p>`],
      [d.serial, r.id],
      [d.channel, r.channel],
    ],
  };
}

/** 擔保品匯入 / 匯出 → 卡片 */
function collateralCard(r) {
  const t = COPY.records;
  const s = t.statement.collateral;
  const d = t.historyDetail;
  return {
    key: r.id,
    type: r.type,
    at: r.appliedAt,
    title: `${stockOf(r.code).name} ${r.code}`,
    titleClass: 't-body-bold',
    tag: t.statement.tags[r.type],
    rows: [
      [s.lots, t.lots(num(r.lots)), 't-body-regular'],
      [d.appliedAt, dateTimeLines(r.appliedAt)],
    ],
    detail: [
      [d.serial, r.id],
      [d.channel, r.channel],
    ],
  };
}

export function StatementList({ account }) {
  const t = COPY.records.statement;
  const [period, setPeriod] = useState('all');
  const [type, setType] = useState('all');
  const [sheet, setSheet] = useState(null); // 'period' | 'type'

  const all = [
    ...account.loans.map(loanCard),
    ...(account.repayments || []).map(repayCard),
    ...(account.collateralRecords || []).filter((r) => r.status !== '失敗').map(collateralCard),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const days = t.periods.find((p) => p.value === period).days;
  const from = days == null ? null : addDays(today(), -days);
  const cards = all.filter((c) => (type === 'all' || c.type === type) && (!from || c.at.slice(0, 10) >= from));

  const label = (list, v) => list.find((x) => x.value === v).label;
  const choose = (setter) => (v) => {
    setter(v);
    setSheet(null);
  };

  return html`
    <div class="records-section">
      <div class="records-section__controls">
        <div class="records-filters">
          <${FilterPill} label=${label(t.periods, period)} onClick=${() => setSheet('period')} />
          <${FilterPill} label=${label(t.types, type)} onClick=${() => setSheet('type')} />
        </div>
      </div>

      ${cards.length === 0
        ? html`<${EmptyState} text=${all.length ? t.emptyFilter : t.empty} />`
        : html`
            <div class="statement-list">
              ${cards.map((c) => html`<${StatementCard} key=${c.key} ...${c} />`)}
            </div>
          `}
    </div>

    <${Sheet} open=${sheet === 'period'} title=${t.periodTitle} onClose=${() => setSheet(null)}>
      <${SheetOptions} options=${t.periods} value=${period} onSelect=${choose(setPeriod)} />
    <//>
    <${Sheet} open=${sheet === 'type'} title=${t.typeTitle} onClose=${() => setSheet(null)}>
      <${SheetOptions} options=${t.types} value=${type} onSelect=${choose(setType)} />
    <//>
  `;
}
