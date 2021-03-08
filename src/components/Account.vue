<template>
  <div>
    <!-- Eos 资产展示 start -->
    <div v-if="$appName === 'eosNewdex'">
      <!-- 资产页账户信息 -->
      <div class="info" v-if="$route.name === 'property'">
        <div class="flexDiv">
          <div class="account">
            <div class="badgeDiv" v-if="$store.state.app.vipInfo.ambassadorType">
              <img src="/static/img/more/badge.png">
            </div>
            <div class="iconBg"
              :class="{'notShowBg': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'}">
              <vip-tip v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos'" />
              <span class="iconfont icon-huaban22 icon"
                v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'"></span>
            </div>
            <div @click="handleToBrowser">
              {{ $store.state.app.accountInfo ? $store.state.app.accountInfo.account : '' }}
            </div>
            <!-- <div class="record" @click="handleToBrowser">{{ $t('merge.record') }} ></div> -->
            <!-- <div class="record" @click="handleToOrder">
              <span class="tabPoint" v-if="$store.state.app.unReadCount > 0"></span>
              {{ $t('merge.myOrder') }} >
            </div> -->
          </div>
          <div class="cpuDiv">
            <Cpu v-if="this.$store.state.app.channel !== 'mykey'"/>
          </div>
        </div>

        <div class="totol property-tool">
          <!-- 总估值 -->
          <div class="totolTitle flex">
            <span>{{ $t('public.allTotal') }}</span>
            <span class="iconfont icon-huaban63 see"
              v-if="seeProperty"
              @click="handleHide"></span>
            <span class="iconfont icon-huaban62 hide"
              v-if="!seeProperty"
              @click="handleHide"></span>
          </div>
          <!-- 估值 - 显示 -->
          <div v-if="seeProperty"
            class="showCount">
            <span>
              <span style="font-size:.38rem" v-if="!refresh">{{ totalEosValuation }} {{ handleChainBaseCoin() }}</span>
              <span v-else>-.---- {{ handleChainBaseCoin() }}</span>
            </span>
            <span class="eos">
              <a class="shuaxin act" v-if="refresh">
                <div class="iconfont icon-huaban44 refresh"></div>
              </a>
            </span>
            <span class="legalPrice">
              <span v-if="!refresh && $store.state.app.language === 'zh-CN'">
                <span style="margin: 0px .1rem;">/</span>
                <span>¥{{ handleRate(totalEosValuation,
                  $store.state.app.exchangeRate[$store.state.app.accountInfo ? $store.state.app.accountInfo.chain : 'eos'] || 0, 2) }}</span>
              </span>
              <span v-if="!refresh && $store.state.app.language !== 'zh-CN'">
                <span>/</span>
                <span>${{ handleRate(totalEosValuation,
                  $store.state.app.exchangeRate[$store.state.app.accountInfo ? $store.state.app.accountInfo.chain : 'eos'] || 0, 2) }}</span>
              </span>
            </span>
          </div>
          <!-- 估值 - 隐藏 -->
          <div v-if="!seeProperty" class="">
            <!-- <span style="font-size: 12px;">✳✳✳✳✳✳✳✳</span> -->
            <span class="hideTip color-fff"></span>
            <span style="font-size:.38rem">{{ handleChainBaseCoin() }}</span>
          </div>
        </div>
      </div>

      <!-- 首页账户信息 -->
      <div class="info-index" v-if="$route.name === 'index'">
        <div class="account">
          <div class="badgeDiv" v-if="$store.state.app.vipInfo.ambassadorType">
            <img src="/static/img/more/badge.png">
          </div>
          <div class="iconBg"
            :class="{'notShowBg': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'}">
            <vip-tip v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos'" />
            <span v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'"
              class="iconfont icon-huaban22 icon"></span>
          </div>
          <div>
            <span @click="$router.push('/property')"> {{ $store.state.app.accountInfo ? $store.state.app.accountInfo.account : '' }}</span>
            <span class="propertyTotol">
              <span class="iconfont icon-huaban63 see"
                v-if="seeProperty"
                @click="handleHide"></span>
              <span class="iconfont icon-huaban62 hide"
                v-if="!seeProperty"
              @click="handleHide"></span>
            </span>
          </div>
        </div>

        <div class="totol indexTotal">
          <!-- 总估值 -->
          <div class="totolTitle flex" @click="$router.push('/property')">
            <span style="font-size: 0.21rem">{{ $t('public.allTotal') }} </span>
            <span v-if="!seeProperty" class="flex">
              <!-- <span style="font-size: 0.19rem; margin-right: 0.05rem">✳✳✳✳✳✳✳✳</span> -->
              <span class="hideTip"></span>
              <span>{{ handleChainBaseCoin() }}</span>
            </span>
            <span v-if="seeProperty">
              <span style="font-size: 0.39rem;"> {{totalEosValuation}} </span>
              <span class="eos" style="font-size: 0.21rem">
                <span> {{ handleChainBaseCoin() }}</span>
                <a class="shuaxin act" v-if="refresh">
                  <div class="iconfont icon-huaban44 refresh refresh-index color-333"></div>
                </a>
                <span v-if="!refresh && $store.state.app.language === 'zh-CN'">
                  <span>/ ¥{{ handleRate(totalEosValuation,
                    $store.state.app.exchangeRate[$store.state.app.accountInfo ? $store.state.app.accountInfo.chain : 'eos'] || 0, 2) }}</span>
                </span>
                <span v-if="!refresh && $store.state.app.language !== 'zh-CN'">
                  <span>/ ${{ handleRate(totalEosValuation,
                    $store.state.app.exchangeRate[$store.state.app.accountInfo ? $store.state.app.accountInfo.chain : 'eos'] || 0, 2) }}</span>
                </span>
              </span>
            </span>
          </div>
          <!-- <span class="change fr color-this" @click="handleShowChange"
            v-if="$store.state.app.channel === 'tokenpocket'">{{ $t('property.shortChange') }}</span> -->
        </div>
        <!-- 客服 -->
        <div class="customersService" @click="handleZendex">
          <div class="icont">
            <i class="iconfont icon-huaban211"></i>
          </div>
          <!-- // 支持 -->
          <div class="word">{{$t('public.support')}}</div>
        </div>
      </div>

      <!-- dialog account change -->
      <mt-popup class="accountChange"
        v-model="accountChange"
        popup-transition="popup-fade">
        <div class="changeList">
          <div class="title">{{ $t('property.change') }}</div>
          <div>
            <div class="item"
              v-for="(item, $index) in walletList" :key="$index"
              @click="handleChangeAccount(item)">
              {{ item.name }}
            </div>
          </div>
          <button class="btn" @click="handleCencel">{{ $t('public.cancel') }}</button>
        </div>
      </mt-popup>
    </div>
    <!-- Eos 资产展示 end -->

    <!-- Tron 资产展示 start -->
    <div v-if="$appName === 'tronNewdex'">
      <account-tron />
    </div>
    <!-- Tron 资产展示 end -->
  </div>
