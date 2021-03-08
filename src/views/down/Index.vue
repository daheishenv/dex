<template>
  <div class="down">
    <!-- 类toast弹窗 start -->
    <transition name="slide-fade">
      <div class="toastDiv" v-if="showCopyType">
        <div>{{ $t('down.copyToBrowser1') }}</div>
        <div>{{ $t('down.copyToBrowser2') }}</div>
      </div>
    </transition>
    <!-- 类toast弹窗 end -->
    <div class="bgColor"></div>
    <div class="MainContent">
      <div v-if="channelRef === 'h5'" class="fr langu">
        <language/>
      </div>
      <div class="content">
        <div class="logo">
          <img src="https://nds.340wan.com/static/img/download/logo.png" alt="">
        </div>
        <!-- <div style="position: relative;">
          <span class="bgSpan"></span>
          <span class="iconfont icon-huaban53 icon"></span>
        </div>
        <div class="newdexDiv">
          <span class="iconfont icon-huaban56 newdex"></span>
        </div> -->
        <div class="tip title" :class="{'enTip': $store.state.app.language === 'en'}">{{ $t('index.bannerTitle') }}</div>
        <!-- 中文显示 -->
        <div class="tip tipList" :class="{'ko': $store.state.app.language === 'ko'}"
          v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
          <div class="item">{{ $t('down.noRecharge') }}</div>
          <div class="item">{{ $t('down.noPutForward') }}</div>
          <div class="item">{{ $t('down.safe') }}</div>
          <div class="item">{{ $t('down.public') }}</div>
        </div>
        <!-- 英文 & 韩语 显示 -->
        <div v-else>
          <div class="tip tipList" :class="{'ko': $store.state.app.language === 'ko'}">
            <div class="item">{{ $t('down.noRecharge') }}</div>
            <div class="item">{{ $t('down.noPutForward') }}</div>
          </div>
          <div class="tip tipList" :class="{'ko': $store.state.app.language === 'ko'}">
            <div class="item">{{ $t('down.safe') }}</div>
            <div class="item">{{ $t('down.public') }}</div>
          </div>
        </div>

        <div>
          <a v-if="channelRef === 'h5'" href="javascript:;" class="downBtn" @click="handleDown">{{ $t('down.startInstall') }}</a>
          <a v-else href="javascript:;" class="downBtn"
            v-clipboard:copy="'https://app.newdex.vip'"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">{{ $t('down.copyToDown') }}</a>
          <a :href="url" ref="download"></a>
        </div>
      </div>

      <!-- 下载操作 start -->
      <div class="downStep" v-if="channelRef === 'dapp'">
        <div class="downTitle">{{ $t('down.downStepTitle') }}</div>
        <div class="downContent">
          <div class="subTitle">{{ $t('down.downStep1') }}</div>
          <div>
            <img v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
              width="100%" src="https://nds.340wan.com/static/img/download/downStep1.png">
            <img v-else width="100%" src="https://nds.340wan.com/static/img/download/downStep1-en.png">
          </div>
          <div class="subTitle">{{ $t('down.downStep2') }}</div>
          <div>
            <img width="100%" src="https://nds.340wan.com/static/img/download/downStep2.png">
          </div>
          <div class="subTitle">{{ $t('down.downStep3') }}</div>
          <div>
            <img v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
              width="100%" src="https://nds.340wan.com/static/img/download/downStep3.png">
            <img v-else width="100%" src="https://nds.340wan.com/static/img/download/downStep3-en.png">
          </div>
          <div class="subTitle">{{ $t('down.downStep4') }}</div>
          <div>
            <img v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
              width="100%" src="https://nds.340wan.com/static/img/download/downStep4.png">
            <img v-else width="100%" src="https://nds.340wan.com/static/img/download/downStep4-en.png">
          </div>
        </div>
      </div>
      <!-- 下载操作 end -->

      <!-- ios安装操作 start -->
      <div class="iosInstall" v-if="isIOS && channelRef === 'h5'">
        <div class="tip">{{ $t('down.iosTip1') }}</div>
        <div class="tip bold">{{ $t('down.iosTip2') }}</div>
        <div class="tip">{{ $t('down.iosTip3') }}</div>
        <div class="imgOutDiv">
          <img v-if="$store.state.app.language === 'zh-CN'" width="100%"
          src="https://nds.340wan.com/static/img/download/downloadTip1.png" alt="">
          <img v-if="$store.state.app.language === 'zh-TW'" width="100%"
          src="https://nds.340wan.com/static/img/download/downloadTip1-Tw.png" alt="">
          <img v-if="$store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'"
            width="100%"
            src="https://nds.340wan.com/static/img/download/downloadTip1-En.png" alt="">
        </div>
        <div class="imgOutDiv">
          <img v-if="$store.state.app.language === 'zh-CN'" width="100%"
          src="https://nds.340wan.com/static/img/download/downloadTip2.png" alt="">
          <img v-if="$store.state.app.language === 'zh-TW'" width="100%"
          src="https://nds.340wan.com/static/img/download/downloadTip2-Tw.png" alt="">
          <img v-if="$store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'"
            width="100%"
            src="https://nds.340wan.com/static/img/download/downloadTip2-En.png" alt="">
        </div>
        <div class="tip" style="text-align: center;">{{ $t('down.iosTip4') }}</div>
      </div>
      <!-- ios安装操作 end -->

      <div class="footer">
        Copyright © 2018 Newdex Inc. All rights reserved.
      </div>
      <!-- 微信提示在浏览器打开 -->
      <div class="model" v-if="showWX">
        <div class="rightTopDiv">
          <span class="iconfont icon-huaban54 rightTop"></span>
        </div>
        <div class="modelTip">
          <div class="tipItem">
            <span>1.{{ $t('down.click1') }}</span>
            <span class="desc">
              <i class="more"></i><i class="more"></i><i class="more"></i>
            </span>
            <span>{{ $t('down.click2') }}</span>
          </div>
          <div class="tipItem">
            <span>2.{{ $t('down.choice') }}</span>
            <span class="desc"> <i class="iconfont icon-huaban55 openDev"></i> {{ $t('down.open') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isWeixn, isIOS } from '@/utils/public';
import Language from '@/components/Language';

export default {
  data() {
    return {
      showWX: false,
      downUrls: {
        android: 'https://download.newdex.io/newdex-v1.4.0.apk',
        // android: 'https://www.pgyer.com/apiv2/app/install?_api_key=4f11f669cee5cd2fb3cbd382fd9ce147&appKey=bda86d1309ab7b66751d5d3d644fa1f3',
        ios: 'itms-services://?action=download-manifest&url=https%3a%2f%2fdownload.newdex.io%2fnewdex-v1.4.0.plist',
      },
      url: '',
      isIOS: false,
      channelRef: 'dapp',
      showCopyType: false,
      timer: null,
    }
  },
  components: {
    Language,
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
    const isIos = isIOS();
    this.isIOS = isIos;
    if (isIos) {
      this.handleIosUrl()
    } else {
      this.handleAndroidUrl()
    }
  },
  methods: {
    /* 复制保存账户信息 start */
    onCopy() {
      this.showCopyType = true;
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        this.showCopyType = false;
      }, 2000);
    },
    onError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    },
    /* 复制保存账户信息 end */
    handleDown() {
      const isWX = isWeixn();
      if (isWX) {
        this.showWX = true;
        return;
      }
      if (!this.url) {
        setTimeout(() => {
          this.handleDown();
        }, 200);
        return;
      }
      this.$refs.download.click();
    },
    // 获取安卓url地址
    handleAndroidUrl() {
      this.$http.get('/version/android').then((res) => {
        if (res.code !== 0) {
          setTimeout(() => {
            this.handleAndroidUrl();
          }, 200);
          return;
        }
        this.url = res.walletVersion.updateUrl;
      })
    },
    // 获取安卓url地址
    handleIosUrl() {
      this.$http.get('/version/ios').then((res) => {
        if (res.code !== 0) {
          setTimeout(() => {
            this.handleIosUrl();
          }, 200);
          return;
        }
        this.url = res.walletVersion.updateUrl;
      })
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.timer);
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.mt10{
  margin-top: .2rem !important;
}

