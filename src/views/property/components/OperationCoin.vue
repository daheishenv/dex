<template>
  <div class="operation"
    :class="{'iosOperation': isIos}">
    <div class="action">
      <div class="item toTransaction"
        @click="handleShowTradeUrl">{{ $t('property.toTransaction') }}</div>
      <transition name="subSymbolList"
        v-if="toTrade">
        <div class="subSymbolList">
          <div v-for="(item, $index) in operationData.gotoTrade" :key="$index" @click="handleToTrad(item.symbol)">
            <span v-if="operationData.type !== 'resources'">
              {{ handleDealSymbolSplit(item.symbol).symbol1.toUpperCase() }}/{{
                handleDealSymbolSplit(item.symbol).symbol2.toUpperCase() }}
            </span>
            <span v-else>{{ item.symbol.split('-')[0].toUpperCase() }}</span>
          </div>
        </div>
      </transition>

      <!-- NDX 抵押赎回 start -->
      <div v-if="operationData.contract === 'newdexissuer' && operationData.code === 'NDX'">
        <div class="item addFollow"
          @click="handleVip('stake')">{{ $t('vip.mortgage') }}</div>
        <div class="item addFollow"
          @click="handleVip('unstake')">{{ $t('vip.redeem') }}</div>
      </div>
      <!-- NDX 抵押赎回 start -->

      <!-- NDX 兑换 start -->
      <!-- <div v-if="operationData.code === 'EUSD' || operationData.code === 'EBTC'">
        <div class="item addFollow" @click="handleToExchange(operationData.code)">{{$t("exchange.exchange")}}</div>
      </div> -->
      <!-- NDX 兑换 start -->
      <!-- 充币提币 start -->
      <div v-if="showCharge">
        <!-- <div v-if="!isEos" class="item addFollow" @click="handleCoinCharging(2, operationData.code)">{{ $t('ct.ct1') }}</div> -->
        <div v-if="showCharge" class="item addFollow" @click="handleCoinCharging(1, operationData.code)">{{ $t('ct.ct2') }}</div>
      </div>
      <!-- ptokens -->
      <div v-if="showTokens">
        <!-- <div v-if="!isEos" class="item addFollow" @click="handleCoinCharging(2, operationData.code)">{{ $t('ct.ct1') }}</div> -->
        <div v-if="showTokens" class="item addFollow" @click="handleToPtoken">{{$t("swap.s1")}}{{operationData.code}}</div>
      </div>
      <!-- 充提币 end -->
      <div class="item addFollow"
        @click="handleShowOrderUrl">{{ $t('property.watchOrder') }}</div>
      <transition name="subSymbolList">
        <div class="subSymbolList" v-if="watchOrder">
          <div v-for="(item, $index) in operationData.gotoTrade" :key="$index" @click="handleToOrder(item.symbol)">
            <span v-if="operationData.type !== 'resources'">
              {{ handleDealSymbolSplit(item.symbol).symbol1.toUpperCase() }}/{{ handleDealSymbolSplit(item.symbol).symbol2.toUpperCase() }}
            </span>
            <span v-else>{{ item.symbol.split('-')[0].toUpperCase() }}</span>
          </div>
        </div>
      </transition>
      <!-- 关注功能修改 - 关闭此处取消关注功能 -->
      <!-- <div class="item addFollow" v-if="operationData && !operationData.isFollow"
        @click="handleChangeFollow">{{ $t('property.addFollow') }}</div>
      <div class="item addFollow" v-if="operationData && operationData.isFollow"
        @click="handleChangeFollow">{{ $t('property.cancelFollow') }}</div> -->
    </div>
    <div class="cancel">
      <button class="btn"
        @click="lishenClose">{{ $t('public.cancel') }}</button>
    </div>
    <mt-popup
      v-model="WithdrawDialogVisible"
      class="popup"
      popup-transition="popup-fade">
      <withdraw-dialog @listenWithdrawDialog="WithdrawDialogVisible = false;"/>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
// import DApp from '@/utils/wallet';
import { accountToSign } from '@/utils/publicApi';
import { dealSymbolSplit, jumpCross, jumpPtokenSwap } from '@/utils/public';
import WithdrawDialog from '@/components/WithdrawDialog'; // 充提币暂停

