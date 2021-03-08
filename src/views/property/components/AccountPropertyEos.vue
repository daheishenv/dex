<template>
  <div class="tools">
    <div class="cpuTools" v-if="!isEosChain" @click="handleShowResourcesPopup">
      <!-- cpu -->
      <div class="cpu">
        <div class="title">CPU</div>
        <div :class="{'color-red': allPercent.cpuPercent >= 80}">{{ $t('property.used') }} {{ handleToFixed(allPercent.cpuPercent, 1) }}%</div>
      </div>
      <!-- net -->
      <div class="cpu">
        <div class="title">NET</div>
        <div :class="{'color-red': allPercent.netPercent >= 80}">{{ $t('property.used') }} {{ handleToFixed(allPercent.netPercent, 1) }}%</div>
      </div>
      <!-- ram -->
      <div class="cpu">
        <div class="title">RAM</div>
        <div :class="{'color-red': allPercent.ramPercent >= 80}">{{ $t('property.used') }} {{ handleToFixed(allPercent.ramPercent, 1) }}%</div>
      </div>
    </div>

    <div class="subTools" v-else>
      <div class="resourDiv">
        <!-- 抵押NDX -->
        <!-- <div class="resourItem line" @click="handleToStake">
          <img class="imgNdx" src="https://ndi.340wan.com/eos/newdexissuer-ndx.png" alt="">
          <span>{{ $t('merge.stakeNdx') }}</span>
        </div> -->
        <!-- 资源详情 -->
        <!-- <div class="resourItem" @click="handleShowResourcesPopup">
          <span class="iconfont icon-huaban148 resDetail"></span>
          <span>{{ $t('merge.resDdetail') }}</span>
        </div> -->
        <!-- USDT 兑换 -->
        <div class="resourItem line" @click="handleToUsdt">
          <img class="imgUsdt" src="https://ndi.340wan.com/eos/tethertether-usdt.png" alt="">
          <span>{{$t('exchange.exchangeUsdt')}}</span>
        </div>
        <!-- 充币 -->
        <!-- <div class="resourItem line" @click="handleCoinCharging(2, 'BTC')">
          <img class="imgUsdt" src="/static/img/more/charge.png" alt="">
          <span>{{$t('ct.ct1')}}</span>
        </div> -->
        <!-- 提币 -->
        <!-- <div class="resourItem line" @click="handleCoinCharging(1, 'BTC')">
          <img class="imgUsdt" src="/static/img/more/withdraw.png" alt="">
          <span>{{$t('ct.ct2')}}</span>
        </div> -->
        <!-- 跨链充提 -->
        <div class="resourItem line" @click="handleToCoinCharging">
          <img class="imgUsdt" src="https://nds.340wan.com/static/img/chainIcon/coinCharging.png" alt="">
          <span>{{$t('ct.ct83')}}</span>
        </div>
        <!-- USN 稳定币 -->
        <!-- <div class="resourItem line" @click="handleToUsn">
          <span class="iconfont icon-huaban1310 danchor"></span>
          <span>{{$t('lineK.usn',{coin:'USN'})}}</span>
        </div> -->
        <!-- 领取BOX -->
        <!-- <div class="resourItem line" @click="handleReceiveBox">
          <img src="https://nds.340wan.com/static/img/more/defibox.png" alt="" class="defiboxImg">
          <span>{{$t('db.db1')}}</span>
        </div> -->
      </div>
      <!-- <div class="stake">
        <div class="stakeBg" @click="handleToStake">
          <div>
            <img class="imgNdx" src="https://ndi.340wan.com/eos/newdexissuer-ndx.png" alt="">
            <span>{{ $t('merge.stakeNdx') }}</span>
          </div>
          <div class="stakeInfo">{{ $t('vip.alreadyMortgage') }}：{{ ndxNum }}NDX</div>
        </div>
      </div> -->
      <!-- <div class="other" :class="{
        'enOther': $store.state.app.language === 'en',
        'koOther': $store.state.app.language === 'ko'}">
        <div @click="handleToExchange">
          <span class="iconfont icon-huaban130 exchange"></span>
          <span>{{ $t('exchange.exchange') }}</span>
        </div>

        <div @click="handleShowResourcesPopup">
          <span class="iconfont icon-huaban148 resDetail"></span>
          <span>{{ $t('merge.resDdetail') }}</span>
        </div>
      </div> -->
    </div>

    <!-- 资源详情 -->
    <mt-popup
      v-model="showDetail"
      class="showDetail"
      popup-transition="popup-fade">
      <Property-detail-eos :allPercent="allPercent" :info="info" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 选择充提弹窗 -->
    <mt-popup
      v-model="chargingChange"
      class="popup"
      popup-transition="popup-fade">
      <charging-change
        v-if="chargingChange"
        @listenClose="handleClose"
        :symbolCoin="symbolCoin"/>
    </mt-popup>
    <!-- 领取box -->
    <mt-popup
      v-model="receiveBoxVisible"
      class="popup"
      popup-transition="popup-fade">
      <receive-box
        :receiveBoxVisible="receiveBoxVisible"
        @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
import { toFixed, jumpCross, jumpUsdt } from '@/utils/public';
import { Decimal } from 'decimal.js';
import { Popup } from 'mint-ui';

