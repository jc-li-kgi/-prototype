// 橫向滑動卡片 + 指示點｜Figma：您的庫存精選擔保品 › carousel
import { html, useRef, useState, useEffect } from '../../lib/preact.js';

/**
 * <Carousel>
 *   ${items.map((i) => html`<div class="…卡片…">…</div>`)}
 * </Carousel>
 * 每張卡片寬度由 --carousel-item-width 控制（預設 280px），左右露出相鄰卡片
 */
export function Carousel({ children, label = '輪播' }) {
  const ref = useRef();
  const [active, setActive] = useState(0);
  const items = [].concat(children || []).filter(Boolean);

  // 依捲動位置計算目前在第幾張
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const kids = [...el.children];
      let best = 0;
      kids.forEach((k, i) => {
        const mid = k.offsetLeft + k.offsetWidth / 2;
        if (Math.abs(mid - center) < Math.abs(kids[best].offsetLeft + kids[best].offsetWidth / 2 - center)) best = i;
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i) => {
    const kid = ref.current?.children[i];
    if (kid) ref.current.scrollTo({ left: kid.offsetLeft - (ref.current.clientWidth - kid.offsetWidth) / 2, behavior: 'smooth' });
  };

  return html`
    <div class="carousel" role="region" aria-label=${label}>
      <div class="carousel__track" ref=${ref}>
        ${items.map((c) => html`<div class="carousel__item">${c}</div>`)}
      </div>
      ${items.length > 1 &&
      html`
        <div class="carousel__dots">
          ${items.map(
            (_, i) => html`<button
              class=${'carousel__dot' + (i === active ? ' carousel__dot--active' : '')}
              aria-label=${`第 ${i + 1} 張`}
              onClick=${() => goTo(i)}
            />`
          )}
        </div>
      `}
    </div>
  `;
}
