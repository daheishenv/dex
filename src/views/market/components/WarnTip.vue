<template>
  <div class="specialTip">
    <div class="title color-red">{{ $t('quotation.warnTitle') }}</div>
    <div class="tip">
      <span>{{ $t('quotation.warnTip1') }}</span>
      <span>{{ $store.state.app.trad.symbol1 }}</span>
      <span>{{ $t('quotation.warnTip2') }}</span>
    </div>
    <div class="choiceDiv" @click="handleAgree">
      <span class="iconfont choice" :class="{'icon-huaban57': agree}"></span>
      <span>{{ $t('quotation.warnTip3') }}</span>
    </div>
    <div class="title">
      <button v-if="!agree" disabled="disabled" class="btn bgcolor-999">{{ $t('public.sure') }}</button>
      <button v-if="agree" class="btn" @click="handleClose">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      agree: false,
    }
  },
  created() {
  },
  mounted() {
    const warnList = localStorage.getItem('warnList') ? JSON.parse(localStorage.getItem('warnList')) : [];
    warnList.forEach((item) => {
      if (item.id === this.$store.state.app.trad.id && item.riskStatus === 0) {
        this.agree = true;
      }
    });
  },
  methods: {
    handleClose() {
      // 处理成已同意
      const warnList = localStorage.getItem('warnList') ? JSON.parse(localStorage.getItem('warnList')) : [];
      warnList.push({
        id: this.$store.state.app.trad.id,
        riskStatus: 0,
      });
      localStorage.setItem('warnList', JSON.stringify(warnList));
      // 关闭提示
      this.$emit('listenClose', false);
    },
    // 统一
    handleAgree() {
      this.agree = true;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .5rem;
  width: 6rem;
  border-radius: .3rem;

  .title{
    text-align: center;
    color: $color-this;
  }

  .tip{
    font-size: .28rem;
    margin: .3rem;
  }

  .choiceDiv{
    font-size: .25rem;
    display: flex;
    align-items: center;/*垂直居中*/
    margin: .3rem .3rem .5rem .3rem;

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
