<template>
  <div class="popup">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="mainTitle">{{ $t('apiTrade.contactSponsor') }}</div>
    <div class="content">
      <div class="title">{{ $t('apiTrade.contactTitle1') }}</div>
      <div class="content1">
        <div>{{ $t('apiTrade.contactContent1') }}</div>
        <div class="btn" @click="handleToForm">{{ $t('more.form') }}</div>
      </div>
      <div class="title">{{ $t('apiTrade.contactTitle2') }}</div>
      <div class="content2">
        <div>{{ $t('apiTrade.contactContent2_1') }}</div>
        <div class="email">{{ $t('apiTrade.contactContent2_2') }}support@newdex.zendesk.com</div>
      </div>
      <div class="title">{{ $t('apiTrade.sponsorshipCanGet') }}</div>
      <div class="content2">
        <div>{{ $t('apiTrade.sponsorshipCanGet1') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet2') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet3') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet4') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet5') }}</div>
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
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    // 提交工单
    handleToForm() {
      if (this.changeLanguage) {
        return;
      }
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.net/hc/ko/requests/new';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.net/hc/zh-cn/requests/new';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.net/hc/zh-tw/requests/new';
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us/requests/new';
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/public.scss";

.popup{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .17rem;
  width: 7rem;
  text-align: center;
  position: relative;
  color: $color-333;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .mainTitle{
    font-size: .32rem;
    color: #4A90E2;
  }

  .content{
    text-align: left;
    margin-top: .3rem;

    .title{
      font-size: .3rem;
      color: #4A90E2;
    }
    .content1{
      margin-top: .1rem;
      margin-bottom: .44rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      &>div:last-child{
        font-size: .24rem;
      }

      .btn{
        color: #26ADFC;
        border: 1px solid #26ADFC;
        border-radius: .1rem;
        height: .57rem;
        width: 1.28rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .content2{
      margin-top: .2rem;
      margin-bottom: .4rem;

      .email{
        white-space: nowrap;
      }

      &:last-child{
        margin-bottom: 0rem;
      }

      &>div{
        margin-top: .06rem;
      }
    }
  }
}
</style>
