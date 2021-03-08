<template>
  <div class="profitTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <!-- <div class="title">{{ $t('more.aboutProfit') }}</div> -->
    <div class="content">
      {{ $t('New_home.New_home1') }}{{ $t('New_home.New_home2') }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.profitTip{
  width: 6.2rem;
  background: #FFF;
  border-radius: .18rem;
  font-size: .28rem;
  padding: .46rem .6rem;
  box-sizing: border-box;

  .popupClose{
    color: $color-333;
    font-size: .2rem;
    position: absolute;
    right: .24rem;
    top: .24rem;
  }

  .title{
    color: $color-this;
    font-size: .36rem;
    text-align: center;
    margin-bottom: .19rem;
  }
}
</style>
