<template>
  <div class="marketDistribution">
    <div class="jycenter disbuCont" >
      <div class="flexc circular" style="margin: 0 auto;">
        <!-- v-if="isPieLoad" -->
        <pie-chart :pieChartData="pieChartData"></pie-chart>
      </div>
      <div class="distribution">
        <template v-for="(item, index) in Object.keys(ponds)">
          <div class="typeList" :key="index">
            <div class="flexb">
              <div class="coinLeft flex">
                <img :src="ponds[item].logo" alt="">
                <span>{{item}}</span>
                <!-- 占比 -->
                <span>{{$t('marketDistribution.radio')}}{{ponds[item].zb}}%</span>
                <span class="tag" :class="`tag${index+1}`"></span>
              </div>
            </div>
            <div class="proportion">
              <!-- 兑换价格 -->
              <span>{{$t('marketDistribution.price')}}</span>
              <span>1 {{ ponds[item].base.coin }} ≈ {{ponds[item].price}} {{ ponds[item].quote.coin }}</span>
            </div>
            <div class="depth">
              <!-- 流动池深度 -->
              <span>{{$t('marketDistribution.liquidityDepth')}}</span>
              <span>{{ponds[item].base.quantity}} / {{ponds[item].quote.quantity}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Defi from '@/utils/defi/deep'
import PieChart from '@/components/pieChart/Index';

export default {
  name: 'marketDistribution', // 市场分布
  data() {
    return {
      isPieLoad: true, // 饼图Loading
      ponds: {}, // 池子数据
      pieChartData: [],
      loading: false
    }
  },
  components: {
    PieChart, // 饼图
  },
  props: ['symbolInfo'],
  watch: {
  },
  computed: {},
  created() {
    // const Defibox = this.symbolInfo.aggConfigs.Defibox;
    // const Defis = this.symbolInfo.aggConfigs.Defis;
    // let ponds = await Defi.getPonds({
    //   boxPairId: Defibox && Defibox.enabled ? Defibox.pairId : null,
    //   dfsPairId: Defis && Defis.enabled ? Defis.pairId : null,
    // });
    this.handlerGetData();
  },
  mounted() {
  },
  beforeDestroy() {
    this.timer && window.clearTimeout(this.timer);
  },
  methods: {
    // 获取市场分布数据
    async handlerGetData() {
      if (this.loading) return;
      this.loading = true;
      if (this.symbolInfo.symbol !== this.$store.state.app.trad.symbol) {
        this.pieChartData = [];
        this.ponds = {};
      } else {
        const Defibox = this.symbolInfo.aggConfigs.Defibox || {};
        const Defis = this.symbolInfo.aggConfigs.Defis || {};
        let ponds = await Defi.getPonds({
          boxPairId: Defibox && Defibox.enabled ? Defibox.pairId : null,
          dfsPairId: Defis && Defis.enabled ? Defis.pairId : null,
          priceDecimal: this.symbolInfo.priceDecimal, // 价格精度
        });
        this.loading = false;
        this.ponds = ponds;
        if (this.ponds) {
          const items = [];
          Object.keys(this.ponds).forEach((v) => {
            items.push({
              accountType: v,
              name: v,
              value: this.ponds[v].zb
            })
          })
          this.pieChartData = items;
        }
      }
      this.timer && window.clearTimeout(this.timer);
      this.timer = window.setTimeout(this.handlerGetData, 3000);
    }
  },
}
</script>
<style lang="scss" scoped>
.marketDistribution {
  padding-bottom: .4rem;
  .jycenter {
    &.disbuCont {
      padding: 0 .36rem;
    }

    .circular {
      // width: 2rem;
      // height: 2.6rem;
    }
    .distribution {
      margin-top: .3rem;
      .typeList {
        position: relative;
        border-radius: .05rem;
        border: 1px solid #ECECEC;
        padding: .2rem;
        margin-bottom: .2rem;

        .tag {
          // position: absolute;
          // left: -20px;
          // top: 50%;
          width: 8px;
          height: 8px;
          background: #FFC789;
          border-radius: 50%;
          margin-left: .05rem;
          &.tag2 {
            background: #80CBBF;
          }
        }

        .coinLeft {
          img {
            display: block;
            width: .3rem;
            height: .3rem;
          }
          span:nth-child(2) {
            font-size: .27rem;
            color: #333;
            margin: 0 9px 0 5px;
          }
          span:nth-child(3) {
            font-size: .24rem;
            color: #999;
          }
        }
        .coinRight {
          color: #999;
          font-size: .24rem;
          span:nth-child(1) {
            margin-right: .1rem;
          }
          .greenColor {
            color: #67C269 !important;
          }
          .redColor {
            color: #EE1443 !important;
          }
        }
        .proportion {
          margin: 5px 0;

          span:nth-child(1) {
            color: #999;
            margin-right: 5px;
          }
          span:nth-child(2) {
            color: #333;
            margin-right: 5px;
          }
        }

        .depth {
          span:nth-child(1) {
            color: #999;
            margin-right: 5px;
          }
          span:nth-child(2) {
            color: #333;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>