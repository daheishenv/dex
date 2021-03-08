<template>
  <div class="popupCancel" @click.stop="handleClick">
    <span class="iconfont icon-huaban17 popupClose" @click="handleCancel"></span>
    <div class="title">{{ $t('public.tip') }}</div>
    <div class="content">
      <p class="word1">中级认证用户，每日提币数量为：XBTC；</p>
      <p>您提币数量大于每日提币数量，需人工进行审核，请耐心等待一个工作日。</p>
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
    }
  },
  computed: {
  },
  mounted() {
    this.choose = this.$store.state.whiteConfig.isFreeCpuWhite;
  },
  methods: {
    handleClick() {
    },
    handleCancel() {
      this.$emit('listenClose', false);
    },
    handleSure() {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

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
    // text-align: center;

    .word1 {
      margin-bottom: .1rem;
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
