// 可借貸額度試算：輸入擔保品與張數｜Figma 3131:188036 / 3131:187886
// 放在股票借貸專區「試算」頁籤；「試算」按鈕由專區頁放在 BottomActions（canSimulate 判斷是否可按）
import { html, useState } from '../../lib/preact.js';
import { PickerField, NumberField, Button, Icon } from '../../components/index.js';
import { useStore, updateSimDraft } from '../../store.js';
import { stockOf } from '../../lib/calc.js';
import { num } from '../../lib/format.js';
import { COPY } from '../../content/copy.js';
import { StockPickerSheet } from './StockPickerSheet.js';

const EMPTY = { code: null, lots: null };
const MAX_LOTS = 9999;

/** 草稿裡的擔保品（至少一列） */
export function simItems(draft) {
  return draft?.items?.length ? draft.items : [EMPTY];
}

/** 至少一列填完整、且沒有填一半的列，才能試算 */
export function canSimulate(items) {
  const filled = items.filter((i) => i.code || i.lots);
  return filled.length > 0 && filled.every((i) => i.code && i.lots > 0);
}

export function SimulateForm() {
  const t = COPY.simulate;
  const draft = useStore((s) => s.simDraft);
  const holdings = useStore((s) => s.account.holdings);
  const items = simItems(draft);
  const [picking, setPicking] = useState(null); // 正在選標的的那一列
  const single = items.length === 1; // 只剩一檔時不能移除

  const save = (next) => updateSimDraft({ items: next });
  const setItem = (i, patch) => save(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const remove = (i) => save(items.filter((_, k) => k !== i));
  const held = (code) => holdings.find((h) => h.code === code)?.lots ?? 0;

  return html`
    <div class="sim-form">
      <p class="sim-form__intro t-body-regular c-secondary">${t.intro}</p>

      ${items.map((it, i) => {
        const stock = it.code && stockOf(it.code);
        return html`
          <section class="card card--full sim-item">
            <div class="sim-item__head">
              <p class="t-body-bold c-primary">${t.itemLabel(i + 1)}</p>
              <button
                class=${'t-body-regular ' + (single ? 'c-disabled' : 'c-negative')}
                disabled=${single}
                onClick=${() => remove(i)}
              >${t.remove}</button>
            </div>
            <${PickerField}
              displayValue=${stock && `${stock.name} ${it.code}`}
              placeholder=${t.pickPlaceholder}
              onOpen=${() => setPicking(i)}
              hint=${stock && t.holdingHint(num(stock.price), held(it.code) ? num(held(it.code)) : null)}
            />
            <${NumberField}
              label=${t.lotsLabel}
              value=${it.lots}
              onChange=${(lots) => setItem(i, { lots })}
              placeholder=${t.lotsPlaceholder}
              suffix=${t.lotUnit}
              max=${MAX_LOTS}
            />
          </section>
        `;
      })}

      <div class="sim-form__add">
        <${Button} variant="text" onClick=${() => save([...items, EMPTY])}>
          <span class="icon-text--body"><${Icon} name="add.svg" level="body" tint />${t.add}</span>
        <//>
      </div>

      <${StockPickerSheet}
        open=${picking != null}
        exclude=${items.filter((_, k) => k !== picking).map((it) => it.code).filter(Boolean)}
        onSelect=${(code) => {
          setItem(picking, { code });
          setPicking(null);
        }}
        onClose=${() => setPicking(null)}
      />
    </div>
  `;
}
