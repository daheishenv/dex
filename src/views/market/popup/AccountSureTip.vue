<template>
  <div class="specialTip">
    <div class="title color-this">{{ $t('quotation.tipNewdexTitle') }}</div>
    <div class="tip">
      <div class="account" v-if="$store.state.app.language !== 'en'">{{ changeChain }}{{ $t('trade.receiveAccount') }}: {{ receiver }}</div>
      <div class="account" v-if="$store.state.app.language === 'en'">{{ $t('trade.receiveAccount') }}{{ changeChain }}: {{ receiver }}</div>
      <div class="sureTip">{{ $t('trade.receiverSureTip') }}</div>
    </div>
    <div class="choiceDiv" @click="handleAgree">
      <span class="iconfont choice" :class="{'icon-huaban57': agree}"></span>
      <span>{{ $t('trade.noAgain') }}</span>
    </div>
    <div class="title">
      <!-- <button v-if="!agree" disabled="disabled" class="btn bgcolor-999">{{ $t('public.sure') }}</button> -->
      <button class="btn" @click="handleClose">{{ $t('trade.sureTrade') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agree: false,
      changeChain: 'BOS',
    }
  },
  props: [
    'activeType',
    'receiver'
  ],
  watch: {
    activeType() {
      if (this.activeType === 'buy') {
        this.changeChain = this.$store.state.app.trad.baseChain.toUpperCase();
      } else {
        this.changeChain = this.$store.state.app.trad.valuationChain.toUpperCase();
      }
    }
  },
  created() {
  },
  mounted() {
    if (this.activeType === 'buy') {
      this.changeChain = this.$store.state.app.trad.baseChain.toUpperCase();
    } else {
      this.changeChain = this.$store.state.app.trad.valuationChain.toUpperCase();
    }
  },
  methods: {
    handleClose() {
      // 处理成已同意
      const warnList = localStorage.getItem('spanChainList') ? JSON.parse(localStorage.getItem('spanChainList')) : [];
      if (this.agree) {
        warnList.push({
          id: this.$store.state.app.trad.id,
          noTip: true,
        });
        localStorage.setItem('spanChainList', JSON.stringify(warnList));
      }
      // 关闭提示
      this.$emit('listenSureTrade', false);
    },
    // 统一
    handleAgree() {
      this.agree = !this.agree;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .3rem;
  width: 6rem;
  border-radius: .3rem;

  .title{
    text-align: center;
    color: $color-this;
  }

  .tip{
    font-size: .28rem;
    margin: .3rem 0px;
    text-align: center;

    .account{
      margin-top: .3rem;
    }
    .sureTip{
      margin-top: .3rem;
      margin-bottom: .5rem;
    }
  }

  .choiceDiv{
    font-size: .25rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;
    margin: .3rem .3rem .5rem .3rem;
    color: $color-999;

    .choice{
      border: 1px solid $color-999;
      display: inline-block;
      height: .3rem;
      width: .3rem;
      font-size: .3rem;
      border-radius: .04rem;
      color: $color-this;
      margin-right: .1rem;

      &.icon-huaban57{
        border: 1px solid transparent;
      }
    }
  }

  .btn{
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: $color-this;
    border-radius: .1rem;
    font-size: .25rem;
  }

  .bgcolor-999{
    background: #999;
  }
}
</style>