.down{
  // background: linear-gradient(to bottom, #3248CA, #0C186D);
  // background: linear-gradient(1deg, rgba(120,156,250,0.00) 0%, rgba($color: #4276ED, $alpha: 0.76) 100%);
  min-height: 100vh;
  font-size: .32rem;
  text-align: center;
  position: relative;
  color: #FFF;

  .bgColor{
    position: absolute;
    height: 100vh;
    width: 100%;
    z-index: 0;
    background: linear-gradient(1deg, rgba(120,156,250,0.00) 0%, rgba($color: #4276ED, $alpha: 0.76) 100%);
  }

  .MainContent{
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .langu{
    margin: .5rem .25rem 0rem 0rem;
    z-index: 888;
    // border: 1px solid white;
    border-radius: .14rem;
  }

  .content{
    padding-top: 1.6rem;

    .logo{
      margin: auto;
      width: 3.32rem;
      margin-bottom: .8rem;
      img{
        width: 100%;
      }
    }

    .bgSpan{
      position: absolute;
      top: 50%;
      left: 50%;
      background: #0069FF;
      height: 1.65rem;
      width: 1.65rem;
      transform: translate(-50%, -50%);
      z-index: 0;
      border-radius: 50%;
    }

    .icon{
      // background: #0069FF;
      position: relative;
      z-index: 1;
      font-size: 1.8rem;
      border-radius: 50%;
    }

    .newdexDiv{
      margin: .31rem 0px .57rem 0px;
      color: #0069FF;

      .newdex{
        font-size: .57rem;
      }
    }

    .tip{
      // color: rgba($color: #FFF, $alpha: .78);
      color: #000;
      margin: auto;
    }

    .title{
      max-width: 6rem;
      font-size: .38rem;
      margin-bottom: .1rem;
    }

    .enTip{
      max-width: 6.8rem;
      font-size: .34rem;
    }

    .tipList{
      // margin-top: .1rem;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;/*水平居中*/

      .item{
        display: flex;
        align-items: center;/*垂直居中*/
        font-size: .3rem;
        padding: .05rem 0.09rem;
        position: relative;

        &::after{
          content: '';
          border-right: 1px solid rgba($color: #000, $alpha: .78);
          height: .16rem;
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translate(0px, -45%);
        }

        &:last-child::after{
          border: 1px solid transparent;
        }
      }

      .item1{
        display: flex;
        align-items: center;/*垂直居中*/
        font-size: .3rem;
        padding: .05rem 0.2rem;
        position: relative;
      }
    }

    .ko{
      margin-top: .1rem;
    }

    .downBtn{
      margin-top: .73rem;
      // border: 1px solid #FFF;
      background: #0069FF;
      border-radius: .14rem;
      display: inline-block;
      width: 5.9rem;
      height: 1rem;;
      line-height: 1rem;
      color: #FFF;
    }
  }

  .iosInstall{
    padding: 1.7rem .7rem 2rem .7rem;
    width: 6.09rem;
    margin: auto;
    color: #000;

    .tip{
      text-align: left;
      font-size: .28rem;
      margin: .22rem 0px;

      &.bold{
        font-size: .32rem;
        color: #0069FF;
      }
    }

    .imgOutDiv{
      margin: .44rem 0px;
    }
  }

  .footer{
    position: absolute;
    bottom: .75rem;
    font-size: .2rem;
    width: 100%;
    text-align: center;
    color: $color-999;
  }

  .model{
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    background: rgba($color: #000000, $alpha: 0.76);
    padding-top: .32rem;

    .rightTopDiv{
      overflow: hidden;

      .rightTop{
        font-size: 1.64rem;
        float: right;
        margin-right: .68rem;
      }
    }

    .modelTip{
      padding-top: .58rem;
      font-size: .38rem;
      padding-left: 1.37rem;
      text-align: left;

      .tipItem{
        position: relative;
        display: flex;
        align-items: center;/*垂直居中*/

        &:last-child{
          margin-top: .5rem;
        }

        .desc{
          margin: 0px .15rem;
          background: #FFF;
          color: #333;
          border-radius: .1rem;
          padding: 0rem .25rem;
          height: .6rem;;
          display: flex;
          align-items: center;/*垂直居中*/

          &:last-child{
            height: .68rem;;
          }

          .more{
            border-radius: .05rem;
            background: #000;
            border: .05rem solid black;
            margin: 2px;
          }

          .openDev{
            font-size: .5rem;
            margin-right: .1rem;
          }
        }

      }
    }
  }
}

.downStep{
  width: 6.26rem;
  margin: auto;
  padding-top: 1.57rem;
  padding-bottom: 1rem;

  .downTitle{
    color: #0069FF;
    font-size: .36rem;
    margin-bottom: .24rem;
    text-align: left;
  }

  .downContent{

    .subTitle{
      font-size: .28rem;
      color: $color-333;
      text-align: left;
    }
    img{
      margin-bottom: .6rem;
      margin-top: .2rem;
    }
  }
}

.toastDiv{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  padding: .14rem .44rem;
  border-radius: .1rem;
  white-space: nowrap;

  &>div{
    margin-top: .1rem;

    &:first-child{
      margin-top: 0rem;
    }
  }
}
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s;
  opacity: 1;
}
.slide-fade-leave-active {
  transition: all .5s;
}
.slide-fade-enter, .slide-fade-leave-to{
  opacity: 0;
}

</style>
