// 所有文案集中管理：改字只改這裡
export const COPY = {
  common: {
    notAvailable: '此功能未開放於本次測試',
    next: '下一步',
    confirm: '確認',
    done: '完成',
  },

  account: {
    title: '帳務',
    productTabs: ['總覽', '台股', '海外', '財富管理', '期權', '外期權', '授信管理'],
    creditTabs: ['股票借貸', '雙向借券', '融資融券'],
    updatedAt: '更新時間',
  },

  hub: {
    ratio: '整戶維持率',
    collateralValue: '擔保品市值',
    borrowed: '已借款金額',
    remaining: '剩餘可借額度',
    raiseLimit: '提升可借總額',
    borrowAgain: '再借一筆',
    moreServices: '更多服務',
    goZone: '前往專區',
    services: ['查看借還款紀錄', '管理擔保品', '查看對帳單'],
  },

  loan: {
    title: '申請借款',
    ratio: '整戶維持率',
    remaining: '剩餘可借金額',
    borrowed: '已借款金額',
    pendingCollateralValue: '匯入擔保品市值',
    purpose: '借款目的',
    purposePlaceholder: '請選擇',
    purposeError: '請選擇借款目的',
    amount: '借款金額',
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

  collateral: {
    title: '匯入擔保品',
    sortTitle: '排序方式',
    groups: {
      eligible: { title: '可借貸' },
      ratioOnly: { title: '僅可用於提升維持率', desc: '無法借款，借款後，可以匯入提高擔保品市值，提升維持率' },
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
    breakdownTitle: '匯入明細',
    noneSelected: '尚未選擇擔保品',
    // 第 2 步
    marketValue: '匯入擔保品總市值',
    importDate: '匯入日',
    channel: '申請管道',
    channelValue: 'APP',
    detailTitle: '擔保品匯入明細',
    submit: '確認送出',
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
    dueSoon: '即將到期',
    extend: '展延',
    repay: '還款',
    empty: '目前沒有借款紀錄',
    emptyRepay: '目前沒有還款紀錄',
    // 擔保品
    collateralTabs: [
      { key: 'pledged', label: '已擔保' },
      { key: 'unpledged', label: '未擔保' },
      { key: 'history', label: '歷史紀錄' },
    ],
    unpledgedHint: '僅顯示可匯入擔保的庫存',
    unpledgedHintSheet: {
      title: '可匯入擔保的庫存',
      body: '僅列出可借貸的庫存。處置股、流動性低等無法作為擔保品的股票不會顯示。',
    },
    searchPlaceholder: '搜尋產品關鍵字或代碼',
    importCollateral: '匯入擔保品',
    colPledgedLots: '已擔保張數',
    colPledgedLoan: '可借金額',
    emptyPledged: '目前沒有擔保品',
    emptyHistory: '目前沒有擔保品紀錄',
    emptySearch: '查無符合的股票',
    // 對帳單
    statementNotAvailable: '對帳單未開放於本次測試',
  },
};
