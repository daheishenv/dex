<template>
  <div class="newpos">
    <!-- EOS样式 -->
    <div class="" v-if="$store.state.app.accountInfo.chain === 'eos'">
      <div class="eosDiv">
        <div class="eosNewpool" @click="handleToNewPos">
          <div class="eosYsdMaxProfit">
            <label class="title">Newpool</label>
            <span class="yesd">{{ $t('newpos.yesd') }}</span>
          </div>
          <div class="eosYsdMaxProfit">
            <label class="yesd" :class="{ en: $store.state.app.language === 'en' }">{{ $t('newpos.yesdDesc') }}</label>
            <span class="num">{{ handleToFixed(poolInfo.maxAnnualizedRate, 2) || '-' }}%</span>
          </div>
        </div>
        <div class="eosNewpool" @click="handleToDanchor">
          <div class="eosYsdMaxProfit">
            <label class="title">USN</label>
            <span class="yesd">{{ $t('Lab.Lab117') }}</span>
          </div>
          <div class="eosYsdMaxProfit">
            <label class="yesd" :class="{ en: $store.state.app.language === 'en' }">{{ $t('Lab.Lab116') }}</label>
            <span class="num">{{ handleToFixed(danchorStaked, 4) || '-' }}</span>
          </div>
        </div>
      </div>
      <!-- Defibox , Lab 、糖果空投 & 每日抽奖 入口 start -->
      <div class="lists">
        <div class="list" @click="handleToDefisBox">
          <div class="lucky" style="height:.5rem">
            <img src="https://nds.340wan.com/static/img/more/defibox.png" style="width:.45rem" alt="" />
          </div>
          <div class="lh">Defibox</div>
        </div>
        <div class="list" @click="handleToOgx">
          <div class="lucky" style="height:.5rem" :class="{ isVip: $store.state.app.vipInfo.level }">
            <img src="@/assets/img/more/organix.png" style="width:.45rem" alt="" />
          </div>
          <div>Organix</div>
        </div>
        <div class="list" @click="handleToLab">
          <div class="lucky" style="height:.5rem" :class="{ isVip: $store.state.app.vipInfo.level }">
            <!-- <img src="@/assets/img/more/lab.png" style="width:.45rem" alt=""> -->
            <span class="iconfont icon-huaban216" style="font-size:.34rem; margin-bottom:.04rem;color:#4a90e2"></span>
          </div>
          <div>Seed</div>
        </div>
        <div class="list" @click="handleToDraw">
          <div class="lucky" style="height:.5rem" :class="{ isVip: $store.state.app.vipInfo.level }">
            <!-- <img src="@/assets/img/more/cj.png" style="width:.45rem" alt=""> -->
            <span class="iconfont icon-huaban313" style="font-size:.4rem; margin-bottom:.02rem;color:#4a90e2"></span>
          </div>
          <div>{{ $t('luckDraw.dailyLuckyDraw') }}</div>
        </div>
        <div class="list" @click="handleToCandyBox">
          <div class="lucky" style="height:.5rem" :class="{ isVip: $store.state.app.vipInfo.level }">
            <!-- <img src="@/assets/img/more/candy.png" style="width:.45rem" alt=""> -->
            <span class="iconfont icon-huaban96" style="font-size:.4rem; margin-bottom:.02rem;color:#4a90e2"></span>
          </div>
          <div>{{ $t('vip.airdrop') }}</div>
        </div>
        <!-- <div class="list" @click="handleToNew">
          <div class="lucky" style="height:.5rem" :class="{ isVip: $store.state.app.vipInfo.level }">
            <span class="iconfont icon-huaban310" style="font-size:.4rem; margin-bottom:.02rem;color:#4a90e2"></span>
          </div>
          <div>{{ $t('index.Lab78') }}</div>
        </div> -->
      </div>
    </div>
    <!-- 糖果空投 & 每日抽奖 入口 end -->

    <!-- 首页矿池入口 -->
    <!-- 未抵押矿池显示 start -->
    <div class="showDiv" :class="`${chainClass}`" v-if="$store.state.app.accountInfo.chain !== 'eos'" @click="handleToNewPos">
      <div class="tipDiv">
        <div class="title">Newpool</div>
        <div class="tip">{{ $t('newpos.newposTip') }}</div>
      </div>
      <div class="tipDiv profit" v-if="$appName === 'eosNewdex'">
        <div class="ysdMaxProfit">{{ $t('newpos.ysdMaxProfit') }}</div>
        <div class="num apr">{{ handleToFixed(poolInfo.maxAnnualizedRate, 2) || '-' }}%</div>
      </div>
      <div class="tipDiv profit" v-else>
        <div class="ysdMaxProfit">{{ $t('newpos.ysdApr') }}</div>
        <div class="num apr">{{ handleToFixed(poolInfo.annualizedRate, 2) || '-' }}%</div>
      </div>
    </div>
    <!-- 未抵押矿池显示 end -->

    <!-- 抵押矿池显示 start -->
    <!-- <div :class="`showDiv hasDiv ${chainClass}`" v-if="$store.state.app.accountInfo.chain !== 'eos'" @click="handleToNewPos">
      <div class="posInfo">
        <div class="title">Newpool</div>
        <div class="info">
          <div class="subTitle">{{ $t('newpos.ysdNodeProfit') }}</div>
          <div class="num">{{ accountPoolInfo.nodeIncome }} {{coin}}</div>
        </div>
      </div>
      <div class="posInfo">
        <div class="accountInfo">
          <span class="subTitle">{{ $t('newpos.accountYsdYearProfit') }}:</span>
          <span class="apr">{{ handleToFixed(accountPoolInfo.annualizedRate, 2) || '-' }}%</span>
        </div>
        <div class="info" v-if="$appName === 'eosNewdex'">
          <div class="subTitle">{{ $t('newpos.ysdRexProfit') }}</div>
          <div class="num">{{ accountPoolInfo.rexIncome || '0.0000'}} {{coin}}</div>
        </div>
        <div class="info" v-else>
          <div class="subTitle">{{ $t('newpos.accountPosCount') }}</div>
          <div class="num">{{ votedCount }} {{coin}}</div>
        </div>
      </div>
    </div> -->
    <!-- 抵押矿池显示 end -->
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { toFixed, getReqUrl } from '@/utils/public';

