<template>
  <div class="popupTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="popupTitle">{{ $t('buyBack.buyBack12') }}</div>
    <div class="popupContent">
      <div>
        <!-- 代币NDX手续费收入： -->
        <span class="tipTitle">{{ $t('buyBack.buyBack2') }}：</span>
        <span>1597.5392 EOS</span>
      </div>
      <div>
        <!-- VIP会员收入： -->
        <span class="tipTitle">{{ $t('buyBack.buyBack3') }}：</span>
        <span>1597.5392 EOS</span>
      </div>
      <div>
        <!-- DefiBOX协议收入： -->
        <span class="tipTitle">{{ $t('buyBack.buyBack4') }}：</span>
        <span>1597.5392 EOS</span>
      </div>
      <div>
        <!-- 回购金额(Newdex) -->
        <span class="tipTitle">{{ $t('buyBack.buyBack5') }}：</span>
        <span>1597.5392 EOS</span>
      </div>
      <div>
        <!-- 回购金额(Newpool) -->
        <span class="tipTitle">{{ $t('buyBack.buyBack6') }}：</span>
        <span>1597.5392 EOS</span>
      </div>
      <!-- ·注:Newpool回购金额每日00:00分更新一次 -->
      <div class="tip">{{ $t('buyBack.buyBack13') }}</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.popupTip{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .17rem;
  width: 6.5rem;
  position: relative;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .popupTitle{
    font-size: .36rem;
    color: $color-this;
    margin-bottom: .33rem;
    text-align: center;
  }

  .tipTitle{
    color: $color-999;
  }

  .popupContent{
    font-size: .25rem;
    color: $color-333;
    margin-bottom: .14rem;
    padding-left: 0.2rem;
    line-height: 0.4rem;

    & > div {
      margin-bottom: .05rem;
    }
  }

  .tip {
    color: #FF9800;
    margin-top: .2rem;
    font-size: .22rem;
  }

  // .popupBtn{
  //   font-size: .25rem;
  //   background: #4A90E2;
  //   border-radius: 10.35px;
  //   height: .82rem;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   color: #FFF;
  // }
}
</style>
