
<template>
  <div class="turntableBox">
    <div class="flexc">
      <img class="imgTitle"  v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
       src="@/assets/img/activity/christmas2019/zp.png" alt="">
      <img class="imgTitle"  v-else src="@/assets/img/activity/christmas2019/zpEn.png" alt="">
    </div>
    <div class="notice-box" v-show="isStart !==0 && noticeList.length > 0">
      <!-- <div class="title">{{$t("midAutumn.enjoyTitle")}}</div> -->
      <div class="notice">
        <img class="noticeImg" src="@/assets/img/activity/jubilee/notice.png" alt="">
        <div class="noticeText" id="notice">
            <div class="notices" v-for="(item, index) in noticeList" :key="index">
              <div class="noti-item">
                {{ $t('christmas.congra', {account: item.account, reward: item.reward }) }}
              </div>
            </div>
          <div class="notices" v-for="(item, index) in noticeList" :key="index + '100'">
            <div class="noti-item">
              {{ $t('christmas.congra', {account: item.account, reward: item.reward }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="turntableDiv">
      <!-- 抽奖进行中 -->
      <div class="btn" v-if="isStart=== 1" @click="handleDraw">
        <span>{{ $t('turnTable.joinNow1') }}{{ $t('turnTable.joinNow2') }}</span>
        <!-- <span></span> -->
        <span class="count" v-if="remainDrawCount !== null">
          <span v-if="remainDrawCount>1">{{remainDrawCount}}{{ $t('turnTable.times') }}</span>
          <span v-else>{{remainDrawCount}}{{ $t('turnTable.time') }}</span>
        </span>
      </div>

      <!-- 活动未开始 -->
      <div class="btn" v-else-if="isStart === 0" @click="handleTip">
        <span>{{ $t('turnTable.commingSoon1') }}</span>
        <span>{{ $t('turnTable.commingSoon2') }}</span>
      </div>

      <!-- 活动结束 -->
      <div class="btn" v-else @click="handleTip">
        <span>{{ $t('turnTable.joinClosed') }}</span>
      </div>

      <div ref="turntable" v-if="turntableShow"></div>
    </div>
    <!-- <div class="drawCount">
      {{ $t('turnTable.remaining', {time: remainDrawCount}) }}
    </div> -->
    <div class="btn-box">
      <div class="btn" @click="handleReadyDraw('drawLogList')">{{$t("turnTable.myPrize")}}</div>
      <div class="btn" @click="isExchange = true">{{$t("turnTable.MyReward")}}</div>
    </div>

    <div class="titleImg">
      <img src="@/assets/img/activity/christmas2019/drawTitle.png" alt=""
        v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
      <img v-else src="@/assets/img/activity/christmas2019/drawTitleEn.png" alt="">
    </div>
    <div class="boxMain">
      <div class="tip-box">
        <!-- <div class="tip-title">{{$t('christmas.chris22')}}</div> -->
        <div class="tip">
          <div>
            <p class="bold">{{$t('christmas.chris23')}}</p>
            <p>{{$t('christmas.chris24')}}</p>
            <p>{{$t('christmas.chris25')}}</p>
          </div>
        </div>
        <div class="tip">
          <div>
            <p class="bold">{{$t('christmas.chris26')}}</p>
            <p>{{$t('christmas.chris27')}}</p>
            <p>{{$t('christmas.chris28')}}</p>
            <p>{{$t('christmas.chris29')}}</p>
            <p>{{$t('christmas.chris30')}}</p>
            <p>{{$t('christmas.chris31')}}</p>
          </div>
        </div>
        <transition name="fade">
          <div v-show="isMoreTips">
            <div class="tip">
              <div>
                <p class="bold">{{$t('christmas.chris36')}}</p>
                <p>{{$t('christmas.chris37')}}</p>
                <p>{{$t('christmas.chris38')}}</p>
              </div>
            </div>
            <div class="tip">
              <span>{{$t('christmas.chris39')}}</span>
            </div>
            <div class="tip">
              <span>{{$t('christmas.chris40')}}</span>
            </div>
            <div>
              <span>{{ $t('christmas.chris41') }}</span>
            </div>
          </div>
        </transition>
        <div class="moreTip" @click="isMoreTips = !isMoreTips">
          <!-- {{ isMoreTips?$t('halloween.viewMoreTips1'):$t('halloween.viewMoreTips')}} -->
          <span class=" iconfont icon-huaban37 moreTipsIcon" :class="{'on': isMoreTips}"></span>
        </div>
      </div>
      <div class="tip-title titles">{{$t('christmas.chris42')}}</div>
      <div class="tip tips">
        <span>{{$t('christmas.chris43')}}</span>
      </div>
      <div class="tip tips">
        <span>{{$t('christmas.chris44')}}</span>
      </div>
      <div class="tip tips">
        <span>{{$t('christmas.chris45')}}</span>
      </div>
      <div class="tip tips">
        <span>{{$t('christmas.chris46')}}</span>
      </div>
      <div class="tip tips">
        <span>{{$t('christmas.chris47')}}</span>
      </div>
      <div class="tip tips">
        <span>{{$t('christmas.chris48')}}</span>
      </div>
    </div>
    <!-- 获奖记录 -->
    <mt-popup class="mtPopup" v-model="isRecord" popup-transition="popup-fade">
      <PopupRecord
        v-if="isRecord" :drawLogList='drawLogList' @listenOrder="handleSubmitOrder"
        @listenClose="handleClose"
      />
    </mt-popup>

    <!-- 我要兑换 -->
    <mt-popup class="mtPopup" v-model="isExchange" popup-transition="popup-fade">
      <PopupExchange
        v-if="isExchange"
        @listenClose="handleClose"
      />
    </mt-popup>

    <!-- none抽奖提示语 -->
    <mt-popup class="mtPopup" v-model="isTip" popup-transition="popup-fade">
      <PopupTip
        v-if="isTip"
        :isStart ="isStart"
        @listenClose="handleClose"
      />
    </mt-popup>

    <mt-popup
      class="tipPopup"  v-model="isToApp" popup-transition="popup-fade">
      <to-app />
    </mt-popup>

     <!-- 中奖提示 -->
    <mt-popup
      class="mtPopup"
      v-model="isAward"
      popup-transition="popup-fade">
      <PopupAward v-if="isAward" :rewardItem="rewordItem" @listenClose="handleClose"></PopupAward>
    </mt-popup>
  </div>
</template>

<script>
import LotteryTurntable from 'lottery-turntable';
import { AppToLogin, accountToSign } from '@/utils/publicApi'
import { Toast, Popup } from 'mint-ui';
import ToApp from '@/views/market/components/ToApp';
import PopupAward from './PopupAward'
import PopupExchange from './PopupExchange'
import PopupRecord from './PopupRecord'
import PopupTip from './PopupTip'

const turnImgSize = Math.floor(
  90 * 0.5 * (document.documentElement.clientWidth / 375)
);
export default {
  props: {
    // turnData: {
    //   type: Array
    // },
  },
  components: {
    PopupAward,
    PopupRecord,
    PopupExchange,
    PopupTip,
    ToApp,
    mtPopup: Popup
  },
  data() {
    return {
      noticeList: [],
      isStart: 0,
      timer: null, // 滚动定时器
      timerout: null, // 滚动停滞定时器
      drawLogList: [], // 得到奖品
      remainDrawCount: null, // 抽奖次数
      isDrawRunning: false, // 转盘运行中
      rewordItem: {}, // 中奖的奖品
      isAward: false, // 中奖弹窗
      isExchange: false,
      isRecord: false,
      isTip: false,
      isToApp: false,
      isMoreTips: false,
      turntableShow: true,
      turnData: [
        {
          id: 6,
          name: 'NDX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ndx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 7,
          name: 'TPT',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/tpt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 9,
          name: 'PUML',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/puml.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 4,
          name: 'OGX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ogx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 5,
          name: 'DFS',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/dfs.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 3,
          name: 'PIZZA',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/pizza.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },

        {
          id: 1,
          name: 'iPhone12',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/iphone.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 2,
          name: 'BOX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/box.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 10,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/thank.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 8,
          name: 'YSD',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ysd.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
      }],
    }
  },
  watch: {
    '$store.state.app.language': function change() {
      this.turntableShow = false;
      this.isDrawRunning = false
      this.turnData = [
        {
          id: 6,
          name: 'NDX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ndx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 7,
          name: 'TPT',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/tpt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 9,
          name: 'PUML',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/puml.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 4,
          name: 'OGX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ogx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 5,
          name: 'DFS',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/dfs.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 3,
          name: 'PIZZA',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/pizza.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },

        {
          id: 1,
          name: 'iPhone12',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/iphone.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 2,
          name: 'BOX',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/box.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 10,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/thank.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 8,
          name: 'YSD',
          img: {
            src: 'https://s-dapp.340wan.com/static/christmas2019/ysd.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        }]
      setTimeout(() => {
        this.turntableShow = true;
        this.$nextTick(() => {
          this.handleInitTurntable();
        });
      }, 1000);
    },
  },
  methods: {
    // Toast
    handleToast(message) {
      Toast({
        message,
        position: 'center',
        duration: 2000,
      });
    },
    // 获取最近100条中奖纪录
    handleGetLastDrawList() {
      this.$http.post('/christmas/getLastDrawList').then((res) => {
        if (res.code === 1028) {
          Toast({
            message: this.$t('anniversary.plstoEos'),
            position: 'center',
            duration: 2000,
          });
          return
        }
        if (res.code === 0) {
          this.noticeList = res.lastDrawLogList || [];
          this.isStart = res.isStart;
        }
      })
    },
    // 抽奖公告滚动组件
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
          if (mainTop.scrollTop > height) {
            mainTop.appendChild(mainTop.getElementsByClassName('notices')[0]);
            mainTop.scrollTop -= height;
            this.handleScroll();
          }
        }, 25);
      }, 1000);
    },
    // 初始化转盘信息
    handleInitTurntable() {
      const size = (600 * 0.5 * (document.documentElement.clientWidth / 375))
      const textSpace = (26 * 0.5 * (document.documentElement.clientWidth / 375))
      const imgSpace = (80 * 0.5 * (document.documentElement.clientWidth / 375))
      this.turntable = new LotteryTurntable({
        type: 'transition', // 转盘转动类型
        size, // 转盘尺寸，默认为320
        textSpace, // 奖品和图片的距离
        imgSpace, // 奖品图片距离转盘边距，默认为50
        speed: 6, // transition动画持续多长时间，秒为单位
        ring: 8, // 转动多少圈后到达终点，越大转速越快
        values: this.turnData,
        container: this.$refs.turntable
      });
    },

    // 符合条件获取抽奖信息
    handleReadyDraw(type) {
      // 网页打开 - 提示用户去下载APP
      this.channelRef = localStorage.getItem('channelRef');
      const accout = this.$store.state.app.accountInfo.account;
      if ((this.channelRef === 'h5' || !accout) && !this.$store.state.sys.isAppView) {
        this.isToApp = true;
        return;
      }
      // 是APP内部打开
      if (this.$store.state.sys.isAppView) {
        // 判断是否登录
        if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account_name) {
          AppToLogin();
          return
        }
      }
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleReadyDraw(type);
        })
        return
      }
      this.$http.post('/christmas/getAccountDrawInfo').then((res) => {
        if (res.code === 401) {
          accountToSign(this, () => {
            this.handleReadyDraw(type)
          })
          return
        }
        if (res.code === 1028) {
          Toast({
            message: this.$t('turnTable.plstoEos'),
            position: 'center',
            duration: 2000,
          });
          return
        }
        if (res.code !== 0) {
          this.handleToast(res.msg)
          return;
        }
        this.remainDrawCount = res.remainDrawCount
        this.drawLogList = res.drawLogList
        // 继续抽奖
        if (type === 'draw') {
          this.handleDraw()
        }
        // 打开获奖记录
        if (type === 'drawLogList') {
          // this.$emit('listenDrawList', this.drawLogList)
          this.handleDrawList()
        }
      })
    },
    // 第二步抽奖
    handleDraw() {
      // 转盘运行中，返回
      if (this.isDrawRunning) return
      if (this.remainDrawCount === null) {
        this.handleReadyDraw('draw')
        return
      }
      // 开始抽奖
      if (this.remainDrawCount > 0) {
        this.isDrawRunning = true
        // const randomIndex = Math.floor(Math.random() * 9)
        // const object = { reward: '324234.213 DEX' }
        // this.turntable.goto(randomIndex, () => {
        //   // 弹出中奖框
        //   const item = this.turnData.find(v => v.id === randomIndex)
        //   const rewordItem = Object.assign(object, item)
        //   this.rewordItem = rewordItem
        //   this.handleDrawId()
        //   this.isDrawRunning = false
        // });
        this.$http.post('/christmas/startDraw').then((res) => {
          if (res.code !== 0) {
            this.handleToast(res.msg)
            this.isDrawRunning = false
            return;
          }
          this.remainDrawCount = res.remainDrawCount
          const awardLevel = res.awardLevel
          this.turntable.goto(awardLevel, () => {
            // 弹出中奖框
            const item = this.turnData.find(v => v.id === res.awardLevel)
            this.rewordItem = Object.assign(res, item)
            this.handleDrawId()
            this.isDrawRunning = false
          });
        })
      } else {
        // eslint-disable-next-line no-console
        // console.log('弹出没次数弹窗');
        this.handleTip()
      // this.isTip = true
      // 弹出没次数弹窗
      }
    },
    handleDrawId() {
      this.isAward = true
    },
    handleDrawList() {
      this.isRecord = true
    },
    handleSubmitOrder() {
      this.isRecord = false
      this.isExchange = true
    },
    handleTip() {
      this.isTip = true
    },
    handleClose() {
      this.isAward = false
      this.isExchange = false
      this.isRecord = false
      this.isTip = false
      this.toApp = false
    }
  },
  created() {
    // 账号登录情况 获取抽奖次数
    this.$http.post('/christmas/getAccountDrawInfo').then((res) => {
      if (res.code !== 0) {
        return;
      }
      this.remainDrawCount = res.remainDrawCount;
    });
  },
  mounted() {
    this.handleInitTurntable()
    this.handleGetLastDrawList()
    this.handleScroll()
  },
};
</script>
<style lang="scss" scoped>
  .flexc{
    display: flex;
    justify-content: center;
  }
  .imgTitle{
    // width: 4.54rem;
    height: .5rem;
    max-width: 100%;
    margin: 0.8rem 0 0.3rem;
  }
  .notice-box{
    // height: 3rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0.1rem 0 0.3rem;
    overflow: hidden;

    .title{
      // height: 1.44rem;
      width: 100%;
      line-height: 0.8rem;
      display: flex;
      justify-content: center;
      font-size: 0.44rem;
      font-weight: bold;
      text-align: center;
      // color: #f2ba68;
      color:#ffd255;
      margin-top: 0.5rem;
    }
    .notice{
      width: 100%;
      height: 0.6rem;
      margin: 0.1rem auto;
      border-radius: 0.26rem;
      display: flex;
      justify-content: center;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      box-sizing: border-box;
      overflow: hidden;
      .noticeImg{
        width: 0.3rem;
        height: 0.3rem;
        margin-right: 0.1rem;

      }
      .noticeText{
        font-size: 0.24rem;
        max-width: 100%;
        height: 0.6rem;
        overflow: hidden;
        .noti-item{
          height: 0.6rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight:400;
          color:#f1c89d;
        }
      }
    }
  }
