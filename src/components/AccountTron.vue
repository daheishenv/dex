<template>
  <div>
    <!-- 资产页账户信息 -->
    <div class="info" v-if="$route.name === 'property'">
      <div class="account">
        <div class="badgeDiv" v-if="$store.state.app.vipInfo.ambassadorType">
          <img src="/static/img/more/badge.png">
        </div>
        <div class="iconBg notShowBg">
          <span class="iconfont icon-huaban22 icon"></span>
        </div>
        <!-- 判断账户是否有用户名 true: 显示用户名&地址缩略 | false: 显示地址缩略&设置用户名 -->
        <div class="tronAccount"
          v-clipboard:copy="address"
          v-clipboard:success="handleCopy"
          v-clipboard:error="handleCopyError">
          <div class="noName" v-if="!$store.state.app.accountInfo || !$store.state.app.accountInfo.name">
            <span class="address">{{ handleDealLongStr(address) }}</span>
            <span class="iconfont icon-huaban119 copyIcon"></span>
            <span class="setName" @click.stop="handleSetName">（{{ $t('tronNewdex.setUserName') }}）</span>
          </div>
          <div class="hasName" v-else>
            <span class="address">
              {{ $store.state.app.accountInfo ? handleDealLongStr($store.state.app.accountInfo.name) : '' }}</span><span
              class="addressMin">（{{ handleDealLongStr(address) }}）</span><span
              class="iconfont icon-huaban119 copyIcon"></span>
          </div>
          <!-- <div>{{ $store.state.app.accountInfo ? $store.state.app.accountInfo.chain : '' }}</div> -->
        </div>
        <!-- <div class="record" @click="handleToBrowser">{{ $t('merge.record') }} ></div> -->
      </div>

      <div class="totol property-tool">
        <!-- 总估值 -->
        <div class="totolTitle">
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
          <span>{{ totalEosValuation }} {{ handleChainBaseCoin() }}</span>
          <span class="eos">
            <a class="shuaxin act"
              v-if="refresh">
              <div class="iconfont icon-huaban44 refresh"></div>
            </a>
          </span>
          <span class="legalPrice">
            <span v-if="!refresh && $store.state.app.language === 'zh-CN'">
              <span style="margin: 0px .1rem;">/</span>
              <span>¥{{ handleRate(totalEosValuation,
                $store.state.app.exchangeRate.trx || 0, 2) }}</span>
            </span>
            <span v-if="!refresh && $store.state.app.language !== 'zh-CN'">
              <span>/</span>
              <span>${{ handleRate(totalEosValuation,
                $store.state.app.exchangeRate.trx || 0, 2) }}</span>
            </span>
          </span>
        </div>
        <!-- 估值 - 隐藏 -->
        <div v-if="!seeProperty">
          <span>********{{ handleChainBaseCoin() }}</span>
        </div>
      </div>
    </div>

    <!-- 首页账户信息 -->
    <div class="info-index" v-if="$route.name === 'index'" @click="$router.push('/property')">
      <div class="account">
        <div class="badgeDiv"
          v-if="$store.state.app.vipInfo.ambassadorType">
          <img src="/static/img/more/badge.png">
        </div>
        <div class="iconBg notShowBg">
          <span class="iconfont icon-huaban22 icon"></span>
        </div>
        <div class="tronAccount"
          @click.stop="handleReturn"
          v-clipboard:copy="address"
          v-clipboard:success="handleCopy"
          v-clipboard:error="handleCopyError">
          <div class="noName" v-if="!$store.state.app.accountInfo || !$store.state.app.accountInfo.name">
            <span class="address">{{ handleDealLongStr(address) }}</span>
            <span class="iconfont icon-huaban119 copyIcon"></span><span
              class="setName" @click.stop="handleSetName">（{{ $t('tronNewdex.setUserName') }}）</span>
          </div>
          <div class="hasName" v-else>
            <span class="address">
              {{ $store.state.app.accountInfo ? handleDealLongStr($store.state.app.accountInfo.name) : '' }}</span><span
              class="addressMin">（{{ handleDealLongStr(address) }}）</span><span
              class="iconfont icon-huaban119 copyIcon"></span>
          </div>
        </div>
      </div>

      <div class="totol">
        <span class="totolTitle">{{ $t('public.allTotal') }}</span>
        <span>{{ totalEosValuation }}</span>
        <span class="eos">
          <span>{{ handleChainBaseCoin() }}</span><a class="shuaxin act"
            v-if="refresh">
            <div class="iconfont icon-huaban44 refresh refresh-index color-333"></div>
          </a>
          <span v-if="!refresh && $store.state.app.language === 'zh-CN'">
            <span>/ ¥{{ handleRate(totalEosValuation,
              $store.state.app.exchangeRate.trx || 0, 2) }}</span>
          </span>
          <span v-if="!refresh && $store.state.app.language !== 'zh-CN'">
            <span>/ ${{ handleRate(totalEosValuation,
              $store.state.app.exchangeRate.trx || 0, 2) }}</span>
          </span>
        </span>
      </div>
    </div>

    <!-- 设置用户名弹窗 -->
    <!-- PopupSetNameTron -->
    <mt-popup
      class="popup"
      v-model="setName"
      popup-transition="popup-fade">
      <popup-set-name-tron v-if="setName" @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