export default {
  data() {
    return {
      isIos: false,
      toTrade: false,
      watchOrder: false,
      WithdrawDialogVisible: false,
    }
  },
  props: [
    'operationData'
  ],
  components: {
    WithdrawDialog,
    mtPopup: Popup,
  },
  computed: {
    showCharge() {
      const operationData = this.operationData;
      return ((operationData.contract === 'issue.newdex') || (operationData.name === 'EOS' && operationData.contract === 'eosio.token')) && operationData.name !== 'USDT'
    },
    showTokens() {
      const operationData = this.operationData;
      return operationData.contract.split('.')[1] === 'ptokens'
    },
    isEos() {
      return this.operationData.name === 'EOS' && this.operationData.contract === 'eosio.token'
    }
  },
  mounted() {
    // console.log(this.operationData, 'operationDataoperationData');
    const u = navigator.userAgent;
    this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  },
  methods: {
    handleDealSymbolSplit(symbol, chain) {
      return dealSymbolSplit(symbol, chain)
    },
    // 抵押 & 赎回 - type : false(赎回) | true(抵押)
    handleVip(type) {
      this.$router.push({
        name: 'stakeNdx',
        params: {
          type
        }
      })
      // this.$emit('lishenNDX', type);
      this.$emit('lishenClose', false);
    },
    // 关闭
    lishenClose() {
      this.$emit('lishenClose', false);
    },
    // 去交易展开
    handleShowTradeUrl() {
      this.watchOrder = false;
      setTimeout(() => {
        this.toTrade = !this.toTrade;
      }, 100);
    },
    // 去交易
    handleToTrad(toSymbol) {
      sessionStorage.setItem('backRoute', this.$route.path);
      if (this.operationData.type === 'resources') {
        this.$router.push({
          name: 'resourceKlineRex',
        });
        return;
      }
      this.$router.push({
        name: 'linek',
        params: {
          symbol: toSymbol
        }
      });
    },
    // 去兑换页面
    handleToExchange(toSymbol) {
      this.$router.push({
        name: 'exchange',
        params: {
          symbol: toSymbol
        }
      });
    },
    // 充提币
    handleCoinCharging(direction, coin) {
      jumpCross(direction, coin)
    },
    // 查看订单展开
    handleShowOrderUrl() {
      this.toTrade = false;
      setTimeout(() => {
        this.watchOrder = !this.watchOrder;
      }, 100);
    },
    // 查看订单
    handleToOrder(toSymbol) {
      if (this.operationData.type === 'resources') {
        this.$router.push({
          name: 'resourceTradeRex',
        });
        return;
      }
      this.$router.push({
        name: 'symbolOrderList',
        params: {
          symbol: toSymbol.toLowerCase()
        }
      });
    },
    // 添加关注 | 取消关注
    handleChangeFollow() {
      // token是否存在
      const token = localStorage.getItem('token');
      if (!token) {
        this.handleGetTimestampJson();
        return;
      }

      // 快速响应
      const res = {
        coinId: this.operationData.coinId,
        status: !this.operationData.isFollow
      }
      this.$emit('lishenClose', res);

      // 关注状态处理
      const params = {
        coinId: this.operationData.coinId,
        status: !this.operationData.isFollow ? 1 : 0,
      }
      this.$http.post('/account/watchCoin', params).then((result) => {
        if (result.code === 401) {
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            this.handleGetTimestampJson();
          }, 1000);
          return;
        }
        if (result.code !== 0) {
          // return;
        }
        // this.$emit('lishenClose', res);
      });
    },
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson() {
      accountToSign(this, () => {
        this.handleChangeFollow();
      });
    },
    /* -------- 权限校验 end -------- */
    // 跳转ptoken
    handleToPtoken() {
      if (this.operationData.code === 'PBTC') {
        jumpPtokenSwap();
        return;
      }
      if (this.$store.state.app.language === 'zh-CN') {
        window.location.href = `https://ptoken.340wan.com/${this.operationData.code.toLowerCase()}-on-eos/issue-redeem`;
      } else {
        window.location.href = `https://dapp.ptokens.io/${this.operationData.code.toLowerCase()}-on-eos/issue-redeem`;
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .iosOperation {
    padding-bottom: 1.7rem !important;
  }
}

.pb10 {
  padding-bottom: 0.1rem;
}

.operation {
  background: transparent;
  width: 100%;
  box-sizing: border-box;
  padding: 0.2rem;

  &.iosOperation {
    padding-bottom: 1.2rem;
  }

  // 操作样式
  .action {
    background: #fff;
    border-radius: 0.08rem;
    padding: 0px 0rem;

    .item {
      border-bottom: 1px solid $color-e3e3e3;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center; /*水平居中*/
      height: 1.07rem;

      // &:active{
      //   background: rgba(0, 0, 0, .1);
      // }
    }

    .subSymbolList {
      line-height: 0.8rem;
      text-align: center;
      // background: #f0f0f0;
      border-radius: 0.1rem;
      position: relative;

      .loading {
        line-height: 0.8rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &::before {
        content: "";
        border: 0.1rem solid #f0f0f0;
        position: absolute;
        transform: translate(-50%, -50%) rotate(45deg);
      }

      & > div {
        position: relative;
        background: #f0f0f0;
        border-bottom: 1px solid #fff;
        font-size: 0.25rem;
        border-radius: 0.1rem;
      }
    }
    .subSymbolList-enter {
      opacity: 0;
      overflow: hidden;
    }
    .subSymbolList-enter-active {
      transition: all 0s ease;
    }
    .subSymbolList-leave-active {
      transition: all 0s ease;
    }
    .subSymbolList-leave-to {
      opacity: 0;
      overflow: hidden;
    }
  }

  // 取消样式
  .cancel {
    margin-top: 0.13rem;
    background: #fff;
    border-radius: 0.08rem;
    // padding: 0px .22rem;

    .btn {
      width: 100%;
      height: 1.07rem;
      border-radius: 0.08rem;
      background: #fff;
      font-size: 0.32rem;
      color: $color-blue;

      // &:active{
      //   background: rgba(0, 0, 0, .1);
      // }
    }
  }
}
</style>
