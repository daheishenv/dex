<template>
  <div id="appLayout" class="layout" :class="{'layout-market': $route.name === 'market'}">
    <!-- nav -->
    <!-- <div class="nav"
      v-if="$route.name !== 'index' && $route.name !== 'coinHistoryList' &&
        (($store.state.app.channel==='meetone' && isAndroid))">
      <head-nav />
    </div> -->
    <!-- 空div 占位 -->
    <!-- <div style="height: .9rem;"
      v-if="$route.name !== 'index' && $route.name !== 'coinHistoryList' &&
        (($store.state.app.channel==='meetone' && isAndroid))"></div> -->

    <!-- 主视图 -->
    <div class="layoutMainView" :class="{'noTabbar': !showTabbar || $route.name === 'order', 'layoutMainViewIndex': $route.name === 'index'}">
      <transition name="fade" mode="out-in">
        <router-view
          ref="routeView"
          :loadedPage="loadedPage"
          @listenShowPopTip="handleShowPopTip"
          @listenShowEventsList="handleShowEventsList"/>
      </transition>
    </div>

    <!-- M站切换链入口 -->
    <div v-if="channelRef === 'h5' && isAllEntu && !$store.state.sys.isAppView">
      <choose-chain @listenClose="listenClose" />
    </div>
    <!-- 公告弹窗 start -->
    <mt-popup
      class="popup"
      v-model="showPop"
      popup-transition="popup-fade">
      <div class="popTip" v-if="showPop">
        <span class="iconfont icon-huaban17 close" @click="showPop = false"></span>
        <div class="popTitle">{{ specialNew.title }}</div>
        <div class="popContent" v-html="specialNew.body"></div>
        <a :href="specialNew.htmlUrl" class="popMore">{{ $t('index.viewNow') }}</a>
      </div>
    </mt-popup>
    <!-- 公告弹窗 end -->
    <!-- 活动弹窗 start -->
    <template v-for="(item, $index) in eventsList">
      <div
        :key="$index"
        v-if="item.show"
        @click="handleCloseEvents($index)"
        class="popupEvents">
        <div class="events" :class="{'errorbg': item.error}">
          <span class="iconfont popupClose"
            @click.stop="handleCloseEvents($index)">
            <img class="closeImg" src="https://nds.340wan.com/static/img/index/eventsClose.png" alt="">
          </span>
          <img :class="{'errorImg': item.error}" :src="item.imageUrl" @click="handleToHref(item.eventUrl)"
            :onerror="errorImg" @error="handleImgError($index)">
          <div class="errorTip" v-if="item.error">{{ $t('index.eventsImgError') }}</div>
        </div>
      </div>
    </template>
    <!-- 活动弹窗 end -->
  </div>
</template>

<script>
import { GetUrlPara } from '@/utils/public';
import ChooseChain from './ChooseChain'
import { Popup } from 'mint-ui';

export default {
  name: 'layout',
  data() {
    return {
      errorImg: 'this.src="https://nds.340wan.com/static/img/error/eventsImgError.png"', // 错误图片地址
      isAndroid: false,
      channelRef: 'dapp',
      isAllEntu: false,
      showPop: false,
      specialNew: {},
      eventsList: [],
    }
  },
  props: ['loadedPage'],
  computed: {
    showTabbar() {
      return !this.$route.meta.noTabbar && this.channelRef === 'dapp' && this.$store.state.sys.otcToShowBar && !this.$embed
    }
  },
  created() {
    this.isAndroid = GetUrlPara().system_name === 'Android';
    localStorage.setItem('isAndroid', this.isAndroid);
    this.channelRef = localStorage.getItem('channelRef');
    const host = location.host;
    const index = host.indexOf('m.newdex.'); // 正式
    // const index = host.indexOf('192.168.8.253'); // 本地测试
    if (index !== -1) {
      this.isAllEntu = false;
    }
  },
  components: {
    ChooseChain,
    mtPopup: Popup
  },
  methods: {
    // 图片错误处理
    handleImgError(index) {
      this.eventsList[index].error = true;
    },
    handleToHref(eventUrl) {
      this.$refs.routeView.handleToHref(eventUrl);
    },
    // 关闭活动弹窗
    handleCloseEvents(index) {
      this.eventsList[index].show = false;
      localStorage.setItem('eventsPopupList', JSON.stringify(this.eventsList))
    },
    handleShowEventsList(data) {
      if (this.$route.name !== 'index') {
        return;
      }
      this.eventsList = data;
    },
    handleShowPopTip(data) {
      if (this.$route.name !== 'index') {
        return;
      }
      this.showPop = true;
      this.specialNew = data;
    },
    listenClose() {
      this.isAllEntu = false;
    }
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";
@import '../../assets/css/swiper.min.css';

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .layoutMainView{
    height: calc(100vh - 1.5rem) !important;
    &.noTabbar {
      height: calc(100vh - .5rem) !important;
    }
  }
}

.nav{
  position: fixed;
  width: 100%;
  max-width: 750px;
  z-index: 1000;
}

.layout{
  // height: 100vh;
  // overflow: auto;
  // border: 1px solid #f00;

  .layoutMainView{
    // border: 1px solid #f00;
    height: calc(100vh - 1rem);
    overflow: auto;

    &.layoutMainViewIndex {
      height: auto;
      padding-bottom: 1rem;
    }

    &.noTabbar {
      height: auto;
      overflow: visible;
    }
  }
}
// 弹窗style
.popTip{
  width: 6.1rem;
  height: 6.7rem;
  box-sizing: border-box;
  text-align: center;

  .close{
    position: absolute;
    color: $color-999;
    font-size: .2rem;
    right: .2rem;
    top: .2rem;
  }

  &>div{
    max-width: 5.25rem;
    margin: auto;
  }

  .popTitle{
    font-size: .36rem;
    color: $color-this;
    margin-top: .39rem;
    overflow: hidden;
    height: .5rem;
    width: 5.25rem;
    white-space: nowrap;
    word-break: normal;
    text-overflow: ellipsis;
  }
  .popContent{
    font-size: .28rem;
    height: 3.8rem;
    margin-top: .31rem;
    text-align: left;
    overflow: auto;
    word-wrap:break-word;
  }
  .popMore{
    width: 5.25rem;
    margin: auto;
    font-size: .27rem;
    margin-top: .58rem;
    background: $color-this;
    height: .8rem;
    display: flex;
    color: #FFF;
    border-radius: .12rem;
    align-items: center;
    justify-content: center;
  }
}
.popupEvents{
  position: fixed;
  height: 100%;
  width: 100%;
  max-width: 750px;
  z-index: 1000;
  top: 0px;
  background: rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;

  .events{
    position: relative;
    width: 6rem;
    // height: 5.5rem;
    border-radius: .08rem;
    // overflow: hidden;

    &.errorbg{
      background: #FFF;
    }

    .popupClose{
      font-size: .22rem;
      position: absolute;
      right: 50%;
      transform: translate(50%, 0);
      bottom: -.8rem;
      height: .56rem;
      width: .56rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #FFF;
      border-radius: 10rem;

      &.errorClose{
        opacity: 1;
      }

      .closeImg{
        width: .27rem;
      }
    }
    img{
      display: block;
      width: 100%;

      &.errorImg{
        width: 2.81rem;
        height: 2.62rem;
        margin: 1.04rem auto .36rem;
      }
    }

    .errorTip{
      font-size: .27rem;
      color: $color-999;
      text-align: center;
      padding-bottom: 1.1rem;
    }
  }
}
</style>
