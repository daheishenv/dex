<template>
  <div class="countDown">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose()"></span>
    <div class="title">{{ $t('trade.openBuy') }}</div>
    <div class="content">
      <div class="openTime">
        <span :class="{'en': $store.state.app.language === 'en'}">{{ $t('trade.openTime') }}</span>
        <span>{{ handleToLocalTime($store.state.app.trad.openTime) }}</span>
      </div>
      <div class="down">
        <span :class="{'en': $store.state.app.language === 'en'}">{{ $t('trade.countDown') }}</span>
        <span>{{ `${time.hours}:${time.minutes}:${time.seconds}` }}</span>
      </div>
    </div>
    <div class="btn" @click="handleClose()">{{ $t('trade.comfirm') }}</div>
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      timer: null,
      // time: {
      //   days: 0,
      //   hours: '00',
      //   minutes: '00',
      //   seconds: '00',
      //   total: 3600000,
      // }
    }
  },
  props: [
    'time'
  ],
  mounted() {
    this.handleMouted()
  },
  methods: {
    handleMouted() {
      // try {
      //   window.clearInterval(this.timer);
      //   this.time = countdown(toLocalTime(this.$store.state.app.trad.openTime))
      //   this.timer = window.setInterval(() => {
      //     this.time = countdown(toLocalTime(this.$store.state.app.trad.openTime))
      //     if (this.time.total <= 0) {
      //       window.clearInterval(this.timer);
      //       const data = {
      //         type: 'cd',
      //         status: 0
      //       }
      //       this.handleClose(data);
      //     }
      //   }, 1000);
      // } catch (error) {
      //   setTimeout(() => {
      //     this.handleMouted();
      //   }, 100);
      // }
    },
    handleClose(data) {
      this.$emit('listenClose', data || false)
    },
    handleToLocalTime(time) {
      return toLocalTime(time)
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.countDown{
  width: 6.2rem;
  box-sizing: border-box;
  padding: .36rem .6rem .6rem .6rem;
  font-size: .28rem;

  .popupClose{
    position: absolute;
    right: .3rem;
    top: .3rem;
    color: $color-999;
    font-size: .22rem;
  }

  .title{
    text-align: center;
    font-size: .36rem;
    color: $color-green;
  }

  .content{
    padding: .41rem 0px .52rem .2rem;
    // border: 1px solid #000;

    &>div{
      display: flex;
      align-items: center;
      margin-bottom: .18rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      &>span{
        flex: 1;
        white-space: nowrap;

        &.en{
          min-width: 1.76rem;
        }

        &:last-child{
          flex: 3;
          margin-left: .3rem;
          font-size: .3rem;
        }
      }
    }
  }

  .btn{
    background: #4A90E2;
    border-radius: .0965rem;
    width: 4.9rem;
    height: .77rem;
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
}
</style>