</template>

<script>
// import axios from 'axios';
import moment from 'moment';
import DApp from '@/utils/wallet';
import { Popup } from 'mint-ui';
import { toFixed, handleChainBaseCoin, toBrowser } from '@/utils/public';
import { getRexData, getAccountRexData } from '@/utils/publicApi';
import { Decimal } from 'decimal.js';

import VipTip from '@/views/more/components/VipTip';
import AccountTron from '@/components/AccountTron';
import Cpu from '@/views/market/components/Cpu';

export default {
  data() {
    return {
      accountChange: false, // 切换账户
      seeProperty: false, // 显示资产
      coinList: [], // 最终保存的balance列表
      platformList: [], // 平台返回的冻结余额
      chainPrice: 1, // 链计价币相对EOS价格

      totalEosValuation: '-.----', // 总估值
      totalOver: false,
      refresh: true,

      // 账户列表
      walletList: [],
      resData: null,
      accountRexData: null,
    }
  },
  props: [
  ],
  components: {
    VipTip,
    AccountTron,
    Cpu,
    mtPopup: Popup
  },
  watch: {
    '$store.state.app.accountInfo': {
      handler: function listen(newVal, oldVal) {
        // 新旧账户所属链 & 账户名一致 - 同个账户
        if (newVal.account === oldVal.account && newVal.chain === oldVal.chain) {
          return;
        }
        // this.refresh = true;
        // this.totalOver = true;
        // this.$nextTick(() => {
        //   setTimeout(() => {
        //     this.handleGetAccountFreeze();
        //   }, 8250)
        // })
      },
      deep: true,
    }
  },
  mounted() {
    if (this.$appName === 'eosNewdex' && this.$route.name === 'property') {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.totalOver) { // 定时区间内，totalOver也被改变，直接返回
            return;
          }
          this.totalOver = true;
          this.handleGetAccountFreeze();
        }, 850)
      })
      this.seeProperty = localStorage.getItem('seeProperty') ? JSON.parse(localStorage.getItem('seeProperty')) : true;
    }
  },
  methods: {
    handleZendex() {
      zE('webWidget', 'toggle'); // eslint-disable-line
    },
    handleToBrowser() {
      if (!this.$store.state.app.accountInfo) {
        return;
      }
      const id = this.$store.state.app.accountInfo.account;
      const chain = this.$store.state.app.accountInfo.chain;
      toBrowser(id, chain, 'account')
    },
    handleToOrder() {
      this.$router.push({
        name: 'order'
      });
    },
    handleGetRex(balance) {
      if (this.$store.state.app.accountInfo.chain === 'eos') {
        // 获取rex信息
        getRexData((err, res) => {
          if (err) {
            this.refresh = false;
            return;
          }
          if (res.code !== 0) {
            this.refresh = false;
            return
          }
          this.resData = res.data;

          // 获取账户rex信息
          getAccountRexData((e, r) => {
            this.handleGetAccountRexData(e, r, balance);
          });
        })
      }
    },
    handleGetAccountRexData(e, r, balance) {
      if (e) {
        this.refresh = false;
        return;
      }
      if (r.code !== 0) {
        this.refresh = false;
        return
      }
      this.accountRexData = r.data;
      let usableValuation = Decimal.mul(this.accountRexData.abledTrade, this.resData.priceCut).toString();
      usableValuation = toFixed(usableValuation, 4);
      let valuation = Decimal.mul(this.accountRexData.rex_balance.split(' ')[0], this.resData.priceCut).toString();
      valuation = toFixed(valuation, 4);
      const rex = {
        chainPrice: this.resData.priceCut,
        code: 'REX',
        coinDecimal: 4,
        coinImgUrl: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
        // coinImgUrl: 'https://nds.340wan.com/static/img/coin/EOS.png',
        freezeCount: this.accountRexData.freezeCount,
        gotoTrade: [{
          symbol: 'rex-eos',
          symbolId: 'rex'
        }],
        isFollow: false,
        name: 'REX',
        sort: 99998,
        usableAmount: this.accountRexData.abledTrade,
        usableValuation,
        valuation,
        type: 'resources',
      }
      let rexIndex = this.platformList.findIndex(v => v.code === 'REX');
      if (rexIndex === -1) {
        rexIndex = 0;
      }
      this.platformList.splice(1, rexIndex, rex);
      this.handleBalanceDeal(balance);
      this.refresh = false;
      // this.handleGetCoinBanlance();
    },
    handleChainBaseCoin() {
      return handleChainBaseCoin();
    },
    // 隐藏金额
    handleHide() {
      if (!this.seeProperty) {
        this.handleGetAccountFreeze();
      }
      this.seeProperty = !this.seeProperty;
      localStorage.setItem('seeProperty', this.seeProperty);
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      if (num === '-.----') {
        return '0.00'
      }
      const newNum = Decimal.mul(num, rate).toString();
      const l = len;
      const t = Decimal(`1e${l}`);
      let tNum = Decimal.mul(newNum, t);
      tNum = Decimal.round(tNum);
      tNum = Decimal.div(tNum, t);
      return toFixed(tNum, l);
    },
    // 切换账户
    handleChangeAccount(item) {
      const data = {
        account: item.name,
        address: item.address,
      }
      // 判断是否切换账号
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.account !== data.account) {
        localStorage.removeItem('token');
      }
      this.$store.dispatch('setAccountInfo', data);
      this.accountChange = false;
    },
    handleShowChange() {
      this.accountChange = true;
      DApp.getWalletList((err, data) => {
        if (err) {
          return;
        }
        this.walletList = data;
      });
    },
    handleCencel() {
      this.accountChange = false;
    },
    // 获取账户在平台冻结币种
    handleGetAccountFreeze() {
      const accountInfo = this.$store.state.app.accountInfo;
      if (!accountInfo || !accountInfo.account) {
        return;
      }
      const regAccName = accountInfo.account;
      this.$http.post('/accountCoin/getAccountBalance').then((res) => {
        if(regAccName !== this.$store.state.app.accountInfo.account) {
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.platformList = res.coinList;
        this.chainPrice = res.eosPrice || 1;
        this.handleGetCoinBanlance();
      });
    },
    // 获取币种余额
    handleGetCoinBanlance() {
      try {
        // 判断账户所属链
        if (this.$store.state.app.accountInfo.chain === 'eos') {
          this.handleGetBalanceEosChain()
          return;
        }
        this.handleGetBalanceSizeChain();
      } catch (error) {
        setTimeout(() => {
          this.handleGetCoinBanlance()
        }, 200);
      }
    },
    // EOS链查询余额
    handleGetBalanceEosChain() {
      switch (this.$evn) {
        case 'test':
          this.handleGetBalanceSizeChain();
          break;
        default: {
          const regAccName = this.$store.state.app.accountInfo.account;
          this.$http.post('/accountCoin/getBalances').then((res) => {
            if(regAccName !== this.$store.state.app.accountInfo.account) {
              return;
            }
            if (res.code !== 0) {
              this.$toast({
                message: res.msg,
                position: 'center',
                duration: 2000,
              });
              return;
            }
            if (res.accountRex) {
              this.resData = this.handleDealRexPrice(res.rexPool);
              const accountRex = this.handleDealAccountRex(res.accountRex)
              this.handleGetAccountRexData(null, accountRex, res.balances)
              return;
            }
            this.handleBalanceDeal(res.balances);
            this.refresh = false;
          });
        }
      }
    },
    // 测试查询余额
    handleGetBalanceSizeChain() {
      const regAccName = this.$store.state.app.accountInfo.account;
      this.$http.post('accountCoin/getSideChainBalanceForXeos').then((res) => {
        if(regAccName !== this.$store.state.app.accountInfo.account) {
          return;
        }
        if (res.code !== 0) {
          return;
        }
        if (res.accountRex) {
          this.resData = this.handleDealRexPrice(res.rexPool);
          const accountRex = this.handleDealAccountRex(res.accountRex)
          this.handleGetAccountRexData(null, accountRex, res.balances)
          return;
        }
        this.handleBalanceDeal(res.balances);
        this.refresh = false;
      })
    },
    // 计算rex价格
    handleDealRexPrice(rexPool) {
      const cbData = rexPool;
      const allEos = cbData.total_lendable.split(' ')[0];
      const allRex = cbData.total_rex.split(' ')[0];
      const price = Decimal.div(allEos, allRex).toString();
      cbData.priceCut = Number(price).toFixed(11); // 截取的13位的价格
      cbData.price = price; // 完整价格
      return cbData
    },
    // 计算用户REX
    handleDealAccountRex(accountRex) {
      const cbData = accountRex;
      const balance = cbData.rex_balance.split(' ')[0];
      let abledTrade = balance;
      cbData.rex_maturities.forEach((v) => {
        const zone = moment().zone() / 60; // 时区
        const jsTime = moment(v.first).add(0 - zone, 'hours').format('YYYY/MM/DD HH:mm:ss'); // 解锁时间
        const jsBdTime = new Date(jsTime).getTime();
        const bdTime = new Date().getTime();
        const flg = bdTime - jsBdTime >= 0;
        if (!flg) {
          const num = Decimal.div(v.second || 0, 10000).toString();
          abledTrade = Decimal.sub(abledTrade, num).toString();
        }
      });
      cbData.abledTrade = toFixed(abledTrade, 4);
      cbData.freezeCount = Decimal.sub(balance, abledTrade).toString();
      const cbRes = {
        code: 0,
        data: cbData,
        msg: 'success'
      }
      return cbRes;
    },
    // 余额处理
    handleBalanceDeal(result) {
      const balanceArr = result;
      let totalCount = 0;
      this.platformList.forEach((balan) => {
        let item = balanceArr.find(v => balan.code === v.currency && balan.contract === v.contract)
        if (!item) {
          item = {
            amount: toFixed(0, balan.coinDecimal),
          }
          if (balan.code === 'REX') {
            item.amount = balan.usableAmount;
          }
        }
        this.$set(balan, 'coinImgUrl', // 币种图片
          `https://ndi.340wan.com/${this.$store.state.app.accountInfo.chain}/${balan.contract}-${balan.code.toLowerCase()}.png`)
        this.$set(balan, 'usableAmount', item.amount); // 可用余额
        const usableValuation = Decimal.mul(Number(item.amount), Number(balan.chainPrice)).toString();
        this.$set(balan, 'usableValuation', toFixed(usableValuation, balan.coinDecimal)); // 当前币种可用余额估值

        this.$set(balan, 'freezeCount', toFixed(balan.freezeCount, balan.coinDecimal)); // 平台冻结余额
        const num = Decimal.add(Number(balan.freezeCount), Number(item.amount));
        const valuation = Decimal.mul(Number(num), Number(balan.chainPrice)).toString();
        this.$set(balan, 'valuation', toFixed(valuation, 4)); // 当前币种总估值
        totalCount = Decimal.add(Number(totalCount), Number(balan.valuation)); // 账户所有币种总估值

        if (balan.code === 'REX' || balan.code === 'EOS') {
          this.$set(balan, 'coinImgUrl', 'https://nds.340wan.com/static/img/coin/EOS.png');
        }
      });
      this.totalEosValuation = toFixed(totalCount.toString(), 4);
      this.coinList = this.platformList;
      this.$store.dispatch('setCoinList', this.coinList);
    },
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@-webkit-keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg);
  }
}

@keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg);
  }
}
.hideTip{
  margin-right: .08rem;
  &::before{
    content: "********";
    color: #333;
    font-size: .39rem;
    height: .28rem;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: .39rem;
  }
  &.color-fff{
    &::before{
      color: #fff;
    }
  }
}
.showCount {
  display: flex;
  align-items: center;

  .shuaxin {
    color: #999;
    margin: 0;
    font-size: 0.32rem;
    z-index: 200;
    margin-left: 0.1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .refresh {
      display: flex;
      align-items: center;
      font-size: 0.25rem;
      color: white;
      animation: rotating 0.8s linear infinite;
    }
  }
}

.shuaxin {
  color: #999;
  margin: 0;
  font-size: 0.32rem;
  z-index: 200;
  margin-left: 0.1rem;

  .refresh {
    display: inline-block;
    font-size: 0.25rem;
    color: white;
    animation: rotating 0.8s linear infinite;
  }
}

.rate {
  font-size: 0.25rem;
  margin-left: 0.08rem;

  &.rateIndex {
    margin-left: 0.1rem;
  }
}

.info-index {
  position: relative;
  background: #fff;
  font-size: 0.32rem;
  padding: 0.13rem 0.16rem 0.1rem;
  box-sizing: border-box;

  .showTotal{
    display: flex;
    align-items: center;
    margin-left: .17rem;
    color: $color-999;
    .see{
      font-size: .20rem;
    }
    .hide{
      font-size: .12rem;
    }
  }

  .account {
    display: flex;
    align-items: center; /*垂直居中*/

    .badgeDiv {
      display: flex;
      align-items: center;
      margin-right: 0.05rem;
      width: 0.78rem;

      img {
        width: 100%;
      }
    }

    .iconBg {
      // background: rgba(74,144,226,0.24);
      border-radius: 50%;
      width: 0.45rem;
      height: 0.45rem;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center; /*水平居中*/
      margin-right: 0.05rem;

      &.notShowBg {
        // 不显示会员时加上底色
        background: rgba(74, 144, 226, 0.24);
        height: 0.45rem;

        .icon {
          font-size: 0.28rem;
        }
      }

      .icon {
        font-size: 0.32rem;
        color: $color-this;
      }
    }
  }

  .totol {
    font-size: 0.42rem;
    height: 0.6rem;
    // margin-top: .1rem;
    line-height: 0.6rem;

    .totolTitle {
      font-size: 0.27rem;
      margin-top: 0.08rem;

      .allTotal {
        margin-right: 0.2rem;
      }
    }

    .legalPrice {
      font-size: 0.28rem;
    }

    .totolCount {
      font-weight: bold;
    }

    .eos {
      font-size: 0.28rem;
    }

    .change {
      font-size: 0.25rem;
    }
  }
}

