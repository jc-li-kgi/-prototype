# 股票借貸 Prototype — 開發規則

易用性測試用的手機 prototype（凱基證券 股票借貸）。免建置靜態網站：Preact + htm（`src/lib/preact.js`），部署在 GitHub Pages。
使用者是設計師，回覆一律用繁體中文。專案結構與維運說明見 `README.md`。

## 設計規範：One KGI Design Guideline（必須遵守）

`One KGI Design Guideline/` 是顏色、間距、圓角、陰影、字級的唯一來源，由 `index.html` 載入。

- **不准寫死數值**：`styles/` 與元件裡不得出現 hex 色碼、rgba、px 間距、圓角、陰影、font-size、font-weight。一律用 token：
  - 顏色 `var(--color-*)`（用語意 token，例如 `--color-content-general-secondary`，不用 base palette，紅色徽章等特例除外）
  - 間距 `var(--spacing-N)`，N 只有 0/2/4/8/12/16/20/24/28/32/40/48/60/80
  - 圓角 `var(--radius-none|xs|small|medium|full)`（0/1/3/6/100px）；卡片用 `medium`，膠囊按鈕 / Tag 用 `full`
  - **滿版卡片（貼齊畫面左右）不用圓角**：加 `.card--full`（FeeCard 傳 `full`）；左右有留邊的卡片才用 `.card`（6px）
  - 陰影：藍底（Surface Blue）上的卡片用 `--shadow-basic`；白底上的浮層、Dialog、Bottom Sheet、Toast、導覽列用 `--shadow-popover`；未選取 / 停用用 `--shadow-light`
- **文字只能用 class**：`styles/typography.css` 的 `.t-*`（中文）、`.n-*`（英文 / 數字），不要在 CSS 寫 font-size。
  - 層級：`display-l/m/s`、`headline`（頁面主標）、`title`（區塊標題 / 大數字）、`subtitle-bold`（卡片標題、頁首標題、主要按鈕）、`subtitle-regular`（清單項目、輸入值）、`body-bold`（欄位標題、重點）、`body-regular`（內文、標籤、Tab）、`caption-regular`（輔助說明、欄位下方提示）
  - 金額、百分比、日期、帳號用 `.n-*`；中文標籤用 `.t-*`；中英混排（如「可借款金額 TWD 10,000」）用 `.t-*`
  - **只要文字內容是中文就用 `.t-*`，即使 Figma 標成 EN 樣式**（Figma 套錯時以內容語言為準，並告知使用者）。原因：字重、行高套在整段文字上，中文用了 `.n-*` 會吃到英數字重（例如 Web 的 Body-R 英數 500）
- **Guideline 沒有的值**：先找最接近的 token，並在回覆中告知使用者，不要自創。已決定的例子：
  - Guideline 沒有 4px 圓角 → 用 `--radius-small`（3px）
  - KGIB（凱基銀行）專用字級（16px 內文、18px 按鈕等）不用於本專案 → 改用證券的對應層級
  - Figma 稿與 Guideline 衝突時以 Guideline 為準，並列出差異請使用者確認
- **與 Guideline 不同的調整**只能寫在 `styles/kgi-overrides.css`（覆寫 token，不改 Guideline 檔案）。目前內容：手機版（≤768px）Body 16 / Caption 14 / Subtitle 18，Body-R 與 Subtitle-R 英數字重 500；修正 `--color-grey-0-30`（Guideline 匯出時少了 30% 透明度）。
- `styles/tokens.css` 只放 Guideline 沒有的東西：互動狀態色、字型堆疊、版面寬度。
- 工具 class（`.c-*` 文字顏色、`.nowrap`）放 `styles/utilities.css`，必須在 `index.html` 最後載入，才能覆蓋元件預設色。新增 CSS 檔要放在它前面。
- 按下 / hover 色依 `Color/color-state-utils.ts` 規則預先算好放 `tokens.css`；停用狀態用 `--color-content-general-disabled` / `--color-container-general-disabled`。

### 底部按鈕

