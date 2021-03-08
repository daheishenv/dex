<template>
  <div class="cpu">
    <div class="content" @click="showDetail = true">
      <div
      :class="{'green': allPercent.netPercent <= 60,
      'yellow': allPercent.netPercent > 60 && allPercent.netPercent <= 80, 'red': allPercent.netPercent > 80}"
      >{{$t('property.B')}}:{{allPercent.netPercent || 0}}%</div>
      <div
      :class="{'green': allPercent.energyPercent <= 60,
      'yellow': allPercent.energyPercent > 60 && allPercent.energyPercent <= 80, 'red': allPercent.energyPercent > 80}"
      >{{$t('property.E')}}:{{allPercent.energyPercent || 0}}%</div>
    </div>
    <!-- 资源详情 -->
    <mt-popup v-model="showDetail" class="showDetail" popup-transition="popup-fade">
      <PropertyDetailTron :allPercent="allPercent" :info="info" @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
import DApp from '@/utils/wallet/index';
import PropertyDetailTron from '../../property/components/PropertyDetailTron';

export default {
  data() {
    return {
      allPercent: {
        netPercent: 0,
        energyPercent: 0,
        netFrozen: 0,
        energyFrozen: 0
      },
      info: {},
      showDetail: false
    };
  },
  components: {
    PropertyDetailTron,
    mtPopup: Popup
  },
  mounted() {
    this.handleGetAccountInfo();
  },
  methods: {
    // 保留小数位数
    handleToFixed(num, length) {
      return toFixed(num, length);
    },
    // 关闭弹窗
    handleClose() {
      this.showDetail = false;
    },
    // 获取账号数据
    handleGetAccountInfo() {
      DApp.getAccountResources((err, resp) => {
        if (!err) {
          this.info = resp;
          this.handleDealInfoData();
        }
      });
      DApp.getAccountFrozen((err, resp) => {
        if (!err) {
          this.allPercent.netFrozen = toFixed(resp.netFrozen, 6);
          this.allPercent.energyFrozen = toFixed(resp.energyFrozen, 6);
        }
      });
    },
    // 处理账号数据
    handleDealInfoData() {
      // 处理带宽百分比
      const {
        NetUsed,
        freeNetUsed,
        NetLimit,
        freeNetLimit,
        EnergyUsed,
        EnergyLimit
      } = this.info;
      let net = 100;
      if (NetLimit > 0 || freeNetLimit > 0) {
        // 免费的带宽和已使用带宽相加
        const used = Number((freeNetUsed || 0) + (NetUsed || 0));
        const total = Number((NetLimit || 0) + (freeNetLimit || 0));
        net = Decimal.div(used, total);
        net = Decimal.mul(net, 100);
      }
      this.allPercent.netPercent = toFixed(net.toString(), 2);
      // 处理能量百分比
      let energy = 100;
      if (EnergyLimit > 0) {
        const used = Number(EnergyUsed || 0);
        const total = Number(EnergyLimit || 0);
        energy = Decimal.div(used, total);
        energy = Decimal.mul(energy, 100);
      }
      this.allPercent.energyPercent = toFixed(energy.toString(), 2);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.green {
  // border: 1px solid $color-green;
  color: $color-green;
}

.yellow {
  // border: 1px solid $color-yellow;
  color: $color-yellow;
}

.red {
  // border: 1px solid $color-red;
  color: $color-red;
}

.cpu {
  // border: 1px solid $color-green;
  // color: $color-green;
  font-size: 0.15rem;
  // border-radius: 50px;
  height: 1rem;
  min-width: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.36rem;
  text-align: left;
  font-size: 0.18rem;

  .content {
    margin-top: 0.05rem;

    .num {
      font-size: 0.18rem;
    }
  }

  .showDetail {
    text-align: center;
    border-radius: 0.18rem;
    width: 90%;
    max-width: 6.2rem;
    color: $color-333;
    font-size: 0.3rem;
  }
}
</style>
