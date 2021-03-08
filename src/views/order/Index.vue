<template>
  <div class="order">
    <order-list ref="orderList" @listenToDetail="handleToDetail"/>
  </div>
</template>

<script>
import OrderList from '@/components/OrderListSwiper';

export default {
  data() {
    return {
    }
  },
  props: [
  ],
  components: {
    OrderList,
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleToDetail() {
    }
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
@import "../../assets/css/public.scss";

.order{
  background: #fafafa;
  height: 100%;
}
</style>
