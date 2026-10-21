// 維持率與市值關係圖（沿著線拖拉查看）｜Figma 3139:188990 › 追繳評估圖表
// 在圖上左右拖拉（或點一下），圓點沿著線移動，每次 1% 市值跌幅，顯示該跌幅下的維持率
//   預設停在 130% 追繳點；線上只標起點，中間不放節點
//   鍵盤：圓點聚焦後用 ← → 移動
// y 軸：下緣固定 120%，上緣至少 160%（Figma），起始維持率更高時往上延伸，每 10% 一條線
//   y 軸固定比例（每 10% 維持率 42px），所以線是同一斜率的直線
// x 軸：市值跌幅 0 ~（初始維持率跌到 120% 的跌幅），線剛好落在右下角
//   成數 60%、初始維持率 166% 時 = 0 ~ -28%；刻度每 10% 一個（整數），點落在刻度之間沒關係
// 追繳線以下（< 130%）為橘色區，線條在追繳點之後改為橘色
import { html, useState, useRef } from '../../lib/preact.js';
import { LOAN_RULES } from '../../lib/calc.js';
import { COPY } from '../../content/copy.js';

const W = 311;          // 圖寬（與卡片內容同寬）
const PLOT_W = 265;     // 格線寬，右側放百分比
const ROW = 42;         // 每 10% 的高度（Figma）
const PAD_TOP = 32;     // 起點在最上面一條線上方時的空間
const X0 = 68;          // 市值 0% 的 x（左邊留給「市值(％)」）
const LEVELS = [160, 150, 140, 130]; // 起點之外可查看的維持率
const MIN_TOP = 160;
const BOTTOM = 120;

