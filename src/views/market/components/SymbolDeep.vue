<template>
  <div>
    <!-- 深度图 start -->
    <div v-if="subActive === 2">
      <high-charts-depth :depth-data="depthData" :subActive="subActive"/>
    </div>
    <!-- 深度图 end -->

    <!-- 深度列表 start -->
    <div class="list" v-show="subActive === 1">
      <List :depth-data="depthData"/>
    </div>
    <!-- 深度列表 end -->
  </div>
</template>

<script>
import Io from '@/utils/socket/index';
import Defi from '@/utils/defi/deep';
import HighChartsDepth from '@/components/highCharts/HighChartsDepth';
import List from './List';

export default {
  data() {
    return {
      depthData: {
        asks: [],  // eslint-disable-line
        bids: [], // eslint-disable-line
        timesatep: 0,
      },
      symbol: '',
      priceDepthBids: [], // 买入深度
      priceDepthAsks: [], // 卖出深度
      aggTimer: null, // 聚合交易定时器
    }
  },
  props: [
    'subActive', 'symbolInfo'
  ],
  watch: {
    '$store.state.app.trad': function change() {
      this.handleMounted();
    }
  },
  components: {
    List,
    HighChartsDepth
  },
  created() {
    // this.handleMounted();
  },
  mounted() {
  },
  beforeDestroy() {
    this.aggTimer && window.clearTimeout(this.aggTimer);
    Io.cfwsUnsubscribe(`depth.${this.symbol}:${this.symbolInfo.priceDecimal}`);
  },
  methods: {
    handleMounted() {
      this.symbol = this.$route.params.symbol.toLowerCase();
      this.handlePriceDepthWs();
    },
    // 获取深度数据
    handlePriceDepthWs() {
      this.priceDepthBids = []; // 买入深度
      this.priceDepthAsks = []; // 卖出深度
      this.depthData.asks = [];
      this.depthData.bids = [];
      Io.cfwsUnsubscribe(`depth.${this.symbol}:${this.symbolInfo.priceDecimal}`);
      const params = {
        symbol: `${this.symbol}:${this.$store.state.app.trad.priceDecimal}`,
      };
      Io.cfwsDepth(params, (res) => {
        this.handleDepthWsForMat(JSON.parse(res));
      });
    },
    async handleDepthWsForMat(data) {
      if (data.full === 1) { // 全量 - 直接赋值
        await this.handleDepthFull(data);
      } else { // 增量 - 判断增量变化
        await this.handleDepthAdd(data)
      }

      // 是否为Defi 深度整合交易对
      if (this.symbolInfo.aggConfigs) {
        this.aggTimer && window.clearTimeout(this.aggTimer);
        await this.handleGetAggByTimer();
      } else {
        this.depthData.asks = JSON.stringify(this.priceDepthAsks);
        this.depthData.bids = JSON.stringify(this.priceDepthBids);
        this.depthData.timesatep = new Date().getTime();
      }
    },
    // 聚合数据定时获取
    async handleGetAggByTimer() {
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
        depthMergeNumber: this.symbolInfo.priceDecimal, // 深度合并位
        slip: Defibox.slippage || Defis.slippage, // 滑点
        symbol: this.symbolInfo.symbol // 交易对
      });
      this.depthData.asks = JSON.stringify(defiInfo.asks);
      this.depthData.bids = JSON.stringify(defiInfo.bids);
      this.depthData.timesatep = new Date().getTime();
      this.aggTimer && window.clearTimeout(this.aggTimer);
      this.aggTimer = window.setTimeout(this.handleGetAggByTimer, 3000);
    },
    // 买卖盘全量数据处理
    handleDepthFull(data) {
      this.priceDepthBids = []; // 买入深度
      this.priceDepthAsks = []; // 卖出深度
      const itemBids = [];
      const itemAsks = [];
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
          itemAsks.push(item);
        })
      }
      this.priceDepthAsks = itemAsks

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
          itemBids.push(item);
        })
        this.priceDepthBids = itemBids;
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
  }
}
</script>

<style scoped lang="scss">

.deepImg{
  min-height: 6.2rem;
  box-sizing: border-box;
  margin-bottom: .5rem;
  // padding: .32rem .27rem;
}
</style>
