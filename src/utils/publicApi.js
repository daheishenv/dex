/**
 * 项目接口类公用方法调用
 * vThis: 指向vue
 * eg：/account/verify
 */

// 资源文件
import Eos from 'eosjs-without-sort';
import moment from 'moment';
import axios from 'axios';
import { Decimal } from 'decimal.js'
import DApp from '@/utils/wallet';
import i18n from '@/utils/lang';
import https from '@/utils/axios';
import { GetUrlPara, toFixed, getReqUrl, dealHost } from '@/utils/public';
import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
import { Toast } from 'mint-ui';
import store from '../store';

// function gtag() {
//   // eslint-disable-next-line
//   dataLayer.push(arguments);
// }


/* -------- 站长统计 start -------- */
export function statistics() {
  // cnzz 站长统计
  let script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = 'https://s22.cnzz.com/z_stat.php?id=1274360520&web_id=1274360520&async=1';
  document.body.appendChild(script);

  // google 统计
  // window.dataLayer = window.dataLayer || [];
  // gtag('js', new Date());
  // gtag('config', 'UA-125180781-2');

  // script = document.createElement('script');
  // script.async = true;
  // script.type = 'text/javascript';
  // script.charset = 'utf-8';
  // script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-125180781-2';
  // document.body.appendChild(script);
}
/* -------- 站长统计 end -------- */


/* -------- 权限校验 start -------- */
// 权限获取校验
const handleAccountReg = (sign, time, vThis, cb) => {
  const channelRef = localStorage.getItem('channelRef')
  const params = {
    signature: sign, // 钱包签名
    account: store.state.app.accountInfo.account, // 账户名
    timestamp: time, // 时间戳
    type: channelRef || 'dapp', // channel
    // type: 4, // channel
  }
  vThis.$http.post('/account/verify', params).then((res) => {
    if (res.code !== 0) {
      Toast({
        message: res.msg,
        position: 'center',
        duration: 2000,
      });
      return;
    }
    localStorage.setItem('token', res.token); // 保存token
    // 回调处理
    cb();
  });
}
// wax 云钱包签名 - 特殊处理
const handleWax = (data, vThis, cb) => { // eslint-disable-line
  const params = data;
  vThis.$http.post('/account/verifySign', params).then((res) => {
    if (res.code !== 0) {
      Toast({
        message: res.msg,
        position: 'center',
        duration: 2000,
      });
      return;
    }
    localStorage.setItem('token', res.token); // 保存token
    // 回调处理
    cb();
  });
}
// tokenpocket sdk签名自带时间戳 - 特殊处理
// const handleTokenPocket = (data, time, vThis, cb) => { // eslint-disable-line
//   const channelRef = localStorage.getItem('channelRef')
//   const params = {
//     signature: data.signature, // 钱包签名
//     account: store.state.app.accountInfo.account, // 账户名
//     timestamp: time, // 服务器时间戳
//     mTimeStamp: data.timestamp, // tokenpocket返回的时间戳
//     type: channelRef, // channel
//   }
//   vThis.$http.post('/account/tokenPocketVerify', params).then((res) => {
//     if (res.code !== 0) {
//       Toast({
//         message: res.msg,
//         position: 'center',
//         duration: 2000,
//       });
//       return;
//     }
//     localStorage.setItem('token', res.token); // 保存token
//     // 回调处理
//     cb();
//   });
// }
// 波产签名请求
const handleSignTron = (sign, time, vThis, cb) => {
  const channelRef = localStorage.getItem('channelRef')
  const params = {
    signature: sign, // 钱包签名
    account: store.state.app.accountInfo.address, // 账户名
    timestamp: time, // 时间戳
    type: channelRef, // channel
  }
  vThis.$http.post('/account/verify', params).then((res) => {
    if (res.code !== 0) {
      Toast({
        message: res.msg,
        position: 'center',
        duration: 2000,
      });
      return;
    }
    localStorage.setItem('token', res.token); // 保存token
    // 回调处理
    cb();
  });
}
// 获取服务器时间戳
const handleGetTimestampJson = (vThis, cb) => {
  vThis.$http.get('/common/getUnixTimeJson').then( async (res) => {
    if (res.code !== 0) {
      Toast({
        message: res.msg,
        position: 'center',
        duration: 2000,
      });
      return;
    }
    const timestamp = res.timestamp;
    if (appName === 'tronNewdex') {
      DApp.signText(timestamp.toString(), (err, data) => {
        if (err) {
          Toast(vThis.$t('error.tokenError'));
          return;
        }
        // 针对波产签名进行处理
        if (appName === 'tronNewdex') {
          handleSignTron(data, timestamp, vThis, cb);
          return;
        }
        // 针对tp特殊处理对签名
        // if (store.state.app.channel === 'tokenpocket') {
        //   handleTokenPocket(data, timestamp, vThis, cb);
        //   return;
        // }
        if (store.state.app.channel === 'wax') {
          handleWax(data, vThis, cb);
          return;
        }
        const signature = data;
        handleAccountReg(signature, timestamp, vThis, cb);
      });
      return;
    }
    const accountInfo = store.state.app.accountInfo;
    let params = {
      publicKey: accountInfo.publicKey,
      data: timestamp.toString(), // scatter 只能12位字符串
      from: accountInfo.account, // tp
      address: accountInfo.address,
      signdata: `${accountInfo.account} ${timestamp}`, // tp
    }
    let result = await DApp.getArbitrarySignature(params);
    if (store.state.app.channel === 'wax') {
      params = {
        actions: [
          {
            account: 'newdexverify',
            name: 'verify',
            authorization: [{
              actor: accountInfo.account,
              permission: accountInfo.permissions,
            }],
            data: {
              data: timestamp.toString()
            }
          }
        ]
      }
      // 新版
      result = await DApp.getArbitrarySignature(params);
      handleWax(result, vThis, cb);
      return;
    }
    // if (store.state.app.channel === 'tokenpocket') {
    //   handleTokenPocket(result, timestamp, vThis, cb);
    //   return;
    // }
    // 旧版
    handleAccountReg(result, timestamp, vThis, cb);
  });
}
// 导出调用方法 - vThis: vue指向的this cb: 回调函数
export function accountToSign(vThis, cb) {
  handleGetTimestampJson(vThis, cb)
}
/* -------- 权限校验 end -------- */

