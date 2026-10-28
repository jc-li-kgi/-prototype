// 擔保品歷史紀錄（股票借貸明細 › 擔保品 › 歷史紀錄）｜Figma 3060:66168
// 每檔一筆：商品名稱 / 狀態（成功、失敗、處理中）/ 異動類型＋張數，可展開看申請時間、序號、管道
// 篩選（近一月、全部類型）本次測試不開放；商品名稱欄可依代碼排序
import { html, useState } from '../../lib/preact.js';
import { ListTable, ListRow, StockName, DetailRow, FilterPill } from '../../components/index.js';
import { showToast } from '../../store.js';
import { stockOf } from '../../lib/calc.js';
import { num, dateTime } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const ALIGN = ['left', 'left', 'right'];

/** 申請時間：日期 + 時間（兩行） */
export function appliedAtLines(iso) {
  const [day, time] = dateTime(new Date(iso)).split(' ');
  return html`<p>${day}</p><p>${time}</p>`;
}

export function CollateralHistory({ records = [] }) {
  const t = COPY.records;
  const d = t.historyDetail;
  const [open, setOpen] = useState(null);
  const [sort, setSort] = useState(null);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  // 預設最新的在最上面；依代碼排序時同代碼仍是新的在前
  const rows = [...records].sort((a, b) =>
    sort === 'code' ? a.code.localeCompare(b.code) || b.appliedAt.localeCompare(a.appliedAt) : b.appliedAt.localeCompare(a.appliedAt)
  );

  // 放在明細頁的 .records-section 裡（子頁籤下方），篩選列與列表各自是一個區塊
  return html`
      <div class="records-section__controls">
        <div class="records-filters">
          ${t.historyFilters.map((label) => html`<${FilterPill} label=${label} onClick=${notAvailable} />`)}
        </div>
      </div>

      <${ListTable}
        columns=${[
          { label: html`${t.colHistoryName[0]}<br />${t.colHistoryName[1]}`, sortKey: 'code' },
          { label: t.colHistoryStatus, width: '64px' },
          { label: html`${t.colHistoryType[0]}<br />${t.colHistoryType[1]}`, width: '96px', align: 'right' },
        ]}
        expandable
        sort=${sort}
        onSort=${setSort}
        empty=${t.emptyHistory}
      >
        ${rows.map((r) => {
          const stock = stockOf(r.code);
          return html`
            <${ListRow}
              align=${ALIGN}
              cells=${[
                html`<${StockName} name=${stock.name} code=${r.code} />`,
                html`<p class=${'t-body-regular ' + (r.status === '失敗' ? 'c-negative' : 'c-primary')}>${r.status}</p>`,
                html`
                  <p class="t-body-regular c-primary">${r.type}</p>
                  <p class="t-body-regular c-primary nowrap">${t.lots(num(r.lots))}</p>
                `,
              ]}
              expanded=${open === r.id}
              onToggle=${() => setOpen(open === r.id ? null : r.id)}
              detail=${html`
                <${DetailRow} label=${d.name} value=${stock.name} valueClass="t-body-regular text-wrap" />
                <${DetailRow} label=${d.appliedAt} value=${appliedAtLines(r.appliedAt)} />
                <${DetailRow} label=${d.serial} value=${r.id} />
                <${DetailRow} label=${d.channel} value=${r.channel} />
              `}
            />
          `;
        })}
      <//>
  `;
}
