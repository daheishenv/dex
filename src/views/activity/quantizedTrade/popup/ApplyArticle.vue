<template>
  <div class="popup">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup(false)"></span>
    <div class="mainTitle">{{ $t('apiTrade.submitNews') }}</div>
    <!-- 表单 -->
    <div class="form">
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.projectName') }}</span>
          <span class="color-red">*</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="255"
            :class="{'notNull': regError && !form.title.trim()}" type="text" v-model="form.title">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('apiTrade.projectInfo') }}</span>
          <span class="color-red">*</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <input class="input"
            :class="{'notNull': regError && !form.intro.trim()}" type="text" v-model="form.intro">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('apiTrade.projectSource') }}</span>
          <span class="color-red">*</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="100"
            :class="{'notNull': regError && !form.source.trim()}" type="text" v-model="form.source">
        </div>
      </div>
      <div class="applyBtn" @click="handleApply">{{ $t('influencer.shortSubmit') }}</div>
    </div>
    <!-- 提示 -->
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
      <!-- <div class="title">{{ $t('apiTrade.sponsorshipCanGet') }}</div>
      <div class="content2">
        <div>{{ $t('apiTrade.sponsorshipCanGet1') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet2') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet3') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet4') }}</div>
        <div>{{ $t('apiTrade.sponsorshipCanGet5') }}</div>
      </div> -->
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {
        title: '',
        intro: '',
        source: '',
      },
      regError: false,
    }
  },
  methods: {
    handleClosePopup(type) {
      this.$emit('listenClose', type);
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
    handleReg() {
      if (!this.form.title.trim() || !this.form.intro.trim() || !this.form.source.trim()) {
        this.regError = true;
        return false;
      }
      this.regError = false;
      return true
    },
    handleApply() {
      // 申请
      if (!this.handleReg()) {
        return;
      }
      const params = {
        eventCode: 'api-trade',
        title: this.form.title,
        introduction: this.form.intro,
        media: this.form.source
      }
      this.$http.post('/eventArticle/submit', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.handleClosePopup(true);
        this.form = {
          title: '',
          intro: '',
          source: '',
        }
      });
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

  .form{
    text-align: left;
    margin: auto;
    padding-top: .38rem;

    .item{
      margin-bottom: .18rem;

      .subTitle{
        margin-bottom: .21rem;

        .tip{
          color: $color-999;
          font-size: .25rem;
        }
      }
      .inputDiv{
        position: relative;

        // 筛选框
        .selectMenu{
          background: white;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          width: 100%;
          position: absolute;
          left: 0rem;
          top: 1rem;
          border-radius: .13rem;
          box-sizing: border-box;
          z-index: 1000;

          &::after{
            content: '';
            border: .1rem solid white;
            position: absolute;
            top: -.1rem;
            box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
            transform: rotate(45deg);
            right: .3rem;
          }

          .scroll{
            z-index: 1000;
            position: relative;
            max-height: 4.6rem;
            overflow: auto;
            padding: 0rem .33rem;
            background: white;
            border-radius: .13rem;
          }

          .select{
            position: relative;
            z-index: 10;;
            background: #FFF;
            font-size: .25rem;

            &>div{
              font-size: .27rem;
              position: relative;
              height: .9rem;
              border-bottom: 1px solid $color-e3e3e3;
              display: flex;
              align-items: center;
              box-sizing: border-box;

              &:last-child{
                border-bottom: 0px solid $color-e3e3e3;
              }
            }
          }
        }
      }
      .input{
        width: 100%;
        height: .8rem;
        border: 1px solid $color-input;
        background: #FFFFFF;
        border-radius: .0694rem;
        font-size: .3rem;
        padding-left: .21rem;
        box-sizing: border-box;

        &.notNull{
          border: 1px solid red;
        }
      }

      .chain{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .down{
          border: .1rem solid transparent;
          border-top: .1rem solid $color-333;
          position: absolute;
          right: .3rem;
          top: 50%;
          transform: translate(0, -25%);

          &.up{
            top: 30%;
            transform: translate(0, 0%) rotate(180deg);
          }
        }
      }
    }

    .applyBtn{
      margin-top: .3rem;
      background: $color-this;
      border-radius: .08rem;
      color: #FFF;
      height: .8rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
