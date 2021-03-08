
<template>
  <div class="turntableBox">
    <div class="flexc">
      <img class="imgTitle" v-if="$store.state.app.language === 'zh-CN'"
       src="/static/img/activity/ambassadors/title2-CN.png?v=1" alt="">
       <img class="imgTitle" v-else-if="$store.state.app.language === 'zh-TW'"
       src="/static/img/activity/ambassadors/title2-TW.png?v=1" alt="">
      <img class="imgTitle" v-else src="/static/img/activity/ambassadors/title2-en.png?v=1" alt="">
    </div>
    <!-- <p class="activityTime">{{ $t('ds.ds6') }}</p> -->
    <div class="timesDiv">
      <div class="newTitle">{{ $t('ds.ds107') }}</div>
      <div class="txCenter">{{ $t('ds.ds106') }}</div>
      <div class="list" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
        <div>08:00</div>
        <div>12:00</div>
        <div>17:00</div>
        <div>23:00</div>
      </div>
      <div class="list" v-else>
        <div>00:00</div>
        <div>04:00</div>
        <div>09:00</div>
        <div>15:00</div>
      </div>
    </div>
    <div class="notice-box" v-show="isStart !==0">
      <!-- <div class="title">{{$t("midAutumn.enjoyTitle")}}</div> -->
      <div class="notice">
        <img class="noticeImg" src="https://nds.340wan.com/static/assets/img/activity/jubilee/notice.png" alt="">
        <div class="noticeText" id="notice">
            <div class="notices" v-for="(item, index) in noticeList" :key="index">
              <div class="noti-item">
                {{ $t('turnTable.congra', {account: item.account, reward: item.reward }) }}
              </div>
            </div>
          <div class="notices" v-for="(item, index) in noticeList" :key="index + '100'">
            <div class="noti-item">
              {{ $t('turnTable.congra', {account: item.account, reward: item.reward }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="turntableDiv">
      <!-- 抽奖进行中 -->
      <div class="btn" v-if="isStart=== 1" @click="handleDraw()">
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

      <!-- 活动未开始 -->
      <div class="btn" v-else-if="isStart === 3" @click="handleTip">
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
      <!-- <div class="btn" @click="isExchange = true">{{$t("turnTable.MyReward")}}</div> -->
    </div>

    <div class="tip-box">
      <div class="tip-title">{{ $t('ds.ds34') }}</div>
      <div class="tip">
        <div>
          <p class="bold">{{ $t('ds.ds35') }}</p>
          <div class="wordBack">
            <p>{{ $t('ds.ds36') }}</p>
            <p>{{ $t('ds.ds37') }}</p>
          </div>
        </div>
      </div>
      <div class="tip">
        <div>
          <p class="bold">{{ $t('ds.ds38') }}</p>
          <div class="wordBack">
            <p>{{ $t('ds.ds39') }}</p>
            <p>{{ $t('ds.ds40') }}</p>
            <p>{{ $t('ds.ds41') }}</p>
            <p>{{ $t('ds.ds42') }}</p>
            <p>{{ $t('ds.ds109') }}</p>
          </div>
        </div>
      </div>
      <!-- <div class="tip">
        <div>
          <p class="bold">{{ $t('ds.ds44') }}</p>
          <div class="wordBack">
            <p>{{ $t('ds.ds45') }}</p>
            <p>{{ $t('ds.ds46') }}</p>
            <p>{{ $t('ds.ds47') }}</p>
          </div>
        </div>
      </div>
      <div class="tip">
        <div>
          <p class="bold">{{ $t('ds.ds48') }}</p>
          <div class="wordBack">
            <p>{{ $t('ds.ds49') }}</p>
            <p>{{ $t('ds.ds50') }}</p>
          </div>
        </div>
      </div> -->
      <div class="tip">
        <div>
          <p class="bold">{{ $t('ds.ds51') }}</p>
        </div>
      </div>
      <div class="lastTip">{{ $t('ds.ds52') }}</div>
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

    <!-- 显示图片验证码 -->
    <mt-popup
      class="mtPopup"
      v-model="showImgCode">
      <img-code ref="imgCode" v-if="showImgCode" @listenCancel="showImgCode = false" @listenSure="handleImgCodeSure"/>
    </mt-popup>

    <!-- 显示不在抽奖时间范围 -->
    <mt-popup
      class="mtPopup"
      v-model="showTimeOut">
      <popup-out-time v-if="showTimeOut" @listenClose="showTimeOut = false"/>
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
import ImgCode from './ImgCode'
import PopupOutTime from './PopupOutTime'

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
    mtPopup: Popup,
    ImgCode,
    PopupOutTime
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
      turntableShow: true,
      showImgCode: false,
      isNeedVerify: false,
      showTimeOut: false,
      turnData: [
        {
          id: 3,
          name: 'EMT',
          img: {
            src: '/static/img/activity/ambassadors/coin/emt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 2,
          name: 'BOID',
          img: {
            src: '/static/img/activity/ambassadors/coin/boid.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 1,
          name: 'CHL',
          img: {
            src: '/static/img/activity/ambassadors/coin/chl.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 5,
          name: 'EFX',
          img: {
            src: '/static/img/activity/ambassadors/coin/efx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 4,
          name: 'DICE',
          img: {
            src: '/static/img/activity/ambassadors/coin/dice.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 6,
          name: 'TKT',
          img: {
            src: '/static/img/activity/ambassadors/coin/tkt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 8,
          name: 'BG',
          img: {
            src: '/static/img/activity/ambassadors/coin/bg.png',
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
            src: '/static/img/activity/ambassadors/coin/thanks.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 7,
          name: 'SOUL',
          img: {
            src: '/static/img/activity/ambassadors/coin/soul.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 9,
          name: 'VIGOR',
          img: {
            src: '/static/img/activity/ambassadors/coin/vigor.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        }
      ],
    }
  },
  watch: {
    '$store.state.app.language': function change() {
      this.turntableShow = false;
      this.isDrawRunning = false
      this.turnData = [
        {
          id: 3,
          name: 'EMT',
          img: {
            src: '/static/img/activity/ambassadors/coin/emt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 2,
          name: 'BOID',
          img: {
            src: '/static/img/activity/ambassadors/coin/boid.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 1,
          name: 'CHL',
          img: {
            src: '/static/img/activity/ambassadors/coin/chl.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 5,
          name: 'EFX',
          img: {
            src: '/static/img/activity/ambassadors/coin/efx.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 4,
          name: 'DICE',
          img: {
            src: '/static/img/activity/ambassadors/coin/dice.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 6,
          name: 'TKT',
          img: {
            src: '/static/img/activity/ambassadors/coin/tkt.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 8,
          name: 'BG',
          img: {
            src: '/static/img/activity/ambassadors/coin/bg.png',
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
            src: '/static/img/activity/ambassadors/coin/thanks.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 7,
          name: 'SOUL',
          img: {
            src: '/static/img/activity/ambassadors/coin/soul.png',
            height: turnImgSize,
            width: turnImgSize
          },
          bg: '#fff',
          fill: '#333'
        },
        {
          id: 9,
          name: 'VIGOR',
          img: {
            src: '/static/img/activity/ambassadors/coin/vigor.png',
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
    handleImgCodeSure(code) {
      // this.showImgCode = false;
      this.isNeedVerify = 0;
      this.handleDraw(code)
    },
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
      this.$http.post('/influencer2020/getLastDrawList').then((res) => {
        if (res.code === 1028) {
          Toast({
            message: this.$t('anniversary.plstoEos'),
            position: 'center',
            duration: 2000,
          });
          return
        }
        if (res.code === 0) {
          this.noticeList = res.lastDrawLogList
          this.isStart = res.isStart
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
      if (this.channelRef === 'h5' && !this.$store.state.sys.isAppView) {
        this.isToApp = true;
        return;
      }
      // 是APP内部打开
      if (this.$store.state.sys.isAppView) {
        // 判断是否登录
        if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
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
      this.$http.post('/influencer2020/getAccountDrawInfo').then((res) => {
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
        this.isNeedVerify = res.isNeedVerify
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
    handleDraw(code) {
      // 转盘运行中，返回
      if (this.isDrawRunning) return
      if (this.remainDrawCount === null) {
        this.handleReadyDraw('draw')
        return
      }
      if (this.isNeedVerify) { // 显示图片验证码
        this.showImgCode = true;
        return;
      }
      // 开始抽奖
      if (this.remainDrawCount > 0) {
        this.isDrawRunning = true
        const params = {
          imageCode: code,
        }
        this.$http.post('/influencer2020/startDraw', params).then((res) => {
          if (res.code === 1009) {
            this.isDrawRunning = false
            this.remainDrawCount = 0
            this.handleDraw()
            return;
          }
          if (res.code === 1023) { // 抽奖每日第一次必须输入验证码
            this.isDrawRunning = false
            this.showImgCode = true;
            return;
          }
          if (res.code === 1025 || res.code === 1026) {
            this.isDrawRunning = false
            this.isNeedVerify = 1;
            // this.$toast(this.$t('ds.ds97'))
            // console.log(this.$refs)
            this.$refs.imgCode.handleImgCodeErr();
            return;
          }
          if (res.code === 1029 || res.isStart === 3) { // 不在抽奖时间范围
            this.isDrawRunning = false
            this.isTip = true;
            this.isStart = res.isStart;
            return;
          }
          if (res.code !== 0) {
            this.handleToast(res.msg)
            this.isDrawRunning = false
            return;
          }
          this.showImgCode = false;
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
    this.$http.post('/influencer2020/getAccountDrawInfo').then((res) => {
      if (res.code !== 0) {
        return;
      }
      this.isNeedVerify = res.isNeedVerify
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
    // height: 1.07rem;
    max-width: 100%;
    margin: 0.8rem 0 0.3rem;
  }
  .activityTime {
    font-size: .24rem;
    color: #CDE4FF;
    text-align: center;
  }
  .timesDiv{
    font-size: .24rem;
    text-align: center;
    color: #fff;
    .newTitle{
      font-size: .28rem;
      color: #CDE4FF;
      margin-bottom: .1rem;
    }
    .txCenter{
      color: #CDE4FF
    }
    .list{
      margin-top: .23rem;
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 0 .6rem;
      font-size: .21rem;
      &>div{
        background: #0D1955;
        border-radius: .0671rem;
        width: 1.44rem;
        height: .68rem;
        border: 1px solid #D8E1EE;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .notice-box{
    // height: 3rem;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0.1rem 0 0rem;
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
          color:#CDE4FF;
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
  background: url("/static/img/activity/ambassadors/turntable.png") center no-repeat;
  background-size: 100%;
  position: relative;
  font-size: 0.26rem;
  // font-weight: bold;
  padding-top: 0.04rem;
  margin: .3rem auto 0.46rem;

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
    background: url("/static/img/activity/ambassadors/turntableBtn.png")
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
    color:#fff;
    // margin: 0.3rem auto 0;
    border: 0.02rem solid #fff;
    box-sizing: border-box;
    &:last-child{
      border: none;
      margin-left: 0.4rem;
      color:#fff;
      background-image: linear-gradient(90deg, #848EFF 0%, #3452E3 100%);
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

.tip-box{
  width: 100%;
  padding: 0 0.3rem;
  box-sizing: border-box;
  font-size: 0.22rem;
  line-height: 0.4rem;
  margin: 0.3rem 0;
  color:#fff;
  .tip-title{
    margin-bottom: 0.23rem;
    font-size: 0.27rem;
    color: #F7C17B;
  }
  .wordBack {
    margin-top: .18rem;
    font-size: .24rem;
    color: #CDE4FF;
    padding: .18rem .18rem .12rem 0;
    background-image: linear-gradient(180deg, rgba(#4470E2, .09) 0%, rgba(69,120,234,0.00) 100%);
    p{
      margin-bottom: .18rem;
      margin-left: .34rem;
    }
  }
  .tip{
    display: flex;
    margin-bottom: .1rem;
    &>div:first-child{
      display: flex;
      flex-direction: column;
    }
    .bold{
      font-size: .27rem;
      // font-weight: 500;
      margin-left: 0;
    }
  }
  .lastTip{
    margin-top: .4rem;
    font-size: .21rem;
    color: #8197D3;
    text-align: left;
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
      color: #999;
      &.on{
        transform: rotate(180deg);
      }
    }
  }
</style>
