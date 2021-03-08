<template>
  <div id="app" :class="{'embedApp': $embed}">
    <!-- 主内容 -->
    <div class="mainContent" id="mainContent"
      :class="{'noTabbar': !showTabbar,
      'trade': $route.name === 'trade',
      'noWebBg': $store.state.sys.isAppView !== 'web'}">
      <div class="nav"
        v-if="($route.name === 'linek' || $route.name === 'market')"
        v-show="channelRef === 'h5'">
        <head-nav />
      </div>
      <transition name="fade"
        mode="out-in"
        v-if="!$route.meta.keepAlive">
        <router-view :loadedPage="loadedPage"></router-view>
      </transition>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </div>

    <!-- tabbar -->
    <div class="tabDiv"
      v-show="showTabbar">
      <Tabbar />
    </div>

    <!-- 低版本提示 -->
    <mt-popup class="popup"
      v-model="versionTip"
      popup-transition="popup-fade">
      <div class="versionTip">
        <div class="title">{{ $t('public.tip') }}</div>
        <div class="content">{{ $t('index.versionUnavailableTip') }}</div>
        <div class="btnDiv">
          <button class="btn"
            @click="versionTip = false">{{ $t('public.sure') }}</button>
        </div>
      </div>
    </mt-popup>
    <div v-if="$appName === 'eosNewdex'">
      <div style="height:1.28rem;"
        v-if="$route.name === 'index' && !close && channelRef === 'h5'"></div>
      <DownApp v-if="$route.name === 'index' && !close && channelRef === 'h5'"
        @listenClose="close = true" />
    </div>

    <div class="waxPopup" v-if="loginWax">
      <div class="waxLoginTip">
        <div class="popupTip">{{ $t('public.tip') }}</div>
        <div class="popupContent">{{ $t('index.cloudWalletLogin') }}</div>
        <div class="popupBtn" @click="handleGetAccount">{{ $t('luckDraw.signIn') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Io from '@/utils/socket/index';
import DownApp from '@/components/DownApp';
import HeadNav from '@/components/HeadNav';
import Tabbar from '@/components/Tabbar';
import DApp from '@/utils/wallet';
import { GetUrlPara, iosInputBlurBug, dealSymbolSplit, setTabbar } from '@/utils/public';
import { AppInit, statistics } from '@/utils/publicApi';
import RequestApi from '@/utils/requestApi';
import { Popup } from 'mint-ui';
// import axios from 'axios'; // 处理波场公告
// import qs from 'qs'; // 处理波场公告

export default {
  name: 'App',
  computed: {
    showTabbar() {
      return !this.$route.meta.noTabbar && this.channelRef === 'dapp' && this.$store.state.sys.otcToShowBar && !this.$embed
    }
  },
  data() {
    return {
      language: null,
      get: false,
      versionTip: false,
      partition: [ // 分区
        'eos',
        'eusd',
        'bos',
        'meetone'
      ],
      chainList: { // key - 链名称 | value - chainId
        eos: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        bos: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86',
        meetone: 'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422',
        enu: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
        fibos: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
        telos: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        tron: '',
        wax: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        // lynx: 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573',
        proton: '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0'
      },
      allData: {},
      listenerId: null,
      legalTimer: null,
      close: false,
      channelRef: 'dapp',
      source: null,
      allResources: [],
      loginWax: false,
      loadedPage: false,
      areaObj: {}, // tab对象
    };
  },
  watch: {
    /* -------- 监听路由变化 - 是否展示tabbar start -------- */
    $route() {
      if (this.$embed) {
        const noTabbarNameList = ['trade']
        const name = this.$route.name;
        const index = noTabbarNameList.findIndex(item => item === name);
        const type = index !== -1;
        setTabbar(type)
      }
      // cnzz 站长统计
      window._czc = window._czc || []; // eslint-disable-line
      const location = window.location;
      const contentUrl = location.pathname + location.hash;
      const refererUrl = '/';
      window._czc.push(['_trackPageview', contentUrl, refererUrl]); // eslint-disable-line
      document.scrollingElement.scrollTop = 0; // 路由切换后，页面滚动到顶部
    },
    /* -------- 监听路由变化 - 是否展示tabbar end -------- */

    /* -------- 监听dapp账户变化 - 重置所有链接 start -------- */
    '$store.state.app.accountInfo': function listen() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.account) { // 本地有账户 && 账号存在
        const params = {
          account: this.$store.state.app.accountInfo.account,
          chain: this.$store.state.app.accountInfo.chain
        }
        // Io.accountOut(params); // 退出账号
        Io.accountBind(params); // 绑定账号
        this.handleGetAccountInfo(); // 获取账户会员信息
        // this.handleGetAccountAgree(); // 获取用户是否同意使用协议
        this.handleNotReadCount(); // 获取未读条数
        this.handleOrderUpdata(); // 监听账户订单状态 - 重新获取未读条数
        Io.addListenerRefresh(); // 监听服务器推送点强制刷新
      }
    },
    /* -------- 监听dapp账户变化 - 重置所有链接 end -------- */

    /* -------- 监听语言变化 - 重新获取对应zendesk公告列表 start -------- */
    '$store.state.app.language': function listen(val) {
      this.handleGetZendeskNote(); // 请求zendesk链接
      this.handleGetStableCoin(); // 法币估值
      zE('webWidget', 'setLocale', this.handleLangFormatZendex(val)); // eslint-disable-line
    },
    /* -------- 监听语言变化 - 重新获取对应zendesk公告列表 end -------- */
  },
  created() {
    this.handleWsListen(); // ws 交易对
    this.handleGetCommonParam(); // 查询服务器状态 - 0：暂停 | 1：正常
    this.handleGetStableCoin(); // 获取稳定币列表
    this.handleGetZendeskNote(); // 公告
    if (this.$appName === 'eosNewdex') {
      this.handleNavMenuList(); // 获取行情列表导航栏
    }
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
    if (this.$appName === 'tronNewdex') {
      this.$store.dispatch('setNewArea', this.$appName); // tron分区设置
      this.$store.dispatch('setColdWallet', this.$appName); // 冷钱包设置
    }
    const language = this.$store.state.app.language;
    if (!language) { // 判断本地是否存在语言 - 新用户第一次使用
      this.handleGetPhoneLanguage(); // 获取手机本身语言设置为展示语言
    }
    /* -------- 处理页面展示区域高度问题 start -------- */
    // 观察下是否可以删除这部分代码
    window.onload = (() => {
      this.$nextTick(() => {
        /* -------- 处理页面展示区域高度问题 end -------- */
        if (this.$appName === 'eosNewdex') {
          // 获取白名单配置
          RequestApi.getWhiteList();
        }
        iosInputBlurBug(); // 处理 ios 输入框失去焦点下半部分白屏问题
        AppInit(); // 特殊处理 - APP初始化 - 设置语言和保存当前是哪端打开
        statistics(); // cnzz 站长统计
        setTimeout(() => {
          this.handleAppendScript();
        }, 10000);
        this.loadedPage = true;
      })
    })
  },
  components: { // 引入模版
    Tabbar,
    HeadNav,
    DownApp,
    mtPopup: Popup
  },
  methods: {
    handleAppendScript() {
      let ele = document.createElement("script");
      ele.src = 'https://static.zdassets.com/ekr/snippet.js?key=25fd290a-1620-4083-a8dc-a6d8a2bdff71';
      ele.async = true;
      ele.id = 'ze-snippet';
      document.body.appendChild(ele)
      ele.onload = (() => {
        const language = this.$store.state.app.language;
        // document.getElementById('mainContent').style.minHeight = `${hrt}px`;
        zE('webWidget', 'helpCenter:setSuggestions', { search: 'Newdex' }); // eslint-disable-line
        zE('webWidget', 'setLocale', this.handleLangFormatZendex(language)); // eslint-disable-line
      });
    },
    handleLangFormatZendex(lan) {
      const lans = {
        en: 'en-US',
        ko: 'ko',
        'zh-CN': 'zh-cn',
        'zh-TW': 'zh-tw'
      }
      return lans[lan];
    },
    // zendesk 获取公告
    handleGetZendeskNote() {
      RequestApi.zendeskList();
    },
    // 获取行情列表导航栏
    handleNavMenuList() {
      this.$http.post('/symbol/getSymbolGroup').then((res) => {
        if (res.code !== 0) {
          this.$message.error(res.msg);
          return;
        }
        const symbolGroup = res.symbolGroup;
        let newArea = {
          self: {
            SELF: {
              index: 0,
              tabName: 'SELF',
              chainCode: '',
            }
          },
          EosMain: {},
          EosSide: {},
        };
        newArea = JSON.stringify(newArea);
        newArea = JSON.parse(newArea);
        symbolGroup.forEach((v) => {
          if (v.list) {
            v.list.forEach((item, index) => {
              if (v.chainType === 1) {
                newArea['EosMain'][item.label.toUpperCase()] = {
                  index,
                  active: item.area.split('-')[1],
                  area: item.area,
                  tabName: item.label.toUpperCase(),
                  chainCode: item.label.toUpperCase(),
                }
                if (v.list.length === index + 1) {
                  newArea['EosMain']['resources'] = {
                    index: index + 1,
                    tabName: 'resources',
                    chainCode: 'resources',
                    area: '1-0'
                  }
                }
              }
              if (v.chainType === 2) {
                newArea['EosSide'][item.label.toUpperCase()] = {
                  index,
                  area: item.area,
                  tabName: item.label.toUpperCase(),
                  chainCode: item.label.toUpperCase(),
                }
              }
            })
          }
        });
        this.$store.dispatch('setNewArea', newArea);
      });
    },
    // 获取稳定币列表
    handleGetStableCoin() {
      if (this.$appName === 'tronNewdex') {
        this.handleDealStableCoin([]);
        return;
      }
      this.$http.get('/common/getStableCoinList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.handleGetStableToCNY(res.stableCoinCodeList)
        this.handleDealStableCoin(res.stableCoinCodeList);
      })
    },
    // 处理计价币
    handleDealStableCoin() {
      // 处理所有分区
      const arr = [];
      let obj = this.$store.state.sys.newArea;
      const t = Object.keys(obj);
      t.forEach((key) => {
        if (key === 'self') {
          return;
        }
        const subObj = Object.keys(obj[key])
        subObj.forEach((item) => {
          if (item === 'CUSD' || item === 'resources' || item === 'DEFI') {
            return
          }
          const params = obj[key][item].chainCode.toLowerCase();
          arr.push(params)
        });
      });
      this.partition = arr;
      // 获取所有计价币估值
      this.handleGetLegalPrice();
    },
    // 获取稳定币 对 人民币估值（对美元估值固定为1）
    handleGetStableToCNY(list) {
      // 非简体情况下 - 稳定币对美元估值固定为1
      if (this.$store.state.app.language !== 'zh-CN') {
        const oldRate = this.$store.state.app.exchangeRate;
        list.forEach((item) => {
          const v = item.toLowerCase();
          oldRate[v] = 1
        })
        this.$store.dispatch('setExchangeRate', oldRate)
        return;
      }
      // 简体情况下 - 获取稳定币对人名币估值
      this.$http.get('/common/getUsdCnyPrice').then((res) => {
        if (res.code !== 0) {
          return;
        }
        const oldRate = this.$store.state.app.exchangeRate;
        list.forEach((item) => {
          const v = item.toLowerCase();
          oldRate[v] = res.usdCnyPrice;
        })
        this.$store.dispatch('setExchangeRate', oldRate)
      })
    },
    // 获取法币估值
    handleGetLegalPrice() {
      window.clearTimeout(this.legalTimer); // 清除旧的定时器
      // 配置计价币种名称
      let coinArr = this.partition.join(',').toUpperCase();
      coinArr = coinArr.split(',');
      coinArr.forEach((item, index) => {
        if (item === 'FIBOS') {
          coinArr[index] = 'FO';
        }
        if (item.toLowerCase() === 'proton') {
          coinArr[index] = 'XUSDT';
        }
        if (item.toLowerCase() === 'resources') {
          coinArr.splice(index, 1)
        }
      })

      const coins = coinArr.join(',').toUpperCase(); // 币种的汇率
      let type = 'USD'; // 法币估值默认取美元估值
      if (this.$store.state.app.language === 'zh-CN') { // 中文简体下 - 法币估值取人民币估值
        type = 'CNY';
      }
      const params = { // 接口参数
        valuationCoins: coins, // 法币估值币种字符串 - 'EOS,EUSD'
        legalCurrency: type, // 人民币 | 美元
      }
      this.$http.get('/common/getLegalCurrencyPrices', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        const exchangeRate = this.$store.state.app.exchangeRate;
        coinArr.forEach((item, index) => {
          exchangeRate[item.toLowerCase()] = res.prices[index] || 0.5;
        });
        exchangeRate.test = Math.random();
        this.$store.dispatch('setExchangeRate', exchangeRate);
      });
    },
    // 获取dapp名称
    handleGetChannel() {
      const localChannel = localStorage.getItem('channel') || '';
      let channel = GetUrlPara().channel || localChannel;
      localStorage.setItem('channel', channel);
      if (this.$appName === 'tronNewdex') {
        channel = 'scatter'
      }
      this.$store.dispatch('setChannel', channel);
      this.$store.dispatch('setIsFreeCpuWhite', channel);
      let newChain = GetUrlPara().chain || this.$store.state.sys.urlChain || 'eos';
      newChain = newChain.toLowerCase();
      this.$store.dispatch('setUrlChain', newChain).then(() => {
        const nodeList = this.$store.state.sys.nodeList;
        if (this.$appName === 'tronNewdex') {
          DApp.setChannel(channel, newChain);
          this.handleGetAccount();
          return;
        }
        if (channel === 'tokenpocket') {
          channel = 'scatter'
        }
        DApp.init({
          embed: this.$embed,
          chain: newChain,
          channel,
          // needScatterInit: true,
          node: nodeList[`${newChain}Node`]
        }, () => {
          this.handleGetAccount();
        });
      });
    },
    // 获取用户信息
    async handleGetAccount() {
      if (this.channelRef === 'h5') return;
      const account = await DApp.getAccount();
      if (account) {
        const accountInfo = this.$store.state.app.accountInfo;
        // 判断是否切换账号
        if (accountInfo && account.account !== accountInfo.account) {
          localStorage.removeItem('token');
          const vipData = { // 账户会员信息
            discountRate: null,
            level: 0,
            maxLevel: null,
            ndxStaked: null,
            totalSaveAmount: 0,
            vipImageUrl: null,
          };
          this.$store.dispatch('setVipInfo', vipData);
        }
        this.$store.dispatch('setAccountInfo', account || {});
      }
      this.loginWax = false;
    },
    // 第一次使用dapp时，获取手机语言
    handleGetPhoneLanguage() {
      if (localStorage.getItem('language')) return;
      let lang = 'en';
      if (navigator.language) {
        lang = navigator.language;
      } else {
        lang = navigator.browserLanguage;
      }
      if (lang.indexOf('-') !== -1) {
        this.language = `${lang.split('-')[0]}-${lang.split('-')[1].toUpperCase()}`;
      }
      if (this.language !== 'zh-CN' && this.language !== 'zh-TW' && this.language !== 'ko') {
        this.language = 'en';
      }
      this.$i18n.locale = this.language;
      this.$store.dispatch('setLanguage', this.language);
    },
    // 判断版本是否支持
    // handleCheckAvailable() {
    //   DApp.checkAvailable((e, available) => {
    //     if (e == null && !available) {
    //       if (this.channelRef === 'h5') {
    //         this.versionTip = false;
    //         return;
    //       }
    //       this.versionTip = true;
    //     }
    //   });
    // },
    // 获取公共信息
    handleGetCommonParam() {
      const localNode = JSON.parse(localStorage.getItem('nodeChecked') || '{}');
      const nodeJson = {
        eosNode: localNode.eosNode ? localNode.eosNode.url : null,
        bosNode: localNode.bosNode ? localNode.bosNode.url : null,
        meetoneNode: localNode.meetoneNode ? localNode.meetoneNode.url : null,
        enuNode: localNode.enuNode ? localNode.enuNode.url : null,
        fibosNode: localNode.fibosNode ? localNode.fibosNode.url : null,
        telosNode: localNode.telosNode ? localNode.telosNode.url : null,
        waxNode: localNode.waxNode ? localNode.waxNode.url : null,
        lynxNode: localNode.lynxNode ? localNode.lynxNode.url : null,
        protonNode: localNode.protonNode ? localNode.protonNode.url : null
      };
      RequestApi.commonParam({ params: JSON.stringify(nodeJson), chain: 'eos' }, (res) => {
        const chainListKeys = Object.keys(this.chainList); // 获取 chainLis key值列表
        const toAccountList = {}
        const NodeObj = {};
        chainListKeys.forEach((key) => {
          if (this.$appName === 'eosNewdex') {
            // chain接收账户处理
            const keyToUpper = key[0].toUpperCase() + key.substring(1, key.length);
            const accountItem = res[`exchange${keyToUpper}Account`];
            toAccountList[key] = accountItem;
            if (res[`chain${keyToUpper}Account`]) {
              toAccountList[`chain-${key}`] = res[`chain${keyToUpper}Account`]; // 智能合约账户
            }
          } else if (this.$appName === 'tronNewdex') {
            const accountItem = res.tronContract;
            toAccountList[key] = accountItem;
          }
          // chain地址处理
          const item = res[`${key}Node`];
          if (item) {
            NodeObj[`${key}Node`] = {
              httpEndpoint: item.url,
              protocol: item.protocol,
              host: item.host,
              port: Number(item.port),
              chainId: item.chainId, // BOS主网
              area: item.area,
              url: item.url
            }
          }
        });
        this.$store.dispatch('setToAccountList', toAccountList);
        const chargingStatus = {
          coinConvertStatus: res.coinConvertStatus,
          // withdrawStatus: res.withdrawStatus,
          // depositStatus: res.depositStatus
        }
        this.$store.dispatch('setCoinConvertStatus', chargingStatus);
        this.$store.dispatch('setNodeList', NodeObj).then(() => {
          this.handleGetChannel(); // 获取dapp用户来源
        });
      });
    },
    // 获取用户是否同意使用协议
    handleGetAccountAgree() {
      const params = {
        account: this.$store.state.app.accountInfo.account,
        type: 1, // 1 - eos | 2 - 其他
      }
      this.$http.post('/account/getAccountAgreement', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        if (res.status === 1) {
          sessionStorage.setItem('accountAgree', true);
          return;
        }
        sessionStorage.setItem('accountAgree', false);
      });
    },
    // 获取账户未读消息总数
    handleNotReadCount() {
      RequestApi.getUnReadCount();
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        }
        this.$http.post('/account/getAccountInfo', params).then((res) => {
          if (res.code === 1007) {
            const initVipInfo = this.$store.state.sys.initVipInfo;
            initVipInfo.account = this.$store.state.app.accountInfo.account;
            initVipInfo.chain = this.$store.state.app.accountInfo.chain;
            this.$store.dispatch('setVipInfo', initVipInfo);
            return;
          }
          if (res.code !== 0) {
            return;
          }
          this.$store.dispatch('setVipInfo', res.accountInfo);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 监听账户订单状态
    handleOrderUpdata() {
      Io.addListenerOrder('start', (res) => {
        this.listenerId = res.listenerId;
        // vuex保存订单更新状态 - 用于请求接口订单数据
        const times = `${Date.parse(new Date())}${Math.random()}`
        const params = {
          times,
          type: res.type
        }
        this.$store.dispatch('setAccountMsg', params);
        if (res.type === 'orderupdate') { // 订单更新 - 查询未读订单条数
          this.handleNotReadCount();
        }
        if (res.type === 'stakedsuccess') {
          this.handleGetAccountInfo();
        }
      });
    },
    /* -------- ws监听symbol列表处理操作 start -------- */
    // ws监听 - 目前ws推送所有分区，本地进行筛选 - 之后ws可能改版为分交易区 & 分页
    handleWsListen() {
      // eos项目获取资源
      if (this.$appName === 'eosNewdex') {
        this.handleWsResource(); // 获取资源列表
      }
      const params = {
        symbol: '*',
        offset: 0,
        count: 1000
      }
      Io.cfwsPricesSymbol(params, (res) => {
        const rows = Array.isArray(res) ? res : [res];

        // 分区处理
        let arr = [];
        let obj = this.$store.state.sys.newArea;
        if (this.$appName === 'eosNewdex') {
          obj = JSON.stringify(obj);
          obj = JSON.parse(obj);
          const eosMainObj = obj['EosMain'];
          const eosSideObj = obj['EosSide'];
          this.areaObj = Object.assign(eosMainObj, eosSideObj);
          // console.log('this.areaObj', this.areaObj)// eslint-disable-line
        }
        const t = Object.keys(obj);
        // console.log('t', t)// eslint-disable-line
        t.forEach((key) => {
          if (key === 'self') {
            return;
          }
          const subObj = Object.keys(obj[key])
          subObj.forEach((item) => {
            arr.push(item.toLowerCase());
          });
        });
        // console.log('arr', arr)// eslint-disable-line
        let areaData = {};
        arr.forEach((item) => {
          areaData[item] = [];
        });
        // let area = [];
        // obj.map((item) => {
        //   area[item] = [];
        // });
        // console.log('areaData', areaData)// eslint-disable-line
        rows.forEach((subItem) => {
          const chainArr = subItem.chain.split('-');
          this.$set(subItem, 'sameChain', chainArr[0] === chainArr[1]); // 同链交易对
          this.$set(subItem, 'showChainTip', false); // 显示跨链
          const symbolData = dealSymbolSplit(subItem.symbol, chainArr[0], subItem.valuationCoinContract, subItem.contract, this.$embed)
          this.$set(subItem, 'contract', symbolData.contract || subItem.contract); // 合约号
          this.$set(subItem, 'symbol1', symbolData.symbol1);
          this.$set(subItem, 'symbol2', symbolData.symbol2);
          this.$set(subItem, 'coinImgUrl', symbolData.coinUrl); // 图片地址拼接规则

          if (this.$appName === 'tronNewdex') {
            areaData = this.handleDealWsDataTron(areaData, subItem, chainArr, symbolData)
          } else {
            areaData = this.handleDealWsDataEos(areaData, subItem, chainArr, symbolData)
          }
        });

        // 返回列表 - 多条数据
        if (rows.length > 1) {
          for (const key in areaData) { // eslint-disable-line
            this.allData[key] = areaData[key];
          }
          let change = this.$store.state.app.allSymbolDataChange || 0;
          if (change >= 10) {
            change = 0;
          }
          this.allData.resources = this.allResources;
          this.allData.change = change + 1;
          // console.log("this.allData", this.allData)
          this.$store.dispatch('setAllSymbolData', this.allData);
          return;
        }

        // 单条数据更新
        for (const key in areaData) { // eslint-disable-line
          if (areaData[key].length > 0) {
            this.handleThisDataUpdata(areaData[key][0], key);
          }
        }
      });
    },
    // 单条数据更新
    handleThisDataUpdata(res, key) {
      if (!this.allData[key]) {
        return;
      }
      const index = this.allData[key].findIndex(item => item.symbol.toLowerCase() === res.symbol);
      // 有该条记录 - updata
      if (index !== -1) {
        this.allData[key][index] = res;
      } else {
        // 无该条记录 - add
        this.allData[key].push(res);
      }
      let change = this.$store.state.app.allSymbolDataChange || 0;
      if (change >= 10) {
        change = 0;
      }
      this.allData.change = change + 1;
      this.$store.dispatch('setAllSymbolData', this.allData);
    },
    // Eos项目Ws数据分配
    handleDealWsDataEos(data, subItem, chainArr) {
      // console.log("handleDealWsDataEos", symbolData)
      // console.log("handleDealWsDataEos-chainArr", chainArr)
      // console.log('subItem', subItem)// eslint-disable-line
      const areaData = data;
      const areaDataKeys = Object.keys(areaData)
      areaDataKeys.forEach((key) => {
        if (!areaData[key]) { // 判断对象是否存在 - 不存在，执行下一条
          return;
        }
        if (chainArr[0] !== chainArr[1] && chainArr[0] === key) { // 所属链不同 - 属于跨链交易，放入chainArr[0]对应跨链分区
          areaData[key].unshift(subItem); // 跨链交易对放在跨链分区第一个
          return;
        }
        if (this.$appName === 'eosNewdex' && this.areaObj[key.toUpperCase()]
          && (this.areaObj[key.toUpperCase()].area === subItem.area
          || (this.areaObj[key.toUpperCase()].area === '1-1' && subItem.area === '1-2' && subItem.symbol2 !== 'usdt')
          || (this.areaObj[key.toUpperCase()].area === '1-3' && subItem.area === '1-2' && subItem.symbol2 === 'usdt'))
        ) {
          areaData[key].push(subItem);
        }
        // if (this.$appName === 'eosNewdex' && this.areaObj[key.toLowerCase()]['area'] === subItem.area) {
        //   areaData[key].push(subItem);
        // }
        // console.log(data, subItem, chainArr, symbolData)
        // 根据chain进行分区过滤
        // if (chainArr[0] === chainArr[1] && chainArr[1] === key) { // 所属链相同 - dealSymbolArr[2]对应的分区
        //   if (key !== 'eos') {
        //     areaData[key].push(subItem);
        //     return
        //   }
        //   if (!areaData.cusd) {
        //     areaData.cusd = [];
        //   }
        //   if (symbolData.symbol2.toLowerCase() === 'usn') { // usn分区处理
        //     areaData.usn.push(subItem);
        //     return;
        //   }
        //   if (symbolData.symbol2.toLowerCase() === 'usdt') { // usdt分区处理
        //     // if (subItem.symbol.indexOf('_') >= 0) { // 对跨链ClossLink 的处理
        //     //   areaData.crosslink.push(subItem);
        //     // } else {
        //     areaData.usdt.push(subItem);
        //     // }
        //     return;
        //   }
        //   if (symbolData.symbol2.toLowerCase() !== 'eos') {
        //     areaData.cusd.push(subItem); // cusd & eusd 分区合并
        //     return;
        //   }
        //   // eusd cusd eosdt 分区数据合并处理
        // }
      });
      return areaData;
    },
    // Tron项目Ws数据分配
    handleDealWsDataTron(data, subItem, chainArr, symbolData) {
      const areaData = data;
      const areaDataKeys = Object.keys(areaData)
      // 进行分区处理 - 循环判断是某一个分区数据
      areaDataKeys.forEach((key) => {
        if (!areaData[key]) { // 判断对象是否存在 - 不存在，执行下一条
          return;
        }
        // 对 (基础币种和计价币种同链 & 计价币种为当前key) 取否
        if (!(chainArr[0] === chainArr[1] && chainArr[1] === key)) {
          return;
        }
        // 根据chain进行分区过滤
        if (symbolData.symbol2.toLowerCase() === 'trx') {
          areaData[key].push(subItem);
          return
        }
        areaData.usdt.push(subItem);
      })
      return areaData;
    },
    /* -------- ws监听symbol列表处理操作 end -------- */

    /* -------- ws监听资源列表处理操作 start -------- */
    handleWsResource() {
      const params = {
        resource: '*',
      }
      Io.cfwsResource(params, (res) => {
        const lists = res;
        lists.forEach((item) => {
          if (item.name === 'ram') {
            this.$set(item, 'sameChain', true); // 同链交易对
            this.$set(item, 'showChainTip', false); // 显示跨链
            this.$set(item, 'id', 'ram');
            this.$set(item, 'chain', 'eos-eos');
            this.$set(item, 'symbol', 'ram-eos');
            this.$set(item, 'symbol1', 'ram');
            this.$set(item, 'symbol2', 'eos');
            this.$set(item, 'coinImgUrl', 'https://nds.340wan.com/static/img/coin/EOS.png');
            this.$set(item, 'status', 0);
            this.$set(item, 'resources', 'resources');
            return;
          }
          if (item.name === 'rex') {
            this.$set(item, 'sameChain', true); // 同链交易对
            this.$set(item, 'showChainTip', false); // 显示跨链
            this.$set(item, 'id', 'rex');
            this.$set(item, 'chain', 'eos-eos');
            this.$set(item, 'symbol', 'rex-eos');
            this.$set(item, 'symbol1', 'rex');
            this.$set(item, 'symbol2', 'eos');
            this.$set(item, 'coinImgUrl', 'https://nds.340wan.com/static/img/coin/EOS.png');
            this.$set(item, 'status', 0);
            this.$set(item, 'resources', 'resources');
            this.$set(item, 'precision', {
              coin: 4,
              price: 11
            });
            return;
          }
          if (item.name === 'cpu') {
            this.$set(item, 'sameChain', true); // 同链交易对
            this.$set(item, 'showChainTip', false); // 显示跨链
            this.$set(item, 'id', 'cpu');
            this.$set(item, 'chain', 'eos-eos');
            this.$set(item, 'symbol', 'cpu-net');
            this.$set(item, 'symbol1', 'cpu');
            this.$set(item, 'symbol2', 'net');
            this.$set(item, 'coinImgUrl', 'https://nds.340wan.com/static/img/coin/EOS.png');
            this.$set(item, 'status', 0);
            this.$set(item, 'resources', 'resources');
          }
        });
        // 返回0条
        if (!lists.length) {
          return;
        }
        // 返回列表 - 多条数据
        if (lists.length > 1) {
          this.allResources = lists;
          this.allData.resources = lists;
          let change = this.$store.state.app.allSymbolDataChange || 0;
          if (change >= 10) {
            change = 0;
          }
          this.allData.change = change + 1;
          this.$store.dispatch('setAllSymbolData', this.allData);
          return;
        }
        // 返回一条
        this.handleThisDataUpdata(lists[0], 'resources');
      });
    },
    /* -------- ws监听资源列表处理操作 end -------- */
  },
  beforeDestroy() {
    Io.accountOut(this.$store.state.app.accountInfo.account); // 退出账号
    Io.cfwsUnsubscribe('markets.*');
    Io.cfwsUnsubscribe('resource.*');
    Io.addListenerOrder({ // 停止监听订单信息
      way: 'stop',
      listenerId: this.listenerId
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .mainContent {
    padding-bottom: 1.5rem !important;
    &.noTabbar {
      height: 100%;
      padding-bottom: 0rem !important;
    }
  }
  .tabDiv {
    padding-bottom: 0.5rem !important;
  }
}

@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio:2) {
  .mainContent {
    padding-bottom: 1.3rem !important;
    &.noTabbar {
      height: 100%;
      padding-bottom: 0rem !important;
    }
  }
  .tabDiv {
    padding-bottom: 0.3rem !important;
  }
}

#app {
  width: 100%;
  // background: #FFF;
}

.embedApp{
  height: 100vh;
  width: 100vw !important;
  overflow: auto;
}

.navDivNone {
  height: 0.9rem;
}

.mainContent {
  // height: calc(100vh - 1rem);
  // overflow: auto;
  // padding-bottom: 1rem;
  box-sizing: border-box;
  background: transparent;

  &.noWebBg {
    background: #fafafa !important;
  }

  &.noTabbar {
    height: 100%;
    padding-bottom: 0rem;
  }

  &.trade {
    // padding-bottom: 1rem;
    box-sizing: content-box;
  }
}

.footerFlxed {
  bottom: 0px;
  position: absolute;
  width: 100%;
  max-width: 750px;
}

.tabDiv {
  position: fixed;
  width: 100%;
  max-width: 750px;
  bottom: 0px;
  background: #ffffff;
  box-shadow: 0px -0.01rem 0.05rem rgba(75, 75, 75, 0.1);
  z-index: 200;
}

.popup {
  border-radius: 0.12rem;
  font-size: 0.3rem;

  .versionTip {
    padding: 0.3rem 0.5rem 0.2rem 0.5rem;
    width: 6.5rem;
    box-sizing: border-box;

    .title {
      text-align: center;
      margin-bottom: 0.3rem;
      font-weight: bold;
    }

    .content {
      margin-bottom: 0.4rem;
      line-height: 0.5rem;
    }

    .btnDiv {
      text-align: center;
      border-top: 1px solid #efefef;
      padding-top: 0.2rem;

      .btn {
        font-size: 0.3rem;
        width: 100%;
        color: $color-this;
        height: 0.5rem;
        line-height: 0.5rem;
        background: transparent;
      }
    }
  }
}

.waxPopup{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .3);
  z-index: 1000;
  font-size: .3rem;

  .waxLoginTip{
    background: #FFF;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    width: 6.21rem;
    box-sizing: border-box;
    text-align: center;
    padding: .41rem;
    border-radius: .17rem;

    .popupTip{
      font-size: .36rem;
      color: $color-this;
      margin-bottom: .33rem;
    }
    .popupContent{
      font-size: .28rem;
      color: $color-333;
      margin-bottom: .44rem;
    }
    .popupBtn{
      font-size: .25rem;
      background: #4A90E2;
      border-radius: 10.35px;
      height: .82rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
    }
  }
}
</style>
