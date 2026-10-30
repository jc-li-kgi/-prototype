// 股票借貸明細：借還款紀錄 / 擔保品 / 對帳單
// 網址：#/records?tab=loans|collateral|statement
//   借還款紀錄可再帶 &sub=borrow|repay&open=紀錄編號（展開該筆）；擔保品可再帶 &sub=pledged|unpledged|history
//   &back=返回頁：明細頁屬於專區，預設返回專區（例如從完成頁進來，按返回回專區，不會回到完成頁）；
//   從帳務 › 授信管理進來時帶 back=/account
// 頁面負責組合各功能模組（features 之間不互相 import）
import { html, useState } from '../lib/preact.js';
import { PageHeader, TextTabs, SegmentedTabs, SearchField, Button, FilterPill, SearchIcon } from '../components/index.js';
import { useStore, showToast } from '../store.js';
import { navigate } from '../router.js';
import { startFlow } from '../flows/flows.js';
import { groupHoldings, stockOf } from '../lib/calc.js';
import { COPY } from '../content/copy.js';
import { LoanRecordList } from '../features/records/LoanRecordList.js';
import { StatementList } from '../features/records/StatementList.js';
import { RepayMethodSheet } from '../features/repay/RepayMethodSheet.js';
import { HoldingsTable } from '../features/collateral/HoldingsTable.js';
import { PledgedList } from '../features/collateral/PledgedList.js';
import { CollateralHistory } from '../features/collateral/CollateralHistory.js';

// 未擔保：全部庫存，依可借貸 → 僅可提升維持率 → 無法作為擔保品排序
const allHoldings = (account) => {
  const g = groupHoldings(account);
  return [...g.eligible, ...g.ratioOnly, ...g.ineligible];
};

const matches = (keyword) => (h) => !keyword || stockOf(h.code).name.includes(keyword) || h.code.includes(keyword);

export function LendingRecords({ query }) {
  const account = useStore((s) => s.account);
  const t = COPY.records;
  const tab = t.tabs.some((x) => x.key === query.tab) ? query.tab : 'loans';
  const [keyword, setKeyword] = useState('');
  const [repayLoan, setRepayLoan] = useState(null); // 正在選擇還款方式的借款
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const parent = query.back || '/lending-zone';
  const back = () => navigate(parent, { replace: true });
  const backQs = query.back ? `&back=${query.back}` : '';
  const switchTab = (key) => navigate(`/records?tab=${key}${backQs}`, { replace: true });
  // 擔保品子頁籤跟著網址走（從其他頁帶 &sub= 進來時也會正確切換）
  const sub = t.collateralTabs.some((x) => x.key === query.sub) ? query.sub : 'pledged';
  const setSub = (key) => navigate(`/records?tab=collateral&sub=${key}${backQs}`, { replace: true });

  return html`
    <div class="page records-page">
      <div>
        <${PageHeader} title=${t.title} onBack=${back} showShare=${false} />
        <${TextTabs} tabs=${t.tabs} active=${tab} onChange=${switchTab} />
      </div>

      ${tab === 'loans' &&
      html`<${LoanRecordList}
        key=${`${query.sub}-${query.open}`}
        loans=${account.loans}
        repayments=${account.repayments || []}
        initialSub=${query.sub === 'repay' ? 'repay' : 'borrow'}
        initialOpen=${query.open}
        onRepay=${setRepayLoan}
        onRefinance=${(l) => startFlow('refinance', { query: { loan: l.id } })}
      />`}

      ${tab === 'collateral' &&
      html`
        <div class="records-section">
          <div class="records-section__controls">
            <${SegmentedTabs} tabs=${t.collateralTabs} active=${sub} onChange=${setSub} />

            <!-- 已擔保｜Figma 3061:69619：排序 + 搜尋 icon（本次測試不開放，固定依可借款金額高到低） -->
            ${sub === 'pledged' &&
            html`
              <div class="records-toolbar">
                <${FilterPill} label=${t.pledgedSort} onClick=${notAvailable} />
                <button class="icon-btn" onClick=${notAvailable} aria-label="搜尋"><${SearchIcon} /></button>
              </div>
            `}
            ${sub === 'unpledged' &&
            html`
              <div class="records-search">
                <${SearchField} value=${keyword} onChange=${setKeyword} placeholder=${t.searchPlaceholder} onSurface />
                <${Button} variant="text" class="nowrap" onClick=${() => startFlow('collateralIn')}>${t.importCollateral}<//>
              </div>
            `}
          </div>

          ${sub === 'pledged' &&
          html`<${PledgedList}
            collateral=${account.collateral}
            emptyText=${t.emptyPledged}
            onViewChanges=${(code) => navigate(`/records/collateral-changes?code=${code}${backQs}`)}
          />`}
          ${sub === 'unpledged' &&
          html`<${HoldingsTable}
            holdings=${allHoldings(account).filter(matches(keyword))}
            emptyText=${keyword ? t.emptySearch : COPY.holdings.empty}
          />`}
          ${sub === 'history' && html`<${CollateralHistory} records=${account.collateralRecords} />`}
        </div>
      `}

      ${tab === 'statement' && html`<${StatementList} account=${account} />`}

      <${RepayMethodSheet} open=${!!repayLoan} loanId=${repayLoan?.id} onClose=${() => setRepayLoan(null)} />
    </div>
  `;
}
