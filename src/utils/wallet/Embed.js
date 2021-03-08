/* eslint-disable */
import { dealHost, handleParentUrlEmbed } from '@/utils/public';
import axios from 'axios';
// store
import store from '../../store';
import i18n from '@/utils/lang';
import RequestApi from '@/utils/requestApi';
// const envobj = {
//   area: "本地",
//   chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
//   host: "192.168.8.3",
//   httpEndpoint: "http://192.168.8.3:8888",
//   port: 8888,
//   protocol: "http",
// }

const scatterEmbed = {
  link: false, // 标志位 - 是否连接上
  bodyScrollHeight: 0,
  callbackDict: {},
  targetOrigin: '',
  env: dealHost(),
  init() {
    const parentUrl = handleParentUrlEmbed();
    this.targetOrigin = parentUrl;
    this.link = true;
    // 回调监听
    window.addEventListener('message', this.handleReceiveMessage, false);
    // 配置信息
    this.getConfig();
  },

  handleReceiveMessage(event) {
    const self = scatterEmbed;
    console.log('newdex -> back event');
    const origin = event.origin || event.originalEvent.origin;
    if (origin === window.location.origin) return;
    const message = JSON.parse(event.data);
    switch (message.action) {
      case 'getAccount': { // 获取账户信息
        const data = message.data;
        const newData = {
          account_name: data.account,
          encodeName: data.encodeName,
          address: data.publicKey,
          permissions: data.authority, // 权限
          chain: data.blockchain || 'eos',
        }
        self.callbackDict.getAccount(null, newData)
        break;
      }
      case 'getArbitrarySignature': {
        const data = message.data;
        self.callbackDict.getArbitrarySignature(null, data);
        break;
      }
      case 'transfer': {
        const data = message.data;
        self.callbackDict.transfer(data.err, data.res);
        break;
      }
      case 'getConfig': {
        i18n.locale = message.data.language;
        store.dispatch('setLanguage', message.data.language);
        // console.log(message.data)
        // 获取白名单配置
        RequestApi.getWhiteList(message.data.channel);
        break;
      }
      case 'generateUsn': {
        const data = message.data;
        self.callbackDict.generateUsn(data.err, data.res);
        break;
      }
      case 'manageStake': {
        const data = message.data;
        self.callbackDict.manageStake(data.err, data.res);
        break;
      }
      case 'revoke': {
        const data = message.data;
        self.callbackDict.revoke(data.err, data.res);
        break;
      }
    }
  },
  // 嵌入交易 body 高度实时获取
  handleGetBodyScrollHeight() {
    setTimeout(() => {
      const scrollHeight = window.document.getElementById('app').scrollHeight;
      if (this.bodyScrollHeight !== scrollHeight) {
        this.bodyScrollHeight = scrollHeight;
        const messageGetConfig = { action: 'setHeight', data: { height: scrollHeight } }
        window.parent.postMessage(JSON.stringify(messageGetConfig), this.targetOrigin);
      }
      this.handleGetBodyScrollHeight();
    }, 800);
  },
  // 获取内嵌配置 - 语言
  getConfig() {
    // 获取语言配置
    const messageGetConfig = { action: 'getConfig', data: null }
    window.parent.postMessage(JSON.stringify(messageGetConfig), this.targetOrigin);
    // this.handleGetBodyScrollHeight();
  },
  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    // console.log('newdex -> request getAccount');
    this.callbackDict.getAccount = callback;
    const messageGetAccount = { action: 'getAccount', data: null }
    window.parent.postMessage(JSON.stringify(messageGetAccount), this.targetOrigin);
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- -------- */
  checkAvailable(callback) {
    callback(null, true)
  },

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    try {
      const newParams = {
        code: params.code,
        symbol: params.coin,
        account: store.state.app.accountInfo.account
      }
      const envobj = store.state.sys.nodeList.eosNode;
      axios.post(`${envobj.httpEndpoint}/v1/chain/get_currency_balance`, JSON.stringify(newParams)).then((res) => {
        if (!res.data.length) {
          callback(null, `0.0000 ${params.coin}`);
          return;
        }
        const returnData = res.data[0];
        callback(null, returnData);
      }).catch((e) => {
        console.log(`e: ${e}`);
      })
      return;
    } catch (error) {
      console.log(error)
      setTimeout(() => {
        this.getCurrencyBalance(params, callback);
      }, 200);
    }
  },
  /* -------- 获取余额 end -------- */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    this.callbackDict.getArbitrarySignature = callback;
    const messageSignText = {
      action: 'getArbitrarySignature',
      data: {
        text,
      }
    }
    window.parent.postMessage(JSON.stringify(messageSignText), this.targetOrigin);
  },
  /* -------- 签名 end -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    this.callbackDict.transfer = callback;
    const messageTransaction = { action: 'transfer', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 转账 end -------- */
  /* 全变量 actions */
  async transactionApi(obj, callback) {
    this.callbackDict.transfer = callback;
    const messageTransaction = { action: 'transfer', data: obj.params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* 全变量 actions end */
  /* -------- 内嵌跳转trxID start -------- */
  toBrowser(url) {
    const msg = {
      action: 'locationHref',
      data: {
        url
      }
    }
    window.parent.postMessage(JSON.stringify(msg), this.targetOrigin);
  },
  /* -------- 内嵌跳转trxID end -------- */

  /* -------- 控制页面是否需要tabbar end -------- */
  setTabbar(type) {
    const msg = {
      action: 'setTabbar',
      data: {
        type,
      }
    }
    window.parent.postMessage(JSON.stringify(msg), this.targetOrigin);
  },
  /* -------- 控制页面是否需要tabbar end -------- */
  
  /* -------- 生成USN - 减少抵押比率生成USN start -------- */
  async generateUsn(obj, callback) {
    this.callbackDict.generateUsn = callback;
    const messageSignText = {
      action: 'generateUsn',
      data: obj
    }
    window.parent.postMessage(JSON.stringify(messageSignText), this.targetOrigin);
  },
  /* -------- 生成USN - 减少抵押比率生成USN end -------- */

  /* -------- 管理抵押量 - 减少抵押量 start -------- */
  async manageStake(obj, callback) {
    this.callbackDict.manageStake = callback;
    const messageSignText = {
      action: 'manageStake',
      data: obj
    }
    window.parent.postMessage(JSON.stringify(messageSignText), this.targetOrigin);
  },
  /* -------- 管理抵押量 - 减少抵押量 end -------- */

  routerTo(params) {
    const msg = {
      action: 'routerTo',
      data: params
    }
    window.parent.postMessage(JSON.stringify(msg), this.targetOrigin);
  },

  /* -------- 合约撤单 start -------- */
  revoke(obj, callback) {
    this.callbackDict.revoke = callback;
    const messageSignText = {
      action: 'revoke',
      data: obj
    }
    window.parent.postMessage(JSON.stringify(messageSignText), this.targetOrigin);
  },
  /* -------- 合约撤单 start -------- */
}

export default scatterEmbed;
