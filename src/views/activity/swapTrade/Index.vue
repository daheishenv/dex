<template>
  <div class="swapTrade">
    <header>
      <i class="iconfont icon-huaban23 logoicon"></i>
      <!-- <i class="iconfont icon-huaban129 moreIcon"></i> -->
      <div class="language">
          <Language/>
      </div>
    </header>
    <div class="banner flexc">
      <img src="@/assets/img/activity/swapTrade/title1.png" alt="" v-if="$store.state.app.language === 'zh-CN'">
      <img src="@/assets/img/activity/swapTrade/title1TW.png" alt="" v-else-if="$store.state.app.language === 'zh-TW'">
      <img src="@/assets/img/activity/swapTrade/title1en.png" alt="" v-else>
    </div>
    <!-- 倒计时 -->
    <div class="jackpotBack">
      <div class="jackpot">
        <div class="jackpotBottom">
          <p v-if="eventsType === 1">{{ $t('apiTrade.competitionStart') }}</p>
          <p v-else-if="eventsType === 2">{{ $t('apiTrade.competitionEnd') }}</p>
          <p v-else-if="eventsType === 0">{{ $t('apiTrade.competitionOver') }}</p>
          <div v-if="eventsType !== 0" class="flexc timeCls">
            <span class="colorSky">{{countDown.days}}</span>
            <span>{{ $t('Trading.Trading5') }}</span>
            <span class="colorSky">{{countDown.hours}}</span>
            <span>{{ $t('Trading.Trading6') }}</span>
            <span class="colorSky">{{countDown.minutes}}</span>
            <span>{{ $t('Trading.Trading7') }}</span>
            <span class="colorSky">{{countDown.seconds}}</span>
            <span>{{ $t('Trading.Trading8') }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 大赛排行榜 -->
    <div class="tradeListBack" id="list">
      <div class="tradeList">
        <div class="tradeListTitle flexc">
          <img src="@/assets/img/activity/swapTrade/title2.png" alt="" v-if="$store.state.app.language === 'zh-CN'">
          <img src="@/assets/img/activity/swapTrade/title2TW.png" alt="" v-else-if="$store.state.app.language === 'zh-TW'">
          <img src="@/assets/img/activity/swapTrade/title2en.png" alt="" v-else>
        </div>
        <div class="currentRanking flex" v-if="$store.state.app.accountInfo && Object.keys(ownerRank).length !== 0">
          <!-- 当前排行： -->
          <div>
            <span>{{ $t('Trading.Trading10') }}</span>
            <span class="whiteColor">{{ ownerRank.rank || '-' }}</span>
          </div>
          <div v-if="ownerRank.rank !== 1">
            <!-- 距前一名还差 -->
            <span>{{ $t('Trading.Trading11') }}</span>
            <span class="whiteColor" style="margin: 0 10px">{{ownerRank.upgradeAmount && Math.abs(ownerRank.upgradeAmount) || '-'}} USDT</span>
            <!-- <span>收益</span> -->
          </div>
        </div>
        <div class="tradeListWrap">
          <div class="tradeListCont">
            <ul class="tradeListCaption flex">
              <li>{{ $t('Trading.Trading12') }}</li>
              <li>{{ $t('Trading.Trading13') }}</li>
              <li>{{ $t('Trading.Trading14') }}</li>
            </ul>
            <div class="apiList">
              <template v-if="competitionInfo.rankList && competitionInfo.rankList.length > 0">
                <ul class="list flex" v-for="(item, index) in competitionInfo.rankList" :key="index">
                  <!-- 排名 -->
                  <li v-if="item.rank === 1" class="flexc">
                    <img src="@/assets/img/activity/swapTrade/num1.png" alt="">
                  </li>
                  <li v-else-if="item.rank === 2" class="flexc">
                    <img src="@/assets/img/activity/swapTrade/num2.png" alt="">
                  </li>
                  <li v-else-if="item.rank === 3" class="flexc">
                    <img src="@/assets/img/activity/swapTrade/num3.png" alt="">
                  </li>
                  <li v-else>{{ item.rank || '--'}}</li>
                  <!-- 账号 -->
                  <li>
                    {{ item.accountNo || '--'}}
                    <template v-if="item.totalProfit !== null">
                      <i class="iconfont icon-huaban104 colorGreen" v-if="!item.lastRank || item.rank - item.lastRank < 0"></i>
                      <i class="iconfont icon-huaban103 colorRed" v-else-if="item.rank - item.lastRank > 0"></i>
                    </template>
                  </li>
                  <!-- 累计收益 -->
                  <li v-if="item.totalProfit && item.totalProfit !== null">{{ toFixed(item.totalProfit, 4)}}</li>
                  <li v-else-if="item.totalProfit === 0">{{ toFixed(item.totalProfit, 4)}}</li>
                  <li v-else>--</li>
                </ul>
              </template>
              <div v-else class="apiList flexc" style="color: #fff">
                {{ $t('public.noData') }}
              </div>
            </div>
            <div class="ownList" v-if="$store.state.app.accountInfo && Object.keys(ownerRank).length !== 0">
              <!-- 自己排行 -->
              <ul class="list flex">
                <li>{{ ownerRank.rank || '-' }}</li>
                <li>{{ ownerRank.accountNo }}</li>
                <li>{{ ownerRank.totalProfit }}</li>
              </ul>
            </div>
            <!-- 交易榜每小时更新一次 -->
            <p style="color: #8197D3;">{{ $t('Trading.Trading15') }}</p>
          </div>
        </div>
        <div class="tradeBtn flexc">
          <!-- 去交易 -->
          <div class="toTrade" @click="handleToTrade">
            {{ $t('Trading.Trading16') }}
          </div>
          <!-- 去分享 -->
          <!-- <div class="toShare" @click="handleToShare">
            {{ $t('Trading.Trading32') }}
          </div> -->
        </div>
      </div>
    </div>
    <!-- 活动奖励 -->
    <div class="activityReward">
      <div class="flexc">
        <img class="titleImg" src="@/assets/img/activity/swapTrade/title3.png" alt="" v-if="$store.state.app.language === 'zh-CN'">
        <img class="titleImg" src="@/assets/img/activity/swapTrade/title3TW.png" alt="" v-else-if="$store.state.app.language === 'zh-TW'">
        <img class="titleImg" src="@/assets/img/activity/swapTrade/title3en.png" alt="" v-else>
      </div>
      <div class="flexc">
        <img class="rewardImg" src="@/assets/img/activity/swapTrade/title5.png" alt="" v-if="$store.state.app.language === 'zh-CN'">
        <img class="rewardImg" src="@/assets/img/activity/swapTrade/title5TW.png" alt="" v-else-if="$store.state.app.language === 'zh-TW'">
        <img class="rewardImg" src="@/assets/img/activity/swapTrade/title5en.png" alt="" v-else>
      </div>
    </div>
    <!-- 大赛规则 -->
    <div class="tradeProcessBack">
      <div class="tradeProcess">
        <div class="tradeProcessTitle flexc">
          <img src="@/assets/img/activity/swapTrade/title4.png" alt="" v-if="$store.state.app.language === 'zh-CN'">
          <img src="@/assets/img/activity/swapTrade/title4TW.png" alt="" v-else-if="$store.state.app.language === 'zh-TW'">
          <img src="@/assets/img/activity/swapTrade/title4en.png" alt="" v-else>
        </div>
        <div class="tipTitle">{{ $t('Trading.Trading41') }}</div>
        <div class="tradeProcessCont">
          <!-- 奖励分配 -->
          <div class="matchSignUp">
            <p class="title1">{{ $t('Trading.Trading24') }}</p>
            <div class="main">
              <div class="flexb">
                <div class="mainLeft">
                  <span>Top1：Apple Watch6</span>
                  <span>Top2：200USDT</span>
                  <span>Top3：158USDT</span>
                  <span>Top4：108USDT</span>
                  <span>Top5：98USDT</span>
                  <span>Top6：88USDT</span>
                  <span>Top7：77USDT</span>
                  <span>Top8：66USDT</span>
                  <span>Top9：55USDT</span>
                  <span>Top10：37USDT</span>
                  <span>Top11-30：{{ $t('Trading.Trading22') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 活动规则 -->
          <div class="matchSignUp">
            <p class="title1">{{ $t('Trading.Trading25') }}</p>
            <div class="main">
              <div class="flexb">
                <div class="mainLeft">
                  <span>{{ $t('Trading.Trading26') }}</span>
                  <span>{{ $t('Trading.Trading27') }}</span>
                  <span>{{ $t('Trading.Trading28') }}</span>
                  <span>{{ $t('Trading.Trading29') }}</span>
                  <span>{{ $t('Trading.Trading30') }}</span>
                  <span>{{ $t('Trading.Trading31') }}</span>
                  <span>{{ $t('Trading.Trading38') }}</span>
                  <span>{{ $t('Trading.Trading39') }}</span>
                  <span>{{ $t('Trading.Trading40') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { accountToSign } from '@/utils/publicApi';
import { toFixed, countdown } from '@/utils/public';
import Language from '@/components/Language';

export default {
  name: 'swapTrade', // 聚合交易大赛
  data() {
    return {
      ownerRank: {}, // 个人信息
      countdownTimer: false, // 比赛倒计时
      endtime: null,
      beginTime: null,
      cDate: { // 比赛倒计时
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0,
      },
      countDown: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0,
      },
      eventsType: 1, // 倒计时状态 0-预热 1-进行中 2-已结束
      hiddenVissible: false, // 预热隐藏
      competitionInfo: {
        rankList: [
        ]
      }, // 大赛奖池信息
      eventsTimer: null,
    }
  },
  components: {
    Language
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.handleGetSymbol();
    this.handleCompetitionInfo();
    this.handleOwnInfo();
  },
  beforeDestroy() {
    window.clearInterval(this.eventsTimer);
  },
  methods: {
    // 倒计时 - 获取到开始时间(begin)和结束时间(end)后调用
    handleCountDown() {
      clearInterval(this.eventsTimer);
      // 判断活动阶段 - 未开始(1) | 进行中(2) | 结束(0)
      let cd = countdown(this.beginTime);
      let type = 1;
      if (cd.total <= 0) {
        cd = countdown(this.endTime);
        if (cd.total <= 0) {
          this.countDown = cd;
          this.eventsType = 0; // 活动结束 - 直接退出
          return;
        }
        type = 2; // 活动进行中
      }
      this.countDown = cd;
      this.eventsType = type;

      this.eventsTimer = window.setInterval(() => {
        this.handleCountDown();
      }, 1000);
    },
    // 个人信息
    handleOwnInfo() {
      const params = {
        eventCode: 'swap-trade'
      };
      this.$http.post('/exchangeCompetitionRank/rankInfo', params).then((res) => {
        if (res.code !== 0) {
          // this.$message.error(res.msg);
          return;
        }
        this.ownerRank = res.ownerRank || {};
      });
    },
    // 获取列表数据
    handleGetSymbol() {
      const params = {
        eventCode: 'swap-trade'
      };
      this.$http.post('/event/info', params).then((res) => {
        if (res.code !== 0) {
          // this.$message.error(res.msg);
          return;
        }
        this.beginTime = res.eventInfo.beginTime || '2019-05-24 17:43:00';
        this.endTime = res.eventInfo.endTime || '2019-05-30 17:43:00';
        this.handleCountDown();
      });
    },
    // 获取交易大赛统计信息
    handleCompetitionInfo() {
      const params = {
        eventCode: 'swap-trade'
      };
      this.$http.post('/exchangeCompetitionRank/getCompetitionInfo', params).then((res) => {
        if (res.code !== 0) {
          // this.$message.error(res.msg);
          return;
        }
        this.competitionInfo = res;
      });
      setTimeout(() => {
        this.handleCompetitionInfo();
      }, 6000);
    },
    // 开始倒计时
    handleCountdownStart() {
      this.countdownTimer = window.setInterval(() => {
        this.handleCountdown()
      }, 1000);
    },
    // 比赛倒计时
    handleCountdown() {
      if (this.cDate.total <= 0) {
        clearInterval(this.countdownTimer);
        // 倒计时结束
        return;
      }
      this.cDate = countdown(this.endtime);
      // if (this.cDate.total > 0) {
      //   this.countdownTip
      // }
    },
    // 点击交易对跳转交易页面
    handleToTrade() {
      this.$router.push({
        name: 'linek',
        params: {
          symbol: 'eosio.token-eos-usdt', // 交易对名称
        },
      });
      // this.$router.push('/trade/eosio.token-eos-usdt');
    },
    handleToShare() {
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.$router.push({
            name: 'shareImg'
          });
        })
        return;
      }
      this.$router.push({
        name: 'shareImg'
      });
    },
    toFixed,
  },
}
</script>
<style lang="scss" scoped>
.colorRed {
  color: #FF1739 !important;
  font-size: .15rem;
}

.colorGreen {
  color: #47B183 !important;
  font-size: .15rem;
}

.swapTrade {
  padding-bottom: 1rem;
  // min-height: 1500rem;
  background: #0B165D;
  .banner {
    height: 4.6rem;
    background: url('../../../assets/img/activity/swapTrade/topBack.png') no-repeat;
    background-size: cover;

    img {
      display: block;
      width: 7.3rem;
    }
  }
  .jackpotBack {
    position: relative;
    z-index: 1;
    color: #8197D3;

    .jackpot {
      margin: 0 auto;

      .jackpotBottom {
        text-align: center;
        font-size: .38rem;

        .timeCls {
          margin-top: .3rem;
        }

        .colorSky {
          display: inline-block;
          color: #fff;
          margin: 0 .1rem;
          background: #3a49a1;
          width: .6rem;
          height: .6rem;
          border: .05rem solid #8197D3;
          border-radius: .1rem;
          line-height: .6rem;
        }
      }
    }
  }
  .tradeListBack {
    padding: .3rem;
    .tradeList {
      margin: 1rem auto 0;
      padding-bottom: 1rem;

      .tradeListTitle {
        margin-bottom: .5rem;

        img {
          display: block;
          width: 3.2rem;
        }
      }

      .currentRanking {
        margin: 0 auto .3rem;
        font-size: .24rem;
        color: #8197D3;
        padding: 0 .1rem;

        div:nth-child(1) {
          margin-right: .3rem;
        }

        .whiteColor {
          color: #fff;
        }
      }

      .tradeListWrap {
        // width: 10.8rem;
        height: 10.7rem;
        margin: 0 auto;
        border: .02rem solid #8BA7F2;
        box-shadow: 0 0 .09rem 0 #77F7FA;
        border-radius: .15rem;

        .tradeListCont {
          padding: 0 .26rem;

          .tradeListCaption {
            font-size: .26rem;
            color: #fff;

            li {
              flex: 2;
              line-height: .83rem;
              text-align: center;
            }

            li:nth-child(1) {
              flex: 1.3;
            }

            li:nth-child(2) {
              // text-align: center;
              flex: 2.5;
            }

            li:nth-child(3) {
              padding-right: .5rem;
              // text-align: right;
              flex: 3;
            }
          }
          // 自己的排行样式
          .ownList {
            background: rgba(129, 151, 211, 0.25);
            font-size: .20rem;
            color: #00f9f9;
            overflow: auto;
            margin-top: .03rem;

            .list {
              line-height: .80rem;

              li {
                flex: 2;
                text-align: center;
                color: #fff;
              }

              li:nth-child(1) {
                flex: 1.3;
                text-align: center;
              }

              li:nth-child(2) {
                // text-align: center;
                flex: 2.5;
                font-size: .26rem;
              }

              li:nth-child(3) {
                padding-right: .50rem;
                // text-align: right;
                flex: 3;
                font-size: .28rem;
              }
            }
          }

          .apiList {
            height: 8.4rem;
            // background: rgba(129, 151, 211, 0.25);
            font-size: .20rem;
            color: #32E3FF;
            overflow: auto;

            .list {
              line-height: .80rem;
              background: rgba(129, 151, 211, 0.25);
              margin-bottom: .03rem;
              &:last-child {
                margin-bottom: 0;
              }
              img {
                display: block;
                width: .50rem;
                height: .43rem;
              }

              li {
                flex: 2;
                text-align: center;
              }

              li:nth-child(1) {
                flex: 1.3;
                text-align: center;
                color: #8BA7F2;
              }

              li:nth-child(2) {
                // text-align: center;
                flex: 2.5;
                font-size: .26rem;
              }

              li:nth-child(3) {
                padding-right: .50rem;
                // text-align: right;
                flex: 3;
                font-size: .28rem;
              }
            }
          }

          p {
            font-size: .16rem;
            color: #fff;
            line-height: .55rem;
          }
        }
      }

      .tradeBtn {
        padding: 0 .3rem;
        margin-top: .36rem;
        div {
          cursor: pointer;
          color: #fff;
          font-size: .32rem;
          text-align: center;
          line-height: .8rem;
          width: 3rem;
          height: .8rem;
          background-image: linear-gradient(90deg, #6163E2 0%, #E184B2 100%);
          box-shadow: 0 .01rem .04rem 0 #105DCC;
          border-radius: .20rem;
        }

        .toShare {
          background-image: linear-gradient(90deg, #6163E2 0%, #E184B2 100%);
          box-shadow: 0 .01rem .04rem 0 #105DCC;
        }
      }
    }
  }
  .activityReward {
    margin: 0 auto;

    .titleImg {
      display: block;
      width: 3.5rem;
    }

    .rewardImg {
      display: block;
      width: 7rem;
      margin-top: .55rem;
    }
  }
  .tradeProcessBack {
    padding: .3rem;
    .tradeProcess {
      margin: .7rem auto 0;

      .tradeProcessTitle {
        margin-bottom: .55rem;
        img {
          display: block;
          width: 3.70rem;
        }
      }

      .tipTitle {
        font-size: .28rem;
        color: #fff;
        line-height: .44rem;
        margin-bottom: .2rem;
      }

      .tradeProcessCont {
        margin: 0 auto;
        border: .02rem solid #8BA7F2;
        box-shadow: 0 0 .09rem 0 #77F7FA;
        border-radius: .15rem;
        padding: .20rem .25rem;
        font-size: .28rem;

        & > div {
          margin-bottom: .30rem;
        }

        .title1 {
          font-size: .3rem;
          color: #32E3FF;
          margin-bottom: .20rem;
        }

        .main {
          padding: .30rem;
          background: rgba(129, 151, 211, 0.25);

          .mainLeft {
            span {
              display: block;
              font-size: .28rem;
              color: #fff;
              line-height: .52rem;
            }
          }
        }
      }
    }
  }
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // font-size: 0.6rem;
  padding: 0.3rem 0.3rem 0rem 0.3rem;
  box-sizing: border-box;
  color: #ffffff;
  position: relative;
  .language{
    position: absolute;
    top: 0.4rem;
    right: 0.2rem;
  }
}
.logoicon {
  font-size: 0.4rem;
}
</style>
