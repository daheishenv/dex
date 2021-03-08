<template>
  <div class="stake">
    <!-- <div class="tools">
      <div>{{ $t('merge.stakeNdx') }}</div>
    </div> -->
    <div class="tab">
      <div :class="{'active': isMortgageNDX}" @click="isMortgageNDX = true">{{ $t('vip.mortgageNdx') }}</div>
      <div :class="{'active': !isMortgageNDX}" @click="isMortgageNDX = false">{{ $t('vip.redeemNdx') }}</div>
    </div>
    <div class="bg">
      <div class="bgColor" :class="{'unstaked': !isMortgageNDX}">
        <div class="unstakedBg" v-if="unstaking"></div>
      </div>
      <MortgageNDX :isMortgageNDX="isMortgageNDX" @listenUnstaking="handleUnstaking"/>
    </div>
  </div>
</template>

<script>
import MortgageNDX from '../components/MortgageNDX';

export default {
  components: {
    MortgageNDX,
  },
  data() {
    return {
      isRoute: false,
      isMortgageNDX: true,
      unstaking: false,
    }
  },
  mounted() {
    if (this.$route.name === 'stakeNdx') {
      this.isRoute = true;
    }
    this.isRoute = false;
    this.isMortgageNDX = !(this.$route.params.type === 'unstake');
  },
  methods: {
    handleBack() {
      history.back();
    },
    handleUnstaking(type) {
      this.unstaking = type;
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.stake{
  font-size: .36rem;
  background: #FFF;
  min-height: 100vh;
  padding-bottom: .5rem;

  .tools{
    display: flex;
    align-items: center;
    justify-content: center;
    height: .8rem;
    position: relative;

    .back{
      position: absolute;
      left: 0;
      width: .7rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .backIcon{
        font-size: .3rem;
      }
    }
  }

  .tab{
    display: flex;
    align-items: center;
    height: .7rem;
    font-size: .32rem;
    color: $color-999;

    &>div{
      flex: 1;
      text-align: center;
      position: relative;

      &.active{
        color: $color-this;
      }

      &:last-child::before{
        content: '';
        border-left: 1px solid $color-input;
        position: absolute;
        height: .27rem;
        left: 0px;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }

  .bg{
    position: relative;
    .bgColor{
      background: #f3f3f3;
      height: .78rem;
      width: 100%;
      position: absolute;

      &.unstaked{
        height: .09rem;

        .unstakedBg{
          margin-top: .09rem;
          height: .7rem;
          background: #faf3df;
        }
      }
    }
  }
}
</style>
