import { html } from '../../lib/preact.js';

/**
 * Figma 匯出的 icon，放在 assets/icons/
 * <Icon name="info.svg" size=${16} />
 * <Icon name="add.svg" tint />            ← 顏色跟著文字色（currentColor），可用 token 換色、停用變灰
 * <Icon name="info.svg" level="body" />   ← 跟著文字層級的尺寸（caption / body / subtitle），手機與電腦自動切換
 *
 * 文字＋icon（text button、下拉選單、ⓘ）一律用 level，間距用 .icon-text--{level}（見 CLAUDE.md「Icon 尺寸」）
 */
export function Icon({ name, size = 24, width, height, alt = '', tint = false, level }) {
  const src = `assets/icons/${name}`;
  const levelClass = level ? ` icon--${level}` : '';
  const w = level ? undefined : width ?? size;
  const h = level ? undefined : height ?? size;
  if (tint) {
    // CSS 變數裡的相對路徑會以 CSS 檔位置解析，所以先轉成完整網址
    const url = new URL(src, document.baseURI).href;
    const box = level ? '' : `width:${w}px;height:${h}px;`;
    return html`<span class=${'icon-tint' + levelClass} role=${alt ? 'img' : undefined} aria-label=${alt || undefined}
      style=${`${box}--icon:url('${url}')`} />`;
  }
  return html`<img class=${levelClass.trim() || undefined} src=${src} width=${w} height=${h} alt=${alt} />`;
}
