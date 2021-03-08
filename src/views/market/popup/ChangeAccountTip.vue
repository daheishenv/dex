<template>
  <div class="changeAccountTip1">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <!-- 正常交易提示切换账号 -->
    <div v-if="type === 0">
      <div class="title">{{ $t('trade.tradeTipTitle') }}</div>
      <div class="tip">
        {{ $t('trade.tradeTipContent1') }}{{ changeChain }}{{ $t('trade.tradeTipContent2') }}
      </div>
    </div>
    <!-- 即将开放交易对卖出提示切换账户 -->
    <div class="openSoon" v-if="type === 1">
      <div class="title color-red">{{ $t('trade.openSoonTipTitle') }}</div>
      <div class="tip">
        {{ $t('trade.openSoonTip1') }}{{ changeChain }}{{ $t('trade.openSoonTip2') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 0, // 0:正常显示切换账户 | 1:即将开放卖出显示切换账户
    }
  },
  props: [
    'changeChain'
  ],
  mounted() {
    if (this.$store.state.app.trad.status === 5) {
      this.type = 1;
    }
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit('listenClose', false)
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.changeAccountTip1{
  width: 6rem;
  position: relative;
  text-align: center;
  padding: .35rem;
  font-size: .32rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .1rem;

  .close{
    position: absolute;
    top: .15rem;
    right: .15rem;
    color: $color-999;
    font-size: .25rem;
  }

  .title{
    color: $color-this;
    margin-bottom: .27rem;
  }

  .tip{
    font-size: .28rem;
    margin-bottom: .2rem;
  }
}
</style>
