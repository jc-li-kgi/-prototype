// 維持率與市值關係圖（可點 4 個點查看）｜Figma 3139:188990 › 追繳評估圖表
// 以 y 軸（維持率）為基準取點：起點（初始維持率）、160%、150%、140%、130%（追繳線）
//   每個點顯示「維持率降到這裡時，股票市值跌了多少」，重點是 130% 追繳點
// y 軸：下緣固定 120%，上緣至少 160%（Figma），起始維持率更高時往上延伸，每 10% 一條線
//   兩軸都固定比例（每 10% 維持率 42px、每 10% 跌幅 40px），所以線是同一斜率的直線
// x 軸：市值跌幅 0 ~ -40%，整數刻度；點落在刻度之間沒關係
// 追繳線以下（< 130%）為橘色區，線條在追繳點之後改為橘色
import { html, useState } from '../../lib/preact.js';
import { LOAN_RULES } from '../../lib/calc.js';
import { COPY } from '../../content/copy.js';

const W = 311;          // 圖寬（與卡片內容同寬）
const PLOT_W = 265;     // 格線寬，右側放百分比
const ROW = 42;         // 每 10% 的高度（Figma）
const PAD_TOP = 32;     // 起點在最上面一條線上方時的空間
const X0 = 68;          // 市值 0% 的 x（左邊留給「市值(％)」）
const X_PER_10 = 40;    // 每 -10% 的距離
const TICKS = [0, 0.1, 0.2, 0.3, 0.4];
const xOf = (drop) => X0 + drop * 10 * X_PER_10;
const LEVELS = [160, 150, 140, 130]; // 起點之外可查看的維持率
const MIN_TOP = 160;
const BOTTOM = 120;

/** <RatioChart ratio=${166.7} /> */
export function RatioChart({ ratio }) {
  const t = COPY.simulate;
  const call = LOAN_RULES.callRatio;
  // 點：起點 + 低於起點的 160 / 150 / 140 / 130%；drop = 維持率降到該值時的市值跌幅
  const points = [{ level: ratio, drop: 0 }, ...LEVELS.filter((v) => v < ratio).map((v) => ({ level: v, drop: 1 - v / ratio }))];
  const [sel, setSel] = useState(0);

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

  // 線：經過各點到 130%，之後延伸到格線右端（橘色）
  const endLevel = ratio * (1 - (PLOT_W - X0) / (10 * X_PER_10));
  const p = (level) => `${xAt(level)},${yAt(level)}`;
  const selPoint = points[sel];
  const selDrop = selPoint.drop;
  const selRatio = Math.floor(selPoint.level); // 維持率一律無條件捨去（同 calc.maintenanceRatio）
  const danger = selRatio <= call;

  return html`
    <div class="ratio-chart">
      <svg viewBox=${`0 0 ${W} ${H}`} width="100%" role="img" aria-label="維持率與市值關係">
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
        ${TICKS.map(
          (d) => html`<text class="ratio-chart__label n-caption-regular" x=${xOf(d)} y=${plotBottom + 22} text-anchor="middle">${d ? `-${Math.round(d * 100)}` : '0'}</text>`
        )}

        <!-- 可點的 4 個點（依維持率取點） -->
        ${points.map(
          ({ level, drop }, i) => html`
            <g class=${'ratio-chart__point' + (i === sel ? ' ratio-chart__point--active' : '') + (level <= call ? ' ratio-chart__point--danger' : '')}
              role="button" tabindex="0" aria-label=${`${t.tipDrop(Math.round(drop * 100))}，${t.tipRatio(Math.floor(level))}`}
              onClick=${() => setSel(i)} onKeyDown=${(e) => (e.key === 'Enter' || e.key === ' ') && setSel(i)}>
              <circle class="ratio-chart__hit" cx=${xAt(level)} cy=${yAt(level)} r="14" />
              <circle class="ratio-chart__halo" cx=${xAt(level)} cy=${yAt(level)} r="7" />
              <circle class="ratio-chart__dot" cx=${xAt(level)} cy=${yAt(level)} r="4" />
            </g>
          `
        )}
      </svg>

      <!-- 追繳說明（疊在橘色區上） -->
      <p class="ratio-chart__call t-caption-regular c-secondary" style=${`top:${(yOf(call) / H) * 100}%`}>
        ${t.chartCall(call, LOAN_RULES.recoverRatio)[0]}<br />${t.chartCall(call, LOAN_RULES.recoverRatio)[1]}
      </p>

      <!-- 選中點的數值 -->
      <div
        class=${'ratio-chart__tip' + (xAt(selPoint.level) > W / 2 ? ' ratio-chart__tip--left' : '')}
        style=${`left:${(xAt(selPoint.level) / W) * 100}%;top:${(yAt(selPoint.level) / H) * 100}%`}
      >
        <p class=${'t-caption-regular ' + (danger ? 'c-warning' : 'c-descend')}>${t.tipDrop(Math.round(selDrop * 100))}</p>
        <p class="t-caption-regular c-primary">${t.tipRatio(selRatio)}</p>
      </div>
    </div>
  `;
}
