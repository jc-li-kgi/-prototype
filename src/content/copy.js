// 所有文案集中管理：改字只改這裡
export const COPY = {
  // 任務完成通知（主持人用，見 app.js）
  task: {
    doneTitle: '任務完成',
    doneBody: (title) => `已完成「${title}」，謝謝你的協助！`,
    backToList: '回到任務列表',
    label: (no, title) => `任務${no}　${title}`, // no 來自情境（例如「一＆二」）
  },

  common: {
    notAvailable: '此功能未開放於本次測試',
    next: '下一步',
    confirm: '確認',
    submit: '確認送出', // 所有確認資料頁的送出按鈕
    done: '完成',
    gotIt: '我知道了',
    resetDone: '已清除所有測試資料',
    expand: '展開明細',   // 卡片展開 / 收合（StatementCard 等）
    collapse: '收闔明細',
  },

  // 可借貸額度試算｜Figma 3131:188036（輸入）、2565:50221（選擇標的）、2631:58837（結果）
  simulate: {
    intro: '根據你的擔保標的，幫你計算「可借貸額度」，以及「可能被追繳的跌幅」，讓你隨時安心借款',
    itemLabel: (n) => `擔保品 ${n}`,
    remove: '移除',
    pickPlaceholder: '選擇擔保標的',
    holdingHint: (price, lots) => (lots ? `收盤價 ${price}，庫存 ${lots} 張` : `收盤價 ${price}`),
    lotsLabel: '擔保張數',
    lotsPlaceholder: '請輸入數字',
    lotUnit: '張',
    customPick: '新增擔保品',
    useHoldings: '使用庫存試算', // 本次測試不開放
    submit: '試算',
    sheetTitle: '選擇可擔保標的',
    searchPlaceholder: '搜尋產品關鍵字或代碼',
    price: '收盤價',
    holding: '庫存',
    emptySearch: '查無符合的股票',
    // 結果頁
    resultTitle: '可借貸額度試算',
    loanable: '預估可借款金額',
    loanableSheet: { title: '預估可借款金額', body: '預估可借款金額 = Σ 擔保張數 × 每張市值 × 可借貸成數，依今日收盤價計算，僅供參考。' },
    currencyName: '台幣',
    maxTerm: '最長借款期限',
    maxTermValue: (m) => `${m} 個月`,
    dailyInterest: '預估每日利息',
    dailyInterestSheet: { title: '預估每日利息', body: '預估每日利息 = 預估可借款金額 × 參考年利率 2.8% ÷ 365。' },
    riskTitle: '追繳風險評估',
    initialRatio: '初始借款維持率',
    callDrop: '可承受市值跌幅',
    callRepay: '若追繳，需還款至少',
    chartX: '市值(％)',
    chartCall: (call, recover) => [`維持率低於 ${call}% 將被追繳，`, `需於兩日內補款至 ${recover}% 以解除。`],
    tipDrop: (d) => `市值下降 ${d}%`,
    tipRatio: (r) => `維持率 ${r}%`,
    riskNote: '拖曳圓點，可查看市值下跌時的維持率。本試算以最高可借額度計算，實際借款金額越低，維持率越高。',
    itemsTitle: '預期匯入擔保品',
    note: '以上借款金額與收費，依實際申請計算為準',
    borrow: '立即借貸',
  },

  // 認識股票借貸（介紹頁）｜Figma 1804:138177
  intro: {
    title: '認識股票借貸',
    close: '關閉說明頁',
    banner: ['長期投資不只是持有！', '股票借貸與借券，讓資產再活化'],
    tabs: [
      { key: 'lending', label: '股票借貸', icon: 'tab-loan.svg' },
      { key: 'sbl', label: '雙向借券', icon: 'tab-repeat.svg' },
    ],
    whatTitle: '股票借貸是什麼？',
    what: [
      { title: '用持股擔保，不被收入影響', desc: '利率與借款額度以庫存股票審核，不看職業與收入條件，資金取得更輕鬆' },
      { title: '隨借隨還，用途不受限', desc: '1 小時內放款，資金彈性運用，並提供現金、借新還舊與賣股還款，降低還款壓力' },
    ],
    casesTitle: '看看其他投資人經驗',
    case1: {
      tag: '經驗一',
      steps: [
        { title: '長期定期定額', desc: '穩定持有 35 張 凱基金, 市值約 100 萬' },
        { title: '匯入股票借貸帳戶，啟動活化', desc: '免賣股，透過股票擔保獲得 60 萬資金' },
        { title: '多元運用資金', desc: '用於繳稅、裝潢，或逢低買進增加持股' },
        { title: '持續複利增值', desc: '借款期間 凱基金 持續參與市場，配息照領，股東權益零損失' },
      ],
      ask: '還沒開借貸戶嗎？',
      cta: '立即前往開戶',
    },
    case2: {
      tag: '經驗二',
      title: '不只當臨用金，也能放大投資本金！',
      desc: '透過利差放大資本，加碼ETF與潛力股',
      cta: '試算可借金額',
    },
    riskTitle: '會有什麼風險呢？',
    riskChartAlt: '擔保品市值從 100 萬跌到 78 萬、借款 60 萬時，維持率從 166% 降到 130%；維持率低於 130% 將被追繳，需於兩日內還款至 166% 以解除。',
    riskDesc: ['若擔保品市值下跌，', '維持率 (擔保品市值 ÷ 借款金額)過低，券商會要求提前還款'],
    riskMore: '想更了解擔保品＆維持率嗎？',
    riskFaq: '查看常見問題',
    toolsTitle: ['凱基', '大輔助工具，讓您安心借貸'],
    tools: [
      { title: '追繳風險評估', desc: '試算股價與維持率的關係，直覺掌握借貸風險。', link: '立即試算', action: 'simulate' }, // → 專區「試算」頁籤
      { title: '自主設定維持率提醒', desc: '自主設定安心的維持率通知，不被動等券商通知，隨時掌握波動' },
      { title: '多元的維持率提升功能', desc: '現金還款、抵押更多擔保品，或賣股還款，彈性解除追繳' },
    ],
    howTitle: '我要如何操作呢?',
    how: [
      {
        // image：assets/illustrations/ 的畫面截圖；imageSize = 顯示寬高（高度一律 275，寬度依原圖比例）
        key: 'open', label: '1. 開戶', image: 'intro-app-screen.png', imageSize: [136, 275],
        title: '前往「快e開」開立借貸款項業務',
        desc: '需為年滿 20 歲（含）以上之凱基證券客戶，且已於凱基或其他券商完成開戶滿 3 個月，且非凱基證券內部員工。',
        hint: '尚未開立嗎？', link: '前往申請',
      },
      // 以下兩頁文字 Figma 尚無內容（自行補）；截圖由設計提供（介紹頁畫面截圖/）
      { key: 'borrow', label: '2. 借款', image: 'intro-how-borrow.png', imageSize: [193, 275], title: '匯入擔保品，填寫借款金額', desc: '在股票借貸專區選擇要擔保的庫存股票，確認可借額度後填寫借款金額，最快 1 小時撥款。' },
      { key: 'repay', label: '3. 還款', image: 'intro-how-repay.png', imageSize: [185, 275], title: '隨時還款，方式多元', desc: '可選擇現金還款、借新還舊或賣股還款；借款到期前 20 天會提醒您。' },
    ],
    faqTitle: '常見問題',
    // 只有「開戶」第 1 題有 Figma 內容，其他自行補
    faq: [
      {
        key: 'open', label: '開戶',
        items: [
          { q: '誰可以開股票借貸戶？', a: '年滿 20 歲的本國人、本國法人或境內華僑及外國人，需開戶滿3個月（也可提供其他券商開戶證明），即可開戶。' },
          { q: '借貸戶有哪些限制？', a: '資金用途不受限；借款額度依擔保品市值與成數計算，單筆最低 TWD 10,000，借款期間 6 個月可展延。' },
          { q: '開戶需要準備哪些文件？', a: '透過「快e開」線上申請，備妥身分證與第二證件即可，不需臨櫃。' },
          { q: '我需要準備財力證明文件嗎？', a: '不需要。借款額度以您匯入的擔保品市值與成數計算，不看收入條件。' },
        ],
      },
      {
        key: 'collateral', label: '擔保品',
        items: [
          { q: '哪些股票可以當擔保品？', a: '上市櫃股票與 ETF 多數可作為擔保品；處置股、流動性低的股票無法作為擔保品。' },
          { q: '擔保品匯入後還能領股利嗎？', a: '可以，擔保期間配息、配股照常發放，股東權益不受影響。' },
        ],
      },
      {
        key: 'ratio', label: '維持率',
        items: [
          { q: '什麼是整戶維持率？', a: '整戶維持率 = 擔保品市值 ÷ 借款總額 × 100%，用來衡量借款的風險。' },
          { q: '維持率過低會怎樣？', a: '維持率低於 130% 將被追繳，需於兩日內補足擔保品或還款至 166% 以解除。' },
        ],
      },
      {
        key: 'borrow', label: '借款',
        items: [
          { q: '最快多久可以撥款？', a: '申請送出後最快 1 小時撥款至您的交割帳戶。' },
          { q: '單筆最低可以借多少？', a: '單筆最低 TWD 10,000，以 TWD 1,000 為單位。' },
        ],
      },
      {
        key: 'repay', label: '還款',
        items: [
          { q: '可以提前還款嗎？', a: '可以隨時還款，利息依實際借款天數計算。' },
          { q: '有哪些還款方式？', a: '提供現金還款、借新還舊與賣股還款三種方式。' },
        ],
      },
    ],
    footer: '捨不得賣出庫存，立即股票借貸，輕鬆解決資金需求',
    apply: '馬上線上申請',
  },

  // 證券主頁「我的」
  home: {
    searchPlaceholder: '搜尋產品關鍵字或代碼',
    newVersion: '新版',
    overviewTitle: '帳務總覽',
    edit: '編輯',
    twStockValue: '台股庫存總市值',
    profit: '參考損益',
    twAd: '台股定期定額，輕鬆投資無負擔！',
    shortcutTitle: '快捷功能',
    shortcutEdit: '自訂',
    // lending: true → 進股票借貸專區，其他未開放
    shortcuts: [
      { icon: 'shortcut-pre-market.png', label: '盤前必讀' },
      { icon: 'shortcut-dividend.png', label: '股利專區' },
      { icon: 'shortcut-lending.png', label: '股票借貸', lending: true },
      { icon: 'shortcut-us-dca.png', label: '美股定期定額' },
      { icon: 'shortcut-ipo-lottery.png', label: '股票抽籤' },
      { icon: 'shortcut-us-quote.png', label: '即時美股行情' },
      { icon: 'shortcut-wealth.png', label: '財富管理' },
      { icon: 'shortcut-bank-account.png', label: '開立凱基銀行數位帳戶' },
    ],
  },

  account: {
    title: '帳務',
    productTabs: ['總覽', '台股', '海外', '財富管理', '期權', '外期權', '授信管理'],
    creditTabs: ['股票借貸', '雙向借券', '融資融券'],
    updatedAt: '更新時間',
  },

  hub: {
    dueSoonNotice: (n) => `有 ${n} 筆借款，即將到期`, // 到期通知｜Figma 3177:194338、2720:159497
    ratio: '整戶維持率',
    collateralValue: '擔保品市值',
    borrowed: '已借款金額',
    remaining: '剩餘可借額度',
    raiseLimit: '提升可借總額',
    borrowAgain: '再借一筆',
    moreServices: '更多服務',
    // 尚未借款
    introSection: '認識並開立借貸戶，活化資產更簡單',
    introServices: [
      { title: '認識股票借貸', desc: '瀏覽實際案例、試算以及常見問題' },
      { title: '馬上借貸一筆', desc: '匯入擔保品與借款一次完成' },
    ],
    goZone: '前往專區',
    services: ['查看借還款紀錄', '管理擔保品', '查看對帳單'],
  },

  loan: {
    title: '申請借款',
    ratio: '整戶維持率',
    remaining: '剩餘可借金額',
    borrowed: '已借款金額',
    purpose: '借款目的',
    purposePlaceholder: '請選擇',
    amount: '借款金額',
    amountPlaceholder: '請輸入借款金額',
    limitLink: '額度限制',
    rangeHint: (min, max) => `可借款金額 TWD ${min}～TWD ${max}`,
    stepHint: (step) => `累加金額 TWD ${step}`,
    ratioAfter: '借款後整戶維持率',
    feeTitle: '借款費用',
    refRate: '參考利率',
    halfYearInterest: '半年利息',
    estInterest: '預估利息',
    fee: '借款手續費',
    feeNote: '費用僅供參考，實際收費依還款當下計算為準',
    currency: '臺幣',
    startDate: '起息日',
    dueDate: '到期日',
    applyDate: '申請日',
    payout: '款項匯入帳號',

    // 說明彈窗
    limitSheet: {
      title: '額度限制',
      body: '單筆借款最低 TWD 10,000，最高為剩餘可借金額，金額須以 TWD 1,000 為單位。',
    },
    ratioSheet: {
      title: '借款後整戶維持率',
      body: '整戶維持率 = 擔保品市值 ÷ 借款總額 × 100%。維持率低於 130% 時，需補繳擔保品或還款。',
    },
    feeSheet: {
      title: '借款手續費',
      body: '每筆借款於撥款時收取手續費 TWD 2。',
    },

    resultTitle: '成功送出申請',
    resultDesc: '我們將在 1 小時內完成撥款，敬請留意款項是否已匯入您的帳戶',
    viewRecords: '查看借款紀錄',
  },

  // 借新還舊｜Figma 1804:117905（選取借款）、1804:117906（展開明細）、1804:118296（確認資料）、1804:117210（完成）
  refinance: {
    title: '申請借新還舊',
    refRate: '當前參考利率',
    listTitle: '選取要續借的借款',
    selectAll: '全選',
    listDesc: '近 20 天內到期的借款，可以同時申請借新還舊', // 清單只列展延次數已滿的借款
    due: (d) => `${d} 到期`,
    extensions: '展延次數',
    interest: '應還利息',
    interestAndFee: '應還利息與借款手續費',
    detail: {
      amount: '初始借款金額',
      startDate: '起息日',
      accrued: '累積利息',
      serial: '借款序號',
      applyDate: '申請日',
      channel: '申請管道',
    },
    total: '扣款總額',
    selectedCount: (n) => `(已選取 ${n} 筆)`,
    breakdownTitle: '扣款明細',
    totalInterest: '應還利息',
    totalFee: '借款手續費',
    // 確認資料
    payTitle: '扣款資訊',
    bankAccount: '扣款帳號',
    bankBalance: '扣款帳戶餘額',
    balanceError: '扣款帳戶餘額不足，請先存入款項',
    applyDate: '申請日',
    newTitle: '新借款契約',
    newDesc: '依據選取的舊借款，將會整合成一筆，方便您管理',
    amount: '借款金額',
    rate: '利率',
    estInterest: '預估利息',
    estFee: '預估借款手續費',
    startDate: '起息日',
    dueDate: '到期日',
    purpose: '借款目的',
    // 完成頁
    resultTitle: '成功送出申請',
    resultDesc: '系統將在營業日內完成扣款',
    viewRecords: '查看借款紀錄',
  },

  repay: {
    methodTitle: '選擇還款方式',
    // available: false → 點了顯示未開放
    methods: [
      { value: 'cash', label: '現金還款', desc: '以現金償還借款金額', available: true },
      { value: 'refinance', label: '借新還舊', desc: '新增一筆借款償來還舊的借款，只要付利息與借款手續費' },
      { value: 'sell', label: '賣股還款', desc: '賣出擔保的股票進行還款' },
    ],
    title: '現金還款',
    ratio: '整戶維持率',
    borrowed: '已借款金額',
    dueSoonAmount: '即將到期金額',
    modeTitle: '還款額度',
    modes: [{ value: 'partial', label: '部分' }, { value: 'full', label: '全部' }],
    principal: '還款本金',
    suggestHint: (amount) => `建議還款金額大於 TWD ${amount}`,
    ratioAfter: '還款後整戶維持率',
    ratioSheet: {
      title: '還款後整戶維持率',
      body: '整戶維持率 = 擔保品市值 ÷ 借款總額 × 100%。還款後借款總額減少，維持率會提高；全部還清後不再計算維持率。',
    },
    interest: '利息',
    fee: '借款手續費',
    total: '總扣款金額',
    bankAccount: '扣款帳號',
    bankBalance: '扣款帳戶餘額',
    balanceError: '扣款帳戶餘額不足',
    applyDate: '申請日',
    purpose: '借款目的',
    resultHeader: '申請現金還款',
    resultTitle: '成功送出申請',
    resultDesc: '我們即將為您進行扣款，請稍後確認還款結果',
    viewRecords: '查看還款紀錄',
  },

  collateral: {
    title: '匯入擔保品',
    sortTitle: '選擇排序方式',
    groups: {
      eligible: { title: '可借貸' },
      ratioOnly: {
        title: '僅可用於提升維持率',
        desc: '無法借款，借款後，可以匯入提高擔保品市值，提升維持率', // 首次借款（不可勾選）
        descImport: '可以匯入提高擔保品市值，提升維持率',            // 已借款，可勾選匯入
      },
      ineligible: { title: '無法作為擔保品', desc: '非上市櫃、處置股、流動性低，無法轉為擔保品' },
    },
    availableLots: '可擔保張數',
    perLot: '每張可借 (TWD)',
    ratio: '可借貸成數',
    importLots: '匯入張數',
    lotUnit: '張',
    reason: '原因：',
    notes: '注意事項',
    notesSheet: {
      title: '注意事項',
      body: '擔保品匯入後將由集保帳戶轉入擔保品專戶，匯入期間無法賣出。可借額度依每日收盤價與可借貸成數重新計算，實際額度以撥款當時為準。',
    },
    total: '可借額度總計',
    totalSheet: {
      title: '可借額度總計',
      body: '可借額度 = 匯入張數 × 每張可借金額。每張可借金額 = 每張市值 × 可借貸成數。',
    },
    breakdownTitle: '已選取擔保品',
    noneSelected: '尚未選擇擔保品',
    // 第 2 步
    marketValue: '匯入擔保品總市值',
    importDate: '匯入日',
    channel: '申請管道',
    channelValue: 'APP',
    detailTitle: '擔保品匯入明細',
    // 完成頁
    resultTitle: '匯入成功',
    resultDesc: '可以隨時動用借款，靈活操作',
    borrowNow: '立即借款',
    viewCollateral: '查看擔保品',
  },

  zone: {
    heroTitle: '股票借貸，存股變現金',
    heroDesc: '免賣股、股息照領，用途不受限，靈活運用長期持股，放大資產效益！',
    tabs: [{ key: 'overview', label: '總覽' }, { key: 'simulate', label: '試算' }],
    remaining: '剩餘可借額度',
    ratio: '整戶維持率',
    borrowed: '已借款金額',
    limit: '可借總額度',
    actions: ['還款', '查看借還款紀錄', '管理擔保品', '更多'],
    importableTitle: '尚可匯入擔保品',
    viewAll: '查看全部',
    importableHint: '匯入後，可借總額提升',

    // 尚未借款（未開戶）
    introTitle: '續抱好股票，借貸讓資金多一條出路',
    introLoanable: '預估庫存可借貸',
    introDailyInterest: '預估每日利息',
    introNotice: '動用不受限，最快 1 小時撥款，隨借隨還',
    picksTitle: '您的庫存精選擔保品',
    pickLoanable: '庫存可借款',
    borrowNow: '馬上借貸一筆',
    wan: '萬',
  },

  holdings: {
    colName: ['商品名稱', '代碼'],
    colLots: '剩餘可匯入張數',
    colAmount: '預估可借總額',
    amountSheet: {
      title: '預估可借總額',
      body: '預估可借總額 = 剩餘可匯入張數 × 每張可借金額，依今日收盤價計算，僅供參考。',
    },
    importBtn: '匯入',
    typeLabel: { ratioOnly: '僅可提升維持率', ineligible: '無法作為擔保品' }, // 預估可借總額欄（非可借貸的庫存）
    detail: { name: '商品名稱', pledgedLots: '已匯入張數', price: '收盤價' }, // 展開明細
    empty: '目前沒有可匯入的庫存',
  },

  records: {
    title: '股票借貸明細',
    tabs: [
      { key: 'loans', label: '借還款紀錄' },
      { key: 'collateral', label: '擔保品' },
      { key: 'statement', label: '對帳單' },
    ],
    // 借還款紀錄
    loanTabs: [{ key: 'borrow', label: '借款' }, { key: 'repay', label: '還款' }],
    periodFilter: '近一年',
    statusFilter: '借款狀態',
    colBalance: ['未償還金額', '借款狀態'],
    colDue: '到期日',
    // 還款紀錄
    repayFilters: ['還款方式', '扣款狀態'],
    colRepay: ['還款金額', '扣款狀態'],
    colMethod: '還款方式',
    colAppliedAt: '線上申請日',
    repayDetail: {
      appliedAt: '交易申請日',
      principal: '還款本金',
      interest: '利息',
      fee: '借款手續費',
      bank: '扣款帳號',
      serial: '申請序號',
      channel: '申請管道',
    },
    dueSoon: '即將到期',
    extend: '展延',
    refinance: '借新還舊', // 展延次數已滿時取代「展延」
    repay: '還款',
    // 借款展開明細｜Figma 3167:192520
    borrowDetail: {
      startDate: '起息日',
      amount: '初始借款金額',
      rate: '利率',
      interest: '預估利息',
      fee: '借款手續費',
      extensions: '展延次數',
      applyDate: '申請日',
      serial: '借款序號',
      channel: '申請管道',
    },
    repayRecords: '還款紀錄',
    extendRecords: '展延紀錄',
    empty: '目前沒有借款紀錄',
    emptyRepay: '目前沒有還款紀錄',
    // 擔保品
    collateralTabs: [
      { key: 'pledged', label: '已擔保' },
      { key: 'unpledged', label: '未擔保' },
      { key: 'history', label: '歷史紀錄' },
    ],
    searchPlaceholder: '搜尋產品關鍵字或代碼',
    importCollateral: '匯入擔保品',
    // 已擔保｜Figma 3061:69619
    colPledgedLots: '已匯入張數',
    colPledgedLoan: '可借總金額',
    pledgedLoanSheet: { title: '可借總金額', body: '可借總金額 = 已匯入張數 × 每張可借金額，依今日收盤價計算，僅供參考。' },
    pledgedSort: '可借款金額高到低', // 已擔保預設排序（切換排序、搜尋本次測試不開放）
    sellRepay: '賣股還款', // 本次測試不開放
    pledgedDetail: {
      name: '商品名稱',
      approval: '核准狀況',
      price: '收盤價',
      serial: '存入序號',
      category: '類別',
    },
    approvalLabel: { eligible: '可借款', ratioOnly: '僅可提升維持率' },
    categoryValue: '融通擔保品',
    viewChanges: '查看異動明細',
    emptyPledged: '目前沒有擔保品',
    // 歷史紀錄｜Figma 3060:66168（每檔一筆）
    historyFilters: ['近一月', '全部類型'],
    colHistoryName: ['商品名稱', '代碼'],
    colHistoryStatus: '狀態',
    colHistoryType: ['異動類型', '張數'],
    historyDetail: { name: '商品名稱', appliedAt: '申請時間', serial: '申請序號', channel: '申請管道' },
    lots: (n) => `${n} 張`,
    emptyHistory: '目前沒有擔保品紀錄',
    // 單檔擔保品異動明細｜Figma 1786:98330
    changes: {
      title: '擔保品異動明細',
      colDate: ['異動日', '狀態'],
      colType: ['動作類別', '張數'],
      status: (r) => (r.status === '成功' ? '交易成功' : r.status === '失敗' ? `${r.type}失敗` : r.status),
      detail: { applyDate: '申請日', applyTime: '申請時間', serial: '申請序號', channel: '申請管道' },
      empty: '目前沒有異動紀錄',
    },
    emptySearch: '查無符合的股票',
    // 對帳單
    // 對帳單：借款、還款、擔保品匯入 / 匯出彙整成卡片（最新的在最上面）
    statement: {
      tags: { loan: '借款', repay: '還款', 匯入: '匯入擔保品', 匯出: '匯出擔保品' },
      // 篩選：時間（days = 往前幾天，null = 全部）、交易類別（value 對應 tags 的 key）
      periodTitle: '選擇時間',
      periods: [
        { value: 'all', label: '全部期間', days: null },
        { value: '1m', label: '近一月', days: 30 },
        { value: '3m', label: '近三月', days: 90 },
        { value: '6m', label: '近半年', days: 182 },
        { value: '1y', label: '近一年', days: 365 },
      ],
      typeTitle: '選擇交易類別',
      types: [
        { value: 'all', label: '全部類別' },
        { value: 'loan', label: '借款' },
        { value: 'repay', label: '還款' },
        { value: '匯入', label: '匯入擔保品' },
        { value: '匯出', label: '匯出擔保品' },
      ],
      emptyFilter: '這段期間沒有符合的紀錄',
      loan: { startDate: '起息日', dueDate: '到期日', applyDate: '申請日' },
      repay: { method: '還款方式' },
      collateral: { lots: '張數' },
      empty: '目前沒有對帳紀錄',
    },
  },
};
