<template>
  <div class="popupCancel" @click.stop="handleClick">
    <span class="iconfont icon-huaban17 popupClose" @click="handleCancel"></span>
    <div class="title">{{ $t('public.tip') }}</div>
    <div class="content">
      <span v-if="all">{{ $t('quotation.cancelAllTip') }}</span>
      <span v-else>{{ $t('order.revokeTip') }}</span>
      <div class="freeCpu" v-if="showFreeCpu && $store.state.whiteConfig.isFreeCpuWhite">
        <!-- icon-huaban57 -->
        <span class="iconfont chooseFree"
          :class="{'icon-huaban57': choose}" @click="choose = !choose"></span>
        <span @click.stop="choose = !choose">{{ $t('trade.freeCpuRevoke') }}</span>
        <span class="iconfont icon-xinxi tipMain" @click="tipShow = !tipShow">
          <i v-if="tipShow"></i>
        </span>
      </div>
      <div class="position" v-if="tipShow">
        <span>{{ $t('lineK.afterChecking') }}</span>
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn" @click="handleCancel">{{ $t('public.cancel') }}</div>
      <div class="btn" @click="handleSure">{{ $t('public.sure') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choose: false,
      tipShow: false,
    }
  },
  props: [
    'all'
  ],
  computed: {
    showFreeCpu() {
      if (!this.$store.state.app.accountInfo || this.$store.state.app.accountInfo.chain !== 'eos') {
        return false;
      }
      if (this.activeType === 'buy' && this.$store.state.app.trad.valuationChain !== 'eos') {
        return false;
      }
      if (this.activeType === 'sell' && this.$store.state.app.trad.baseChain !== 'eos') {
        return false;
      }
      return true;
    }
  },
  mounted() {
    // this.choose = this.$store.state.whiteConfig.isFreeCpuWhite;
  },
  methods: {
    handleClick() {
    },
    handleCancel() {
      this.$emit('listenClose', false);
    },
    handleSure() {
      this.$emit('listenSureCancel', this.choose)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/public.scss";

.popupCancel{
  font-size: .28rem;
  padding: .4rem .32rem .53rem;
  width: 6.21rem;
  box-sizing: border-box;
  border-radius: .1rem;

  .popupClose{
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
    margin: .21rem 0 .44rem;
    text-align: center;

    .freeCpu{
      font-size: .24rem;
      color: $color-999;
      margin-top: .25rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .chooseFree{
        font-size: .3rem;
        margin-right: .08rem;
        color: $color-this;
        width: .3rem;
        height: .3rem;
        border-radius: .05rem;
        border: 1px solid $color-input;

        &.icon-huaban57{
          border: 1px solid transparent;
        }
      }
    }
  }
  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn{
      flex: 1;
      height: .83rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c7c7c7;
      color: white;
      border-radius: .1042rem;
      &:last-child{
        margin-left: .1rem;
        background: $color-this;
      }
    }
  }
  .tipMain{
    font-size: .25rem;
    position: relative;

    i {
      position: absolute;
      border: .1rem solid #F3F3F3;
      top: .3rem;
      left: .03rem;
      transform: rotate(45deg);
    }
  }
  .position{
    font-size: .2rem;
    background: #F3F3F3;
    padding: .1rem;
    text-align: left;
    position: relative;
    margin-top: .1rem;
    color: #999;
    line-height: .3rem;
  }
}
</style>
