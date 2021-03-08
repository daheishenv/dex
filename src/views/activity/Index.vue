<template>
  <div class="mainDiv" :style="`background: ${params.backgroundColor};`" v-if="hidden">
    <!-- 标题bannar start v-if="channelRef === 'h5'" -->
    <div class="bannaeImg">
      <div class="langu">
        <language />
      </div>
      <img width="100%" :src="`${params.backgroundTopImage}`" alt />
    </div>
    <!-- 标题bannar end -->

    <!-- 排行榜 start -->
    <div>
      <div
        class="title"
        :style="`color: ${params.titleColor};border: 0.03rem solid ${params.titleColor};`"
      >{{ $t('activityChristmas2018.topTitle') }}</div>
      <!-- 倒计时 start -->
      <div
        class="rankDiv"
        :style="`border: 1px solid ${params.rankBorderColor};background: ${params.rankBackgroundColor};`"
        v-if="!activeBegin"
      >
        <div class="timeOut">
          <div
            class="timeOutBegin"
            style="`color: ${params.rankBackgroundColor}`"
            :class="{'timeOutBeginEN': $store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'}"
          >{{ $t('activityChristmas2018.timeOutBegin') }}</div>
          <div
            class="lessTme"
            :style="`color: ${params.buttonTitleColor}`"
          >{{ $t('activityChristmas2018.timeOut') }}</div>
          <div class="lessTmeImg">
            <span>
              <span>{{ cDate.days }}</span>
              <span class="small">{{ $t('public.day') }}</span>
            </span>
            <span>
              <span>{{ cDate.hours }}</span>
              <span class="small">{{ $t('public.hour') }}</span>
            </span>
            <span>
              <span>{{ cDate.minutes }}</span>
              <span class="small">{{ $t('public.minute') }}</span>
            </span>
            <span>
              <span>{{ cDate.seconds }}</span>
              <span class="small">{{ $t('public.second') }}</span>
            </span>
          </div>
          <div class="timeTip" :style="`color: ${params.buttonTitleColor}`">
            <div>{{ $t('activityChristmas2018.activityTimeTitle') }}</div>
            <div class="tTime">
              <div>{{ toLocalTime(params.beginTime).substr(0, 16) }} ~ {{ toLocalTime(params.endTime).substr(0, 16) }}</div>
              <div>{{ handleGetTimeGMT() }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 倒计时 end -->

      <!-- 排行列表 start -->
      <div
        class="rankDiv"
        :style="`border: 1px solid ${params.rankBorderColor};background: ${params.rankBackgroundColor};`"
        v-if="activeBegin"
      >
        <div class="rankTopDiv">
          <div class="rankTitle">
            <div class="listItem fwb">
              <div v-for="(item, $index) in rankTitles" :key="$index">{{ item }}</div>
            </div>
          </div>
          <div class="rankList" ref="rankList">
            <div>
              <div
                class="listItem"
                :class="{'myRank': item.myRank}"
                v-for="(item, $index) in list"
                :key="$index"
                :ref="item.accountNo"
              >
                <div>
                  <img class="topImg" v-if="item.rank == 1" :src="params.rankFirstImage" alt />
                  <img class="topImg" v-if="item.rank == 2" :src="params.rankSecondImage" alt />
                  <img class="topImg" v-if="item.rank == 3" :src="params.rankThirdImage" alt />
                  <span v-if="item.rank >= 4">{{ item.rank || '-' }}</span>
                </div>
                <div>{{ item.accountNo || '-'}}</div>
                <div v-if="item.volume >= 1000">{{ parseInt(item.volume) }}</div>
                <div v-else-if="item.volume < 1000 && item.volume !== ''">{{ toFixed(item.volume, 4) }}</div>
                <div v-else-if="item.volume < 1000 && item.volume === ''">-</div>
                <div>{{ item.awards || '-' }}</div>
              </div>
            </div>

            <!-- 我的排名样式 -->
            <!-- <div class="rankMy" v-if="showRankMy" @click="handleRankMy">
              <span>{{$t('public.Myrank')}}</span>
            </div> -->
          </div>
          <div class="myRank">
            <div>
              <img class="topImg" v-if="accountInfo.rank == 1" :src="params.rankFirstImage" alt />
              <img class="topImg" v-if="accountInfo.rank == 2" :src="params.rankSecondImage" alt />
              <img class="topImg" v-if="accountInfo.rank == 3" :src="params.rankThirdImage" alt />
              <span v-if="accountInfo.rank >= 4 || !accountInfo.rank">{{ accountInfo.rank || '-' }}</span>
            </div>
            <div>{{ accountInfo.accountNo || '-' }}</div>
            <div v-if="Number(accountInfo.volume) >= 1000">{{ parseInt(accountInfo.volume) }}</div>
            <div v-if="Number(accountInfo.volume) < 1000 && accountInfo.volume !== ''">
              {{ toFixed(accountInfo.volume, 4) }}</div>
            <div v-if="Number(accountInfo.volume) < 1000 && accountInfo.volume === ''">-</div>
            <div>{{ accountInfo.awards || '0.0000' }}</div>
          </div>
        </div>
        <div class="rankRefresh" v-if="activityType === 1">{{ $t('activityChristmas2018.perTwoMin') }}</div>
      </div>
      <!-- 排行列表 end -->

      <div class="btnDiv" v-if="!eventsOver">
        <div
          class="btn"
          style="background-size: contain;"
          :style="`background-image: url('${params.rankButtonImage}'); color: ${params.buttonTitleColor};`"
          :class="{'gray': !activeBegin}"
          @click="handleToTrade"
        >{{ $t('activityChristmas2018.toTrade') }}</div>
        <div
          class="btn"
          @click="share = !share"
          :style="`background-image: url('${params.rankButtonImage}'); color: ${params.buttonTitleColor};`"
        >{{ $t('activityChristmas2018.toShare') }}</div>
      </div>
      <div class="eventsOver" v-if="eventsOver">{{ $t('activityChristmas2018.eventsOver') }}</div>
    </div>
    <!-- 排行榜 end -->

    <!-- 详情 start -->
    <div>
      <div
        class="title"
        :style="`color: ${params.titleColor};border: 0.03rem solid ${params.titleColor};`"
      >{{ $t('activityChristmas2018.activityTitle') }}</div>
      <div class="detailDiv" :style="`background: ${params.descriptionBorderColor};`">
        <div class="art" v-html="params.description"></div>
      </div>
    </div>
    <!-- 详情 end -->

    <!-- 分享 start -->
    <mt-popup class="popup" v-model="share" popup-transition="popup-fade">
      <div class="popupShare" :style="`border: .08rem solid ${params.rankBackgroundColor};`">
        <div class="shareContent">
          <span class="iconfont icon-huaban17 fr" @click="handleClose"></span>
          <div
            class="popupShareTitle"
            :style="`color: ${params.backgroundColor}`"
            :class="{'popupShareTitleEN': $store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'}"
          >{{ params.shareTitle }}</div>
          <div
            class="popupShareTitle mb30"
            :style="`color: ${params.backgroundColor}`"
            :class="{'popupShareTitleEN': $store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'}"
          >{{ params.shareTitle2 }}</div>
          <div class="newdexDiv">
            <div class="newdex" :style="`background: ${params.rankBorderColor}; opacity: .3;`"></div>
            <div
              class="newdex"
              style="background: transparent; position: absolute; top: 0px;"
            >{{ `https://newdex.io/events/${$route.params.name}` }}</div>
          </div>
          <div
            class="copyBtn"
            :style="`background: ${params.rankBorderColor}; color: ${params.buttonTitleColor}`"
            v-clipboard:copy="`${shareUrl}/events/${$route.params.name}`"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >{{ $t('activityChristmas2018.copy') }}</div>
          <div class="shareTip">{{ params.shareDescription }}</div>
        </div>
      </div>
    </mt-popup>
    <mt-popup
      class="copyMessage"
      v-model="copyVisible"
      :modal="false"
      position="top"
    >{{copyMessage}}</mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import Language from '@/components/Language';
import { toFixed, GetUrlPara, toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      params: {
        backgroundBottomImage: null,
        backgroundColor: '#FFF', // 页面背景颜色
        backgroundImage: null,
        backgroundTopImage: null, // banner 图
        bannerImage: null,
        buttonTitleColor: '#FFF', // 按钮字体颜色
        description: null,
        descriptionBorderColor: '#FFF', // 详情边框颜色
        rankBackgroundColor: '#FFF', // 排行榜背景颜色
        rankBorderColor: '#FFF', // 排行榜边框颜色
        rankButtonImage:
          'http://ndt.340wan.com/upload/20181227/4481f8b972bd4e469af0d7db38da5e96.png', // 按钮图片
        rankFirstImage:
          'http://ndt.340wan.com/upload/20181227/f3e1c99dfce94cc2a2417b26157aff13.png', // 排行第一
        rankSecondImage:
          'http://ndt.340wan.com/upload/20181227/9ef6088fe8bd46e8a89736eeeed38fc5.png', // 排行第二
        rankThirdImage:
          'http://ndt.340wan.com/upload/20181227/d776721f407e421bac6f036317972273.png', // 排行第三
        shareBorderColor: null,
        shareDescription: null,
        shareTitle: null,
        title: '元旦活动',
        titleColor: '#FFF', // 标题字体颜色
        beginTime: '2018-12-31T16:00:00.000+0000', // 开始时间
        endTime: '2019-01-03T15:59:59.000+0000', // 结束时间
        symbol: 'eosblackteam-black-eos' // 跳转的交易对
      },
      list: [],
      cDate: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      endtime: new Date('2018/12/23 15:59:59'), // 倒计时结束时间
      countdownTimer: null,
      copyVisible: false,
      copyMessage: '',
      timer: null, // 定时器
      accountInfo: {
        // 用户排名
        rank: '',
        accountNo: '-',
        volume: '',
        awards: '-'
      },
      scrollY: 0, // 页面的滚动位置
      rankMyEle: {}, // 我的排名的DOM节点，跳转位置
      rankMyLocal: 0, // 我的排名到顶部的距离
      rankRowHeight: 0, // 列表的行高
      share: false, // 分享弹框是否显示
      activeBegin: false, // false - 活动未开始 | true - 活动开始
      channelRef: 'dapp', // H5 | dapp
      rankTitles: [], // 排行标题
      hidden: false, // 延时显示页面
      eventsOver: false, // true - 活动结束 | false - 活动未结束
      activityType: 1,
      shareUrl: '',
    };
  },
  components: {
    Language,
    mtPopup: Popup
  },
  watch: {
    '$store.state.app.language': function listen() {
      this.handleGetEventsPage();
      this.handleGetLists();
    }
  },
  computed: {
    showRankMy() {
      if (!this.accountInfo.rank) {
        return false;
      }
      // 计算显示我的排名按钮
      /*
       * 条件一 滚动条位置 + 页面高度大于我的位置 显示
       * 条件二 我的位置大于滚动条的位置+页面的高度 显示
       */
      const rankMyLocal = this.rankMyLocal - 10; // 我的排名的距离
      const scrollHeight = this.scrollY; // 滚动条的位置
      const rowHeight = this.rankRowHeight * 10; // 十行的高度
      // console.log('我的排名位置', rankMyLocal, this.scrollY, rowHeight);
      if (rankMyLocal + 5 >= scrollHeight + rowHeight) {
        return true;
      }
      if (scrollHeight > rankMyLocal + this.rankRowHeight) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    this.shareUrl = location.origin;
    this.channelRef = localStorage.getItem('channelRef');
    const path = this.$route.path;
    if (path.indexOf('swap') > -1) {
      this.activityType = 2
    }
    setTimeout(() => {
      this.hidden = true;
      this.initRankScroll();
    }, 1500);
    this.handleGetEventsPage();
    this.handleGetLists();
  },

  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  methods: {
    initRankScroll() {
      // console.log(this.$refs)
      // this.scroll = new BScroll(this.$refs.rankList, {
      //   probeType: 2,
      //   click: true
      // });
      // this.scroll.on('scroll', ({ x, y }) => {
      //   // 显示不报错，先这样处理 + x
      //   window.clearTimeout(this.scroller);
      //   this.scroller = window.setTimeout(() => {
      //     this.scrollY = Math.abs(y) + x;
      //   }, 200);
      // });
      // this.scroll.on('scrollEnd', ({ x, y }) => {
      //   this.scrollY = Math.abs(y) + x;
      // });
    },
    // 定时活动结束
    handleEventsOver(endTime) {
      const today = new Date().getTime();
      const t = toLocalTime(endTime).replace(/-/g, '/');
      const end = new Date(t).getTime();
      // const end = new Date('2018/12/12 19:21:20').getTime(); // 测试数据
      if (today >= end) {
        this.eventsOver = true;
      }
    },
    // 获取活动配置
    handleGetEventsPage() {
      const params = {
        promotionCode: this.$route.params.name,
        type: this.activityType
      };
      this.$http
        .get('/promotions/getPromotionsResource', { params })
        .then((res) => {
          if (res.code !== 0) {
            this.$router.push('/404');
            return;
          }
          this.params = res.promotionsResourceVo;
          const beginTime = toLocalTime(this.params.beginTime)
            .substr(0, 19)
            .replace(/-/g, '/');
          this.endtime = new Date(beginTime);
          // this.endtime = new Date('2018/12/27 16:34:55'); // 测试开放时间
          this.handleCountdownStart();
          this.handleEventsOver(this.params.endTime);
          setTimeout(() => {
            this.hidden = true;
          }, 200);
        });
    },
    // 时间转化
    toLocalTime(time) {
      return toLocalTime(time);
    },
    // 获取标准时区
    handleGetTimeGMT() {
      return /GMT[+|-]\d{4}/.exec(new Date())[0];
    },
    // 去交易
    handleToTrade() {
      if (!this.activeBegin) {
        return;
      }
      const urlParams = GetUrlPara();
      const symbol = this.params.symbol;
      if (urlParams.source === 'android' || urlParams.source === 'ios') {
        window.action.goToTrade(symbol);
        return;
      }
      if (this.activityType === 2) {
        this.$router.push({
          name: 'swap'
        });
        return;
      }
      this.$router.push(`/kline/${symbol}`);
    },
    // 关闭分享
    handleClose() {
      this.share = false;
    },
    // 截取小数
    toFixed(numb, p) {
      return toFixed(numb, p);
    },
    // 获取列表
    handleGetLists() {
      if (!this.activeBegin) {
        setTimeout(() => {
          this.handleGetLists();
        }, 1000);
        return;
      }
      try {
        const params = {
          promotionCode: this.$route.params.name,
          accountNo: '',
          limit: 100,
          type: this.activityType
        };
        if (this.channelRef === 'dapp') {
          params.accountNo = this.$store.state.app.accountInfo.account;
        }
        this.$http.get('/promotions/getPromotionsRankInfo', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.timer = window.setTimeout(() => {
            this.handleGetLists();
          }, 12000);
          // 获取排行榜标题
          this.rankTitles = res.rankColumnNames.split(',');
          // 设置list列表
          const list = res.promotionsRankList || [];
          // 获取用户信息
          if (res.promotionsRankVo) {
            this.accountInfo = res.promotionsRankVo;
            const index = list.findIndex(
              item => item.accountNo === params.accountNo && item.rank === res.promotionsRankVo.rank
            );
            if (index === -1) {
              if (this.accountInfo.rank) {
                // 账户有排名 且 不在前100名之内添加
                this.accountInfo.myRank = true; // 标记为本账号排名
                // list.push(this.accountInfo);
              }
            } else {
              list[index].myRank = true; // 标记为本账号排名
            }
          }
          if (list.length < 10) {
            const t = list.length;
            for (let i = 1; i <= 10 - t; i += 1) {
              list.push({
                rank: i + t,
                accountNo: '-',
                volume: '',
                awards: '-'
              });
            }
          }
          this.list = list;
          if (this.accountInfo.rank) {
            setTimeout(() => {
              this.rankMyEle = this.$refs[this.accountInfo.accountNo];
              this.rankMyLocal = this.rankMyEle[0].offsetTop;
              this.rankRowHeight = this.$refs[
                this.accountInfo.accountNo
              ][0].offsetHeight;
            }, 500);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetLists();
        }, 200);
      }
    },
    //  跳转到我的排名
    handleRankMy() {
      this.scroll.scrollTop = this.rankMyEle[0];
    },

    // 开始倒计时
    handleCountdownStart() {
      const today = new Date();
      if (today.getTime() >= this.endtime.getTime()) {
        this.activeBegin = true;
      }
      this.countdownTimer = window.setInterval(() => {
        this.handleCountdown();
      }, 1000);
    },
    handleCountdown() {
      if (this.cDate.total <= 0) {
        window.clearInterval(this.countdownTimer);
        // 倒计时结束
        // console.log('time over');
        this.activeBegin = true;
        return;
      }
      // this.endtime = new Date('2018-12-21 19:56:10'); // test time
      this.cDate = this.countdown(this.endtime);
    },
    countdown(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date());
      const days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((t / 1000 / 60) % 60);
      let seconds = Math.floor((t / 1000) % 60);
      hours = hours >= 10 ? hours : `0${hours}`;
      minutes = minutes >= 10 ? minutes : `0${minutes}`;
      seconds = seconds >= 10 ? seconds : `0${seconds}`;
      if (t <= 0) {
        return {
          total: t,
          days: 0,
          hours: '00',
          minutes: '00',
          seconds: '00'
        };
      }
      return { total: t, days, hours, minutes, seconds };
    },
    onCopy() {
      this.copyVisible = true;
      this.copyMessage = this.$t('public.copySuccess');
      setTimeout(() => {
        this.copyVisible = false;
      }, 1500);
      // alert('copySuccess');
      // this.$message.success(this.$t('copySuccess'));
    },
    onError() {
      this.copyVisible = true;
      this.copyMessage = this.$t('public.copyError');
      setTimeout(() => {
        this.copyVisible = false;
      }, 1500);
      // this.$message.error(this.$t('copyError'));
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.mainDiv {
  font-size: 0.32rem;
  background: #fb4c47;
  padding-bottom: 0.6rem;

  .mt50 {
    margin-top: 0.5rem !important;
  }

  .fwb {
    font-weight: bold !important;

    & > div {
      // 临时添加
      text-align: center !important;

      &:nth-child(3),
      &:nth-child(4) {
        text-align: right !important;
      }
    }
  }

  // 标题
  .title {
    text-align: center;
    margin: auto;
    width: 3.35rem;
    color: #f8e71c;
    line-height: 0.72rem;
    font-size: 0.35rem;
    font-weight: bold;
    border: 3px solid #f8e71c;
    border-radius: 100px;
    margin-top: 0.4rem;
  }

  // banner
  .bannaeImg {
    // height: 4.1rem;
    width: 7.5rem;
    // max-width: 750px;
    margin: auto;
    overflow: hidden;

    img {
      height: 100%;
      width: 100%;
    }

    .langu {
      background: transparent;
      position: absolute;
      color: #fff;
      right: 0px;
      margin: 0.2rem 0.25rem 0rem 0rem;
      z-index: 888;
    }
  }

  // 排行榜样式
  .rankDiv {
    margin: auto;
    font-size: 0.21rem;
    border-radius: 0.33rem;
    border: 1px solid #f8e71c;
    background: #d0021b;
    height: 8.8rem;
    width: 6.8rem;
    padding: 0.22rem;
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 0.32rem;
    position: relative;

    // 倒计时样式
    .timeOut {
      background: #fff;
      border-radius: 0.25rem;
      height: 5.62rem;
      margin-top: 0.1rem;
      text-align: center;

      .timeOutTip {
        padding-top: 0.4rem;
        font-family: "HYb0gj";
        font-size: 0.35rem;
        color: #c42727;
        letter-spacing: 0.0423rem;
        padding-bottom: 0.25rem;
      }
      .timeOutBegin {
        padding-top: 0.4rem;
        font-family: "HYb0gj";
        font-size: 0.52rem;
        color: #c42727;
        letter-spacing: 0.087rem;
        padding-bottom: 0.18rem;
        transform: translateX(0.3rem);

        &.timeOutBeginEN {
          font-size: 0.5rem;
          transform: translateX(0.16rem);
          padding-bottom: 0.45rem;
        }
      }
      .lessTme {
        font-family: "PingFangSC-Semibold";
        font-size: 0.27rem;
        color: #a6301a;
        padding-bottom: 0.25rem;
      }
      .lessTmeImg {
        margin: auto;
        width: 6.2rem;
        height: 1.61rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "PingFangSC-Semibold";
        font-size: .8rem;
        color: #fff;
        letter-spacing: 0.065rem;
        text-align: center;
        // line-height: 1.5rem;
        background: #000;
        background: url("https://nds.340wan.com/static/img/activity/christmas2018/timeOutBg.png")
          no-repeat;
        background-size: 100% 100%;

        .small {
          font-size: 0.25rem;
        }
      }
      .timeTip {
        margin-top: 0.5rem;
      }
    }

    // 排行榜样式
    .rankTopDiv {
      border-radius: 0.25rem;
      overflow: hidden;
      // border-top-left-radius: 0.25rem;
      // border-top-right-radius: 0.25rem;
      // background: #fff;

      .rankList {
        height: 6.5rem;
        padding: 0rem 0.1rem;
        overflow: auto;
        position: relative;
        background: #fff;
      }
      .myRank{
        background: #FFF;
        margin-top: .1rem;
        height: .7rem;
        border-bottom-left-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .myRank,
    .listItem {
      box-sizing: border-box;
      height: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $color-input;
      background: #fff;
      &:last-child {
        border-bottom: 0px solid $color-input;
      }

      & > div {
        flex: 2;
        margin: 0rem 0.05rem;
      }

      & > div:nth-child(1) {
        flex: 1;
        min-width: 0.5rem;
        text-align: center;
      }
      & > div:nth-child(2) {
        // min-width: 1.4rem;
        text-align: left;
      }
      & > div:nth-child(3) {
        flex: 2;
        min-width: 1.3rem;
        text-align: right;
      }
      & > div:nth-child(4) {
        text-align: right;
      }

      &.myRank {
        color: $color-this;
      }

      .topImg {
        width: 0.59rem;
        height: 0.44rem;
      }
    }
    .rankMy {
      position: absolute;
      bottom: 2rem;
      left: 0;
      background-image: linear-gradient(
        -132deg,
        #3952c1 0%,
        rgba(68, 92, 241, 0.96) 100%
      );
      width: 1.3rem;
      height: 0.5rem;
      line-height: 0.5rem;
      color: #fff;
      // text-align: center;
      padding-left: 0.1rem;
      border-radius: 0 0.6rem 0.6rem 0;
      span {
        position: relative;
      }
      span::after {
        position: absolute;
        content: "";
        right: -0.26rem;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border: solid 0.08rem;
        border-color: transparent transparent transparent #fff;
      }
    }
    .rankRefresh {
      margin-right: 0.4rem;
      color: #ffffff;
      text-align: right;
      font-size: 0.21rem;
      line-height: 0.6rem;
    }

    // .rankMyDiv {
    //   bottom: 0.22rem;
    //   position: absolute;
    //   width: 6.34rem;
    //   box-sizing: border-box;
    //   padding: 0rem 0.1rem;
    //   padding-bottom: 0.1rem;
    //   color: #fb4c47;
    //   background: #fff;
    //   border-bottom-left-radius: 0.25rem;
    //   border-bottom-right-radius: 0.25rem;
    // }
  }

  // 活动结束
  .eventsOver {
    height: 0.88rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6.8rem;
    margin: auto;
    text-align: center;
    margin-top: 0.32rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  // 按钮样式
  .btnDiv {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 6.8rem;
    margin: auto;
    text-align: center;
    margin-top: 0.32rem;
    margin-bottom: 1rem;

    .btn {
      flex: 1;
      height: 0.9rem;
      width: 3.22rem;
      line-height: 0.9rem;
      background: url("https://nds.340wan.com/static/img/activity/christmas2018/toDoing.png")
        no-repeat;
      background-size: contain;
      background-position: 50% 0;
      font-size: 0.32rem;

      &.gray {
        filter: grayscale(100%);
        color: $color-999 !important;
      }

      &:first-child {
        margin-right: 0.18rem;
      }
      &:last-child {
        margin-left: 0.18rem;
      }
    }
  }

  // 详情样式
  .detailDiv {
    background: #d0021b;
    min-height: 1rem;
    border-radius: 0.33rem;
    width: 6.8rem;
    margin: auto;
    margin-top: 0.32rem;
    padding: 0.12rem;
    box-sizing: border-box;

    .art {
      background: #fff;
      min-height: 2rem;
      border-radius: 0.2rem;
      padding: 0.1rem;
      font-size: 0.24rem;
    }
  }

  // 分享样式
  .popup {
    background: transparent;
  }
  .popupShare {
    background: #fff;
    text-align: center;
    width: 6.8rem;
    box-sizing: border-box;
    border: 0.1rem solid #d0021b;
    border-radius: 0.22rem;
    padding: 0.3rem 0.1rem;
    position: relative;

    .icon-huaban17 {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      font-size: 0.32rem;
      color: $color-999;
    }

    .shareContent {
      font-size: 0.22rem;

      .popupShareTitle {
        font-family: "HYb0gj";
        font-size: 0.4rem;
        color: #c42727;
        letter-spacing: 0.0544rem;
        text-align: center;
        font-weight: bold;

        &.mb30 {
          margin-bottom: 0.3rem;
        }

        &.popupShareTitleEN {
          font-size: 0.3rem;
        }
      }
      .newdexDiv {
        position: relative;
        width: 5.8rem;
        margin: auto;
      }
      .newdex {
        width: 5.8rem;
        margin: auto;
        box-sizing: border-box;
        background: rgba($color: #000000, $alpha: 0.6);
        border-radius: 0.06rem;
        height: 0.69rem;
        line-height: 0.69rem;
        font-size: 0.27rem;
        color: #4a4a4a;
        letter-spacing: 0;
        text-align: left;
        padding-left: 0.15rem;
        color: $color-333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .copyBtn {
        width: 5.8rem;
        margin: auto;
        background: #f4b23e;
        border-radius: 0.06rem;
        height: 0.69rem;
        line-height: 0.69rem;
        margin-top: 0.1rem;
        font-size: 0.3rem;
        color: #a6301a;
        text-align: center;
        margin-bottom: 0.2rem;
      }

      .shareTip {
        width: 5rem;
        margin: auto;
      }
    }
  }
}

.copyMessage {
  text-align: center;
  width: 100%;
  font-size: 0.4rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.2rem;
}
</style>