/* -------- 账户会员信息 start ------- */
// 波产 和 eos 通用接口
export function getAccountVipInfo() {
  // 账户不存在 - 设置默认会员配置
  if (!store.state.app.accountInfo.account) {
    store.dispatch('setVipInfo', store.state.sys.initVipInfo);
  }
  // 账户存在 - 查询账户会员信息
  const params = {
    account: store.state.app.accountInfo.account
  }
  https.post('/account/getAccountInfo', params).then((res) => {
    if (res.code === 1007) {
      const initVipInfo = store.state.sys.initVipInfo;
      initVipInfo.account = store.state.app.accountInfo.account;
      initVipInfo.chain = store.state.app.accountInfo.chain;
      store.dispatch('setVipInfo', initVipInfo);
      return;
    }
    if (res.code !== 0) {
      return;
    }
    store.dispatch('setVipInfo', res.accountInfo);
  })
}
/* -------- 账户会员信息 end ------- */

/* -------- APP方法调用 start ------- */
// APP获取账户信息 - 返回打开端: android | ios | web(暂无)
export function AppInit(callback) {
  // 特殊处理 - app传递语言
  const urlParams = GetUrlPara();
  const source = urlParams.source;
  if (!store.state.sys.isAppView) { // 第一次打开页面时设置
    store.dispatch('setIsAppView', source || '');
  }
  if (urlParams.language) { // 配置语言
    i18n.locale = urlParams.language;
    store.dispatch('setLanguage', urlParams.language);
  }
  if (source && source !== 'web') {
    // 获取APP账户信息
    let isLoginApp = true; // 默认APP打开未登录
    const accountInfo = {
      account: '',
      encodeName: '',
      chain: 'eos', // 未登录默认EOS链
    }
    let data = null;
    if (source === 'ios') {
      data = JSON.parse(window.prompt('getAccountInfo', '')); // eslint-disable-line
    } else {
      data = JSON.parse(window.action.getAccountInfo());
    }
    if (!data.account) { // APP未登录
      localStorage.setItem('token', '');
      accountInfo.account = '';
      accountInfo.encodeName = '';
      accountInfo.chain = 'eos'; // 未登录默认EOS链
      isLoginApp = false;
      const initVipInfo = store.state.sys.initVipInfo;
      store.dispatch('setVipInfo', initVipInfo);
    } else { // APP已登陆
      localStorage.setItem('token', data.token || '');
      accountInfo.account = data.account;
      accountInfo.encodeName = Eos.modules.format.encodeName(data.account, false);
      accountInfo.chain = data.chain;
      isLoginApp = true;
    }
    store.dispatch('setAccountInfo', accountInfo);

    // 判断APP是否已登录 - 获取登录账户会员信息 - 未登录配置默认会员信息
    if (isLoginApp) {
      getAccountVipInfo()
    }
  }
  if (source && source === 'web') {
    if (urlParams.language) { // 配置语言
      i18n.locale = urlParams.language;
      store.dispatch('setLanguage', urlParams.language);
    }
  }
  // 判断是否有回掉 - 一些操作需要在初始化之后执行的事件
  if (callback) {
    callback();
  }
}
// 调用APP登录功能
export function AppToLogin() {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goToLogin', '') // eslint-disable-line
    return;
  }
  window.action.goToLogin()
}
// 调用APP去交易
export function AppToTrade(symbol) {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goToTrade', symbol) // eslint-disable-line
    return;
  }
  window.action.goToTrade(symbol);
}
// 调用APP去会员中心
export function AppToVipCenter() {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goToVipCenter', '') // eslint-disable-line
    return;
  }
  window.action.goToVipCenter()
}
// 调用APP抵押组件 - 1: 抵押 | 2: 赎回
export function AppToNdxDialog(type) {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('showNdxDialog', type) // eslint-disable-line
    return;
  }
  window.action.showNdxDialog(type);
}
// 调用APP去分享 type: 4 - 截图分享 | 3 - 分享图片
export function AppToShare(params) {
  // const params = { // 测试使用
  //   type: 3,
  //   content: 'http://ndt.340wan.com/upload/20190424/91c46b0745ec4db39873317feb8608f6.png'
  // }
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goToShare', JSON.stringify(params)) // eslint-disable-line
    return;
  }
  window.action.goToShare(JSON.stringify(params));
}
// 调用APP - pushAction操作执行消耗NDX成为会员
export function AppTransfer(obj) {
  // console.log(obj)
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('appTransfer', JSON.stringify(obj)) // eslint-disable-line
    return;
  }
  window.action.appTransfer(JSON.stringify(obj));
}
// 调用APP - pushAction操作执行消耗NDX成为会员
export function AppActions(obj) {
  // console.log(obj)
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('appActions', JSON.stringify(obj)) // eslint-disable-line
    return;
  }
  window.action.appActions(JSON.stringify(obj));
}
// 调用APP - 返回页面时调用
export function goBackToApp() {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goBackToApp', '') // eslint-disable-line
    return;
  }
  window.action.goBackToApp();
}
// 调用APP - 跳转外部链接
export function goNewWebView(obj) {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('goNewWebView', obj) // eslint-disable-line
    return;
  }
  window.action.goNewWebView(obj);
}
// 调用APP - 合约调用成功返回状态 3-等待中 0-成功 1-失败 2-用户取消
export function checkOperationStatus() {
  if (store.state.sys.isAppView === 'ios') {
    window.prompt('checkOperationStatus', '') // eslint-disable-line
    return;
  }
  window.action.checkOperationStatus();
}
/* -------- APP方法调用 end ------- */

