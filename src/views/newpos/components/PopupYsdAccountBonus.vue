<template>
  <div class="allVotes">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('newpos.accountYsdYearProfit') }}</div>
    <div class="content">
      <div class="itemTitle item">
        <div>{{ $t('newpos.ysdNodeYearProfit') }}</div>
        <div>{{ $t('newpos.ysdRexYearProfit') }}</div>
      </div>
      <div class="item">
        <div class="num">{{ posInfo ? posInfo.nodeAnnualizedRate : '0.00' }}%</div>
        <div class="num">{{ posInfo ? posInfo.rexAnnualizedRate : '0.00' }}%</div>
      </div>
    </div>
    <div class="formula">
      <div>{{ $t('newpos.formula') }}</div>
      <div>
        <span>{{ $t('newpos.formula_1') }}</span><span
          class="color-this" @click="handleToZendesk">{{ $t('newpos.formula_2') }}</span><span
          >{{ $t('newpos.formula_3') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: [
    'posInfo'
  ],
  mounted() {
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    },
    // 跳转zendesk
    handleToZendesk() {
      const lang = this.$store.state.app.language.toLowerCase();
      if (lang === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360029247352';
        return;
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360029247352`;
    },
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.allVotes{
  background: #FFF;
  width: 7rem;
  box-sizing: border-box;
  border-radius: .1725rem;
  padding: .46rem .36rem .28rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .21rem;
  }

  .title{
    text-align: center;
    color: $color-this;
    font-size: .36rem;
    margin-bottom: .3rem;
  }

  .content{
    border: 1px solid $color-this;
    border-radius: .15rem;
    overflow: auto;
    max-height: 5.32rem;

    .itemTitle{
      font-size: .25rem !important;
      color: $color-this;
      background: #E9F2FF;;
    }

    .item{
      height: .73rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid $color-this;
      font-size: .25rem;

      &:last-child{
        border-bottom: 0px solid $color-this;
      }

      &>div{
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &>div:last-child{
        flex: 3;
        height: 100%;
        border-left: 1px solid $color-this;
      }

      .num{
        font-size: .3rem;
      }
    }
  }

  .formula{
    text-align: left;
    font-size: .24rem;
    color: $color-999;
    margin-top: .2rem;

    &>div{
      position: relative;
      padding-left: .15rem;

      &:nth-child(1){
        color: $color-333;

        &::before{
          content: '';
          position: absolute;
          width: .0612rem;
          height: .0612rem;
          background: $color-input;
          border-radius: .10rem;
          left: 0px;
          top: 50%;
          transform: translate(0px, -50%);
        }
      }
    }
  }
}
</style>
