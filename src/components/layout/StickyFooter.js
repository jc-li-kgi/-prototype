// 置底操作區（固定在畫面底部，可放總計 + 按鈕）｜Figma：置底下單
import { html, useRef, useState, useEffect } from '../../lib/preact.js';

/**
 * <StickyFooter>
 *   <div>總計…</div>
 *   <Button>下一步</Button>
 * </StickyFooter>
 * 會自動在頁面底部留出同高度的空白，內容不會被擋住
 * plain：透明底、無分隔線與陰影（只有一顆按鈕時使用）
 */
export function StickyFooter({ plain = false, children }) {
  const ref = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return html`
    <div style=${`height:${height}px`} aria-hidden="true" />
    <div class=${'sticky-footer' + (plain ? ' sticky-footer--plain' : '')} ref=${ref}>${children}</div>
  `;
}
