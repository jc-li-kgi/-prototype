// 顯示格式
export const num = (n) => Number(n).toLocaleString('en-US');

export const twd = (n) => `TWD ${num(n)}`;

/** 收盤價：固定兩位小數，例如 106.90 */
export const price = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 以「萬」為單位（無條件捨去），例如 1,260,000 → 126 */
export const wan = (n) => num(Math.floor(n / 10000));

export const pct = (n) => (n == null ? '--' : `${num(n)} %`);

export const rate = (r) => `${+(r * 100).toFixed(2)} %`;

/** 2025-12-28 → 2025/12/28 */
export const date = (iso) => iso.replaceAll('-', '/');

export function dateTime(d = new Date()) {
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** ISO 時間 → [日期, 時間]，例如 ['2025/12/28', '11:45:11']（列表裡日期、時間分兩行時用） */
export function dateTimeParts(iso) {
  return dateTime(new Date(iso)).split(' ');
}