/* -------- axios获取rex数据 start -------- */
export function getRexData(cb) {
  try {
    // const net = store.state.sys.nodeList.eosNode.httpEndpoint;
    const params = {
      code: 'eosio',
      json: true,
      scope: 'eosio',
      table: 'rexpool',
      // "table": "rammarket"
    }
    // axios.post(`http://192.168.8.3:8080/api/v1/chain/get_table_rows`, JSON.stringify(params)).then((result) => {
    https.post(`/v1/chain/get_table_rows`, params, {
      headers: {
        accept: 'application/json, text/plain, */*',
        "Content-Type": "application/json"
      }
    }).then((res) => {
      if (res && res.rows && res.rows.length) {
        // REX 价格 = total_lendable / total_rex
        const cbData = res.rows[0];
        const allEos = cbData.total_lendable.split(' ')[0];
        const allRex = cbData.total_rex.split(' ')[0];
        const price = Decimal.div(allEos, allRex).toString();
        cbData.priceCut = Number(price).toFixed(11); // 截取的13位的价格
        cbData.price = price; // 完整价格

        // 出租比例 = ((total_lent / total_lendable) * 100).toFixed(2) + '%';
        const totalLent = cbData.total_lent.split(' ')[0];
        const ratio = `${((totalLent / allEos) * 100).toFixed(2)}`;
        cbData.ratio = ratio;

        // 年化收益率apr 计算：
        const since = Date.now() - moment('2019-05-01 20:00:00').format('x');
        const n = ((allEos / allRex) - 0.0001) / 0.0001;
        const apr = parseFloat((n / since) * 365 * 24 * 3600 * 1000 * 100).toFixed(2);
        cbData.apr = apr;

        cbData.timer = Date.parse(new Date());
        // rent 计算(必须 -20000)
        // const totalRent = Decimal.sub(cbData.total_rent.split(' ')[0], 20000);
        const totalRent = cbData.total_rent.split(' ')[0];
        cbData.totalRent = toFixed(totalRent, 4);

        // 计算CPU租赁价格
        const count = Decimal.add(cbData.total_rent.split(' ')[0], 1);
        const rentPrice = Decimal.div(cbData.total_unlent.split(' ')[0], count);
        cbData.rentPrice = rentPrice.toString();
        cbData.rentPriceCut = toFixed(rentPrice, 4);

        const cbRes = {
          code: 0,
          data: cbData,
          msg: 'success'
        }
        cb(null, cbRes);
        return;
      }
      cb('no data', null);
    }).catch((error) => {
      cb(error, null)
    });
  } catch (error) {
    setTimeout(() => {
      getRexData(cb)
    }, 200);
  }
}
export function getAccountRexData(cb) {
  try {
    if (store.state.app.accountInfo.chain !== 'eos') {
      const cbRes = {
        code: 0,
        data: {
          abledTrade: '0.0000',
          freezeCount: '0.0000',
          matured_rex: 0,
          rex_balance: '0.0000 REX',
          rex_maturities: [],
          vote_stake: '0.0000 EOS'
        },
        msg: 'success'
      }
      cb(null, cbRes);
      return;
    }
    // const net = store.state.sys.nodeList[`${store.state.app.accountInfo.chain}Node`].httpEndpoint;
    const params = {
      code: 'eosio',
      json: true,
      scope: 'eosio',
      table: 'rexbal',
      limit: 1,
      lower_bound: store.state.app.accountInfo.encodeName,
      upper_bound: store.state.app.accountInfo.encodeName,
      table_key: ''
    }
    https.post(`/v1/chain/get_table_rows`, params, {
      headers: {
        accept: 'application/json, text/plain, */*',
        "Content-Type": "application/json"
      }
    }).then((res) => {
      if (res && res.rows && res.rows.length) {
        const cbData = res.rows[0];
        const balance = cbData.rex_balance.split(' ')[0];
        let abledTrade = balance;
        cbData.rex_maturities.forEach((v) => {
          const zone = moment().zone() / 60; // 时区
          const jsTime = moment(v.first).add(0 - zone, 'hours').format('YYYY/MM/DD HH:mm:ss'); // 解锁时间
          const jsBdTime = new Date(jsTime).getTime();
          const bdTime = new Date().getTime();
          const flg = bdTime - jsBdTime >= 0;
          if (!flg) {
            const num = Decimal.div(v.second || 0, 10000).toString();
            abledTrade = Decimal.sub(abledTrade, num).toString();
          }
        });
        cbData.abledTrade = toFixed(abledTrade, 4);
        cbData.freezeCount = Decimal.sub(balance, abledTrade).toString();
        const cbRes = {
          code: 0,
          data: cbData,
          msg: 'success'
        }
        cb(null, cbRes);
        return;
      }
      cb('no data', null);
    }).catch((error) => {
      cb(error, null)
    });
  } catch (error) {
    setTimeout(() => {
      getAccountRexData(cb)
    }, 200);
  }
}
/* -------- axios获取rex数据 end -------- */

