<template>
  <div class="trade">
    <!-- coin & 收藏 -->
    <div class="tools">
      <div class="symbol" @click="handleChangeSymbol">
        <img class="coinImg" :src="coinImgUrl" @error="handleImgError"
        :onerror="errorCoinImg" alt="">
        <div class="contractDiv">
          <div class="symbolAndMore">
            <span class="position">
              <span>{{symbol1}}/{{symbol2}}</span>
              <span class="chain" v-if="showChain" @click.stop="handleShowChainTip">
                <div class="note" v-if="showChainTip">{{ $t('quotation.acrossChain') }}</div>
              </span>
            </span>
            <span v-if="!$embed" class="iconfont icon-huaban37 changeSymbol"></span>
          </div>
          <!-- 波产界面不显示地址 -->
          <div class="contract" v-if="$appName === 'eosNewdex'">{{ contract }}</div>
        </div>
      </div>
      <div class="favorate">
        <div v-if="$appName === 'eosNewdex'">
          <Cpu v-if="this.$store.state.app.channel !== 'mykey'" :class="{'mr0': $embed}"/>
        </div>
        <div v-else-if="$appName === 'tronNewdex'">
          <ResourceTron />
        </div>
        <!-- ede钱包刷新按钮 -->
        <Refresh />

        <!-- 活动 start -->
        <!-- <img v-if="promotionsInfoVo && promotionsInfoVo.promotionCodes && promotionsInfoVo.promotionCodes.length > 0"
          @click="$router.push(`/events/${promotionsInfoVo.promotionCodes[0]}`)"
          class="activity" src="https://nds.340wan.com/static/img/activity/christmas2018/page.png" alt=""> -->

        <!-- 收藏 start -->
        <span class="iconfont icon-huaban29 icon fr" v-if="!isFavorite && !$embed" @click="handleSelfAdd"></span>
        <span class="iconfont icon-huaban30 icon fr color-this" v-if="isFavorite && !$embed" @click="handleSelfCancel"></span>

        <!-- K线 start -->
        <span class="iconfont icon-huaban47 icon fr ml36" @click="handleToLineK"></span>

      </div>
    </div>

    <!-- 活动入口 start -->
    <EventsEntrance v-if="promotionsInfoVo && promotionsInfoVo.promotionCodes && promotionsInfoVo.promotionCodes.length > 0"
      :promotionsInfoVo="promotionsInfoVo"
      @listenMove="handleMove" />
    <!-- 活动入口 end -->

    <!-- mainContent -->
    <div class="tradeContent">
      <TradeLeft :symbolInfo="symbolInfo"
        :precision="precision"
        :priceDefault="priceDefault"
        :statusInfo="statusInfo"
        :newPrice="toFixed(newPrice, precision.price)"
        @listenUpdateSymbolInfo="handleUpdateSymbolInfo"
        class="item"/>
      <TradeRight :symbolInfo="symbolInfo"
        :symbolData="symbolData"
        :newPrice="toFixed(newPrice, precision.price)"
        @listenTradeRight="listenTradeRight"
        class="item"/>
    </div>

    <!-- order -->
    <div class="orderContent">
      <div class="chooseType">
        <span class="type" @click="type = 1" :class="{'active': type === 1}">{{ $t('quotation.nowList') }}</span>
        <span class="type" @click="type = 2" :class="{'active': type === 2}">{{ $t('quotation.oldList') }}</span>
        <!-- <span class="fr color-yellow" @click="tipShow = true">
          <span class="iconfont icon-huaban32" style="font-size: .25rem;"></span>
          <span>{{ $t('public.tip') }}</span>
        </span> -->
        <span class="fr color-this cancelAll" v-if="$store.state.app.symbolOrderListData.length >= 2 && type === 1">
          <!-- <span class="iconfont icon-huaban59" style="font-size: .25rem;"></span> -->
          <Loading class="btnLoading" v-if="revokeAllLoading"/>
          <span v-if="$appName === 'eosNewdex'" @click="handleRegServer">{{ $t('quotation.cancelAll') }}</span>
        </span>
        <!-- 显示聚合订单 -->
        <!-- $store.state.app.symbolOrderListData.length >= 2 &&  -->
        <!-- type === 1 && symbolInfo.aggConfigs -->
        <span class="fr orderStatus notSeeCancel color-999"
           v-if="type === 1 && $appName==='eosNewdex'"
           @click="queryAgg = !queryAgg">
          <span class="iconfont choice" :class="{'icon-huaban57': queryAgg}"></span>
          <span>{{$t('marketDistribution.aggOrder')}}</span>
        </span>
      </div>
      <div class="typeList">
        <order-list-now v-show="type === 1"
          :symbol="symbol"
          :statusInfo="statusInfo"
          :revokeAllLoading="revokeAllLoading"
          :queryAgg="queryAgg"/>
        <order-list-history v-if="type === 2" :symbol="symbol" :aggConfigs="symbolInfo.aggConfigs"/>
      </div>
    </div>

    <!-- 切换交易对 -->
    <mt-popup
      v-model="changeSymbol"
      position="left">
        <change-symbol v-show="changeSymbol" @listenClose="handleClose" />
    </mt-popup>

    <!-- 温馨提示 -->
    <mt-popup
      class="popup"
      v-model="tipShow">
        <newdex-tip v-if="tipShow" @listenClose="handleClose" />
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="popup"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 撤单提示 -->
    <mt-popup
      v-model="showCancelChoose"
      class="popup"
      popup-transition="popup-fade">
      <cancel-order v-if="showCancelChoose" :all="'all'"
        @listenClose="handleClose" @listenSureCancel="handleSureCancel"/>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
