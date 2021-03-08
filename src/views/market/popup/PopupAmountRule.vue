<template>
  <div class="tip">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title color-this">{{ $t('trade.hint') }}</div>
    <div class="content">
      <div class="note">{{ $t('trade.amountTip') }}</div>
      <div class="fomal">
        <div class="left">{{ $t('trade.amountTip1') }}</div>
        <div class="center">≈</div>
        <div class="right">
          <div class="rTop" v-if="$store.state.app.language === 'en'"><span>
            {{ $t('trade.amountTip2', {symbol2: symbol2.toUpperCase()}) }}</span></div>
          <div class="rTop" v-else>{{ $t('trade.amountTip2', {symbol2: symbol2.toUpperCase()}) }}</div>
          <div class="rBottom">{{ $t('trade.amountTip3') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    symbol2: {
      type: String,
      default: 'EOS'
    },
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.tip{
  position: relative;
  width: 6.8rem;
  border-radius: .1725rem;
  background: #FFF;
  padding: .41rem .37rem;
  box-sizing: border-box;
  font-size: .28rem;

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
    margin-top: .37rem;

    .fomal{
      margin-top: .5rem;
      height: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      // line-height: .6rem;

      .left{
        max-width: 2.5rem;
        text-align: center;
        margin-right: .1rem;
      }

      .right{
        margin-left: .1rem;
        flex: 1;
        text-align: center;

        &>div{
          height: .6rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rTop{
          border-bottom: 1px solid $color-333;
          padding-bottom: 0.15rem;
          span{
            width: 3.2rem;
          }
        }
      }
    }
  }
}
</style>