/** <RatioChart ratio=${166.7} /> */
export function RatioChart({ ratio }) {
  const t = COPY.simulate;
  const call = LOAN_RULES.callRatio;
  // x 軸右端 = 維持率跌到 y 軸下緣（120%）時的市值跌幅 → 線對到右下角
  const dropEnd = 1 - BOTTOM / ratio;
  const xOf = (drop) => X0 + (drop / dropEnd) * (PLOT_W - X0);
  const ticks = [];
  for (let d = 0; d <= dropEnd + 1e-9; d += 0.1) ticks.push(d);
  // 點：起點 + 低於起點的 160 / 150 / 140 / 130%；drop = 維持率降到該值時的市值跌幅
  const points = [{ level: ratio, drop: 0 }, ...LEVELS.filter((v) => v < ratio).map((v) => ({ level: v, drop: 1 - v / ratio }))];
  // 拖拉的位置：市值跌幅（整數 %），0 ~ maxPct
  //   預設停在追繳點（130%），一打開就看到「跌多少會被追繳」；起始維持率已低於追繳線時停在起點
  const maxPct = Math.floor(dropEnd * 100 + 1e-9);
  const [pct, setPct] = useState(Math.max(0, Math.round((1 - call / ratio) * 100)));
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const clampPct = (v) => Math.min(maxPct, Math.max(0, v));
  const pctFromEvent = (e) => {
    const box = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    return clampPct(Math.round(((x - X0) / (PLOT_W - X0)) * dropEnd * 100));
  };
  const onDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setPct(pctFromEvent(e));
  };
  const onMove = (e) => dragging.current && setPct(pctFromEvent(e));
  const onUp = () => (dragging.current = false);
  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    setPct((v) => clampPct(v + step));
  };

  // 起點可以略高於最上面一條線（Figma：166% 在 160% 線上方），超過 7% 才多加一條
  const top = Math.max(MIN_TOP, Math.ceil((ratio - 7) / 10) * 10);
  const bottom = BOTTOM;
  const levels = [];
  for (let v = top; v >= bottom; v -= 10) levels.push(v);
  const yOf = (v) => PAD_TOP + ((top - v) / 10) * ROW;
  // 點的座標：x = 市值跌幅、y = 維持率
  const xAt = (level) => xOf(Math.max(0, 1 - level / ratio));
  const yAt = (level) => yOf(level);
  const plotBottom = yOf(bottom);
  const H = plotBottom + 32;

  // 線：經過各點到 130%，之後延伸到右下角（橘色）
  const endLevel = BOTTOM;
  const p = (level) => `${xAt(level)},${yAt(level)}`;
  const selLevel = ratio * (1 - pct / 100);
  const selRatio = Math.floor(selLevel + 1e-9); // 維持率一律無條件捨去（同 calc.maintenanceRatio）；1e-9 避免 130 算成 129.999
  const danger = selRatio <= call;
  const selX = xOf(pct / 100);
  const selY = yOf(selLevel);

  return html`
    <div class="ratio-chart">
      <svg
        ref=${svgRef}
        class="ratio-chart__svg"
        viewBox=${`0 0 ${W} ${H}`}
        width="100%"
        aria-label="維持率與市值關係"
        onPointerDown=${onDown}
        onPointerMove=${onMove}
        onPointerUp=${onUp}
        onPointerCancel=${onUp}
      >
        <defs>
          <clipPath id="ratio-chart-plot"><rect x="0" y="0" width=${PLOT_W} height=${plotBottom + 1} /></clipPath>
        </defs>

        <!-- 追繳區（維持率 < 130%） -->
        <rect class="ratio-chart__zone" x="0" y=${yOf(call)} width=${PLOT_W} height=${plotBottom - yOf(call)} />

        <!-- 格線 + 右側百分比 -->
        ${levels.map(
          (v) => html`
            <line class=${'ratio-chart__grid' + (v === call ? ' ratio-chart__grid--call' : '')} x1="0" x2=${PLOT_W} y1=${yOf(v)} y2=${yOf(v)} />
            <text class="ratio-chart__label n-caption-regular" x=${W} y=${yOf(v)} text-anchor="end" dominant-baseline="middle">${v}%</text>
          `
        )}

        <!-- 線：追繳點前深藍、之後橘色 -->
        <g clip-path="url(#ratio-chart-plot)">
          <polyline class="ratio-chart__line" points=${points.map((pt) => p(pt.level)).join(' ')} />
          <polyline class="ratio-chart__line ratio-chart__line--danger" points=${`${p(call)} ${p(endLevel)}`} />
        </g>

        <!-- x 軸 -->
        <text class="ratio-chart__label t-caption-regular" x="0" y=${plotBottom + 22}>${t.chartX}</text>
        ${ticks.map(
          (d) => html`<text class="ratio-chart__label n-caption-regular" x=${xOf(d)} y=${plotBottom + 22} text-anchor="middle">${d ? `-${Math.round(d * 100)}` : '0'}</text>`
        )}

        <!-- 起點（中間不放節點） -->
        <circle class="ratio-chart__dot" cx=${xAt(ratio)} cy=${yAt(ratio)} r="4" />

        <!-- 拖拉的圓點｜Figma .Base/Line dots-Desktop/Mobile：外圈 r7 20%、內圈 r4 實心 -->
        <g
          class=${'ratio-chart__handle' + (danger ? ' ratio-chart__handle--danger' : '')}
          role="slider" tabindex="0"
          aria-valuemin="0" aria-valuemax=${maxPct} aria-valuenow=${pct}
          aria-valuetext=${`${t.tipDrop(pct)}，${t.tipRatio(selRatio)}`}
          onKeyDown=${onKey}
        >
          <circle class="ratio-chart__halo" cx=${selX} cy=${selY} r="7" />
          <circle class="ratio-chart__knob" cx=${selX} cy=${selY} r="4" />
        </g>
      </svg>

      <!-- 追繳說明（疊在橘色區上） -->
      <p class="ratio-chart__call t-caption-regular c-secondary" style=${`top:${(yOf(call) / H) * 100}%`}>
        ${t.chartCall(call, LOAN_RULES.recoverRatio)[0]}<br />${t.chartCall(call, LOAN_RULES.recoverRatio)[1]}
      </p>

      <!-- 圓點位置的數值 -->
      <div
        class=${'ratio-chart__tip' + (selX > W / 2 ? ' ratio-chart__tip--left' : '')}
        style=${`left:${(selX / W) * 100}%;top:${(selY / H) * 100}%`}
      >
        <p class=${'t-caption-regular ' + (danger ? 'c-warning' : 'c-descend')}>${t.tipDrop(pct)}</p>
        <p class="t-caption-regular c-primary">${t.tipRatio(selRatio)}</p>
      </div>
    </div>
  `;
}
