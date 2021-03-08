<template>
  <div class="listsDiv">
    <div class="tipTop">
      <span class="buy">
        <span class="color-green">{{ $t('public.buyShort') }}</span>
        <span>{{ $t('lineK.num') }}({{ $store.state.app.trad.symbol1 }})</span>
      </span>
      <span class="price">
        {{ $t('public.price') }}({{ $store.state.app.trad.symbol2 }})
      </span>
      <span class="sell">
        <span>{{ $t('lineK.num') }}({{ $store.state.app.trad.symbol1 }})</span>
        <span class="color-red">{{ $t('public.sellShort') }}</span>
      </span>
    </div>
    <!-- 委托列表 start -->
    <div class="lineDeep">
      <div class="list item">

        <!-- 买入 start -->
        <template v-for="(item, $index) in data.bids">
          <div class="listContent buy"
              :key="$index"
              v-if="data.bids.length && $index <= 50">
            <span class="count color-333"
                  :class="{'buySpan': item.anchors}">
              <!-- <label class="num color-999">{{ ($index + 1) }}</label> -->
              <label class=""
                    v-if="item.num < lessNum">{{ item.num }}</label>
              <label class=""
                    v-if="item.num >= lessNum">{{ toFixed(item.num / 1000, 2) }}K</label>
            </span>
            <span class="price color-green">{{ item.price }}</span>
            <div class="bgColor bgColorBuy"
                :style="`width: ${handleBgWidth(item.num, buyCount)}%`"></div>
          </div>
        </template>
        <div class="listContent buy"
             v-if="!data.bids.length">
          <div class="noData">{{ $t('public.noData') }}</div>
        </div>
        <!-- 买入 end -->

      </div>

      <div class="list item">

        <!-- 卖出 start -->
        <template v-for="(item, $index) in data.asks">
          <div class="listContent sell"
              :key="$index"
              v-if="data.asks.length && $index <= 50">
            <span class="color-red price">{{ item.price }}</span>
            <span class="count color-333"
                  :class="{'sellSpan': item.anchors}">
              <label class=""
                    v-if="item.num >= lessNum">{{ toFixed(item.num / 1000, 2) }}K</label>
              <label class=""
                    v-if="item.num < lessNum">{{ item.num }}</label>
              <!-- <label class="num color-999">{{ ($index + 1) }}</label> -->
            </span>
            <div class="bgColor"
                :style="`width: ${handleBgWidth(item.num, sellCount)}%`"></div>
          </div>
        </template>
        <div class="listContent sell"
             v-if="!data.asks.length">
          <div class="noData">{{ $t('public.noData') }}</div>
        </div>
        <!-- 卖出 end -->

      </div>
    </div>
    <!-- 委托列表 end -->
  </div>
</template>

<script>
// JS
import Io from '@/utils/socket/index';
import { toFixed, getFullNum, createComparison, dealSymbolSplit } from '@/utils/public';