import Io from '@/utils/socket/index';
import { Popup } from 'mint-ui';
import DApp from '@/utils/wallet';
import { toFixed, dealSymbolSplit, getReqUrl } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import RequestApi from '@/utils/requestApi';
import OrderListHistory from '@/components/OrderListHistory';
import OrderListNow from '@/components/OrderListNow';
import ServerStop from '@/components/ServerStop';
import Loading from '@/components/Loading'
import CancelOrder from '@/components/CancelOrder'
import TradeLeft from '../components/TradeLeft';
import TradeRight from '../components/TradeRight';
import ChangeSymbol from '../components/ChangeSymbol';
import NewdexTip from '../components/NewdexTip';
import Cpu from '../components/Cpu';
import ResourceTron from '../components/ResourceTron'
import EventsEntrance from '../components/EventsEntrance';
import Refresh from '../popup/Refresh';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      changeSymbol: false, // 切换交易对
      tipShow: false, // 提示
      type: 1, // 订单类型  1:当前委托  2:历史委托

      symbol: 'iq_eos',
      symbol1: 'IQ',
      symbol2: 'EOS',
      contract: '',
      symbolData: { // 交易对数据
        amount: 0,
        change: 0,
        close: 0,
        count: 0,
        high: 0,
        low: 0,
        open: 0,
        price: 0,
        volume: null,
        precision: {
          coin: 4,
          price: 4
        }
      },
      symbolInfo: { // 交易对信息
      },
      precision: {
        coin: 4,
        price: 4
      },
      newPrice: 0,

      priceDefault: { // 挂单价
        buy: '0.0000',
        sell: '0.0000'
      },
      isFavorite: false, // 是否收藏
      statusInfo: { // 交易对上架状态
        status: 0,
      },
      symbolId: '',
      serverStop: false,
      coinImgUrl: '',
      promotionsInfoVo: null, // 活动信息
      showChain: false, // 显示跨链图标
      showChainTip: false,
      chainTipTimer: false,
      revokeAllLoading: false,
      showCancelChoose: false, // 显示撤单弹窗
      useFreeCpu: false,
      queryAgg: false, // 是否聚合
    }
  },
  props: [
  ],
  components: {
    OrderListHistory,
    OrderListNow,
    TradeLeft,
    TradeRight,
    ChangeSymbol,
    NewdexTip,
    ServerStop,
    Cpu,
    EventsEntrance,
    ResourceTron,
    Refresh,
    Loading,
    CancelOrder,
    mtPopup: Popup,
  },
  watch: {
    '$route.params.symbol': function listen(newVal) {
      if (!newVal) {
        return
      }
      this.handleUnsubscribeWs();
      this.handleMouted();
    },
    symbolId() {
      this.handleGetSymbolStatus();
    },
    '$store.state.app.symbolOrderListData': {
      handler: function listenOrder() {
        this.revokeAllLoading = false;
      },
      deep: true
    },
    // 'symbolInfo.aggConfigs': {
    //   handler: function listen(val) {
    //     if (val) {
    //       this.queryAgg = true;
    //     } else {
    //       this.queryAgg = false;
    //     }
    //   },
    //   deep: true
    // },
  },
  created() {
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleChangeSymbol() {
      if (this.$embed) {
        return;
      }
      this.changeSymbol = true;
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
    // 倒计时结束 - 获取交易对状态
    handleUpdateSymbolInfo() {
      this.handlaGetSymbolInfo();
      this.handleGetSymbolStatus();
    },
    // 是否拖动
    handleMove(data) {
      const appDiv = document.getElementById('app');
      if (data) {
        appDiv.style.height = '100vh';
        appDiv.style.overflow = 'hidden';
        return;
      }
      appDiv.style.height = '';
      appDiv.style.overflow = '';
    },
    // 处理图片加载出错
    handleImgError() {
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
    },
    handleMouted() {
      this.symbolInfo = this.$store.state.app.trad;
      this.precision = this.$store.state.app.precision;
      this.symbol = this.$route.params.symbol.toLowerCase();
      const obj = dealSymbolSplit(this.symbol, this.symbolInfo.chian, this.symbolInfo.symbol1_code)
      this.contract = obj.contract.toLowerCase();
      this.symbol1 = obj.symbol1.toUpperCase();
      this.symbol2 = obj.symbol2.toUpperCase();
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';

      this.handlaGetSymbolInfo();
      this.handleLoadHeardWs();
      // 绑定账号
      // Io.accountBind(this.$store.state.app.accountInfo.account);
    },
    // 跳转k线
    handleToLineK() {
      sessionStorage.setItem('backRoute', this.$route.path);
      const params = {
        symbol: this.symbol,
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 关闭切换币种
    handleClose() {
      this.changeSymbol = false;
      this.tipShow = false;
      this.serverStop = false;
      this.showCancelChoose = false;
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p || 4);
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
          if (this.precision.coin !== item.precision.coin || this.precision.price !== item.precision.price
           || this.precision.valuationCoin !== this.precision.valuationCoin) {
             this.precision = item.precision;
          }
          this.newPrice = item.price;
        }
      });
    },
    // 获取交易对上架信息
    handleGetSymbolStatus() {
      const params = {
        symbolId: this.symbolId,
      };
      this.$http.get('/symbol/getSymbolStatus', { params }).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.statusInfo = res.symbolStatus;
      });
    },
    // 获取交易对信息
    handlaGetSymbolInfo() {
      const params = {
        symbol: this.symbol,
      };
      this.$http.post('/symbol/getSymbolInfo', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const info = res.symbolInfo;
        const obj = dealSymbolSplit(this.symbol, res.coinInfo.chain, info.bidContract, info.askContract, this.$embed);
        this.coinImgUrl = obj.coinUrl;

        // this.statusInfo = res.symbolInfo;
        // 服务器暂停
        if (Number(res.exchangeStatus) === 0) {
          sessionStorage.setItem('serverStatus', false); // 服务暂停
          return;
        }
        sessionStorage.setItem('serverStatus', true); // 服务正常

        // 补充显示跨链图标
        this.showChain = info.baseChain !== info.valuationChain
        this.symbolId = info.id;
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
          symbol1: obj.symbol1.toUpperCase(),
          symbol2: obj.symbol2.toUpperCase(),
          symbol1_code: info.askContract,
          symbol2_code: info.bidContract,
          coinDecimal: res.coinInfo.coinDecimal,
          priceDecimal: res.coinInfo.priceDecimal,
          riskStatus: res.coinInfo.riskStatus,
          valuationCoinDecimal: info.valuationCoinDecimal,
          id: info.id,
          baseChain: info.baseChain, // 基础币种所属链
          valuationChain: info.valuationChain, // 计价币所属链
          status: info.status, // 交易对上架状态
          openTime: info.openTime, // 交易对开放时间
          onChain: info.onChain, // 是否智能合约交易
          dexContract: info.dexEntrustedAccount, // 交易所合约地址
          chain: res.coinInfo.chain,
          symbol: res.symbolInfo.symbol,
          aggConfigs,
          timer: new Date().getTime(),
        }
        this.$store.dispatch('setTrad', this.symbolInfo);
        // 获取活动状态
        this.promotionsInfoVo = res.promotionsInfoVo;

        this.precision = {
          coin: res.coinInfo.coinDecimal,
          price: res.coinInfo.priceDecimal
        };

        this.priceDefault = {
          buy: info.bidPrice,
          sell: info.askPrice,
        }

        // 查询收藏列表
        this.handleGetSelf();
      });
    },
    // 订单簿首位价格获取
    listenTradeRight(key, value) {
      if (key === 'priceGet') {
        this.priceDefault = value;
      }
    },
    /* -------- 交易对收藏 start -------- */
    // 添加收藏
    handleSelfAdd() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson(() => {
          this.handleSelfCancel();
        });
        return;
      }
      this.isFavorite = true;
      const params = {
        symbolIds: this.symbolId,
        type: 1
      };
      this.$http.post('/account/favoriteSymbol', params).then((res) => {
        if (res.code === 401) {
          this.isFavorite = false;
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          this.isFavorite = false;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        // this.$toast({
        //   message: '操作成功',
        //   position: 'center',
        //   duration: 2000,
        // });
        this.isFavorite = true;
      });
    },
    // 取消收藏
    handleSelfCancel() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson((() => {
          this.handleSelfCancel()
        }));
        return;
      }
      this.isFavorite = false;
      const params = {
        symbolIds: this.symbolId,
        type: 0
      };
      this.$http.post('/account/favoriteSymbol', params).then((res) => {
        if (res.code === 401) {
          this.isFavorite = true;
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          this.isFavorite = true;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.isFavorite = false;
      });
    },
    // 获取收藏列表
    handleGetSelf() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account,
        };
        this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
          if (res.code !== 0) {
            // this.$toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
            return;
          }
          // 设置用户是否有自选
          localStorage.setItem('hasFavorite', false);
          if (res.symbolList.length > 0) {
            localStorage.setItem('hasFavorite', true);
          }
          const symbolIdsArr = res.symbolList;
          const thisFacorite = symbolIdsArr.find(item => item.symbolId === this.symbolId);
          if (thisFacorite) {
            this.isFavorite = true;
            return;
          }
          this.isFavorite = false;
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetSelf();
        }, 200);
      }
    },
    // 验证权限及服务器状态
    handleRegServer() {
      if (this.$store.state.app.trad.onChain !== 1) {
        const token = localStorage.getItem('token');
        if (!token) {
          this.handleGetTimestampJson((() => {
            this.handleCancelAll()
          }));
          return;
        }
      }
      this.showCancelChoose = true;
    },
    // 确认取消订单
    handleSureCancel(statusFreeCpu) {
      this.useFreeCpu = statusFreeCpu;
      this.revokeAllLoading = true;
      this.showCancelChoose = false;
      RequestApi.commonParam((res) => {
        if (res.code !== 0) {
          this.revokeAllLoading = false;
          return;
        }
        // 服务暂停，提示用户
        if (!Number(res.exchangeStatus)) {
          this.serverStop = true;
          this.revokeAllLoading = false;
          return;
        }
        this.handleCancelAll();
      })
    },
    // 调用免CPU撤单确认
    handleUseFreeCpuPost(signedTx) {
      let url = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT2}/cpu/pushTxWithoutCPU`;
      if (this.$evn !== 'test') {
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
        if (res.data.code === 500) {
          this.$toast(res.data.message);
          return;
        }
        if (!res.data || res.data.code !== 200) {
          this.revokeAllLoading = false;
          this.$toast(this.$t('error.revokeError'))
          return;
        }
        this.$toast(this.$t('order.revokeSuccess'))
      }).catch((error) => {
        DApp.handleScatterErrorBack(error, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        console.log(error); // eslint-disable-line
      })
    },
    // 全部撤销 - symbolId
    async handleCancelAll() {
      // 合约撤单
      if (this.$store.state.app.trad.onChain === 1) {
        const chain = this.$store.state.app.accountInfo.chain;
        const account = this.$store.state.sys.toAccountList[`chain-${chain}`];
        const obj = {
          actionsAccount: account,
          orderId: 0, // (string)订单id 如果是全部撤单为0
          symbolId: this.$store.state.app.trad.id,
          chain,
          useFreeCpu: this.useFreeCpu
        }
        const fromName = this.$store.state.app.accountInfo.account;
        const permission = this.$store.state.app.accountInfo.permissions;
        const params = {
          actions: [{
            account: obj.actionsAccount, // 合约账户
            name: 'cancelpair', // 撤单方法
            authorization: [{
              actor: fromName, // 撤单账户
              permission, // 权限可选（active, owen）
            }],
            data: {
              owner: fromName, // 权限（active, owen）
              pair_id: obj.symbolId, // (string)交易对ID
              // auth_type: 1,
            }
          }]
        }
        const transferParams = {
          useFreeCpu: obj.useFreeCpu,
          params
        }
        const result = await DApp.transactionApi(transferParams);
        this.revokeAllLoading = false;
        // 错误信息
        if (result && result.code !== 0) {
          DApp.handleScatterErrorBack(result, (type, text) => {
            type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
          });
          return;
        }
        if (transferParams.useFreeCpu) { // 如果免CPU需要特殊处理结果
          if (result.code === 0) {
            this.handleUseFreeCpuPost(result.result);
          }
          return;
        }
        this.$toast(this.$t('order.revokeSuccess'))
        // DApp.revoke(params, (err, res) => {
        //   if (err) {
        //     this.revokeAllLoading = false;
        //     this.$toast(this.$t('error.revokeError'))
        //     return;
        //   }
        //   if (params.useFreeCpu) {
        //     // 免cpu撤单
        //     this.handleUseFreeCpuPost(res);
        //     return;
        //   }
        //   if (res) {
        //     this.$toast(this.$t('order.revokeSuccess'))
        //   }
        // });
        return;
      }

      // 接口撤单
      const params = {
        symbolId: this.$store.state.app.trad.id,
      }
      this.$http.post('/order/cancelAll', params).then((res) => {
        if (res.code !== 0) {
          this.revokeAllLoading = false;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$toast(res.msg);
      });
    },
    /* -------- 交易对收藏 end -------- */
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳 - callback: 保存签名验证完成后调用的方法
    handleGetTimestampJson(callback) {
      accountToSign(this, () => {
        callback();
      });
    },
    /* -------- 权限校验 end -------- */
    // 取消所有推送
    handleUnsubscribeWs() {
      Io.cfwsUnsubscribe(`ticker.${this.symbol}`);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'orderDetail' && to.name !== 'coinHistoryList') {
      // 停止ws && 网页数据重置
      this.handleUnsubscribeWs();
      Io.cfwsUnsubscribe(`depth.${this.symbol.toLowerCase()}`);
      this.type = 1;
    }
    next();
  },
  beforeDestroy() {
    this.handleUnsubscribeWs();
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popup{
  border-radius: .1rem;
}

.ml36{
  margin-left: .36rem;
}

.trade{
  font-size: .36rem;
  // padding: 0rem .25rem;
  background: #f0f0f0;
  color: $color-333;
  position: relative;
  width: 100%;
  // height: calc(100% - 1rem);
  // overflow: auto;
  // width: 100%;
  max-width: 750px;

  .tools{
    padding: 0rem .25rem;
    background: #FFF;
    height: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
          // 跨链
          .chain{
            width: 17px;
            height: 17px;
            margin-left: 0.1rem;
            background: url('/static/img/market/chain.png') no-repeat;
            background-size: 100% 100%;
            background-position: center center;
            position: relative;

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

      .mr0{
        margin-right: 0px !important;
      }
    }
  }

  .tradeContent{
    position: relative;
    display: flex;
    padding: 0.1rem .25rem;
    background: #FFF;

    .item{
      flex: 1;
      position: relative;

      &:nth-child(1){
        margin-right: .4rem;
        min-width: 3.1rem;
      }
      &:nth-child(2){
        min-width: 3rem;
      }
    }
  }

  .orderContent{
    // margin-top: .1rem;
    font-size: .25rem;

    .chooseType{
      padding: 0.15rem .25rem;
      color: $color-999;

      .active{
        color: $color-333;
        font-weight: bold;
      }

      .cancelAll{
        position: relative;

        .btnLoading{
          position: absolute;
          height: calc(100% + .2rem);;
          width: calc(100% + .2rem);
          right: -.1rem;
          top: -.1rem;
          z-index: 10;
          /deep/ .loading{
            font-size: .21rem !important;
          }
        }
      }
    }

    .type{
      margin-right: .5rem;
    }

    .typeList{
      // padding: .24rem .25rem;
      background: #FFF;
    }
  }
}
.position{
  position: relative;
  display: flex;
  align-items: center;
}
.notSeeCancel{
  display: flex;
  align-items: center;/*垂直居中*/
  margin-right: .2rem;

  .choice{
    border: 1px solid $color-input;
    display: inline-block;
    height: .3rem;
    width: .3rem;
    // font-size: .3rem;
    border-radius: .04rem;
    color: $color-this;
    margin-right: .09rem;
    background: #fff;
    vertical-align: middle;
    // margin-bottom: .03rem;

    &.icon-huaban57{
      // border: 1px solid transparent;
      border: none;
      margin-right: .12rem;
      margin-bottom: .05rem;
      font-size: .32rem;
    }
  }
}
</style>
