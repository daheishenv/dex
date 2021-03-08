<template>
  <div class="tradeRight">
    <!-- 卖盘列表 -->
    <div class="listHead color-999">
      <span class="listHeadPrice">
        <span>{{ $t('public.price') }}</span>
        <span class="deepSelectDiv" @click.stop="select = !select">
          <span class="deepSelect">
            <span>
              {{ handleDecimalShow() }} <span
              v-if="deepSelect >= 0">{{ $t('trade.decimal') }}</span><span
              v-if="deepSelect === -1">{{ $t('trade.integer10') }}</span><span
              v-if="deepSelect === -2">{{ $t('trade.integer100') }}</span><span
              v-if="deepSelect === -3">{{ $t('trade.integer1000') }}</span>
            </span>
          </span>
          <i class="icon"></i>

          <!-- 深度选择框 start -->
          <div class="selectMenu" v-if="select">
            <div class="select color-333">
              <div v-for="(i, $index) in 4" :key="$index" :value="$store.state.app.trad.priceDecimal - $index"
                @click="handleCheckedDeep($store.state.app.trad.priceDecimal - $index)">
                {{ handleDecimal($index) }} <span
                  v-if="($store.state.app.trad.priceDecimal - $index) >= 0">{{ $t('trade.decimal') }}</span><span
                  v-if="($store.state.app.trad.priceDecimal - $index) === -1">{{ $t('trade.integer10') }}</span><span
                  v-if="($store.state.app.trad.priceDecimal - $index) === -2">{{ $t('trade.integer100') }}</span><span
                  v-if="($store.state.app.trad.priceDecimal - $index) === -3">{{ $t('trade.integer1000') }}</span>
              </div>
            </div>
          </div>
          <!-- 深度选择框 end -->
        </span>
      </span>
      <span class="fr mr5">{{ $t('trade.count') }}</span>
    </div>
    <div class="list" @scroll="handleScroll" id="asks">
      <template v-for="(item, $index) in data.asks">
        <div class="listContent" :key="$index"
        v-if="$index >= data.asks.length - 50"
        @click="handleClickPrice($index, 0)"
          @touchstart="handleTouchstart(item)"
          @dblclick="handledoubleClick(item)"
          @touchend="handleTouchend()">
          <div class="listData">
            <span class="color-red" :class="{'sellSpan': item.anchors}">{{ item.price }}</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num <= 100000">{{ item.num }}</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num > 100000 && item.num < 100000000">{{ toFixed(item.num / 1000, 1) }}K</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num >= 100000000">{{ toFixed(item.num / 1000, 1) }}K</span>
          </div>
          <div class="bgColor" :style="`width: ${handleBgWidth(item.num, sellCount)}%`"></div>
        </div>
      </template>
    </div>

    <!-- 最新价 -->
    <div class="newPriceDiv">
      <div class="newPrice" :class="{'color-green': symbolData.change > 0,'color-red': symbolData.change < 0}">
        {{ toFixed(symbolData.price, symbolData.precision.price) }}
        <span class="iconfont icon-huaban39 icon" v-if="symbolData.change > 0"></span>
        <span class="iconfont icon-huaban40 icon" v-if="symbolData.change < 0"></span>
      </div>
      <div class="rate">
        <span v-if="$store.state.app.language === 'zh-CN'">
          <span>¥
            {{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbolObj.symbol2.toLowerCase()], symbolData.precision.price) }}
          </span>
        </span>
        <span v-if="$store.state.app.language !== 'zh-CN'">
          <span>
            ${{ handleRate(symbolData.price, $store.state.app.exchangeRate[symbolObj.symbol2.toLowerCase()], symbolData.precision.price) }}
          </span>
        </span>
      </div>
    </div>

    <!-- 买盘列表 -->
    <div class="list" @scroll="handleScroll" id="bids">
      <template v-for="(item, $index) in data.bids">
        <div class="listContent" :key="$index"
          v-if="$index <= 50"
          @click="handleClickPrice($index, 1)"
          @touchstart="handleTouchstart(item)"
          @dblclick="handledoubleClick(item)"
          @touchend="handleTouchend()">
          <div class="listData">
            <span class="color-green" :class="{'buySpan': item.anchors}">{{ item.price }}</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num < 100000">{{ item.num }}</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num >= 100000 && item.num < 100000000">{{ toFixed(item.num / 1000, 1) }}K</span>
            <span class="fr mr5 color-999 numWidth" v-if="item.num >= 100000000">{{ toFixed(item.num / 1000, 1) }}K</span>
          </div>
          <div class="bgColor bgColorBuy" :style="`width: ${handleBgWidth(item.num, buyCount)}%`"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// JS
