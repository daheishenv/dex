import axios from 'axios';
import qs from 'qs'; // fromData 转 string
// import { Toast } from 'mint-ui';
import store from '@/store';
import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex

let ApiVersion = '/api'; // 默认请求地址
if (appName === 'tronNewdex') {
  ApiVersion = '/tronapi'; // 默认请求地址
}
const https = axios.create({
  baseURL: ApiVersion,
  timeout: 30000,
  auth: {
    // username: localStorage.getItem('token') || '',
  },
});

https.defaults.transformRequest = [(data, header) => { // 开始请求前期
  const headerThis = header;
  headerThis.project = 'newdex'; // 项目
  if (appName === 'tronNewdex') {
    headerThis.project = 'trondex'; // 项目
  }
  headerThis.account = ''; // 交易账户
  if (store.state.app.accountInfo && store.state.app.accountInfo.account) {
    headerThis.account = store.state.app.accountInfo.account;
  }
  headerThis.token = null; // 账户授权token - 用于撤单、收藏、关注币种
  if (localStorage.getItem('token')) {
    headerThis.token = localStorage.getItem('token');
  }
  headerThis.language = null; // 语言
  if (localStorage.getItem('language')) {
    headerThis.language = localStorage.getItem('language');
  }
  headerThis.channel = 'dapp'; // channel - 来源：dapp | web | ios | android
  headerThis.ref = null; // ref - 钱包名称
  if (localStorage.getItem('channel')) {
    const channel = localStorage.getItem('channel');
    headerThis.ref = encodeURI(channel);
  }
  headerThis.chain = ''; // chain - 链: eos | bos
  if (store.state.app.accountInfo && store.state.app.accountInfo.chain) {
    headerThis.chain = store.state.app.accountInfo.chain;
  }
  if (!header['Content-Type']) {
    return qs.stringify(data);
  }
  if (header['Content-Type'] === 'application/json') {
    return JSON.stringify(data);
  }
  return data;
}];

// 请求前
https.interceptors.request.use((config) => { // eslint-disable-line
  // Indicator.open();
  return config;
}, error => Promise.reject(error));

https.interceptors.response.use((response) => { // 请求后
  // Indicator.close();
  const res = response.data;
  if (res.code === 401 || res.code === 1002) {
    localStorage.removeItem('token');
    const vipData = { // 账户会员信息
      discountRate: null,
      level: 0,
      maxLevel: null,
      ndxStaked: null,
      totalSaveAmount: 0,
      vipImageUrl: null,
    };
    store.dispatch('setVipInfo', vipData);
  }
  return res; // eslint-disable-line
}, (error) => {
  console.log(error); // eslint-disable-line
  // Indicator.close();
  if (!error.response) {
    // Toast({
    //   message: 'Time Out',
    //   position: 'center',
    //   duration: 2000,
    // });
    return false;
  }
  switch (error.response.status) {
    case 504:
      // Toast({
      //   message: 'Network error',
      //   position: 'center',
      //   duration: 2000,
      // });
      break;
    default:
      // Toast({
      //   message: 'System error',
      //   position: 'center',
      //   duration: 2000,
      // });
      break;
  }
  return false;
});

export default https;
