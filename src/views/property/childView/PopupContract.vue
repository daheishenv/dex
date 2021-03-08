<template>
  <div class="aboutFee">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{$t('public.tip')}}</div>
    <div class="content">
      {{$t('exchange.contract')}}
    </div>
  </div>
</template>

<script>

export default {
  props: ['coin'],
  data() {
    return {}
  },
  methods: {
    // 关闭弹窗
    handleOrder() {
      this.$emit('listenOrder', true)
    },
    handleClose() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style lang="scss" scoped>

.aboutFee{
  width: 6.21rem;
  padding: .46rem .26rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #fff;
  border-radius: 0.15rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #3A3949;
  }

  .title{
    text-align: center;
    margin-bottom: .4rem;
    font-size: 0.36rem;
    color: #4A90E2;
  }
  .content{
    font-size: 0.25rem;
    color: #333;
    padding: .15rem;
  }
}
</style>
