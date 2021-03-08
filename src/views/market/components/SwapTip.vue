<template>
  <div class="tipEosSell">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title color-this">{{ $t('public.tip') }}</div>
    <div class="content">
      <div class="tip">{{ $t('marketDistribution.defiTip') }}</div>
      <div class="checkBox" @click="tipSwap = !tipSwap">
        <!-- <span class="iconfont icon-huaban57 check"></span> -->
        <span class="iconfont check" :class="{'icon-huaban57 checked': tipSwap}"></span>
        <span>{{ $t('trade.noAgain') }}</span>
      </div>
    </div>
    <div class="btnDiv">
      <div class="btn" @click="handleSure">{{ $t('public.sure') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipSwap: false, // 不再提示
    }
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    },
    // 确定交易
    handleSure() {
      if (this.tipSwap) {
        // 勾选不再提示
        localStorage.setItem('tipSwap', this.tipSwap ? 1 : 0);
      }
      this.$emit('listenClose', false);
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.tipEosSell{
  position: relative;
  width: 6.21rem;
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
    text-align: center;

    .tip{
      margin: .3rem 0 .3rem;
    }
    .checkBox{
      color: $color-999;
      font-size: .25rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .check{
        width: .3rem;
        height: .3rem;
        font-size: .3rem;
        margin-right: .1rem;
        border: 1px solid $color-input;
        box-sizing: border-box;
        border-radius: .0417rem;

        &.checked{
          color: $color-this;
        }
      }
    }
  }

  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: .3rem;

    .btn{
      flex: 1;
      margin-right: .1rem;
      background: #C7C7C7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      border-radius: .0842rem;
      height: .83rem;

      &:last-child{
        background: $color-this;
        margin-right: 0;
      }
    }
  }
}
</style>
