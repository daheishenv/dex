<template>
  <div class="trade">
    <mt-loadmore
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="$t('public.loadingMoreTip1')"
      :bottomDropText="$t('public.loadingMoreTip2')"
      :bottomLoadingText="$t('public.loadingMoreTip3')"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false" ref="loadmore">
      <div class="main">
        <!-- coin & 收藏 -->
        <div class="tools">
          <div class="symbol" @click="changeSymbol = true">
            <img class="coinImg" :src="coinImgUrl" @error="handleImgError"
            :onerror="errorCoinImg" alt="">
            <div class="contractDiv">
              <div class="symbolAndMore">
                <span>{{symbol1}}</span>
                <span class="iconfont icon-huaban37 changeSymbol"></span>
              </div>
            </div>
          </div>
          <div class="favorate">
            <!-- cpu start -->
            <Cpu v-if="this.$store.state.app.channel !== 'mykey'" />
            <!-- K线 start -->
            <span class="iconfont icon-huaban47 icon fr ml36" @click="handleToLineK"></span>
          </div>
        </div>

        <div class="content">
          <div class="typeDiv">
            <div :class="{'buy': type === 1}" @click="type = 1">{{ $t('public.buy') }}</div>
            <div :class="{'sell': type === 2}" @click="type = 2">{{ $t('public.sell') }}</div>
          </div>
          <div class="priceDiv">
            <div>
              <span v-if="type === 1">{{ $t('resources.buyPrice') }}</span>
              <span v-else>{{ $t('resources.sellPrice') }}</span>
            </div>
            <div class="inputDiv">
              <span>≈{{ rexPrice }}</span>
              <span>EOS/REX</span>
            </div>
          </div>
          <div class="countDiv">
            <div>
              <span v-if="type === 1">{{ $t('resources.buyNum') }}</span>
              <span v-else>{{ $t('resources.sellNum') }}</span>
            </div>
            <div class="inputDiv" :class="{'error': inputError}">
              <input type="number" v-model="dealNum" :placeholder="$t('resources.count')"
                @blur="handleBlur" @focus="handleFocus"/>
              <span>
                <span v-if="type === 1">EOS</span>
                <span v-else>REX</span>
              </span>
            </div>
          </div>
          <div class="aboutPrice">
            <span>
              <span>≈{{ aboutNum }}</span>
              <span v-if="type === 1">REX</span>
              <span v-else>EOS</span>
            </span>
          </div>
          <div class="range" :class="{'sellRange': type === 2}"
            @touchend="handleTouchEnd"
            @touchstart="handleTouchStart">
            <div class="desc">
              <span>
                <span class="before" @click="handleRangeSet(0)" :class="{'border-green': rangeValue >= 0}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(25)" :class="{'border-green': rangeValue >= 25}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(50)" :class="{'border-green': rangeValue >= 50}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(75)" :class="{'border-green': rangeValue >= 75}"></span>
                <span class="last" @click.stop="handleRangeSet(100)" :class="{'border-green': rangeValue >= 100}"></span>
              </span>
            </div>
            <mt-range
              v-model="rangeValue"
              :min="0"
              :max="100"
              :step="1"
              :bar-height="5">
            </mt-range>
          </div>
          <div class="ableTradeDiv">
            <div class="ableTrade" @click="handleClickAble">
              <span v-if="type === 1">{{ $t('resources.abledEos') }}: {{ eosBalance }}</span>
              <span v-else>{{ $t('resources.abledSellRex') }}: {{ rexAbleSell }}</span>
            </div>
            <div class="percent">{{ handleToFixed(rangeValue, 2) }}%</div>
          </div>
          <div class="btn" :class="{'bgColor-red': type !== 1,
            'bgColor-999': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'}"
            @click="handleReg">
            <span v-if="type === 1">{{ $t('newpos.buyRex') }}</span>
            <span v-else>{{ $t('newpos.sellRex') }}</span>
          </div>
          <div class="btnBottom">
            <div v-if="type === 1" class="buyInStaked" @click="handleByBuyStaked">{{ $t('resources.buyInStaked') }}</div>
            <div v-else>
              <span>{{ $t('resources.rexBalance') }}:</span>
              <span>{{ rexBalance }}</span>
            </div>
            <div class="rexTip" @click="rexTradeNote = true">
              <span>{{ $t('resources.rexTradeNote') }}</span>
              <span class="iconfont icon-huaban31 question"></span>
            </div>
          </div>
        </div>

        <!-- 交易历史 -->
        <div class="history">
          <div class="subTitle">{{ $t('resources.tradeHistory') }}</div>
          <div class="lists">
            <template v-if="list.length">
               <div class="item"  v-for="(item, $index) in list" :key="$index">
                <div class="info">
                  <span class="type" v-if="item.direction === 1">{{ $t('public.buy') }}</span>
                  <span class="type color-red" v-else>{{ $t('public.sell') }}</span>
                  <span class="rexCoin">REX</span>
                  <span class="date">{{ handleToLocalTime(item.tradeTime) }}</span>
                </div>
                <div class="data">
                  <div class="left">
                    <div class="itemtitle">{{ $t('resources.vol') }}(EOS)</div>
                    <div class="num">{{ handleToFixed(item.amount, 4) }}</div>
                  </div>
                  <div class="right">
                    <div class="itemtitle">{{ $t('resources.amt') }}(REX)</div>
                    <div class="num">{{ handleToFixed(item.count, 4) }}</div>
                  </div>
                </div>
                <div class="data">
                  <div>
                    <span class="itemtitle">{{ $t('resources.unlock') }}:</span>
                    <span class="unlockTime" v-if="item.direction === 1">{{ handleToLocalTime(item.unlockTime) }}</span>
                    <span class="unlockTime" v-else>--</span>
                  </div>
                  <div class="trxDiv">
                    <span class="itemtitle">TrxID:</span>
                    <span class="trxId" @click="handleToTx(item.trxId, 'eos')">{{ item.trxId }}</span>
                  </div>
                </div>
             </div>
            </template>


            <!-- 暂无数据 -->
            <div class="noData" v-if="!list.length">
              <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
              <div class="tip">{{ $t('public.noData') }}</div>
            </div>

            <!-- 没有更多 -->
            <div class="noMore" v-if="allLoaded && list.length">
              <div class="noTip color-999">{{ $t('public.noMore') }}</div>
            </div>
          </div>
        </div>
      </div>
    </mt-loadmore>

    <!-- 切换交易对 -->
    <mt-popup
      v-model="changeSymbol"
      position="left">
        <change-symbol v-show="changeSymbol" @listenClose="handleClose" />
    </mt-popup>

    <!-- 切换账户提示 -->
    <mt-popup
      v-model="changeAccountTip"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <change-account-tip :changeChain="'EOS'" v-if="changeAccountTip" @listenClose="handleClose"/>
    </mt-popup>

    <!-- REX交易说明 -->
    <mt-popup
      v-model="rexTradeNote"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <RexTradeNote v-if="rexTradeNote" :type="type"
      @listenClose="handleClose"/>
    </mt-popup>

    <!-- 使用已抵押资源买入REX -->
    <mt-popup
      v-model="showBuyByStaked"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <BuyByStaked v-if="showBuyByStaked"
        :stakeList="stakeList"
        :dexProxyLists="dexProxyLists"
        :coin="coin"
        :stakedCount="stakedCount"
        :info="info" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import axios from 'axios';