/* -------- axios获取ram数据 start -------- */
export function getRamData(cb) {
  try {
    const net = store.state.sys.nodeList.eosNode.httpEndpoint;
    const params = {
      code: 'eosio',
      json: true,
      scope: 'eosio',
      table: 'rammarket',
    }
    axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((result) => {
      const res = result.data;
      // console.log(res, 'xgetRamData')
      if (res && res.rows && res.rows.length) {
        // Ram 价格 = total_lendable / total_rex
        const cbData = res.rows[0];
        const allEos = parseFloat(cbData.quote.balance, 0).toFixed(4)
        const allRam = (parseFloat(cbData.base.balance, 0) / 1024).toFixed(2)
        // // cbData.base.balance.split(' ')[0]报错split不存在
        // console.log(allEos, allRam, 'allRam')
        cbData.allEosChange = '0.0000'
        cbData.allRamChange = '0.00'
        const sessionEos = Number(sessionStorage.getItem('sessionEos'))
        const sessionRam = Number(sessionStorage.getItem('sessionRam'))
        if (sessionEos && Number(sessionEos) !== Number(allEos)) {
          cbData.allEosChange = (sessionEos - allEos).toFixed(2)
        }
        if (sessionRam && Number(sessionRam) !== Number(allRam)) {
          cbData.allRamChange = (sessionRam - allRam).toFixed(4)
        }
        cbData.allEos = allEos
        cbData.allRam = allRam
        sessionStorage.setItem('sessionEos', allEos);
        sessionStorage.setItem('sessionRam', allRam);
        const cbRes = {
          code: 0,
          data: cbData,
          msg: 'success'
        }
        cb(null, cbRes);
        return;
      }
      cb('no data', null);
    }).catch((error) => {
      cb(error, null)
    });
  } catch (error) {
    setTimeout(() => {
      getRexData(cb)
    }, 200);
  }
}
/* -------- axios获取ram数据 end -------- */

