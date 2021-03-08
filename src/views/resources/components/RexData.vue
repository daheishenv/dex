<template>
  <div class="rexData">
    <div class="list">
      <div class="title">{{ $t('resources.mainData') }}</div>
      <div class="item">
        <div class="tip">
          <span @click="rexTotalPool = true">{{ $t('resources.rexPoolCount') }}</span>
          <span @click="rexTotalPool = true" class="iconfont icon-huaban31 question"></span>
        </div>
        <div>
          <div class="bigNum" :class="{'down': Number(eosChange) < 0}">
            <span>{{ json.total_lendable.split(' ')[0] }} EOS</span>
            <span v-if="Number(eosChange) >= 0"
              class="iconfont icon-huaban39 icon"></span>
            <span v-else class="iconfont icon-huaban40 icon"></span>
          </div>
          <div class="color-green" v-if="Number(eosChange) >= 0">+{{ eosChange }} EOS</div>
          <div class="color-red" v-else>{{ eosChange }} EOS</div>
        </div>
      </div>

      <div class="item">
        <div class="tip">{{ $t('resources.allNetRexThroughput') }}</div>
        <div>
          <div class="bigNum" :class="{'down': Number(rexChange) < 0}">
            <span>{{ json.total_rex }}</span>
            <span v-if="Number(rexChange) >= 0"
              class="iconfont icon-huaban39 icon"></span>
            <span v-else class="iconfont icon-huaban40 icon"></span>
          </div>
          <div class="color-green" v-if="Number(rexChange) >= 0">+{{ rexChange }} REX</div>
          <div class="color-red" v-else>{{ rexChange }} REX</div>
        </div>
      </div>

      <div class="item">
        <div class="tip">
          <span @click="priceFormula = true">{{ $t('resources.rexFormula') }}</span>
          <span @click="priceFormula = true" class="iconfont icon-huaban31 question"></span>
        </div>
      </div>
    </div>

    <div class="list">
      <div class="title">{{ $t('resources.rexIncome') }}</div>
      <div class="tip">
        <span>{{ $t('resources.rentalOfResources') }}:</span>
        <span>{{ json.totalRent }} EOS</span>
      </div>
      <div class="tip">
        <span>{{ $t('resources.rexFee') }}:</span>
        <span>{{ eosioRamfee }} EOS</span>
      </div>
      <div class="tip">
        <span>{{ $t('resources.shortNameFee') }}:</span>
        <span>{{ eosioNames }} EOS</span>
      </div>
      <div class="tip">
        <span>{{ $t('resources.ysdApr') }}:</span>
        <span class="color-green">{{ handleToFixed(poolInfo.maxRexAnnualizedRate, 2) || '0.00' }}%</span>
      </div>
    </div>

    <div class="list">
      <div class="title">{{ $t('resources.rentalInfo') }}</div>
      <div class="tip">
        <span>{{ $t('resources.leasedEos') }}:</span>
        <span>{{ json.total_lent }}</span>
      </div>
      <div class="tip">
        <span>{{ $t('resources.abledLeasedEos') }}:</span>
        <span>{{ json.total_unlent }}</span>
      </div>
      <div class="tip">
        <span>{{ $t('resources.leasedRate') }}:</span>
        <span class="color-green">{{ json.ratio }}%</span>
      </div>
    </div>

    <!-- 价格公式 -->
    <mt-popup
      class="popup"
      v-model="priceFormula">
        <RexPrice v-if="priceFormula" @listenClose="handleClose" />
    </mt-popup>

    <!-- REX池子总量 -->
    <mt-popup
      class="popup"
      v-model="rexTotalPool">
        <RexTotalPool v-if="rexTotalPool" @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { toFixed } from '@/utils/public'
import { getRexData } from '@/utils/publicApi'
import RexPrice from '@/views/resources/popup/RexPrice'; // 价格公式
import RexTotalPool from '@/views/resources/popup/RexTotalPool'; // 价格公式

export default {
  data() {
    return {
      json: {
        default: true, // 默认数据
        total_unlent: '0.0000 EOS', // EOS池子总量
        total_rex: '0.0000 REX', // 全网REX总量
        totalRent: '0.0000', // 总租金
        apr: '0.00', // 年华收益率
        ratio: '0.00', // 出租比率
        total_lendable: '0.0000 EOS', // 剩余可出租EOS
        total_lent: '0.0000 EOS', // 已出租EOS
      },
      poolInfo: {},
      eosioNames: '0.0000', // 短账号竞拍费用
      eosioRamfee: '0.0000', // RAM交易手续费
      eosChange: '0.0000', // eos增加|减少数量
      rexChange: '0.0000', // rex增加|减少数量
      timer: null, // 定时器

      priceFormula: false,
      rexTotalPool: false,
    }
  },
  components: {
    RexPrice,
    RexTotalPool,
    mtPopup: Popup,
  },
  watch: {
    json(newVal, oldVal) {
      if (!oldVal.default) {
        const eosChange = Decimal.sub(newVal.total_lendable.split(' ')[0], oldVal.total_lendable.split(' ')[0]).toString();
        this.eosChange = toFixed(eosChange, 4);
        const rexChange = Decimal.sub(newVal.total_rex.split(' ')[0], oldVal.total_rex.split(' ')[0]).toString();
        this.rexChange = toFixed(rexChange, 4);
      }
    }
  },
  mounted() {
    this.handleGetRexData();
    this.handleGetPosInfo()
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.handleGetRexData();
      this.handleGetPosInfo()
    }, 10000);
  },
  methods: {
    handleGetRexData() {
      getRexData((err, res) => {
        if (err) {
          return;
        }
        this.json = res.data;
      })
      this.handleGetIcome();
    },
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    handleGetIcome() {
      this.$http.get('/eosRex/income').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.eosioNames = toFixed(res['eosio.names'], 4);
        this.eosioRamfee = toFixed(res['eosio.ramfee'], 4);
      });
    },
    handleClose() {
      this.rexTotalPool = false;
      this.priceFormula = false;
    },
    // 获取矿池信息
    handleGetPosInfo() {
      this.$http.post('/pool/getAccountPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.poolInfo = {
          maxRexAnnualizedRate: res.accountPoolInfo.maxRexAnnualizedRate
        };
      });
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rexData{
  padding: .26rem;
  font-size: .25rem;

  .list{
    margin-bottom: .56rem;

    &:last-child{
      margin-bottom: 0rem;
    }

    .item{
      margin-bottom: .26rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .question{
        font-size: .25rem;
        margin-left: .12rem;
      }
    }

    .title{
      font-size: .27rem;
      margin-bottom: .14rem;
    }

    .tip{
      color: $color-999;
      display: flex;
      align-items: center;
      margin-bottom: .04rem;

      &>span:nth-child(2){
        margin-left: .12rem;
      }
    }

    .bigNum{
      font-size: .32rem;
      color: $color-green;
      display: flex;
      align-items: center;

      &.down{
        color: $color-red;
      }

      .icon{
        font-size: .28rem;
      }
    }
  }
}
.popup{
  background: transparent;
  top: 30%;
  transform: translate(-50%, -30%);
}
</style>
