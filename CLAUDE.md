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

### Icon 尺寸（文字＋icon）

- 用在 text button、下拉選單、ⓘ、› 等「文字旁的 icon」。icon 尺寸跟著**文字層級**，不寫死 px：

  | 文字層級 | 手機（≤768px） | 電腦（>768px） | 文字與 icon 間距 |
  |---|---|---|---|
  | Caption | 16 | 16 | 4 |
  | Body | 16 | 20 | 4 |
  | Subtitle | 20 | 24 | 前置 icon 8、後置 icon（› ▼）4 |

- 寫法：`<Icon name="…" level="caption|body|subtitle" />`；間距用 `.icon-text--{level}`（Subtitle 前置 icon 再加 `.icon-text--leading`），或在元件 CSS 用 `var(--icon-gap-*)`。token 在 `tokens.css`（`--icon-size-*`、`--icon-gap-*`）。
- 已套用：InfoLabel（依 labelClass 自動判斷）、FilterPill、PickerField、TotalBar、CollapsibleCard（`variant="overview"` = 內距 16）、ServiceCardList、SheetOptions（chevron）、更多服務、首頁快捷功能「自訂」、資產卡。
- 不適用：頁首 / 導覽列 icon、圓形捷徑 icon、插圖、列表展開箭頭等獨立 icon。
- 例外：通知條 `NoticeCard` 的 icon（公告、›）一律 24px，不跟文字層級。

### 底部按鈕

- **不固定的底部按鈕**一律用 `BottomActions`（FlowPage 的 `actions`、ResultPage 已內建）：
  - 與上方內容至少 **32px**
  - 內容不滿一屏時（距離會大於 32px），按鈕**置底**
  - 距離畫面底部 **48px**（所有頁面一致；iPhone 安全區包含在 48 內）
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
  - ui：Button、Icon、InfoLabel（文字＋ⓘ）、DetailRow、DetailCard（確認資料卡）、DetailPanel（列表展開明細卡；放在白卡裡加 `tone="blue"`）、SummaryCard（摘要卡，overview / flow）、FeeCard、AmountHero（確認頁大金額）、AmountCell（列表金額欄）、StockName（股票名稱＋代碼）、SectionHeader（區塊標題＋連結＋說明）、CollapsibleCard、ExpandToggle、IconAction（圓形圖示捷徑）、EmptyState、StatGroup（並排大數字）、NoticeBar（淡黃提示條）、NoticeCard（通知條：公告 icon＋一行訊息＋›，整張可點；icon 一律 24px）、StatementCard（對帳單卡片：標題＋類型標籤＋資料列，可展開淡藍明細）、ExpandButton（展開明細 / 收闔明細文字按鈕）、DateTimeLines（日期＋時間兩行；只要拆日期 / 時間用 format.js 的 `dateTimeParts`）、StockPickCard（精選擔保品卡）、ServiceCardList（圖示＋標題＋說明的服務清單）、AccountPicker、Checkbox、CheckboxHeader（勾選框＋標題＋補充說明，說明與標題對齊；全選用）、Accordion（收合問答，FAQ）、FilterPill、Tag、SearchIcon
  - form：PickerField（`onOpen` + `displayValue` = 自訂選擇畫面；`hint` 底線下說明）、NumberField（整數輸入＋單位）、AmountField（金額；`disabled` 鎖定；`value=null` + `placeholder` = 未填狀態，tertiary 色）、RadioGroup（單選，橫排平分）、QtyStepper（張數）、SelectableItem（勾選項目）、SearchField（Figma Atom_SearchBar_Mobile；預設淡藍底放白底上，藍底頁面加 `onSurface` 改白底）
  - layout：FlowPage（流程頁框架，流程每一步都用）、PageHeader、StepBar、BottomNav、TextTabs、SegmentedTabs、ListTable／ListRow（列表；ListRow 的 `detail` 自動包在 DetailPanel 白色明細卡裡；欄位每段文字最多 2 行，超出顯示「…」，完整內容（例如商品名稱）要放在展開明細，明細裡的長文字加 `text-wrap`）、Carousel（橫向滑動卡片）、StickyFooter（固定置底；plain = 只有按鈕時）、BottomActions（頁面底部按鈕區，見下方「底部按鈕」）、TotalBar（置底總計；`note` = 標題下方補充，例如已選取筆數；`expanded` + `onToggle` + children = 在置底區內向上展開明細，最高 90%）、ResultPage（完成頁）
  - overlay：Dialog / InfoDialog（置中對話框：ⓘ、注意事項說明、確認提示）、Sheet（底部彈窗：選單、明細；非選單內容包 `.sheet__content`；搜尋類加 `fullHeight` 固定 90% 高，不隨結果數量變矮）、SheetOptions（彈窗選項，選中項淡藍底；`chevron` = 前往型選單，例如選擇還款方式）、Toast
  - 2 個以上地方會用到的畫面才抽成新元件，放進對應資料夾並在 `index.js` 匯出，檔頭註明對應的 Figma 元件名稱與用法範例。
