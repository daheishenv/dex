<template>
  <div class="circulation">
    <div class="loading" v-if="loading">
      <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
    </div>
    <!-- NDX流通情况 start -->
    <div class="info" :class="{'isPop': $route.name !== 'linek'}">
      <!-- 发行总量 -->
      <div class="mgbottom24">
        <div>
          <span class="boderLeft1"></span>
          <span class="title boderLeft"
            >{{ $t('candyAirDrop.issueAmt') }}：</span><span>{{ issueCount }} NDX</span>
        </div>
        <!-- 团队未解锁总量 -->
        <div>
          <span class="title boderLeft"
            >{{$t('New_home.New_home9')}}：</span><span>{{ teamNotUnlocked }} NDX</span>
        </div>
      </div>
      <!-- 质押总量 -->
      <div class="mgbottom24">
        <!-- 流通总量 -->
        <div>
          <span class="boderLeft1"></span>
          <span class="title boderLeft">
            {{ $t('vip.totalCirculation') }}：</span><span>{{ circulateCount }} NDX</span>
        </div>
        <div>
          <span class="title boderLeft">
            {{ $t('vip.totalPledge') }}：</span><span>{{ thisAllStake }}</span>
        </div>
        <!-- 质押比率 -->
        <div>
          <span class="title boderLeft"
            >{{ $t('vip.pledgeRatio') }}：</span><span>{{ thisAllStakeRate }}%</span>
        </div>
      </div>

      <!-- 销毁总量 -->
      <div>
        <div class="mgbottom24">
          <div>
            <span class="boderLeft1"></span>
            <span class="title boderLeft"
              >{{ $t('vip.totalDestroy') }}：</span><span>{{ allDestroy }} NDX</span>
          </div>
          <!-- 销毁比率 -->
          <div class="mgbottom24">
            <span class="title pdleft"
              >{{ $t('vip.destroyRatio') }}：</span><span>{{ destroyRate }}%</span>
          </div>
        </div>
        <!-- 上一小时回购销毁情况 -->
        <div class="mgbottom24">{{ $t('New_home.New_home99') }}
          <span class="unit">{{ $t('New_home.New_home104') }}</span>
        </div>
         <!-- 销毁详细 -->
        <div class="detail" :class="{'mgbottom24': $route.name === 'linek'}">
          <!-- Newdex手续费的50% -->
          <!-- <div>
            <span class="tipTitle">{{ $t('New_home.New_home1') }}
              <span class="iconfont icon-huaban31 question" @click="tip1 = true;"></span>：
            </span>
            <span>{{hourAllData.newdexFees || '0.0000'}} NDX</span>
          </div> -->
          <!-- Newdex相关交易对的NDX手续费 -->
          <!-- <div>
            <span class="tipTitle">{{ $t('New_home.New_home3') }}：</span><span>{{hourAllData.ndxFees || '0.0000'}} NDX</span>
          </div> -->
          <!-- Newdex VIP会员NDX收入 -->
          <!-- <div>
            <span class="tipTitle">{{ $t('New_home.New_home4') }}：</span><span>{{hourAllData.vipNdx || '0.0000'}} NDX</span>
          </div> -->
          <!-- Newpool管理费的25% -->
          <!-- <div>
            <span class="tipTitle">{{ $t('New_home.New_home5') }}
              <span class="iconfont icon-huaban31 question" @click="tip2 = true;"></span>：</span>
              <span>{{hourAllData.newpoolNum || '0.0000'}} NDX</span>
          </div> -->
          <!-- DefiBOX协议收入的10% -->
          <!-- <div>
            <span class="tipTitle">{{ $t('New_home.New_home7') }}：</span><span>{{hourAllData.defiboxTotal || '0.0000'}} NDX</span>
          </div> -->
          <!-- 上一小时累计回购销毁数量 -->
          <div>
            <span class="tipTitle">{{ $t('New_home.New_home96') }}：</span><span>{{hourAllData && hourAllData.lastHour || '0.0000'}}</span>
          </div>
          <!-- 24H累计回购销毁数量 -->
          <div>
            <span class="tipTitle">{{ $t('New_home.New_home10') }}：</span><span>{{allData && allData.allVolume || '0.0000'}}</span>
          </div>
        </div>
        <!-- 累计回购销毁情况 -->
        <div class="mgbottom24">{{ $t('buyBack.buyBack10') }}
          <span class="unit">{{ $t('New_home.New_home104') }}</span>
        </div>
         <!-- 销毁详细 -->
        <div class="detail" :class="{'mgbottom24': $route.name === 'linek'}">
          <div>
            <!-- Newdex手续费的50% -->
            <span class="tipTitle">{{ $t('New_home.New_home1') }}
              <span class="iconfont icon-huaban31 question" @click="tip1 = true;"></span>：
            </span>
            <span>{{parseFloat(tradingFeeBuyNdx)}}</span>
          </div>
          <div>
            <!-- Newdex相关交易对的NDX手续费 -->
            <span class="tipTitle">{{ $t('New_home.New_home3') }}：</span>
            <span>{{parseFloat(tradingFeeNdx)}}</span>
          </div>
          <div>
            <!-- Newdex VIP会员NDX收入 -->
            <span class="tipTitle">{{ $t('New_home.New_home4') }}：</span>
            <span>{{parseFloat(vipNdx)}}</span>
          </div>
          <div>
            <!-- Newpool管理费的25% -->
            <span class="tipTitle">
              {{ $t('New_home.New_home5') }}
            <span class="iconfont icon-huaban31 question" @click="tip2 = true;"></span>：</span>
            <span>{{parseFloat(newpoolBuyNdx)}}</span>
          </div>
          <div>
            <!-- DefiBOX协议收入的10% -->
            <span class="tipTitle">{{ $t('New_home.New_home7') }}：</span>
            <span>{{parseFloat(defiBoxIncomeBuyNdx)}}</span>
          </div>
          <div>
            <!-- Newdex Seed投资收益 -->
            <span class="tipTitle">{{ $t('New_home.New_home8') }}：</span>
            <span>{{parseFloat(newdexSeed)}}</span>
          </div>
        </div>
        <!-- ·注:Newpool回购金额每日00:00分更新一次 -->
        <div class="tip">{{ $t('buyBack.buyBack13') }}</div>
      </div>
    </div>
    <!-- NDX流通情况 end -->
    <!-- 回购金额详情 -->
    <mt-popup class="popup" popup-transition="popup-fade" v-model="tipShow">
      <circu-detail @listenClose="handleClose" />
    </mt-popup>
    <!-- 流通提示1 start -->
    <mt-popup
      class="tipPopup"
      popup-transition="popup-fade"
      v-model="tip1">
      <popup-tip-one @listenClose="handleClose" />
    </mt-popup>
    <!-- 流通提示1 end -->
    <!-- 流通提示2 start -->
    <mt-popup
      class="tipPopup"
      popup-transition="popup-fade"
      v-model="tip2">
      <popup-tip-two @listenClose="handleClose" />
    </mt-popup>
    <!-- 流通提示2 end -->
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { Spinner, Popup } from 'mint-ui';
import axios from 'axios';
import { Decimal } from 'decimal.js';
import { toFixed } from '@/utils/public';
import { getCurrencyStats, getTableRows } from '@/utils/eosTable';
import CircuDetail from '@/views/more/components/PopupCircuDetail'; // 回购金额详情
import PopupTipOne from './PopupTipOne'; // 流通提示1
import PopupTipTwo from './PopupTipTwo'; // 流通提示2

