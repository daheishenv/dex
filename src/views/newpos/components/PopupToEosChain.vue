<template>
  <div class="popupTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="popupTitle">{{ $t('public.tip') }}</div>
    <div class="popupContent">
      {{ $t('trade.tradeTipContent1') }}EOS{{ $t('trade.tradeTipContent2') }}
    </div>
    <!-- <div class="popupBtn" @click="handleClosePopup">{{ $t('public.sure') }}</div> -->
  </div>
</template>

<script>
export default {
  methods: {
    /* ---- 弹窗操作 start ---- */
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    /* ---- 弹窗操作 end ---- */
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popupTip{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .1rem;
  width: 6.21rem;
  text-align: center;
  position: relative;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .popupTitle{
    font-size: .36rem;
    color: $color-this;
    margin-bottom: .33rem;
  }

  .popupContent{
    text-align: center;
    font-size: .28rem;
    color: $color-333;
    margin-bottom: .44rem;
  }

  .popupBtn{
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
