<template>
    <div class="popups">
      <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
      <div class="title">{{$t('exchange.follow',{coin:addressTitle, chain: 'BTC'})}}</div>
      <div class="tip">1{{addressTitle}} = 1{{addressDesc}}</div>
      <div class="content">
        <div class="address">
          {{address}}
        </div>
        <div class="btn"
            v-clipboard:copy="`${address}`"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
        >
          {{$t('exchange.copy')}}</div>
        <div class="posTip">
          <div class="color-333">{{$t('exchange.BTC1',{coin:addressDesc})}}</div>
          <div>{{$t('exchange.BTC2',{coin:addressTitle})}}</div>
          <div>
            <p>{{$t('exchange.BTC3')}}</p>
            <p>{{$t('exchange.BTC4',{coin:addressTitle})}}</p>
            <p>{{$t('exchange.BTC5',{coin:addressTitle})}}</p>
            <p>{{$t('exchange.BTC6',{coin:addressTitle})}}</p>
            <p>{{$t('exchange.BTC7')}}</p>
          </div>
          <!-- <div>{{$t('exchange.BTC8')}}</div> -->
          <div>{{$t('exchange.BTC9')}}</div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['address', 'addressTitle', 'addressDesc'],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    onCopy() {
      this.$emit('listenClose', false);
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    onError() {
      this.$emit('listenClose', false);
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
.popups {
  width: 6.4rem;
  border-radius: 0.3rem;
  padding: 0.46rem 0.36rem 0.67rem  0.33rem ;
  box-sizing: border-box;
  position: relative;
  font-size: 0.36rem;
  // border-radius: .2rem;

  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.18rem;
  }
  .title {
    color: $color-this;
    text-align: center;
    margin-bottom: 0.2rem;
    font-size: 0.32rem;
  }
  .address{
    width: 5.1rem;
    margin: 0 auto;
    background-color: #eee;
    box-sizing: border-box;
    padding: .18rem .35rem;
    font-size: 0.25rem;
    color: #3A3949;
    border-radius: 0.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .btn {
    box-sizing: border-box;
    width: 2.3rem;
    height: 0.72rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    margin: 0 auto;
    border-radius: 0.1rem;
    margin-top: 0.3rem;
    font-size: 0.28rem;
    color: #FFFFFF;
    border: 0.02rem solid #4A90E2;
  }
  .posTip {
    margin-top: 0.6rem;
    font-size: 0.24rem;
    & > div {
      margin-top: 0.16rem;
      position: relative;
      padding-left: 0.15rem;
      color: $color-999;
      &:first-child {
        margin-top: 0rem;
      }
      &::before {
        content: "";
        position: absolute;
        width: 0.0612rem;
        height: 0.0612rem;
        background: $color-input;
        border-radius: 0.1rem;
        left: 0;
        top: 0.1rem;
        // transform: translate(0px, -50%);
      }
    }
  }
}
.tip{
  font-size: .25rem;
  color: $color-999;
  text-align: center;
  margin-bottom: .12rem;
}
</style>
