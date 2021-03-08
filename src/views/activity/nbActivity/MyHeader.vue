<template>
  <div class="headDiv">
      <div class="headerbg" :style="$store.state.app.language === 'zh-CN'
          || $store.state.app.language === 'zh-TW'
          ? `background: url('/static/img/activity/nbActivity/back3.png?v=1.1') #1f2126 no-repeat;`
          : `background: url('/static/img/activity/nbActivity/back2.png?v=1.1') #1f2126 no-repeat;`">
         <img class="compantLogo" src="/static/img/activity/nbActivity/logo.png" alt="" srcset="">
        <div class="language">
          <Language/>
        </div>
      </div>
    </div>
</template>
<script>
import Language from '@/components/Language';

export default {
  components: {
    Language
  }
}
</script>
<style lang="scss" scoped>
  .headDiv {
    display: flex;
    flex-direction: column;
    // background-color: #07022a;
    .headerbg {
      background: url("/static/img/activity/nbActivity/back3.png?v=1.1") no-repeat;
      background-size: 100% 100% !important;
      display: flex;
      flex-direction: column;
      position: relative;
      // height: 6.14rem;
      height: 9rem;
      // &.enbg{
      //   background: url('https://nds.340wan.com/static/assets/img/activity/moonFestival/bg.png') no-repeat;
      //   background-size: 100% 8.3rem;
      // }
      .bannerDiv {
        width: 5.13rem;
        height: 2.67rem;
        margin: 2rem auto 0;
        &.en{
          width: 5.39rem;
          height: 2.67rem;
        }
        img {
          width: 100%;
          height: 100%;
        }

      }
      .compantLogo{
        position: absolute;
        top: 0.4rem;
        left: 0.2rem;
        width: 1.75rem;
        height: .46rem;
      }
      .language{
        position: absolute;
        top: 0.4rem;
        right: 0.2rem;
        /deep/ .languageIcon{
          color: #fff;
        }
        /deep/ .down{
          border-top: .07rem solid #fff;
        }
      }
    }
  }
</style>
