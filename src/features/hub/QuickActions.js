// 專區快捷功能（還款 / 查看借還款紀錄 / 管理擔保品 / 更多）
// icon 由 Figma 渲染圖裁切（assets/icons/action-*.png）
import { html } from '../../lib/preact.js';
import { IconAction } from '../../components/index.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

// 對應 COPY.zone.actions 的順序；repay = 交給 onRepay（開啟選擇還款方式），null = 尚未實作
const ACTIONS = [
  { icon: 'action-repay.png', repay: true },
  { icon: 'action-records.png', to: '/records?tab=loans' },
  { icon: 'action-collateral.png', to: '/records?tab=collateral' },
  { icon: 'action-more.png', to: null },
];

/** <QuickActions onRepay=${openRepaySheet} /> */
export function QuickActions({ onRepay }) {
  return html`
    <nav class="quick-actions">
      ${ACTIONS.map(
        (a, i) => html`
          <${IconAction}
            icon=${a.icon}
            label=${COPY.zone.actions[i]}
            onClick=${() => (a.repay && onRepay ? onRepay() : a.to ? navigate(a.to) : showToast(COPY.common.notAvailable))}
          />
        `
      )}
    </nav>
  `;
}
