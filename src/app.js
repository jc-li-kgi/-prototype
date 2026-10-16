import { html, render, useEffect } from './lib/preact.js';
import { useRoute, navigate } from './router.js';
import { useStore } from './store.js';
import { ROUTES, PUBLIC_ROUTES } from './routes.js';
import { Toast } from './components/index.js';

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
    <${Toast} />
  `;
}

render(html`<${App} />`, document.getElementById('app'));