/* -------- 验证账户是否存在 ------- */
export function handleRegAccount(obj, cb) {
  try {
    const params = {
      account_name: obj.account,
    }
    const chainNode = obj.chian ? `${obj.chian}Node` : `${store.state.app.accountInfo.chain}Node`;
    axios.post(`${store.state.sys.nodeList[chainNode].httpEndpoint}/v1/chain/get_account`, JSON.stringify(params)).then((result) => {
      const res = result.data;
      if (res.account_name === obj.account) {
        cb(null);
        return;
      }
      cb('error');
    }).catch((error) => {
      cb(error);
    });
  } catch (error) {
    setTimeout(() => {
      handleRegAccount(obj, cb)
    }, 200);
  }
}

/* -------- 获取账户储备金余额 start -------- */
export function getAccountReservesData(cb) {
  try {
    const net = store.state.sys.nodeList[`${store.state.app.accountInfo.chain}Node`].httpEndpoint;
    const params = {
      code: 'eosio',
      json: true,
      scope: 'eosio',
      table: 'rexfund',
      limit: 1,
      lower_bound: store.state.app.accountInfo.encodeName,
      upper_bound: store.state.app.accountInfo.encodeName,
      table_key: ''
    }
    axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((result) => {
      const res = result.data;
      if (res && res.rows && res.rows.length) {
        const cbData = res.rows[0];
        const cbRes = {
          code: 0,
          data: cbData,
          msg: 'success'
        }
        cb(null, cbRes);
        return;
      }
      cb('no data', null);
    }).catch((error) => {
      cb(error, null)
    });
  } catch (error) {
    setTimeout(() => {
      getAccountReservesData(cb)
    }, 200);
  }
}
/* -------- 获取账户储备金余额 end -------- */

