<template>
  <div class="specialTip">
    <span class="iconfont icon-huaban17" @click="handleClose"></span>
    <div class="title">{{ $t('resources.formula') }}</div>
    <div class="ram-box">
      <div >{{ $t('resources.formulaTitle') }}</div>
      <div class="formula">
        <div class="formula-left">{{ $t('resources.RAMPrice') }} ≈</div>
        <div class="right">
          <p>{{ $t('resources.EOSPool') }}</p>
          <p>{{ $t('resources.Unallocated') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('listenClose', false)
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .5rem;
  width: 5.5rem;
  border-radius: .3rem;
  background: #FFF;
  position: relative;
  .icon-huaban17{
    position: absolute;
    font-size: 0.2rem;
    right: 0.3rem;
    top: 0.3rem;
  }
  .title{
    text-align: center;
    color: $color-this;
    font-size: 0.36rem;
  }
  .ram-box{
    margin-top: 0.4rem;
    font-size: 0.28rem;
    color: #3A3949;
    .formula{
      display: flex;
      align-items: center;
      margin-top: 0.4rem;
      .formula-left{
        width: 1.6rem;
        text-align: center;
      }
      .right{
        display: flex;
        flex-direction: column;
        margin-left: 0.2rem;
        flex:1;
        p{
          // flex:1;
          line-height: 0.6rem;
          // padding: 0 0.5rem;
          font-size: 0.24rem;
          text-align: center;
          &:first-child{
          border-bottom: 1px solid #333;
          }
        }
      }
    }
  }
}
</style>
