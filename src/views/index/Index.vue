<template>
  <div class="page-index" ref="indexScroll">
    <!-- swiper start -->
    <div class="topBannar">
      <!-- h5 头部导航 -->
      <div class="h5Div"><h5-nav v-if="channel === 'h5'" /></div>
      <div class="swiper-container swiper-container_index" :class="{'h5Height': channel === 'h5'}">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="!bannerList.length">
            <div class="banner">
              <div class="center">
                <div class="iconfont icon-huaban23 logoIcon"></div>
                <div class="bannerTitle">{{$t('index.bannerTitle')}}</div>
              </div>
            </div>
          </div>
          <!-- bannerList 展示 -->
          <template v-if="bannerList.length">
            <template v-for="(item, $index) in bannerList" >
              <div class="swiper-slide"
                @click="handleToHref(item.eventUrl, item)" v-if="item.imageUrl" :key="$index">
                <div class="bannerActivityImg"
                  :class="{'en': $store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'}">
                  <img :src="item.imageUrl" width="100%">
                </div>
              </div>
            </template>
          </template>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination swiper-pagination_index"></div>
      </div>
    </div>
    <!-- swiper end -->

    <!-- notice start -->
    <div class="paddNotice">
      <div class="noticeDiv">
        <div class="notice">
          <div class="noticeTool fl">
            <span class="color-this">{{ $t('index.news')}}: </span>
          </div>
          <div class="noticeItem fl" id="notice">
            <div class="notices" v-for="(item, index) in noticeList" :key="index">
              <div class="noti-item">
                <a class="noticeLink" :href="item.htmlUrl">{{ item.title }}</a>
              </div>
            </div>
            <div class="notices" v-for="(item, index) in noticeList" :key="index + '1'">
              <div class="noti-item">
                <a class="noticeLink" :href="item.htmlUrl">{{ item.title }}</a>
              </div>
            </div>
          </div>
          <div class="noticeMore" @click="handleNoticeToMore">{{ $t('public.more') }}</div>
        </div>
      </div>
    </div>
    <!-- notice end -->

    <!-- accountInfo start -->
    <div class="accountInfo" v-if="channel === 'dapp'">
      <Account />
    </div>
    <!-- accountInfo end -->

    <!-- Newpos - 矿池 start -->
    <div class="candyBox" v-if="showPos">
      <NewposEntrance />
    </div>
    <!-- Newpos - 矿池 end -->

    <!-- 推荐币种 -->
    <RecommendCoin />
    <!-- 推荐币种 -->

    <!-- content table start -->
    <div class="content">
      <div class="contentTop" style="width:100%">
        <div class="item" :class="{'activeThis': activeIndex === 1}" @click="handleActiveChange(1)">
          {{ $t('index.riseList') }}
        </div>
        <div class="item" :class="{'activeThis': activeIndex === 2}" @click="handleActiveChange(2)">
          <span v-if="$store.state.app.language !== 'ko'">24H{{ $t('index.turnoverList') }}</span>
          <span v-if="$store.state.app.language === 'ko'">{{ $t('quotation.num') }}</span>
        </div>
      </div>
      <div class="data">
        <table-list :activeIndex="activeIndex" :activeObj="activeObj"/>
      </div>
      <div class="more">
        <a href="javascript:;" class="color-blue" @click="handleToMore">{{ $t('index.more') }}&gt;</a>
      </div>
    </div>
    <!-- content table end -->
    <!-- advantage 优势 -->
    <!-- <advantage :loadedPage="loadedPage"></advantage> -->
    <Content :loadedPage="loadedPage"/>

    <Footer :isScroll="isScroll" v-if="loadedPage"/>
    <!-- footer end -->

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
    <!-- 公告弹窗 start -->

    <!-- <div v-for="(item, $index) in eventsList"
      :key="$index"
      v-show="item.show"
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
    </div> -->
    <!-- 活动弹窗 end -->
    <!-- 选择充提弹窗 -->
    <mt-popup
      v-model="chargingChange"
      class="popup"
      popup-transition="popup-fade">
      <charging-change
        v-if="chargingChange"
        @listenClose="handleClose"
        :symbolCoin="symbolCoin"/>
    </mt-popup>
  </div>