// import { Decimal } from 'decimal.js';
import Io from '@/utils/socket/index';
import Defi from '@/utils/defi/deep';
import { toFixed, toFixedResetDapp, toFixedDownDapp, createComparison, dealSymbolSplit, symbolRate } from '@/utils/public';
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      symbol: 'contranct-iq-eos',
      symbolObj: {
        contract: '',
        symbol1: 'iq',
        symbol2: 'eos'
      },
      wsData: { // ws 原数据
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      data: { // 交易深度
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      buyCount: 0,
      sellCount: 0,
      first: true,

      longClickTimer: null, // 长按
      deepSelect: 4,
      select: false, // 展示深度选择框
      priceDepthBids: [], // 买入深度
      priceDepthAsks: [], // 卖出深度
      bidsScroll: false, // 买盘滚动
      asksScroll: false, // 卖盘滚动
      prices: null,
      aggTimer: null, // 聚合交易定时器
      aggPriceOneLoad: true, // 聚合交易首个价格赋值一次
    }
  },
  props: [
    'newPrice',
    'symbolData',
    'symbolInfo'
  ],
  components: {
  },
  watch: {
    // 交易对信息改变
    '$store.state.app.trad': function listen() {
      this.priceDepthBids = []; // 买入深度
      this.priceDepthAsks = []; // 卖出深度
      // this.handleWsData(this.wsData);
      this.handleMouted();
      setTimeout(() => {
        document.getElementsByClassName('list')[0].scrollTop = 10000;
        document.getElementsByClassName('list')[1].scrollTop = 0;
      }, 100);
    },
    // 路由交易对信息改变
    // '$route.params.symbol': function listen(newVal) {
    //   if (!newVal) {
    //     return
    //   }
    //   Io.cfwsUnsubscribe(`depth.${this.symbol.toLowerCase()}:${this.deepSelect}`);
    //   this.handleMouted();
    // },
    // 当前委托订单列表
    '$store.state.app.symbolOrderListData': {
      handler: function listen() {
        this.handleAnchors();
      },
      deep: true,
    },
    symbolData() {
      this.$forceUpdate();
    }
  },
  created() {
  },
  mounted() {
    // this.handleMouted(); // 数据重置 & 加载
    document.addEventListener('click', this.listenClick, false); // 全局监听深度合并下拉框关闭事件
  },
  beforeDestroy() {
    Io.cfwsUnsubscribe(`depth.${this.symbol.toLowerCase()}:${this.deepSelect}`);
    this.aggTimer && window.clearTimeout(this.aggTimer);
    document.removeEventListener('click', this.listenClick, false)
    // vuex保存订单薄长度 - 重制
    const bookLength = {
      ask: 0,
      bid: 0,
      t: Math.random(),
    }
    this.$store.dispatch('setBookLength', bookLength);
  },
  methods: {
    // vue挂载时调用
    handleMouted() {
      this.symbol = this.$route.params.symbol.toLowerCase(); // 获取路由交易对信息
      this.symbolObj = dealSymbolSplit(this.symbol);
      this.deepSelect = this.$store.state.app.trad.priceDecimal; // 获取trad交易深度 - trad异步加载
      this.handlePriceDepthWs(); // 获取深度列表
    },

    // 返回几位小数 | 几位整数
    handleDecimal(index) {
      const num = this.$store.state.app.trad.priceDecimal - index;
      if (num >= 0) {
        return num;
      }
      return '';
    },

    // 选择框展示
    handleDecimalShow() {
      if (this.deepSelect >= 0) {
        return this.deepSelect;
      }
      return '';
    },

    // 监听click事件 - 关闭深度筛选
    listenClick() {
      if (this.select) {
        this.select = !this.select;
      }
    },

    // 选择深度
    handleCheckedDeep(deep) {
      this.priceDepthBids = []; // 买入深度
      this.priceDepthAsks = []; // 卖出深度
      this.deepSelect = deep;
      this.handlePriceDepthWs();
    },

    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len)
      return price;
    },

    // 截取小数
    toFixed(numb, p) {
      if (numb && p) {
        return toFixed(numb, p);
      }
      return toFixed(numb, 4);
    },

    // 获取深度数据
    handlePriceDepthWs() {
      Io.cfwsUnsubscribe(`depth.${this.symbol.toLowerCase()}:${this.deepSelect}`);
      const params = {
        symbol: `${this.symbol.toLowerCase()}:${this.deepSelect}`,
      };
      Io.cfwsDepth(params, (data) => {
        this.handleDepthWsForMat(JSON.parse(data));
      });
    },
    async handleDepthWsForMat(data) {
      if (data.full === 1) { // 全量 - 直接赋值
        this.handleDepthFull(data);
      } else { // 增量 - 判断增量变化
        this.handleDepthAdd(data)
      }
      const depthData = {};


      // 是否为Defi 深度整合交易对
      if (this.symbolInfo.aggConfigs) {
        this.aggTimer && window.clearTimeout(this.aggTimer);
        await this.handleGetAggByTimer(depthData);
      } else {
        depthData.asks = this.priceDepthAsks;
        depthData.bids = this.priceDepthBids;

        this.wsData = depthData;
        this.handleWsData(this.wsData);
        // vuex保存订单薄长度
        const bookLength = {
          ask: this.priceDepthAsks.length,
          bid: this.priceDepthBids.length,
          t: Math.random(),
        }
        this.$store.dispatch('setBookLength', bookLength);

        if (this.first) {
          setTimeout(() => {
            document.getElementsByClassName('list')[0].scrollTop = 10000;
          }, 100);
        }
      }
      // if (!this.bidsScroll) {
      //   setTimeout(() => {
      //     if (!document.getElementsByClassName('list')[1]) {
      //       return;
      //     }
      //     document.getElementsByClassName('list')[1].scrollTop = 0;
      //   }, 100);
      // }
      // if (!this.asksScroll) {
      //   setTimeout(() => {
      //     if (!document.getElementsByClassName('list')[0]) {
      //       return;
      //     }
      //     document.getElementsByClassName('list')[0].scrollTop = 10000;
      //   }, 100);
      // }
    },

    // 聚合数据定时获取
    async handleGetAggByTimer(depthData) {
      console.log('-----get into agg------'); // eslint-disable-line
      const Defibox = this.symbolInfo.aggConfigs.Defibox || {};
      const Defis = this.symbolInfo.aggConfigs.Defis || {};
      let asks = JSON.stringify(this.priceDepthAsks);
      let bids = JSON.stringify(this.priceDepthBids);
      const defiInfo = await Defi.init({
        boxPairId: Defibox && Defibox.enabled ? Defibox.pairId : null,
        dfsPairId: Defis && Defis.enabled ? Defis.pairId : null,
        depthData: { // ws 深度数据
          asks: JSON.parse(asks),
          bids: JSON.parse(bids)
        },
        priceDecimal: this.symbolInfo.priceDecimal, // 价格精度
        depthMergeNumber: this.deepSelect, // 深度合并位
        slip: Defibox.slippage || Defis.slippage, // 滑点
        symbol: this.symbolInfo.symbol // 交易对
      });
      depthData.asks = defiInfo.asks;
      depthData.bids = defiInfo.bids;
      this.aggTimer && window.clearTimeout(this.aggTimer);
      this.aggTimer = window.setTimeout(() => {
        this.handleGetAggByTimer(depthData)
      }, 3000);


      if (this.aggPriceOneLoad) {
        this.aggPriceOneLoad = false;
        // 价格赋值
        this.$emit('listenTradeRight', 'priceGet', {
          sell: depthData.bids[depthData.bids.length - 1].price,
          buy: depthData.asks[0].price
        })
      }

      // 数据处理
      this.wsData = depthData;
      this.handleWsData(this.wsData);
      // vuex保存订单薄长度
      const bookLength = {
        ask: this.priceDepthAsks.length,
        bid: this.priceDepthBids.length,
        t: Math.random(),
      }
      this.$store.dispatch('setBookLength', bookLength);

      if (this.first) {
        setTimeout(() => {
          document.getElementsByClassName('list')[0].scrollTop = 10000;
        }, 100);
      }
    },

    // 买卖盘全量数据处理
    handleDepthFull(data) {
      this.priceDepthBids = []; // 买入深度
      this.priceDepthAsks = []; // 卖出深度
      // 卖出深度
      if (data && data.asks && data.asks.length) {
        data.asks.forEach((v) => {
          const vv = v.split(':');
          const price = Number(vv[0]);
          const num = Number(vv[1]);
          const amount = Number(vv[2]);
          const item = {
            price,
            num,
            checked: false,
            amount,
          }
          this.priceDepthAsks.push(item);
        })
      }

      // 买入深度
      if (data && data.bids && data.bids.length) {
        data.bids.forEach((v) => {
          const vv = v.split(':');
          const price = Number(vv[0]);
          const num = Number(vv[1]);
          const amount = Number(vv[2]);
          const item = {
            price,
            num,
            checked: false,
            amount,
          }
          this.priceDepthBids.push(item);
        })
      }
    },

    // 买卖盘增量配置方法
    handleDepthAdd(data) {
      if (data && data.asks && data.asks.length) {
        data.asks.forEach((v) => {
          const vv = v.split(':');
          const price = Number(vv[0]);
          const num = Number(vv[1]);
          const amount = Number(vv[2]);
          if (num === 0) { // 所有撤单
            const rmIndex = this.priceDepthAsks.findIndex(val => Number(val.price) === Number(price));
            if (rmIndex !== -1) {
              this.priceDepthAsks.splice(rmIndex, 1);
            }
          } else {
            const item = {
              price,
              num,
              checked: false,
              amount,
            }
            const pindex = this.priceDepthAsks.findIndex(val => Number(val.price) === Number(price));
            if (pindex !== -1) {
              // 价格存在
              this.$set(this.priceDepthAsks, pindex, item);
            } else {
              this.priceDepthAsks.push(item);
            }
          }
        });
      }

      // 买入深度
      if (data && data.bids && data.bids.length) {
        data.bids.forEach((v) => {
          const vv = v.split(':');
          const price = Number(vv[0]);
          const num = Number(vv[1]);
          const amount = Number(vv[2]);
          if (num === 0) { // 所有撤单
            const rmIndex = this.priceDepthBids.findIndex(val => Number(val.price) === Number(price));
            if (rmIndex !== -1) {
              this.priceDepthBids.splice(rmIndex, 1);
            }
          } else {
            const item = {
              price,
              num,
              checked: false,
              amount,
            }
            const pindex = this.priceDepthBids.findIndex(val => Number(val.price) === Number(price));
            if (pindex !== -1) {
              // 价格存在
              this.$set(this.priceDepthBids, pindex, item);
            } else {
              this.priceDepthBids.push(item);
            }
          }
        });
      }
    },

    // 处理数据 - 精度
    handleWsData(data) {
      this.sellCount = 0;
      data.asks.forEach((v) => {
        const vv = v;
        vv.price = toFixed(Number(vv.price), this.deepSelect);
        vv.num = toFixed(Number(vv.num), this.$store.state.app.trad.coinDecimal);
        if (this.sellCount < Number(vv.num)) {
          this.sellCount = Number(vv.num);
        }
      });
      this.data.asks = data.asks;
      this.data.asks.sort(createComparison('price'));
      this.data.asks.reverse();

      // 买入数据
      this.buyCount = 0;
      data.bids.forEach((v) => {
        const vv = v;
        vv.price = toFixed(Number(vv.price), this.deepSelect);
        vv.num = toFixed(Number(vv.num), this.$store.state.app.trad.coinDecimal);
        if (this.buyCount < Number(vv.num)) {
          this.buyCount = Number(vv.num);
        }
      });
      this.data.bids = data.bids;
      this.data.bids.sort(createComparison('price'));
      this.data.bids.reverse();

      this.$forceUpdate(); // 强制更新

      // 处理锚点
      // this.handleAnchors();
      this.handleRegPrices()
    },

    // 优先处理本地锚点数据
    handleRegPrices() {
      if (!this.prices) {
        this.handleAnchors();
        return;
      }
      this.handleDealPrice(this.prices)
    },
    handleDealPrice(res) {
      // 买盘锚点处理
      this.data.bids.forEach((list) => {
        this.$set(list, 'anchors', false);
        let has = false;
        const bidAnchoredPrices = res.bidAnchoredPrices;
        bidAnchoredPrices.forEach((item) => {
          const buyPrice = toFixedDownDapp(item, this.deepSelect);
          if (toFixed(Number(list.price), this.deepSelect) === buyPrice) {
            has = true;
          }
        });
        if (has) {
          this.$set(list, 'anchors', true);
        }
      });
      // 卖盘锚点处理
      this.data.asks.forEach((list) => {
        this.$set(list, 'anchors', false);
        let has = false;
        const askAnchoredPrices = res.askAnchoredPrices;
        askAnchoredPrices.forEach((item) => {
          const sellPrice = toFixedResetDapp(item, this.deepSelect);
          if (toFixed(Number(list.price), this.deepSelect) === sellPrice) {
            has = true;
          }
        });
        if (has) {
          this.$set(list, 'anchors', true);
        }
      });
      this.$forceUpdate();
    },

    // 获取用户订单锚点 - 处理锚点
    handleAnchors() {
      try {
        const params = {
          symbolId: this.$store.state.app.trad.id,
        }
        this.$http.get('/order/getAnchoredPrices', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.prices = res;
          this.handleDealPrice(res)
        })
      } catch (error) {
        setTimeout(() => {
          this.handleAnchors();
        }, 200);
      }
    },

    // 交易量背景色
    handleBgWidth(num, count) {
      // console.log(count, (num / count) * 100)
      return (num / Number(count)) * 100;
    },
    // 价格点击 type: 0 - 卖盘 | 1 - 买盘
    handleClickPrice(index, type) {
      let num = 0;
      let clickData = null;
      if (type === 0) {
        clickData = this.data.asks[index];
        this.data.asks.forEach((item, $index) => {
          if ($index >= index) {
            num = Decimal.add(Number(item.num), Number(num)).toString()
          }
        });
      } else {
        clickData = this.data.bids[index];
        this.data.bids.forEach((item, $index) => {
          if ($index <= index) {
            num = Decimal.add(Number(item.num), Number(num)).toString()
          }
        });
      }
      const params = {
        price: clickData.price,
        num,
      }
      this.$store.dispatch('setClickPrice', params);
    },
    // 价格数量 - 长按start
    handleTouchstart(item) {
      this.longClickTimer = window.setTimeout(() => {
        const params = {
          price: item.price,
          num: item.num
        }
        this.$store.dispatch('setClickPrice', params);
      }, 1000);
    },
    // 价格数量 - 长按end
    handleTouchend() {
      window.clearTimeout(this.longClickTimer);
    },
    // 双击事件
    handledoubleClick(item) {
      const params = {
        price: item.price,
        num: item.num
      }
      this.$store.dispatch('setClickPrice', params);
    },
    // 获取滚动事件
    handleScroll(e) {
      if (this.first) {
        this.first = false;
        return;
      }
      if (e.target.id === 'bids') {
        this.bidsScroll = true;
      } else {
        this.asksScroll = true;
      }
      setTimeout(() => {
        this.bidsScroll = false;
        this.asksScroll = false;
      }, 2000);
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.mr5{
  margin-right: .09rem;
}

.tradeRight{
  position: relative;
  font-size: .25rem;
  padding-bottom: .2rem;

  .listHead{
    line-height: .6rem;
    height: .6rem;;
    padding-left: .15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .listHeadPrice{
      display: flex;
      align-items: center;
    }

    .deepSelectDiv{
      position: relative;
      margin-left: .05rem;
      display: flex;
      align-items: center;

      .deepSelect{
        font-size: .21rem;
        display: inline-block;
        background: transparent;
        color: $color-999;
        height: .45rem;
        max-width: 1.7rem;
        box-sizing: border-box;
        line-height: .45rem;
        border: 1px solid $color-input;
        border-radius: .08rem;
        padding: .0rem .3rem .0rem .1rem;

        &>span{
          display: inline-block;
          width: 100%;
          white-space:nowrap;
          overflow: hidden;
        }
      }

      .icon{
        border: .12rem solid $color-999;
        border-bottom: .12rem solid transparent;
        border-left: .07rem solid transparent;
        border-right: .07rem solid transparent;
        position: absolute;
        right: .1rem;
        top: 50%;
        transform: translate(0px, -25%);
      }

      .selectMenu{
        background: white;
        box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
        min-width: 2.04rem;
        position: absolute;
        left: -.3rem;
        top: .65rem;
        border-radius: .13rem;
        padding: 0rem .1rem;
        text-align: center;
        box-sizing: border-box;
        z-index: 10;
        margin-top: .1rem;

        &::after{
          content: '';
          border: .1rem solid white;
          position: absolute;
          top: -.1rem;
          left: 50%;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          transform: translate(-50%, 0) rotate(45deg);
        }

        .select{
          position: relative;
          z-index: 11;;
          background: #FFF;
          font-size: .25rem;

          &>div{
            line-height: .86rem;
            height: .86rem;
            width: 100%;
            white-space:nowrap;
            overflow: hidden;
            border-bottom: 1px solid $color-e3e3e3;

            &:last-child{
              border-bottom: 0px solid $color-e3e3e3;
            }
          }
        }
      }
    }
  }

  .list{
    position: relative;
    max-height: 3.1rem;
    overflow: auto;

    .listContent{
      position: relative;
      height: .44rem;
      line-height: .44rem;
      margin: .1rem 0 .1rem .15rem;

      &:first-child{
        margin-top: 0px;
      }

      &:last-child{
        margin-bottom: 0px;
      }

      &:active{
        background: rgba(0, 0, 0, .1);
      }

      .listData{
        display: flex;
        align-items: center;/*垂直居中*/
        justify-content: space-between;/*水平居中*/

        &>span:first-child::before{
          content: '';
          display: inline-block;
          position: absolute;
          top: 50%;
          left: -0.15rem;
          transform: translate(0px, -62%);
          border: .08rem solid transparent;
        }

        &>.buySpan::before{
          border-left: .08rem solid $color-green !important;
        }

        &>.sellSpan::before{
          border-left: .08rem solid $color-red !important;
        }
      }

      .numWidth{
        // max-width: 1.5rem;
        overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }

      .bgColor{
        position: absolute;
        height: .44rem;
        width: 50%;
        background: $color-sell;
        top: 0px;
        right: 0px;
        border-radius: .03rem;
      }

      .bgColorBuy{
        background: $color-buy;
      }
    }
  }

  .newPriceDiv{
    border-top: 1px solid $color-input;
    border-bottom: 1px solid $color-input;
    height: .8rem;
    position: relative;
    margin: .21rem 0rem;
  }

  .newPrice{
    line-height: .6rem;
    font-size: .3rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/

    .icon{
      font-size: .24rem;
    }
  }

  .rate{
    font-size: .25rem;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $color-999;
  }
}
</style>
