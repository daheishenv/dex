<template>
  <div class="circulation">
    <div class="content flexb flexstart">
      <div class="contLeft">
        <!-- NDX流通情况 -->
        <div class="title">{{ $t('New_home.New_home20') }}</div>
        <!-- 发行量 -->
        <div class="total flexc">
          <div class="circle flex-column flexc">
            <div>{{ $t('New_home.New_home97') }}</div>
            <div>{{ $t('New_home.New_home98') }}</div>
          </div>
        </div>
        <div class="data" :class="{ enCont: languageEn }">
          <!-- 流通总量 -->
          <div class="flex item">
            <span></span>
            <span :class="{ enW: languageEn }">{{ $t('New_home.New_home100') }}：</span>
            <span>{{ circulateCount }} NDX</span>
          </div>
          <!-- 团队未解锁总量 -->
          <div class="flex item item1">
            <span></span>
            <span :class="{ enW: languageEn }">{{ $t('New_home.New_home9') }}：</span>
            <span>{{ teamNotUnlocked }} NDX</span>
          </div>
          <!-- 销毁总量 -->
          <div class="flex item item2">
            <span></span>
            <span :class="{ enW: languageEn }">{{ $t('New_home.New_home102') }}：</span>
            <span>{{ totalDestruction }} NDX</span>
          </div>
        </div>
        <div class="more" @click="handleToNdx">{{ $t('New_home.New_home101') }} ></div>
      </div>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { toFixed } from '@/utils/public';
import { getCurrencyStats, getTableRows } from '@/utils/eosTable';
import { Decimal } from 'decimal.js';

export default {
  name: 'circulation', // 流通情况
  data() {
    return {
      circulateCount: '0.0000', // 流通总量
      totalDestruction: '0.0000', // 销毁总量
      teamNotUnlocked: '0.0000', // 团队未解锁
      issueCount: null, // 发行总量
      allVolume: '0.0000'
    };
  },
  components: {},
  props: {},
  watch: {},
  computed: {
    languageEn () {
      return this.$store.state.app.language === 'en' || this.$store.state.app.language === 'ko'
    }
  },
  created() {},
  mounted() {
    this.handleMortgageNdxDetails();
  },
  beforeDestroy() {},
  methods: {
    // NDX发行总量
    async handleNDXAll() {
      const params = {
        code: 'newdexissuer',
        symbol: 'NDX',
      };
      const res = await getCurrencyStats(params);
      this.issueCount = res['NDX'].max_supply.split(' ')[0]
    },
    handleNdx(){
      this.$router.push({
        path: `/trade/newdexissuer-ndx-eos`
      })
    },
    // 获取NDX团队未解锁NDX数量
    async handleGetNdxProBalance() {
      try {
        let params = {
          account: 'team.newdex',
          code: 'newdexissuer',
          symbol: 'NDX'
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.teamNotUnlocked = parseFloat(balance);
        }
      } catch (error) {
        setTimeout(() => {
          this.handleGetNdxProBalance();
        }, 1000);
      }
    },
    // 显示详情Ndx流通情况
    async handleMortgageNdxDetails() {
      // NDX总发行量
      await this.handleNDXAll();
      await this.handleGetNdxProBalance();
      // this.$http.de
      this.$http.get('/ndx/info').then(async (res) => {
        if (res.code !== 0) {
          // this.$message.error(res.msg);
          return;
        }
        const destoryData = res.data;
        let buyDestroyCount = parseFloat(destoryData.buyDestroyCount);
        const params = {
          code: 'buy.newdex',
          table: 'global2',
          scope: 'buy.newdex',
          json: true,
        };
        const accuParams = {
          code: 'buy.newdex',
          table: 'buyback2',
          scope: 'buy.newdex',
          lower_bound: 86400000,
          json: true,
          limit: -1,
        };
        let allVolume = '0.0000'; // 24小时累计回购
        const accuItems = await getTableRows(accuParams);
        if (accuItems && accuItems.length > 0) {
        accuItems.forEach((v) => {
          allVolume = Decimal.add(allVolume, parseFloat(v.retire_ndx));
            return;
          })
        }
        this.allVolume = allVolume
        const items = await getTableRows(params);
        if (items && items.length > 0) {
          buyDestroyCount = toFixed(parseFloat(items[0].total_retire_ndx || 0), 4); // 累积回购销毁数量
        }
        let circulateCount = Decimal.sub(parseFloat(this.issueCount), parseFloat(this.teamNotUnlocked)); // 流通总量
        this.totalDestruction = parseFloat(buyDestroyCount); // 销毁总量
        this.circulateCount = Decimal.sub(circulateCount, this.totalDestruction);
        // // 团队未解锁
        // this.teamNotUnlocked = accSub(accSub(10000000000, this.circulateCount), this.totalDestruction);
        // if (this.teamNotUnlocked < 0) {
        //   this.teamNotUnlocked = '0.0000';
        // }
      });
    },
    // 跳转到NDX K线页面
    handleToNdx() {
      const params = {
        symbol: 'newdexissuer-ndx-eos',
        circle: 1,
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.circulation {
  background: url('../../../assets/img/index/circulationBg.png') no-repeat;
  background-size: 100% 100%;
  padding: .59rem 0 .64rem;
  .content {
    margin: auto;

    .contLeft {
      flex: 1;
      .title {
        font-size: .32rem;
        color: #ffffff;
      }

      .total {
        margin: .66rem 0 1rem;
        .circle {
          width: 3.77rem;
          height: 3.77rem;
          background: url('../../../assets/img/index/circle.png') no-repeat;
          background-size: 100% 100%;
          // padding-top: 100rem;
          text-align: center;

          div:nth-child(1) {
            font-size: .48rem;
            color: #ffffff;
          }

          div:nth-child(2) {
            font-size: .24rem;
            color: rgba(255, 255, 255, 0.64);
          }
        }
      }

      .data {
        padding: 0 .2rem 0 1.4rem;
        .enW {
          width: 2.8rem !important;
        }
        &.enCont {
          padding-left: 0.6rem;
        }
        .item {
          position: relative;
          color: #fff;
          line-height: .30rem;
          margin-bottom: .14rem;
          span:nth-child(1) {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: .04rem;
            height: .18rem;
            background: #4e98fc;
          }
          span:nth-child(2) {
            text-align: left;
            width: 1.7rem;
            font-size: .28rem;
            margin: 0 .2rem 0 .1rem;
          }
          span:nth-child(3) {
            font-size: .30rem;
          }
        }
        .item1 {
          span:nth-child(1) {
            background: #7c9bfa;
          }
        }
        .item2 {
          span:nth-child(1) {
            background: #fff;
          }
        }
      }
    }
  }
  .more {
    font-size: .24rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.5rem;
  }
}
</style>
