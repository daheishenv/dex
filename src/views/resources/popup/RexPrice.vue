<template>
  <div class="rexPrice">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.rexFormula') }}</div>
    <div class="content">
      <div>{{ $t('resources.rexPrice') }}≈</div>
      <div class="border">
        <div>{{ $t('resources.rexPoolCount') }}</div>
        <div>{{ $t('resources.allNetRexThroughput') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleClosePopup">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rexPrice{
  width: 6.8rem;
  background: #FFF;
  border-radius: .17rem;
  padding: .46rem .55rem .33rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
  }

  .title{
    color: $color-this;
    text-align: center;
    margin-bottom: .2rem;
    font-size: .32rem;
  }

  .content{
    display: flex;
    align-items: center;
    margin-top: .4rem;
    color: $color-333;

    .border{
      flex: 1;
      text-align: center;
      margin-left: .05rem;

      &>div:nth-child(1){
        border-bottom: 1px solid $color-333;
        padding-bottom: .12rem;
        box-sizing: border-box;
      }
      &>div:nth-child(2){
        padding-top: .12rem;
      }
    }
  }

  .btn{
    width: 4.9rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #FFF;
    margin: auto;
    border-radius: .1rem;
    margin-top: .3rem;
    font-size: .26rem;
  }
}
</style>
