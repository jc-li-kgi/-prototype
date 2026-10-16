// 把彈出層渲染到 <body> 最外層
// 原因：放在有 transform 的容器裡（例如置底區 StickyFooter）時，position: fixed 會被限制在容器內，無法整頁蓋版
import { render, useRef, useLayoutEffect } from '../../lib/preact.js';

/** <Portal>…彈出層…</Portal> */
export function Portal({ children }) {
  const el = useRef(null);
  if (!el.current) el.current = document.createElement('div');

  useLayoutEffect(() => {
    const node = el.current;
    document.body.appendChild(node);
    return () => {
      render(null, node);
      node.remove();
    };
  }, []);

  useLayoutEffect(() => {
    render(children, el.current);
  });

  return null;
}
