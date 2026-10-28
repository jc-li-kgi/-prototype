// #/start?task=T3 → 重置資料、載入情境、跳到起始頁
import { html, useEffect } from '../lib/preact.js';
import { loadScenario } from '../store.js';
import { navigate } from '../router.js';
import { findScenario } from '../scenarios/index.js';
import { Button } from '../components/index.js';

export function TaskStart({ query }) {
  const scenario = findScenario(query.task);

  useEffect(() => {
    if (!scenario) return;
    loadScenario(scenario);
    navigate(scenario.startPath, { replace: true });
  }, [query.task]);

  if (scenario) return null;
  return html`
    <div class="page moderator-page">
      <p class="t-body-regular">找不到任務「${query.task}」。</p>
      <${Button} variant="text" href="#/moderator">回任務列表<//>
    </div>
  `;
}
