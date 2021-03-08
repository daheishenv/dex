/*
* vuex 全站存储 - 存储一些配置类参数
* get: this.$store.state.模块.state
* 如： this.$store.state.app.language
* set: this.$store.dispatch(actions, value)
* 如： this.$store.dispatch('setLanguage', 'en');
*/

const sys = {
  state: {
    toAccountList: localStorage.getItem('toAccountList') ? localStorage.getItem('toAccountList') : null, // 智能合约账户列表

    nodeList: localStorage.getItem('nodeList') ? JSON.parse(localStorage.getItem('nodeList')) : null, // 多链默认节点列表

    // newArea: { // 配置当前开放的分区 - 基本不会动态更新
    //   self: ['SELF'],
    //   EosMain: ['EOS', 'EUSD', 'CUSD'], // EOS主链
    //   EosSide: ['BOS', 'MEETONE', 'ENU', 'FIBOS'], // EOS侧链
    // },
    // 配置当前开放的分区 - 基本不会动态更新 - 默认EOS分区
    newArea: localStorage.getItem('newArea') ? JSON.parse(localStorage.getItem('newArea')) : {},
    tronNewdex: { // tron项目的分区 - 作为参数，用于对newArea重新配置
      self: {
        SELF: {
          index: 0,
          tabName: 'SELF',
          chainCode: '',
        }
      },
      Usdt: {
        USDT: {
          index: 0,
          tabName: 'USDT',
          chainCode: 'USDT',
        }
      },
      Tron: {
        TRON: {
          index: 0,
          tabName: 'TRON',
          chainCode: 'TRX',
        }
      },
    },
    initVipInfo: { // 账户不存在时，初始化的会员账户信息
      account: '',
      ambassadorType: null,
      anonymous: 0,
      chain: 'eos',
      consumeLevel: 0,
      discountRate: 1,
      email: '',
      expireTime: null,
      isDealRemind: 0,
      isMarketRemind: 1,
      isRenew: 0,
      level: 0,
      maxLevel: 10,
      ndxStaked: 0,
      orderTime: null,
      noRemindPartial: 0,
      remainDealRemindCount: 10,
      remainDrawCount: 0,
      remainMarketRemindCount: 5,
      renewDuration: 0,
      stakeLevel: 0,
      vipMode: 0,
      weight: 0,
      weightRatio: 0,
      usedMarketRemindCount: 0,
      totalSaveAmount: 0,
      vipImageUrl: '',
      remainFreeOrderCount: 1
    },
    // 区块链浏览器配置
    blockBrowser: {
      eos: {
        // tx: 'https://eospark.com/tx/',
        // account: 'https://eospark.com/account/',
        tx: 'https://bloks.io/transaction/',
        account: 'https://bloks.io/account/',
        token: 'https://bloks.io/tokens/',
      },
      bos: {
        // tx: 'https://bos.eospark.com/tx/',
        // account: 'https://bos.eospark.com/account/',
        tx: 'https://bos.bloks.io/transaction/',
        account: 'https://bos.bloks.io/account/',
        token: 'https://bos.bloks.io/tokens/',
      },
      // meetone: {
      //   tx: 'https://meetone.bloks.io/transaction',
      //   account: 'https://meetone.bloks.io/account/',
      //   token: 'https://meetone.bloks.io/tokens/',
      // },
      enu: {
        tx: 'http://enumivo.qsx.io/transactions/',
        account: 'http://enumivo.qsx.io/accounts/',
      },
      fibos: {
        tx: 'https://explorer.fibos.rocks/transactions/',
        account: 'https://explorer.fibos.rocks/accounts/'
      },
      telos: {
        tx: 'https://telos.bloks.io/transaction/',
        account: 'https://telos.bloks.io/account/',
        token: 'https://telos.bloks.io/tokens/',
      },
      tron: {
        tx: 'https://tronscan.org/#/transaction/',
        account: 'https://tronscan.org/#/address/',
        token: 'https://tronscan.org/#/token/',
        token20: 'https://tronscan.org/#/token20/',
      },
      eth: {
        tx: 'https://cn.etherscan.com/address/',
      },
      wax: {
        tx: 'https://wax.bloks.io/transaction/',
        account: 'https://wax.bloks.io/account/',
        token: 'https://wax.bloks.io/tokens/'
      },
      // lynx: {
      //   tx: 'https://lynx.bloks.io/transaction/',
      //   account: 'https://lynx.bloks.io/account/',
      //   token: 'https://lynx.bloks.io/tokens/'
      // },
      proton: {
        tx: 'https://proton.bloks.io/transaction/',
        account: 'https://proton.bloks.io/account/',
        token: 'https://proton.bloks.io/tokens/'
      }
    },
    // 冷钱包配置
    coldWallet: {
      eos: 'newdexiocold',
      bos: '',
      telos: '',
      // meetone: '',
      wax: '',
      // lynx: '',
      proton: ''
    },
    tronNewdexColdWallet: {
      tron: '',
    },
    // url参数传递的链 - 有值: 新版本 | 无值: 旧版本(需兼容)
    urlChain: sessionStorage.getItem('urlChain') ? sessionStorage.getItem('urlChain').toLowerCase() : '',
    // xeos查询余额接口地址 eg: https://api.light.xeos.me/api/account/eos/eoseoseoseos
    xeosJson: localStorage.getItem('xeosJson') ? JSON.parse(localStorage.getItem('xeosJson')) : {
      eos: 'https://api.light.xeos.me/api/account/eos/'
    },
    // 是否APP的webView打开 - android | ios
    isAppView: sessionStorage.getItem('isAppView') ? sessionStorage.getItem('isAppView') : '',
    contractAccount: localStorage.getItem('contractAccount') ? JSON.parse(localStorage.getItem('contractAccount')) : {},
    tipSwitch: localStorage.getItem('tipSwitch') ? JSON.parse(localStorage.getItem('tipSwitch')) : {}, // 账户相关提示开关
    otcToShowBar: true, // otc控制dapp的tabbar显示
    timestamp: Date.parse(new Date()), // 当前时间戳
    chargingStatus: {
      coinConvertStatus: 1, // 兑换交易服务器状态 0-维护 1-正常
      // withdrawStatus: 1, // 提币服务器状态 0-维护 1-正常
      // depositStatus: 1 // 充币服务器状态 0-维护 1-正常
    },
  },
  mutations: {
    // 委托账户
    SET_TOACCOUNTLIST: (state, toAccountList) => {
      state.toAccountList = toAccountList;
      localStorage.setItem('toAccountList', JSON.stringify(toAccountList));
    },
    // 节点选择
    SET_NODELIST: (state, nodeList) => {
      state.nodeList = nodeList;
      localStorage.setItem('nodeList', JSON.stringify(nodeList));
    },
    // 充提币服务状态
    SET_COINCONVERTSTATUS: (state, chargingStatus) => {
      state.chargingStatus = chargingStatus;
      localStorage.setItem('chargingStatus', JSON.stringify(chargingStatus));
    },
    // 配置当前开放的分区 - 基本不会动态更新
    SET_NEWAREA: (state, newArea) => {
      if (typeof newArea === 'string') {
        state.newArea = state[newArea];
        return;
      }
      localStorage.setItem('newArea', JSON.stringify(newArea))
      state.newArea = newArea;
    },
    // url参数传递的链 - 有值: 新版本 | 无值: 旧版本(需兼容)
    SET_URLCHAIN: (state, urlChain) => {
      state.urlChain = urlChain;
      sessionStorage.setItem('urlChain', urlChain);
    },
    // xeos查询余额接口地址 eg: https://api.light.xeos.me/api/account/eos/eoseoseoseos
    SET_XEOSJSON: (state, xeosJson) => {
      state.xeosJson = xeosJson;
      localStorage.setItem('xeosJson', JSON.stringify(xeosJson));
    },
    // 是否APP的webView打开 - android | ios
    SET_ISAPPVIEW: (state, isAppView) => {
      state.isAppView = isAppView;
      sessionStorage.setItem('isAppView', isAppView);
    },
    // 智能合约账户列表
    SET_CONTRACTACCOUNT: (state, contractAccount) => {
      state.contractAccount = contractAccount;
      localStorage.setItem('contractAccount', contractAccount);
    },
    // 冷钱包配置
    SET_COLDWALLET: (state, coldWallet) => {
      state.coldWallet = state[`${coldWallet}ColdWallet`]
    },
    // 账户相关提示开关
    SET_TIPSWITCH: (state, tipSwitch) => {
      state.tipSwitch = tipSwitch;
      localStorage.setItem('tipSwitch', JSON.stringify(tipSwitch));
    },
    // otc控制dapp的tabbar显示
    SET_OTCTOSHOWBAR: (state, otcToShowBar) => {
      state.otcToShowBar = otcToShowBar;
    },
    // 当前时间戳
    SET_TIMESTAMP: (state, timestamp) => {
      state.timestamp = timestamp;
    },
  },
  actions: {
    // 委托账户
    setToAccountList({ commit }, toAccountList) {
      commit('SET_TOACCOUNTLIST', toAccountList);
    },
    // 节点
    setNodeList({ commit }, nodeList) {
      commit('SET_NODELIST', nodeList);
    },
    // 充提币服务状态
    setCoinConvertStatus({ commit }, chargingStatus) {
      commit('SET_COINCONVERTSTATUS', chargingStatus);
    },
    // 配置当前开放的分区 - 基本不会动态更新
    setNewArea({ commit }, newArea) {
      commit('SET_NEWAREA', newArea);
    },
    // url参数传递的链 - 有值: 新版本 | 无值: 旧版本(需兼容)
    setUrlChain({ commit }, urlChain) {
      commit('SET_URLCHAIN', urlChain);
    },
    // xeos查询余额接口地址 eg: https://api.light.xeos.me/api/account/eos/eoseoseoseos
    setXeosJson({ commit }, xeosJson) {
      commit('SET_XEOSJSON', xeosJson);
    },
    // 是否APP的webView打开 - android | ios
    setIsAppView({ commit }, isAppView) {
      commit('SET_ISAPPVIEW', isAppView);
    },
    // 智能合约账户列表
    setContractAccount({ commit }, contractAccount) {
      commit('SET_CONTRACTACCOUNT', contractAccount);
    },
    // 冷钱包配置
    setColdWallet: ({ commit }, coldWallet) => {
      commit('SET_COLDWALLET', coldWallet);
    },
    // 账户相关提示开关
    setTipSwitch: ({ commit }, tipSwitch) => {
      commit('SET_TIPSWITCH', tipSwitch);
    },
    // otc控制dapp的tabbar显示
    setOtcToShowBar: ({ commit }, otcToShowBar) => {
      commit('SET_OTCTOSHOWBAR', otcToShowBar);
    },
    // 当前时间戳
    setTimestamp: ({ commit }, timestamp) => {
      commit('SET_TIMESTAMP', timestamp);
    }
  }
};

export default sys;
