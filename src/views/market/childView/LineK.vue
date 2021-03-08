<template>
  <div class="linek" :class="{'isMove': isMove}">
    <div class="height">
      <div class="tools" :class="{'fixed': channelRef === 'dapp',
        'boxShadow': isScroll !== 0 && channelRef === 'dapp',
        'boxShadow fixed': isScroll >= 1 && channelRef === 'h5',}">
        <div :class="{'pdleft': $store.state.app.channel !== 'meetone' || !isAndroid}">
          <span class="iconfont icon-huaban11 backRoute" v-if="$store.state.app.channel === 'meetone' && isAndroid" @click="handleBackRoute"></span>
          <span class="symbol" @click="changeSymbol = false">
            <span><img class="coinImg" :src="coinImgUrl" :onerror="errorCoinImg"
              @error="handleImgError" alt=""></span>
            <div>
              <div class="position">
                <span>{{symbol1}}/{{symbol2}}</span>
                <!-- 跨链 -->
                <span class="chain" v-if="showChain" @click.stop="handleShowChainTip">
                  <div class="note" v-if="showChainTip">{{ $t('quotation.acrossChain') }}</div>
                </span>
              </div>
              <div class="contract" v-if="$appName === 'eosNewdex'">{{ contract }}</div>
            </div>
            <span v-if="false" class="iconfont icon-huaban11 changeSymbol"></span>
          </span>
          <span class="favourites">
            <div v-if="$appName === 'eosNewdex' && channelRef === 'dapp'">
              <Cpu v-if="this.$store.state.app.channel !== 'mykey'" :class="{'mr0': $embed}"/>
            </div>
            <!-- 波场资源 -->
            <div v-else-if="$appName === 'tronNewdex'">
              <ResourceTron />
            </div>
            <Refresh />
            <Favourites v-if="channelRef === 'dapp' && !$embed" :symbol="symbol" :id="symbolId"/>
            <!-- <span v-if="website" class="iconfont icon-huaban118 website" @click="handleToWebsite"></span> -->
            <link-more v-if="!$embed" :website="website" @listenSelected="handleSelected" />
          </span>
        </div>
      </div>
      <div class="noneDiv"></div>
      <!-- 活动入口 start -->
      <EventsEntrance v-if="promotionsInfoVo && promotionsInfoVo.promotionCodes && promotionsInfoVo.promotionCodes.length > 0"
        :promotionsInfoVo="promotionsInfoVo"
        @listenMove="handleMove" />
      <!-- 活动入口 end -->

      <div class="coinInfo" style="overflow:hidden">
        <div class="fl" :class="{'color-green': symbolData.change > 0,'color-red': symbolData.change < 0}">
          <div class="price">
            {{ toFixed(symbolData.price, precision.price) }}
            <span class="iconfont icon-huaban39 icon" v-if="symbolData.change > 0"></span>
            <span class="iconfont icon-huaban40 icon" v-if="symbolData.change < 0"></span>
          </div>
          <div>
            <span><span v-if="symbolData.change > 0">+</span>{{ handleChange(symbolData.change, 2) }}%</span>
            <span class="rate color-333" v-if="$store.state.app.language === 'zh-CN'">
              <span>¥{{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbol2.toLowerCase()] || 0, precision.price) }}</span>
            </span>
            <span class="rate color-333" v-if="$store.state.app.language !== 'zh-CN'">
              <span>${{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbol2.toLowerCase()] || 0, precision.price) }}</span>
            </span>
          </div>
        </div>
        <div class="fr">
          <div>
            <span class="tip">24H{{ $t('public.high') }}:</span>
            <span>{{ toFixed(symbolData.high, precision.price) }}</span>
          </div>
          <div>
            <span class="tip">24H{{ $t('public.low') }}:</span>
            <span>{{ toFixed(symbolData.low, precision.price) }}</span>
          </div>
          <div @click="isAmount = !isAmount">
            <span class="tip">
              <span class="iconfont icon-huaban106 switch"></span><span
                v-if="$store.state.app.language !== 'ko'">24H</span><span
              >{{ $t('quotation.num') }}:</span>
            </span>
            <span v-if="isAmount">
              <span v-if="symbolData.amount < 10000000">{{ toFixed(symbolData.amount, precision.coin) }}</span>
              <span v-if="symbolData.amount >= 10000000">{{ toFixed(symbolData.amount, 0) }}</span>
            </span>
            <span v-else>
              <span v-if="symbolData.volume < 10000000">
                {{ toFixed(symbolData.volume, $store.state.app.trad.valuationCoinDecimal || 4) }}
                <span style="fontSize: 12px">{{ symbol2 }}</span>
              </span>
              <span v-if="symbolData.volume >= 10000000">{{ toFixed(symbolData.volume, 0) }}
                <span style="fontSize: 12px">{{ symbol2 }}</span>
              </span>
            </span>
          </div>
      </div>
    </div>

    <!-- 主要内容 - K线 start -->
    <div class="mainLine">
      <trad-view :forwhat="forwhat" :symbolInfo="symbolInfo" />
      <div class="modelDiv"></div>
      <div class="modelDivLeft"></div>
      <div class="modelDivBottom"></div>
    </div>
    <!-- 主要内容 - K线 end -->

    <!-- 委托订单 | 深度图 | 最新成交 | 简介 - start -->
    <div class="subTools">
      <div class="subTools-item" :class="{'fiexd boxShadow': channelRef === 'dapp' ? isScroll > 9.17 : isScroll > 10.17}">
        <div @click="subActive = 1" :class="{'active': subActive === 1}">{{ $t('lineK.entrustmentOrder') }}</div>
        <div @click="subActive = 2" :class="{'active': subActive === 2}">{{ $t('lineK.deep') }}</div>
        <!-- 市场分布 -->
        <div v-if="symbolInfo && symbolInfo.aggConfigs && symbolInfoLoaded" @click="subActive = 6" :class="{'active': subActive === 6}">{{$t('marketDistribution.marketDistribution')}}</div>
        <div @click="subActive = 3" :class="{'active': subActive === 3}">{{ $t('lineK.newDeal') }}</div>
        <div @click="subActive = 4" :class="{'active': subActive === 4}">{{ $t('lineK.detail') }}</div>
        <div @click="subActive = 5" :class="{'active': subActive === 5}" v-if="symbol1 === 'NDX'">{{ $t('lineK.circulation') }}</div>
        <!-- 温馨提示 -->
        <span class="color-yellow" @click="tipShow = true">
          <span class="iconfont icon-huaban32" style="font-size: .25rem;"></span>
          <span>&nbsp;{{ $t('public.hint') }}</span>
        </span>
      </div>
      <div :class="{'subTools-item': channelRef === 'dapp' ? isScroll > 9.17 : isScroll > 10.17}"></div>
      <!-- 交易深度 -->
      <div class="subTools-detail" v-show="subActive === 1 || subActive === 2">
        <symbol-deep :subActive="subActive" :symbol="symbol" :symbolInfo="symbolInfo" />
      </div>
      <!-- 最新成交 -->
      <div class="newDeal" v-show="subActive === 3">
        <new-deal v-show="subActive === 3" :symbol="symbol" :symbolInfo="symbolInfo"/>
      </div>
      <!-- 简介 -->
      <div class="symbolDetail"  v-show="subActive === 4">
        <symbol-detail v-show="subActive === 4" :coin="symbol1" :symbolData="symbolData"
        :symbol2="symbol2" :coinImgUrl="coinImgUrl" @handleShowMark="isMarkValue = true"/>
      </div>
      <!-- 流通 -->
      <div class="circulationDiv" v-if="symbol1 === 'NDX'" v-show="subActive === 5">
        <div style="font-size: .29rem;margin-bottom: .25rem;">{{ $t('vip.circulation') }}</div>
        <Circulation />
      </div>
      <!-- 市场分布 -->
      <div v-if="subActive === 6">
        <market-distribution :symbolInfo="symbolInfo" />
      </div>
    </div>
    <!-- 深度 | 最新成交 | 简介 - end -->

    <!-- btn -->
    <!-- 空div占位 -->
    <div style="height: 1.27rem"></div>
      <div class="btnDiv">
        <div><button class="btn bgcolor-green" @click="handleToTrade('buy')">{{ $t('public.buy') }}</button></div>
        <div><button class="btn bgcolor-red" @click="handleToTrade('sell')">{{ $t('public.sell') }}</button></div>
        <!-- 跨链兑换 -->
        <!-- <div class="marketTipDiv" v-if="showCrossChain" @click="$router.push({name:'exchange', params:{symbol: symbolCrossCode}})">
          <span class="iconfont icon-huaban130 marketIconOff"></span>
          <div class="marketTip">{{$t('lineK.cross')}}</div>
        </div> -->
        <!-- USDT跨链兑换 -->
        <div class="marketTipDiv" v-if="isUsdt" @click="handleToUsdt">
          <!-- <span class="iconfont icon-huaban130 marketIconOff"></span> -->
          <img class="icon-usdt" src="https://ndi.340wan.com/eos/tethertether-usdt.png" alt="">
          <div class="marketTip">{{$t('exchange.exchangeUsdt')}}</div>
        </div>
        <!-- BOS矿池跳转 -->
        <div class="marketTipDiv" v-if="isBosToEos" @click="handleToBosNewpool">
          <span class="iconfont icon-huaban146 newpool"></span>
          <div class="newpoolNote">{{$t('newpos.posNow')}}</div>
        </div>
        <!-- 生成USN -->
        <div class="marketTipDiv" v-if="isUsn" @click="handleToUsn">
          <span class="iconfont icon-huaban1310 danchor"></span>
          <div class="newpoolNote">{{$t('lineK.usn', {coin: 'USN'})}}</div>
        </div>
        <!-- 特定稳定币跳转 -->
        <div class="marketTipDiv" v-if="isUsds" @click="handleToWebsite">
          <div class="usdsImg">
            <img class="coinImg" :src="coinImgUrl" :onerror="errorCoinImg"
              @error="handleImgError" alt="">
          </div>
          <div class="usdsText">{{$t('lineK.usn', {coin: symbol2})}}</div>
        </div>
        <!-- 充提币 -->
        <div class="marketTipDiv" v-if="isCharging" @click="handleChargingChange">
          <span class="iconfont icon-huaban155" style="color: #4a90e2;"></span>
          <div class="newpoolNote">{{ $t('ct.ct81') }}</div>
        </div>
        <!-- ptoken -->
        <div class="marketTipDiv" v-if="isPtoken" @click="handleToPtoken">
          <div class="usdsImg">
            <img class="coinImg" :src="coinImgUrl" :onerror="errorCoinImg"
              @error="handleImgError" alt="">
          </div>
          <div class="newpoolNote">{{symbol1}}</div>
        </div>
        <!-- 成交提醒 -->
        <!-- <div class="marketTipDiv" @click="handleToSetMarket" v-if="$appName === 'eosNewdex'">
          <span v-if="!hasMarket" class="iconfont icon-huaban89 marketIconOff"></span>
          <span v-if="hasMarket" class="iconfont icon-huaban87 marketIconOff marketIconOn"></span>
          <div class="marketTip">{{ $t('marketTip.tip') }}</div>
        </div> -->
      </div>
    </div>

    <!-- 切换交易对 -->
    <mt-popup
      v-model="changeSymbol"
      position="left">
        <change-symbol v-if="changeSymbol" @listenClose="handleClose" />
    </mt-popup>
    <!-- 温馨提示 -->
    <mt-popup
      class="popup"
      v-model="tipShow">
        <newdex-tip v-if="tipShow" @listenClose="handleClose" />
    </mt-popup>

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="showDialog"
      popup-transition="popup-fade">
      <to-app />
    </mt-popup>

    <!-- 盈亏统计 -->
    <mt-popup
      class="popup"
      v-model="showPopupToChandeHold"
      popup-transition="popup-fade">
      <PopupToChandeHold v-if="showPopupToChandeHold" :chooseItem="chooseItem"
          @listenClose="handleClose" @listenChangeData="handleChangeData"/>
    </mt-popup>

    <!-- 不支持跨链 -->
    <mt-popup
      class="popup"
      v-model="unsupported"
      popup-transition="popup-fade">
      <Unsupported @listenClose="handleClose"/>
    </mt-popup>
    <!-- 关于流通市值 -->
    <mt-popup
      class="popup"
      v-model="isMarkValue"
      popup-transition="popup-fade">
      <PopupMarkValue @listenClose="handleClose"/>
    </mt-popup>
    <!-- 选择充提弹窗 -->
    <mt-popup
      v-model="chargingChange"
      class="popup"
      popup-transition="popup-fade">
      <charging-change
        v-if="chargingChange"
        @listenClose="handleClose"
        :symbolCoin="symbolCoin"
        @listenShowWithdraw="handleShowWithdraw"/>
    </mt-popup>
    <!-- 充提服务暂停 -->
    <mt-popup
      v-model="WithdrawDialogVisible"
      class="popup"
      popup-transition="popup-fade">
      <withdraw-dialog @listenWithdrawDialog="WithdrawDialogVisible = false;"/>
    </mt-popup>
  </div>