import ChargingChange from '@/views/market/popup/ChargingChange'
import PropertyDetailEos from './PropertyDetailEos';
import ReceiveBox from './ReceiveBox';

export default {
  props: [
    'isRefresh',
    'ndxNum',
  ],
  data() {
    return {
      allPercent: {
        cpuPercent: 0,
        netPercent: 0,
        ramPercent: 0,
      },
      info: null,
      showDetail: false,
      symbolCoin: 'BTC', // 充提币币种
      chargingChange: false,
      receiveBoxVisible: false, // 领取box
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
  components: {
    PropertyDetailEos,
    ChargingChange,
    mtPopup: Popup,
    ReceiveBox,
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
      this.chargingChange = false;
      this.receiveBoxVisible = false;
    },
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
    // 跨链兑换
    handleToExchange() {
      this.$router.push({
        name: 'exchange',
        params: {
          symbol: 'EBTC',
        }
      })
    },
    // 抵押/赎回NDX
    handleToStake() {
      this.$router.push({
        name: 'stakeNdx',
      })
    },
    // 兑换 usdt
    handleToUsdt() {
      jumpUsdt();
    },
    // 充提
    handleToCoinCharging() {
      this.chargingChange = true;
    },
    // 充提币
    handleCoinCharging(direction, coin) {
      jumpCross(direction, coin)
    },
    // 显示资源弹窗
    handleShowResourcesPopup() {
      if (this.isRefresh) {
        return;
      }
      this.showDetail = true;
    },
    // 跳转内嵌稳定币页面
    handleToUsn() {
      const lang = this.$store.state.app.language || 'en';
      location.href = `https://dapp.danchor.io/?chain=eos&channel=${this.$store.state.app.channel}&language=${lang}`;
      // this.$router.push({
      //   name: 'usn'
      // })
    },
    // 领取BOX
    handleReceiveBox() {
      this.receiveBoxVisible = true;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.tools{
  display: flex;
  align-items: center;
  // background: #fff;

  .cpuTools{
    display: flex;
    align-items: center;
    background: #fff;
    width: 100%;
    height: 1.28rem;
    // margin-bottom: .09rem;

    &>div{
      flex: 1;
      text-align: center;
    }

    .title{
      color: $color-999;
      margin-bottom: .12rem;
    }
  }
  .showDetail{
    border-radius: .18rem;
    width: 90%;
    max-width: 6.2rem;
  }
}

.subTools{
  width: 100%;
  // margin: .09rem 0;
  display: flex;
  height: 100%;
  align-items: center;
  // height: 1.68rem;
  height: 1rem;

  .resourDiv{
    display: flex;
    width: 100%;
    background-color: #fff;
    .resourItem{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1rem;
      width: 50%;
      font-size: 0.24rem;
      color: #4A4A4A;
      position: relative;
      &.line::after{
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        height: 0.26rem;
        width: 1px;
        transform: translateY(-50%);
        background-color: #C7C7C7;
      }
      &.line:last-child::after{
        background-color: transparent;
      }
      .imgNdx{
        width: .38rem;
        margin-right: .08rem;
      }
      .imgUsdt{
        width: .39rem;
        margin-right: .08rem;
      }
      .exchange,.resDetail{
        font-size: .31rem;
        color: #3369fe;
        margin-right: .19rem;
      }
      .danchor{
        color: rgb(254, 183, 94);
        font-size: .34rem;
        margin-right: .08rem;
      }
      .defiboxImg {
        margin-right: .08rem;
        width: .39rem;
      }
    }
  }
  // .stake{
  //   flex: 1;
  //   padding-left: .27rem;
  //   box-sizing: border-box;
  //   font-size: .27rem;
  //   background: #FFF;
  //   height: 100%;
  //   display: flex;
  //   align-items: center;
  //   border-radius: 0 .05rem .05rem 0;

  //   .stakeBg{
  //     &>div{
  //       display: flex;
  //       align-items: center;
  //     }
  //   }
  //   .imgNdx{
  //     width: .5rem;
  //     margin-right: .08rem;
  //   }
  //   .stakeInfo{
  //     margin-top: .18rem;
  //     font-size: .24rem;
  //     color: $color-999;
  //   }
  // }
  // .other{
  //   margin-left: .08rem;
  //   flex: 1;
  //   font-size: .27rem;

  //   &.enOther{
  //     &>div:last-child{
  //       height: .81rem;
  //       background: #FFF;
  //       display: flex;
  //       align-items: center;
  //       padding-left: .85rem;
  //       justify-content: flex-start;
  //     }
  //   }
  //   &.koOther{
  //     &>div:last-child{
  //       height: .81rem;
  //       background: #FFF;
  //       display: flex;
  //       align-items: center;
  //       padding-left: .67rem;
  //       justify-content: flex-start;
  //     }
  //   }
  //   &>div{
  //     height: .81rem;
  //     background: #FFF;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     border-radius: .05rem 0 0 .05rem;

  //     .exchange,
  //     .resDetail{
  //       font-size: .31rem;
  //       color: #3369fe;
  //       margin-right: .19rem;
  //     }

  //     &:first-child{
  //       margin-bottom: .06rem;
  //     }
  //   }
  // }
}

.popup {
  border-radius: .1rem;
}
</style>