export default {
  data() {
    return {
      symbol: 'iq_eos',
      data: { // 交易深度
        asks: [], // 卖盘深度
        bids: [], // 买盘深度
      },
      symbolInfo: { // 交易对信息
      },
      buyCount: 0,
      sellCount: 0,

      lessNum: 100000,
      prices: null,
    }
  },
  components: {
  },
  props: {
    depthData: Object,
  },
  watch: {
    // '$store.state.app.trad.timer': function change() {
    //   this.symbolInfo = this.$store.state.app.trad;
    //   this.handleWsData();
    // },
    '$route.params.symbol': function listen(newVal, oldVal) {
      Io.cfwsUnsubscribe(`depth.${oldVal}`);
      this.handleMounted();
    },
    'depthData.timesatep': function listen() {
      this.symbolInfo = this.$store.state.app.trad;
      this.handleWsData();
    },
    '$store.state.app.symbolOrderListData': {
      handler: function listen() {
        this.handleAnchors();
      },
      deep: true,
    },
    '$store.state.app.accountMsg': function listen2(newVal, oldVal) {
      if (newVal.times !== oldVal.times) {
        this.handleAnchors();
      }
    },
  },
  created() {
  },
  mounted() {
    this.handleMounted();
  },
  methods: {
    handleMounted() {
      this.symbol = this.$route.params.symbol;
      this.symbolInfo = this.$store.state.app.trad;
      this.handleGetOrderList();
    },

    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },

    // 查询订单记录列表信息
    handleGetOrderList(page) {
      try {
        this.symbol = this.$route.params.symbol;
        this.loading = true;
        const params = {
          currPage: page || 1, // 当前页码
          pageSize: 100, // 每页数量
          orderByName: '', // 排序字段
          orderByType: '', // 排序方式(asc, desc)
          accountNo: this.$store.state.app.accountInfo.account, // 账户名
          symbol: this.symbol, // 交易对
        };
        this.$http.post('/order/queryCurrentOrderPage', params).then((res) => {
          this.loading = false;
          if (res.code !== 0) {
            // this.$toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
            return;
          }
          const list = res.page.list;
          list.forEach((item) => {
            const obj = dealSymbolSplit(item.symbol);
            this.$set(item, 'symbol1', obj.symbol1);
            this.$set(item, 'symbol2', obj.symbol2);
          });

          if (res.page.list.length < params.pageSize) {
            this.allLoaded = true;
          } else {
            this.allLoaded = false;
          }
          this.$store.dispatch('setSymbolOrderListData', list);
        });
      } catch (error) {
        if (localStorage.getItem('channelRef') === 'h5') {
          return;
        }
        setTimeout(() => {
          this.handleGetOrderList();
        }, 500);
      }
    },

    // 处理数据 - wsDepth
    handleWsData() {
      const wsdata = this.depthData || {};
      const asks = JSON.parse(wsdata.asks);
      const bids = JSON.parse(wsdata.bids);
      // 卖出数据
      this.sellCount = 0;
      asks.forEach((v) => {
        const vv = v;
        vv.price = toFixed(getFullNum(Number(vv.price)), this.symbolInfo.priceDecimal);
        vv.num = toFixed(getFullNum(Number(vv.num)), this.symbolInfo.coinDecimal);
        if (this.sellCount < Number(vv.num)) {
          this.sellCount = Number(vv.num);
        }
      });
      this.data.asks = asks;
      this.data.asks.sort(createComparison('price'));

      // 买入数据
      this.buyCount = 0;
      bids.forEach((v) => {
        const vv = v;
        vv.price = toFixed(getFullNum(Number(vv.price)), this.symbolInfo.priceDecimal);
        vv.num = toFixed(getFullNum(Number(vv.num)), this.symbolInfo.coinDecimal);
        if (this.buyCount < Number(vv.num)) {
          this.buyCount = Number(vv.num);
        }
      });
      this.data.bids = bids;
      this.data.bids.sort(createComparison('price'));
      this.data.bids.reverse();
      // 处理锚点
      // this.handleAnchors();
      this.handleRegPrices();
    },

    // 交易量背景色
    handleBgWidth(num, count) {
      return (num / count) * 100;
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
          if (Number(list.price) === Number(item)) {
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
          if (Number(list.price) === Number(item)) {
            has = true;
          }
        });
        if (has) {
          this.$set(list, 'anchors', true);
        }
      });
    },
    // 获取用户订单锚点 - 处理锚点
    handleAnchors() {
      try {
        if (!this.$store.state.app.accountInfo.account) {
          return;
        }
        const obj = dealSymbolSplit(this.symbol);
        const trad = this.$store.state.app.trad;
        if (!(obj.symbol1.toLowerCase() === trad.symbol1.toLowerCase() &&
          obj.symbol2.toLowerCase() === trad.symbol2.toLowerCase())) {
          return
        }
        const params = {
          symbolId: this.$store.state.app.trad.id,
        }
        this.$http.get('/order/getAnchoredPrices', { params }).then((res) => {
          if (res.code !== 0) {
            this.$toast({
              message: res.msg,
              position: 'center',
              duration: 2000,
            });
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
  },
  beforeDestroy() {
    // Io.cfwsUnsubscribe(`depth.${this.symbol}`);
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .listsDiv {
    padding-bottom: 0.6rem;
  }
}

.mr5 {
  margin-right: 0.05rem;
}

.tipTop {
  margin: 0px 0.24rem;
  background: #fff;
  height: 0.5rem;
  line-height: 0.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $color-999;
  border-bottom: 1px solid $color-e3e3e3;

  .sell {
    text-align: right;
    // padding-left: .1rem;
  }

  .price {
    text-align: center;
  }
}

.lineDeep {
  display: flex;
  padding: 0px 0.24rem;

  .item {
    flex: 1;
  }
}

.list {
  .listContent {
    display: flex;
    position: relative;
    justify-content: space-between;
    height: 0.43rem;
    line-height: 0.43rem;
    font-size: 13px;
    margin: 0.1rem 0;

    .noData {
      text-align: center;
      color: $color-999;
      width: 100%;
    }

    .num {
      width: 0.2rem;
      display: inline-block;
    }

    .bgColor {
      position: absolute;
      height: 0.43rem;
      width: 50%;
      background: $color-sell;
      top: 0px;
      right: 0px;
      z-index: 0;
      // border-radius: 0.07rem;
    }

    .bgColorBuy {
      background: $color-buy;
    }

    & > .buySpan::before {
      border-left: 5px solid $color-green !important;
    }

    & > .sellSpan::after {
      content: "";
      display: inline-block;
      border: 5px solid transparent;
      border-right: 5px solid $color-red !important;
    }

    // 买入
    &.buy {
      // margin-right: 0.06rem;
      & > span {
        flex: 2;
        z-index: 1;

        &.price {
          text-align: right;
          padding-right: 0.1rem;
          flex: 1;
        }

        &.count {
          text-align: left;
          padding-right: 0.13rem;
        }

        &.count::before {
          content: "";
          display: inline-block;
          position: absolute;
          top: 50%;
          left: -7px;
          transform: translate(0px, -65%);
          border: 4px solid transparent;
        }
      }
    }

    // 卖出
    &.sell {
      // margin-left: 0.06rem;
      & > span {
        flex: 1;
        z-index: 1;

        &.price {
          text-align: left;
          padding-left: 0.1rem;
        }

        &.count {
          text-align: right;
          flex: 2;
        }

        &.count::after {
          content: "";
          display: inline-block;
          border: 4px solid transparent;
          position: absolute;
          top: 50%;
          right: -7px;
          transform: translate(0px, -65%);
        }
      }

      .bgColor {
        left: 0px;
      }
    }
  }
}
</style>
