<template>
  <div class="profitTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('more.aboutProfit') }}</div>
    <div class="content">
      <div class="list">1.{{ $t('profit.detail') }}</div>
      <div class="list">2.{{ $t('profit.detail2') }}</div>
    </div>
    <div class="btn" @click="handleClose">{{ $t('public.sure') }}</div>
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

  .content{
    .list{
      margin-top: .1rem;

      &:first-child{
        margin-top: 0rem;
      }
    }
  }
  .btn{
    background: $color-this;
    border-radius: .1rem;
    height: .77rem;
    width: 4.9rem;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    margin-top: .56rem;
  }
}
</style>