.turntableDiv {
  overflow: hidden;
  width: 6.8rem;
  height: 6.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../../assets/img/activity/christmas2019/turnbg.png") center no-repeat;
  background-size: 100%;
  position: relative;
  font-size: 0.26rem;
  // font-weight: bold;
  padding-top: 0.04rem;
  margin: 0 auto 0.46rem;

  .btn {
    width: 2.7rem;
    height: 2.7rem;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    background: url("../../../assets/img/activity/christmas2019/turnbtn.png")
      no-repeat;
    background-size: 100% 100%;
    padding-top: 0.1rem;
    box-sizing: border-box;
    font-weight: 600;
    color:#63381a;
    .count{
      font-size: .2rem;
    }
    // color: rgba(124, 70, 21, 1);
  }
}
.drawCount {
  text-align: center;
  font-size: 0.28rem;
  color: rgba(255, 255, 255, 1);
}

.titleImg {
  margin: .2rem 0;
  img {
    display: block;
    width: 100%;
  }
}
.btn-box {
  // position: relative;
  display: flex;
  justify-content:center;
  padding:0.3rem 0 0.5rem;
  .btn {
    font-size: 0.28rem;
    font-weight: 400;
    border-radius: 0.05rem;
    width: 2.36rem;
    height: 0.68rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#f1c89d;
    // margin: 0.3rem auto 0;
    border: 0.02rem solid #584E46;
    box-sizing: border-box;
    &:last-child{
      border: none;
      margin-left: 0.4rem;
      color:#63381a;
      background-color: #F1C89E;
    }
  }
}
.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: #333;
  text-align: center;
}

