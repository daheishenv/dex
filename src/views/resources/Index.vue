<template>
  <div class="linek" :class="{'isMove': isMove}">
    <!-- REX K线页面 -->
    <div class="height">
      <div class="tools" :class="{'fixed': channelRef === 'dapp',
        'boxShadow': isScroll !== 0 && channelRef === 'dapp',
        'boxShadow fixed': isScroll >= 1 && channelRef === 'h5',}">
        <div :class="{'pdleft': $store.state.app.channel !== 'meetone' || !isAndroid}">
          <span class="iconfont icon-huaban11 backRoute" v-if="$store.state.app.channel === 'meetone' && isAndroid" @click="handleBackRoute"></span>
          <span class="symbol">
            <span><img class="coinImg" :src="coinImgUrl" :onerror="errorCoinImg"
              @error="handleImgError" alt=""></span>
            <div>
              <div>{{symbol1}}</div>
              <div class="contract">{{ contract }}</div>
            </div>
          </span>
          <span class="favourites">
            <Cpu class="cpuCss" v-if="this.$store.state.app.channel !== 'mykey'"/>
            <span v-if="website" class="iconfont icon-huaban107 website" @click="handleToWebsite"></span>
          </span>
        </div>
      </div>
      <div class="noneDiv"></div>

      <div class="coinInfo" style="overflow:hidden">
        <div class="fl" :class="{'color-green': symbolData.change > 0,'color-red': symbolData.change < 0}">
          <div class="price">
            {{ toFixed(symbolData.price, 8) }}
            <span class="iconfont icon-huaban39 icon" v-if="symbolData.change > 0"></span>
            <span class="iconfont icon-huaban40 icon" v-if="symbolData.change < 0"></span>
          </div>
          <div>
            <span><span v-if="symbolData.change > 0">+</span>{{ handleChange(symbolData.change, 2) }}%</span>
            <!-- <span class="rate color-333" v-if="$store.state.app.language === 'zh-CN'">
              <span>¥{{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbol2.toLowerCase()] || 0, precision.price) }}</span>
            </span>
            <span class="rate color-333" v-if="$store.state.app.language !== 'zh-CN'">
              <span>${{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbol2.toLowerCase()] || 0, precision.price) }}</span>
            </span> -->
          </div>
        </div>
        <div class="fr">
          <div>
            <span class="tip">24H{{ $t('public.high') }}:</span>
            <!-- <span>{{ toFixed(symbolData.high, precision.price) }}</span> -->
            <span>{{ symbolData.high.toFixed(precision.price) }}</span>
          </div>
          <div>
            <span class="tip">24H{{ $t('public.low') }}:</span>
            <!-- <span>{{ toFixed(symbolData.low, precision.price) }}</span> -->
            <span>{{ symbolData.low.toFixed(precision.price) }}</span>
          </div>
          <div @click="isAmount = !isAmount">
            <span class="tip">
              <span class="iconfont icon-huaban106 switch"></span><span
                v-if="$store.state.app.language !== 'ko'">24H</span><span
              >{{ $t('quotation.num') }}:</span>
            </span>
            <span v-if="isAmount">
              <span v-if="symbolData.volume < 10000000">{{ Number(symbolData.volume).toFixed(4) }}</span>
              <span v-if="symbolData.volume >= 10000000">{{ Number(symbolData.volume).toFixed(0) }}</span>
            </span>
            <span v-else>
              <span v-if="symbolData.amount < 10000000">{{ Number(symbolData.amount).toFixed(precision.coin) }}{{ symbol2 }}</span>
              <span v-if="symbolData.amount >= 10000000">{{ Number(symbolData.amount).toFixed(0) }}{{ symbol2 }}</span>
            </span>
          </div>
      </div>
    </div>

    <!-- 主要内容 - K线 start -->
    <div class="mainLine">
      <trad-view :forwhat="forwhat" :symbolInfo="symbolData"/>
      <div class="modelDiv"></div>
      <div class="modelDivLeft"></div>
      <div class="modelDivBottom"></div>
    </div>
    <!-- 主要内容 - K线 end -->

    <!-- 委托订单 | 深度图 | 最新成交 | 简介 - start -->
    <div class="subTools">
      <div class="subTools-item" :class="{'fiexd boxShadow': channelRef === 'dapp' ? isScroll > 9.17 : isScroll > 10.17}">
        <!-- <div @click="subActive = 1" :class="{'active': subActive === 1}">{{ $t('lineK.newDeal') }}</div> -->
        <div @click="subActive = 2" :class="{'active': subActive === 2}">{{ $t('resources.data') }}</div>
        <div @click="subActive = 3" :class="{'active': subActive === 3}">{{ $t('lineK.detail') }}</div>
        <!-- 温馨提示 -->
        <span class="color-yellow" @click="tipShow = true">
          <span class="iconfont icon-huaban32" style="font-size: .25rem;"></span>
          <span>{{ $t('public.hint') }}</span>
        </span>
      </div>
      <div :class="{'subTools-item': channelRef === 'dapp' ? isScroll > 9.17 : isScroll > 10.17}"></div>
      <!-- 最新成交 -->
      <div class="subTools-detail" v-show="subActive === 1">
        <!-- <NewDeal /> -->
      </div>
      <!-- 数据 -->
      <div class="subTools-detail" v-show="subActive === 2">
        <RexData />
      </div>
      <!-- 简介 -->
      <div class="newDeal" v-show="subActive === 3">
        <RexInfo />
      </div>
    </div>
    <!-- 深度 | 最新成交 | 简介 - end -->

    <!-- btn -->
    <!-- 空div占位 -->
    <div style="height: 1.27rem"></div>
      <div class="btnDiv">
        <div><button class="btn bgcolor-green" @click="handleToTrade('buy')">{{ $t('public.buy') }}</button></div>
        <div><button class="btn bgcolor-red" @click="handleToTrade('sell')">{{ $t('public.sell') }}</button></div>
      </div>
    </div>

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
  </div>
