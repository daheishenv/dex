<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('vip.PopupTitle') }}</div>
    <!-- <div class="title">{{ $t('vip.renewDetail') }}</div> -->
    <div class="content">
      <div class="item">
        <div>{{ $t('vip.PopupDesc',{time: handleTime(vipInfo.expireTime)})}}</div>
        <!-- <div>{{ $t('vip.topRenew',{time:handleTime(vipInfo.orderTime),level:vipInfo.consumeLevel,month:vipInfo.renewDuration}) }}</div> -->

      </div>
    </div>
    <div class="sureBtn" @click="handleClosePopup">{{ $t('public.sure') }}</div>

  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      hideCancel: false,
      type: 1
    }
  },
  props: {
    vipInfo: Object
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    handleType(type) {
      this.type = type
    },
    // 消耗会员日期
    handleTime(val) {
      const toLocalDate = toLocalTime(val);
      const expireTime = toLocalDate.replace(/-/g, '/');
      const lastDate = new Date(expireTime).getTime();
      const countDay = 360 * 1000 * 60 * 60 * 24
      const result = Decimal.sub(lastDate, countDay).toString()
      return toLocalTime(Number(result)).substring(0, 10)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
.rentTip{
  width: 6.21rem;
  background: #FFF;
  padding: .46rem .55rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #FFFFFF;
  border-radius: 0.1725rem;
  padding: 0.36rem 0.7rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #333;
  }

  .title{
    color: $color-this;
    text-align: center;
    margin-bottom: .4rem;
    color: #FFC78A;
    font-size: 0.36rem;
    color: #8B572A;
  }
  .item{
    display: flex;
    flex-direction: column;
    color: #333;
    font-size: 0.24rem;
    color: #9B9B9B;
    line-height: 0.3456rem;
  }
  .sureBtn{
    background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: 0.0965rem;
    font-size: 0.27rem;
    color: #8B572A;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.77rem;
    margin-top: 0.5rem;
  }
}
</style>
