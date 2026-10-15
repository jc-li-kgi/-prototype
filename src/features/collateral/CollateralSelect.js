// 匯入擔保品 第 1 步：從庫存選擇要匯入的股票與張數
// 網址可帶 ?code=2330，預先勾選該檔（專區、明細頁的「匯入」按鈕會帶）
import { html, useState } from '../../lib/preact.js';
import {
  FlowPage, AccountPicker, FilterPill, SearchIcon, Checkbox, SelectableItem, StockName, SectionHeader, DetailRow,
  QtyStepper, Button, TotalBar, Sheet, SheetOptions, InfoSheet,
} from '../../components/index.js';
import { useStore, updateCollateralDraft, showToast } from '../../store.js';
import { flowPosition, nextStep, prevStep, flowTitle } from '../../flows/flows.js';
import { stockOf, perLotLoan, loanableOf, groupHoldings, HOLDING_SORTS } from '../../lib/calc.js';
import { twd, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/collateral-in/select';

function initialSelection(draft, query, eligible) {
  if (draft.selected) return draft.selected;
  const h = eligible.find((x) => x.code === query.code);
  return h ? { [h.code]: 1 } : {};
}

export function CollateralSelect({ query }) {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.collateralDraft);
  const t = COPY.collateral;
  const groups = groupHoldings(account);

  const [sort, setSort] = useState(draft.sort ?? HOLDING_SORTS[0].value);
  const [selected, setSelected] = useState(() => initialSelection(draft, query, groups.eligible));
  const [sortOpen, setSortOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const sortDef = HOLDING_SORTS.find((s) => s.value === sort);
  const eligible = [...groups.eligible].sort(sortDef.fn);
  const items = Object.entries(selected).map(([code, lots]) => ({ code, lots }));
  const total = loanableOf(items);
  const allChecked = eligible.length > 0 && eligible.every((h) => selected[h.code]);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const toggle = (code, on) =>
    setSelected((s) => {
      const next = { ...s };
      if (on) next[code] = 1;
      else delete next[code];
      return next;
    });
  // 全選：每檔帶入全部可擔保張數
  const toggleAll = (on) => setSelected(on ? Object.fromEntries(eligible.map((h) => [h.code, h.lots])) : {});
  const setLots = (code, lots) => setSelected((s) => ({ ...s, [code]: lots }));

  const submit = () => {
    updateCollateralDraft({ selected, sort });
    nextStep(PATH);
  };

  const groupHead = (key, count, leading) => html`
    <div class="coll-group__head">
      <${SectionHeader}
        title=${`${t.groups[key].title} (${count})`}
        leading=${leading}
        desc=${t.groups[key].desc}
        descClass="t-caption-regular"
      />
    </div>
  `;

  const lotsRow = (h) => html`<${DetailRow} label=${t.availableLots} value=${num(h.lots)} />`;

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      sticky=${html`
        <${TotalBar} label=${t.total} info=${t.totalSheet} value=${twd(total)} onExpand=${() => setBreakdownOpen(true)} />
        <${Button} disabled=${items.length === 0} onClick=${submit}>${COPY.common.next}<//>
      `}
    >
      <div class="coll-list">
        <div class="coll-toolbar">
          <${AccountPicker} account=${account} onClick=${notAvailable} />
          <div class="coll-toolbar__filters">
            <${FilterPill} label=${sortDef.label} onClick=${() => setSortOpen(true)} />
            <button class="icon-btn" onClick=${notAvailable} aria-label="搜尋"><${SearchIcon} /></button>
          </div>
        </div>

        <div class="coll-groups">
          <!-- 可借貸 -->
          <section class="coll-group">
            ${groupHead('eligible', eligible.length, html`
              <${Checkbox} checked=${allChecked} disabled=${!eligible.length} onChange=${toggleAll} label="全選可借貸" />
            `)}
            <div class="card card--full coll-card">
              ${eligible.map(
                (h) => html`
                  <${SelectableItem} checked=${!!selected[h.code]} onChange=${(on) => toggle(h.code, on)} label=${stockOf(h.code).name}>
                    <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                    ${lotsRow(h)}
                    <${DetailRow} label=${t.perLot} value=${num(perLotLoan(h.code))} />
                    <${DetailRow} label=${t.ratio} value=${`${Math.round(stockOf(h.code).ratio * 100)}%`} />
                    ${selected[h.code] &&
                    html`
                      <div class="coll-qty">
                        <span class="t-body-regular c-secondary nowrap">${t.importLots}</span>
                        <${QtyStepper}
                          value=${selected[h.code]}
                          min=${1}
                          max=${h.lots}
                          unit=${t.lotUnit}
                          label=${t.importLots}
                          onChange=${(n) => setLots(h.code, n)}
                        />
                      </div>
                    `}
                  <//>
                `
              )}
            </div>
          </section>

          <!-- 僅可用於提升維持率 -->
          ${groups.ratioOnly.length > 0 &&
          html`
            <section class="coll-group">
              ${groupHead('ratioOnly', groups.ratioOnly.length)}
              <div class="card card--full coll-card coll-card--disabled">
                ${groups.ratioOnly.map(
                  (h) => html`
                    <${SelectableItem} disabled label=${stockOf(h.code).name}>
                      <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                      ${lotsRow(h)}
                    <//>
                  `
                )}
              </div>
            </section>
          `}

          <!-- 無法作為擔保品 -->
          ${groups.ineligible.length > 0 &&
          html`
            <section class="coll-group">
              ${groupHead('ineligible', groups.ineligible.length)}
              <div class="card card--full coll-card coll-card--disabled">
                ${groups.ineligible.map(
                  (h) => html`
                    <${SelectableItem} disabled label=${stockOf(h.code).name}>
                      <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                      <p class="t-body-regular">${t.reason}${stockOf(h.code).reason}</p>
                    <//>
                  `
                )}
              </div>
            </section>
          `}

          <${Button} variant="text" onClick=${() => setInfo(t.notesSheet)}>${t.notes}<//>
        </div>
      </div>

      <${Sheet} open=${sortOpen} title=${t.sortTitle} onClose=${() => setSortOpen(false)}>
        <${SheetOptions}
          options=${HOLDING_SORTS}
          value=${sort}
          onSelect=${(v) => { setSort(v); setSortOpen(false); }}
        />
      <//>

      <${Sheet} open=${breakdownOpen} title=${t.breakdownTitle} onClose=${() => setBreakdownOpen(false)}>
        ${items.length === 0
          ? html`<p class="t-body-regular c-secondary sheet__body">${t.noneSelected}</p>`
          : html`
              <div class="coll-breakdown">
                ${items.map(
                  (i) => html`
                    <${DetailRow}
                      label=${`${stockOf(i.code).name} ${i.code} × ${i.lots} ${t.lotUnit}`}
                      value=${twd(i.lots * perLotLoan(i.code))}
                    />
                  `
                )}
                <${DetailRow} label=${t.total} labelClass="t-body-bold c-primary" value=${twd(total)} valueClass="n-subtitle-bold" />
              </div>
            `}
      <//>

      <${InfoSheet} info=${info} onClose=${() => setInfo(null)} />
    <//>
  `;
}
