<template>
  <div class="newpos" :class="{'hasPos': accountPoolInfo, 'isMove': isMove}">
    <mt-loadmore
      class="loadmore"
      :class="{'type2': Number(accountVotesCount) || accountPoolInfo}"
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="$t('public.loadingMoreTip1')"
      :bottomDropText="$t('public.loadingMoreTip2')"
      :bottomLoadingText="$t('public.loadingMoreTip3')"
      :top-method="loadTop"
      :bottom-all-loaded="true"
      :auto-fill="false"
      ref="loadmore"
    >
      <div class="top">
        <div class="topInfoDiv">
          <!-- <div class="topWeights one" v-if="isTextWeights === 0 && showNotice"
            @click="handleAtten">{{$t('newpos.errorTop2')}}
            <i class="iconfont icon-huaban17" @click.stop="handleCloseNotice"></i>
          </div> -->
          <div class="topWeights" v-if="isTextWeights === 1" @click="handleWeights">
            {{$t('newpos.weightsTop2',{num: accountPoolInfo ? accountPoolInfo.attenuationRate : 10})}}
          </div>
          <div class="topWeights three" v-if="isTextWeights === 2" @click="handleWeights">
            {{$t('newpos.weightsTop3',{num: accountPoolInfo ? accountPoolInfo.attenuationRate : 10})}}
          </div>
        </div>
        <div class="tools">
          <!-- <div class="backDiv" v-if="!this.$store.state.sys.isAppView"
          @click="handleBack"><span class="iconfont icon-huaban11 back"></span></div>-->
          <div class="topTitle">Newpos</div>
        </div>

        <!-- info -->
        <div class="info">
          <div class="profit">
            <div
              class="percent"
            >{{ posInfo.maxAnnualizedRate ? posInfo.maxAnnualizedRate : '0.00' }}%</div>
            <div>
              <span>{{ $t('newpos.ysdMaxProfit') }}</span>
              <span class="detail" @click="handleToAnnualPofit">{{ $t('newpos.look') }}</span>
            </div>
          </div>
          <div class="subInfo">
            <div>
              <div>
                <div class="subTitle">{{ $t('newpos.posAccountCount') }}</div>
                <div
                  class="num"
                  style="text-align: center;"
                >{{ posInfo.poolAccountCount ? posInfo.poolAccountCount : '-' }}</div>
              </div>
            </div>
            <div>
              <div>
                <div class="subTitle">
                  <span>{{ $t('newpos.posCount') }}(EOS)</span>
                  <span class="detail" @click="showAllVotesDetail = true">{{ $t('newpos.detail') }}</span>
                </div>
                <div
                  class="num"
                  style="text-align: center;"
                >{{ posInfo.poolVotesCount ? posInfo.poolVotesCount : '-' }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- info end -->
      </div>
      <!-- top end -->

      <!-- 挖矿 -->
      <div class="pos">
        <div class="notPoser" v-if="!(Number(accountVotesCount) || accountPoolInfo)">
          <div class="title">{{ $t('newpos.howToPos') }}</div>
          <div class="content">{{ $t('newpos.howToPosTip') }}</div>
          <div class="btn" @click="handleIncreaseOfVotes">{{ $t('newpos.posNow') }}</div>
          <!-- <div class="btn">{{ $t('newpos.comingSoon') }}</div> -->
        </div>

        <div
          class="isPoser"
          :class="{'enStyle': $store.state.app.language === 'en'}"
          v-if="Number(accountVotesCount) || accountPoolInfo"
        >
          <div class="selfProfitDiv">
            <div class="accountPos">
              <div>
                <span class="subTitle">{{ $t('newpos.accountYsdYearProfit') }}</span>
                <span class="posDetail" @click="showDetail = true">{{ $t('newpos.detail') }}</span>
              </div>
              <div
                class="num yestodayNum"
              >{{ accountPoolInfo ? handleToFixed(accountPoolInfo.annualizedRate, 2) : '0.00' }}%</div>
            </div>
            <div class="accountPos">
              <div>
                <span class="subTitle">{{ $t('newpos.accountPosCount') }}</span>
                <span class="posDetail" @click="showVotesDetail = true">{{ $t('newpos.detail') }}</span>
              </div>
              <div class="num">{{ handleToFixed(accountVotesCount, 4) }} EOS</div>
              <div @click.stop="handleWeights">
                <div class="fontWeights" v-show="isTextWeights === 1">
                  <div v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">
                      ({{$t('newpos.weightsDesc')}}
                    <i class="iconfont icon-huaban31 question"></i>)
                  </div>
                  <div v-else>
                      （{{$t('newpos.weightsDesc')}}
                    <i class="iconfont icon-huaban31 question"></i>）
                  </div>
                </div>
                <!-- 权重已衰减 -->
                <div class="color-red" v-show="isTextWeights === 2">
                  <div v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'">
                    ({{$t('newpos.weightsDesc2')}}
                    <i class="iconfont icon-huaban31 question"></i>)
                  </div>
                  <div v-else>（{{$t('newpos.weightsDesc2')}}
                  <i class="iconfont icon-huaban31 question"></i>）
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="posData">
            <div class="yestoday">
              <div>
                <span class="subTitle">{{ $t('newpos.ysdNodeProfit') }}</span>
                <!-- <span class="posDetail" @click="handleToBonus">{{ $t('newpos.history') }}</span> -->
              </div>
              <div
                class="num yestodayNum"
              >{{ accountPoolInfo ? accountPoolInfo.nodeIncome : '0.0000' }} EOS</div>
            </div>
            <div class="allBonus">
              <div>
                <span class="subTitle">{{ $t('newpos.accumulatedNodeIncome') }}</span>
                <span class="posDetail" @click="handleToBonus">{{ $t('newpos.history') }}</span>
              </div>
              <div class="num">{{ accountPoolInfo ? accountPoolInfo.accNodeIncome : '0.0000' }} EOS</div>
            </div>
            <div class="otherBonus">
              <div class="subTitle">{{ $t('newpos.ysdRexProfit') }}</div>
              <div class="num">{{ accountPoolInfo ? accountPoolInfo.rexIncome : '0.0000' }} EOS</div>
            </div>
            <div class="otherBonus">
              <div class="subTitle">{{ $t('newpos.accumulatedRexIncome') }}</div>
              <div class="num">{{ accountPoolInfo ? accountPoolInfo.accRexIncome : '0.0000' }} EOS</div>
            </div>
          </div>
          <div class="posTip">
            <div>{{ $t('newpos.posTip1') }}</div>
            <div>{{ $t('newpos.posTip2') }}</div>
            <div>{{ $t('newpos.posTip3') }}</div>
          </div>
        </div>
      </div>

      <!-- 提示 -->
      <div class="tipDiv">
        <div class="tipDivTitle">{{ $t('newpos.aboutNewpos') }}</div>
        <div class="item">
          <div class="imgDiv">
            <span class="iconfont icon-huaban109 icon"></span>
          </div>
          <div class="explain">
            <div class="title">{{ $t('newpos.newposTipTitle1') }}</div>
            <div class="tip">{{ $t('newpos.newposTip1_1') }}</div>
            <div class="tip">{{ $t('newpos.newposTip1_2') }}</div>
          </div>
        </div>
        <div class="item">
          <div class="imgDiv">
            <span class="iconfont icon-huaban110 icon small"></span>
          </div>
          <div class="explain">
            <div class="title">{{ $t('newpos.newposTipTitle2') }}</div>
            <div class="tip">{{ $t('newpos.newposTip2_1') }}</div>
            <div class="tip">{{ $t('newpos.newposTip2_2') }}</div>
          </div>
        </div>
        <div class="item">
          <div class="imgDiv">
            <span class="iconfont icon-huaban111 icon small1"></span>
          </div>
          <div class="explain">
            <div class="title">{{ $t('newpos.newposTipTitle3') }}</div>
            <div class="tip">{{ $t('newpos.newposTip3_1') }}</div>
            <div class="tip">{{ $t('newpos.newposTip3_2') }}</div>
          </div>
        </div>
        <div class="toZendesk">
          <div @click="handleToZendesk">{{ $t('newpos.notes') }}></div>
        </div>
      </div>

      <!-- 最新记录 -->
      <div class="newList">
        <div class="subTool">
          <span>{{ $t('newpos.newRecords') }}</span>
          <span class="minsTip">{{ $t('newpos.per3Min') }}</span>
        </div>
        <div class="lists">
          <div class="list" v-for="(item, $index) in posNewLists" :key="$index">
            <div>
              <div class="time">{{ handleToLocalTime(item.createTs).substr(0, 16) }}</div>
              <div class="type color-green" v-if="item.type === 1">{{ $t('newpos.addPos') }}</div>
              <div class="type color-red" v-if="item.type === 2">{{ $t('newpos.lessPos') }}</div>
            </div>
            <div>
              <div class="account">{{ item.account }}</div>
              <div class="get">{{ handleToFixed(item.count, 4) }} EOS</div>
            </div>
          </div>
        </div>
      </div>
    </mt-loadmore>

    <!-- 活动入口 start -->
    <EventsEntrance v-if="showImg" @listenMove="handleMove" />
    <!-- 活动入口 end -->

    <!-- 悬浮按钮 -->
    <div class="fixedBtnDiv" v-if="Number(accountVotesCount) || accountPoolInfo">
      <div @click="handleReduceVotes">{{ $t('newpos.lessPos') }}</div>
      <div @click="handleIncreaseOfVotes">{{ $t('newpos.addPos') }}</div>
    </div>

    <!-- 投票总量明细弹窗 start -->
    <mt-popup class="popup" v-model="showAllVotesDetail" popup-transition="popup-fade">
      <PopupAllVotesDetail
        v-if="showAllVotesDetail"
        :proxyVotesInfos="proxyVotesInfos"
        @listenClose="handleClose"
      />
    </mt-popup>
    <!-- 投票总量明细弹窗 end -->

    <!-- 账户票数明细弹窗 start -->
    <mt-popup class="popup" v-model="showVotesDetail" popup-transition="popup-fade">
      <PopupVotesDetail
        v-if="showVotesDetail"
        @listenClose="handleClose"
        :rexCount="accountVotes.rex"
        :stakeCount="accountVotes.stakeCount"
      />
    </mt-popup>
    <!-- 账户票数明细弹窗 end -->

    <!-- dialog -->
    <mt-popup class="tipPopup" v-model="showDialog" popup-transition="popup-fade">
      <to-app />
    </mt-popup>

    <!-- dialog -->
    <mt-popup class="tipPopup" v-model="showAppDialog" popup-transition="popup-fade">
      <PopupToDapp @listenClose="handleClose" />
    </mt-popup>

    <!-- EOS账户操作 -->
    <mt-popup class="tipPopup" v-model="showToEosChain" popup-transition="popup-fade">
      <PopupToEosChain @listenClose="handleClose" />
    </mt-popup>

    <!-- 昨日最高年化收益 start -->
    <mt-popup class="popup" v-model="showDetail" popup-transition="popup-fade">
      <PopupYsdAccountBonus
        v-if="showDetail"
        :posInfo="accountPoolInfo"
        @listenClose="handleClose"
      />
    </mt-popup>
    <!-- 昨日最高年化收益 end -->

    <!-- 挖矿权重弹窗 start -->
    <mt-popup class="popup" v-model="showWeights" popup-transition="popup-fade">
      <PopupWeights
        v-if="showWeights"
        :accountProxy="accountProxy"
        :accountPoolInfo="accountPoolInfo"
        @listenClose="handleClose"
      />
    </mt-popup>
    <!-- 挖矿权重弹窗 end -->
  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import { toFixed, toLocalTime } from '@/utils/public';
import { getAccountRexData } from '@/utils/publicApi';

import axios from 'axios';
import ToApp from '@/views/market/components/ToApp';
import PopupAllVotesDetail from './components/PopupAllVotesDetail';
import PopupVotesDetail from './components/PopupVotesDetail';
import PopupToDapp from './components/PopupToDapp';
import PopupYsdAccountBonus from './components/PopupYsdAccountBonus';
import PopupToEosChain from './components/PopupToEosChain';
import PopupWeights from './components/PopupWeights';
import EventsEntrance from './components/EventsEntrance';

export default {
  data() {
    return {
      hasPos: true,
      showAllVotesDetail: false,
      showVotesDetail: false,
      posInfo: {}, // 矿池总信息
      proxyVotesInfos: [], // 代理明细
      posNewLists: [], // 矿池最新操作记录
      accountPoolInfo: null,
      newRecordTimer: null, // 最新记录定时器 - 10s
      channelRef: 'dapp',
      showDialog: false,
      showAppDialog: false,
      showToEosChain: false,
      showDetail: false,
      accountProxy: '', // 账号委托的代理账户
      accountVotesCount: '0.0000',
      accountVotes: {
        rex: '0.0000',
        stakeCount: '0.0000'
      },
      timer: null,
      isMove: false, // 事都拖动活动入口
      endTime: 1561003200000,
      nowTime: Date.parse(new Date()),
      showImg: false,
      eventsTimer: null,
      showWeights: false, // 显示权重弹窗
      isTextWeights: 0, // 显示权重即将衰减文字: 0 - 显示公告(暂时只显示一周) | 1 - 即将衰减 | 2 - 已经衰减,
      showNotice: false // 关于newdex 运行机制 true 显示
    };
  },
  components: {
    PopupAllVotesDetail,
    PopupVotesDetail,
    ToApp,
    PopupToDapp,
    PopupYsdAccountBonus,
    PopupToEosChain,
    EventsEntrance,
    PopupWeights
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
    }
  },
  mounted() {
    this.handleMouted();
    this.$refs.loadmore.onTopLoaded();
  },
  methods: {
    /* ----- 关闭 关于Newpos挖矿权重衰减的说明gonstart ----- */
    handleCloseNotice() {
      this.showNotice = false
      localStorage.setItem('newposErrorNotice1', false)
    },
    /* ----- 关闭 关于Newpos挖矿权重衰减的说明gonstart ----- */

    /* ----- 打开权重弹窗start ----- */
    handleWeights() {
      // 请求数据后弹窗
      // console.log(this.accountProxy) //newposproxy2
      this.showWeights = true;
    },
    /* ----- 打开权重弹窗end   ----- */
    handleMouted() {
      this.isTextWeights = 0;
      this.channelRef = localStorage.getItem('channelRef');
      this.handleGetPosInfo();
      this.handleGetPosNewLists();
      if (
        (this.channelRef === 'dapp' || this.$store.state.sys.isAppView) &&
        this.$store.state.app.accountInfo &&
        this.$store.state.app.accountInfo.account
      ) {
        this.handleGetNotice()
        this.handleGetAccountPosInfo();
      }
      this.handleGetEventsTimer();
    },
    handleGetEventsTimer() {
      window.clearTimeout(this.eventsTimer);
      this.nowTime = new Date();
      if (this.nowTime <= this.endTime) {
        this.showImg = true;
        this.eventsTimer = window.setTimeout(() => {
          this.handleGetEventsTimer();
        }, 1000);
        return;
      }
      this.showImg = false;
    },
    // 下拉刷新
    loadTop() {
      this.handleMouted();
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 500);
    },
    // 是否拖动
    handleMove(data) {
      this.isMove = data;
    },
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    handleToLocalTime(time) {
      return toLocalTime(time);
    },
    handleBack() {
      history.back();
    },
    // 关闭弹窗
    handleClose(type) {
      this.showAllVotesDetail = false;
      this.showVotesDetail = false;
      this.showAppDialog = false;
      this.showDetail = false;
      this.showDialog = false;
      this.showToEosChain = false;
      this.showWeights = false;

      if (type) {
        setTimeout(() => {
          if (this.$store.state.sys.isAppView) {
            this.showAppDialog = true;
            return;
          }
          this.handleMouted();
        }, 500);
      }
    },
    // 查看年华收益
    handleToAnnualPofit() {
      this.$router.push({
        name: 'annualProfit'
      });
    },
    // 查看分红收益
    handleToBonus() {
      this.$router.push({
        name: 'bonus'
      });
    },
    // 增加票数
    handleIncreaseOfVotes() {
      if (this.$store.state.sys.isAppView) {
        this.showAppDialog = true;
        return;
      }
      if (this.channelRef === 'h5') {
        this.showDialog = true;
        return;
      }
      if (
        this.$store.state.app.accountInfo &&
        this.$store.state.app.accountInfo.chain !== 'eos'
      ) {
        this.showToEosChain = true;
        return;
      }
      this.$router.push({
        name: 'increaseOfVotes'
      });
    },
    // 减少票数
    handleReduceVotes() {
      if (this.$store.state.sys.isAppView) {
        this.showAppDialog = true;
        return;
      }
      if (this.channelRef === 'h5') {
        this.showDialog = true;
        return;
      }
      if (
        this.$store.state.app.accountInfo &&
        this.$store.state.app.accountInfo.chain !== 'eos'
      ) {
        this.showToEosChain = true;
        return;
      }
      this.$router.push({
        name: 'reduceVotes'
      });
    },
    // 跳转关于衰减机制
    handleAtten() {
      const lang = this.$store.state.app.language.toLowerCase();
      if (lang === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360032501692';
        return;
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360032501692`;
    },
    // 跳转zendesk
    handleToZendesk() {
      const lang = this.$store.state.app.language.toLowerCase();
      if (lang === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360029247352';
        return;
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360029247352`;
    },
    // 获取矿池信息
    handleGetPosInfo() {
      this.$http.post('/pool/getPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.posInfo = res.poolInfo || {};
        this.proxyVotesInfos = this.posInfo.proxyVotesInfos || [];

        if (
          (this.channelRef === 'dapp' || this.$store.state.sys.isAppView) &&
          this.$store.state.app.accountInfo &&
          this.$store.state.app.accountInfo.account
        ) {
          this.handleGetAccountInfo();
        }
      });
    },
    // 获取矿池最新操作记录
    handleGetPosNewLists() {
      window.clearTimeout(this.newRecordTimer);
      const params = {
        limit: 15
      };
      this.$http
        .get('/pool/getLatestOperationRecords', { params })
        .then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.posNewLists = res.operationRecords || [];
          this.newRecordTimer = window.setTimeout(() => {
            this.handleGetPosNewLists();
            this.handleGetPosInfo();
          }, 10000);
        });
    },
    // 获取是否 显示关于newdex 机制公告
    handleGetNotice() {
      const notice = localStorage.getItem('newposErrorNotice1') ? JSON.parse(localStorage.getItem('newposErrorNotice1')) : true;
      this.showNotice = notice;
    },
    // 获取账户挖矿信息
    handleGetAccountPosInfo() {
      this.$http.post('/pool/getAccountPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.accountPoolInfo = res.accountPoolInfo;
        if (res.accountPoolInfo) {
          this.isTextWeights = res.accountPoolInfo.attenuationStatus || 0;
          const account = this.$store.state.app.accountInfo.account;
          let localData = localStorage.getItem(account)
            ? Number(localStorage.getItem(account))
            : 0;
          if (this.isTextWeights !== 0 && localData !== this.isTextWeights) {
            // 本地状态和
            localData = this.isTextWeights;
            localStorage.setItem(account, localData);
            this.showWeights = true;
            return;
          }
          if (localData === this.isTextWeights) {
            return;
          }
          localStorage.removeItem(account);
        }
      });
    },
    /* -------- 获取用户总挖矿数 - 平台代理 & REX数量 & CUP/NET抵押数量(抵押列表为准) ------- */
    // 获取账户代理信息
    handleGetAccountInfo() {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account
        };
        const nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.accountVotesCount = '0.0000';
          return;
        }
        axios
          .post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params))
          .then((response) => {
            if (response.data.voter_info) {
              this.accountProxy = response.data.voter_info.proxy || '';
            }
            // 判断代理是否是平台账户
            const index = this.proxyVotesInfos.findIndex(
              item => item.proxyName === this.accountProxy
            );
            if (index === -1) {
              this.accountVotesCount = '0.0000';
              return;
            }
            // 查询账户REX & Cpu/Net 抵押
            this.handleGetAccountVotes();
          });
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 获取账户REX & CPU
    handleGetAccountVotes() {
      getAccountRexData((err, res) => {
        if (err || res.code !== 0) {
          return;
        }
        const rexVotes = res.data.vote_stake.split(' ')[0];
        this.accountVotes.rex = rexVotes;
        // 查询抵押列表
        this.handleGetStakedInfo(rexVotes);
      });
    },
    // 查询抵押列表
    handleGetStakedInfo(rexVotes) {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.accountVotesCount = '0.0000';
          return;
        }
        const params = {
          code: 'eosio',
          json: true,
          limit: 50,
          lower_bound: '',
          scope: this.$store.state.app.accountInfo.encodeName,
          table: 'delband',
          table_key: '',
          upper_bound: ''
        };
        const nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        axios
          .post(`${nodeHttp}/v1/chain/get_table_rows`, JSON.stringify(params))
          .then((response) => {
            if (response.data.rows.length < 1) {
              this.accountVotesCount = rexVotes;
              this.accountVotes.stakeCount = '0.0000';
              return;
            }
            const stakeList = response.data.rows;
            let stakedCount = 0;
            stakeList.forEach((item) => {
              const cpu = Number(item.cpu_weight.split(' ')[0]);
              const net = Number(item.net_weight.split(' ')[0]);
              stakedCount = Decimal.add(Number(stakedCount), cpu).toString();
              stakedCount = Decimal.add(Number(stakedCount), net).toString();
            });
            this.accountVotes.stakeCount = toFixed(stakedCount, 4);
            this.accountVotesCount = Decimal.add(
              Number(stakedCount),
              Number(rexVotes)
            ).toString();

            window.clearTimeout(this.timer);
            this.timer = window.setTimeout(() => {
              this.handleGetAccountInfo();
            }, 10000);
          });
      } catch (error) {
        setTimeout(() => {
          this.handleGetStakedInfo();
        }, 200);
      }
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.newRecordTimer);
    window.clearTimeout(this.timer);
    window.clearTimeout(this.eventsTimer);
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .fixedBtnDiv {
    padding-bottom: 0.6rem !important;
  }
  .newpos {
    &.hasPos {
      padding-bottom: 1.7rem !important;
    }

    .loadmore {
      &.type2 {
        height: calc(100vh - 1.73rem) !important;
      }
    }
  }
}

