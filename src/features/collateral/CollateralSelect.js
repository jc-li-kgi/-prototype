// 匯入擔保品 第 1 步：從庫存選擇要匯入的股票與張數
// 網址可帶 ?code=0050，預先勾選該檔
//   匯入擔保品流程（collateralIn）帶 code：只顯示這一檔（明細 / 專區列表的「匯入」按鈕），預設 1 張
//   首次借款（newAccountLoan）帶 code：點專區的精選擔保品進來，列出全部庫存、預先勾選該檔全部張數（與精選卡的可借款一致）
//   首次借款（newAccountLoan）：「僅可用於提升維持率」不能勾選（還沒有借款，匯入無法提升維持率）
import { html, useState } from '../../lib/preact.js';
import {
  FlowPage, AccountPicker, FilterPill, SearchIcon, CheckboxHeader, SelectableItem, StockName, SectionHeader, DetailRow,
  QtyStepper, Button, TotalBar, Sheet, SheetOptions, InfoDialog,
} from '../../components/index.js';
import { useStore, updateCollateralDraft, showToast } from '../../store.js';
import { flowPosition, nextStep, prevStep, flowTitle, isFlow } from '../../flows/flows.js';
import { stockOf, perLotLoan, loanableOf, groupHoldings, HOLDING_SORTS } from '../../lib/calc.js';
import { twd, num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';

const PATH = '/collateral-in/select';

function initialSelection(draft, query, importable) {
  // 帶 code 進來：重新開始，只勾這一檔（首次借款帶全部張數，匯入擔保品帶 1 張）
  const h = importable.find((x) => x.code === query.code);
  if (h) return { [h.code]: isFlow('newAccountLoan') ? h.lots : 1 };
  return draft.selected || {};
}

export function CollateralSelect({ query }) {
  const account = useStore((s) => s.account);
  const draft = useStore((s) => s.collateralDraft);
  const t = COPY.collateral;
  const groups = groupHoldings(account);
  const firstLoan = isFlow('newAccountLoan');
  const importable = firstLoan ? groups.eligible : [...groups.eligible, ...groups.ratioOnly];
  // 單檔模式：匯入擔保品流程從列表帶 code 進來（返回此頁時從草稿帶回）
  const singleCode = isFlow('collateralIn') ? query.code ?? draft.single : null;
  const single = importable.some((h) => h.code === singleCode) ? singleCode : null;
  const only = (list) => (single ? list.filter((h) => h.code === single) : list);

  const [sort, setSort] = useState(draft.sort ?? HOLDING_SORTS[0].value);
  const [selected, setSelected] = useState(() => initialSelection(draft, query, importable));
  const [sortOpen, setSortOpen] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const sortDef = HOLDING_SORTS.find((s) => s.value === sort);
  const eligible = only([...groups.eligible].sort(sortDef.fn));
  const ratioOnly = only([...groups.ratioOnly].sort(sortDef.fn)); // 僅可提升維持率：可匯入，但不增加可借額度
  const ineligible = single ? [] : groups.ineligible;
  const items = Object.entries(selected).map(([code, lots]) => ({ code, lots }));
  const total = loanableOf(items);
  const notAvailable = () => showToast(COPY.common.notAvailable);

  const toggle = (code, on) =>
    setSelected((s) => {
      const next = { ...s };
      if (on) next[code] = 1;
      else delete next[code];
      return next;
    });
  // 全選（各群組各自一個）：每檔帶入全部可擔保張數；不影響其他群組的勾選
  const toggleAll = (list, on) =>
    setSelected((s) => {
      const next = { ...s };
      list.forEach((h) => (on ? (next[h.code] = h.lots) : delete next[h.code]));
      return next;
    });
  const allOf = (list) => list.length > 0 && list.every((h) => selected[h.code]);
  const setLots = (code, lots) => setSelected((s) => ({ ...s, [code]: lots }));

  const submit = () => {
    updateCollateralDraft({ selected, sort, single });
    nextStep(PATH);
  };

  // 群組標題；給 list 時有全選勾選框（CheckboxHeader）。單檔匯入不顯示
  const groupHead = (key, count, { list, desc = t.groups[key].desc } = {}) => {
    if (single) return null;
    const title = `${t.groups[key].title} (${count})`;
    return html`
      <div class="coll-group__head">
        ${list
          ? html`<${CheckboxHeader}
              title=${title}
              desc=${desc}
              checked=${allOf(list)}
              disabled=${!list.length}
              onChange=${(on) => toggleAll(list, on)}
              label=${`全選${t.groups[key].title}`}
            />`
          : html`<${SectionHeader} title=${title} desc=${desc} descClass="t-caption-regular" />`}
      </div>
    `;
  };

  const lotsRow = (h) => html`<${DetailRow} label=${t.availableLots} value=${num(h.lots)} />`;

  // 勾選後出現的匯入張數
  const qtyRow = (h) =>
    selected[h.code] &&
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
    `;

  return html`
    <${FlowPage}
      title=${flowTitle(t.title)}
      step=${flowPosition(PATH)}
      onBack=${() => prevStep(PATH)}
      sticky=${html`
        <${TotalBar}
          label=${t.total}
          info=${t.totalSheet}
          value=${twd(total)}
          expanded=${breakdownOpen}
          onToggle=${() => setBreakdownOpen(!breakdownOpen)}
        >
          <p class="t-body-bold c-primary">${t.breakdownTitle}</p>
          ${items.length === 0
            ? html`<p class="t-body-regular c-secondary">${t.noneSelected}</p>`
            : items.map(
                (i) => html`<${DetailRow} label=${`${stockOf(i.code).name} ${i.code}`} value=${`${num(i.lots)} ${t.lotUnit}`} valueClass="t-body-regular" />`
              )}
        <//>
        <${Button} disabled=${items.length === 0} onClick=${submit}>${COPY.common.next}<//>
      `}
    >
      <div class="coll-list">
        <!-- 單檔匯入：只顯示該檔，不需要帳號、排序、搜尋 -->
        ${!single &&
        html`
          <div class="coll-toolbar">
            <${AccountPicker} account=${account} onClick=${notAvailable} />
            <div class="coll-toolbar__filters">
              <${FilterPill} label=${sortDef.label} onClick=${() => setSortOpen(true)} />
              <button class="icon-btn" onClick=${notAvailable} aria-label="搜尋"><${SearchIcon} /></button>
            </div>
          </div>
        `}

        <div class="coll-groups">
          <!-- 可借貸 -->
          ${(!single || eligible.length > 0) &&
          html`
          <section class="coll-group">
            ${groupHead('eligible', eligible.length, { list: eligible })}
            <div class="card card--full coll-card">
              ${eligible.map(
                (h) => html`
                  <${SelectableItem} checked=${!!selected[h.code]} onChange=${(on) => toggle(h.code, on)} label=${stockOf(h.code).name}>
                    <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                    ${lotsRow(h)}
                    <${DetailRow} label=${t.perLot} value=${num(perLotLoan(h.code))} />
                    <${DetailRow} label=${t.ratio} value=${`${Math.round(stockOf(h.code).ratio * 100)}%`} />
                    ${qtyRow(h)}
                  <//>
                `
              )}
            </div>
          </section>
          `}

          <!-- 僅可用於提升維持率 -->
          ${ratioOnly.length > 0 &&
          html`
            <section class="coll-group">
              ${firstLoan
                ? groupHead('ratioOnly', ratioOnly.length)
                : groupHead('ratioOnly', ratioOnly.length, { list: ratioOnly, desc: t.groups.ratioOnly.descImport })}
              <div class=${'card card--full coll-card' + (firstLoan ? ' coll-card--disabled' : '')}>
                ${ratioOnly.map((h) =>
                  firstLoan
                    ? html`
                        <${SelectableItem} disabled label=${stockOf(h.code).name}>
                          <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                          ${lotsRow(h)}
                        <//>
                      `
                    : html`
                        <${SelectableItem} checked=${!!selected[h.code]} onChange=${(on) => toggle(h.code, on)} label=${stockOf(h.code).name}>
                          <${StockName} inline name=${stockOf(h.code).name} code=${h.code} />
                          ${lotsRow(h)}
                          ${qtyRow(h)}
                        <//>
                      `
                )}
              </div>
            </section>
          `}

          <!-- 無法作為擔保品 -->
          ${ineligible.length > 0 &&
          html`
            <section class="coll-group">
              ${groupHead('ineligible', ineligible.length)}
              <div class="card card--full coll-card coll-card--disabled">
                ${ineligible.map(
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

      <${InfoDialog} info=${info} onClose=${() => setInfo(null)} />
    <//>
  `;
}
