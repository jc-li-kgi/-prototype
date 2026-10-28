// 主持人頁：任務列表（只顯示任務名稱，點了開始任務）、重置
// 進入方式：網址 #/moderator，或長按底部導覽「更多」2 秒
import { html } from '../lib/preact.js';
import { resetAll, showToast } from '../store.js';
import { COPY } from '../content/copy.js';
import { SCENARIOS } from '../scenarios/index.js';
import { Button, Icon } from '../components/index.js';

// 清除後給 toast 回饋，確認已清除
function clearAll() {
  resetAll();
  showToast(COPY.common.resetDone);
}

export function Moderator() {
  return html`
    <div class="page moderator-page">
      <h1 class="t-headline">測試任務</h1>

      ${SCENARIOS.map(
        (s) => html`
          <a class="card moderator-task" href=${`#/start?task=${s.id}`}>
            <span class="t-subtitle-bold c-primary">${COPY.task.label(s.no, s.title)}</span>
            <${Icon} name="chevron-forward-24.svg" level="subtitle" />
          </a>
        `
      )}

      <${Button} variant="text" onClick=${clearAll}>清除所有測試資料<//>
    </div>
  `;
}