/* -------- 获取账户交换地址 start -------- */
export function getAccountExchangeAddress(callback) {
  const params = {
    code: 'bitpiecurrex',
    table: 'accounts',
    scope: store.state.app.accountInfo.encodeName,
    json: true,
  }
  const net = store.state.sys.nodeList.eosNode.httpEndpoint;
  axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
    callback(null, res)
  }).catch((err) => {
    callback(err, null)
  });
}
/* -------- 获取账户交换地址 end -------- */

/* -------- Tron 账户信息查询 start -------- */
export function getAccountInfoTron(callback) {
  const params = {
    address: store.state.app.accountInfo.address,
    // address: 'TMjKTVZGJw9zwTBfZ6dDuhQ3YxHfSpzJrU',
  }
  axios.get('https://apilist.tronscan.org/api/account', { params }).then((res) => {
    const data = res.data;
    // 全部余额
    const balance = data.trc20token_balances || [];
    // balance.push(...data.tokenBalances);
    // 全部冻结
    const energy = toFixed(data.accountResource.frozen_balance_for_energy.frozen_balance / (10 ** 6), 6);
    const net = toFixed(data.frozen.total / (10 ** 6), 6);
    const total = Decimal.add(Number(energy), Number(net)).toString();
    const frozen = {
      total,
      energy,
      net,
    }
    const accountTron = {
      balance,
      frozen,
    }
    store.dispatch('setAccountTron', accountTron)
    callback(null, data)
  }).catch((err) => {
    callback(err, null)
  })
}
// setTimeout(() => {
//   console.log(12345)
//   // getAccountInfoTron(() => {})
//   axios.get('/common/getUnixTimeJson').then((res) => {
//     console.log(res)
//   })
// }, 2000);
/* -------- Tron 账户信息查询 end -------- */
/* -------- exchange获取记录 start -------- */
export function getAccountExchangeData(type, cb) {
  try {
    // 充值 buyorders  btc-Ebtc
    // 提现 sellorders ，Ebtc=btc 提现完进入 soldorders ebtc-btc

    const params = {
      code: 'bitpiecurrex',
      scope: 'bitpiecurrex',
      table: type,
      key_type: 'i64',
      index_position: 2,
      lower_bound: store.state.app.accountInfo.encodeName,
      upper_bound: store.state.app.accountInfo.encodeName,
      // lower_bound: 'hulikangbazi',
      // upper_bound: 'hulikangbazi',
      json: true
    }
    const net = store.state.sys.nodeList.eosNode.httpEndpoint;
    axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((result) => {
    // axios.post('https://eos.newdex.one/v1/chain/get_table_rows', JSON.stringify(params)).then((result) => {
      const res = result.data;
      if (res && res.rows && res.rows.length) {
        const cbData = res.rows;
        // 返回成功数据
        const cbRes = {
          code: 0,
          data: cbData,
          msg: 'success'
        }
        cb(null, cbRes);
        return;
      }
      cb('no data', null);
    }).catch((error) => {
      cb(error, null)
    });
  } catch (error) {
    setTimeout(() => {
      getAccountReservesData(cb)
    }, 200);
  }
}

