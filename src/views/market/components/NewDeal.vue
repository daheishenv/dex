<template>
  <div class="newDeal">
    <div class="topTitle">
      <div class="listData">{{ $t('lineK.time') }}</div>
      <div>{{ $t('public.price') }}({{ symbol2 }})</div>
      <div class="num">
        <span class="fr mr50">{{ $t('lineK.num') }}({{ symbol1 }})</span>
      </div>
    </div>
    <div class="listData" v-for="(item, $index) in latestData" :key="$index" @click="handleShowDetail(item)">
      <div class="localTime">{{ toLocalTime(item.time * 1000).substr(5, 18) }}</div>
      <div :class="{'color-green': item.active_direction === 1,
        'color-red': item.active_direction === 2}">{{ toFixed(item.price, symbolInfo.priceDecimal) }}</div>
      <div class="num">
        <span class="fr mr50">{{ toFixed(item.amount, symbolInfo.coinDecimal) }}</span>
      </div>
    </div>
    <div class="noData">
      <span v-if="!loading && !latestData.length">{{ $t('public.noData')}}</span>
      <span v-if="loading">loading...</span>
    </div>
    <!-- 风险提示 -->
    <div v-if="$appName === 'eosNewdex'">
      <mt-popup
        v-model="detail"
        class="specialTip"
        popup-transition="popup-fade">
        <trade-detail-eos v-if="detail" :id="id" :aggOid="aggOid" @listenClose="handleClose"/>
      </mt-popup>
    </div>
    <div v-else-if="$appName === 'tronNewdex'">
       <mt-popup
        v-model="detail"
        class="specialTip"
        popup-transition="popup-fade">
        <trade-detail-tron v-if="detail" :id="id" @listenClose="handleClose"/>
      </mt-popup>
    </div>
  </div>
</template>

<script>
// JS
import { Popup } from 'mint-ui';
import Io from '@/utils/socket/index';
import { toLocalTime, toFixed, dealSymbolSplit } from '@/utils/public';

// 弹窗交易明细 模版
import TradeDetailEos from './TradeDetailEos';
import TradeDetailTron from './TradeDetailTron';

export default {
  data() {
    return {
      latest: [],
      latestData: [],
      loading: false,
      hasData: true,
      detail: false,
      id: null,
      aggOid: null,
      symbol1: '',
      symbol2: '',
      wsSymbol: '',
    }
  },
  components: {
    TradeDetailEos,
    TradeDetailTron,
    mtPopup: Popup
  },
  props: [
    'symbol',
    'symbolInfo',
  ],
  watch: {
    // symbol: function lishen() {
    //   this.hasData = true;
    //   this.handleLatestTransaction();
    // },
    latest: function change(newVal) {
      const items = newVal;
      if (items.length > 0) {
        items.forEach((v, i) => {
          items[i].change = 1;
          if (i !== items.length - 1 && items[i].price < items[i + 1].price) {
            items[i].change = 0;
          }
        });
      }
      this.latestData = items;
    },
  },
  mounted() {
    const obj = dealSymbolSplit(this.$route.params.symbol);
    this.symbol1 = obj.symbol1.toUpperCase();
    this.symbol2 = obj.symbol2.toUpperCase();
    this.handleLatestTransaction();
  },
  methods: {
    // 获取实时交易数据
    handleLatestTransaction() {
      this.latest = [];
      this.latestData = [];
      this.loading = true;
      this.wsSymbol = this.$route.params.symbol.toLowerCase();
      const params = {
        symbol: this.wsSymbol,
      };
      if (this.latest.length === 0) {
        Io.cfwsLatestTransaction(params, (res) => {
          if (res.full) {
            this.latest = [];
          }
          this.loading = false;
          this.latest.unshift(...res.latestDeals)
          if (this.latest.length === 0) {
            this.hasData = false;
          }
        });
      }
    },
    toLocalTime(time) {
      return toLocalTime(time);
    },
    toFixed(num, n) {
      return toFixed(num, n);
    },
    handleClose() {
      this.detail = false;
    },
    handleShowDetail(item) {
      this.id = item.id;
      this.aggOid = item.aggOid;
      this.detail = true;
    }
  },
  beforeDestroy() {
    Io.cfwsUnsubscribe(`latest.${this.wsSymbol}`);
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.noData{
  text-align: center;
  color: $color-999;
}

.newDeal{
  font-size: .25rem;
  padding: 0px .25rem;
  background: #fff;

  .num{
    text-align: right !important;
  }

  .mr50{
    margin-right: .1rem;
  }

  // head
  .topTitle{
    height: .55rem;
    border-bottom: 1px solid $color-e3e3e3;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: space-between;

    &>div{
      color: $color-999;
      text-align: center;
      flex: 1;
    }
  }

  // 列表
  .listData{
    height: .5rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: space-between;

    &>div{
      color: $color-333;
      text-align: center;
      flex: 1;
    }

    .localTime{
      text-align: left;
    }
  }

  .specialTip{
    border-radius: .12rem;
    top: 45%;
  }
}
</style>
