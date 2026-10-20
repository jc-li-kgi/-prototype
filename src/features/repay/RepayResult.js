// 現金還款完成頁｜Figma 3089:63010
// 「查看還款紀錄」→ 股票借貸明細 › 借還款紀錄 › 還款，並展開剛送出的那一筆
import { html } from '../../lib/preact.js';
import { ResultPage } from '../../components/index.js';
import { exitFlow } from '../../flows/flows.js';
import { COPY } from '../../content/copy.js';

export function RepayResult({ query }) {
  const t = COPY.repay;
  const records = `/records?tab=loans&sub=repay${query.record ? `&open=${query.record}` : ''}`;
  return html`
    <${ResultPage}
      header=${t.resultHeader}
      title=${t.resultTitle}
      desc=${t.resultDesc}
      primary=${{ label: t.viewRecords, onClick: () => exitFlow(records) }}
      secondary=${{ label: COPY.common.done, onClick: () => exitFlow() }}
    />
  `;
}
