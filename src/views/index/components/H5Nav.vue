<template>
  <div class="h5Nav">
    <div class="logoDiv">
       <i class="iconfont icon-huaban23 logoIcon"></i>
    </div>
    <div class="h5NavRight">
      <div class="select" @click="show = true">
        <i class="iconfont icon-huaban139 chainIcon" :class="{ 'icon-huaban138': chain === 'tron'}"></i>
        <div>{{ chain.toUpperCase() }}</div>
        <span class="down"></span>
      </div>
      <div class="langu" v-if="channelRef === 'h5'">
        <language />
      </div>
    </div>

    <div class="chainlocal" v-if="show">
      <choose-chain @listenClose="handleClose" />
    </div>
    <!-- 公告弹窗 start -->
  </div>
</template>

<script>
import ChooseChain from '@/views/layout//ChooseChain';
import Language from '@/components/Language';
import Cookies from 'js-cookie';

export default {
  components: {
    Language,
    ChooseChain
  },
  data() {
    return {
      channelRef: 'dapp',
      show: false,
      chain: 'eos'
    };
  },
  mounted() {
    const noChain = this.$appName === 'eosNewdex' ? 'eos' : 'tron';
    this.chain = Cookies.get('tradeCode') || noChain;
    this.channelRef = localStorage.getItem('channelRef');
  },
  methods: {
    handleClose() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.h5Nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.36rem;
  height: 0.9rem;
  color: #ffffff;
  z-index: 888;
  padding: 0 .21rem;
  box-sizing: border-box;
  // background-color: #333;
  .logoDiv {
    .logoIcon {
      font-size: 0.42rem;
      color: #fff;
    }
  }
  .h5NavRight {
    display: flex;
    .select {
      // position: absolute;
      // left: .2rem;
      width: 1.33rem;
      height: 0.5rem;
      // border: 1px solid $color-input;
      border-radius: 0.0662rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.21rem;
      color: #fff;
      .chainIcon{
        font-size: .3rem;
        color: #fff;
        margin-right: .06rem;
      }
      .down {
        display: inline-block;
        border: 0.07rem solid transparent;
        margin-top: 0.05rem;
        margin-left: 0.1rem;
        margin-right: 0.1rem;
        border-top: 0.07rem solid #fff;
      }
    }

    .langu {
      background: transparent;
      // position: absolute;
      color: $color-333;
      // right: .2rem;
      // z-index: 888;
    }
  }
  .chainlocal {
    position: absolute;
  }
}
</style>
