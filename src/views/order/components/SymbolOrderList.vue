<template>
  <div>
    <order-list ref="orderList" />
  </div>
</template>

<script>
import OrderList from '@/components/OrderListSwiper';

export default {
  data() {
    return {
    }
  },
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
</style>
