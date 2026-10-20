// 更多服務清單：查看借還款紀錄 / 管理擔保品 / 查看對帳單
import { html } from '../../lib/preact.js';
import { Icon, SectionHeader } from '../../components/index.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

// 對應 COPY.hub.services 的順序；back=/account：明細頁按返回回到帳務
const TARGETS = ['/records?tab=loans&back=/account', '/records?tab=collateral&back=/account', '/records?tab=statement&back=/account'];

export function MoreServices({ showZoneLink = true }) {
  const t = COPY.hub;
  const go = (path) => (path ? navigate(path) : showToast(COPY.common.notAvailable));

  return html`
    <section class="more-services">
      <${SectionHeader}
        title=${t.moreServices}
        action=${showZoneLink && { label: t.goZone, onClick: () => navigate('/lending-zone') }}
      />
      <div class="card more-services__list">
        ${t.services.map(
          (label, i) => html`
            <button class="more-services__item" onClick=${() => go(TARGETS[i])}>
              <span class="t-subtitle-regular c-primary">${label}</span>
              <${Icon} name="chevron-forward-24.svg" level="subtitle" />
            </button>
          `
        )}
      </div>
    </section>
  `;
}
