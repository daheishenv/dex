<template>
  <div class="cpu"
    :class="{'green': allPercent.cpuPercent <= 60,
      'yellow': allPercent.cpuPercent > 60 && allPercent.cpuPercent <= 80, 'red': allPercent.cpuPercent > 80}">
    <div class="content" @click="showDetail = true">
      <div class="num">{{ handleToFixed(allPercent.showCpu, 0) }}%</div>
      <!-- <div class="num">100%</div> -->
      <!-- <div class="num">10%</div> -->
      <div>CPU</div>
    </div>
    <!-- 资源详情 -->
    <mt-popup
      v-model="showDetail"
      class="showDetail"
      popup-transition="popup-fade">
      <property-detail-eos :allPercent="allPercent" :info="info" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import axios from 'axios';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';

import PropertyDetailEos from '../../property/components/PropertyDetailEos';

export default {
  data() {
    return {
      allPercent: {
        cpuPercent: 0,
        netPercent: 0,
        ramPercent: 0,
        showCpu: 0,
      },
      info: null,
      showDetail: false,
      timer: null,
    }
  },
  components: {
    PropertyDetailEos,
    mtPopup: Popup,
  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.handleGetAccountInfo();
  },
  methods: {
    // 获取账户信息
    handleGetAccountInfo() {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account,
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
        }
        axios.post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params)).then((response) => {
          window.clearTimeout(this.timer); // 清楚定时器
          // if (this.$route.name !== 'linek' && this.$route.name !== 'trade') {
          //   return;
          // }
          const time = this.$route.name === 'linek' ? 5000 : 3000;
          this.timer = window.setTimeout(() => {
            this.handleGetAccountInfo();
          }, time);
          this.info = response.data;
          this.handleDealInfoData();
        }).catch((error) => {
          if (error) {
            setTimeout(() => {
              this.handleGetAccountInfo();
            }, 50000);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 处理账号数据
    handleDealInfoData() {
      // 处理cpu百分比
      let cpu = 100;
      if (this.info.cpu_limit.max > 0) {
        cpu = Decimal.div(this.info.cpu_limit.used, this.info.cpu_limit.max);
        cpu = Decimal.mul(cpu, 100);
      }
      this.allPercent.cpuPercent = toFixed(cpu.toString(), 2);
      if (cpu > 999) {
        this.allPercent.showCpu = 999;
      } else {
        this.allPercent.showCpu = toFixed(cpu.toString(), 2);
      }
      // 处理net百分比
      let net = 100;
      if (this.info.net_limit.max > 0) {
        net = Decimal.div(this.info.net_limit.used, this.info.net_limit.max);
        net = Decimal.mul(net, 100);
      }
      this.allPercent.netPercent = toFixed(net.toString(), 2);
      // 处理ram百分比
      let ram = 100;
      if (this.info.ram_quota > 0) {
        ram = Decimal.div(this.info.ram_usage, this.info.ram_quota);
        ram = Decimal.mul(ram, 100);
      }
      this.allPercent.ramPercent = toFixed(ram.toString(), 2);
    },
    // 保留小数位数
    handleToFixed(num, length) {
      return toFixed(num, length);
    },
    // 关闭弹窗
    handleClose() {
      this.showDetail = false;
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.timer); // 清楚定时器
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.green{
  border: 1px solid $color-green;
  color: $color-green;
}

.yellow{
  border: 1px solid $color-yellow;
  color: $color-yellow;
}

.red{
  border: 1px solid $color-red;
  color: $color-red;
}

.cpu{
  // border: 1px solid $color-green;
  // color: $color-green;
  font-size: .15rem;
  border-radius: 50px;
  height: .6rem;
  width: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: .36rem;
  text-align: center;

  .content{
    margin-top: .05rem;

    .num{
      font-size: .18rem;
    }
  }

  .showDetail{
    text-align: center;
    border-radius: .18rem;
    width: 90%;
    max-width: 6.2rem;
    color: $color-333;
    font-size: .3rem;
  }
}
</style>
