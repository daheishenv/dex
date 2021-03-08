<template>
  <div class="popupTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="popupTitle">{{ $t('order.orderTip') }}</div>
    <div class="popupContent">
      <div>{{ $t('order.tooMoreOrderTip1', {maxNum: maxNum}) }}</div>
      <div>{{ $t('order.tooMoreOrderTip2') }}</div>
    </div>
    <div class="tip">{{ $t('order.tooMoreOrderTip3') }}</div>
  </div>
</template>

<script>
import { getOrderNum } from '@/utils/publicApi';

export default {
  data() {
    return {
      maxNum: '-',
    }
  },
  mounted() {
    this.handleGetOrderNum();
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 获取账户最大条数
    handleGetOrderNum() {
      getOrderNum((err, res) => {
        if (err) {
          this.maxNum = 200;
          return;
        }
        this.maxNum = res.maxNum;
      })
    }
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

  .popupContent{
    font-size: .28rem;
    color: $color-333;
    margin-bottom: .14rem;
    padding-left: 0.2rem;
    line-height: 0.4rem;
    div{
      position: relative;
      &::before{
      content: '';
      position: absolute;
      width: 0.08rem;
      height: 0.08rem;
      display: flex;
      background: $color-666;
      border-radius: 50%;
      left: -0.2rem;
      top: 0.15rem;
      // top: 50%;
      // transform: translate(0,-50%);
      }
    }
  }

  .tip{
    color: $color-999;
    font-size: .25rem;
    padding-left: .2rem;
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
