// 快捷功能｜Figma：證券主頁 › ShortCut_Mobile（Atom_Shortcut Btn_Mobile × 8 + carousel bar）
// 只有「股票借貸」可以點（進股票借貸專區），其他顯示未開放
import { html } from '../../lib/preact.js';
import { Icon, SectionHeader, Button } from '../../components/index.js';
import { showToast } from '../../store.js';
import { navigate } from '../../router.js';
import { COPY } from '../../content/copy.js';

export function Shortcuts() {
  const t = COPY.home;
  const notAvailable = () => showToast(COPY.common.notAvailable);

  return html`
    <section class="shortcuts">
      <${SectionHeader}
        title=${t.shortcutTitle}
        action=${{
          label: html`<span class="shortcuts__edit"><${Icon} name="shortcut-edit.svg" size=${16} />${t.shortcutEdit}</span>`,
          onClick: notAvailable,
        }}
      />
      <div class="shortcuts__grid">
        ${t.shortcuts.map(
          (s) => html`
            <button class="shortcut-btn" onClick=${s.lending ? () => navigate('/lending-zone') : notAvailable}>
              <img src=${`assets/icons/${s.icon}`} width="28" height="28" alt="" />
              <span class="t-caption-regular c-primary">${s.label}</span>
            </button>
          `
        )}
      </div>
      <!-- 第 2 頁捷徑不在本次測試範圍，指示條只做外觀 -->
      <div class="carousel__dots shortcuts__dots" aria-hidden="true">
        <span class="carousel__dot carousel__dot--active" />
        <span class="carousel__dot" />
      </div>
    </section>
  `;
}
