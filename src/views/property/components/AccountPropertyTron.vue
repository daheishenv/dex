<template>
  <div class="tools">
    <div class="subTools">
      <!-- 带宽 -->
      <div class="cpu" @click="showDetail = true;">
        <div class="title">{{$t('property.bandwidth')}}</div>
        <div :class="{'color-red': allPercent.netPercent >= 80}">{{ $t('property.used') }} {{ allPercent.netPercent }}%</div>
      </div>
      <!-- 能量 -->
      <div class="cpu" @click="showDetail = true;">
        <div class="title">{{$t('property.energy')}}</div>
        <div :class="{'color-red': allPercent.energyPercent >= 80}">{{ $t('property.used') }} {{ allPercent.energyPercent }}%</div>
      </div>
    </div>

    <!-- 资源详情 -->
    <mt-popup
      v-model="showDetail"
      class="showDetail"
      popup-transition="popup-fade">
      <property-detail-tron :allPercent='allPercent' :info='info' @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>
<script>
import { Popup } from 'mint-ui';
// import axios from 'axios';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
import DApp from '@/utils/wallet/index';
import PropertyDetailTron from './PropertyDetailTron';


export default {
  data() {
    return {
      allPercent: {
        netPercent: 0,
        energyPercent: 0,
        netFrozen: 0,
        energyFrozen: 0
      },
      // mock测试
      // info: {
      //   EnergyLimit: 3000,
      //   EnergyUsed: 1700,
      //   NetLimit: '',
      //   NetUsed: '',
      //   freeNetUsed: 2000,
      //   freeNetLimit: 6000,
      // },
      info: {},
      showDetail: false
    }
  },
  components: {
    PropertyDetailTron,
    mtPopup: Popup,
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
          this.info = resp
          this.handleDealInfoData()
        }
      })
      DApp.getAccountFrozen((err, resp) => {
        if (!err) {
          // console.log(resp,"getAccountFrozen") // eslint-disable-line
          this.allPercent.netFrozen = toFixed(resp.netFrozen, 6)
          this.allPercent.energyFrozen = toFixed(resp.energyFrozen, 6)
        }
      })
    },
    // 处理账号数据
    handleDealInfoData() {
      // 处理带宽百分比
      const { NetUsed, freeNetUsed, NetLimit, freeNetLimit, EnergyUsed, EnergyLimit } = this.info
      let net = 100;
      if (NetLimit > 0 || freeNetLimit > 0) {
        // 免费的带宽和已使用带宽相加
        const used = Number((freeNetUsed || 0) + (NetUsed || 0))
        const total = Number((NetLimit || 0) + (freeNetLimit || 0))
        net = Decimal.div(used, total)
        net = Decimal.mul(net, 100);
      }
      this.allPercent.netPercent = toFixed(net.toString(), 2);
      // 处理能量百分比
      let energy = 100;
      if (EnergyLimit > 0) {
        const used = Number((EnergyUsed || 0))
        const total = Number((EnergyLimit || 0))
        energy = Decimal.div(used, total);
        energy = Decimal.mul(energy, 100);
      }
      this.allPercent.energyPercent = toFixed(energy.toString(), 2);
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.tools{
  // display: flex;
  align-items: center;
  // background: #fff;
  // margin-top: .12rem;

  .subTools{
    height: 1.5rem;
    display: flex;
    align-items: center;
    background: #fff;
    margin-bottom: .09rem;
  }
  .cpu{
    flex: 1;
    padding: 0 0.7rem;
    text-align: left;
    box-sizing: border-box;
  }

  .title{
    color: $color-999;
    margin-bottom: .12rem;
  }

  .showDetail{
    border-radius: .18rem;
    width: 90%;
    max-width: 6.2rem;
  }
}
</style>