</template>

<script>
// JS
import Io from '@/utils/socket/index';
import { Popup } from 'mint-ui';
import { toFixed, dealSymbolSplit, symbolRate, getReqUrl, jumpPtokenSwap, jumpUsdt } from '@/utils/public';
import { Decimal } from 'decimal.js';
import { accountToSign } from '@/utils/publicApi';
import DApp from '@/utils/wallet';
// Components
import TradView from '@/components/tradeView/TradView';
import Favourites from '@/components/Favourites';
import WithdrawDialog from '@/components/WithdrawDialog'; // 充提币暂停
import Circulation from '@/views/more/components/Circulation';
import PopupToChandeHold from '@/views/more/components/PopupToChandeHold';
import SymbolDeep from '../components/SymbolDeep';
import NewDeal from '../components/NewDeal';
import SymbolDetail from '../components/SymbolDetail';
import ChangeSymbol from '../components/ChangeSymbol';
import NewdexTip from '../components/NewdexTip';
import ToApp from '../components/ToApp';
import Cpu from '../components/Cpu';
import EventsEntrance from '../components/EventsEntrance';
import Unsupported from '../popup/Unsupported';
import Refresh from '../popup/Refresh';
import PopupMarkValue from '../popup/PopupMarkValue';
import ResourceTron from '../components/ResourceTron';
import LinkMore from '../components/LinkMore';
import ChargingChange from '../popup/ChargingChange';
import MarketDistribution from '../components/MarketDistribution'; // 市场分布