- `Button` 用 `variant`（primary / text / capsule）與 `typo`（換文字層級）；需要換色的 icon 用 `<Icon tint />`。
- **文字按鈕一律用 `Button variant="text"`**，不要自己寫 `<button class="c-active">`：顏色用 `tone`（預設藍；`negative` 紅，例如「移除」），停用一律灰；文字＋icon 直接放在 children（間距 4）。「展開明細 / 收闔明細」用 `ExpandButton`（由文字按鈕組成）。
- 新功能放 `src/features/<功能>/`；功能之間不互相 import，只透過 `store.js` 讀寫資料。需要組合多個功能的頁面放 `src/shells/`（入口頁）或 `src/pages/`（例如股票借貸明細）。
- 步驟順序寫在 `src/flows/flows.js`；頁面用 `flowPosition` / `nextStep` / `prevStep`，不要寫死下一頁。
- 測試情境放 `src/scenarios/`（一個任務一個檔，並在 `index.js` 註冊）；已開戶客戶共用 `base-account.js`。借款日期不寫死，一律用 `scenarioLoan({ dueIn })` 依當天計算（任何一天測試，即將到期等狀態都一樣）。資料結構改版時，遞增 `store.js` 的 `KEY` 版本。
- 股票數量一律用「張」（`lots`）；股價、成數、擔保資格（eligible / ratioOnly / ineligible）在 `src/mock/stocks.js`。全站標的見 `產品資料.md`，各任務可借金額抓在約 100 萬；已開戶任務（T4～T7）的已借款總額一律 TWD 400,000。可借貸股票成數一律 60%（用戶最多可借市值 60%，初始維持率 166%）；維持率顯示一律無條件捨去。
- 開始流程用 `startFlow(flowId, { query, returnTo })`，結束或第 1 步返回會回到進入流程前的頁面。
- 同一頁可出現在多個流程（例如匯入擔保品第 1 步也是首次借款第 1 步）：頁首標題用 `flowTitle()`、依流程調整行為用 `isFlow()`；送出動作放在流程最後一步。
- 帳戶 `opened = false` 代表尚未借款（未開戶）：專區顯示初始頁、帳務 › 授信管理顯示方案卡（`features/hub/LoanIntroCard`）＋認識並開立借貸戶，借款走 `newAccountLoan`（匯入擔保品 → 填寫借款金額 → 確認資料，最後一次送出 `firstLoan`）。專區初始頁的精選擔保品卡可點，進 `newAccountLoan` 並預先勾選該檔全部張數（`?code=`）。
- 文案放 `src/content/copy.js`；公式與業務規則放 `src/lib/calc.js`；股價放 `src/mock/stocks.js`。
- **產品資料以根目錄 `產品資料.md` 為準**（標的、收盤價、成數、利率、手續費、展延、維持率規則）。使用者說「依產品資料.md 更新」時：讀 md → 同步到 `stocks.js`、`calc.js` → 檢查測試任務金額（約 100 萬）與 `copy.js` 裡寫死的利率 / 手續費 / 成數 → 驗證畫面。程式改了這些數值時也要回寫 md。股票只能整張擔保（`lots`，1 張 = 1,000 股）；收盤價顯示兩位小數（`format.js` 的 `price`）。
- 主持人頁（任務列表）：`#/moderator`，依 `scenarios/index.js` 的順序顯示「任務{情境的 no}」＋任務名稱；隱藏入口是長按底部導覽「更多」2 秒（`lib/useLongPress`）。任務：T1 任務一＆二 瀏覽借貸專區＋試算、T3 首次借款、T4 再借一筆、T5 瀏覽借貸明細、T6 現金還款、T7 借新還舊（任務代碼 = 編號）；匯入擔保品（`extra-import-collateral.js`）目前不列入。
- 任務連動（`scenarios/carry.js`）：T3 首次借款（`carryOut`）完成時，把擔保品、庫存、擔保品紀錄、借款存到 localStorage `lending-proto-carry-v1`（換任務不會清掉，「清除所有測試資料」或重新開始 T3 才清）。T4～T7 的 `carryIn` 帶入受測者的擔保品，已借款總額沿用他借的金額：T4、T5 就是那一筆（T5 另加已還清借款）；T6 拆 60% 快到期＋40%；T7 拆 50%＋25%（都展延 2 次、快到期）＋25%。可借額度放不下借款（T4 還要留 5 萬可再借）或沒有 T3 資料時，改用固定資料。T4 借的錢不帶到 T5～T7。
- 任務完成：情境設 `completeOnFlows`（例如 T1 = `['newAccountLoan', 'existingLoan']`）時，`startFlow` 不進流程，改顯示「任務完成」對話框（`app.js`），按鈕回任務列表。
- 所有任務都從證券主頁「我的」（`/home`，`shells/HomeShell.js`）開始：快捷功能「股票借貸」→ 專區，底部導覽「帳務」→ 授信管理。
- 擔保品紀錄：`account.collateralRecords` 每檔一筆 `{ id, type: 匯入|匯出, code, lots, status: 成功|失敗, appliedAt, channel }`（匯入沒有處理中，新匯入直接是成功）；情境資料要和 `collateral` 對得上。明細 › 擔保品：歷史紀錄（`CollateralHistory`，篩選未開放、可依代碼排序）；已擔保上方是排序「可借款金額高到低」＋搜尋 icon（都未開放，固定依可借款金額排序），每列有「賣股還款」（未開放），展開明細的「查看異動明細」→ `/records/collateral-changes?code=`（`CollateralChanges`，返回回已擔保）。
- 對帳單（明細 › 對帳單，`features/records/StatementList`）：借款、還款、擔保品匯入 / 匯出彙整成 StatementCard，最新的在最上面；卡片內容與各明細表格的展開明細一致，但對帳單只列成功的交易，不顯示任何狀態（失敗的擔保品匯入不列入）；上方篩選時間（預設全部期間）與交易類別（預設全部類別），可實際篩選。
- **返回路徑**：股票借貸明細（`/records`）屬於專區，按返回一律回專區（包括從完成頁進來時，不會回到完成頁）；從帳務 › 授信管理進來時網址帶 `back=/account`，返回帳務。切換頁籤會保留 `back`。
- **申請流程的按鈕狀態**：必填資訊沒完成時，下一步 / 送出按鈕一律 `disabled`，不採用「點擊後才跳錯誤訊息」。會影響能否送出的狀態（例如扣款帳戶餘額不足）直接顯示在欄位旁。
- 認識股票借貸介紹頁：`features/intro/IntroSheet`（全螢幕從底部開啟，右上 ✕ 關閉回原頁，不是獨立路由）。未借款第一次進專區自動開啟一次（`store.introShown`，每個任務重新計算；情境設 `introSeen: true` 則不自動開啟，例如 T3 首次借款，因為任務一＆二已看過）；專區右上產品說明、帳務「認識股票借貸」也可開啟。本次測試不開放開戶：開戶相關按鈕顯示未開放。「追繳風險評估 › 立即試算」與案例的「試算可借金額」關閉介紹頁並切到專區「試算」頁籤（從帳務開啟時前往 `/lending-zone?tab=simulate`）。
- 可借貸額度試算：專區「試算」頁籤（`features/simulate/SimulateForm`，草稿 `store.simDraft`；只剩一檔時「移除」停用）→ `/simulate/result`（返回帶 `?tab=simulate`）。公式在 `calc.js` 的 `simulate()`；追繳線 / 補足線在 `LOAN_RULES.callRatio / recoverRatio`。圖表（`RatioChart`）y 軸 120%～至少 160%、每 10% 一條線；x 軸右端 = 初始維持率跌到 120% 的跌幅（線落在右下角），刻度每 10%；左右拖拉圓點（每次 1%）查看維持率，手指在圖上時頁面不捲動（`touch-action: none`），預設停在起點（初始維持率）。表單下方「新增擔保品」直接開選擇標的彈窗（選完新增一列）、「使用庫存試算」本次測試不開放。結果頁「立即借貸」：未借款走 `newAccountLoan`（預先勾選有庫存的試算標的），已借款走 `existingLoan`。
- 確認資料頁的送出按鈕一律用 `COPY.common.submit`（確認送出）。
- 新頁面要在 `src/routes.js` 註冊。
- 選擇還款方式的「借新還舊」：只有展延 2 次的借款才顯示（沒指定借款時，有任何一筆即將到期且展延已滿才顯示），選了進 `refinance` 流程。
- 還款：借款紀錄到期前 `DUE_SOON_DAYS`（20）天顯示即將到期＋展延 / 還款；還款 → 選擇還款方式（`features/repay/RepayMethodSheet`，由專區 shell 與明細頁放置；專區快捷功能「還款」也會開啟）→ `cashRepay` 流程，送出 `repay()`；試算在 `calc.js` 的 `repayPlan`。
- 借新還舊：借款展延次數上限 `LOAN_RULES.maxExtensions`（2）。即將到期且展延已滿的借款，借款紀錄的「展延」改為「借新還舊」→ `refinance` 流程（`features/refinance/`：選取借款契約 → 確認資料，送出 `refinance()`）。第 1 步預設勾選點選的那筆，其他近 20 天內到期、且展延 2 次的借款可一併勾選（展延未滿的不列出）；扣款總額 = 應還利息（本期）＋ 尚未收取的借款手續費；選取的舊借款整併成一筆新借款（狀態已撥款），並新增一筆還款紀錄（還款方式借新還舊、已扣款；還款金額＝舊借款本金＋利息＋手續費），完成頁「查看借款紀錄」展開新借款。規則在 `calc.js` 的 `refinanceDue` / `refinancePlan`。
- 到期通知：有即將到期（`DUE_SOON_DAYS` 天內）的借款時，專區總覽、帳務 › 授信管理的摘要卡下方顯示「有 N 筆借款，即將到期」（`features/hub/DueSoonNotice`），點擊 → 股票借貸明細 › 借款（帳務帶 `back=/account`）。共用基本資料的借款都還沒到期；需要即將到期的任務（T6 現金還款、T7 借新還舊）自己覆寫 `loans`。
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
