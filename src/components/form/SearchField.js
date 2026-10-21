// 搜尋框（膠囊、放大鏡 24、內距 8×16、icon 與文字 8）｜Figma：Atom_SearchBar_Mobile（2565:50437）
import { html } from '../../lib/preact.js';
import { SearchIcon } from '../ui/SearchIcon.js';

/**
 * <SearchField value=${keyword} onChange=${setKeyword} placeholder="搜尋產品關鍵字或代碼" />
 *   預設淡藍底（Option Selected Blue），放在白底上（例如底部彈窗）
 *   onSurface  放在藍底（Surface Blue）頁面上時改白底，否則會看不到搜尋框
 */
export function SearchField({ value, onChange, placeholder, onSurface = false }) {
  return html`
    <label class=${'search-field' + (onSurface ? ' search-field--on-surface' : '')}>
      <${SearchIcon} />
      <input
        class="t-body-regular"
        type="search"
        placeholder=${placeholder}
        value=${value}
        onInput=${(e) => onChange(e.currentTarget.value.trim())}
      />
    </label>
  `;
}
