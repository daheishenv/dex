/*
* vuex 全站存储
* get: this.$store.state.模块.state
* 如： this.$store.state.app.language
* set: this.$store.dispatch(actions, value)
* 如： this.$store.dispatch('setLanguage', 'en');
*/


const app = {
  state: {
    language: localStorage.getItem('language') || null, // 多语言
    trad: localStorage.getItem('trad') ? JSON.parse(localStorage.getItem('trad')) : { // 交易对默认信息 - key
      id: 1,
      symbol1: 'IQ',
      symbol2: 'EOS',
      code: 'everipediaiq',
      symbol1_code: 'everipediaiq',
      symbol2_code: 'eosio.token',
      coinDecimal: 3,
      priceDecimal: 4,
      valuationCoinDecimal: 4,
      baseChain: 'eos',
      valuationChain: 'eos',
      status: 0,
      symbol: 'everipediaiq-iq-eos'
    },
    toAccount: localStorage.getItem('toAccount') ? localStorage.getItem('toAccount') : null, // 智能合约
    accountInfo: localStorage.getItem('accountInfo') ? JSON.parse(localStorage.getItem('accountInfo')) : {}, // 账户信息
    detail: localStorage.getItem('detail') ? JSON.parse(localStorage.getItem('detail')) : null, // 订单详情
    channel: localStorage.getItem('channel') ? localStorage.getItem('channel') : '', // app名称
    precision: localStorage.getItem('precision') ? JSON.parse(localStorage.getItem('precision')) : { // 精度
      coin: 4,
      price: 4
    },
    coinList: localStorage.getItem('coinList') ? JSON.parse(localStorage.getItem('coinList')) : [], // 币种余额列表
    clickPrice: null, // 点击价格
    longClickNum: null, // 长按数量
    unReadCount: localStorage.getItem('unReadCount') ? Number(localStorage.getItem('unReadCount')) : 0, // 订单未读条数
    node: localStorage.getItem('node') ? JSON.parse(localStorage.getItem('node')) : null, // 主网节点选择
    allSymbolData: localStorage.getItem('allSymbolData') ? JSON.parse(localStorage.getItem('allSymbolData')) : null, // ws交易对列表
    allSymbolDataChange: localStorage.getItem('allSymbolDataChange') ? Number(localStorage.getItem('allSymbolDataChange')) : 0, // allSymbolData改变
    // newsList: localStorage.getItem('newsList') ? JSON.parse(localStorage.getItem('newsList')) : [], // 新闻公告列表
    newsList: [], // 新闻公告列表
    totalCoinCount: null, // 账户总估值
    symbolOrderListData: [], // 交易对订单列表
    klineConfig: {
      interval: '240', // 分辨率，时间
      intervalRam: '60', // RAM分辨率，时间
      intervalRex: '60', // Rex分辨率，时间
      intervalCpu: '60', // Cpu分辨率，时间
    },
    exchangeRate: localStorage.getItem('exchangeRate') ? JSON.parse(localStorage.getItem('exchangeRate')) : {
      eos: 1,
      eusd: 1,
    }, // 汇率
    vipInfo: localStorage.getItem('vipInfo') ? JSON.parse(localStorage.getItem('vipInfo')) : { // 账户会员信息
      discountRate: null,
      level: 0,
      maxLevel: null,
      ndxStaked: null,
      totalSaveAmount: 0,
      vipImageUrl: null,
    },
    accountTron: sessionStorage.getItem('accountTron') || '{}',
    // 账户消息
    accountMsg: {
      times: Date.parse(new Date()),
      type: '',
    },
    bookLength: '{bid: 0, ask: 0}',
    // 用户地址簿
    accountBook: [],
    // 选择地址簿存储当前页面选项值
    selectType: 0,
    quantity: '',
    reverse: true,
    address: ''
  },
  mutations: {
    SET_ACCOUNTMSG: (state, accountMsg) => {
      state.accountMsg = accountMsg;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      localStorage.setItem('language', language);
    },
    // 默认交易对信息 - function
    SET_TRAD: (state, trad) => {
      state.trad = trad;
      localStorage.setItem('trad', JSON.stringify(trad));
    },
    // 委托账户
    SET_TOACCOUNT: (state, toAccount) => {
      state.toAccount = toAccount;
      localStorage.setItem('toAccount', toAccount);
    },
    // 账户信息
    SET_ACCOUNTINFO: (state, accountInfo) => {
      state.accountInfo = accountInfo;
      localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
    },
    // 订单详情
    SET_DETAIL: (state, detail) => {
      state.detail = detail;
      localStorage.setItem('detail', JSON.stringify(detail));
    },
    // channel
    SET_CHANNEL: (state, channel) => {
      state.channel = channel;
    },
    // 精度
    SET_PRECISION: (state, precision) => {
      state.precision = precision;
      localStorage.setItem('precision', JSON.stringify(precision));
    },
    // 余额列表
    SET_COINLIST: (state, coinList) => {
      state.coinList = coinList;
      localStorage.setItem('coinList', JSON.stringify(coinList));
    },
    // 点击价格
    SET_CLICKPRICE: (state, clickPrice) => {
      state.clickPrice = clickPrice;
      // localStorage.setItem('clickPrice', clickPrice);
    },
    // 长按数量
    SET_LONGCLICKNUM: (state, longClickNum) => {
      state.longClickNum = longClickNum;
      // localStorage.setItem('longClickNum', longClickNum);
    },
    // 订单未读条数
    SET_UNREADCOUNT: (state, unReadCount) => {
      state.unReadCount = unReadCount;
      localStorage.setItem('unReadCount', unReadCount);
    },
    // 节点选择
    SET_NODE: (state, node) => {
      state.node = node;
      localStorage.setItem('node', JSON.stringify(node));
    },
    // ws交易对列表 - allSymbolData
    SET_ALLSYMBOLDATA: (state, allSymbolData) => {
      state.allSymbolData = allSymbolData;
      state.allSymbolDataChange = allSymbolData.change;
      localStorage.setItem('allSymbolData', JSON.stringify(allSymbolData));
      localStorage.setItem('allSymbolDataChange', allSymbolData.change);
    },
    // 新闻公告列表 - newsList
    SET_NEWSLIST: (state, newsList) => {
      state.newsList = newsList;
      localStorage.setItem('newsList', JSON.stringify(newsList));
    },
    // 账户总估值
    SET_TOTALCOINCOUNT: (state, totalCoinCount) => {
      state.totalCoinCount = totalCoinCount;
      sessionStorage.setItem('totalCoinCount', JSON.stringify(totalCoinCount));
    },
    // 交易对订单列表
    SET_SYMBOLORDERLISTDATA: (state, symbolOrderListData) => {
      state.symbolOrderListData = symbolOrderListData;
      sessionStorage.setItem('symbolOrderListData', JSON.stringify(symbolOrderListData));
    },
    SET_KLINECONFIG: (state, klineConfig) => {
      state.klineConfig = klineConfig;
    },
    // 汇率
    SET_EXCHANGERATE: (state, exchangeRate) => {
      state.exchangeRate = exchangeRate;
      localStorage.setItem('exchangeRate', JSON.stringify(exchangeRate));
    },
    // 账户会员信息
    SET_VIPINFO: (state, vipInfo) => {
      state.vipInfo = vipInfo;
      localStorage.setItem('vipInfo', JSON.stringify(vipInfo));
    },
    // tron波产账户信息
    SET_ACCOUNTTRON: (state, accountTron) => {
      state.accountTron = JSON.stringify(accountTron);
      sessionStorage.setItem('accountTron', JSON.stringify(accountTron));
    },
    // 设置订单本长度
    SET_BOOKLENGTH: (state, bookLength) => {
      state.bookLength = JSON.stringify(bookLength);
    },
    // 地址簿
    SET_ACCOUNTBOOK: (state, accountBook) => {
      state.accountBook = accountBook;
    },
    SET_SELECTYPE: (state, val) => {
      state.selectType = val
    },
    SET_QUANTITY: (state, val) => {
      state.quantity = val
    },
    SET_REVERSE: (state, val) => {
      state.reverse = val
    },
    SET_ADDRESS: (state, val) => {
      state.address = val
    }
  },
  actions: {
    setAccountMsg({ commit }, accountMsg) {
      commit('SET_ACCOUNTMSG', accountMsg);
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    // 默认交易对信息 - set
    setTrad({ commit }, trad) {
      commit('SET_TRAD', trad);
    },
    // 委托账户
    setToAccount({ commit }, toAccount) {
      commit('SET_TOACCOUNT', toAccount);
    },
    // 账户信息
    setAccountInfo({ commit }, accountInfo) {
      commit('SET_ACCOUNTINFO', accountInfo);
    },
    // 订单详情
    setDetail({ commit }, detail) {
      commit('SET_DETAIL', detail);
    },
    // channel
    setChannel({ commit }, channel) {
      commit('SET_CHANNEL', channel);
    },
    // 精度
    setPrecision({ commit }, precision) {
      commit('SET_PRECISION', precision);
    },
    // 余额列表
    setCoinList({ commit }, coinList) {
      commit('SET_COINLIST', coinList);
    },
    // 点击价格
    setClickPrice({ commit }, clickPrice) {
      commit('SET_CLICKPRICE', clickPrice);
    },
    // 长按价格
    setLongClickNum({ commit }, longClickNum) {
      commit('SET_LONGCLICKNUM', longClickNum);
    },
    // 订单未读条数
    setUnReadCount({ commit }, unReadCount) {
      commit('SET_UNREADCOUNT', unReadCount);
    },
    // 节点
    setNode({ commit }, node) {
      commit('SET_NODE', node);
    },
    // ws交易对列表 - allSymbolData
    setAllSymbolData: ({ commit }, allSymbolData) => {
      commit('SET_ALLSYMBOLDATA', allSymbolData);
    },
    // 新闻公告列表 - newsList
    setNewsList: ({ commit }, newsList) => {
      commit('SET_NEWSLIST', newsList);
    },
    // 账户总估值
    setTotalCoinCount({ commit }, totalCoinCount) {
      commit('SET_TOTALCOINCOUNT', totalCoinCount);
    },
    // 交易对订单列表
    setSymbolOrderListData({ commit }, symbolOrderListData) {
      commit('SET_SYMBOLORDERLISTDATA', symbolOrderListData);
    },
    setKlineConfig({ commit }, klineConfig) {
      commit('SET_KLINECONFIG', klineConfig);
    },
    // 汇率
    setExchangeRate({ commit }, exchangeRate) {
      commit('SET_EXCHANGERATE', exchangeRate);
    },
    // 汇率
    setVipInfo({ commit }, vipInfo) {
      commit('SET_VIPINFO', vipInfo);
    },
    // tron波产账户信息
    setAccountTron({ commit }, accountTron) {
      commit('SET_ACCOUNTTRON', accountTron);
    },
    // 设置订单本长度
    setBookLength({ commit }, bookLength) {
      commit('SET_BOOKLENGTH', bookLength);
    },
    // 地址簿
    setAccountBook({ commit }, accountBook) {
      commit('SET_ACCOUNTBOOK', accountBook);
    },
    // 兑换USDT 兑换类型
    setSelectType({ commit }, val) {
      commit('SET_SELECTYPE', val);
    },
    // 兑换USDT 存储数量
    setQuantity({ commit }, val) {
      commit('SET_QUANTITY', val);
    },
    setReverse({ commit }, val) {
      commit('SET_REVERSE', val)
    },
    setAddress({ commit }, val) {
      commit('SET_ADDRESS', val)
    }
  }
};

export default app;