import { Popup, Loadmore, Range } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { getAccountRexData } from '@/utils/publicApi';
import { toFixed, toLocalTime, toBrowser } from '@/utils/public';
import Cpu from '@/views/market/components/Cpu';
import ChangeSymbol from '@/views/market/components/ChangeSymbol';
import ChangeAccountTip from '@/views/market/popup/ChangeAccountTip';
import RexTradeNote from '@/views/resources/popup/RexTradeNote';
import BuyByStaked from '@/views/resources/components/BuyByStaked';

export default {
  data() {
    return {
      changeSymbol: false,
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      coinImgUrl: 'https://nds.340wan.com/static/img/coin/EOS.png',
      symbol: 'rex-eos',
      symbol1: 'REX',
      symbol2: 'EOS',
      type: 1,
      rangeValue: 0,
      rangeFocus: false,

      allLoaded: false,
      page: 1,
      list: [],
      rexPrice: '0.00000000000',
      rexPriceAll: '0.000000000', // 完整的REX价格
      dealNum: '', // 买入EOS数量 | 卖出REX数量
      aboutNum: '0.0000', // 计算大约数量
      rexBalance: '0.0000',
      rexAbleSell: '0.0000',
      eosBalance: '0.0000',
      balanceTimer: null,
      numTimer: null,

      changeAccountTip: false,
      rexTradeNote: false,
      inputError: false,
      first: true,
      info: { // 账户代理信息
        producers: [],
        proxy: '',
      },
      stakedCount: '0.0000', // 自己账户的总抵押量
      stakeList: [], // 账户抵押资源列表
      dexProxyLists: [], // 平台代理列表
      newProxy: '', // 新设置的代理账户

      coin: 'EOS', // 基础币种 EOS - 主网 | SYS - 测试网
      showBuyByStaked: false,
    }
  },
  components: {
    Cpu,
    ChangeSymbol,
    ChangeAccountTip,
    RexTradeNote,
    BuyByStaked,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
    mtRange: Range,
  },
  watch: {
    type() {
      this.dealNum = '';
      this.aboutNum = '0.0000';
      this.rangeValue = 0;
      this.inputError = false;
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        if (!this.first) {
          this.changeAccountTip = true;
        }
      }
    },
    dealNum(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.dealNum = oldVal;
        return;
      }
      this.inputError = false;
      if (!this.rangeFocus) {
        window.clearTimeout(this.numTimer);
        if (this.type === 1) {
          this.numTimer = window.setTimeout(() => {
            const aboutNum = Decimal.div(Number(newVal), this.rexPriceAll).toString();
            this.aboutNum = toFixed(aboutNum, 4);
            if (!Number(this.eosBalance)) {
              this.rangeValue = 0;
              return;
            }
            let range = Decimal.div(Number(newVal), Number(this.eosBalance)).toString();
            range = Decimal.mul(range, 100).toString();
            if (Number(range) > 100) {
              range = 100;
            }
            this.rangeValue = Number(range);
          }, 300);
          return;
        }
        this.numTimer = window.setTimeout(() => {
          const aboutNum = Decimal.mul(Number(newVal), this.rexPriceAll).toString();
          this.aboutNum = toFixed(aboutNum, 4);
          if (!Number(this.rexAbleSell)) {
            this.rangeValue = 0;
            return;
          }
          let range = Decimal.div(Number(newVal), Number(this.rexAbleSell)).toString();
          range = Decimal.mul(range, 100).toString();
          if (Number(range) > 100) {
            range = 100;
          }
          this.rangeValue = Number(range);
        }, 300);
      }
    },
    rangeValue(newVal) {
      if (this.rangeFocus) {
        const range = Decimal.div(Number(newVal), 100).toString();
        if (this.type === 1) {
          const dealNum = Decimal.mul(Number(range), Number(this.eosBalance)).toString();
          this.dealNum = toFixed(dealNum, 4);
          const aboutNum = Decimal.div(Number(this.dealNum), this.rexPriceAll).toString();
          this.aboutNum = toFixed(aboutNum, 4);
          return;
        }
        const dealNum = Decimal.mul(Number(range), Number(this.rexAbleSell)).toString();
        this.dealNum = toFixed(dealNum, 4);
        const aboutNum = Decimal.mul(Number(this.dealNum), this.rexPriceAll).toString();
        this.aboutNum = toFixed(aboutNum, 4);
      }
    },
    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
    },
  },
  mounted() {
    this.stakeList = [{
      cpu_weight: '0.0000 EOS',
      from: this.$store.state.app.accountInfo.account,
      net_weight: '0.0000 EOS',
      to: this.$store.state.app.accountInfo.account,
    }]
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.type = this.$route.params.activeType === 'sell' ? 2 : 1;
      setTimeout(() => {
        this.first = false;
      }, 500);
      this.handleGetLists();
      this.handleGetDexProxyList();

      // 需要定时的接口
      this.handleGetRexPrice();
      this.handleRexBalance();
      this.handleGetEosBalance();
      this.handleGetAccountInfo();
      this.handleGetStakedInfo();
      window.clearInterval(this.balanceTimer);
      this.balanceTimer = window.setInterval(() => {
        this.handleGetRexPrice();
        this.handleRexBalance();
        this.handleGetEosBalance();
        this.handleGetAccountInfo();
        this.handleGetStakedInfo();
      }, 3000);
    },
    // 手机滑动
    handleTouchStart() {
      this.rangeFocus = true;
    },
    handleTouchEnd() {
      this.rangeFocus = false;
    },
    // dealNum 失去焦点
    handleBlur() {
      this.dealNum = toFixed(Number(this.dealNum), 4);
    },
    // dealNum 获取焦点
    handleFocus() {
      const dealNum = Number(this.dealNum);
      if (dealNum === 0) {
        this.dealNum = '';
        return;
      }
      this.dealNum = dealNum;
    },
    // 点击可用余额 - 带入数量
    handleClickAble() {
      if (this.type === 1) {
        this.dealNum = this.eosBalance;
        return;
      }
      this.dealNum = this.rexAbleSell;
    },
    // 查询Tx
    handleToTx(id, chain) {
      if (id.indexOf('*') !== -1) {
        return;
      }
      toBrowser(id, chain, 'tx', this.$embed);
    },
    // 小数位截取
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    // 时间转化
    handleToLocalTime(t) {
      return toLocalTime(t).substr(0, 16)
    },
    // 下拉刷新
    loadTop() {
      this.dealNum = '';
      this.aboutNum = '0.0000';
      this.rangeValue = 0;
      this.inputError = false;
      this.page = 1;
      this.handleGetLists();
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      this.handleGetLists();
    },
    // 滑块点击
    handleRangeSet(num) {
      this.rangeFocus = true;
      this.rangeValue = num;
      setTimeout(() => {
        this.rangeFocus = false;
      }, 500);
    },
    // 处理图片加载出错
    handleImgError() {
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
    },
    // 关闭切换币种
    handleClose(type) {
      this.changeSymbol = false;
      this.changeAccountTip = false;
      this.rexTradeNote = false;
      this.showBuyByStaked = false;
      if (type) {
        setTimeout(() => {
          this.page = 1;
          this.handleGetLists();
        }, 500);
      }
    },
    // 跳转到K线
    handleToLineK() {
      // 资源交易对跳转
      const params = {
        symbol: this.symbol
      }
      this.$router.push({
        name: 'resourceKlineRex',
        params,
      });
    },
    // 获取交易历史
    handleGetLists() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.allLoaded = true;
          this.list = [];
          if (this.page === 1) {
            this.$refs.loadmore.onTopLoaded();
            return;
          }
          this.$refs.loadmore.onBottomLoaded();
          return;
        }
        const params = {
          page: this.page || 1,
          limit: 10,
        }
        this.$http.get('/eosRex/actions', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          const page = res.page;
          if (page.totalPage <= this.page) {
            this.allLoaded = true;
          } else {
            this.allLoaded = false;
          }
          if (this.page === 1) {
            this.list = page.list;
            this.$refs.loadmore.onTopLoaded();
            return;
          }
          this.list.push(...page.list);
          this.$refs.loadmore.onBottomLoaded();
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetLists()
        }, 200);
      }
    },
    // 获取平台代理账户列表
    handleGetDexProxyList() {
      this.$http.get('/pool/getNewdexProxyList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.dexProxyLists = res.newdexProxyList;
      });
    },
    // 获取REX价格
    handleGetRexPrice() {
      // getRexData((err, res) => {
      //   if (err || res.code !== 0) {
      //     return;
      //   }
      //   this.rexPrice = res.data.priceCut;
      //   this.rexPriceAll = res.data.price;
      // });
      const arr = this.$store.state.app.allSymbolData.resources;
      const rexData = arr.filter(item => item.id === 'rex')[0] || [];
      this.rexPrice = Number(rexData.price).toFixed(11);
      this.rexPriceAll = rexData.price;
    },
    // 获取账户REX余额 & REX可交易余额
    handleRexBalance() {
      getAccountRexData((err, res) => {
        if (err || res.code !== 0) {
          return;
        }
        this.rexBalance = res.data.rex_balance.split(' ')[0];
        this.rexAbleSell = res.data.abledTrade;
      });
    },
    // 获取账户EOS余额
    async handleGetEosBalance() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.eosBalance = '0.0000';
          return;
        }
        // 正常获取余额
        const params = {
          account: this.$store.state.app.accountInfo.account,
          code: 'eosio.token',
          symbol: this.coin,
        }

        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.eosBalance = balance;
        } else {
          this.eosBalance = `0.0000 ${params.coin}`;
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     this.eosBalance = '0.0000';
        //     return;
        //   }
        //   this.eosBalance = data.split(' ')[0];
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetEosBalance();
        }, 200);
      }
    },
    // 获取账户信息
    handleGetAccountInfo() {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account,
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
          return;
        }
        axios.post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params)).then((response) => {
          if (response.data.voter_info) {
            this.info = response.data.voter_info;
          }
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 查询抵押列表
    handleGetStakedInfo() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.stakedCount = '0.0000';
          return;
        }
        const params = {
          code: 'eosio',
          json: true,
          limit: 50,
          lower_bound: '',
          scope: this.$store.state.app.accountInfo.encodeName,
          table: 'delband',
          table_key: '',
          upper_bound: '',
        }
        const nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        axios.post(`${nodeHttp}/v1/chain/get_table_rows`, JSON.stringify(params)).then((response) => {
          if (response.data.rows.length < 1) {
            this.stakedCount = '0.0000';
            this.stakeList = [{
              cpu_weight: '0.0000 EOS',
              from: this.$store.state.app.accountInfo.account,
              net_weight: '0.0000 EOS',
              to: this.$store.state.app.accountInfo.account,
            }]
            return
          }
          const rows = response.data.rows;
          const arr = [];
          rows.forEach((item) => {
            if (this.$store.state.app.accountInfo.account === item.to) {
              arr.unshift(item)
              return;
            }
            arr.push(item)
          });
          this.stakeList = arr;
          // 计算总抵押量
          let stakedCount = 0;
          this.stakeList.forEach((item) => {
            const cpu = Number(item.cpu_weight.split(' ')[0]);
            const net = Number(item.net_weight.split(' ')[0]);
            stakedCount = Decimal.add(Number(stakedCount), cpu).toString();
            stakedCount = Decimal.add(Number(stakedCount), net).toString();
          });
          this.stakedCount = toFixed(stakedCount, 4);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetStakedInfo();
        }, 200);
      }
    },
    // 使用已抵押资源买入
    handleByBuyStaked() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        this.changeAccountTip = true;
        return;
      }
      this.showBuyByStaked = true;
    },
    /* -------- btn 事件分发 -------- */
    // 按钮验证
    handleReg() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        this.changeAccountTip = true;
        return;
      }
      if (this.type === 1) {
        if (!this.dealNum || Number(this.dealNum) <= 0.0001) {
          this.inputError = true;
          this.$toast(`${this.$t('trade.minTrade')}0.0002 EOS`);
          return;
        }
        if (Number(this.dealNum) > Number(this.eosBalance)) {
          this.inputError = true;
          this.$toast(this.$t('quotation.low'));
          return;
        }
      } else {
        if (!this.dealNum || Number(this.aboutNum) === 0) {
          this.inputError = true;
          this.$toast(`${this.$t('trade.minTrade')}0.0001 EOS`);
          return;
        }
        if (Number(this.dealNum) > Number(this.rexBalance)) {
          this.inputError = true;
          this.$toast(this.$t('quotation.low'));
          return;
        }
      }
      this.inputError = false;
      this.handleDealBtn()
    },
    // 验证账户代理权是否是平台的
    handleRegAccountProxy() {
      const index = this.dexProxyLists.findIndex(item => item === this.info.proxy);
      if (index === -1) { // 不是平台代理 - 获取平台可用代理账户
        const stakeCount = Number(this.dealNum);
        const params = {
          stakeCount,
        }
        this.$http.get('/pool/getProxy', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.newProxy = res.proxy;
          if (this.type === 1) {
            this.handleBuy(this.newProxy);
            return;
          }
          this.handleSell(this.newProxy);
        });
        return;
      }
      if (this.type === 1) {
        this.handleBuy(this.info.proxy);
        return;
      }
      this.handleSell(this.info.proxy);
    },
    // 事件分发
    handleDealBtn() {
      // 需求修改 - 买入卖出操作都需要重新代理
      // if (this.type === 1) {
      this.handleRegAccountProxy();
      //   return;
      // }
      // this.handleSell();
    },
    // 买入
    async handleBuy(proxy) {
      const obj = {
        action: 'buyrex',
        amount: `${this.dealNum || '0.0000'} ${this.coin}`,
        proxy,
        stakedCpu: false,
      }
      // 判断账户抵押资源为0 - 处理抵押
      if (!Number(this.stakedCount)) {
        const rexQuantity = Decimal.sub(Number(this.dealNum), 0.0001).toString();
        obj.amount = `${toFixed(rexQuantity, 4) || '0.0000'} ${this.coin}`;
        obj.stakedCpu = true;
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      let actions = [];
      const buyaction = [
        { // 充值
          account: 'eosio',
          name: 'deposit',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            amount: obj.amount, // eos 数量
          },
        },
        { // 买入：buyrex
          account: 'eosio',
          name: 'buyrex',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            amount: obj.amount, // eos 数量
          },
        }
      ];
      actions.push(...buyaction);
      if (obj.action === 'sellrex') {
        actions = [
          { // 卖出：sellrex
            account: 'eosio',
            name: 'sellrex',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              from: fromName,
              rex: obj.rex
            },
          },
          { // 提现
            account: 'eosio',
            name: 'withdraw',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              owner: fromName,
              amount: obj.amount
            },
          }
        ]
      }
      if (obj.proxy) {
        actions.unshift({ // 投票
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            voter: fromName,
            proxy: obj.proxy, // 投票的节点名称
            producers: [],
          },
        })
      }
      if (obj.stakedCpu) {
        actions.unshift({
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            receiver: fromName,
            stake_net_quantity: '0.0000 EOS',
            stake_cpu_quantity: '0.0001 EOS',
            transfer: 0
          }
        })
      }
      const params = {
        actions,
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('newpos.toastBuySuccess'));
      this.handleGetRexPrice();
      this.handleRexBalance();
      this.handleGetEosBalance();
      setTimeout(() => {
        this.loadTop();
      }, 500);
      // DApp.rexTransaction(params, (err, res) => {
      //   if (err) {
      //     return;
      //   }
      //   if (res) {
      //     this.$toast(this.$t('newpos.toastBuySuccess'));
      //     this.handleGetRexPrice();
      //     this.handleRexBalance();
      //     this.handleGetEosBalance();
      //     setTimeout(() => {
      //       this.loadTop();
      //     }, 500);
      //   }
      // });
    },
    // 卖出
    async handleSell(proxy) {
      // 计算卖出rex得到的EOS amount
      let amount = Decimal.mul(this.rexPriceAll, this.dealNum).toString();
      amount = toFixed(amount, 4);
      const obj = {
        proxy,
        action: 'sellrex',
        amount: `${amount || '0.0000'} ${this.coin}`,
        rex: `${this.dealNum || '0.0000'} REX`,
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      let actions = [];
      const buyaction = [
        { // 充值
          account: 'eosio',
          name: 'deposit',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            amount: obj.amount, // eos 数量
          },
        },
        { // 买入：buyrex
          account: 'eosio',
          name: 'buyrex',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            amount: obj.amount, // eos 数量
          },
        }
      ];
      actions.push(...buyaction);
      if (obj.action === 'sellrex') {
        actions = [
          { // 卖出：sellrex
            account: 'eosio',
            name: 'sellrex',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              from: fromName,
              rex: obj.rex
            },
          },
          { // 提现
            account: 'eosio',
            name: 'withdraw',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              owner: fromName,
              amount: obj.amount
            },
          }
        ]
      }
      if (obj.proxy) {
        actions.unshift({ // 投票
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            voter: fromName,
            proxy: obj.proxy, // 投票的节点名称
            producers: [],
          },
        })
      }
      if (obj.stakedCpu) {
        actions.unshift({
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            receiver: fromName,
            stake_net_quantity: '0.0000 EOS',
            stake_cpu_quantity: '0.0001 EOS',
            transfer: 0
          }
        })
      }
      const params = {
        actions,
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('newpos.toastSellSuccess'));
      this.handleGetRexPrice();
      this.handleRexBalance();
      this.handleGetEosBalance();
      setTimeout(() => {
        this.loadTop();
      }, 3000);
      // DApp.rexTransaction(params, (err, res) => {
      //   if (err) {
      //     return;
      //   }
      //   if (res) {
      //     this.$toast(this.$t('newpos.toastSellSuccess'));
      //     this.handleGetRexPrice();
      //     this.handleRexBalance();
      //     this.handleGetEosBalance();
      //     setTimeout(() => {
      //       this.loadTop();
      //     }, 3000);
      //   }
      // });
    },
  },
  beforeDestroy() {
    window.clearInterval(this.balanceTimer);
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .trade{
    height: calc(100vh - 1.6rem) !important;
    overflow: auto;
  }
}

