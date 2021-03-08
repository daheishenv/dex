<template>
  <div class="cpu">
    <div class="item">
      <div class="title">{{ $t('resources.leasedEos') }}</div>
      <div class="num" :class="{'color-red': Number(eosChange) < 0}">
        <span>{{ json.total_lent.split(' ')[0] }} EOS</span>
        <span v-if="Number(eosChange) >= 0" class="iconfont icon-huaban39 icon"></span>
        <span v-else class="iconfont icon-huaban40 icon"></span>
      </div>
      <div class="color-green" v-if="Number(eosChange) >= 0">+{{ eosChange }} EOS</div>
      <div class="color-red" v-else>{{ eosChange }} EOS</div>
    </div>

    <div class="item">
      <div class="title">{{ $t('resources.abledLeasedEos') }}</div>
      <div class="num" :class="{'color-red': Number(totalLendableChange) < 0}">
        <span>{{ json.total_unlent }}</span>
        <span v-if="Number(totalLendableChange) >= 0" class="iconfont icon-huaban39 icon"></span>
        <span v-else class="iconfont icon-huaban40 icon"></span>
      </div>
      <div class="color-green" v-if="Number(totalLendableChange) >= 0">+{{ totalLendableChange }} EOS</div>
      <div class="color-red" v-else>{{ totalLendableChange }} EOS</div>
    </div>

    <div class="item">
      <div class="title">{{ $t('resources.leasedRate') }}</div>
      <div class="num" :class="{'color-red': Number(json.ratio) < 0}">
        <span>{{ json.ratio }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import { toFixed } from '@/utils/public'
import { getRexData } from '@/utils/publicApi'

export default {
  data() {
    return {
      json: {
        default: true, // 默认数据
        total_unlent: '0.0000 EOS', // EOS池子总量
        total_rex: '0.0000 REX', // 全网REX总量
        totalRent: '0.0000', // 总租金
        apr: '0.00', // 年华收益率
        ratio: '0.00%', // 出租比率
        total_lendable: '0.0000 EOS', // 剩余可出租EOS
        total_lent: '0.0000 EOS', // 已出租EOS
      },
      eosioNames: '0.0000', // 短账号竞拍费用
      eosioRamfee: '0.0000', // RAM交易手续费
      eosChange: '0.0000', // eos增加|减少数量
      rexChange: '0.0000', // rex增加|减少数量
      totalLendableChange: '0.0000', // 剩余可出租EOS改变
      timer: null, // 定时器
    }
  },
  watch: {
    json(newVal, oldVal) {
      if (!oldVal.default) {
        const eosChange = Decimal.sub(newVal.total_lent.split(' ')[0], oldVal.total_lent.split(' ')[0]).toString();
        this.eosChange = toFixed(eosChange, 4);
        const rexChange = Decimal.sub(newVal.total_rex.split(' ')[0], oldVal.total_rex.split(' ')[0]).toString();
        this.rexChange = toFixed(rexChange, 4);
        const totalLendableChange = Decimal.sub(newVal.total_unlent.split(' ')[0], oldVal.total_unlent.split(' ')[0]).toString();
        this.totalLendableChange = toFixed(totalLendableChange, 4);
      }
    }
  },
  mounted() {
    this.handleGetRexData();
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      this.handleGetRexData();
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
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.cpu{
  font-size: .25rem;
  padding: .41rem .26rem .4rem;

  .item{
    margin-bottom: .28rem;

    .title{
      margin-bottom: .04rem;
    }

    .num{
      color: $color-green;
      font-size: .32rem;
      display: flex;
      align-items: center;

      .icon{
        font-size: .28rem;
      }
    }
  }
}
</style>