.info {
  background: linear-gradient(
    to right,
    rgba(68, 92, 241, 0.96),
    rgba(57, 82, 193, 1)
  );
  height: 2.4rem;
  max-width: 100%;
  // text-align: center;
  color: white;
  position: relative;
  // box-shadow: 0px 0px .15rem $color-333;
  font-size: 0.32rem;
  padding: 0.4rem 0.36rem 0.4rem 0.36rem;
  box-sizing: border-box;

  .flexDiv{
    height: .45rem;;
    display: flex;
    justify-content: space-between;
  }

  .cpuDiv{
    margin-top: -.05rem;

    /deep/ .cpu{
      color: #fff !important;
      border: 1px solid #fff !important;
      margin-right: 0px;
    }
  }

  .account {
    display: flex;
    align-items: center; /*垂直居中*/
    // justify-content: center;/*水平居中*/

    .badgeDiv {
      display: flex;
      align-items: center;
      margin-right: 0.05rem;
      width: 0.78rem;

      img {
        width: 100%;
      }
    }

    .iconBg {
      border-radius: 50%;
      width: 0.45rem;
      height: 0.45rem;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center; /*水平居中*/
      margin-right: 0.05rem;

      &.notShowBg {
        // 不显示会员时加上底色
        background: rgba(255, 255, 255, 0.1);
        .icon {
          font-size: 0.28rem;
        }
      }

      .icon {
        font-size: 0.32rem;
      }
    }

    .record{
      position: relative;
      font-size: .25rem;
      margin-left: .2rem;
      .tabPoint{
        position: absolute;
        right: .13rem;
        top: -0.02rem;
        color: white;
        width: .15rem;
        height: .15rem;
        background: $color-red;
        border-radius: 100%;
        font-size: .18rem;
        display: flex;
        align-items: center;/*垂直居中*/
        justify-content: center;/*水平居中*/
      }
    }
  }

  .totolTitle {
    font-size: 0.25rem;
    height: 0.5rem;
    overflow: hidden;
  }
}

