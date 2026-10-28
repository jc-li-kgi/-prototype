// 認識股票借貸（介紹頁，全螢幕從底部往上開啟）｜Figma 1804:138177「認股借貸首頁/未登入」
// 入口：
//   ・未借款進專區時自動開啟一次（store.introShown）
//   ・專區右上「產品說明」、帳務 › 授信管理「認識股票借貸」
// 右上「關閉說明頁」文字按鈕，回到原本的頁面；本次測試不開放開戶（相關按鈕顯示未開放）
import { html, useState, useRef, useEffect } from '../../lib/preact.js';
import { TextTabs, Tag, Button, Icon, Accordion, BottomActions } from '../../components/index.js';
import { Portal } from '../../components/overlay/Portal.js';
import { useStore, showToast } from '../../store.js';
import { COPY } from '../../content/copy.js';

/**
 * <IntroSheet open=${open} onClose=${close} onSimulate=${goSimulate} />
 *   onSimulate  「立即試算」、案例的「試算可借金額」：關閉介紹頁並前往專區「試算」頁籤（由放置的頁面決定怎麼切換）
 */
export function IntroSheet({ open, onClose, onSimulate }) {
  // 開啟時鎖住背後頁面捲動
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = '');
  }, [open]);
  if (!open) return null;
  return html`<${Portal}><${IntroContent} onClose=${onClose} onSimulate=${onSimulate} /><//>`;
}

function IntroContent({ onClose, onSimulate }) {
  const opened = useStore((s) => s.account.opened);
  const t = COPY.intro;
  const faqRef = useRef();
  const notAvailable = () => showToast(COPY.common.notAvailable);
  // 「立即試算」、案例的「試算可借金額」→ 專區「試算」頁籤
  const goSimulate = onSimulate || notAvailable;
  // 開戶功能本次不開放；已開戶時「馬上線上申請」直接關閉回專區
  const apply = () => (opened ? onClose() : notAvailable());

  return html`
    <div class="intro-sheet" role="dialog" aria-modal="true" aria-label=${t.title}>
     <div class="intro-page">
      <!-- Figma 3125:62251：只有右側文字按鈕「關閉說明頁」 -->
      <header class="intro-header">
        <${Button} variant="text" onClick=${onClose}>${t.close}<//>
      </header>

      <section class="intro-banner">
        <h1 class="t-title c-primary">${t.banner[0]}<br />${t.banner[1]}</h1>
        <img class="intro-banner__image" src="assets/illustrations/intro-banner.png" width="375" height="219" alt="" />
      </section>

      <nav class="intro-tabs" role="tablist">
        ${t.tabs.map(
          (tab, i) => html`
            <button
              role="tab"
              aria-selected=${i === 0}
              class=${'intro-tabs__item t-body-bold' + (i === 0 ? ' intro-tabs__item--active' : '')}
              onClick=${i === 0 ? undefined : notAvailable}
            >
              <${Icon} name=${tab.icon} tint />
              <span>${tab.label}</span>
            </button>
          `
        )}
      </nav>

      <main class="intro-content">
        <!-- 股票借貸是什麼？ -->
        <section class="intro-section">
          <h2 class="intro-section__title t-title c-primary">${t.whatTitle}</h2>
          <div class="card card--shadow intro-what">
            ${t.what.map(
              (w) => html`
                <div class="intro-what__item">
                  <p class="intro-what__title t-subtitle-bold c-primary">
                    <${Icon} name="intro-point.svg" size=${16} />${w.title}<${Icon} name="intro-point.svg" size=${16} />
                  </p>
                  <p class="t-subtitle-regular c-secondary">${w.desc}</p>
                </div>
              `
            )}
          </div>
        </section>

        <!-- 看看其他投資人經驗 -->
        <section class="intro-section">
          <h2 class="intro-section__title t-title c-primary">${t.casesTitle}</h2>
          <div class="intro-cards">
            <div class="card intro-card">
              <div class="intro-case">
                <${Tag} variant="info">${t.case1.tag}<//>
                <ol class="intro-timeline">
                  ${t.case1.steps.map(
                    (s) => html`
                      <li class="intro-timeline__item">
                        <p class="intro-timeline__title t-subtitle-bold c-primary">
                          <img class="intro-timeline__dot" src="assets/icons/timeline-dot.svg" width="18.4" height="18.4" alt="" />${s.title}
                        </p>
                        <p class="intro-timeline__desc t-body-regular c-secondary">${s.desc}</p>
                      </li>
                    `
                  )}
                </ol>
              </div>
              ${!opened &&
              html`
                <div class="intro-entrance">
                  <p class="t-body-bold c-primary">${t.case1.ask}</p>
                  <${Button} variant="capsule" onClick=${goSimulate}>${t.case1.cta}<//>
                </div>
              `}
            </div>

            <div class="card intro-card intro-card--case2">
              <div class="intro-case">
                <${Tag} variant="info">${t.case2.tag}<//>
                <div>
                  <p class="t-subtitle-bold c-primary">${t.case2.title}</p>
                  <p class="t-body-regular c-secondary">${t.case2.desc}</p>
                </div>
                <div class="intro-case2__action">
                  <${Button} variant="capsule" onClick=${goSimulate}>${t.case2.cta}<//>
                  <img src="assets/illustrations/intro-coin-hand.png" width="58" height="84" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 會有什麼風險呢？ -->
        <section class="intro-section">
          <h2 class="intro-section__title t-title c-primary">${t.riskTitle}</h2>
          <div class="intro-cards">
            <div class="card intro-card intro-risk">
              <img class="intro-risk__chart" src="assets/illustrations/intro-risk-chart.png" width="311" height="237" alt=${t.riskChartAlt} />
              <p class="t-body-regular c-primary">${t.riskDesc[0]}<br />${t.riskDesc[1]}</p>
              <div class="intro-risk__more">
                <p class="t-body-regular c-secondary">${t.riskMore}</p>
                <${Button} variant="text" onClick=${() => faqRef.current?.scrollIntoView({ behavior: 'smooth' })}>${t.riskFaq}<//>
              </div>
              <img class="intro-risk__image" src="assets/illustrations/intro-search.png" width="124" height="122" alt="" />
            </div>

            <div class="card intro-card">
              <p class="intro-tools__title t-subtitle-bold c-primary">
                ${t.toolsTitle[0]}<img src="assets/illustrations/intro-three.png" width="23" height="35" alt="3" />${t.toolsTitle[1]}
              </p>
              <ul class="intro-tools">
                ${t.tools.map(
                  (tool) => html`
                    <li class="intro-tools__item">
                      <img class="intro-tools__check" src="assets/icons/check-circle.svg" width="20" height="20" alt="" />
                      <div>
                        <p class="t-body-bold c-primary">${tool.title}</p>
                        <p class="t-body-regular c-secondary">
                          ${tool.desc}${tool.link && html` <button class="intro-link c-active" onClick=${tool.action === 'simulate' ? goSimulate : notAvailable}>${tool.link}</button>`}
                        </p>
                      </div>
                    </li>
                  `
                )}
              </ul>
            </div>
          </div>
        </section>

        <!-- 我要如何操作呢? -->
        <${HowTo} onApply=${notAvailable} opened=${opened} />

        <!-- 常見問題 -->
        <section class="intro-section" ref=${faqRef}>
          <h2 class="t-title c-primary">${t.faqTitle}</h2>
          <${Faq} />
        </section>
      </main>

      <!-- 底部按鈕上方的引導文字（Figma：文字→按鈕 16，與 BottomActions 按鈕間距一致） -->
      <${BottomActions}>
        <p class="intro-footer t-caption-regular c-secondary">${t.footer}</p>
        <${Button} onClick=${apply}>${t.apply}<//>
      <//>
     </div>
    </div>
  `;
}

