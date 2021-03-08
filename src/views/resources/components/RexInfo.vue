<template>
  <div class="info">
    <div class="iconDiv">
      <div class="imgDiv"><img src="https://ndi.340wan.com/eos/eosio.token-eos.png" alt=""></div>
      <div>REX</div>
    </div>

    <div class="content">
      <div class="item">
        <span class="tip">{{ $t('resources.rexInfo_1_1') }}</span><span
        >{{ $t('resources.rexInfo_1_2') }}</span><span
          class="tip">{{ $t('resources.rexInfo_1_3') }}</span>
      </div>
      <div class="item">
        <span class="tip">{{ $t('resources.rexInfo_2_1') }}</span><span
        >{{ $t('resources.rexInfo_2_2') }}</span><span
        class="tip">{{ $t('resources.rexInfo_2_3') }}</span>
      </div>

      <div class="item">
        <span class="color-green">{{ $t('resources.rexInfo_3_1') }}</span><span
        class="tip">{{ $t('resources.rexInfo_3_2') }}</span>
      </div>

      <div class="item">
        <span class="color-red">{{ $t('resources.rexInfo_4_1') }}</span><span
        class="tip">{{ $t('resources.rexInfo_4_2') }} </span>
      </div>

      <div class="item">
        <span class="tip">{{ $t('resources.rexInfo_5_1') }}</span><span
        >{{ $t('resources.rexInfo_5_2') }}</span><span
        class="tip">{{ $t('resources.rexInfo_5_3') }}</span>
      </div>
      <div class="full">
        <span @click="handleToZendesk">{{ $t('resources.fullNov') }} ></span>
      </div>
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
    handleToZendesk() {
      if (this.$store.state.app.language === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360028013572';
        return;
      }
      const lang = this.$store.state.app.language.toLowerCase();
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360028013572`;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.info{
  padding: .26rem;
  font-size: .25rem;

  .iconDiv{
    padding: .2rem 0px 0rem 0px;
    display: flex;
    align-items: center;/*垂直居中*/

    .imgDiv{
      width: .7rem;
      height: .7rem;
      margin-right: .13rem;
      img{
        width: 100%;
      }
    }

    .coin{
      padding-left: .2rem;

      .coinName{
        font-size: .29rem;
      }
    }
  }

  .content{
    margin-top: .22rem;

    .item{
      margin-bottom: .25rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .tip{
        color: $color-999;
      }
    }

    .full{
      display: flex;
      justify-content: flex-end;
      font-size: .24rem;
      color: $color-this;
    }
  }
}
</style>