</template>

<script>
// JS
import { Popup } from 'mint-ui';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
// Components
import NewdexTip from '@/views/market/components/NewdexTip';
import ToApp from '@/views/market/components/ToApp';
import Cpu from '@/views/market/components/Cpu';
import RexData from '@/views/resources/components/RexData'; // 数据
import RexInfo from '@/views/resources/components/RexInfo'; // 简介
import TradView from '@/components/tradeView/TradView';

export default {
  data() {
    return {
      forwhat: 'rex',
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      type: [
        'buy',
        'sell'
      ],
      showDialog: false,
      symbol: 'rex-eos',
      symbol1: 'REX',
      symbol2: 'EOS',
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
      precision: {
        coin: 4,
        price: 4
      },

      // subTools
      subActive: 2,
      isAndroid: false,

      // 页面滚动
      isScroll: 0,
      tipShow: false,
      coinImgUrl: '',
      channelRef: 'dapp',
      promotionsInfoVo: null, // 活动信息

      isMove: false, // 事都拖动活动入口
      hasMarket: false, // 交易对以创建提醒
      chooseItem: {},
      isAmount: true, // 显示成交量 true | false 显示成交额
      website: '',
    }
  },
  components: {
    NewdexTip,
    ToApp,
    Cpu,
    RexData, // 数据
    RexInfo, // 简介
    TradView,
    mtPopup: Popup,
  },
  props: [
  ],
  watch: {
    // ws列表数据更新
    '$store.state.app.allSymbolDataChange': function listen() {
      this.handleLoadHeardWs();
    },
  },
  created() {
    this.channelRef = localStorage.getItem('channelRef');
  },
  mounted() {
    this.handleMounted();
    this.isAndroid = JSON.parse(localStorage.getItem('isAndroid'));
    document.addEventListener('scroll', this.listenScroll, false);
  },
  methods: {
    handleToWebsite() {
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
      this.subActive = 2;
      this.coinImgUrl = 'https://nds.340wan.com/static/img/coin/EOS.png';

      this.handleLoadHeardWs();
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const newNum = Decimal.mul(num, rate).toString();
      let l = len || 4;
      if (newNum >= 0.1) {
        l = 2;
      } else if (len >= 4 && this.$store.state.app.language === 'zh-CN') {
        l = len - 2;
      } else if (len >= 4 && this.$store.state.app.language !== 'zh-CN') {
        l = len - 1;
      }
      const t = Decimal(`1e${l}`);
      let tNum = Decimal.mul(newNum, t);
      tNum = Decimal.round(tNum);
      tNum = Decimal.div(tNum, t);
      return toFixed(tNum, l);
    },
    // 页面滚动位置
    listenScroll() {
      this.isScroll = document.scrollingElement.scrollTop / ((screen.width / 750) * 100);
    },
    // 计算涨跌幅
    handleChange(num, len) {
      const newNum = Decimal.mul(num, 100);
      return Number(newNum).toFixed(len)
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
        name: 'resourceTradeRex',
        params,
      });
    },
    // 截取小数
    toFixed(numb, p) {
      if (numb && p) {
        return toFixed(numb, p);
      }
      return toFixed(numb, 4);
    },
    // 获取头部信息
    handleLoadHeardWs() {
      // 直接获取本地存储的ticker信息
      const resources = this.$store.state.app.allSymbolData.resources || [];
      const ticker = resources.findIndex(item => item.symbol === this.symbol);
      if (ticker !== -1) {
        this.symbolData = resources[ticker];
        this.precision = resources[ticker].precision;
      }
    },
    // 关闭切换币种
    handleClose() {
      this.tipShow = false;
    },
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.listenScroll, false)
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .btnDiv{
    padding-bottom: .5rem !important;
  }
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
      z-index: 999;
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

      .cpuCss{
        margin-right: 0px;
      }

      .activity{
        width: .4rem;
        margin-right: .2rem;
      }

      .website{
        font-size: .36rem;
        margin-left: .35rem;
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
      font-size: .5rem;
      font-weight: bold;
      display: flex;
      align-items: center;/*垂直居中*/
      margin-bottom: .06rem;

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
  top: 30%;
  transform: translate(-50%, -30%);
}
</style>