</template>

<script>
import Swiper from 'swiper';
// import 'swiper/dist/css/swiper.css';
import TableList from '@/components/TableList';
import Account from '@/components/Account';
import Footer from '@/components/Footer';
import { Popup } from 'mint-ui';
// import PopupFoolDay from '@/views/index/components/PopupFoolDay';
import NewposEntrance from '@/views/newpos/components/NewposEntrance';
import H5Nav from '@/views/index/components/H5Nav';
import moment from 'moment';
import RequestApi from '@/utils/requestApi';
import ChargingChange from '@/views/market/popup/ChargingChange'
import RecommendCoin from './components/RecommendCoin';
// import Advantage from './components/Advantage';
import Content from './Content';
  // fromData 转 string
export default {
  data() {
    return {
      errorImg: 'this.src="https://nds.340wan.com/static/img/error/eventsImgError.png"', // 错误图片地址
      activeIndex: 1, // 当前选中排行榜
      noticeList: [], // 公告
      specialNew: null, // 重要的公告
      showPop: false, // 公告弹窗
      lang: {
        active: 'zh-CN',
        list: [
          {
            name: '简体中文',
            value: 'zh-CN'
          },
          {
            name: 'English',
            value: 'en'
          },
          {
            name: '繁體中文',
            value: 'zh-TW'
          },
        ]
      },
      bannerList: [], // banner 列表
      swiper: null, // swiper对象
      timer: null, // 定时器
      timerout: null,
      box: null,
      isScroll: 0, // 28.21
      channel: 'dapp', // 方向
      activeObj: {
        key: 'EosMain',
        index: 0, // 当前选中排行榜
      },
      // 活动弹窗
      eventsPopup: true,
      eventsList: [],
      symbolCoin: 'ETH', // 充提币币种
      chargingChange: false, // 充提
    };
  },
  components: {
    TableList, // 列表
    // Language, // 语言
    Account, // 账户信息
    Footer,
    // PopupFoolDay,
    H5Nav,
    RecommendCoin,
    // Advantage,
    Content,
    ChargingChange,
    mtPopup: Popup,
    NewposEntrance, // 矿池入口
  },
  props: ['loadedPage'],
  watch: {
    '$store.state.app.language': function listen() {
      this.handleGetZendeskNote();
      this.handelBanner();
    },
    '$store.state.app.newsList': {
      handler: function listen(newVal) {
        this.noticeList = newVal;
        this.handleGetZendeskNote();
      },
      deep: true,
    }
  },
  computed: {
    showPos() {
      const account = this.$store.state.app.accountInfo;
      const show = account && (account.chain === 'eos' || account.chain === 'tron' || account.chain === 'bos')
      return show;
    }
  },
  created() {
    this.channel = localStorage.getItem('channelRef');
    this.specialNew = localStorage.getItem('specialNew') ? JSON.parse(localStorage.getItem('specialNew')) : null;
    this.handelBanner(); // banner 获取
    this.handleEvents(); // 获取活动 - 弹窗
  },
  mounted() {
    if (this.$appName === 'tronNewdex') {
      const keys = Object.keys(this.$store.state.sys.newArea)[1]
      this.activeObj = {
        key: keys,
        index: 0, // 当前选中排行榜
      }
    }
    this.handleGetZendeskNote(); // zendesk 列表处理
    this.box = this.$refs.indexScroll;
    this.box.addEventListener('scroll', this.listenScroll, false);
  },
  methods: {
    // 图片错误处理
    handleImgError(index) {
      this.eventsList[index].error = true;
    },
    // banner跳转
    async handleToHref(url, item) {
      if (!url) {
        return;
      }
      if (item) {
        await this.handleCountClick(item)
      }
      // console.log(url);
      if (url.indexOf('360041221711-Newdex-Lists-BTC-USDT-and-ETH-USDT') !== -1) {
        this.chargingChange = true;
        return;
      }
      // pdf链接处理
      if (url.indexOf('.pdf') !== -1) {
        this.$showPDF(url)
        return;
      }
      // 处理 m.newdex. 域名下链接
      if (url && (url.indexOf('https://m.newdex.') !== -1 || url.indexOf('https://m.tron.newdex.') !== -1)) {
        let urlArr1 = url.split('https://m.newdex.');
        if (url.indexOf('https://m.tron.newdex.') !== -1) {
          urlArr1 = url.split('https://m.tron.newdex.');
        }
        const urlArr = urlArr1[1].split('/');
        urlArr.shift(); // 删除域名结尾
        const urlStr = urlArr.join('/'); // 拼接成新路由
        if (urlArr.length > 0 && urlStr) {
          this.$router.push(`/${urlStr}`);
          return
        }
        if (urlStr) {
          this.$router.push(`/${urlStr}`);
          return;
        }
      }
      // 处理矿池跳转
      if (url && url.indexOf('https://dapp.newpool.') !== -1) {
        this.handleToNewPos(url);
        return;
      }
      location.href = url;
    },
    // 关闭弹窗
    handleClose() {
      this.showDetail = false;
      this.chargingChange = false;
    },
    // 跳转到矿池
    handleToNewPos(url) {
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const http = url.split('?')[0];
      const arr = http.split('dapp.newpool.')[1].split('/');
      let chain = 'eos';
      if (arr.length >= 2) {
        chain = arr[1];
      }
      window.location.href = `${http}?language=${lang}&chain=${chain}&channel=${channel}`
    },
    // 启动swiper
    handleSwiperStart() {
      if (this.$route.name !== 'index') {
        return;
      }
      // swiper
      this.swiper = new Swiper('.swiper-container_index', { // eslint-disable-line
        loop: true,
        autoplay: 3000,
        pagination: '.swiper-pagination_index',
        onClick: (swiper) => {
          const realIndex = swiper.realIndex;
          const eventUrl = this.bannerList[realIndex].eventUrl;
          this.handleToHref(eventUrl, this.bannerList[realIndex]);
        }
      })
    },
    async handleCountClick(item) {
      const params = {
        id: item.id,
        type: 1,
        ref: 'dapp'
      }
      await this.$http.post('/accessStatistics/statistics', params).then(() => {})
      return true
    },
    // 更多公告
    handleNoticeToMore() {
      const lang = this.$store.state.app.language;
      // 波场项目跳转地址
      if (this.$appName === 'tronNewdex') {
        if (lang !== 'en') {
          window.location.href = `https://support.newdex.net/hc/${lang.toLowerCase()}/categories/360002004831`;
          return;
        }
        window.location.href = 'https://support.newdex.net/hc/en-us/categories/360002004831';
        return;
      }
      // EOS项目跳转地址
      if (lang !== 'en') {
        window.location.href = `https://support.newdex.net/hc/${lang.toLowerCase()}/categories/360000802432`;
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us/categories/360000802432';
    },
    // 页面滚动
    listenScroll() {
      if (!this.$refs.indexScroll) {
        return
      }
      this.isScroll = this.$refs.indexScroll.scrollTop / ((screen.width / 750) * 100);
    },
    // 跳转重要公告
    handleToSpecialNotice(url) {
      this.specialNew.isLooked = true;
      localStorage.setItem('specialNew', JSON.stringify(this.specialNew));
      location.href = url;
    },
    // 排行 - 查看更多
    handleToMore() {
      this.$router.push({
        name: 'market',
        params: {
          type: this.activeIndex,
        }
      })
    },
    // 排行版切换
    handleActiveChange(index) {
      this.activeIndex = index;
    },
    // 公告滚动
    handleScroll() {
      const mainTop = document.getElementById('notice');
      if (!mainTop) {
        return;
      }
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      if (this.timerout) {
        window.clearTimeout(this.timerout);
      }
      this.timerout = window.setTimeout(() => {
        this.timer = window.setInterval(() => {
          mainTop.scrollTop += 1;
          // 错误处理
          if (!mainTop.getElementsByClassName('notices')[0]) {
            return;
          }
          const height = mainTop.getElementsByClassName('notices')[0].scrollHeight;
          if (mainTop.scrollTop >= height) {
            mainTop.appendChild(mainTop.getElementsByClassName('notices')[0]);
            mainTop.scrollTop -= height;
            this.handleScroll();
          }
        }, 25);
      }, 5000);
    },
    // zendesk 获取公告
    handleGetZendeskNote() {
      if (!this.$store.state.app.newsList.length) {
        return
      }
      // 特殊公告处理
      const specialList = this.$store.state.app.newsList.filter(v => v.isPop) || [];
      // console.log(this.$store.state.app.newsList)
      let specialNew = null;
      if (specialList.length) {
        specialNew = specialList[0];
        const localNews = localStorage.getItem('specialNew') ? JSON.parse(localStorage.getItem('specialNew')) : '';
        if (!localNews || localNews.articleId !== specialNew.articleId) {
          const nowTime = moment().format('YYYY-MM-DD HH:mm:ss'); // 当前时间
          const createdAt = moment(specialNew.created_at).format('YYYY-MM-DD HH:mm:ss'); // 文章发表时间
          // 发布时间距离现在不超过24小时 - 展示
          if ((moment(nowTime) - moment(createdAt)) / 3600000 < 24) {
            this.specialNew = specialNew;
            // this.showPop = true; // 显示弹窗 - 只有第一次
            this.$emit('listenShowPopTip', this.specialNew);
            localStorage.setItem('specialNew', JSON.stringify(this.specialNew)); // 直接保存，不在弹出
          }
        }
      }

      // 公告正常滚动
      this.noticeList = [];
      this.noticeList = this.$store.state.app.newsList;
      this.handleScroll();
    },
    // banner 图片获取 - 语言切换重新请求
    handelBanner() {
      const params = {
        type: 1,
        channel: this.channel,
      }
      RequestApi.getCommonBannerList(params, (res) => {
        if (res.code !== 0) {
          return;
        }
        this.bannerList = res.data || [];
        if (this.bannerList.length > 1) { // banner 少于2张不执行轮播
          // 延时调用swiper
          setTimeout(() => {
            this.handleSwiperStart(); // 重新渲染swiper
          }, 200);
        }
      })
    },
    // 活动弹窗获取
    handleEvents() {
      const oldList = localStorage.getItem('eventsPopupList') ? JSON.parse(localStorage.getItem('eventsPopupList')) : [];
      const params = {
        type: 3
      }
      RequestApi.getCommonBannerList(params, (res) => {
        if (res.code !== 0) {
          return;
        }
        const data = res.data.reverse();
        data.forEach((item) => {
          const oldItem = oldList.find(v => item.id === v.id);
          if (oldItem) {
            this.$set(item, 'show', oldItem.show);
            this.$set(item, 'error', oldItem.error);
            return
          }
          this.$set(item, 'show', true);
          this.$set(item, 'error', false);
        });
        this.eventsList = data;
        this.$emit('listenShowEventsList', data)
        localStorage.setItem('eventsPopupList', JSON.stringify(data))
      })
    },
    // 关闭活动弹窗
    handleCloseEvents(index) {
      this.eventsList[index].show = false;
      localStorage.setItem('eventsPopupList', JSON.stringify(this.eventsList))
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
    window.clearTimeout(this.timerout);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";
@import '../../assets/css/swiper.min.css';

.private{
  background: linear-gradient(to right, rgba(68,92,241,0.96) , rgba(57,82,193,1));
  height: 3.34rem;
  font-size: .3rem;
  color: #FFF;
  text-align: center;
  padding: .5rem 0px 0px 0px;

  .privateTitle{
    font-weight: bold;
    font-size: .32rem;
    margin-bottom: .2rem;

    &.privateTitleEN{
      font-size: .3rem;
      margin-bottom: .18rem;
    }
  }
  .privateSubTitle{
    // font-size: .36rem;
    margin-bottom: .35rem;
  }
  .privateBtn{
    z-index: 1000;
    margin: auto;
    font-size: .25rem;
    height: .6rem;
    line-height: .6rem;
    border: 1px solid #FFF;
    border-radius: .08rem;
    width: 1.8rem;
  }
}

.swiper-container {
  width: 100%;
  height: 3.3rem;
  overflow: hidden;
  position: relative;

  &.h5Height{
    height: 3.6rem;
  }
  /deep/ .swiper-pagination-bullets{
    // height: .6rem;
    font-size: .4rem;
    bottom: .1rem;
  }

  /deep/ .swiper-pagination-bullet-active{
    background: #FFF;
  }

  /deep/ .swiper-pagination-bullet{
    width: 6px;
    height: 6px;
    border-radius: 100px;
  }

  .bannerActivityImg{
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;

    &.en{
      background-size: 100% 100%;
    }

    a{
      display: block;
      height: 100%;
      position: absolute;
      z-index: 100;
      width: 100%;
      top: 0px;
    }
  }

  .bannerActivityImg2{
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    position: relative;

    &.en{
      background-size: 100% 100%;
    }

    a{
      display: block;
      height: 100%;
      position: absolute;
      z-index: 100;
      width: 100%;
    }
  }
}
// bannner 样式
.banner{
  background: linear-gradient(to right, #0C186D, #3248CA );
  background-size: cover;
  height: 3.34rem;
  max-width: 100%;
  text-align: center;
  color: white;
  position: relative;

  .center{
    width: 6.2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .logoIcon{
      font-size: .6rem;
      margin-bottom: .2rem;
    }

    .bannerTitle{
      color: rgba(255, 255, 255, 1);
      font-size: 0.32rem;
      font-weight: 300;
    }
  }

  .langu{
    margin: .17rem .25rem 0rem 0rem;
    z-index: 888;
  }
}
.topBannar{
  .langu{
    background: transparent;
    position: absolute;
    color: #FFF;
    right: 0px;
    margin: .17rem .25rem 0rem 0rem;
    z-index: 888;
  }

  .h5Div{
    position: absolute;
    height: .9rem;
    width: 100%;
  }
}

// notice 样式
.paddNotice{
  padding: 0 .16rem;
  box-sizing: border-box;
  background-color: #fff;
}
.noticeDiv{
  border-bottom: 1px solid #f3f3f3;
}
.notice{
  background: #ffffff;
  height: .7rem;
  font-size: 0.25rem;
  // padding: 0rem .36rem;
  position: relative;
  // margin-bottom: .09rem;
  position: relative;
  display: flex;
  align-items: center;/*垂直居中*/
  // justify-content: center;/*水平居中*/
  // border-bottom: 1px solid #f3f3f3;

  .noticeIcon{
    font-size: 0.35rem;
    margin-right: .1rem;
  }

  .noticeTool{
    display: flex;
    align-items: center;/*垂直居中*/
    // border: 1px solid black;
    height: .42rem;
    margin-right: .05rem;
  }

  .noticeItem{
    height: .42rem;
    max-width: 5.02rem;
    overflow: hidden;

    &>div{
      display: flex;
      align-items: center;
      height: .42rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .noticeLink{
        display: block;
        max-width: 5.02rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .noticeMore{
    position: absolute;
    right: 0rem;
    font-size: .24rem;
    color: $color-this;
  }
}

// candyBox 样式
.candyBox{
  font-size: .32rem;
  margin: .09rem 0px;
}

// content table 样式
.content{
  text-align: center;
  // margin: .12rem 0rem;
  background: #fff;
  padding: .15rem 0rem .3rem;

  .data{
    padding: 0.02rem 0px .3rem;
  }

  .contentTop{
    display: flex;
    font-size: .3rem;
    width: 50%;
    color: $color-999;

    .item{
      flex: 1;

      &:nth-child(1):after{
        content: '';
        border: 1px solid $color-e3e3e3;
        float: right;
        height: .27rem;
        margin-top: .05rem;
      }

       &.activeThis{
        color: $color-this;
      }
    }
  }

  .more{
    font-size: .24rem;
  }
}

// footer 样式
.footer{
  font-size: .21rem;
  text-align: center;
  padding: .35rem 0rem;
  background-color: #f3f3f3;
}

.page-index {
  // font-size: .42rem;
  height: 100%;
  overflow: auto;;
  background: #f3f3f3;
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

.popupFoolDay{
  background: transparent;
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

