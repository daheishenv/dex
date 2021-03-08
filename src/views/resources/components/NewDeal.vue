<template>
  <div class="newDeal">
    <div class="title">
      <span>方向</span>
      <span>金额(EOS)</span>
      <span>时间</span>
    </div>
    <div class="content">
      <div class="item" v-for="(item, $index) in list" :key="$index">
        <span class="color-green" v-if="item.direction === 1">买入</span>
        <span class="color-red" v-else>卖出</span>
        <span>{{ handleToFixed(item.amount, 4) }}</span>
        <span>{{ handleToLocalTime(item.blockTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixed, toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.handleGetAction();
  },
  methods: {
    // 获取最新成交列表
    handleGetAction() {
      this.$http.get('/eosRex/getLatestActions').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.list = res.actionList || [];
      });
    },
    // toFixed
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    // toLocalTime
    handleToLocalTime(time) {
      return toLocalTime(time).substr(5, 20)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.newDeal{
  font-size: .25rem;
  padding: 0 .25rem;

  .title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: .73rem;
    border-bottom: 1px solid $color-input;
    color: $color-999;

    &>span{
      flex: 4;

      &:nth-child(2),
      &:nth-child(3){
        flex: 4;
        text-align: center;
      }
      &:nth-child(3){
        text-align: right;
      }
    }
  }

  .item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: .14rem 0;

    &>span{
      flex: 4;

      &:nth-child(2),
      &:nth-child(3){
        flex: 4;
        text-align: center;
      }
      &:nth-child(3){
        text-align: right;
      }
    }
  }
}
</style>