export default {
  data() {
    return {
      forwhat: 'kline',
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      type: [
        'buy',
        'sell'
      ],
      showDialog: false,
      symbol: '',
      symbol1: '',
      symbol2: '',
      symbolId: '',
      contract: '',
      symbolData: { // 交易对数据
        price: 0,
        amount: 0,
        change: 0,
        close: 0,
        count: 0,
        high: 0,
        low: 0,
        open: 0,
        volume: null,
        precision: {
          coin: 4,
          price: 4
        }
      },
      symbolInfo: { // 交易对信息
        coinDecimal: 4,
        priceDecimal: 4
      },
      precision: {
        coin: 4,
        price: 4
      },

      // subTools
      subActive: 1,
      changeSymbol: false,
      isAndroid: false,

      // 页面滚动
      isScroll: 0,
      tipShow: false,
      coinImgUrl: '',
      channelRef: 'dapp',
      promotionsInfoVo: null, // 活动信息

      isMove: false, // 事都拖动活动入口
      hasMarket: false, // 交易对以创建提醒
      showPopupToChandeHold: false,
      chooseItem: {},
      unsupported: false,
      isAmount: true, // 显示成交量 true | false 显示成交额
      website: '',
      showChain: '', // 显示跨链图标
      showChainTip: false,
      chainTipTimer: null,
      showCrossChain: false, // k线显示 跨链兑换
      symbolCrossCode: '', // 跨链兑换的币种
      showUsdtCrossChain: '', // usdt跨链兑换的币种
      isMarkValue: false, // 关于流通市值弹窗
      isEmbed: false,
      isBosToEos: false,
      isUsn: false, // 生成USN
      isUsds: false, // Usds生成
      isUsdt: false, // usdt跨链兑换
      isCharging: false, // 充提
      isPtoken: false, // ptoken
      chargingChange: false, // 选择充提币弹窗
      symbolCoin: 'ETH', // 充提币币种
      WithdrawDialogVisible: false, // 充提服务暂停
      symbolInfoLoaded: false
    }
  },
  components: {
    SymbolDeep,
    NewDeal,
    SymbolDetail,
    TradView,
    ChangeSymbol,
    Favourites,
    NewdexTip,
    ToApp,
    Cpu,
    EventsEntrance,
    Circulation, // 流通
    // VipTip, // 会员
    PopupToChandeHold,
    Unsupported,
    ResourceTron, // 资源组件
    Refresh,
    LinkMore,
    PopupMarkValue,
    ChargingChange,
    WithdrawDialog,
    mtPopup: Popup,
    MarketDistribution // 市场分布
  },
  props: [
  ],
  watch: {
    // 切换交易对
    // '$route.params.symbol': function listen(newVal, oldVal) {
    //   Io.cfwsUnsubscribe(`ticker.${oldVal}`);
    //   this.handleMounted();
    // },
  },
  created() {
    this.handleMounted();
  },
  mounted() {
    this.isEmbed = !!this.$route.meta.isEmbed;
    this.isAndroid = JSON.parse(localStorage.getItem('isAndroid'));
    document.addEventListener('scroll', this.listenScroll, false);
    const code = dealSymbolSplit(this.$route.params.symbol, '', '');
    this.symbolCoin = code.symbol1.toUpperCase();
    if (this.$route.params && this.$route.params.circle) {
      this.subActive = 5;
    }
  },
  methods: {
    handleDealSymbol() {
      this.channelRef = localStorage.getItem('channelRef');
      // 显示跨链兑换判断
      const code = dealSymbolSplit(this.symbol, this.symbolInfo.chian, this.symbolInfo.symbol1_code)
      if (this.symbol2 === 'USDT'
      && this.$appName === 'eosNewdex'
      && code.contract !== 'danchortoken'
      && code.contract !== 'issue.newdex') {
        this.isUsdt = true;
      }
      if(this.symbol2 === 'USN' && this.$appName === 'eosNewdex' ){
        this.isUsn = true
      }
      // ptoken - pbtc/peth/pnt
      if (code.contract.split('.')[1] === 'ptokens') {
        this.isPtoken = true;
      }
      // bitpietokens-ebtc-ebtc
      switch (code.contract) {
        case 'eosio.token':
          if (code.symbol1 === 'eos' && code.symbol2 === 'eusd') {
            this.symbolCrossCode = code.symbol2.toUpperCase()
            this.showCrossChain = true
          }
          // bos-eos交易对
          if (code.symbol1 === 'bos' && code.symbol2 === 'eos') {
            this.isBosToEos = true;
          }
          // eos-usn交易对
          if (code.symbol2 === 'usn') {
            this.isUsn = true;
          }
          if (code.symbol1 === 'eos' && (code.symbol2 === 'zig' || code.symbol2 === 'usde' || code.symbol2 === 'eosdt')) {
            this.isUsds = true;
          }
          if (code.symbol1 === 'eos' && code.symbol2 === 'usdt') {
            this.isCharging = false
          }
          break;
        case 'bitpietokens':
          if (code.symbol1 === 'eeth' && code.symbol2 === 'eusd') {
            this.symbolCrossCode = code.symbol2.toUpperCase()
            this.showCrossChain = true
          } else if (code.symbol1 === 'ebtc' && code.symbol2 === 'eusd') {
            this.symbolCrossCode = code.symbol2.toUpperCase()
            this.showCrossChain = true
          } else if (code.symbol1 === 'ebtc' && code.symbol2 === 'eos') {
            this.symbolCrossCode = code.symbol2.toUpperCase()
            this.showCrossChain = true
          }
          break;
        case 'danchortoken':
          if (code.symbol2 === 'usdt') {
            this.isUsn = true;
          }
          break;
        case 'issue.newdex':
          this.isCharging = true
          break;
        default:
          break;
      }
    },
    // 跳转到矿池
    handleToBosNewpool() {
      let http = 'https://newpool.340wan.com';
      if (this.$evn === 'test') {
        http = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT21}`;
      }
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const chain = this.$store.state.app.accountInfo.chain;
      window.location.href = `${http}/bos/?language=${lang}&chain=${chain}&channel=${channel}`
    },
    // 跳转到USN
    handleToUsn() {
      if (this.$embed) {
        // 跳转到Danchor生成USN
        DApp.routerTo({
          name: 'actionForUsn',
          params: {
            active: 0
          }
        })
        return;
      }
      const lang = this.$store.state.app.language || 'en';
      location.href = `https://defibox.340wan.com/usn?chain=eos&channel=${this.$store.state.app.channel}&language=${lang}`;
      // this.$router.push({
      //   name: 'usn'
      // })
    },
    // 显示跨链交易对提示
    handleShowChainTip() {
      this.showChainTip = true;
      this.$forceUpdate();
      window.clearTimeout(this.chainTipTimer)
      this.chainTipTimer = window.setTimeout(() => {
        this.showChainTip = false;
        this.$forceUpdate();
      }, 1500);
    },
    handleToWebsite() {
      if (this.$embed) {
        DApp.toBrowser(this.website)
        return;
      }
      location.href = this.website;
    },
    // 数据改变 - 或者外部重新请求接口
    handleChangeData(data) {
      this.chooseItem.costPrice = data.costPrice;
    },
    // 是否拖动
    handleMove(data) {
      this.isMove = data;
    },
    // 处理图片加载出错
    handleImgError() {
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
    },
    handleMounted() {
      this.subActive = 1;
      this.symbol = this.$route.params.symbol.toLowerCase();

      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';

      this.handleLoadHeardWs();
      this.handlaGetSymbolInfo();
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len)
      return price;
    },
    // 页面滚动位置
    listenScroll() {
      this.isScroll = document.scrollingElement.scrollTop / ((screen.width / 750) * 100);
    },
    // 计算涨跌幅
    handleChange(num, len) {
      const newNum = Decimal.mul(num, 100);
      return toFixed(newNum, len)
    },
    // 返回
    handleBackRoute() {
      const path = sessionStorage.getItem('backRoute');
      this.$router.push(path);
    },
    // 跳转到交易页面
    handleToTrade(type) {
      if (this.channelRef === 'h5') {
        this.showDialog = true;
        return;
      }
      const params = {
        symbol: this.symbol,
        activeType: type
      }
      this.$router.push({
        name: this.isEmbed ? 'tradeEmbed' : 'trade',
        params,
      });
    },
    // 显示盈亏统计弹窗
    handleShowPopup() {
      // 不支持跨链盈亏统计 - 关闭(旧)
      // if (this.symbolInfo.baseChain !== this.symbolInfo.valuationChain) {
      //   this.unsupported = true;
      //   return;
      // }
      // 不支持侧链盈亏统计 - 新
      if (this.symbolInfo.baseChain !== 'eos' || this.symbolInfo.valuationChain !== 'eos') {
        this.unsupported = true;
        return;
      }

      // 不支持侧链盈亏统计 - 新
      if (this.symbolInfo.symbol2 === 'CUSD' || this.symbolInfo.symbol2 === 'EUSD') {
        this.unsupported = true;
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleShowPopup()
        })
        return;
      }
      this.chooseItem = {
        id: this.symbolId,
        symbol1: this.symbol1,
        symbol2: this.symbol2,
        balance: toFixed(0, this.symbolInfo.coinDecimal),
      }
      this.showPopupToChandeHold = true;
      this.handleGetProfitById();
    },
    // 获取用户当前币种盈亏统计信息
    handleGetProfitById() {
      const params = {
        symbolId: this.symbolId,
      }
      this.$http.get('/exchangeAccountProfit/queryAccountProfitBySymbolId', { params }).then((res) => {
        if (res.code === 401) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleGetList();
            });
          }, 1000);
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const info = res.accountProfitVo;
        const chainArr = res.accountProfitVo.chain.split('-');
        const obj = dealSymbolSplit(res.accountProfitVo.symbol, chainArr[0], this.symbolInfo.symbol1_code);
        this.$set(info, 'contract', obj.contract); // 合约号
        this.$set(info, 'symbol1', obj.symbol1);
        this.$set(info, 'symbol2', obj.symbol2);
        this.$set(info, 'coinImgUrl', obj.coinUrl);
        this.chooseItem = info;
      });
    },
    // 跳转到行情提醒设置页面
    handleToSetMarket() {
      if (this.channelRef === 'h5') {
        this.showDialog = true;
        return;
      }
      this.$router.push({
        name: 'setMarketTip',
        params: {
          symbol: this.$route.params.symbol.toLowerCase()
        }
      });
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },
    // 获取头部信息
    handleLoadHeardWs() {
      const params = {
        symbol: this.symbol,
      };
      Io.cfwsHeard(params, (data) => {
        this.symbolData = data;
        if (data.precision) {
          const item = data;
          if (item.symbol === 'eos_usdt' && item.id === 505) {
            item.precision.coin = 4;
          }
          this.precision = item.precision;
        }
      });
    },
    // 获取行情提醒列表
    handleGetMArketTipList() {
      try {
        if (this.channelRef === 'h5') {
          return;
        }
        const params = {
          symbolId: this.symbolId,
        }
        if (this.$store.state.app.accountInfo.account) {
          this.$http.post('/account/queryMarketRemindRecord', params).then((res) => {
            if (res.code === 1007) {
              this.$emit('listenHasList', true);
              this.marketRemindRecordList = [];
              return;
            }
            if (res.code !== 0) {
              this.$toast({
                message: res.msg,
                position: 'center',
                duration: 2000,
              });
              return;
            }
            if (res.marketRemindRecordList.length > 0) {
              this.hasMarket = true;
              return
            }
            this.hasMarket = false;
          });
        }
      } catch (error) {
        setTimeout(() => {
          this.handleGetMArketTipList()
        }, 200);
      }
    },
    // 获取交易对信息
    handlaGetSymbolInfo() {
      const param = {
        // symbolId: this.symbolId,
        symbol: this.symbol,
      };
      this.$http.post('/symbol/getSymbolInfo', param).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.website = res.coinInfo.website;

        const info = res.symbolInfo;
        this.symbolId = info.id;
        const obj = dealSymbolSplit(info.symbol, res.coinInfo.chain, info.bidContract, info.askContract, this.$embed)

        // 交易对
        // if (obj.symbol1 === 'eos' && (obj.symbol2 === 'zig' || obj.symbol2 === 'usde' || obj.symbol2 === 'eosdt')) {
        //   this.website = res.valuationCoinInfo.website;
        // }
        // ob
        if (obj.symbol1 === 'eos' || obj.symbol1 === 'ebtc' || obj.symbol1 === 'eeth') {
          this.website = res.valuationCoinInfo.website;
        }

        this.coinImgUrl = obj.coinUrl;
        // 存储该交易对是否为聚合交易
        let aggConfigs = {};
        if (res.aggConfigs && res.aggConfigs.length > 0) {
          res.aggConfigs.forEach(v => {
            if (v.channel === 1 && v.enabled && v.pairId) {
              aggConfigs.Defibox = v;
            }
            if (v.channel === 2 && v.enabled && v.pairId) {
              aggConfigs.Defis = v;
            }
          })
        }
        if (Object.keys(aggConfigs).length === 0) {
          aggConfigs = null;
        }
        this.symbolInfo = {
          id: this.symbolId,
          riskStatus: res.coinInfo.riskStatus,
          symbol1: obj.symbol1.toUpperCase(), // eg: iq
          symbol2: obj.symbol2.toUpperCase(), // eg: eos
          symbol1_code: info.askContract, // eg: iqcontract
          symbol2_code: info.bidContract, // eg: eosio.token
          coinDecimal: res.coinInfo.coinDecimal,
          priceDecimal: res.coinInfo.priceDecimal,
          valuationCoinDecimal: info.valuationCoinDecimal,
          baseChain: info.baseChain, // 基础币种所属链
          valuationChain: info.valuationChain, // 计价币所属链
          status: info.status, // 交易对上架状态
          openTime: info.openTime, // 交易对开放时间
          onChain: info.onChain, // 是否智能合约交易
          dexContract: info.dexEntrustedAccount, // 交易所合约地址
          chain: res.coinInfo.chain,
          symbol: res.symbolInfo.symbol,
          timer: new Date().getTime(),
          aggConfigs,
        }
        this.$store.dispatch('setTrad', this.symbolInfo).then(() => {
          this.symbolInfoLoaded = true;
        });
        // 获取活动信息
        this.promotionsInfoVo = res.promotionsInfoVo;
        this.handleGetMArketTipList();
        // 补充跨链图标
        this.showChain = this.symbolInfo.baseChain !== this.symbolInfo.valuationChain;
        const symbolSplit = dealSymbolSplit(this.symbol, this.symbolInfo.chian, this.symbolInfo.symbol1_code);
        this.contract = symbolSplit.contract;
        this.symbol1 = symbolSplit.symbol1.toUpperCase();
        this.symbol2 = symbolSplit.symbol2.toUpperCase();
        this.handleDealSymbol();
      });
    },
    handleSelected(type) {
      switch (type) {
        // 显示盈亏统计弹窗
        case 0:
          this.handleShowPopup()
          break;
        // 跳转到行情提醒设置页面
        case 1:
          this.handleToSetMarket()
          break;
        // 官网
        case 2:
          this.handleToWebsite()
          break;
        default:
          break;
      }
      // console.log(val, 'handleSelected');
    },
    // 关闭切换币种
    handleClose() {
      this.changeSymbol = false;
      this.tipShow = false;
      this.showPopupToChandeHold = false;
      this.unsupported = false;
      this.isMarkValue = false;
      this.chargingChange = false;
    },
    // 跨链充提选择
    handleChargingChange() {
      this.chargingChange = true;
    },
    // 跳转ptoken
    handleToPtoken() {
      if (this.symbolInfo.symbol1 === 'PBTC') {
        jumpPtokenSwap();
        return;
      }
      if (this.$store.state.app.language === 'zh-CN') {
        window.location.href = `https://ptoken.340wan.com/${this.symbolInfo.symbol1.toLowerCase()}-on-eos/issue-redeem`;
      } else {
        window.location.href = `https://dapp.ptokens.io/${this.symbolInfo.symbol1.toLowerCase()}-on-eos/issue-redeem`;
      }
    },
    handleShowWithdraw() {
      this.WithdrawDialogVisible = true;
    },
    // 兑换 usdt
    handleToUsdt() {
      jumpUsdt();
    },
  },
  beforeDestroy() {
    Io.cfwsUnsubscribe(`ticker.${this.symbol}`);
    document.removeEventListener('scroll', this.listenScroll, false)
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  // .market{
  //   height: calc(100vh - 1.5rem) !important;
  // }

  .btnDiv{
    padding-bottom: .5rem !important;
  }
}

