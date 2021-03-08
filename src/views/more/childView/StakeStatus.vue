<template>
  <div class="stakeStatus">
    <div class="imgDiv">
      <img src="/static/img/more/stakeStatus.png" class="img" alt="">
    </div>
    <div class="checkDiv">
      <span class="iconfont icon-huaban90 checkbox"></span>
      <span v-if="type">{{ $t('vip.mortgageSuccess') }}</span>
      <span v-else>{{ $t('vip.redeemSuccess') }}</span>
    </div>
    <div class="tip">（{{ $t('merge.timeOut', {time}) }}）</div>
    <div class="btn" @click="handleBackHome">{{ $t('merge.backHome') }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 3,
      timer: null,
      type: true, // 抵押 - true | false - 赎回
    }
  },
  mounted() {
    this.type = this.$route.params.type;
    this.handleTimer();
  },
  methods: {
    handleBackHome() {
      this.$router.replace({
        name: 'property',
      })
    },
    handleTimer() {
      window.clearTimeout(this.timer);
      if (this.time <= 0) {
        this.handleBackHome();
        return;
      }
      this.timer = window.setTimeout(() => {
        this.time -= 1;
        this.handleTimer();
      }, 1000);
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.timer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.stakeStatus{
  font-size: .28rem;
  text-align: center;
  padding-top: 2rem;
  .imgDiv{
    margin: auto;
    width: 1.8rem;
    margin-bottom: .3rem;
    .img{
      width: 100%;
    }
  }
  .checkDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    .checkbox{
      color: $color-this;
      width: .4026rem;
      height: .4026rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .4rem;
      border-radius: 20px;
      overflow: hidden;
      margin-right: .08rem;
    }
  }
  .tip{
    font-size: .25rem;
    color: $color-999;
    margin: .18rem 0 .35rem;
  }
  .btn{
    width: 5.8rem;
    border: 1px solid $color-this;
    color: $color-this;
    font-size: .32rem;
    height: .84rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    border-radius: .1042rem;
  }
}
</style>
