<template>
  <div class="action">
    <div class="imgDiv">
      <img v-if="json.action" src="https://nds.340wan.com/static/img/newpos/increase.png" alt="">
      <img v-else src="https://nds.340wan.com/static/img/newpos/reduce.png" alt="">
    </div>
    <div class="success">
      <span class="iconfont icon-huaban90 checkIcon"></span>
      <span v-if="json.action">{{ $t('newpos.increasePos') }}</span>
      <span v-else>{{ $t('newpos.reducePos') }}</span>
    </div>
    <div class="tip">
      <span v-if="json.action">
        {{ $t('newpos.profitGet_1') }}{{ time }}{{ $t('newpos.profitGet_2') }}
      </span>
      <span v-else>
        <span v-if="json.type === 1">{{ $t('newpos.realTimeGet') }}</span>
        <span v-else>{{ $t('newpos.threeDayGet') }}</span>
      </span>
    </div>
    <div class="btn" @click="handleToNewposIndex">{{ $t('public.back') }}</div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      json: {},
      time: new Date(),
    }
  },
  mounted() {
    this.json = this.$route.params;
    const date = new Date(this.time).getUTCDate() + 1;
    const ableSellDate = this.time.setDate(date)
    this.time = toLocalTime(ableSellDate).substr(0, 10);
  },
  methods: {
    handleToNewposIndex() {
      // this.$router.push({
      //   name: 'newpos'
      // })
      history.go(-2);
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.action{
  font-size: .27rem;
  padding-top: 1.8rem;

  .imgDiv{
    width: 2.7rem;
    margin: auto;

    img{
      width: 100%;
    }
  }

  .success{
    margin-top: .3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .3rem;

    .checkIcon{
      font-size: .36rem;
      margin-right: .1rem;
      color: $color-this;
    }
  }

  .tip{
    color: $color-999;
    margin-top: .2rem;
    text-align: center;
  }

  .btn{
    background: #F6C85C;
    width: 6.78rem;
    height: .84rem;
    margin: auto;
    border-radius: .1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .32rem;
    color: #8B572A;
    margin-top: .65rem;
  }
}
</style>
