<!--
 * @Author: your name
 * @Date: 2020-03-03 17:05:28
 * @LastEditTime: 2020-04-13 19:19:05
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /Newdex/exchange-dapp/src/views/index/components/Advantage.vue
 -->
<template>
    <!-- advantage 优势 start -->
    <div>
      <div class="advantage color-333" v-if="this.$appName === 'eosNewdex'">
        <div class="topTitle color-this">{{ $t('index.special') }}</div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-user-ic.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.experience') }}</div>
          <div class="tip">{{ $t('index.experienceTip1') }}</div>
          <div class="tip">{{ $t('index.experienceTip2') }}</div>
          <div v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'" class="tip">{{ $t('index.experienceTip3') }}</div>
        </div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-security-ic.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.safe') }}</div>
          <div class="tip">{{ $t('index.safeTip1') }}</div>
          <div class="tip">{{ $t('index.safeTip2') }}</div>
          <div v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'" class="tip">{{ $t('index.safeTip3') }}</div>
        </div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-open-ic.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.data') }}</div>
          <div class="tip">{{ $t('index.dataTip1') }}</div>
          <div class="tip">{{ $t('index.dataTip2') }}</div>
          <div v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'" class="tip">{{ $t('index.dataTip3') }}</div>
        </div>
      </div>
      <div class="advantage color-333" v-else>
        <div class="topTitle color-this">{{ $t('index.special') }}</div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-user-icTron.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.tronExperience') }}</div>
          <div class="tip">{{ $t('index.tronExperienceTip1') }}</div>
          <div class="tip">{{ $t('index.tronExperienceTip2') }}</div>
          <div class="tip" v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">{{ $t('index.tronExperienceTip3') }}</div>
        </div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-security-icTron.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.tronSafe') }}</div>
          <div class="tip">{{ $t('index.tronSafeTip1') }}</div>
          <div class="tip">{{ $t('index.tronSafeTip2') }}</div>
          <div class="tip" v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">{{ $t('index.tronSafeTip3') }}</div>
        </div>
        <div class="item">
          <img v-if="loadedPage" src="https://nds.340wan.com/static/img/index/homepage-open-ic.png" alt="" class="img">
          <div class="itemTitle color-this">{{ $t('index.tronData') }}</div>
          <div class="itemTitle color-this" v-if="$store.state.app.language === 'en'
          || $store.state.app.language === 'ko'">{{ $t('index.tronData2') }}</div>
          <div class="tip">{{ $t('index.tronDataTip1') }}</div>
          <div class="tip">{{ $t('index.tronDataTip2') }}</div>
          <div class="tip" v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">{{ $t('index.tronDataTip3') }}</div>
        </div>
      </div>
    </div>

    <!-- 优势 end -->
</template>

<script>
// fromData 转 string
export default {
  props: ['loadedPage']
};
</script>

<style lang="scss" scoped>

// advantage优势 样式
.advantage{
  text-align: center;
  padding: .6rem .36rem .82rem .36rem;
  background: #fff;
  border-top: .06rem solid #f3f3f3;

  .topTitle{
    font-size: 0.42rem;
  }

  .item{
    margin-bottom: .6rem;
    font-size: .28rem;
    &:last-child{
      margin-bottom: 0;
    }

    .itemTitle{
      font-size: .32rem;
      margin: .09rem 0rem;
    }

    .img{
      padding: 0.8rem 0rem .1rem 0rem;
      max-width: 65%;
    }
    .tip{
      margin-bottom: .1rem;
    }
  }
}
</style>
