<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.renewalTip') }}</div>
    <div class="content">
      <div class="item">{{ $t('resources.renewalTip1') }}</div>
      <div class="item">{{ $t('resources.renewalTip2') }}</div>
      <!-- <div class="item">{{ $t('resources.renewalTip3') }}</div> -->
    </div>
    <!-- <div class="btn" @click="handleClosePopup">{{ $t('public.sure') }}</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rentTip{
  width: 6.21rem;
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
  .item{
    margin-bottom: .2rem;
  }
}
</style>
