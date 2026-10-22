// 借新還舊完成頁｜Figma 1804:117210
// 「查看借款紀錄」→ 股票借貸明細 › 借還款紀錄 › 借款，並展開新的借款契約
import { html } from '../../lib/preact.js';
import { ResultPage } from '../../components/index.js';
import { exitFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function RefinanceResult({ query }) {
  const t = COPY.refinance;
  const records = `/records?tab=loans&sub=borrow${query.loan ? `&open=${query.loan}` : ''}`;
  return html`
    <${ResultPage}
      header=${t.title}
      title=${t.resultTitle}
      desc=${t.resultDesc}
      primary=${{ label: t.viewRecords, onClick: () => exitFlow(records) }}
      secondary=${{ label: COPY.common.done, onClick: () => exitFlow() }}
    />
  `;
}