export default {
  data() {
    return {
      circulateCount: '0.0000', // 流通总量
      issueCount: '0.0000', // 发行总量
      thisAllStake: '0.0000 NDX', // 全网抵押
      thisAllStakeRate: '0.0000', // 抵押比例
      allDestroy: '0.0000', // 全部销毁
      buyDestroyCount: '0.0000', // 回购销毁
      otherDestroyCount: '0.0000', // 其他销毁
      destroyRate: '0.0000', // 销毁比率

      loading: true, // 加载中
      tipShow: false, // 回购金额详情
      defiBoxIncome: '0.0000', // defiBxo协议收入
      defiBoxIncomeBuyNdx: '0.0000', // defiBxo协议收入回购NDX数量
      newpoolBuyNdx: '0.0000',
      newpoolEos: '0.0000', // newpool回购金额
      totalBuyNdx: '0.0000',
      totalEos: '0.0000', // newdex回购金额
      totalRetireNdx: '0.0000',
      tradingFeeBuyNdx: '0.0000', // ndx手续费
      tradingFeeEos: '0.0000', // 手续费
      tradingFeeNdx: '0.0000', // 代币NDX手续费收入
      vipNdx: '0.0000', // VIP会员收入
      lastTotal: '0.0000', // 上小时回购金额
      lastNum: '0.0000', // 上小时回购数量
      lastRetireNdx: '0.0000', // 上小时回购销毁数量
      newdexSeed: '18550390.7130', // NewdexSeed
      // * 1 Newdex 手续费
      // * 2 NDX手续费
      // * 3 VIP NDX 收入
      // * 4 newpool 回购
      // * 5 defibox 收入
      hourAllData: {
        newdexFees: '0.0000',
        ndxFees: '0.0000',
        vipNdx: '0.0000',
        newpoolNum: '0.0000',
        defiboxTotal: '0.0000',
        lastHour: '0.0000',
      }, // 上一小时数据
      allData: {
        allVolume: '0.0000'
      }, // 累计数据
      teamNotUnlocked: null, // 团队未解锁
      tip1: false, // 流通提示
      tip2: false, // 流通提示
    }
  },
  components: {
    mtSpinner: Spinner,
    CircuDetail: CircuDetail,
    mtPopup: Popup,
    PopupTipOne,
    PopupTipTwo,
  },
  props: [
    'allStake'
  ],
  watch: {
    allStake(newVal) {
      this.thisAllStake = newVal;
    },
    thisAllStake() {
      if (Number(this.circulateCount) === 0) {
        return;
      }
      let thisAllStakeRate = Decimal.div(Number(this.thisAllStake.split(' ')[0]), Number(this.circulateCount)).toString();
      thisAllStakeRate = Decimal.mul(thisAllStakeRate, 100);
      this.thisAllStakeRate = Number(thisAllStakeRate).toFixed(4);
    },
    circulateCount() {
      if (Number(this.circulateCount) === 0) {
        return;
      }
      let thisAllStakeRate = Decimal.div(Number(this.thisAllStake.split(' ')[0]), Number(this.circulateCount)).toString();
      thisAllStakeRate = Decimal.mul(thisAllStakeRate, 100);
      this.thisAllStakeRate = Number(thisAllStakeRate).toFixed(4);
    },
  },
  mounted() {
    // if (this.allStake) {
    //   this.thisAllStake = this.allStake;
    // } else {
    //   this.handleAllNetStake();
    // }
    this.handleNdxInfo();
  },
  methods: {
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
    async handleNDXAll(){
       const params = {
        code: 'newdexissuer',
        symbol: 'NDX',
      };
      const res = await getCurrencyStats(params);
      this.issueCount = res['NDX'].max_supply.split(" ")[0]
    },
    // 获取销毁情况
    async handleNdxInfo() {
      this.loading = true;
      // NDX总发行量
      await this.handleNDXAll();
      // 团队未解锁数量
      await this.handleGetNdxProBalance();
      this.$http.get('/ndx/info').then(async (res) => {
        this.loading = false;
        if (res.code !== 0) {
          return;
        }
        let buyDestroyCount = parseFloat(res.data.buyDestroyCount)
        const params = {
          code: 'buy.newdex',
          table: 'global2',
          scope: 'buy.newdex',
          json: true,
        }
        const items = await getTableRows(params);
        if (items && items.length > 0) {
          this.defiBoxIncome = items[0].box_protocol_eos; // defiBxo协议收入
          this.defiBoxIncomeBuyNdx = items[0].box_protocol_buy_ndx; // defiBxo协议收入回购NDX数量
          buyDestroyCount = parseFloat(items[0].total_retire_ndx || 0); // 累积回购销毁数量
          // 销毁数据
          this.newpoolBuyNdx = items[0].newpool_buy_ndx; //
          this.newpoolEos = items[0].newpool_eos; // newpool回购金额
          this.totalBuyNdx = items[0].total_buy_ndx; //
          this.totalEos = items[0].total_eos; // newdex回购金额
          // this.totalRetireNdx = items[0].total_retire_ndx; //
          // this.buyDestroyCount = items[0].total_retire_ndx; // 累积回购销毁数量
          this.tradingFeeBuyNdx = items[0].trading_fee_buy_ndx; // ndx手续费
          this.tradingFeeEos = items[0].trading_fee_eos; // 手续费
          this.tradingFeeNdx = items[0].trading_fee_ndx; // 代币NDX手续费收入
          this.vipNdx = items[0].vip_ndx; // VIP会员收入
        }
        this.buyDestroyCount = toFixed(buyDestroyCount, 4);
        let circulateCount = Decimal.sub(parseFloat(this.issueCount), parseFloat(this.teamNotUnlocked))

        this.otherDestroyCount = toFixed(parseFloat(res.data.otherDestroyCount), 4);
        const allDestroy = parseFloat(this.buyDestroyCount);
        // const issueCount = accSub(1e10, allDestroy);
        // this.issueCount = toFixed(issueCount, 4);
        this.allDestroy = toFixed(allDestroy, 4);
        let destroyRate = Decimal.div(this.allDestroy, Number(this.issueCount) || 1).toString();
        destroyRate = Decimal.mul(destroyRate, 100).toString();
        this.destroyRate = Number(destroyRate).toFixed(4);
        this.circulateCount = toFixed(Decimal.sub(circulateCount, parseFloat(this.allDestroy)), 4);
        // 团队未解锁
        // this.teamNotUnlocked = Decimal.sub(Decimal.sub(this.issueCount, this.circulateCount), this.allDestroy);
        // if (this.teamNotUnlocked < 0) {
        //   this.teamNotUnlocked = '0.0000';
        // }
        // 获取销毁数据
        this.hourAllData = await this.handleNdxDetails('hour');
        this.allData = await this.handleNdxDetails('all');
        // 全网抵押
        if (this.allStake) {
          this.thisAllStake = this.allStake;
        } else {
          this.handleAllNetStake();
        }
        this.$forceUpdate()
      });
    },
    /**
     * 获取销毁数据
     * params hour-获取上一小时 all-获取全部
     * */
    async handleNdxDetails(type) {
      const accuParams = {
        code: 'buy.newdex',
        table: 'buyback2',
        scope: 'buy.newdex',
        lower_bound: Date.now() - 3600000,
        json: true,
        limit: -1,
      }
      if (type === 'all') {
        accuParams.lower_bound = 86400000;
      }
      let newdexFees = '0.0000';
      let ndxFees = '0.0000';
      let vipNdx = '0.0000';
      let newpoolNum = '0.0000';
      let defiboxTotal = '0.0000';
      let allVolume = '0.0000'; // 24小时累计回购
      let lastHour = '0.0000'; // 上一小时累计回购销毁数量
      // * 1 Newdex 手续费
      // * 2 NDX手续费
      // * 3 VIP NDX 收入
      // * 4 newpool 回购
      // * 5 defibox 收入
      const accuItems = await getTableRows(accuParams);
      if (accuItems && accuItems.length > 0) {
        accuItems.forEach(v => {
          if (type === 'all') {
            allVolume = Decimal.add(allVolume, parseFloat(v.retire_ndx));
            return;
          }
          lastHour = Decimal.add(lastHour, parseFloat(v.retire_ndx));
          if (v.type === 1) {
            newdexFees = Decimal.add(newdexFees, parseFloat(v.retire_ndx));
          }
          if (v.type === 2) {
            ndxFees = Decimal.add(ndxFees, parseFloat(v.retire_ndx));
          }
          if (v.type === 3) {
            vipNdx = Decimal.add(vipNdx, parseFloat(v.retire_ndx));
          }
          if (v.type === 4) {
            newpoolNum = Decimal.add(newpoolNum, parseFloat(v.retire_ndx));
          }
          if (v.type === 5) {
            defiboxTotal = Decimal.add(defiboxTotal, parseFloat(v.retire_ndx));
          }
        });
        let allData = {};
        if (type === 'all') {
          allData = {
            allVolume
          };
        } else {
          allData = {
            newdexFees,
            ndxFees,
            vipNdx,
            newpoolNum,
            defiboxTotal,
            lastHour
          };
        }
        return allData;
      }
    },
    // 查询全网抵押数量
    handleAllNetStake() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stat',
          scope: 'NDX',
          json: true,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            this.thisAllStake = res.data.rows[0].total_staked || '0.0000 NDX';
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleAllNetStake();
        }, 200);
      }
    },
    handleClose(val) {
      this.tipShow = val;
      this.tip1 = val;
      this.tip2 = val;
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.circulation{
  // padding: .24rem .36rem;
  font-size: .25rem;
  position: relative;

  .loading{
    position: absolute;
    background: rgba(255, 255, 255, .9);
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
  }

  .mgbottom24{
    margin-bottom: .24rem;
    position: relative;

    &>div{
      position: relative;
    }
  }

  .boderLeft1{
    height: .2rem;
    position: absolute;
    border-left: .04rem solid $color-this;
    padding-left: .1rem;
    top: 50%;
    transform: translate(0px, -50%);
  }

  .title{
    color: $color-999;

    &.boderLeft{
      border-left: .04rem solid transparent;
      padding-left: .1rem;
    }

    &.pdleft{
      padding-left: .1rem;
      border-left: .04rem solid transparent;
    }
  }

  .tipTitle{
    color: $color-999;
  }

  .num{
    color: #001B1F;
  }

  .detail{
    border: 1px solid #f3f3f3;
    padding: .11rem;

    & > div {
      margin-bottom: .05rem;
    }

    .tipShow {
      margin-left: .1rem;

      .iconfont {
        color: $color-999;
      }
    }
  }

  .isPop{
    .title{ // 弹窗中的标题样式改变
      font-weight: normal;
      color: $color-999;
    }
  }
  .tip {
    color: #FF9800;
    // margin-top: .2rem;
    font-size: .22rem;
  }
  .question{
    font-size: .24rem;
  }
  .unit {
    font-size: .2rem;
    color: #999;
  }
}
</style>