.trade{
  font-size: .30rem;
  background: #FFF;
  height: calc(100vh - 1rem);
  overflow: auto;

  .tools{
    padding: 0rem .25rem;
    background: #FFF;
    height: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: .08rem solid #f3f3f3;

    &>div:first-child{
      display: flex;
      align-items: center;
    }

    .symbol{
      position: relative;

      .coinImg{
        width: .6rem;
        margin-right: .1rem;
      }

      .contractDiv{
        .contract{
          font-size: .25rem;
          color: $color-999;
          margin-top: -.1rem;
        }

        .symbolAndMore{
          display: flex;
          align-items: center;
          font-size: .36rem;
        }
      }

      .changeSymbol{
        font-size: .16rem;
        margin-left: .1rem;
      }
    }

    .icon{
      font-size: .38rem;
    }

    .activity{
      width: .44rem;
      margin-right: .3rem;
    }

    .favorate{
      display: flex;
      align-items: center;
    }
  }

  .content{
    padding: .38rem;

    .typeDiv{
      display: flex;
      align-items: center;
      justify-content: space-between;

      &>div{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: .83rem;
        border: 1px solid #C7C7C7;
        margin-left: .1rem;
        border-radius: 0 .1rem .1rem 0;

        &:first-child{
          margin-left: 0rem;
          border-radius: .1rem 0 0 .1rem;
        }

        &.buy{
          border: 1px solid $color-green;
          color: $color-green;
        }
        &.sell{
          border: 1px solid $color-red;
          color: $color-red;
        }
      }
    }

    .priceDiv{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .5rem;
      height: .72rem;

      .inputDiv{
        box-sizing: border-box;
        padding: 0 .24rem;
        height: 100%;
        min-width: 5.48rem;
        max-width: 5.48rem;
        background: #F3F3F3;
        border: 1px solid #C7C7C7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .0662rem;
        color: #A9A8AF;
        font-size: .28rem;
      }
    }

    .countDiv{
      margin-top: .45rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: .72rem;

      .inputDiv{
        background: #FFF;
        box-sizing: border-box;
        padding: 0 .24rem;
        height: 100%;
        min-width: 5.48rem;
        max-width: 5.48rem;
        border: 1px solid #C7C7C7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .0662rem;
        color: #A9A8AF;
        font-size: .28rem;

        &.error{
          border: 1px solid $color-red;
        }

        input{
          height: 100%;
          width: 100%;
          font-size: .28rem;
        }
      }
    }

    .aboutPrice{
      display: flex;
      justify-content: flex-end;
      font-size: .25rem;
      margin-top: .15rem;
      margin-right: .25rem;
      color: $color-999;
    }

    .range{
      margin-top: .2rem;
      position: relative;

      &.sellRange{
        /deep/ .mt-range-progress{
          background-color: $color-red !important;
        }

        .border-green{
          border-color: $color-red !important;
        }
      }

      /deep/ .mt-range{
        height: .5rem;
        line-height: .5rem;

        .mt-range-content{
          margin-right: .3rem;
        }

        .mt-range-runway{
          right: -0.05rem;
        }

        .mt-range-thumb{
          width: .5rem;
          height: .5rem;
          z-index: 10;
        }

        .mt-range-progress{
          background-color: $color-green;
        }
      }

      .desc{
        display: flex;
        align-items: center;/*垂直居中*/
        position: absolute;
        width: 100%;
        height: .50rem;
        z-index: 1;
        line-height: .5rem;

        &>span{
          flex: 1;
          height: .4rem;
          display: flex;
          align-items: center;/*垂直居中*/
          text-align: right;

          .before{
            display: inline-block;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            transform: translate(-50%, 0);
            background: #ffffff;

            &.border-green{
              border-color: $color-green;
            }
          }

          &:nth-child(2) .before{
            transform: translate(-25%, 0);
          }
          &:nth-child(1) .before{
            transform: translate(0, 0);
          }

          .last{
            background: #ffffff;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            position: absolute;
            right: 0px;
          }

        }
      }
    }

    .ableTradeDiv{
      display: flex;
      justify-content: space-between;
      font-size: .25rem;
      color: $color-999;
      margin-top: .24rem;
    }

    .btn{
      background: $color-green;
      height: .84rem;
      color: #FFF;
      border-radius: .1rem;
      margin-top: .6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &.bgColor-red{
        background: $color-red;
      }
      &.bgColor-999{
        background: $color-999 !important;
      }
    }

    .btnBottom{
      margin-top: .24rem;
      font-size: .25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .buyInStaked{
        color: $color-this;
      }

      .rexTip{
        color: $color-999;
        display: flex;
        align-items: center;

        .question{
          font-size: .25rem;
          margin-left: .09rem;
        }
      }
    }
  }

  .history{
    .subTitle{
      height: .74rem;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      padding-left: .24rem;
      font-size: .25rem;
    }

    .lists{
      background: #f3f3f3;

      .noMore{
        text-align: center;
        padding-bottom: .2rem;
        font-size: .25rem;
      }

      .noData{
        margin-top: .5rem;
        margin-bottom: .5rem;
        text-align: center;
        color: $color-999;
        background: #FFF;

        img{
          width: 1.8rem;
        }

        .tip{
          font-size: .25rem;
          margin-top: .2rem;
        }
      }

      .item{
        margin-bottom: .12rem;
        background: #FFF;
        padding: .29rem .24rem .67rem;

        .info{
          display: flex;
          align-items: center;
          margin-bottom: .28rem;

          .type{
            color: $color-green;
            margin-right: .15rem;
            font-size: .32rem;
          }

          .rexCoin{
            font-size: .3rem;
            margin-right: .5rem;
          }

          .date{
            color: $color-999;
            font-size: .25rem;
          }
        }

        .data{
          margin-top: .21rem;
          display: flex;
          align-items: center;

          &>div{
            flex: 1;
            font-size: .25rem;

            .itemtitle{
              font-size: .25rem;
              color: $color-999;
            }

            .num{
              font-size: .3rem;
              margin-top: .02rem;
            }

            &.trxDiv{
              display: flex;
              align-items: center;

              .trxId{
                margin-left: .08rem;
                max-width: 2rem;
                overflow: hidden;
                word-break: normal;
                text-overflow: ellipsis;
                color: $color-this;
              }
            }
          }
        }
      }
    }
  }
}
.changeAccountTip{
  border-radius: .1rem;
  background: transparent;
  // top: 30%;
  // transform: translate(-50% -30%);
}
</style>
