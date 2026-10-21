// 狀態標籤｜Figma：即將到期（外框）、撥款中（實心）
import { html } from '../../lib/preact.js';

/**
 * <Tag variant="warning">即將到期</Tag>   外框橘紅（Guideline：Content/Tag/Warning）
 * <Tag>撥款中</Tag>                       淺藍底（Guideline：Container/General/Active-Secondary）
 * <Tag variant="info">經驗一</Tag>         外框淺藍（Figma：Graphic/Blue/70 框、Blue/90 字）
 */
export function Tag({ variant = 'default', children }) {
  return html`<span class=${'tag tag--' + variant + ' t-caption-regular'}>${children}</span>`;
}