.circulationDiv{
  padding: .36rem;
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}

.dialog{
  padding: .61rem 0rem;

  .tip{
    line-height: .45rem;
  }
}


.linek{
  position: relative;

  &.isMove{
    height: 100vh;
    overflow: hidden;
  }

  .height{
    position: relative;
    z-index: 1000;
    background: #fff;
  }

  .noneDiv{
    height: 1rem;
  }

  .tools{
    font-size: .36rem;
    padding: 0rem .25rem 0px 0px;
    background: #FFF;
    height: 1rem;
    position: absolute;
    width: calc(100% - .25rem);
    max-width: 750px;

    &.boxShadow{
      box-shadow: 0px 5px 5px rgba(75, 75, 75, 0.10);
    }

    &.fixed{
      position: fixed;
      width: calc(100% - .25rem);
      z-index: 1050;
      max-width: 750px;
      top: 0px;
    }

    .pdleft{
      padding-left: .25rem;
      height: 1rem;

    }

    &>div{
      display: flex;
      align-items: center;/*垂直居中*/
    }

    .backRoute{
      font-size: .36rem;
      text-align: center;
      width: .8rem;
      transform: rotate(180deg);

      &::before{
        position: relative;
        top: 2px;
      }
    }

    .symbol{
      display: flex;
      align-items: center;/*垂直居中*/
      position: relative;
      height: 1.15rem;;

      &>span:first-child{
        display: inline-block;
        height: .6rem;
      }

      .coinImg{
        width: .6rem;
        margin-right: .1rem;
      }

      .contract{
        font-size: .25rem;
        color: $color-999;
        margin-top: -.1rem;
      }
      // 跨链
      .chain{
        position: absolute;
        top: 50%;
        right: -5px;
        width: 17px;
        height: 17px;
        transform: translate(110%, -55%);
        background: url('/static/img/market/chain.png') no-repeat;
        background-size: 100% 100%;
        background-position: center center;

        .note{
          position: absolute;
          padding: .05rem .35rem;
          left: 50%;
          transform: translate(-50%, 0);
          top: .45rem;
          background: #F3f3f3;
          color: $color-333;
          font-size: .21rem;
          white-space:nowrap;
          border-radius: .0314rem;

          &::before{
            content: '';
            position: absolute;
            border: .06rem solid #F3f3f3;
            top: -.06rem;
            left: 50%;
            transform: translate(-50%, 0) rotate(45deg);
          }
        }
      }

      .changeSymbol{
        font-size: .25rem;
        transform: rotate(90deg);
        margin-left: .1rem;
      }
    }

    .icon{
      font-size: .38rem;
    }

    .favourites{
      flex: 1;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .activity{
        width: .4rem;
        margin-right: .2rem;
      }
      .website{
        font-size: .36rem;
        margin-left: .35rem;
      }
      .mr0{
        margin-right: 0px !important;
      }
      .resource{
        width: 0.56rem;
        height: 0.56rem;
        line-height: 0.56rem;
        text-align: center;
        color: $color-red;
        font-size: 0.18rem;
        border-radius: 50%;
        border: 0.02rem solid #EA573C;
        margin-right: 0.36rem;
      }
    }
  }

  // 交易对信息
  .coinInfo{
    padding: 0px .24rem;
    overflow: hidden;
    font-size: 13px;
    padding-bottom: .1rem;
    background: #fff;

    .fr{
      text-align: right;
    }

    .rate{
      margin-left: .25rem;
    }

    .price{
      font-size: .56rem;
      font-weight: bold;
      display: flex;
      align-items: center;/*垂直居中*/

      .icon{
        font-size: .37rem;
        font-weight: normal;
        margin-left: .1rem;
      }
    }

    .tip{
      display: inline-block;
      text-align: right;
      color: $color-999;
      padding-right: .08rem;

      .switch{
        font-size: 10px;
      }
    }
  }

  // K线
  .mainLine{
    position: relative;
    height: 8.2rem;
    background-color: #fff;

    .modelDiv{
      position: absolute;
      width: 1.2rem;
      height: calc(100% - 1.5rem);
      background: transparent;
      right: 0px;
      bottom: 0px;
    }

    .modelDivLeft{
      position: absolute;
      width: 1rem;
      height: calc(100% - .5rem);
      background: transparent;
      left: 0px;
      bottom: 0px;
    }

    .modelDivBottom{
      position: absolute;
      width: 100%;
      height: 2rem;
      background: transparent;
      left: 0px;
      bottom: 0px;
    }
  }

  // subTools
  .subTools{
    font-size: .25rem;

    .subTools-item{
      position: relative;
      color: $color-999;
      display: flex;
      align-items: center;/*垂直居中*/
      background: #f0f0f0;
      height: .7rem;

      &.fiexd{
        position: fixed;
        top: 1rem;
        width: 100%;
        z-index: 1000;
        box-shadow: 0px 5px 5px rgba(75, 75, 75, 0.10);
      }

      &>div{
        padding: 0px .15rem;
      }

      .color-yellow{
        position: absolute;
        margin-right: 0px;
        right: .2rem;
      }

      .active{
        color: $color-333;
        font-weight: bold;
      }
    }

    .subTools-detail{
      background: #fff;
    }
  }

  .btnDiv{
    font-size: .32rem;
    text-align: center;
    position: fixed;
    box-sizing: border-box;
    padding: .2rem .25rem;
    bottom: 0px;
    width: 100%;
    max-width: 750px;
    background: #FFF;
    z-index: 10;
    box-shadow: 0px -0.01rem .05rem rgba(75, 75, 75, 0.10);
    display: flex;
    align-items: center;

    &>div{
      flex: 6;
      margin-right: .14rem;

      &:last-child{
        margin-right: 0rem;
      }

      &:nth-child(3),
      &:nth-child(4){
        flex: 2;
        margin-right: 0rem;
        font-size: .18rem;

        .marketIconOff{
          font-size: .3rem;
          // color: #F6C85C;
          color: $color-this;
        }

        .newpool{
          font-size: .33rem;
          color: #FF910D;
        }
        .danchor{
          color: rgb(254, 183, 94);
          font-size: .33rem;
        }
        .usdsImg{
          display: inline-block;
          width: .40rem;
          img{
            display: block;
            width: 100%;
          }
        }
        .newpoolNote{
          margin-top: .05rem;
          font-size: 0.2rem;
          color: #333;
        }

        .marketTip{
          margin-top: .06rem;
        }
      }
    }

    .btn{
      width: 100%;
      line-height: .8rem;
      height: .8rem;
      border-radius: .07rem;
      font-size: .32rem;
      color: white;
    }
  }
}
.popup{
  background: transparent;
}
.popupTip{
  background: #FFF;
}
.position{
  position: relative;
}
.icon-usdt {
  width: .35rem;
}
</style>
