<template>
  <div class="popupCancel">
    <span class="iconfont icon-huaban17 popupClose" @click="handleCancel"></span>
    <div class="title">{{ $t('ct.ct32') }}</div>
    <!-- :class="{'flexc': $store.state.app.trad.symbol1 === 'COMP',
               'flexb': $store.state.app.trad.symbol1 !== 'COMP'}" -->
    <div class="content flexb" :style="$store.state.app.language === 'en' ? 'padding: 0 .3rem' : ''">
      <div class="list" @click="handleCoinCharging(2, symbolCoin)">
        <img src="/static/img/more/charge.png" alt="">
        <!-- 充币 -->
        <span class="ml5">{{ $t('ct.ct1') }}</span>
      </div>
      <!-- v-if="$store.state.app.trad.symbol1 !== 'COMP'" -->
      <div class="list" @click="handleCoinCharging(1, symbolCoin)">
        <img src="/static/img/more/withdraw.png" alt="">
        <!-- 提币 -->
        <span class="ml5">{{ $t('ct.ct2') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { jumpCross } from '@/utils/public';

export default {
  data() {
    return {
    }
  },
  props: {
    symbolCoin: String
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    // 充提币
    handleCoinCharging(direction, coin) {
      if (direction === 2) {
        this.$toast({
          message: this.$t('public.withDrawTip'),
          position: 'center',
          duration: 2000,
        });
        return;
      }
      jumpCross(direction, coin)
    },
    handleCancel() {
      this.$emit('listenClose', false);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.flexb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex {
  display: flex;
  align-items: center;
}

.line {
  width: 100%;
  height: 1px;
  background: #E1E1E1;
  margin: .3rem 0;
}

.list {
  padding: 0 .3rem;

  i {
    color: #4A90E2;
    opacity: 0.57;
  }

  img {
    display: block;
    margin: 0 auto .2rem;
    width: .64rem;
  }

  span {
    display: block;
    text-align: center;
  }
}

.popupCancel{
  font-size: .28rem;
  padding: .5rem .32rem .3rem;
  width: 6.21rem;
  box-sizing: border-box;
  border-radius: .1rem;
  background: #fff;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .title{
    font-size: .3rem;
    color: $color-this;
    text-align: center;
  }
  .content{
    margin: .56rem 0 .44rem;
    // text-align: center;
    padding: 0 1rem;
    .word1 {
      margin-bottom: .1rem;
    }
  }
  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn{
      flex: 1;
      height: .83rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #c7c7c7;
      color: white;
      border-radius: .1042rem;
      &:last-child{
        margin-left: .1rem;
        background: $color-this;
      }
    }
  }
  .tipMain{
    font-size: .25rem;
    position: relative;

    i {
      position: absolute;
      border: .1rem solid #F3F3F3;
      top: .3rem;
      left: .03rem;
      transform: rotate(45deg);
    }
  }
  .position{
    font-size: .2rem;
    background: #F3F3F3;
    padding: .1rem;
    text-align: left;
    position: relative;
    margin-top: .1rem;
    color: #999;
    line-height: .3rem;
  }
}
</style>
