<template>
  <div class="specialTip">
    <span class="iconfont icon-huaban17" @click="handleClose"></span>
    <div v-if="type === 1">
      <div class="title">{{ $t('resources.ramBuyTitle') }}</div>
      <div class="ram-box">
        <div>{{ $t('resources.buyRAM') }}</div>
      </div>
    </div>
    <div v-else>
      <div class="title">{{ $t('resources.ramSellTitle') }}</div>
      <div class="ram-box">
        <div class="tips">{{ $t('resources.sellRAM1') }}</div>
        <div class="tips">{{ $t('resources.sellRAM2') }}</div>
        <div class="tips">{{ $t('resources.sellRAM3') }}</div>
      </div>
    </div>
    <div class="popupBtn" @click="handleClose">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>


export default {
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('listenClose', false)
    }
  },
  data() {
    return {
    }
  },
  props: [
    'type'
  ],
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .5rem;
  width: 5.5rem;
  border-radius: .3rem;
  background: #FFF;
  position: relative;
  .icon-huaban17{
    position: absolute;
    font-size: 0.2rem;
    right: 0.3rem;
    top: 0.3rem;
  }
  .title{
    text-align: center;
    color: $color-this;
    font-size: 0.36rem;
  }
  .ram-box{
    margin-top: 0.4rem;
    font-size: 0.28rem;
    color: #3A3949;
    .tips{
      position: relative;
      width: 100%;
      padding-left: 0.2rem;
      &::before{
      content: "";
      position: absolute;
      width: 0.08rem;
      height: 0.08rem;
      background: #333;
      border-radius: 50%;
      left: 0px;
      top: 0.16rem;
      // top: 50%;
      // transform: translate(0px, -50%);
      }
    }

    div{
      margin-bottom: 0.1rem;
    }
  }
  .popupBtn{
    margin-top: 0.5rem;
    font-size: .25rem;
    background: #4A90E2;
    border-radius: 10.35px;
    height: .82rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
  }
}
</style>