// import axios from 'axios';
import { toFixed, handleChainBaseCoin, dealLongStr, toBrowser } from '@/utils/public';
import { getAccountInfoTron } from '@/utils/publicApi';
import { Decimal } from 'decimal.js';
import { Popup } from 'mint-ui';
import PopupSetNameTron from '@/views/property/popup/PopupSetNameTron';

export default {
  data() {
    return {
      accountChange: false, // 切换账户
      seeProperty: true, // 显示资产
      coinList: [], // 最终保存的balance列表
      // platformList: [], // 平台返回的冻结余额
      platformList: [{
        code: 'USDT',
        contract: '1002000',
        freezeCount: 111,
        coinDecimal: 6,
        chainPrice: '0.1'

      }, {
        code: 'TRX',
        contract: '1000001',
        freezeCount: 2222,
        coinDecimal: 8,
        chainPrice: '0.333'
      }
      ], // 平台返回的冻结余额
      chainPrice: 1, // 链计价币相对EOS价格
      totalEosValuation: '-.----', // 总估值
      refresh: true,
      setName: false,
    }
  },
  props: [
  ],
  computed: {
    address() {
      if (this.$store.state.app.accountInfo) {
        return this.$store.state.app.accountInfo.address;
      }
      return '';
    }
  },
  components: {
    PopupSetNameTron,
    mtPopup: Popup
  },
  watch: {
    '$store.state.app.accountInfo': function listen(newVal, oldVal) {
      if (oldVal && newVal.account === oldVal.account && oldVal.chian === newVal.chain) {
        return;
      }
      this.handleGetAccountFreeze();
    }
  },
  mounted() {
    this.handleGetAccountFreeze();
    this.seeProperty = localStorage.getItem('seeProperty') ? JSON.parse(localStorage.getItem('seeProperty')) : true;
  },
  methods: {
    handleToBrowser() {
      if (!this.$store.state.app.accountInfo) {
        return;
      }
      const id = this.$store.state.app.accountInfo.account;
      const chain = this.$store.state.app.accountInfo.chain;
      toBrowser(id, chain, 'account')
    },
    // 关闭弹窗
    handleClose() {
      this.setName = false;
    },
    handleChainBaseCoin() {
      return handleChainBaseCoin();
    },
    handleDealLongStr(str) {
      if (!str) {
        return '-';
      }
      return dealLongStr(str);
    },
    // 隐藏金额
    handleHide() {
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
    // 1.获取账户在平台冻结币种
    handleGetAccountFreeze() {
      const accountInfo = this.$store.state.app.accountInfo;
      if (!accountInfo || !accountInfo.account) {
        return;
      }
      this.$http.post('/accountCoin/getAccountBalance').then((res) => {
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
        this.handleGetBalanceSizeChain();
      } catch (error) {
        setTimeout(() => {
          this.handleGetCoinBanlance()
        }, 200);
      }
    },
    // 2.Tron链查询余额
    handleGetBalanceSizeChain() {
      switch (process.env.NODE_ENV) {
        // case 'test':
        // case 'tron': // eslint-disable-line
        // case 'testh5': // eslint-disable-line
        // case 'development': // eslint-disable-line
        //   this.handleGetBalanceSizeChain();
        //   break;
        default: // eslint-disable-line
          getAccountInfoTron((err, res) => {
            if (err) {
              return;
            }
            this.handleBalanceDeal(res);
          });
          break;
      }
    },
    /**
     * 1.获取账户在平台冻结币种
     * 2.Tron链查询余额
     * tokenBalances name 对1.contract
     * trc20token_balances symbol 对1.请求code
     * {...,code: "TRX",contract: "1000001"}
     */

    // 余额处理
    handleBalanceDeal(result) {
      const trcArr = result.trc20token_balances
      const balancesArr = result.tokenBalances
      this.refresh = false;
      let totalCount = 0;

      this.platformList.forEach((balan) => {
        // 添加币种图片
        this.$set(balan, 'coinImgUrl',
          `https://ndi.340wan.com/${this.$store.state.app.accountInfo.chain}/${balan.code.toLowerCase()}.png`)
        // 平台冻结余额
        this.$set(balan, 'freezeCount', toFixed(balan.freezeCount, balan.coinDecimal));
        // 处理TRX问题
        if (balan.code === 'TRX') {
          const trcItem = trcArr.find(v => v.name === '_')
          const balanItem = balancesArr.find(v => v.name === '_')
          if (trcItem) {
            const divBalan = Decimal.div(Number(trcItem.balance), Number(10 ** balan.coinDecimal)).toString();
            this.$set(balan, 'usableAmount', toFixed(divBalan, balan.coinDecimal))
          } else if (balanItem) {
            const divBalan = Decimal.div(Number(balanItem.balance), Number(10 ** balan.coinDecimal)).toString();
            this.$set(balan, 'usableAmount', toFixed(divBalan, balan.coinDecimal))
          } else {
            this.$set(balan, 'usableAmount', toFixed(0, balan.coinDecimal))
          }
        } else {
          // 正常流程
          const trcItem = trcArr.find(v => balan.code === v.symbol)
          const balanItem = balancesArr.find(v => balan.contract === v.name)
          if (trcItem) {
            const divBalan = Decimal.div(Number(trcItem.balance), Number(10 ** balan.coinDecimal)).toString();
            this.$set(balan, 'usableAmount', toFixed(divBalan, balan.coinDecimal))
          } else if (balanItem) {
            const divBalan = Decimal.div(Number(balanItem.balance), Number(10 ** balan.coinDecimal)).toString();
            this.$set(balan, 'usableAmount', toFixed(divBalan, balan.coinDecimal))
          } else {
            this.$set(balan, 'usableAmount', toFixed(0, balan.coinDecimal))
          }
        }
        const num = Decimal.add(Number(balan.freezeCount), Number(balan.usableAmount)).toString();
        const valuation = Decimal.mul(Number(num), Number(balan.chainPrice)).toString();
        this.$set(balan, 'valuation', toFixed(valuation, 6)); // 当前币种总估值
        totalCount = Decimal.add(Number(totalCount), Number(valuation)).toString(); // 账户所有币种总估值
      });

      this.totalEosValuation = toFixed(totalCount.toString(), 4);
      this.coinList = this.platformList;
      this.$store.dispatch('setCoinList', this.coinList);
    },
    // 分享 - 复制文本
    handleCopy() {
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    handleCopyError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    },
    // 设置账户名
    handleSetName() {
      // console.log('设置账户名'); // eslint-disable-line
      this.setName = true;
    },
    // 阻止事件冒泡
    handleReturn() {
    }
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
  background: #fff;
  font-size: 0.32rem;
  padding: 0.2rem 0.36rem;
  box-sizing: border-box;

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
      width: 0.55rem;
      height: 0.55rem;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center; /*水平居中*/
      margin-right: 0.05rem;

      &.notShowBg {
        // 不显示会员时加上底色
        background: rgba(74, 144, 226, 0.24);
        height: 0.55rem;

        .icon {
          font-size: 0.32rem;
        }
      }

      .icon {
        font-size: 0.32rem;
        color: $color-this;
      }
    }
    .tronAccount{
      margin-left: .1rem;
      display: flex;
      align-items: center;

      .address{
        font-size: .36rem;
      }
      .copyIcon{
        font-size: .26rem;
        margin-left: .05rem;
        color: $color-this;
      }
      .setName{
        font-size: .25rem;
        margin-left: .09rem;
        color: $color-this
      }
      .addressMin{
        font-size: .25rem;
      }
    }
  }

  .totol {
    font-size: 0.42rem;
    height: 0.6rem;
    // margin-top: .1rem;
    line-height: 0.6rem;

    .totolTitle {
      font-size: 0.21rem;
      margin-top: 0.08rem;
    }

    .legalPrice {
      font-size: 0.28rem;
    }

    .totolCount {
      font-weight: bold;
    }

    .eos {
      font-size: 0.24rem;
    }

    .change {
      font-size: 0.25rem;
    }
  }
}

.info {
  background: linear-gradient(to right,rgba(68, 92, 241, 0.96),rgba(57, 82, 193, 1));
  height: 2.4rem;
  max-width: 100%;
  color: white;
  position: relative;
  font-size: 0.32rem;
  padding: 0.4rem 0.36rem 0.4rem 0.36rem;
  box-sizing: border-box;

  .account {
    display: flex;
    align-items: center; /*垂直居中*/

    .record{
      font-size: .25rem;
      margin-left: .2rem;
    }

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
      width: 0.55rem;
      height: 0.55rem;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: center; /*水平居中*/
      margin-right: 0.05rem;

      &.notShowBg {
        // 不显示会员时加上底色
        background: rgba(255, 255, 255, 0.1);
        .icon {
          font-size: 0.32rem;
        }
      }

      .icon {
        font-size: 0.32rem;
      }
    }

    .tronAccount{
      margin-left: .1rem;
      display: flex;
      align-items: center;

      // &>div{
      //   display: flex;
      //   align-items: center;
      // }

      .address{
        font-size: .36rem;
      }
      .copyIcon{
        font-size: .26rem;
        margin-left: .05rem;
        color: #A8D0FF;
      }
      .setName{
        font-size: .25rem;
        margin-left: .09rem;
        color: #A8D0FF
      }
      .addressMin{
        font-size: .25rem;
      }
    }
  }

  .totolTitle {
    font-size: 0.25rem;
    height: 0.5rem;
    overflow: hidden;
  }

  .totol {
    font-size: 0.42rem;
    height: 0.5rem;
    margin-top: 0.2rem;
    line-height: 0.5rem;

    &.property-tool {
      .see {
        font-size: 0.25rem;
        margin-left: 0.2rem;
      }

      .hide {
        font-size: 0.18rem;
        margin-left: 0.2rem;
      }

      .totolTitle {
        display: flex;
      }
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
.popup{
  background: transparent;
}
</style>
