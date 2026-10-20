// 主持人頁：任務列表、目前狀態、重置
// 進入方式：網址 #/moderator，或在帳務頁長按「帳務」標題 1.5 秒
import { html } from '../lib/preact.js';
import { useStore, resetAll, showToast } from '../store.js';
import { COPY } from '../content/copy.js';
import { SCENARIOS } from '../scenarios/index.js';
import { Button } from '../components/index.js';

// 清除後給 toast 回饋，確認已清除
function clearAll() {
  resetAll();
  showToast(COPY.common.resetDone);
}

export function Moderator() {
  const taskId = useStore((s) => s.taskId);
  const base = location.origin + location.pathname;

  return html`
    <div class="page moderator-page">
      <h1 class="t-headline">測試任務</h1>
      <p class="t-caption-regular c-secondary">目前任務：${taskId || '無'}</p>

      ${SCENARIOS.map(
        (s) => html`
          <div class="card moderator-task">
            <p class="t-subtitle-bold">${s.id}｜${s.title}</p>
            <p class="t-body-regular c-secondary">${s.instruction}</p>
            <p class="t-caption-regular c-tertiary moderator-task__url">${base}#/start?task=${s.id}</p>
            <${Button} variant="capsule" class="moderator-task__go" href=${`#/start?task=${s.id}`}>開始任務<//>
          </div>
        `
      )}

      <${Button} variant="text" onClick=${clearAll}>清除所有測試資料<//>
    </div>
  `;
}
