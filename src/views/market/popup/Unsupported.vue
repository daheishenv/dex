<template>
  <div class="specialTip">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title color-this">{{ $t('public.tip') }}</div>
    <div class="tip">
      <!-- {{ $t('profit.unabled') }} -->
      {{ $t('profit.detail2') }}
    </div>
    <div class="title">
      <!-- <button v-if="!agree" disabled="disabled" class="btn bgcolor-999">{{ $t('public.sure') }}</button> -->
      <button class="btn" @click="handleClose">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .3rem;
  min-width: 5rem;
  border-radius: .12rem;
  background: #FFF;
  position: relative;

  .close{
    position: absolute;
    top: .15rem;
    right: .15rem;
    color: $color-999;
    font-size: .22rem;
  }

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
    width: 2rem;
    height: .7rem;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
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
