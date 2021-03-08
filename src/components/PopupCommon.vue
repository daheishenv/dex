<template>
  <div class="popupTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <slot/>
    <!-- <div class="popupTitle">提示</div>
    <div class="popupContent">
      Newpool遵循每条公链的质押/解押规则，不会额外添加限制。
    </div> -->
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
@import "../assets/css/public.scss";

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
    margin-top: 0.24rem;
    background: $color-this;
    border-radius: 0.096rem;
    width: 100%;
    height: 0.77rem;
    line-height: 0.77rem;
    font-size: 0.27rem;
    color: #fff;
    text-align: center;
  }
}
</style>