/** 操作步驟：開戶 / 借款 / 還款 */
function HowTo({ onApply, opened }) {
  const t = COPY.intro;
  const [tab, setTab] = useState(t.how[0].key);
  const step = t.how.find((h) => h.key === tab);
  return html`
    <section class="intro-section">
      <h2 class="intro-section__title t-title c-primary">${t.howTitle}</h2>
      <div class="card intro-card intro-how">
        <${TextTabs} class="text-tabs--flush text-tabs--center" tabs=${t.how} active=${tab} onChange=${setTab} />
        ${step.image && html`<img class="intro-how__image" src=${`assets/illustrations/${step.image}`} width="136" height="275" alt="" />`}
        <div class="intro-how__text">
          <p class="t-subtitle-bold c-primary">${step.title}</p>
          <p class="t-body-regular c-secondary">${step.desc}</p>
          ${step.link &&
          !opened &&
          html`
            <p class="intro-how__hint">
              <span class="t-caption-regular c-secondary">${step.hint}</span>
              <button class="intro-link t-body-regular icon-text--body" onClick=${onApply}>
                ${step.link}<${Icon} name="forward-16.svg" level="body" />
              </button>
            </p>
          `}
        </div>
      </div>
    </section>
  `;
}

/** 常見問題：依主題分頁籤 */
function Faq() {
  const t = COPY.intro;
  const [tab, setTab] = useState(t.faq[0].key);
  const group = t.faq.find((g) => g.key === tab);
  return html`
    <div class="intro-faq">
      <${TextTabs} class="text-tabs--flush" tabs=${t.faq} active=${tab} onChange=${setTab} />
      <${Accordion} key=${tab} items=${group.items} defaultOpen=${0} />
    </div>
  `;
}