export default {
  data() {
    return {
      has: true, // 是否有参加矿池: true = 有 | 没有 - false
      accountPoolInfo: null,
      poolInfo: {},
      channelRef: 'dapp',
      coin: 'EOS',
      votedCount: '0',
      tronVoteAccount: '',
      danchorStaked: '0.0000',
    };
  },
  watch: {
    '$store.state.app.accountInfo.account': function listen() {
      this.handleMouted();
    },
  },
  computed: {
    chainClass() {
      const chain = this.$store.state.sys.urlChain || this.$store.state.app.accountInfo.chain || 'eos';
      return chain;
    },
  },
  mounted() {
    if (this.$appName === 'tronNewdex') {
      this.coin = 'TRX';
    } else if (this.$store.state.sys.urlChain === 'bos') {
      this.coin = 'BOS';
    }
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.channelRef = localStorage.getItem('channelRef');
      this.handleGetAccountPosInfo();
      this.handleGetDanchorStaked();
    },
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    handleToDefisBox() {
      // this.$router.push({
      //   name: 'swap',
      // });
      let http = 'https://defibox.340wan.com/swap';
      if (this.$evn === 'test') {
        http = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT22}`;
      }
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const chain = this.$store.state.sys.urlChain || this.$store.state.app.accountInfo.chain || 'eos';
      window.location.href = `${http}/?language=${lang}&chain=${chain}&channel=${channel}`;
    },
    // 抽奖
    handleToDraw() {
      this.$router.push({
        name: 'luckDraw',
      });
    },
    // 糖果空投
    handleToCandyBox() {
      this.$router.push({
        name: 'candyBox',
      });
    },
    // 跳转到矿池
    handleToNewPos() {
      let http = 'https://newpool.340wan.com';
      if (this.$evn === 'test') {
        http = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT21}`;
      }
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const chain = this.$store.state.sys.urlChain || this.$store.state.app.accountInfo.chain || 'eos';
      window.location.href = `${http}/${chain}/?language=${lang}&chain=${chain}&channel=${channel}`;
    },
    // 跳转到Danchor
    handleToDanchor() {
      const env = process.env.NODE_ENV;
      let http = 'https://defibox.340wan.com/usn';
      if (env === 'test') {
        http = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT22}/usn`;
      }
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const chain = this.$store.state.sys.urlChain || this.$store.state.app.accountInfo.chain || 'eos';
      window.location.href = `${http}?language=${lang}&chain=${chain}&channel=${channel}`;
    },
    // 跳转到Lab
    handleToLab() {
      let http = 'https://lab.340wan.com';
      if (this.$evn === 'test') {
        http = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT23}`;
      }
      const lang = this.$store.state.app.language || 'en';
      const channel = this.$store.state.app.channel || 'scatter';
      const chain = this.$store.state.sys.urlChain || this.$store.state.app.accountInfo.chain || 'eos';
      window.location.href = `${http}/?language=${lang}&chain=${chain}&channel=${channel}`;
    },
    handleToOgx() {
      let http = 'https://www.ogx.network/dapp?ref=newdexinvite';
      window.location.href = http;
    },

    handleToNew() {
      let lang = this.$store.state.app.language || 'en';
      lang = lang.toLowerCase();
      if (lang === 'en') {
        lang = 'en-us';
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/sections/360009669151`;
    },
    // 获取账户挖矿信息
    handleGetAccountPosInfo() {
      this.$http.post('/pool/getAccountPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.tronVoteAccount = res.accountPoolInfo.tronVoteAccount;
        this.poolInfo = {
          maxAnnualizedRate: res.accountPoolInfo.maxAnnualizedRate,
          annualizedRate: res.accountPoolInfo.annualizedRate,
        };
        if (res.accountPoolInfo.annualizedRate) {
          this.accountPoolInfo = res.accountPoolInfo;
        } else {
          this.accountPoolInfo = null;
        }

        this.handleGetTronAccInfo();
      });
    },
    handleGetDanchorStaked() {
      this.$http.post('/common/getDanchorInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.danchorStaked = res.pledge || '0.0000';
      });
    },
    // 获取波场账户信息
    handleGetTronAccInfo() {
      if (this.$appName !== 'tronNewdex') {
        return;
      }
      try {
        DApp.getVotes((err, res) => {
          if (err) {
            this.votedCount = '0.0000';
            return;
          }
          // 判断是否有为平台账户投票
          const votedList = res.votedLists.find((v) => this.tronVoteAccount === v.address) || {};
          this.votedCount = Number(votedList.count || 0);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetTronAccInfo();
        }, 200);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/public.scss';

.newpos {
  // margin: .09rem .18rem;
  .eosDiv {
    display: flex;
    padding: 0 0.16rem;
    box-sizing: border-box;
    .eosNewpool {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0.15rem 0.2rem 0.2rem;
      background: #fff;
      margin-right: 0.09rem;
      border-radius: 0.07rem;
      &:last-child {
        margin-right: 0px;
      }
      .eosYsdMaxProfit {
        font-size: 0.21rem;
        color: #4a4a4a;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:first-child {
          margin-bottom: 0.15rem;
        }
        .title {
          font-size: 0.3rem;
          color: #4a4a4a;
          letter-spacing: 0;
        }
        .yesd {
          font-size: 0.24rem;
          color: #999999;
          &.en {
            font-size: 0.22rem;
          }
        }
        .num {
          font-size: 0.27rem;
          color: $color-this;
        }
      }
    }
  }
  .lists {
    margin-top: 0.09rem;
    height: 1.1rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .list {
      flex: 1;
      font-size: 0.27rem;
      height: 0.75rem;
      text-align: center;
      color: #3a3949;
      font-size: 0.21rem;
      background: #ffffff;
      border-radius: 0.07rem;
      .lh {
        line-height: 0.29rem;
      }

      .lucky {
        width: 100%;
        margin: auto;
      }
      .icon {
        margin-bottom: 0.05rem;
        font-size: 0.4rem;
        color: $color-this;
        &.lucky {
          font-size: 0.37rem;
        }
        // &.isVip{
        //   color: #FF910D !important;
        // }
      }
    }
  }

  .showDiv {
    margin: 0.09rem 0.18rem;
    color: #fff;
    padding: 0.3rem 0.3rem 0.4rem 0.3rem;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(-1deg, #1a1c46 0%, #172958 100%);
    border-radius: 0.08rem;

    &.tron {
      background-image: linear-gradient(-1deg, #68111b 0%, #5f0e16 100%);
    }

    &.bos {
      background-image: linear-gradient(-1deg, #131a6d 0%, #25339b 100%);
    }

    &.hasDiv {
      padding: 0.24rem 0.3rem;
    }

    .tipDiv {
      flex: 1;

      .num {
        color: #ffc78a;
      }
      .tip {
        margin-top: 0.2rem;
        font-size: 0.25rem;
      }
      .ysdMaxProfit {
        font-size: 0.21rem;
      }
      .apr {
        margin-top: 0.2rem;
      }
    }

    .profit {
      text-align: right;
    }

    // 参加矿池显示
    .posInfo {
      .accountInfo {
        font-size: 0.25rem;
      }
      .subTitle {
        font-size: 0.21rem;
      }
      .apr {
        color: #ffc78a;
        font-size: 0.27rem;
      }
      .info {
        font-size: 0.25rem;
        margin-top: 0.36rem;

        .num {
          margin-top: 0.04rem;
          font-size: 0.27rem;
          color: #ffc78a;
        }
      }
    }
  }
}
</style>
