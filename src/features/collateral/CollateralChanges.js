// 單檔擔保品異動明細｜Figma 1786:98330
// 網址：#/records/collateral-changes?code=0050（從已擔保展開明細的「查看異動明細」進來；&back= 沿用明細頁的返回頁）
// 列表：異動日＋狀態（交易成功 / 匯入失敗…）／動作類別＋張數，展開看申請日、申請時間、序號、管道
import { html, useState } from '../../lib/preact.js';
import { PageHeader, ListTable, ListRow, DetailRow } from '../../components/index.js';
import { useStore } from '../../store.js';
import { navigate } from '../../router.js';
import { stockOf } from '../../lib/calc.js';
import { num, dateTimeParts } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const ALIGN = ['left', 'right'];

export function CollateralChanges({ query }) {
  const t = COPY.records;
  const c = t.changes;
  const records = useStore((s) => s.account.collateralRecords || []);
  const [open, setOpen] = useState(null);
  const stock = stockOf(query.code);
  const rows = records.filter((r) => r.code === query.code).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  const back = () => navigate(`/records?tab=collateral&sub=pledged${query.back ? `&back=${query.back}` : ''}`, { replace: true });

  return html`
    <div class="page records-page">
      <${PageHeader} title=${c.title} onBack=${back} showShare=${false} />

      <p class="changes-title t-title c-primary">${stock.name} ${query.code}</p>

      <${ListTable}
        columns=${[
          { label: html`${c.colDate[0]}<br />${c.colDate[1]}` },
          { label: html`${c.colType[0]}<br />${c.colType[1]}`, width: '110px', align: 'right' },
        ]}
        expandable
        empty=${c.empty}
      >
        ${rows.map((r) => {
          const [day, time] = dateTimeParts(r.appliedAt);
          return html`
            <${ListRow}
              align=${ALIGN}
              cells=${[
                html`
                  <p class="n-body-regular c-primary">${day}</p>
                  <p class=${'t-body-regular ' + (r.status === '失敗' ? 'c-negative' : 'c-primary')}>${c.status(r)}</p>
                `,
                html`
                  <p class="t-body-regular c-primary">${r.type}</p>
                  <p class="t-body-regular c-primary nowrap">${t.lots(num(r.lots))}</p>
                `,
              ]}
              expanded=${open === r.id}
              onToggle=${() => setOpen(open === r.id ? null : r.id)}
              detail=${html`
                <${DetailRow} label=${c.detail.applyDate} value=${day} />
                <${DetailRow} label=${c.detail.applyTime} value=${time} />
                <${DetailRow} label=${c.detail.serial} value=${r.id} />
                <${DetailRow} label=${c.detail.channel} value=${r.channel} />
              `}
            />
          `;
        })}
      <//>
    </div>
  `;
}