- **不固定的底部按鈕**一律用 `BottomActions`（FlowPage 的 `actions`、ResultPage 已內建）：
  - 與上方內容至少 **32px**
  - 內容不滿一屏時（距離會大於 32px），按鈕**置底**
  - 下方頁尾：流程申請 48（預設）、資訊瀏覽 40（`context="browse"`），含 iPhone 安全區
  - 多顆按鈕直排，間距 16；按鈕滿版、左右 16
  - 必須是撐滿高度的直式 flex 容器（`.page`）的最後一個，父層不要再加 gap
- **固定（fixed）在畫面底部的按鈕**（`StickyFooter`、FlowPage 的 `sticky`，例如總計＋下一步）不適用以上規則。

### 間距情境（Spacing Guideline）

- 帳務頁、總覽類 = **資訊瀏覽**：區塊間距 32、頁尾 40、詳情卡內距 16×16
- 借款、匯入擔保品、還款等步驟流程 = **流程申請**：區塊間距 24、頁尾 48、詳情卡內距 24×24
- 共通：頁首與內容 24、卡片組 12、詳情條列 20、操作欄位（輸入框）24、標題→內容 12、欄位標題→輸入框 8、內容→按鈕 32、圖示與文字 4
- 頁面左右邊界目前維持 16px（Guideline「區塊內邊距 24/24」尚待使用者確認）

## 字型與響應式字級

- 這是網頁，一律依 Guideline 的**網頁規則**，不模擬 iOS / Android App、不偵測裝置平台。
- 字型：所有裝置都是思源黑體（Noto Sans TC）+ Montserrat，在 `index.html` 從 Google Fonts 載入，堆疊在 `tokens.css` 的 `--font-base`。
- 字級：`typography.css` 只用 `--kgi-font-auto-*`；畫面寬度 > 768px 為 Web、≤ 768px 為 mWeb（含 `kgi-overrides.css` 的調整）。單位 rem。
- 不提供手動切換字型或字級。

## 程式結構規則

- **優先用現有元件**（`src/components/index.js` 統一 import；元件負責樣式，內容由參數帶入）：
  - ui：Button、Icon、InfoLabel（文字＋ⓘ）、DetailRow、DetailCard（確認資料卡）、DetailPanel（列表展開明細卡）、SummaryCard（摘要卡，overview / flow）、FeeCard、AmountHero（確認頁大金額）、AmountCell（列表金額欄）、StockName（股票名稱＋代碼）、SectionHeader（區塊標題＋連結＋說明）、CollapsibleCard、ExpandToggle、IconAction（圓形圖示捷徑）、EmptyState、StatGroup（並排大數字）、NoticeBar（淡黃提示條）、StockPickCard（精選擔保品卡）、ServiceCardList（圖示＋標題＋說明的服務清單）、AccountPicker、Checkbox、FilterPill、Tag、SearchIcon
  - form：PickerField、AmountField（金額；`disabled` 鎖定）、RadioGroup（單選，橫排平分）、QtyStepper（張數）、SelectableItem（勾選項目）、SearchField
  - layout：FlowPage（流程頁框架，流程每一步都用）、PageHeader、StepBar、BottomNav、TextTabs、SegmentedTabs、ListTable／ListRow（列表；ListRow 的 `detail` 自動包在 DetailPanel 白色明細卡裡）、Carousel（橫向滑動卡片）、StickyFooter（固定置底；plain = 只有按鈕時）、BottomActions（頁面底部按鈕區，見下方「底部按鈕」）、TotalBar（置底總計；`expanded` + `onToggle` + children = 在置底區內向上展開明細，最高 90%）、ResultPage（完成頁）
  - overlay：Dialog / InfoDialog（置中對話框：ⓘ、注意事項說明、確認提示）、Sheet（底部彈窗：選單、明細；非選單內容包 `.sheet__content`）、SheetOptions（彈窗選項，選中項淡藍底；`chevron` = 前往型選單，例如選擇還款方式）、Toast
  - 2 個以上地方會用到的畫面才抽成新元件，放進對應資料夾並在 `index.js` 匯出，檔頭註明對應的 Figma 元件名稱與用法範例。
