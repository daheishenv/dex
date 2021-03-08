
<template>
  <div class="turntableBox" :class="{'pddtop': !(isStart !==0 && noticeList && noticeList.length > 0)}">
    <!-- <div class="flexc">
      <img class="imgTitle"  v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
       src="https://nds.340wan.com/static/assets/img/activity/christmas2019/turnTitle.png" alt="">
      <img class="imgTitle"  v-else src="https://nds.340wan.com/static/assets/img/activity/christmas2019/turnTitleen.png" alt="">
    </div> -->
    <div class="notice-box" v-show="isStart !==0 && noticeList && noticeList.length > 0">
      <!-- <div class="title">{{$t("midAutumn.enjoyTitle")}}</div> -->
      <div class="notice">
        <img class="noticeImg" src="/static/img/activity/nbActivity/notice.png" alt="">
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
      <!-- <div class="btn" @click="isExchange = true">{{$t("turnTable.MyReward")}}</div> -->
    </div>

    <div class="tip-box">
      <div class="tip-title">{{$t('nb.nb3')}}</div>
      <div class="tip">
        <div>
          <p class="bold">{{$t('nb.nb4')}}</p>
          <p>{{$t('nb.nb5')}}</p>
        </div>
      </div>
      <div class="tip">
        <div>
          <p class="bold">{{$t('nb.nb6')}}</p>
          <p>{{$t('nb.nb7')}}</p>
          <p>{{$t('nb.nb8')}}</p>
          <p>{{$t('nb.nb9')}}</p>
          <p>{{$t('nb.nb10')}}</p>
          <p>{{$t('nb.nb11')}}</p>
          <p>{{$t('nb.nb12')}}</p>
        </div>
      </div>
      <div class="tip">
        <!-- 立即交易 -->
        <div class="btcLj flexc" @click="handleToTrade">
          {{ $t('apiTrade.tradeNow') }}
        </div>
      </div>
      <p>{{$t('nb.nb1')}}</p>
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
import { Toast } from 'mint-ui';
import ToApp from '@/views/market/components/ToApp';
import PopupAward from './PopupAward'
import PopupExchange from './PopupExchange'
import PopupRecord from './PopupRecord'
import PopupTip from './PopupTip'
import { Popup } from 'mint-ui';

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
          id: 2, // 奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
          name: '20 TRX', // 奖品名称
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0', // 奖品图片路径
            width: turnImgSize, // 奖品图片宽度，请根据实际情况去设置，避免太大
            height: turnImgSize, // 奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
          },
          bg: '#fff', // 该奖品的在转盘中的扇形背景颜色
          fill: '#333', // 奖品名称的文字颜色
        },
        {
          id: 5,
          name: '500 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 10,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: '/static/img/activity/nbActivity/thanks.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 8,
          name: '5 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 3,
          name: '10 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 6,
          name: '20 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 1,
          name: '500 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 9,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: '/static/img/activity/nbActivity/thanks.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 4,
          name: '5 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 7,
          name: '10 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
      ],
    }
  },
  watch: {
    '$store.state.app.language': function change() {
      this.turntableShow = false;
      this.isDrawRunning = false
      this.turnData = [
        {
          id: 2, // 奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
          name: '20 TRX', // 奖品名称
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0', // 奖品图片路径
            width: turnImgSize, // 奖品图片宽度，请根据实际情况去设置，避免太大
            height: turnImgSize, // 奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
          },
          bg: '#fff', // 该奖品的在转盘中的扇形背景颜色
          fill: '#333', // 奖品名称的文字颜色
        },
        {
          id: 5,
          name: '500 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 10,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: '/static/img/activity/nbActivity/thanks.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 8,
          name: '5 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 3,
          name: '10 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 6,
          name: '20 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 1,
          name: '500 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 9,
          name: this.$t('turnTable.thankYouFor'),
          img: {
            src: '/static/img/activity/nbActivity/thanks.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 4,
          name: '5 TRX',
          img: {
            src: '/static/img/activity/nbActivity/trx.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
        {
          id: 7,
          name: '10 NB',
          img: {
            src: '/static/img/activity/nbActivity/nb.png?v=1.0',
            width: turnImgSize,
            height: turnImgSize,
          },
          bg: '#fff',
          fill: '#333',
        },
      ];
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
      this.$http.post('/tronEvent/getLastDrawList').then((res) => {
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
        speed: 4, // transition动画持续多长时间，秒为单位
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
      this.$http.post('/tronEvent/getAccountDrawInfo').then((res) => {
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
        this.$http.post('/tronEvent/startDraw').then((res) => {
          if (res.code === 1009) {
            this.isDrawRunning = false
            this.remainDrawCount = 0
            this.handleDraw()
            return;
          }
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
    },
    // 立即交易
    handleToTrade() {
      const params = {
        symbol: 'nb_trx', // 交易对名称
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
  },
  created() {
    // 账号登录情况 获取抽奖次数
    this.$http.post('/tronEvent/getAccountDrawInfo').then((res) => {
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
    height: 1.07rem;
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
          color:rgba(255,226,57,1);
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
  background: url("https://nds.340wan.com/static/assets/img/activity/christmas2019/turnbg.png") center no-repeat;
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
    background: url("https://nds.340wan.com/static/assets/img/activity/christmas2019/turnbtn.png")
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
    color:#f1c89d;
    // margin: 0.3rem auto 0;
    border: 0.02rem solid #584E46;
    box-sizing: border-box;
    &:last-child{
      border: none;
      // margin-left: 0.4rem;
      color:#63381a;
      background-image: linear-gradient(to right, #ffe596, #ffbd59);
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
  color:#F1C89D;
  .tip-title{
    margin-bottom: 0.1rem;
    font-size: 0.26rem;
  }
  .tip{
    display: flex;
    margin-bottom: .1rem;
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
    .btcLj {
      margin: .1rem 0;
      border: none;
      color: #63381a;
      background-image: linear-gradient(to right, #ffe596, #ffbd59);
      font-size: 0.28rem;
      font-weight: 400;
      border-radius: 0.05rem;
      width: 2.36rem;
      height: 0.68rem;
    }
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
  .turntableBox {
    border-radius: .3rem;
    // background-image: linear-gradient(to bottom, #282a2f , #1b1d22);
    background: #282a2f;
    padding-bottom: .4rem;
  }
  .pddtop {
    padding-top: .4rem;
  }

</style>
