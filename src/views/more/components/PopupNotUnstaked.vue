<template>
  <div class="tipPopup">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title">{{ $t('public.tip') }}</div>
    <div class="content">{{$t('vip.otherPayGrade',{num:notChooseItem.level})}}</div>
    <div class="btn" @click="handleClose">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
export default {
  props: [
    'notChooseItem',
  ],
  data() {
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.tipPopup{
  width: 6.21rem;
  border-radius: .1725rem;
  background: #fff;
  box-sizing: border-box;
  padding: .33rem .55rem;
  position: relative;
  color: $color-333;
  .close{
    position: absolute;
    top: .2rem;
    right: .2rem;
    font-size: .18rem;
    color: #333;
  }
  .title{
    font-size: .36rem;
    color: #8B572A;
    text-align: center;
  }
  .content{
    margin: .35rem 0 .5rem;
    font-size: .27rem;
    color: $color-999;
  }
  .btn{
    background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: .1rem;
    height: .77rem;
    width: 4.9rem;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8B572A;
    margin-top: .56rem;
  }
}
</style>
