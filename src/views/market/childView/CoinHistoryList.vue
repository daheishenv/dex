<template>
  <div class="order">
    <!-- <div class="topTools">
      <div class="back fl color-999" @click="handleBack">{{ $t('public.back') }}</div>
      <div>{{symbol}}{{ $t('quotation.oldList') }}</div>
      <div class="ok fr color-this"></div>
    </div> -->
    <history-list ref="orderList"/>
  </div>
</template>

<script>
import { parseSymbol } from '@/utils/public';
import HistoryList from '@/components/OrderListSwiper';


export default {
  name: 'coinHistoryList',
  data() {
    return {
      symbol: '',
    }
  },
  props: [
  ],
  components: {
    HistoryList,
  },
  watch: {
  },
  created() {
    const coin = parseSymbol(this.$route.params.symbol, this.$store.state.app.trad.symbol1_code);
    this.symbol = `${coin[1]}/${coin[2]}`;
  },
  mounted() {
  },
  methods: {
    // 返回
    handleBack() {
      history.back();
    },
  },
  activated() {
    if (this.$route.params.reSet === 'reset') {
      this.$refs.orderList.handleInit();
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'orderDetail') {
      const newTo = to;
      newTo.params.reSet = 'reset';
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    if (to.name !== 'orderDetail') {
      this.$refs.orderList.handleInit();
    }
    next();
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.order{
  background: #fafafa;
  // height: 100%;
  font-size: .36rem;

  .topTools{
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/
    text-align: center;
    height: 1.08rem;
    padding: 0px .24rem;
    background: #FFF;
    margin-bottom: .12rem;

    &>div{
      flex: 7;
    }

    .ok,
    .back{
      flex: 1;
      font-size: .32rem;
    }
  }
}
</style>
