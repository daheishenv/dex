<template>
  <div class="foolDay">
    <div class="top">
      <img src="https://nds.340wan.com/static/img/activity/FoolDay/top.png" alt="">
    </div>
    <div class="content">
      <img  v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
        src="https://nds.340wan.com/static/img/activity/FoolDay/content.png" alt="">
      <img v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'"
        src="https://nds.340wan.com/static/img/activity/FoolDay/content-en.png" alt="">
      <div class="abs-content" :class="{'scaleBig': scaleBig,
        'abs-content-en': $store.state.app.language === 'en' || $store.state.app.language === 'ko'}">
        <div :class="{'scaleBig': scaleBig}" @click="scaleBig = !scaleBig">
          <img :src="imgObj ? imgObj.url : ''" alt="">
          <div class="account" :class="{'special': imgObj ? imgObj.type === '1' : false}"
            >{{ accountName || '' }}</div>
        </div>
      </div>
      <div class="content-footer">
        <div class="btn" @click="handleRandom">{{ $t('foolDay.changeOne') }}</div>
        <div class="tip">
          <span v-if="imgObj ? imgObj.type === '1' : false">{{ $t('foolDay.share1') }}</span>
          <span v-if="imgObj ? imgObj.type === '2' : false">{{ $t('foolDay.share2') }}</span>
          <span v-if="imgObj ? imgObj.type === '3' : false">{{ $t('foolDay.share2') }}</span>
          <span v-if="imgObj ? imgObj.type === '4' : false">{{ $t('foolDay.share4') }}</span>
        </div>
      </div>
    </div>
    <div class="rules">
      <div>
        <div class="rulesTitle">{{ $t('foolDay.stepTitle') }}</div>
        <div v-if="!($store.state.app.language === 'en' || $store.state.app.language === 'ko')">
          <div class="tip tipCN">
            <span>{{ $t('foolDay.step1') }}</span>
            <span>{{ $t('foolDay.step2') }}</span>
          </div>
          <div class="tip tipCN">
            <span>{{ $t('foolDay.step3') }}</span>
            <span>{{ $t('foolDay.step4') }}</span>
          </div>
        </div>
        <div v-if="($store.state.app.language === 'en' || $store.state.app.language === 'ko')">
          <div class="tip">
            <span>{{ $t('foolDay.step1') }}</span>
          </div>
          <div class="tip"><span>{{ $t('foolDay.step2') }}</span></div>
          <div class="tip">
            <span>{{ $t('foolDay.step3') }}</span>
          </div>
          <div class="tip"><span>{{ $t('foolDay.step4') }}</span></div>
        </div>
      </div>

      <div class="subTip">
        <div class="subTipContent">
          <div class="tip1">{{ $t('foolDay.tip1') }}</div>
          <div class="tip1">{{ $t('foolDay.tip2') }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [],
      imgObj: null,
      scaleBig: false,
      accountName: false,
    }
  },
  mounted() {
    this.handleGetImgList();
    this.handleGetAccountName();
  },
  methods: {
    handleGetAccountName() {
      try {
        const accountName = this.$store.state.app.accountInfo.account;
        if (accountName.length === 12) {
          const str = accountName.substr(3, 6);
          this.accountName = accountName.replace(str, '******');
        } else {
          const str = accountName.substr(Math.floor(accountName.length / 2));
          this.accountName = accountName.replace(str, '******'.substr(Math.floor(0, accountName.length / 2)));
        }
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountName()
        }, 200);
      }
    },
    // 获取img列表
    handleGetImgList() {
      this.$http.get('/fools/getImageUrl').then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.imgList = res.urlList;
        this.handleRandom()
      });
    },
    // 选取一张
    handleRandom() {
      const len = this.imgList.length;
      const index = parseInt(len * Math.random()); // eslint-disable-line
      if (index < len) {
        const url = this.imgList[index];
        const urlArr = url.split('https://newdex-pic.oss-cn-hongkong.aliyuncs.com/');
        const objArr = urlArr[1].split('/');
        this.imgObj = {
          url,
          lang: objArr[0],
          type: objArr[1]
        }
      } else {
        this.handleRandom();
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.foolDay{
  font-size: .32rem;
  position: relative;
  background: #2B2B6E;
  padding-bottom: .5rem;
  padding-top: 1.48rem;

  .top{
    position: absolute;
    top: 0px;

    img{
      width: 100%;
      max-width: 750px;
    }
  }

  .content{
    position: relative;
    text-align: center;

    img{
      width: 7.03rem;
      max-width: 703px;
    }

    .abs-content{
      position: absolute;
      background: #FFF;
      width: 5rem;
      height: 9.6rem;
      top: 2.58rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: .1rem;
      text-align: center;
      padding: .1rem 0px;
      box-sizing: border-box;

      &.abs-content-en{
        top: 3.58rem;
      }

      &.scaleBig,
      .scaleBig{
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        height: 100%;
        width: 100%;
        transform: translateX(0);
        z-index: 100;
        overflow: auto;
        padding: 0rem 0px;

        img{
          width: 100%;
        }

        .account{
          position: absolute;
          font-size: .45rem;
          top: 2.3rem;
          left: 50%;
          transform: translateX(-50%);

          &.special{
            color: #F6C85C;
          }
        }
      }

      img{
        width: 4.57rem;
      }

      .account{
        position: absolute;
        font-size: .29rem;
        top: 1.45rem;
        left: 50%;
        transform: translateX(-50%);

        &.special{
          color: #F6C85C;
        }
      }
    }

    .content-footer{
      position: absolute;
      bottom: .35rem;
      // top: 12.35rem;
      width: 7.03rem;
      transform: translateX(-50%);
      left: 50%;

      .btn{
        background: #F5373C;
        border-radius: .186rem;
        margin: auto;
        width: 2.57rem;
        height: .75rem;
        color: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .13rem;
      }

      .tip{
        font-size: .25rem;
        color: #8B572A;
      }
    }
  }

  .rules{
    padding-top: .3rem;
    font-size: .24rem;
    width: 6.2rem;
    margin: auto;
    color: #FFF;

    .rulesTitle{
      text-align: center;
      font-size: .32rem;
      padding-bottom: .1rem;
    }

    .tip{
      padding-left: .7rem;
      margin-top: .05rem;

      &.tipCN{
        padding-left: 0rem;
        text-align: center
      }
    }

    .subTip{
      margin-top: .3rem;
      font-size: .21rem;
      text-align: center;

      .subTipTitle{
        margin-bottom: .1rem;
      }

      .tip1{
        margin: .04rem;
      }
    }
  }
}
</style>
