/* eslint-disable -- */
/**
 * 接口请求方法集合 - 整理接口请求，定义回调数据
 */
// 资源文件
// import moment from 'moment';
import axios from 'axios';
import qs from 'qs'; // axios 数据转换
// import { Decimal } from 'decimal.js'
// import { Toast } from 'mint-ui';
// import DApp from '@/utils/wallet';
// import i18n from '@/utils/lang';
import { dealHost, getReqUrl } from '@/utils/public';
import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
import http from '@/utils/axios';
// import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
// import { Toast } from 'mint-ui';
import store from '../store';

const RequestApi = {
  getUrl: () => { // 获取非EOS项目公用接口请求地址前缀 - 返回接口请求前缀
    let urlApi = location.origin; // 正式服务直接获取origin - 服务端NGX做转发了
    const type = dealHost();
    if (type === 'test') {
      urlApi = getReqUrl(); // 测试地址
    }
    return urlApi;
  },
  commonParam: (obj, cb) => { // 获取服务器配置参数
    // 判断参数 - cb不为function时，参数为一个
    let params = obj;
    let callback = cb;
    if (typeof cb !== 'function') {
      callback = params;
      params = {
        chain: 'eos',
      };
    }
    http.post('/common/getCommonParam', params).then((res) => {
      // 错误处理
      if (res.code !== 0) {
        return;
      }
      /* ---- 接口配置处理 start ---- */
      // 设置服务器状态
      if (Number(res.exchangeStatus) === 0) {
        sessionStorage.setItem('serverStatus', false); // 服务暂停
      } else {
        sessionStorage.setItem('serverStatus', true); // 服务正常
      }
      // 设置平台账户
      store.dispatch('setToAccount', res.exchangeEosAccount);
      // 设置账户xeos查询地址 - 废弃
      // const xeosUrl = {
      //   eos: res.xeosApiUrl,
      // };
      // this.$store.dispatch('setXeosJson', xeosUrl);
      /* ---- 接口配置处理 end ---- */

      // 接口数据整理 - 返回处理后的数据，确保调用该方法的数据字段保持一致
      // const resData = {
      //   code: 0, // 成功
      //   exchangeStatus: Number(res.exchangeStatus), // 服务器状态 - 转为数值型返回
      // }
      if (callback) {
        callback(res)
      }
    })
  },
  /* -------- 获取zendesk公告列表 start -------- */
  zendeskList(cb) { // 获取zendesk公告列表
    const params = {
      perPage: 6,
      project: 'newdex',
      chain: 'eos', // 默认eos
    }
    if (appName !== 'eosNewdex') {
      params.project = 'trondex';
      params.chain = 'tron';
    }
    this.zendeskListOtherProject(params, cb)
    // 废弃
    // if (appName !== 'eosNewdex') { // 非 EOS项目 - 查公用接口
    //   this.zendeskListOtherProject(params, cb)
    //   return;
    // }
    // // EOS项目
    // http.get('/zendesk/articleList', { params }).then((res) => {
    //   //  保存news列表
    //   if (res.code !== 0) {
    //     return;
    //   }
    //   store.dispatch('setNewsList', res.articles);
    //   if (cb) {
    //     cb(res); // 返回请求结果
    //   }
    // });
  },
  zendeskListOtherProject(obj, cb) { // 获取zendesk公告列表
    const language = store.state.app.language;
    const urlApi = this.getUrl();
    const params = obj;
    axios({
      method: 'post',
      url: `${urlApi}/api/commons/zendesk/articleList`,
      data: qs.stringify(params),
      headers: {
        channel: 'dapp',
        language,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((result) => {
      const res = result.data;
      if (res.code !== 0) {
        return;
      }
      store.dispatch('setNewsList', res.articles);
      if (cb) {
        cb(res); // 返回请求结果
      }
    })
  },
  /* -------- 获取zendesk公告列表 end -------- */

  /* -------- 获取账户未读消息总数 start -------- */
  getUnReadCount(cb) {
    const params = {
      accountNo: store.state.app.accountInfo.account,
    }
    http.post('/order/getUnReadCount', params).then((res) => {
      if (res.code !== 0) {
        return;
      }
      store.dispatch('setUnReadCount', res.unReadCount);
      if (cb) {
        cb(res)
      }
    });
  },
  /* -------- 获取账户未读消息总数 end -------- */
  // 获取账户信息
  accountInfo(obj, cb) {
    // 判断参数 - cb不为function时，参数为一个
    let params = obj;
    let callback = cb;
    if (typeof cb !== 'function') {
      callback = params;
      params = null;
    }
    http.post('/account/getAccountInfo', params).then((res) => {
      if (res.code === 1007) { // 账户在后台不存在 - 设置默认用户配置
        const newInfo = store.state.sys.initVipInfo;
        if (params) { // 带参数 - 其他账户 - 不保存
          newInfo.account = params.account;
        } else { // 不带参数 - 当前账户 - 保存
          newInfo.account = store.state.app.accountInfo.account;
          store.dispatch('setVipInfo', newInfo)
        }
        const back = {
          code: 0,
          accountInfo: newInfo,
        }
        callback(back)
        return;
      }
      if (res.code !== 0) {
        return;
      }
      callback(res)
    });
  },

  /* -------- 获取bannerList数据 start -------- */
  getCommonBannerList(obj, cb) {
    const params = obj;
    params.project = 'newdex';
    params.chain = 'eos';
    if (appName !== 'eosNewdex') {
      params.project = 'trondex';
      params.chain = 'tron';
    }
    const language = store.state.app.language;
    const urlApi = this.getUrl();
    axios({
      method: 'post',
      url: `${urlApi}/api/commons/banner/list`,
      data: qs.stringify(params),
      headers: {
        channel: 'dapp',
        language,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((result) => {
      const res = result.data;
      if (res.code !== 0) {
        return;
      }
      if (cb) {
        cb(res); // 返回请求结果
      }
    })
  },
  /* -------- 获取bannerList数据 end -------- */

  /* -------- 获取免CPU白名单 end -------- */
  getWhiteList(cnl, cb) { // 获取免CPU白名单
    const urlApi = this.getUrl();
    let channel = cnl;
    axios({
      method: 'post',
      url: `${urlApi}/api/commons/getFreeCpuWallet`,
      headers: {
        channel: 'dapp',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((result) => {
      const res = result.data;
      if (res.code !== 0) {
        return;
      }
      // 处理免CPU白名单
      let freeCpuWallet = res.freeCpuWallet;
      freeCpuWallet = `${freeCpuWallet},scatter`;
      const arr = freeCpuWallet.split(',');
      store.dispatch('setFreeCpuWhiteList', arr);
      if (!channel) {
        channel = localStorage.getItem('channel');
      }
      store.dispatch('setIsFreeCpuWhite', channel)
      if (cb) {
        cb(res); // 返回请求结果
      }
    })
  },
  /* -------- 获取免CPU白名单 end -------- */
}

export default RequestApi;
