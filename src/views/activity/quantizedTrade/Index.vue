<template>
  <div class="events">
    <div class="bg1">
      <div class="lang" v-if="channelRef === 'h5' && !$store.state.sys.isAppView"><Language /></div>
      <!-- 活动主标题 -->
      <div class="title">
        <div class="bigTitle" :class="{'en': $store.state.app.language === 'en'}"
          >{{ $t('apiTrade.newDexCompetition') }}</div>
        <div class="subTitle" :class="{'en': $store.state.app.language === 'en' ||  $store.state.app.language === 'ko'}"
          >{{ $t('apiTrade.firstTradingCompetition') }}</div>
      </div>
      <!-- 活动数据 -->
      <div class="jackpotData">
        <div class="jackpotItem">
          <div class="jpContent">
            <div class="subTitle">{{ $t('apiTrade.pricePool') }}</div>
            <div>{{ jackpotData.prizePool }}</div>
          </div>
        </div>
        <div class="jackpotItem">
          <div class="jpContent">
            <div class="subTitle">{{ $t('apiTrade.accountQuantity') }}</div>
            <div>{{ jackpotData.totalAccountCount }}</div>
          </div>
        </div>
        <div class="jackpotItem">
          <div class="jpContent">
            <div class="subTitle">{{ $t('apiTrade.totalTradingVolume') }}</div>
            <div>{{ eventsType === 1 ? '—' : jackpotData.totalDealAmt }}</div>
          </div>
        </div>
        <div class="jackpotItem">
          <div class="jpContent">
            <div class="subTitle">{{ $t('apiTrade.grossRate') }}</div>
            <div>{{ eventsType === 1 ? '—' : jackpotData.totalApiOrderCount }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg2">
      <!-- 全球地图 -->
      <div class="map">
        <img width="100%" src="https://nds.340wan.com/static/img/activity/apiTrade/map.gif" alt="">
      </div>
      <!-- 活动倒计时 -->
      <div class="cd" v-if="eventsType !== 0">
        <div v-if="eventsType === 1">{{ $t('apiTrade.competitionStart') }}</div>
        <div v-if="eventsType === 2">{{ $t('apiTrade.competitionEnd') }}</div>
        <span class="timeNum">{{ countDown.days }}</span>
        <span>{{ $t('apiTrade.cdDays') }}</span>
        <span class="timeNum">{{ countDown.hours }}</span>
        <span>{{ $t('apiTrade.cdHours') }}</span>
        <span class="timeNum">{{ countDown.minutes }}</span>
        <span>{{ $t('apiTrade.cdMinutes') }}</span>
        <span class="timeNum">{{ countDown.seconds }}</span>
        <span>{{ $t('apiTrade.cdSeconds') }}</span>
      </div>
      <div class="cd" v-if="eventsType === 0">
        <div>{{ $t('apiTrade.competitionOver') }}</div>
      </div>
    </div>
    <!-- 实时交易榜单 -->
    <div class="tradeRank" id="rank">
      <div class="modelTitle">
        <span>{{ $t('apiTrade.competitionRankList') }}</span>
      </div>
      <div class="rankLists">
        <div>
          <div class="rankTop">
            <span>{{ $t('apiTrade.worldRanking') }}</span>
            <span>{{ $t('apiTrade.competitionAccount') }}</span>
            <span>{{ $t('apiTrade.accumulatedIncome') }}(EOS)</span>
            <span>
              <span>{{ $t('apiTrade.supportHim') }}</span>
              <span class="iconfont icon-huaban31 question" @click="helpTip = true;"></span>
            </span>
          </div>
        </div>
        <div class="list">
          <div class="item" v-for="(item, $index) in rankList" :key="$index">
            <span class="rankImg">
              <span class="imgDiv" v-if="item.rank <= 3">
                <img v-if="item.rank === 1" src="https://nds.340wan.com/static/img/activity/apiTrade/one.png" alt="">
                <img v-if="item.rank === 2" src="https://nds.340wan.com/static/img/activity/apiTrade/two.png" alt="">
                <img v-if="item.rank === 3" src="https://nds.340wan.com/static/img/activity/apiTrade/three.png" alt="">
              </span>
              <span v-if="!item.rank || item.rank > 3">{{ ($index + 1) }}</span>
            </span>
            <span class="account">
              <span>{{ item.accountNo }}</span>
              <span v-if="(!item.lastRank || item.lastRank - item.rank > 0) && item.totalProfit !== null"
                class="iconfont icon-huaban104 up"></span>
              <span v-if="item.lastRank && item.lastRank - item.rank < 0 && item.totalProfit !== null"
                class="iconfont icon-huaban103 down"></span>
            </span>
            <span>{{ item.totalProfit !== null ? handleToFixed(item.totalProfit, 4) : '—' }}</span>
            <span class="helpDiv">
              <span>{{ item.boosterCount || '—' }}</span>
              <span class="help" v-if="eventsType ===2 && item.id !== boostRankId"
                @click="handleAssistance(item)">{{ $t('apiTrade.support') }}</span>
              <span class="help noClick" v-if="eventsType === 2 && item.id === boostRankId">{{ $t('apiTrade.supported') }}</span>
              <span class="help noClick" v-if="eventsType !== 2">{{ $t('apiTrade.support') }}</span>
            </span>
          </div>
        </div>
        <div class="rankTip">
          {{ $t('apiTrade.updateRankList') }}
        </div>
      </div>
    </div>
    <div class="bg3">
      <!-- 大赛奖池 -->
      <div class="jackpotList">
        <div class="modelTitle hasTip">
          <span>{{ $t('apiTrade.pricePool') }}</span>
        </div>
        <!-- <div class="modelTitleTip">
          {{ $t('apiTrade.sortList') }}
        </div> -->
        <div class="outDiv">
          <div class="content">
            <div class="subTitle item">
              <div>{{ $t('apiTrade.individualOfPrizePool') }}</div>
              <div>{{ $t('apiTrade.sponsorDetails') }}</div>
            </div>
            <div class="lists">
              <div class="item" v-for="(item, $index) in sponsorList" :key="$index">
                <div>
                  <!-- <span class="img"></span> -->
                  <img class="img" :src="item.logoUrl" alt="">
                  <span class="account">{{ item.name }}</span>
                </div>
                <div>
                  <span>{{ item.sponsorAmount }}</span>
                  <!-- <span>IQ</span> -->
                </div>
              </div>
            </div>
            <div class="subTitle item mt10">
              <div class="tipDiv">
                <div>
                  <div>{{ $t('apiTrade.adding') }}</div>
                  <div class="tip">{{ $t('apiTrade.sortList') }}</div>
                </div>
              </div>
              <div class="btnDiv">
                <div class="btn" :class="{'en': $store.state.app.language === 'en' ||$store.state.app.language === 'ko'}"
                  @click="handleSponsor">{{ $t('apiTrade.contactSponsor') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 大赛交易对 -->
    <div class="symbolLists">
      <div class="modelTitle">
        <span>{{ $t('apiTrade.tradingPair') }}</span>
      </div>
      <div class="content">
        <div class="item" v-for="(item, $index) in symbolList" :key="$index">
          <div class="itemIn">
            <div class="topInfo">
              <div class="symbolInfo">
                <img class="img" :src="item.logoUrl">
                <span class="symbolName">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
              </div>
              <div>
                <span>{{ $t('apiTrade.accumulatedTradingVolume') }}</span>
                <span>{{ item.totalDealAmt !== null ? handleToFixed(item.totalDealAmt, 4) : '—' }}</span>
                <span>EOS</span>
              </div>
            </div>
            <div class="bottomInfo">
              <div class="intro" style="-webkit-box-orient: vertical;">{{ item.introduction }}</div>
              <div class="">
                <div class="btn" @click="handleToTrade(item)">{{ $t('apiTrade.tradeNow') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tip">
        <span>{{ $t('apiTrade.tradeTotal') }}</span>
        <span class="color-999">{{ $t('apiTrade.transactionPairs') }}</span>
      </div>
      <div class="apply">
        <div class="applyBtn" @click="handleApplySymbol">{{ $t('apiTrade.applyNow') }}</div>
      </div>
    </div>
    <div class="bg4">
      <!-- 大赛流程 -->
      <div class="stepDiv">
        <div class="modelTitle">
          <span>{{ $t('apiTrade.activityProcedure') }}</span>
        </div>
        <div class="content">
          <div class="data">
            <div class="item">
              <div class="time nomt">2019-05-24</div>
              <div class="itemTitle">{{ $t('apiTrade.joinCompetition') }}</div>
              <div class="lists">
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.applyAPI_KEY') }}</div>
                    <div class="tip">{{ $t('apiTrade.getAPI_KEY') }}</div>
                  </div>
                  <div class="right">
                    <div class="btn" @click="handleApplyApiKey">{{ $t('apiTrade.applyNow') }}</div>
                  </div>
                </div>
              </div>
              <div class="itemTitle">{{ $t('apiTrade.signUp') }}</div>
              <div class="lists">
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.tradeSignUp') }}</div>
                    <div class="tip">{{ $t('apiTrade.addAssistant1') }}</div>
                  </div>
                  <div class="right">
                    <div class="btn" @click="handleApplySymbol">{{ $t('apiTrade.signUpNow') }}</div>
                  </div>
                </div>
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.sponsorProject') }}</div>
                    <div class="tip">{{ $t('apiTrade.addAssistant2') }}</div>
                  </div>
                  <div class="right">
                    <div class="btn" @click="handleSponsor">{{ $t('apiTrade.sponNow') }}</div>
                  </div>
                </div>
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.mediaSignUp') }}</div>
                    <div class="tip">{{ $t('apiTrade.addAssistant3') }}</div>
                  </div>
                  <div class="right">
                    <div class="btn" @click="handleApplyMedia">{{ $t('apiTrade.signUpNow') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="time">2019-05-31</div>
              <div class="itemTitle">{{ $t('apiTrade.bigActivity') }}</div>
              <div class="lists">
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.supportDivideReward') }}</div>
                    <div class="tip">{{ $t('apiTrade.supportPartDivideReward') }}</div>
                  </div>
                  <div class="right">
                    <a href="#rank" class="btn" style="color: #FFF">{{ $t('apiTrade.sponsorNow') }}</a>
                  </div>
                </div>
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.symbolNews') }}</div>
                    <div class="tip">{{ $t('apiTrade.symbolNewsTip') }}</div>
                  </div>
                  <div class="right">
                    <div class="btn" @click="handleToArticle">{{ $t('apiTrade.likeNow') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="item">
              <div class="time">2019-06-07</div>
              <div class="itemTitle">{{ $t('apiTrade.over') }}</div>
              <div class="lists">
                <div class="list">
                  <div class="left">
                    <div class="subTitle">{{ $t('apiTrade.releaseReward') }}</div>
                    <div class="tip">{{ $t('apiTrade.releaseRewardAfter') }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <div class="eventsRules">
      <div class="modelTitle">
        <span>{{ $t('apiTrade.activityDetails') }}</span>
      </div>
      <div class="content">
        <div class="rules" ref="rulesDiv">
          <!-- <div class="rulesTitle">活动规则</div> -->
          <div class="rulesContent" :style="transformStytle" ref="rulesContent"
            v-html="eventsRules"></div>
        </div>
      </div>
    </div>

    <!-- 邀请 -->
    <div class="shareDiv">
      <div class="shareTitle"
        :class="{'en': $store.state.app.language === 'en' || $store.state.app.language === 'ko'}">
        <div>{{ $t('apiTrade.competitionSharing1') }}</div>
        <div>{{ $t('apiTrade.competitionSharing2') }}</div>
      </div>
      <div class="content">
        <div class="shareContent">
          {{ $t('apiTrade.copyUrl') }}
        </div>
        <div class="shareBtnDiv">
          <div v-clipboard:copy="$t('apiTrade.copyUrl')"
            v-clipboard:success="handleCopy"
            v-clipboard:error="handleCopyError">{{ $t('apiTrade.copyLink') }}</div>
        </div>
      </div>
    </div>
    <div class="bg5">
      <!-- 主办方 -->
      <div class="partner">
        <div class="modelTitle">
          <span>{{ $t('apiTrade.organizer') }}</span>
        </div>
        <div class="content">
          <img class="img" src="https://nds.340wan.com/static/img/activity/apiTrade/ndx.png" alt="">
        </div>
      </div>
      <!-- 战略合作伙伴 -->
      <div class="partner2">
        <div class="modelTitle">
          <span>{{ $t('apiTrade.organizer1') }}</span>
        </div>
        <div class="content">
          <div class="img" v-for="(item, $index) in strategyPartnerList" :key="$index">
            <img width="100%"
            :src="item.logoUrl" @click="handleToPartnerList(item.linkUrl)">
          </div>
        </div>
      </div>
      <!-- 服务商 -->
      <div class="partner">
        <div class="modelTitle">
          <span>{{ $t('apiTrade.server') }}</span>
        </div>
        <div class="content">
          <img class="img" src="https://nds.340wan.com/static/img/activity/apiTrade/aicoin.png" alt="">
        </div>
      </div>
      <!-- 合作伙伴 -->
      <div class="partner2">
        <div class="modelTitle">
          <span>{{ $t('apiTrade.cooperativePartner') }}</span>
        </div>
        <div class="content">
          <div class="img" v-for="(item, $index) in partnerList" :key="$index">
            <img width="100%"
            :src="item.logoUrl" @click="handleToPartnerList(item.linkUrl)">
          </div>
        </div>
      </div>
    </div>
    <!--  -->

    <!-- 赞助 start -->
    <mt-popup
      class="popup"
      v-model="popupSponsor"
      popup-transition="popup-fade">
      <ApplySponsor v-if="popupSponsor" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 赞助 end -->

    <!-- 媒体 start -->
    <mt-popup
      class="popup"
      v-model="popupMedia"
      popup-transition="popup-fade">
      <ApplyMedia v-if="popupMedia" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 媒体 end -->

    <!-- 为他助力解释弹窗 start -->
    <mt-popup
      class="popup"
      v-model="helpTip"
      popup-transition="popup-fade">
      <div class="helpTip">
        <span class="iconfont icon-huaban17 popupClose" @click="helpTip = false"></span>
        <div class="popupTitle">{{ $t('public.tip') }}</div>
        <div class="popupContent">
          {{ $t('apiTrade.supportTip') }}
        </div>
        <div class="popupBtn" @click="helpTip = false">{{ $t('public.sure') }}</div>
      </div>
    </mt-popup>
    <!-- 为他助力解释弹窗 end -->

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="toApp"
      popup-transition="popup-fade">
      <to-app />
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';

import Language from '@/components/Language';
import ToApp from '@/views/market/components/ToApp';
import { GetUrlPara, countdown, toFixed, dealSymbolSplit } from '@/utils/public';
import { AppToLogin, AppToTrade, accountToSign } from '@/utils/publicApi';
import ApplySponsor from './popup/ApplySponsor';
import ApplyMedia from './popup/ApplyMedia';
// AppInit, AppToLogin, AppToTrade, AppToVipCenter, AppToNdxDialog, AppToShare
export default {
  data() {
    return {
      channelRef: 'dapp',
      urlData: null,
      jackpotData: {
        totalAccountCount: '-',
        prizePool: '-',
        totalProfitRate: '—',
        totalDealAmt: '—',
        totalApiOrderCount: '—',
      }, // 奖池数据
      JackpotTimer: null, // 奖池数据信息 - 1分钟更新一次
      eventsTimer: null, // 活动倒计时 - 活动开始前显示开始倒计时 | 活动进行中显示结束倒计时 | 活动结束后 - 不执行
      countDown: {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        total: 0,
      },
      beginTime: '2019-05-30 17:43:00',
      endTime: '2019-06-14 17:44:00',
      eventsType: 1, // 1: 活动未开始 | 2: 活动进行中 | 0: 活动结束
      rankList: [], // 排行版列表
      symbolList: [], // 交易对列表
      sponsorList: [], // 赞助列表
      eventsRules: '', // 活动规则
      partnerList: [], // 合作伙伴列表
      strategyPartnerList: [], // 战略合作伙伴

      // 弹窗显示参数
      toLogin: false, // 去登录
      toApp: false, // 去下载APP
      assistanceTip: false, // 确定助力提示
      popupSponsor: false, // 赞助弹窗
      popupEnroll: false, // 报名参赛弹窗
      popupSymbolEnroll: false, // 交易对报名
      popupMedia: false, // 媒体报名
      transformStytle: '',
      helpTip: false, // 助力解释

      rankTimer: null, // 排行版定时器
      boostRankId: null, // 助力id
    }
  },
  components: {
    Language,
    ToApp,
    ApplySponsor,
    ApplyMedia,
    mtPopup: Popup
  },
  watch: {
    '$store.state.app.language': function listen() {
      this.handleGetJackpotData();
      this.handleGetEventsInfo();
    }
  },
  created() {
    this.channelRef = localStorage.getItem('channelRef');
  },
  mounted() {
    this.urlData = GetUrlPara();
    this.handleMouted();
  },
  methods: {
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    handleClose() {
      this.popupSponsor = false;
      this.assistanceTip = false;
      this.popupMedia = false;
    },
    // 排行榜定时任务
    handleTimer() {
      window.clearTimeout(this.rankTimer);
      this.rankTimer = window.setTimeout(() => {
        if (Date.parse(new Date()) % 1800000 === 0) {
          this.handleGetJackpotData();
        }
        this.handleTimer();
      }, 1000);
    },
    // 页面加载调用
    handleMouted() {
      // AppInit();
      this.handleGetJackpotData();
      this.handleGetEventsInfo();
      this.handleTimer();
    },
    /* -------- 数据获取展示 start -------- */
    // 获取活动信息
    handleGetEventsInfo() {
      const params = {
        eventCode: 'api-trade'
      }
      this.$http.get('/event/info', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.beginTime = res.eventInfo.beginTime || '2019-05-24 17:43:00';
        this.endTime = res.eventInfo.endTime || '2019-05-30 17:43:00';
        this.sponsorList = res.sponsorList || [];
        let eventsRules = decodeURI(res.eventInfo.introduction);
        eventsRules = eventsRules.replace(/&amp;nbsp;/g, ' ');
        this.eventsRules = eventsRules;
        this.strategyPartnerList = res.strategyPartnerList || [];
        this.partnerList = res.partnerList || [];
        this.handleCountDown();

        const symbolList = res.symbolList || [];
        symbolList.forEach((item) => {
          const obj = dealSymbolSplit(item.symbol);
          this.$set(item, 'symbol1', obj.symbol1.toUpperCase())
          this.$set(item, 'symbol2', obj.symbol2.toUpperCase())
        });

        this.symbolList = symbolList;

        const scale = screen.width / 750;
        this.transformStytle = `transform: scale(${scale});width: 600px;`;
        setTimeout(() => {
          this.$refs.rulesDiv.style.height = `${this.$refs.rulesContent.clientHeight * scale}px`;
        }, 200);
      });
    },
    // 获取大赛奖池数据 - 一分钟更新一次
    handleGetJackpotData() {
      window.clearTimeout(this.JackpotTimer)
      // 接口请求
      const params = {
        eventCode: 'api-trade'
      }
      this.$http.post('/exchangeCompetitionRank/getCompetitionInfo', params).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.jackpotData.prizePool = res.prizePool;
        this.jackpotData.totalAccountCount = res.totalAccountCount;
        this.jackpotData.totalDealAmt = res.totalDealAmt;
        this.jackpotData.totalProfitRate = res.totalProfitRate;
        this.jackpotData.totalApiOrderCount = res.totalApiOrderCount;
        this.rankList = res.rankList || [];
        this.boostRankId = res.boostRankId;
        // this.JackpotTimer = window.setTimeout(() => {
        //   this.handleGetJackpotData();
        // }, 60000);
      });
    },
    // 倒计时 - 获取到开始时间(begin)和结束时间(end)后调用
    handleCountDown() {
      window.clearInterval(this.eventsTimer);
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
    // 获取赞助方名单
    handleGetSponsorList() {
    },
    /* -------- 数据获取展示 end -------- */

    /* -------- 触发事件 start -------- */
    // 账号助力
    handleAssistance(item) {
      try {
        // 网页打开 - 提示用户去下载APP
        if (this.channelRef === 'h5' && !this.$store.state.sys.isAppView) {
          this.toApp = true;
          return;
        }
        // 是APP内部打开
        if (this.$store.state.sys.isAppView) {
          // 判断是否登录
          if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
            AppToLogin();
            return;
          }
        }
        // 判断所属链
        if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
          this.$toast({
            message: this.$t('apiTrade.changeEosAccount'),
            position: 'center',
            duration: 2000,
          });
          return;
        }

        // 判断是否助力过
        if (this.boostRankId) {
          this.$toast({
            message: this.$t('apiTrade.supported'),
            position: 'center',
            duration: 2000
          });
          return;
        }
        // 接口请求 - 为账号助力
        const token = localStorage.getItem('token');
        if (!token) {
          accountToSign(this, () => {
            this.handleAssistance(item)
          })
          return;
        }
        const params = {
          id: item.id,
        }
        this.$http.get('/exchangeCompetitionRank/boostRank', { params }).then((res) => {
          if (res.code === 401) {
            localStorage.removeItem('token')
            this.$toast({
              message: this.$t('error.token'),
              position: 'center',
              duration: 2000,
            });
            setTimeout(() => {
              accountToSign(this, () => {
                this.handleAssistance(item)
              })
            }, 1000);
            return;
          }
          if (res.code === 1022) {
            this.$toast({
              message: this.$t('apiTrade.stopBoost'),
              position: 'center',
              duration: 2000
            });
            return;
          }
          if (res.code !== 0) {
            this.$toast({
              message: this.$t('apiTrade.boostError'),
              position: 'center',
              duration: 2000
            });
            return;
          }
          this.boostRankId = item.id;
          this.handleGetJackpotData();
          this.$toast({
            message: this.$t('apiTrade.boostSuccess'),
            position: 'center',
            duration: 2000
          });
        });
      } catch (error) {
        setTimeout(() => {
          this.handleAssistance(item);
        }, 200);
      }
    },
    // 立即赞助
    handleSponsor() {
      this.popupSponsor = true;
    },
    // 立即交易
    handleToTrade(item) {
      // 是APP内部打开
      if (this.$store.state.sys.isAppView) {
        AppToTrade(item.symbol);
        return;
      }
      const params = {
        symbol: item.symbol, // 交易对名称
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 申请API_KEY
    handleApplyApiKey() {
      location.href = 'https://github.com/newdex/api-docs';
    },
    // 交易对报名
    handleApplySymbol() {
      this.$router.push({
        name: 'applySymbol',
      })
    },
    // 媒体报名
    handleApplyMedia() {
      this.$router.push({
        name: 'applyMedia',
      })
    },
    // 合作媒体报名
    // 文章点赞有奖
    handleToArticle() {
      this.$router.push({
        name: 'articleList'
      })
    },
    // 复制邀请链接
    handleCopy() {
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    handleCopyError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    },
    // 合作伙伴跳转
    handleToPartnerList(link) {
      location.href = link;
    },
    /* -------- 触发事件 end -------- */
  },
  beforeDestroy() {
    // 离开页面 - 注销定时器
    window.clearInterval(this.eventsTimer);
    window.clearTimeout(this.JackpotTimer);
    window.clearTimeout(this.rankTimer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.events{
  font-size: .32rem;
  background: #090D0E;;
  min-height: 100vh;
  color: #fff;
  box-sizing: border-box;

  .bg1{
    background-image: url('https://nds.340wan.com/static/img/activity/apiTrade/a.jpg');
    background-repeat: no-repeat;
    background-size: contain;
  }

  .bg3{
    background-image: url('https://nds.340wan.com/static/img/activity/apiTrade/c.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .bg4{
    background-image: url('https://nds.340wan.com/static/img/activity/apiTrade/d.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .bg5{
    background-image: url('https://nds.340wan.com/static/img/activity/apiTrade/e.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .bg2{
    background-image: url('https://nds.340wan.com/static/img/activity/apiTrade/b.png');
    background-repeat: no-repeat;
    background-size: contain;
    padding-top: .8rem;
    padding-bottom: .2rem;
  }

  // 活动项标题
  .modelTitle{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #00F9F9;
    letter-spacing: 3.6px;
    margin-bottom: .16rem;

    &.hasTip{
      margin-bottom: .12rem;
    }
  }

  .lang{
    position: absolute;
    right: .24rem;
    top: .14rem;
  }

  // 大标题
  .title{
    text-align: center;
    // height: 5rem;
    // width: 5rem;
    margin: auto;
    margin-bottom: .3rem;
    padding-top: .7rem;
    // background: #fafafa;

    .bigTitle{
      font-size: .56rem;
      font-weight: bold;

      &.en{
        font-size: .45rem;
      }
    }

    .subTitle{
      margin-top: .25rem;
      font-size: .2528rem;
      color: #FFFFFF;
      letter-spacing: .1207rem;

      &.en{
        letter-spacing: 0rem;
      }
    }
  }
  // 活动奖池数据
  .jackpotData{
    padding: .6rem .56rem .3rem .56rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .jackpotItem{
      width: 3.08rem;
      height: 1.31rem;
      box-sizing: border-box;
      // background: linear-gradient(135deg,#56F1FD , #3784EA);
      background: #081723;
      border-radius: .165rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      // padding: 1px;
      &:nth-child(3),
      &:nth-child(4){
        margin-top: .2rem;
      }

      .jpContent{
        background: #081723;
        border-radius: .16rem;
        text-align: center;
        font-size: .297rem;

        .subTitle{
          font-size: .264rem;
          margin-bottom: .1rem;
          color: #00FFFF;
        }
      }
    }
  }

  // 地图
  .map{
    width: 6.78rem;
    // height: 3.5rem;
    margin: auto;
    margin-bottom: .45rem;
    // background: rgba($color: #000000, $alpha: .58);
  }

  // 倒计时
  .cd{
    text-align: center;
    font-size: .2542rem;
    .timeNum{
      color: #00FFFF;
      // background: #aaa;
    }
  }

  // 实时交易榜单
  .tradeRank{
    padding: .45rem .23rem .54rem;
    box-sizing: border-box;

    .rankLists{
      padding: .2rem .2rem .3rem .2rem;
      box-sizing: border-box;
      border: 1px solid #77F7FA;
      border-radius: .15rem;

      .rankTop{
        margin-bottom: .12rem;
        font-size: .24rem !important;
        color: #FFF !important;

        &>span:nth-child(1){
          padding-left: .08rem;
          box-sizing: border-box;
        }
        &>span:nth-child(4){
          padding-right: .08rem;
        }

        .question{
          font-size: .24rem;
          color: $color-yellow;
        }
      }

      .item{
        height: .6rem;;
      }

      .rankTop,
      .item{
        color: #00F9F9;
        font-size: .1468rem;
        display: flex;
        align-items: center;

        &>span:nth-child(1){
          min-width: .6rem;
          max-width: .6rem;
          margin-right: .15rem;
        }
        &>span:nth-child(2){
          min-width: 1.6rem;
          max-width: 1.6rem;
          margin-right: .1rem;
        }
        &>span:nth-child(3){
          width: 1.8rem;
          margin-right: .1rem;
          text-align: right;
        }
        &>span:nth-child(4){
          flex: 1;
          text-align: right;
          // width: 1rem;
        }
        // &>span:nth-child(5){
        //   width: 1.16rem;
        // }

        .helpDiv{
          display: flex;
          align-items: center;
          justify-content: flex-end;

          &>span:first-child{
            margin-right: .1rem;
          }
        }
      }

      .list{
        padding: .18rem .1rem .14rem 0rem;
        box-sizing: border-box;
        background: #081723;
        border-radius: 4.19px;
        height: 7.2rem;
        overflow: auto;

        .item{
          font-size: .18rem;

          &>span:nth-child(1){
            text-align: center;
          }

          .rankImg{
            display: flex;
            align-items: center;
            justify-content: center;

            &>.imgDiv{
              width: .36rem;

              img{
                width: 100%;
              }
            }
          }

          .account{
            display: flex;
            align-items: center;

            .up{
              font-size: .16rem;
              color: #50E3C2;
            }
            .down{
              font-size: .16rem;
              color: $color-red;
            }
          }

          .help{
            // background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
            background: #F5A623;
            border-radius: .1rem;
            width: 1.14rem;
            height: .45rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;

            &.noClick{
              background: $color-999;
            }
          }
        }
      }

    }

    .rankTip{
      font-size: .18rem;
      padding-top: .2rem;
      // padding-bottom: .35rem;
    }
  }

  // 大赛奖池
  .jackpotList{
    padding-top: .3rem;

    .modelTitleTip{
      font-size: .18rem;
      text-align: center;
      padding-bottom: .13rem;
    }

    .outDiv{
      width: 6.95rem;
      // height: 5.42rem;;
      // border: 1px solid #038C8D;
      margin: auto;
      border-radius: .1218rem;
      box-sizing: border-box;
      margin-top: .12rem;

      .content{
        border: 1px solid #77F7FA;
        height: 100%;;
        border-radius: .15rem;
        padding: .28rem .18rem .27rem .24rem;
        box-sizing: border-box;

        // &>div{
        //   // padding-left: .2rem;
        // }

        .subTitle{
          font-size: .23rem;
          color: #77F7FA;
          padding-bottom: .19rem;
          box-sizing: border-box;

          &.mt10{
            margin-top: .4rem;
          }

          .tipDiv{
            font-size: .24rem;
          }

          .tip{
            margin-top: .08rem;
            font-size: .18rem;
            color: #fff;
          }
        }

        .item{
          display: flex;
          align-items: center;
          height: .65rem;;

          &>div{
            flex: 1;
            display: flex;
            align-items: center;

            &:nth-child(1){
              padding-left: .2rem;
            }
          }

          .img{
            width: .4rem;
            border-radius: 100rem;
            margin-right: .08rem;
            background: #FFF;
          }

          .btnDiv{
            display: flex;
            justify-content: flex-end;
            // padding-right: .3rem;

            .btn{
              // background-image: linear-gradient(0deg, #426BFF 0%, #00FFFE 100%);
              background: #26ADFC;
              width: 1.64rem;
              height: .56rem;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: .24rem;
              border-radius: .08rem;
              color: #FFF;

              &.en{
                width: 2.3rem;
              }
            }
          }
        }

        .lists{
          background: rgba($color: #000000, $alpha: .38);
          padding: .16rem 0rem .22rem 0rem;
          box-sizing: border-box;
          // height: 3.4rem;
          overflow: auto;
          border-radius: .06rem;
          margin-bottom: .2rem;

          .item{
            display: flex;
            align-items: center;

            &>div{
              flex: 1;

              &:nth-child(1){
                font-size: .24rem;
              }
              &:nth-child(2){
                font-size: .27rem;
              }
            }
          }
        }
      }
    }
  }

  // 大赛交易对
  .symbolLists{
    padding-top: 1.26rem;

    .content{
      .item{
        width: 6.92rem;
        box-sizing: border-box;
        margin: auto;
        border-radius: .12rem;
        // background: linear-gradient(135deg,#426BFF , #3D9EFF);
        // padding: 1px;
        margin-bottom: .3rem;

        &:last-child{
          margin-bottom: 0rem;
        }

        .itemIn{
          background: #081723;
          border-radius: .12rem;
          padding: .22rem;
          border: 1px solid #00F9F9;
          box-sizing: border-box;

          &>div{
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.topInfo{
              font-size: .24rem;

              .symbolInfo{
                display: flex;
                align-items: center;
                font-size: .36rem;

                .symbolName{
                  color: #77F7FA;
                }

                .img{
                  width: .45rem;
                  height: .45rem;
                  border-radius: 100rem;
                  background: #FFF;
                  margin-right: .1rem;
                }
              }
            }

            &.bottomInfo{
              margin-top: .3rem;

              .intro{
                font-size: .21rem;
                width: 3.95rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .btn{
                // background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
                background: #F5A623;
                border-radius: .08rem;
                width: 1.64rem;
                height: .6rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .24rem;
              }
            }
          }
        }
      }
    }

    .tip{
      font-size: .18rem;
      width: 6.5rem;
      margin: auto;
      overflow: hidden;
      margin-top: .15rem;

      &>span:first-child{
        float: left;
        margin-bottom: .1rem;
      }
      &>span:last-child{
        float: right;
      }
    }

    .apply{
      width: 6.5rem;
      margin: auto;
      display: flex;
      justify-content: flex-end;
      .applyBtn{
        background: #26ADFC;
        border-radius: .08rem;
        font-size: .24rem;
        width: 1.64rem;
        height: .56rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: .08rem;
      }
    }
  }

  // 大赛流程
  .stepDiv{
    padding-top: .5rem;
    margin-bottom: .6rem;

    .content{
      font-size: .21rem;

      .data{
        box-sizing: border-box;
        width: 6.9rem;
        margin: auto;
        border: 1px solid #00F9F9;
        padding: .3rem .22rem;
        border-radius: .1rem;

        .item{

          &>div{
            padding: 0px .2rem;
          }

          .time{
            margin-top: .6rem;
            font-size: .28rem;
            margin-bottom: .3rem;

            &.nomt{
              margin-top: 0rem;
            }
          }

          .itemTitle{
            color: #77F7FA;
            font-size: .32rem;
            margin-bottom: .1rem;
          }

          .lists{
            background: rgba(0, 0, 0, .38);
            border-radius: .1144rem;
            margin-bottom: .3rem;

            &:last-child{
              margin-bottom: 0rem;
            }

            .list{
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: .3rem 0px;

              .subTitle{
                font-size: .27rem;
                color: #77F7FA;
              }

              .btn{
                // background-image: linear-gradient(0deg, #426BFF 0%, #00FFFE 100%);
                background: #F5A623;
                border-radius: .08rem;
                height: .6rem;
                width: 1.39rem;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: .2rem;
              }
            }
          }
        }

        .rules{
          font-size: .32rem;
          text-align: center;

          .rulesTitle{
            color: #77F7FA;
            margin-bottom: .2rem;
          }
        }
      }
    }
  }

  // 活动详情
  .eventsRules{
    padding-top: .4rem;
    margin-bottom: .6rem;

    .content{
      font-size: .21rem;
      border: 1px solid #00F9F9;
      border-radius: .08rem;
      width: 6.9rem;
      margin: auto;
      padding: .0rem .2rem;
      box-sizing: border-box;

      .rules{
        padding: .2rem;
        background: #000;
        border-radius: .1144rem;
        position: relative;

        .rulesContent{
          transform-origin:0% 0%;
          width: 100%;
          min-height: 3rem;
          border-radius: .1144rem;
          word-wrap: break-word;
          font-size: .24rem !important;
          white-space: pre-wrap;
        }
      }
    }
  }

  // 邀请
  .shareDiv{
    margin-top: .6rem;

    .shareTitle{
      text-align: center;
      color: #00F9F9;
      font-size: .36rem;
      letter-spacing: .0405rem;

      &.en{
        letter-spacing: 0rem;
        font-size: .33rem;
      }
    }

    .content{
      width: 6.95rem;
      margin: auto;
      border: 1px solid #77F7FA;
      margin-top: .4rem;
      padding: .3rem .2rem .2rem;
      box-sizing: border-box;
      border-radius: .15rem;

      .shareTip{
        font-size: .27rem;
        color: #77F7FA;
        margin-bottom: .16rem;
      }

      .shareContent{
        background: #081723;
        border-radius: .053rem;
        font-size: .21rem;
        padding: .13rem .18rem;
        margin-bottom: .28rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
      }

      .shareBtnDiv{
        display: flex;
        justify-content: flex-end;

        &>div{
          // background-image: linear-gradient(0deg, #426BFF 0%, #00FFFE 100%);
          background: #26ADFC;
          border-radius: .08rem;

          height: .66rem;
          font-size: .24rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.14rem;

          &:last-child{
            margin-left: .26rem;
          }
        }
      }
    }
  }

  // 合作伙伴
  .partner{
    margin-top: .5rem;
    margin-bottom: .3rem;

    .content{
      width: 6.71rem;
      margin: auto;
      border-radius: .1144rem;
      text-align: center;

      .img{
        width: 3rem;
        height: .84rem;
        margin: auto;
      }
    }
  }

  // 战略合作伙伴
  .partner2{
    margin-top: .7rem;

    &:last-child{
      padding-bottom: .5rem;
    }

    .content{
      width: 6.71rem;
      margin: auto;
      text-align: center;
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      text-align: center;

      .img{
        width: 2.17rem;
        // height: .84rem;
        // background: rgba(255, 255, 255, 0.3);
        margin: .03rem;

        &>img{
          display: block;
        }
      }
    }
  }
}
.popup{
  background: transparent;
}

.helpTip{
  width: 5.5rem;
  background: #FFF;
  color: $color-333;
  font-size: .3rem;
  border-radius: .1rem;
  padding: .2rem .4rem;
  box-sizing: border-box;
  // padding-top: .5rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-999;
    font-size: .25rem;
  }

  .popupTitle{
    color: $color-this;
    text-align: center;
    font-size: .36rem;
    padding-top: .2rem;
    padding-bottom: .3rem;
  }

  // .popupContent{
  // }

  .popupBtn{
    background: $color-this;
    color: #FFF;
    width: 2.4rem;
    height: .6rem;
    border-radius: .08rem;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: .2rem;
    margin-top: .4rem;
  }
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}
</style>
