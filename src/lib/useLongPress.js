// 長按：按住 ms 毫秒後觸發 onLongPress（手指移動或放開就取消）
// 回傳 { handlers, fired }：handlers 展開到元素上；fired() = 這次按壓是否已觸發長按（用來略過接著的 click）
import { useRef } from './preact.js';

export function useLongPress(onLongPress, ms = 2000) {
  const timer = useRef();
  const firedRef = useRef(false);
  const start = () => {
    firedRef.current = false;
    timer.current = setTimeout(() => {
      firedRef.current = true;
      onLongPress();
    }, ms);
  };
  const cancel = () => clearTimeout(timer.current);
  return {
    handlers: {
      onTouchStart: start,
      onTouchEnd: cancel,
      onTouchMove: cancel,
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onContextMenu: (e) => e.preventDefault(), // 手機長按不跳出系統選單
    },
    fired: () => firedRef.current,
  };
}
