// 股票借貸明細：借還款紀錄 / 擔保品 / 對帳單
// 網址：#/records?tab=loans|collateral|statement
//   借還款紀錄可再帶 &sub=borrow|repay&open=紀錄編號（展開該筆）；擔保品可再帶 &sub=pledged|unpledged|history
// 頁面負責組合各功能模組（features 之間不互相 import）
import { html, useState } from '../lib/preact.js';
import { PageHeader, TextTabs, SegmentedTabs, SearchField, Button, InfoLabel, EmptyState } from '../components/index.js';
import { useStore } from '../store.js';
import { navigate } from '../router.js';
import { startFlow, entryHome } from '../flows/flows.js';
import { groupHoldings, stockOf } from '../lib/calc.js';
import { COPY } from '../content/copy.js';
import { LoanRecordList } from '../features/records/LoanRecordList.js';
import { RepayMethodSheet } from '../features/repay/RepayMethodSheet.js';
import { HoldingsTable } from '../features/collateral/HoldingsTable.js';
import { PledgedList } from '../features/collateral/PledgedList.js';
import { CollateralHistory } from '../features/collateral/CollateralHistory.js';

const matches = (keyword) => (h) => !keyword || stockOf(h.code).name.includes(keyword) || h.code.includes(keyword);

export function LendingRecords({ query }) {
  const account = useStore((s) => s.account);
  const t = COPY.records;
  const tab = t.tabs.some((x) => x.key === query.tab) ? query.tab : 'loans';
  const [sub, setSub] = useState(t.collateralTabs.some((x) => x.key === query.sub) ? query.sub : 'pledged');
  const [keyword, setKeyword] = useState('');
  const [repayLoan, setRepayLoan] = useState(null); // 正在選擇還款方式的借款

  const back = () => (history.length > 1 ? history.back() : navigate(entryHome()));
  const switchTab = (key) => navigate(`/records?tab=${key}`, { replace: true });

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
      />`}

      ${tab === 'collateral' &&
      html`
        <div class="records-section">
          <div class="records-section__controls">
            <${SegmentedTabs} tabs=${t.collateralTabs} active=${sub} onChange=${setSub} />

            ${sub === 'unpledged' &&
            html`
              <${InfoLabel} class="c-secondary" label=${t.unpledgedHint} labelClass="t-caption-regular" info=${t.unpledgedHintSheet} />
            `}

            ${sub !== 'history' &&
            html`
              <div class="records-search">
                <${SearchField} value=${keyword} onChange=${setKeyword} placeholder=${t.searchPlaceholder} />
                <${Button} variant="text" class="nowrap" onClick=${() => startFlow('collateralIn')}>${t.importCollateral}<//>
              </div>
            `}
          </div>

          ${sub === 'pledged' &&
          html`<${PledgedList}
            collateral=${account.collateral.filter(matches(keyword))}
            emptyText=${keyword ? t.emptySearch : t.emptyPledged}
          />`}
          ${sub === 'unpledged' &&
          html`<${HoldingsTable}
            holdings=${groupHoldings(account).eligible.filter(matches(keyword))}
            emptyText=${keyword ? t.emptySearch : COPY.holdings.empty}
          />`}
          ${sub === 'history' && html`<${CollateralHistory} records=${account.collateralRecords} />`}
        </div>
      `}

      ${tab === 'statement' && html`<${EmptyState} text=${t.statementNotAvailable} />`}

      <${RepayMethodSheet} open=${!!repayLoan} loanId=${repayLoan?.id} onClose=${() => setRepayLoan(null)} />
    </div>
  `;
}