.newpos {
  font-size: 0.24rem;

  &.isMove {
    height: 100vh;
    overflow: hidden;
  }

  &.hasPos {
    padding-bottom: 1.2rem;
  }

  .loadmore {
    height: 100vh;
    overflow: auto;

    &.type2 {
      height: calc(100vh - 1.23rem);
    }
  }

  .top {
    text-align: center;
    color: #fff;
    background-image: linear-gradient(-1deg, #14152b 0%, #2c3859 100%);
    .topWeights {
      height: 0.7rem;
      width: 100%;
      padding: 0 0.24rem;
      box-sizing: border-box;
      background: #f6c85c;
      color: $color-red;
      font-size: 0.25rem;
      line-height: 0.7rem;
      text-align: left;
      position: relative;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      .icon-huaban17{
        position: absolute;
        right: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: .2rem;
        color:#fff;
      }
      &.one {
        background: #8197D3;
        color: #fff;
      }
      &.three {
        background: #f2dba4;
      }
    }
    .tools {
      height: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .backDiv {
        position: absolute;
        left: 0px;
        height: 100%;
        width: 0.7rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .back {
          font-size: 0.3rem;
          display: block;
          transform: rotate(180deg);
        }
      }

      .topTitle {
        font-size: 0.36rem;
      }
    }
  }

  .info {
    margin-top: 0.6rem;

    .detail {
      color: #f2dba4;
      margin-left: 0.12rem;
    }

    .profit {
      margin-bottom: 0.72rem;
      .percent {
        font-size: 0.64rem;
        color: #f2dba4;
        margin-bottom: 0.06rem;
      }
    }

    .subInfo {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.6rem;

      & > div {
        flex: 1;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .subTitle {
        color: #8197d3;
        margin-bottom: 0.1rem;
      }

      .num {
        font-size: 0.32rem;
      }
    }
  }

  .pos {
    background: #fff;
    padding: 0.55rem 0.3rem 0.63rem;
    font-size: 0.25rem;

    .notPoser {
      text-align: center;

      .title {
        font-size: 0.32rem;
        margin-bottom: 0.06rem;
      }
      .btn {
        background: #f6c85c;
        border-radius: 0.15rem;
        height: 0.84rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.32rem;
        color: #8b572a;
        margin-top: 0.5rem;
      }
    }

    .isPoser {
      .subTitle {
        color: $color-999;
      }

      .posDetail {
        color: $color-this;
        margin-left: 0.08rem;
      }
      &.enStyle {
        .posDetail {
          display: block;
          color: $color-this;
          margin-left: 0rem;
        }
      }

      .num {
        font-size: 0.32rem;
        margin-top: 0.12rem;
      }

      .selfProfitDiv {
        display: flex;
        flex-wrap: wrap;

        .accountPos {
          flex: 1;
          border-bottom: 1px solid $color-input;
          padding: 0px 0.05rem 0.36rem;
          box-sizing: border-box;

          &:last-child {
            padding-left: 0.5rem;
          }
          .fontWeights {
            line-height: 0.4rem;
            font-size: 0.25rem;
            color: #f5a623;
          }

          .question {
            font-size: 0.25rem;
          }
        }
        .yestodayNum {
          color: #f5a623;
        }
      }

      .posData {
        display: flex;
        flex-wrap: wrap;
        padding: 0.36rem 0.05rem 0;

        & > div {
          width: 50%;
          margin-bottom: 0.48rem;

          &:nth-child(2n) {
            box-sizing: border-box;
            padding-left: 0.27rem;
          }
        }

        .yestodayNum {
          color: #f5a623;
        }
      }

      .posTip {
        font-size: 0.24rem;
        & > div {
          margin-top: 0.16rem;
          position: relative;
          padding-left: 0.15rem;
          color: $color-999;

          &:first-child {
            margin-top: 0rem;
          }

          &::before {
            content: "";
            position: absolute;
            width: 0.0612rem;
            height: 0.0612rem;
            background: $color-input;
            border-radius: 0.1rem;
            left: 0px;
            top: 50%;
            transform: translate(0px, -50%);
          }
        }
      }
    }
  }

  .fixedBtnDiv {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #fff;
    padding: 0.14rem 0.2rem 0.24rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 0.05rem $color-input;

    & > div {
      width: 3.42rem;
      height: 0.83rem;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.28rem;
      color: #8b572a;
      border-radius: 0.0694rem;
      border: 1px solid #f6c85c;
      margin-right: 0.16rem;

      &:last-child {
        margin-right: 0rem;
        border: 1px solid transparent;
        background: #f6c85c;
      }
    }
  }

  .tipDiv {
    background: #fff;
    // padding: .4rem .25rem;
    box-sizing: border-box;

    .tipDivTitle {
      height: 0.75rem;
      display: flex;
      align-items: center;
      padding-left: 0.25rem;
      font-size: 0.25rem;
      background: #fafafa;
    }

    .item {
      margin: 0px 0.3rem 0.2rem 0.25rem;
      display: flex;
      padding-top: 0.4rem;

      &:first-child {
        border-top: 1px solid $color-input;
      }

      &:last-child {
        padding-bottom: 0.4rem;
        margin-bottom: 0rem;
      }

      .imgDiv {
        padding-top: 0.05rem;
        padding-left: 0.12rem;
        width: 0.56rem;
        min-width: 0.56rem;
        max-width: 0.56rem;
        display: flex;
        justify-content: center;

        .icon {
          font-size: 0.56rem;
          color: $color-this;
        }
        .small {
          font-size: 0.42rem;
        }
        .small1 {
          font-size: 0.4rem;
        }
      }

      .explain {
        padding-left: 0.28rem;

        .title {
          font-size: 0.3rem;
          margin-bottom: 0.09rem;
          color: #f5a623;
        }
      }
    }

    .toZendesk {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 0.36rem;
      margin-top: 0.3rem;
      margin-right: 0.3rem;
      color: $color-this;
    }
  }

  .newList {
    .subTool {
      height: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.3rem 0 0.25rem;
      font-size: 0.25rem;

      .minsTip {
        color: $color-999;
      }
    }
    .lists {
      background: #fff;

      .list {
        padding: 0.39rem 0rem 0.23rem;
        margin: 0px 0.3rem;
        border-bottom: 1px solid $color-input;

        &:last-child {
          border-bottom: 1px solid transparent;
        }

        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;

          &:last-child {
            margin-top: 0.09rem;
          }

          .time {
            color: $color-999;
          }
          .type {
            font-size: 0.25rem;
          }
          .account {
            font-size: 0.3rem;
          }
          .get {
            font-size: 0.27rem;
          }
        }
      }
    }
  }
}

.popup {
  background: transparent;
  top: 30%;
  transform: translate(-50%, -30%);
}
.tipPopup {
  width: 80%;
  border-radius: 0.1rem;
  font-size: 0.32rem;
  color: $color-333;
  text-align: center;
}
</style>
