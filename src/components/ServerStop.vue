<template>
  <div class="serverStop">
    <span class="iconfont icon-huaban17 popupClose" @click="handleBack"></span>
    <div class="title">{{ $t('serverStop.title') }}</div>
    <div class="tipDiv">
      <div>{{ $t('serverStop.msg1') }}</div>
      <div>{{ $t('serverStop.msg2') }}</div>
      <div>{{ $t('serverStop.msg3') }}</div>
    </div>
    <div>
      <button class="btn" @click="handleBack">{{ $t('resources.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack() {
      this.$emit('listenClose', false);
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.serverStop{
  font-size: .3rem;
  width: 6rem;
  box-sizing: border-box;
  padding: .4rem .5rem;;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-333;
    font-size: .21rem;
  }

  .title{
    font-size: .34rem;
    text-align: center;
    line-height: .56rem;
    color: $color-this;
    margin-bottom: .2rem;
  }

  .tipDiv{
    font-size: .25rem;

    &>div{
      margin-bottom: .4rem;
    }

    &>div:last-child{
      margin-bottom: .3rem;
    }
  }

  .btn{
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: $color-this;
    border-radius: .1rem;
    font-size: .25rem;
    // margin-bottom: .5rem;
  }
}
</style>
