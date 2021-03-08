<template>
  <div class="popupTip" v-if="sendEmail">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="iconfont icon-huaban90 icon"></div>
    <div class="popupContent">
      <div>{{ $t('exportOrder.sendTo') }}</div>
      <div>{{ $store.state.app.vipInfo.email }}</div>
    </div>
    <div class="popupBtn" @click="handleClosePopup">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: [
    'sendEmail'
  ],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popupTip{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .17rem;
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

  .icon{
    font-size: .9rem;
    color: $color-green;
    margin-bottom: .33rem;
  }

  .popupContent{
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
