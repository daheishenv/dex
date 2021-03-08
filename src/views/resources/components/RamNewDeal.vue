<template>
  <div class="newDeal">
    <div class="title">
      <span>{{ $t('resources.direction') }}</span>
      <span>{{ $t('resources.amount') }}(EOS)</span>
      <span>{{ $t('resources.time') }}</span>
    </div>
    <div class="content">
      <div  v-for="(item, $index) in list" :key="$index">
        <a :href="`https://bloks.io/tx/${item.trxId}`" class="item">
          <span class="color-green" v-if="item.direction === 1">{{ $t('public.buy') }}</span>
          <span class="color-red" v-else>{{ $t('public.sell') }}</span>
          <span>{{ handleToFixed(item.amount, 4) }}</span>
          <span>{{ handleToLocalTime(item.blockTime) }}</span>
        </a>


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
  // mounted() {
  // this.handleGetAction();
  // },
  mounted() {
    this.handleGetAction();
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.handleGetAction();
    }, 10000);
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  methods: {
    // 获取最新成交列表
    handleGetAction() {
      const params = {
        account_name: 'eosio.ram',
        pos: -1,
        offset: -30,
      };
      this.$http.post('/eosRamAction/getRamActions', params, {
        transformRequest: [(data, header) => {
          const headerFormat = header;
          // 对 data 进行任意转换处理
          headerFormat['Content-Type'] = 'application/json';
          return JSON.stringify(data);
        }],
      }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        const list = res.actions.reverse() || []
        this.list = list.splice(0, 30);
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
