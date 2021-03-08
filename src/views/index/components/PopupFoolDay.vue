<template>
  <div class="popup">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <img v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
      src="https://nds.340wan.com/static/img/activity/FoolDay/popup.png" alt="">
    <img v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'"
      src="https://nds.340wan.com/static/img/activity/FoolDay/popup-en.png" alt="">
    <div class="btn" @click="handleToFollDay"></div>
  </div>
</template>

<script>
export default {
  methods: {
    // 跳转到活动
    handleToFollDay() {
      this.$router.push({
        name: 'foolDay',
      })
    },
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popup{
  background: transparent;
  position: relative;

  img{
    width: 5rem;
    height: 5.12rem;
  }

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .btn{
    background: transparent;
    width: 3rem;
    height: .65rem;
    position: absolute;
    left: 1.02rem;
    bottom: .73rem;
  }
}
</style>