- `Button` 用 `variant`（primary / text / capsule）與 `typo`（換文字層級）；需要換色的 icon 用 `<Icon tint />`。
- 新功能放 `src/features/<功能>/`；功能之間不互相 import，只透過 `store.js` 讀寫資料。需要組合多個功能的頁面放 `src/shells/`（入口頁）或 `src/pages/`（例如股票借貸明細）。
- 步驟順序寫在 `src/flows/flows.js`；頁面用 `flowPosition` / `nextStep` / `prevStep`，不要寫死下一頁。
- 測試情境放 `src/scenarios/`（一個任務一個檔，並在 `index.js` 註冊）；已開戶客戶共用 `base-account.js`。資料結構改版時，遞增 `store.js` 的 `KEY` 版本。
- 股票數量一律用「張」（`lots`）；股價、成數、擔保資格（eligible / ratioOnly / ineligible）在 `src/mock/stocks.js`。
- 開始流程用 `startFlow(flowId, { query, returnTo })`，結束或第 1 步返回會回到進入流程前的頁面。
- 同一頁可出現在多個流程（例如匯入擔保品第 1 步也是首次借款第 1 步）：頁首標題用 `flowTitle()`、依流程調整行為用 `isFlow()`；送出動作放在流程最後一步。
- 帳戶 `opened = false` 代表尚未借款（未開戶）：專區顯示初始頁、帳務 › 授信管理顯示方案卡（`features/hub/LoanIntroCard`）＋認識並開立借貸戶，借款走 `newAccountLoan`（匯入擔保品 → 填寫借款金額 → 確認資料，最後一次送出 `firstLoan`）。
- 文案放 `src/content/copy.js`；公式與業務規則放 `src/lib/calc.js`；股價放 `src/mock/stocks.js`。
- 所有任務都從證券主頁「我的」（`/home`，`shells/HomeShell.js`）開始：快捷功能「股票借貸」→ 專區，底部導覽「帳務」→ 授信管理。
- **返回路徑**：股票借貸明細（`/records`）屬於專區，按返回一律回專區（包括從完成頁進來時，不會回到完成頁）；從帳務 › 授信管理進來時網址帶 `back=/account`，返回帳務。切換頁籤會保留 `back`。
- 確認資料頁的送出按鈕一律用 `COPY.common.submit`（確認送出）。
- 新頁面要在 `src/routes.js` 註冊。
- 還款：借款紀錄到期前 `DUE_SOON_DAYS`（20）天顯示即將到期＋展延 / 還款；還款 → 選擇還款方式（`features/repay/RepayMethodSheet`，由專區 shell 與明細頁放置；專區快捷功能「還款」也會開啟）→ `cashRepay` 流程，送出 `repay()`；試算在 `calc.js` 的 `repayPlan`。
- 未實作的按鈕呼叫 `showToast(COPY.common.notAvailable)`。
- 不安裝建置工具或 npm 套件（電腦沒有 Node.js）。

## 從 Figma 實作畫面

- 用 Figma MCP 的 `get_design_context` 取得設計（fileKey `yeHCNA10BcV7ypNB2qZIqt`）。
- 只拿 Figma 的結構與內容；數值換成最接近的 Guideline token，不照抄 Figma 的 px / hex。
- 不實作 iOS 狀態列與 Home Indicator（真機會顯示）。
- icon 下載到 `assets/icons/`，不要引用 Figma 暫存網址。
- 沒有設計稿的畫面（彈窗、錯誤提示等）可以先補，但完成時要告知使用者哪些是自行補的。

## 驗證

- 本機預覽：`.claude/launch.json` 的 `prototype`（`python3 -m http.server 8080`）。
- 在 375px 寬度實際操作流程，用 `getComputedStyle` 確認字級、顏色、間距符合 token；確認 console 沒有錯誤、沒有橫向捲動。
- 瀏覽器可能快取舊 CSS / JS，驗證前先強制重新載入。
- 只在使用者要求時 commit / push。
