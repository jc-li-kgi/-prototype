import { html, render, useEffect } from './lib/preact.js';
import { useRoute, navigate } from './router.js';
import { useStore, setState } from './store.js';
import { ROUTES, PUBLIC_ROUTES } from './routes.js';
import { Toast, Dialog } from './components/index.js';
import { findScenario } from './scenarios/index.js';
import { COPY } from './content/copy.js';

/** 任務完成通知：任務的 completeOnFlows 被觸發時顯示，按鈕回到任務列表 */
function TaskDoneDialog() {
  const done = useStore((s) => s.taskDone);
  const taskId = useStore((s) => s.taskId);
  const t = COPY.task;
  const back = () => {
    setState({ taskDone: false });
    navigate('/moderator');
  };
  return html`<${Dialog}
    open=${done}
    title=${t.doneTitle}
    body=${t.doneBody(findScenario(taskId)?.title ?? '')}
    bodyAlign="center"
    actions=${[{ label: t.backToList, onClick: back }]}
    onClose=${back}
  />`;
}

function App() {
  const { path, query } = useRoute();
  const hasScenario = useStore((s) => !!s.account);
  const startPath = useStore((s) => s.startPath);

  const Page = ROUTES[path];
  const allowed = Page && (hasScenario || PUBLIC_ROUTES.includes(path));

  // 首頁或未載入情境 → 回到任務起點 / 主持人頁
  useEffect(() => {
    if (!allowed) navigate(hasScenario ? startPath || '/home' : '/moderator', { replace: true });
  }, [path, allowed]);

  return html`
    ${allowed && html`<${Page} query=${query} />`}
    <${TaskDoneDialog} />
    <${Toast} />
  `;
}

render(html`<${App} />`, document.getElementById('app'));
