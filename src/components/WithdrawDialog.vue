<template>
  <div class="withdrwaDialog popupCancel">
    <span class="iconfont icon-huaban17 popupClose" @click="handleComfirm"></span>
    <div class="content content1">
      <img src="/static/img/more/stop.png" alt="">
      <p class="tip">
        {{ chain }}{{ $t('more.main') }}
        <span v-if="way===1">{{ $t('ct.ct13') }}</span>
        <span v-else>{{ $t('ct.ct22') }}</span>
      </p>
      <p class="word1">{{ $t('ct.ct46') }}</p>
    </div>
    <div class="btnDiv">
      <div class="btn" @click="handleComfirm">{{ $t('trade.comfirm') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'withdrwaDialog', // 充提服务暂停
  data() {
    return {
    }
  },
  components: {},
  props: {
    chain: String, // BTC ETH
    way: Number, // 1-提币 2-充值
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleComfirm() {
      this.$emit('listenWithdrawDialog')
    }
  },
}
</script>
<style lang="scss" scoped>
@import "../assets/css/public.scss";

.popupCancel{
  background: #fff;
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
    // text-align: center;
    &.content1 {
      text-align: center;
      img {
        display: block;
        width: 1.5rem;
        margin: 0 auto .2rem;
      }

      .word1 {
        color: #999;
        font-size: .26rem;
        margin: .2rem 0 .1rem;
      }
    }
  }

  .tip {
    color: $color-this;
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

