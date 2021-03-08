<template>
  <div class="footer color-999">
    <div class="dealCount">
      <span v-if="$appName === 'eosNewdex'"
      @click="countChange = !countChange"
      class="flexc">
        <span v-if="countChange">
          <!-- 成交量 -->
          <span v-if="$store.state.app.language === 'ko' || $store.state.app.language === 'en'">
            24H {{ $t('order.dealCount') }}
          </span>
          <span v-else>
            24H{{ $t('order.dealCount') }}
          </span>
          <span>{{ count }} EOS</span>
        </span>
        <span v-else>
          <!-- 成交额 -->
          <span v-if="$store.state.app.language === 'ko' || $store.state.app.language === 'en'">
            24H {{ $t('public.dealTotal') }}
          </span>
          <span v-else>
            24H{{ $t('public.dealTotal') }}
          </span>
          <span>${{totalVolumeUsdt.toLocaleString()}}</span>
        </span>
        <span class="iconChange">
          <span :class="{'checkedColor': countChange}" class="iconfont icon-huaban411"></span>
          <span :class="{'checkedColor': !countChange}" class="iconfont icon-huaban314"></span>
        </span>
        <!-- <span class="mr37">{{ countUsdt }} USDT</span>
        <span>{{ countUsds }} USDⓈ</span> -->
      </span>
      <div v-else-if="$appName === 'tronNewdex'">
        24H {{ $t('public.dealTotal') }}
        <span class="mr37">{{ countUsdt }} USDT</span>
        <span>{{ countTron }} TRX</span>
      </div>
    </div>
    <div class="footerTip">{{ $t('footer.tip') }}</div>
    <div class="footerTip">Copyright &copy; 2021 Newdex Inc. All rights reserved.</div>
  </div>
</template>

<script>
import { toFixed, accMul, accAdd, accDiv, number_format } from '@/utils/public';

export default {
  data() {
    return {
      count: '-.----',
      countUsds: '-.--',
      countUsdt: '-.--',
      countTron: '-.------',
      timer: null,
      totalVolumeUsdt: '0.0000',
      countChange: true, // 显示成交量，显示成交额
    }
  },
  props: [
    'isScroll',
  ],
  components: {
  },
  mounted() {
    this.handleGetCount();
  },
  methods: {
    // 获取24H成交量
    handleGetCount() {
      this.$http.get('/order/getAllVolume24H').then((res) => {
        // 一分钟后重新请求
        this.timer = window.setTimeout(() => {
          this.handleGetCount();
        }, 60000);

        if (res.code !== 0) {
          return;
        }
        const obj = JSON.parse(res.allVolume24H)
        if (this.$appName === 'tronNewdex') { // 波场总交易额
          this.handleGetCountTron(obj)
          return;
        }
        // this.count = obj.eos;
        if (!obj.usd) {
          this.countUsds = '0.00'
        } else {
          this.countUsds = Number(obj.usd).toFixed(2) || 0;
        }
        if (!obj.usdt) {
          this.countUsdt = '0.00'
        } else {
          this.countUsdt = Number(obj.usdt).toFixed(2) || 0;
        }
        let eosVolumeUsdt = accMul(obj.eos, obj.eos_usd_rate);
        const total = accAdd(accAdd(accAdd(obj.usn, obj.usd), obj.usdt), eosVolumeUsdt);
        this.totalVolumeUsdt = number_format(total, 4);
        this.count = toFixed(accDiv(total, obj.eos_usd_rate), 4)
      });
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    handleGetCountTron(obj) {
      this.countTron = Number(obj.tron).toFixed(2) || '0.00';
      this.countUsdt = Number(obj.usd).toFixed(2) || '0.00';
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";
// footer 样式
.footer {
  font-size: 0.21rem;
  text-align: center;
  padding: 0.5rem 0rem;
  background: #fafafa;

  .dealCount {
    // font-weight: bold;
    font-size: 0.21rem;
    margin-bottom: 0.04rem;
  }

  .mr37 {
    margin-right: 0.37rem;
  }

  .mr37 {
    margin-right: 0.23rem;
  }
}
.iconChange {
  position: relative;
  display: inline-block;
  height: 0.4rem;
  transform: scale(0.6);
  margin-left: 0.1rem;

  span {
    position: absolute;
    left: 0;
    font-size: 0.2rem;
    color: #999;

    &.checkedColor {
      color: #666;
    }
  }
  span:nth-child(2) {
    bottom: 0rem;
    top: auto;
    left: -0.05rem;
  }
}
</style>
