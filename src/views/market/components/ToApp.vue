<template>
  <div>
    <!-- eos 去下载App -->
    <div class="dialog" v-if="$appName === 'eosNewdex'">
      <div class="logoDiv">
        <span class="iconfont icon-huaban48 logo"></span>
      </div>
      <div class="appName">Newdex</div>
      <div class="tip" :class="{'enTip': $store.state.app.language === 'en'}">{{ $t('index.bannerTitle') }}</div>
      <div class="btnDiv">
        <!-- <button class="btn" @click="handleToDown">{{ $t('down.installApp') }}</button> -->
      </div>

      <div
        v-clipboard:copy="'https://newdex.vip'"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">
        <div class="tip">{{$t('public.dialogTip5')}}{{ $t('public.dialogTip4') }}</div>
        <div class="tip">
          <span class="link-color">https://newdex.vip</span>
          {{ $t('public.dialogTip3') }}
        </div>
      </div>
    </div>
    <!-- tron 引导下载 -->
    <div v-else-if="$appName === 'tronNewdex'">
      <to-app-tron />
    </div>
  </div>
</template>

<script>
import ToAppTron from './ToAppTron';

export default {
  components: {
    ToAppTron
  },
  data() {
    return {
    }
  },
  methods: {
    /* 复制保存账户信息 start */
    onCopy() {
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'bottom',
        duration: 2000
      });
    },
    onError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'bottom',
        duration: 2000
      });
    },
    /* 复制保存账户信息 end */
    handleToDown() {
      window.location.href = 'https://app.newdex.vip';
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.dialog{
  padding: .6rem 0rem .46rem 0px;
  min-width: 6rem;
  border-radius: .1rem;

  .logo{
    font-size: 1.2rem;
    color: #FFF;
    position: relative;

    &:before{
      border-radius: .2rem;
      z-index: 10;
      box-shadow: 0px 0px 3px rgba($color: #0069FF, $alpha: .49);
    }

    &::after{
      content: '';
      background: #0069FF;
      position: absolute;
      height: 80%;
      width: 80%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      border-radius: 50%;
    }
  }

  .appName{
    font-size: .32rem;
    margin-top: .18rem;
  }

  .btnDiv{
    padding: 0 .5rem .2rem 0;

    .btn{
      height: .8rem;
      line-height: .8rem;
      width: 100%;
      border-radius: .4rem;
      color: #FFF;
      background: #0069FF;
      border: 1px solid #0069FF;
      font-size: .32rem;
    }
  }

  .tip{
    line-height: .4rem;
    font-size: .24rem;
    color: $color-999;
  }

  .enTip{
    margin: auto;
    max-width: 5rem;
  }

  .link-color{
    color: #0069FF;
  }
}
</style>