// 获取用户合约订单条数
export function getOrderNum(callback) {
  // 非EOS链 - 直接返回
  if (store.state.app.accountInfo.chain !== 'eos' || store.state.app.trad.onChain !== 1) {
    callback(true)
    return;
  }
  // EOS链的合约交易对
  const chain = store.state.app.accountInfo.chain;
  const params = {
    code: store.state.sys.toAccountList[`chain-${chain}`] || 'newdexpublic',
    scope: store.state.sys.toAccountList[`chain-${chain}`] || 'newdexpublic',
    table: 'account',
    lower_bound: store.state.app.accountInfo.encodeName,
    upper_bound: store.state.app.accountInfo.encodeName,
    json: true
  }
  const net = store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
  axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((result) => {
    if (result.status !== 200) {
      callback('err');
      return;
    }
    const res = result.data;
    if (res.rows.length) {
      const rows = res.rows[0];
      let maxNum = 200;
      if (rows.ext1 > maxNum) {
        maxNum = rows.ext1;
      }
      if (maxNum > rows.order) {
        const obj = {
          abled: true,
          maxNum,
        }
        callback(null, obj);
        return;
      }
      const obj = {
        abled: false,
        maxNum,
      }
      callback(null, obj);
      return
    }
    callback('err');
  })
}

/* -------- 获取账户抵押信息 start -------- */
export function getStakedInfo(obj, cb) {
  const params = {
    code: 'newdexstaked',
    table: 'stakes',
    scope: store.state.app.accountInfo.encodeName,
    lower_bound: store.state.app.accountInfo.chain,
    upper_bound: store.state.app.accountInfo.chain,
    json: true,
  }
  let callback = cb;
  if (typeof callback !== 'function') { // 判断没有参数
    callback = obj;
  } else { // 带参数
    params.scope = obj.account;
    params.lower_bound = obj.chain;
    params.upper_bound = obj.chain;
  }
  axios.post(`${store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
    if (res.data.rows.length !== 0) {
      const row = res.data.rows[0];
      const accountStakedAll = toFixed(Decimal.div(row.total_staked, 10000), 4); // 账户全部抵押
      const staked = toFixed(Decimal.div(row.self_staked, 10000), 4); // 已抵押数量 - 自己
      const stakedOther = toFixed(Decimal.div(row.staked_to_others, 10000), 4); // 已抵押数量 - 他人
      const selfStakedAll = toFixed(Decimal.add(staked, stakedOther), 4);
      const unstakeing = toFixed(Decimal.div(row.refunding, 10000), 4); // 赎回中
      const otherStaked = toFixed(Decimal.sub(accountStakedAll, staked), 4); // 他人替自己抵押数量
      const zone = moment().zone() / 60; // 计算时区
      const redeemTime = moment(res.data.rows[0].release_time).add(0 - zone, 'hours').format('YYYY/MM/DD HH:mm:ss'); // 赎回时间
      const resData = {
        accountStakedAll,
        selfStakedAll,
        staked,
        stakedOther,
        unstakeing,
        otherStaked,
        redeemTime,
      }
      callback(null, resData);
      return;
    }
    callback('err', null);
  });
}
/* -------- 获取账户抵押信息 end -------- */

// 调用免CPU挂单
export function handleUseFreeCpuPost(signedTx, callback) {
  let url = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT2}/cpu/pushTxWithoutCPU`;
  if (dealHost() !== 'test') {
    const host = location.origin;
    url = `${host}/cpu/pushTxWithoutCPU`;
  }
  axios.post(url, {
    signed: signedTx
  }, {
    headers: {
      accept: 'application/json, text/plain, */*',
    },
  }).then((res) => {
    // this.handleGetAccountInfo();
    if (res.data.code !== 200) {
      callback(res, null)
      return
    }
    callback(null, 'success');
  }).catch((error) => {
    console.log(error); // eslint-disable-line
  })
}
