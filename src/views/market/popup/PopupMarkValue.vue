<template>
  <div class="tooMore">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title">{{ $t('lineK.aboutMarketValue') }}</div>
    <div class="content">
      <div>
        <span v-if="$store.state.app.language !== 'en' && $store.state.app.language !== 'ko'">
          {{ $t('lineK.marketValue') }} =
        </span>
        <span>{{ $t('lineK.circulationNum') }} X {{ $t('lineK.CurrentPrice') }}</span>
      </div>
      <!-- <div>{{ $t('lineK.marketValue') }}=</div> -->

      <!-- {{ $t('order.tooMoreOrder', {maxNum: maxNum}) }} -->
    </div>
    <!-- <div class="btn" @click="handleClose">{{ $t('public.sure') }}</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  // props: [
  //   'maxNum'
  // ],
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.tooMore{
  width: 6.21rem;
  border-radius: .1725rem;
  background: #FFF;
  position: relative;
  padding: .6rem .78rem;
  box-sizing: border-box;
  transform: translateY(-1.5rem);
  .close{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }
  .title{
    font-size: .36rem;
    color: $color-this;
    text-align: center;
  }
  .content{
    margin-top: .25rem;
    font-size: .28rem;
    text-align: center;
  }
  .btn{
    background: $color-this;
    color: #fff;
    width: 4.27rem;
    height: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .1042rem;
    margin: auto;
    margin-top: .3rem;
    font-size: .27rem;
  }
}
</style>