.boxMain {
  padding: 0rem 0.2rem;
  color:#F1C89D;
  font-size: 0.22rem;
  .tip-box{
    width: 100%;
    padding: 0.3rem 0.3rem;
    box-sizing: border-box;
    font-size: 0.22rem;
    line-height: 0.4rem;
    margin: 0.3rem 0;
    color:#F1C89D;
    border-radius: .1rem;
    background: rgba(255, 255, 255, 0.08);
  }
  .tip-title{
    margin-bottom: 0.1rem;
    font-size: 0.26rem;
  }
  .tip{
    display: flex;
    margin-bottom: .2rem;
    background: #022930;
    padding: .2rem;
    border-radius: .1rem;
    &>div:first-child{
      display: flex;
      flex-direction: column;
    }
    p{
      margin-left: .34rem;
    }
    .bold{
      // margin-top: .02rem;
      font-weight: bold;
      margin-left: 0;
    }
  }
  .tips {
    margin-bottom: 0;
    padding: .1rem .2rem;
  }
  .tip-title{
    margin-bottom: 0.1rem;
    font-size: 0.26rem;
  }
  .titles {
    padding: 0 .2rem;
  }
}

    /* 动画效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    visibility: visible;
    opacity: 1;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    visibility: hidden;
  }
  .moreTip{
    width: 100%;
    height: .7rem;
    font-size: .26rem;
    // color: #F1C89E;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: #999;
    .moreTipsIcon{
      font-size: .14rem;
      margin-left: .1rem;
      color: #F0C89E;
      &.on{
        transform: rotate(180deg);
      }
    }
  }
</style>