.totol {
  font-size: 0.42rem;
  height: 0.5rem;
  margin-top: 0.12rem;
  &.indexTotal{
    margin-top: 0rem;
    .totolTitle{
      margin-top: 0rem;
    }
  }
  .see {
    font-size: 0.25rem;
    margin-left: 0.2rem;
  }

  .hide {
    position: relative;
    margin-top: .03rem;
    font-size: 0.18rem;
    margin-left: 0.2rem;
  }

  .totolTitle {
    display: flex;
  }
  .legalPrice {
    font-size: 0.25rem;
    line-height: 0.35rem;
  }

  .totolCount {
    font-weight: bold;
  }

  .eos {
    font-size: 0.28rem;
  }

  .change {
    font-size: 0.25rem;
  }
}

.propertyTotol {
  line-height: auto!important;
  color: #999;

  .see {
    font-size: 0.25rem;
    margin-left: 0.2rem;
  }

  .hide {
    font-size: 0.16rem;
    margin-left: 0.2rem;
    transform: scale(1);
    position: relative;
  }
}

.accountChange {
  border-radius: 0.15rem;

  .changeList {
    text-align: center;
    font-size: 0.42rem;
    width: 5.47rem;
    padding: 0.5rem 0.36rem;
    box-sizing: border-box;

    .title {
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.32rem;
      color: $color-this;
      margin-bottom: 0.2rem;
    }

    .item {
      height: 1.07rem;
      line-height: 1.07rem;
      border-bottom: 1px solid $color-e3e3e3;

      &:last-child {
        border-bottom: 1px solid transparent;
      }
    }

    .btn {
      font-size: 0.25rem;
      height: 0.68rem;
      line-height: 0.68rem;
      margin-top: 0.2rem;
      width: 2.34rem;
      color: white;
      background: $color-blue;
      border-radius: 0.12rem;
    }
  }
}
.customersService {
  position: absolute;
  right: .33rem;
  top: .3rem;
  text-align: center;
  color: $color-this;
  z-index: 1000;

  .icont {
    display: inline-block;
    width: .52rem;
    height: .52rem;
    background: #FFF;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    .icon-huaban211{
      font-size: .35rem;
    }
  }

  .word {
    color: #4A90E2;
    font-size: .21rem;
  }
}
</style>
