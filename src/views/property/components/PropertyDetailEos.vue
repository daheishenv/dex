<template>
  <div class="model">
    <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    <div class="title">{{ $t('property.propertyCount') }}</div>
    <!-- cpu -->
    <div class="cpu item">
      <div class="fontweight">
        <span>CPU: <span :class="{'color-red': allPercent.cpuPercent >= 80}">{{ $t('property.used') }} {{ allPercent.cpuPercent }}%</span></span>
        <span v-if="!$embed" class="frTool" @click="handleToRent">{{ $t('resources.lease') }}</span>
      </div>
      <div class="info">
        <span>
          {{$t('property.used')}}
          {{info?handleTime(info.cpu_limit.used):'0us'}}/{{$t('property.allCount')}}{{info?handleTime(info.cpu_limit.max):'0us'}}
        </span>
        <div class="limit">
          <span>({{ info ? info.total_resources.cpu_weight : '0.0000 EOS' }})</span>
          <span class="color-this" @click="handleToFreeCpu" v-if="isEosChain && false">{{ $t('vip.freeCpu') }}＞</span>
        </div>
      </div>
    </div>
    <!-- net -->
    <div class="net item">
      <div class="fontweight">
        NET: <span :class="{'color-red': allPercent.netPercent >= 80}">{{ $t('property.used') }} {{ allPercent.netPercent }}%</span>
        <span v-if="!$embed" class="frTool" @click="handleToRent">{{ $t('resources.lease') }}</span>
      </div>
      <div class="info">
        <span>
          {{$t('property.used')}}
          {{info?handleByte(info.net_limit.used):'0B'}}/{{ $t('property.allCount')}}{{info?handleByte(info.net_limit.max):'0B'}}
        </span>
        <div class="limit">({{ info ? info.total_resources.net_weight : '0.0000 EOS' }})</div>
      </div>
    </div>
    <!-- ram -->
    <div class="ram item">
      <div class="fontweight">
        RAM: <span :class="{'color-red': allPercent.ramPercent >= 80}">{{ $t('property.used') }} {{ allPercent.ramPercent }}%</span>
        <span v-if="!$embed" class="frTool" @click="handleToRam">{{ $t('activity.trade') }}</span>
      </div>
      <div class="info">
        <span>
          {{ $t('property.used') }}
          {{ info ? handleByte(info.ram_usage) : '0B'}}/{{ $t('property.allCount') }}{{ info ? handleByte(info.ram_quota) : '0B'}}
        </span>
      </div>
    </div>
    <div class="btnDiv">
      <button class="btn" @click="handleSure">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
    }
  },
  computed: {
    isEosChain() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain === 'eos') {
        return true;
      }
      return false;
    }
  },
  props: [
    'info',
    'allPercent'
  ],
  mounted() {
  },
  methods: {
    handleSure() {
      this.$emit('listenClose', false);
    },
    handleToFreeCpu() {
      this.$router.push({
        name: 'freeCpu'
      })
    },
    handleToRam() {
      this.$router.push({
        name: 'resourceTradeRam'
      })
    },
    handleToRent() {
      this.$router.push({
        name: 'resourceTradeCpu'
      })
    },
    handleClose() {
      this.$emit('listenClose', false);
    },
    // 微秒时间处理
    /**
     * 时间：
     *  h：1 * 60 * 60 * 1000 * 1000 = 3,600,000,000 us
     *  min：1 * 60 * 1000 * 1000 = 60,000,000 us
     *  sec：1 * 1000 * 1000 = 1000,000 us
     *  ms：1 * 1000 = 1000 us
    */
    handleTime(time) {
      let dealTime = time;
      if (dealTime >= 60 * 60 * 1000 * 1000) { // 大于60min - 处理成h
        dealTime = Decimal.div(time, 60 * 60 * 1000 * 1000);
        dealTime = toFixed(dealTime.toString(), 2);
        return `${dealTime}hour`;
      }
      if (dealTime >= 60 * 1000 * 1000) { // 大于60s - 处理成min
        dealTime = Decimal.div(time, 60 * 1000 * 1000);
        dealTime = toFixed(dealTime.toString(), 2);
        return `${dealTime}min`;
      }
      if (dealTime >= 1000 * 1000) { // 大于1000ms - 处理成s
        dealTime = Decimal.div(time, 1000 * 1000);
        dealTime = toFixed(dealTime.toString(), 2);
        return `${dealTime}s`;
      }
      if (dealTime >= 1000) { // 大于1000us - 处理成ms
        dealTime = Decimal.div(time, 1000);
        dealTime = toFixed(dealTime.toString(), 2);
        return `${dealTime}ms`;
      }
      dealTime = toFixed(dealTime.toString(), 2);
      return `${dealTime}us`;
    },
    // 处理字节
    /**
     * 字节
     *  KB: 1 * 1024 = 1024 B
     *  MB: 1 * 1024 * 1024 = 1,048,576 B
     *  GB: 1 * 1024 * 1024 * 1024 = 1,073,741,820 B
    */
    handleByte(byte) {
      let dealByte = byte;
      if (dealByte >= 1024 * 1024 * 1024) { // 大于1024MB - 处理成GB
        dealByte = Decimal.div(dealByte, 1024 * 1024 * 1024);
        dealByte = toFixed(dealByte.toString(), 2);
        return `${dealByte}GB`;
      }
      if (dealByte >= 1024 * 1024) { // 大于1024KB - 处理成MB
        dealByte = Decimal.div(dealByte, 1024 * 1024);
        dealByte = toFixed(dealByte.toString(), 2);
        return `${dealByte}MB`;
      }
      if (dealByte >= 1024) { // 大于1024B - 处理成KB
        dealByte = Decimal.div(dealByte, 1024);
        dealByte = toFixed(dealByte.toString(), 2);
        return `${dealByte}KB`;
      }
      dealByte = toFixed(dealByte.toString(), 2);
      return `${dealByte}B`;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.model{
  padding: .41rem .61rem;

  .close{
    position: absolute;
    right: .2rem;
    top: .2rem;
    color: $color-333;
    font-size: .21rem;
  }

  .title{
    color: $color-this;
    font-size: .36rem;
    text-align: center;
  }

  .item{
    margin-top: .4rem;
    text-align: left;
    padding-left: .12rem;
    // font-size: .28rem;

    &:first-child{
      margin-top: .3rem;
    }

    .fontweight{
      font-size: .3rem;
      color: $color-333 !important;

      .frTool{
        font-size: .27rem;
        color: $color-this;
        float: right;
      }
    }

    .info{
      color: $color-999;
      font-size: .25rem;
    }

    .limit{
      display: block;
    }
  }

  .btnDiv{
    margin-top: .4rem;

    .btn{
      font-size: .25rem;
      background: $color-this;
      color: #fff;
      width: 100%;
      height: .8rem;
      border-radius: .1rem;
    }
  }
}
</style>
