<template>
  <div class="trade">
    <mt-loadmore
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="$t('public.loadingMoreTip1')"
      :bottomDropText="$t('public.loadingMoreTip2')"
      :bottomLoadingText="$t('public.loadingMoreTip3')"
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false" ref="loadmore">
      <div class="main">
        <!-- coin & 收藏 -->
        <div class="tools">
          <div class="symbol" @click="changeSymbol = true">
            <img class="coinImg" :src="coinImgUrl" @error="handleImgError"
            :onerror="errorCoinImg" alt="">
            <div class="contractDiv">
              <div class="symbolAndMore">
                <span>{{ `${symbol1} & ${symbol2} ${$t('resources.lease')}` }}</span>
                <span class="iconfont icon-huaban37 changeSymbol"></span>
              </div>
            </div>
          </div>
          <div class="favorate">
            <!-- cpu start -->
            <Cpu v-if="this.$store.state.app.channel !== 'mykey'" />
            <!-- K线 start -->
            <span class="iconfont icon-huaban47 icon fr ml36" @click="handleToLineK"></span>
          </div>
        </div>

        <div class="content">
          <div class="typeDiv">
            <div :class="{'buy': type === 1}" @click="type = 1">{{ $t('resources.rentCpu') }}</div>
            <div :class="{'sell': type === 2}" @click="type = 2">{{ $t('resources.lendCpu') }}</div>
          </div>
          <div v-if="type === 1" class="lease">
            <!-- 资源类型 -->
            <div class="leaseItem">
              <div class="itemTitle">{{ $t('resources.resType') }}</div>
              <div class="checkBoxDiv">
                <span class="checkBox" @click="status = 1">
                  <span class="iconfont checkIcon"
                    :class="{'icon-huaban57': status === 1}"></span>
                  <span>CPU</span>
                </span>
                <span class="checkBox" @click="status = 2">
                  <span class="iconfont checkIcon"
                    :class="{'icon-huaban57': status === 2}"></span>
                  <span>NET</span>
                </span>
              </div>
            </div>
            <!-- 租借价格 -->
            <div class="leaseItem">
              <div class="itemTitle">{{ $t('resources.rentPriceLong') }}</div>
              <div class="inputDiv disabled">
                <div>{{ rentPriceCut }}</div>
                <div>{{ $t('resources.monthPrice') }}</div>
              </div>
            </div>
            <!-- 租借期限 -->
            <div class="leaseItem">
              <div class="itemTitle">{{ $t('resources.rentTime') }}</div>
              <div class="inputDiv disabled">
                <div>{{ $t('resources.dateLong') }}</div>
              </div>
            </div>
            <!-- 接收账户 -->
            <div class="leaseItem">
              <div class="itemTitle">{{ $t('newpos.receiveAccount') }}</div>
              <div>
                <div class="checkBoxDiv accountChoose">
                  <span class="checkBox" @click="self = true">
                    <span class="iconfont checkIcon"
                      :class="{'icon-huaban57': self}"></span>
                    <span>{{ $t('resources.thisAct') }}</span>
                  </span>
                  <span class="checkBox" @click="self = false">
                    <span class="iconfont checkIcon"
                      :class="{'icon-huaban57': !self}"></span>
                    <span>{{ $t('resources.otherAct') }}</span>
                  </span>
                </div>
                <div class="inputDiv noPd" :class="{'error': receiverError}">
                  <span class="accountSpan">EOS{{ $t('newpos.account') }}</span>
                  <div class="inputDiv disabled actSelf" v-if="self">
                    <div>{{ receiver }}</div>
                  </div>
                  <input v-else class="actInput" type="text" ref="actInput" maxlength="12" v-model="receiver"
                    @focus="actInputFocus = true"
                    @blur="handleBlurInput"
                    :placeholder="$t('newpos.inputTipAccount')">
                  <span class="tip iconfont icon-huaban17 clear" v-if="!self && actInputFocus" @click="handleClear"></span>
                </div>
              </div>
            </div>
            <!-- 租借数量 -->
            <div class="leaseItem noMb">
              <div class="itemTitle">{{ $t('resources.rentNum') }}</div>
              <div>
                <div class="inputDiv" :class="{'error': inputError}">
                  <input type="number" v-model="dealNum"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    :placeholder="$t('resources.inputTip')">
                  <span>
                    <span>EOS</span>
                    (<span v-if="status === 1">CPU</span><span v-else>NET</span>)
                  </span>
                </div>
                <div class="flexEnd">
                  <div>
                    <span>{{ $t('resources.rentPrice') }}: </span>
                    <span>{{ dealNumToCount }} EOS</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 续租期限 -->
            <div class="leaseItem">
              <div class="itemTitle">{{ $t('resources.leaseTerm') }}</div>
              <div>
                <div class="cycleTime">
                  <span class="flex">
                    <div class="inputDiv noPd">
                      <span class="color-red" @click="handleSub">—</span>
                      <label class="label">{{ renewalDays }} {{ $t('resources.day') }}</label>
                      <span class="iconfont icon-huaban26 color-green" @click="handleAdd"></span>
                    </div>
                  </span>
                  <span class="renewInstr" @click="showRentTip = true">
                    <!-- <span class="color-999">{{ $t('resources.rentTip') }}</span> -->
                    <span class="iconfont icon-huaban31 color-999 instr"></span>
                  </span>
                </div>
                <div class="flexEnd">
                  <div>
                    <span>{{ $t('resources.renewalNum') }}: </span>
                    <span>{{ renewalNum }} EOS</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 自动续租 -->
            <!-- <div class="leaseItem noMt">
              <div class="itemTitle">续租期限</div>
              <div class="checkBoxDiv flexBtw">
                <span class="flex">
                  <span class="checkBox" @click="isRenewal = true">
                    <span class="iconfont checkIcon"
                      :class="{'icon-huaban57': isRenewal}"></span>
                    <span>{{ $t('resources.yes') }}</span>
                  </span>
                  <span class="checkBox" @click="isRenewal = false">
                    <span class="iconfont checkIcon"
                      :class="{'icon-huaban57': !isRenewal}"></span>
                    <span>{{ $t('resources.no') }}</span>
                  </span>
                </span>
                <span class="renewInstr" @click="showRentTip = true">
                  <span class="color-999">{{ $t('resources.rentTip') }}</span>
                  <span class="iconfont icon-huaban31 instr"></span>
                </span>
              </div>
            </div> -->
            <!-- 续租租金 -->
            <!-- <div class="leaseItem">
              <div class="itemTitle">{{ $t('resources.renewalNum') }}</div>
              <div>
                <div class="inputDiv"
                  :class="{'disabled': !isRenewal, 'error': renewalNumError}">
                  <div v-if="!isRenewal">0.0000</div>
                  <input v-else type="number" v-model="renewalNum"
                    @focus="handleRenewalFocus"
                    @blur="handleRenewalBlur"
                    :placeholder="$t('resources.inputTip2')">
                  <span>EOS</span>
                </div>
                <div class="flexEnd">
                  <div>
                    <span>{{ $t('resources.allRentPrice') }}: </span>
                    <span>{{ allRentCount }} EOS</span>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- 按钮 -->
            <div class="btn" :class="{'bgColor-999': $store.state.app.accountInfo.chain !== 'eos'}" @click="handleReg">
              <span v-if="$store.state.app.language !== 'ko'">
                <span>{{ $t('resources.rent') }}</span><span
                v-if="status === 1">CPU</span><span v-else>NET</span>
              </span>
              <span v-else>
                <span v-if="status === 1">CPU</span><span v-else>NET</span><span
                >{{ $t('resources.rent') }}</span>
              </span>
            </div>
            <div class="flexEnd">
              <div @click="handleClickAble">
                <span>{{ $t('resources.abledEos') }}:</span>
                <span>{{ balance }}</span>
              </div>
            </div>
          </div>
          <div v-else class="sellContent">
            <div class="sellItem">
              <span>{{ $t('resources.lendTip1_1') }}</span><span class="color-this"
              >{{ $t('resources.lendTip1_2') }}</span><span>{{ $t('resources.lendTip1_3') }}</span>
            </div>

            <div class="sellItem">
              <span class="color-green">{{ $t('resources.rexInfo_3_1') }}</span> <span
              >{{ $t('resources.rexInfo_3_2') }}</span>
            </div>

            <div class="sellItem">
              <span class="color-red">{{ $t('resources.lendTip3_1') }}</span><span
              >{{ $t('resources.lendTip3_2') }}</span>
            </div>
            <div class="btn" :class="{'sellBtn': type === 2, 'bgColor-999': $store.state.app.accountInfo.chain !== 'eos'}"
              @click="handleToBuyRex">{{ $t('resources.toBuyRex') }}</div>
          </div>
        </div>

        <!-- 交易历史 -->
        <div class="history">
          <div class="subTitle">
            <span>{{ $t('resources.leaseOrder') }}</span>
            <span class="color-this" @click="showReservesTip = true">{{ $t('resources.leaseFail') }}?</span>
          </div>
          <div>
            <LeaseOrder ref="leaseOrder" :balance="balance" :hasReserves="hasReserves" :time="time" />
          </div>
        </div>
      </div>
    </mt-loadmore>

    <!-- 切换交易对 -->
    <mt-popup
      v-model="changeSymbol"
      position="left">
        <change-symbol v-show="changeSymbol" @listenClose="handleClose" />
    </mt-popup>

    <!-- 切换账户提示 -->
    <mt-popup
      v-model="changeAccountTip"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <change-account-tip :changeChain="'EOS'" v-if="changeAccountTip" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 交易确认 -->
    <mt-popup
      v-model="showAction"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <TradeInfo v-if="showAction" :action="action"
      @listenClose="handleClose"/>
    </mt-popup>

    <!-- REX交易说明 -->
    <mt-popup
      v-model="showRentTip"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <RentTip v-if="showRentTip" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 储备金说明 -->
    <mt-popup
      v-model="showReservesTip"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <PopupReservesTip v-if="showReservesTip" :hasReserves="hasReserves" @listenClose="handleClose"/>
    </mt-popup>

  </div>
</template>

<script>
import DApp from '@/utils/wallet';
// import axios from 'axios';
import { Popup, Loadmore } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { handleRegAccount, getAccountReservesData } from '@/utils/publicApi';
import { toFixed, toLocalTime, toBrowser } from '@/utils/public';
import Cpu from '@/views/market/components/Cpu';
import ChangeSymbol from '@/views/market/components/ChangeSymbol';
import ChangeAccountTip from '@/views/market/popup/ChangeAccountTip';
import RentTip from '@/views/resources/popup/RentTip';
import TradeInfo from '@/views/resources/popup/TradeInfo';
import PopupReservesTip from '@/views/resources/popup/PopupReservesTip';
import LeaseOrder from '@/views/resources/components/LeaseOrder';

export default {
  data() {
    return {
      changeSymbol: false,
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      coinImgUrl: 'https://nds.340wan.com/static/img/coin/EOS.png',
      symbol: 'cpu-net',
      symbol1: 'CPU',
      symbol2: 'NET',
      type: 1, // 1 - 租借 | 2 - 出租
      status: 1, // 1 - cpu | 2 -net
      isRenewal: false, // 自动续租
      balance: '0.0000',
      rentPriceCut: '0.0000',
      rentPrice: '1.0000',
      dealNum: '', // 租借数量
      dealNumToCount: '0.0000', // 实际应支付金额 = 租借数量 / 租借价格
      renewalNum: '0.0000', // 续租租金
      renewalDays: 0,
      allRentCount: '0.0000', // 总租金
      receiver: '', // 接受账户
      receiverError: false, // 接受账户错误
      action: null,
      showAction: false,
      showRentTip: false,
      hasReserves: '0.0000 EOS',
      showReservesTip: false,

      allLoaded: true, // 不可上拉
      balanceTimer: null,
      numTimer: null,

      changeAccountTip: false,
      inputError: false,
      renewalNumError: false,
      first: true,

      coin: 'EOS', // 基础币种 EOS - 主网 | SYS - 测试网
      time: 30, // 租赁周期时间
      self: true, // 当前账户 ？ true ： false
      actInputFocus: false, // 其他账户输入框选中
    }
  },
  components: {
    Cpu,
    ChangeSymbol,
    ChangeAccountTip,
    LeaseOrder,
    TradeInfo,
    RentTip,
    PopupReservesTip,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
      this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
    },
    self(newVal) {
      if (!newVal) {
        return;
      }
      this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
    },
    receiver() {
      this.receiverError = false;
    },
    type() {
      this.dealNum = '';
      this.renewalNum = '0.0000';
      this.renewalDays = 0;
      this.isRenewal = false;
      this.receiverError = false;
      this.inputError = false;
      this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        if (!this.first) {
          this.changeAccountTip = true;
        }
      }
    },
    rentPrice() {
      const dealNumToCount = Decimal.div(Number(this.dealNum), Number(this.rentPrice));
      this.dealNumToCount = toFixed(dealNumToCount, 4);
      const allRentCount = Decimal.add(Number(this.renewalNum), Number(dealNumToCount));
      this.allRentCount = toFixed(allRentCount, 4);
    },
    dealNum(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.dealNum = oldVal;
        return;
      }
      const dealNumToCount = Decimal.div(Number(newVal), Number(this.rentPrice));
      this.dealNumToCount = toFixed(dealNumToCount, 4);
      const times = Decimal.div(this.renewalDays, this.time);
      const renewalNum = Decimal.mul(Number(this.dealNumToCount), times);
      this.renewalNum = toFixed(renewalNum, 4);
      const allRentCount = Decimal.add(Number(this.renewalNum), Number(dealNumToCount));
      this.allRentCount = toFixed(allRentCount, 4);
    },
    renewalDays(newVal) {
      const times = Decimal.div(newVal, this.time);
      const renewalNum = Decimal.mul(Number(this.dealNumToCount), times);
      this.renewalNum = toFixed(renewalNum, 4);
      const allRentCount = Decimal.add(Number(this.dealNumToCount), Number(this.renewalNum));
      this.allRentCount = toFixed(allRentCount, 4);
    },
    isRenewal() {
      this.renewalNum = '';
      this.renewalNumError = false;
    },
  },
  mounted() {
    this.stakeList = [{
      cpu_weight: '0.0000 EOS',
      from: this.$store.state.app.accountInfo.account,
      net_weight: '0.0000 EOS',
      to: this.$store.state.app.accountInfo.account,
    }]
    this.handleMouted();
  },
  methods: {
    handleBlurInput() {
      this.actInputFocus = false;
    },
    // 删除其他账户
    handleClear() {
      this.receiver = '';
      this.$refs.actInput.focus();
    },
    handleMouted() {
      this.type = this.$route.params.activeType === 'sell' ? 2 : 1;
      setTimeout(() => {
        this.first = false;
      }, 500);
      this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';

      // 需要定时的接口
      this.handleGetEosBalance();
      this.handleGetRentPrice();
      this.handleGetReservesBal();
      window.clearInterval(this.balanceTimer);
      this.balanceTimer = window.setInterval(() => {
        this.handleGetEosBalance();
        this.handleGetRentPrice();
        this.handleGetReservesBal();
      }, 3000);
    },
    handleAdd() {
      this.renewalDays += 30;
    },
    handleSub() {
      const t = this.renewalDays - 30;
      if (t >= 0) {
        this.renewalDays -= 30;
      }
    },
    // dealNum 失去焦点
    handleBlur() {
      this.dealNum = toFixed(Number(this.dealNum), 4);
    },
    // dealNum 获取焦点
    handleFocus() {
      const dealNum = Number(this.dealNum);
      if (dealNum === 0) {
        this.dealNum = '';
        return;
      }
      this.dealNum = dealNum;
    },
    // renewalNum 失去焦点
    handleRenewalBlur() {
      this.renewalNum = toFixed(Number(this.renewalNum), 4);
    },
    // renewalNum 获取焦点
    handleRenewalFocus() {
      const renewalNum = Number(this.renewalNum);
      if (renewalNum === 0) {
        this.renewalNum = '';
        return;
      }
      this.renewalNum = renewalNum;
    },
    // 点击可用余额 - 带入数量
    handleClickAble() {
      // 计算余额可租的EOS数量
      // const num = Decimal.mul(Number(this.balance), Number(this.rentPrice))
      // console.log(num)
      // this.dealNum = toFixed(num, 4);
      this.dealNum = this.balance;
    },
    // 查询Tx
    handleToTx(id, chain) {
      if (id.indexOf('*') !== -1) {
        return;
      }
      toBrowser(id, chain, 'tx', this.$embed);
    },
    // 小数位截取
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    // 时间转化
    handleToLocalTime(t) {
      return toLocalTime(t).substr(0, 10)
    },
    // 下拉刷新
    loadTop() {
      this.dealNum = '';
      this.renewalNum = '0.0000';
      this.isRenewal = false;
      this.receiverError = false;
      this.inputError = false;
      this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
      this.handleGetLists();
    },
    // 上啦加载更多
    loadBottom() {
      this.handleGetLists();
    },
    // 处理图片加载出错
    handleImgError() {
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
    },
    // 关闭切换币种
    handleClose(type) {
      this.changeSymbol = false;
      this.changeAccountTip = false;
      this.showRentTip = false;
      this.showAction = false;
      this.showReservesTip = false;
      if (type) {
        this.dealNum = '';
        this.renewalNum = '0.0000';
        this.renewalDays = 0;
        setTimeout(() => {
          this.handleGetLists();
        }, 500);
      }
    },
    // 跳转到K线
    handleToLineK() {
      // 资源交易对跳转
      const params = {
        symbol: this.symbol
      }
      this.$router.push({
        name: 'resourceKlineCpu',
        params,
      });
    },
    // 获取租赁订单
    handleGetLists() {
      this.$refs.leaseOrder.handleGetLists(() => {
        this.$refs.loadmore.onTopLoaded();
      });
    },
    // 获取账户EOS余额
    async handleGetEosBalance() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          return;
        }
        // 正常获取余额
        const params = {
          account: this.$store.state.app.accountInfo.account,
          code: 'eosio.token',
          symbol: this.coin
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.balance = balance;
        } else {
          this.balance = `0.0000 ${params.coin}`;
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     this.balance = '0.0000';
        //     return;
        //   }
        //   this.balance = data.split(' ')[0];
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetEosBalance();
        }, 200);
      }
    },
    // 获取租赁价格
    handleGetRentPrice() {
      // getRexData((err, res) => {
      //   if (err || res.code !== 0) {
      //     return;
      //   }
      //   this.rentPrice = res.data.rentPrice;
      //   this.rentPriceCut = res.data.rentPriceCut;
      // });
      const arr = this.$store.state.app.allSymbolData.resources;
      const cpuData = arr.filter(item => item.id === 'cpu')[0] || [];
      this.rentPrice = cpuData.price;
      this.rentPriceCut = cpuData.price;
    },
    // 获取当前账户储备金余额
    handleGetReservesBal() {
      const chain = this.$store.state.app.accountInfo.chain;
      if (chain !== 'eos') {
        return;
      }
      getAccountReservesData((err, res) => {
        if (err || res.code !== 0) {
          this.hasReserves = '0.0000 EOS';
          return;
        }
        this.hasReserves = res.data.balance;
      });
    },
    /* -------- btn 事件分发 -------- */
    // 按钮验证
    handleReg() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        this.changeAccountTip = true;
        return;
      }
      if (!this.dealNum || Number(this.dealNum) < 0.0001) {
        this.inputError = true;
        return;
      }
      if (this.isRenewal && !Number(this.renewalNum)) {
        this.renewalNumError = true;
        return;
      }
      if (Number(this.allRentCount) < 0.0001) {
        this.$toast(`${this.$t('trade.minTrade')}0.0001 EOS`);
        return;
      }
      if (Number(this.allRentCount) > Number(this.hasReserves.split(' ')[0])) {
        if (Number(this.allRentCount) > parseFloat(this.balance)) {
          this.$toast(this.$t('quotation.low'));
          return;
        }
      }

      this.renewalNumError = false;
      this.inputError = false;
      this.handleDealBtn()
    },
    // 事件分发
    handleDealBtn() {
      if (this.receiver !== this.$store.state.app.accountInfo.account) {
        const params = {
          account: this.receiver,
          chian: 'eos'
        }
        handleRegAccount(params, (err) => {
          if (err) {
            this.receiverError = true;
            this.$toast(this.$t('trade.receiverErrorTip2'))
            return;
          }
          this.handleBuy();
        });
        return;
      }
      this.handleBuy();
    },
    // 买入
    handleBuy() {
      const topUp = Number(this.allRentCount) > Number(this.hasReserves.split(' ')[0]) ? 1 : 0;
      const params = {
        type: this.status,
        receiver: this.receiver,
        loan_payment: `${this.dealNumToCount} ${this.coin}`,
        loan_fund: `${this.renewalNum || '0.0000'} ${this.coin}`,

        status: this.status, // 1 - cpu | 2 -net
        isRenewal: this.isRenewal, // 自动续租
        balance: this.balance,
        dealNum: this.dealNum, // 租借数量
        dealNumToCount: this.dealNumToCount, // 实际应支付金额 = 租借数量 / 租借价格
        renewalNum: this.renewalNum, // 续租租金
        allRentCount: `${this.allRentCount} ${this.coin}`, // 总租金
        hasReserves: this.hasReserves, // 已有储备金余额
        topUp,
        renewalDays: this.renewalDays,
      }
      this.action = params;
      this.showAction = true;
    },
    // 前往买入REX
    handleToBuyRex() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        this.changeAccountTip = true;
        return;
      }
      this.$router.push({
        name: 'resourceTradeRex'
      })
    }
  },
  beforeDestroy() {
    window.clearInterval(this.balanceTimer);
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .trade{
    height: calc(100vh - .6rem) !important;
    overflow: auto;
  }
}

.trade{
  font-size: .30rem;
  background: #FFF;
  height: calc(100vh - 1rem);
  overflow: auto;

  .tools{
    padding: 0rem .25rem;
    background: #FFF;
    height: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &>div:first-child{
      display: flex;
      align-items: center;
    }

    .symbol{
      position: relative;

      .coinImg{
        width: .6rem;
        margin-right: .1rem;
      }

      .contractDiv{
        .contract{
          font-size: .25rem;
          color: $color-999;
          margin-top: -.1rem;
        }

        .symbolAndMore{
          display: flex;
          align-items: center;
          font-size: .36rem;
        }
      }

      .changeSymbol{
        font-size: .16rem;
        margin-left: .1rem;
      }
    }

    .icon{
      font-size: .38rem;
    }

    .activity{
      width: .44rem;
      margin-right: .3rem;
    }

    .favorate{
      display: flex;
      align-items: center;
    }
  }

  .content{
    padding: .38rem;

    .typeDiv{
      display: flex;
      align-items: center;
      justify-content: space-between;

      &>div{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: .83rem;
        border: 1px solid #C7C7C7;
        margin-left: .1rem;
        border-radius: 0 .1rem .1rem 0;

        &:first-child{
          margin-left: 0rem;
          border-radius: .1rem 0 0 .1rem;
        }

        &.buy{
          border: 1px solid $color-green;
          color: $color-green;
        }
        &.sell{
          border: 1px solid $color-red;
          color: $color-red;
        }
      }
    }

    .lease{
      .leaseItem{
        display: flex;
        // align-items: center;
        font-size: .28rem;
        // height: .72rem;
        margin: .2rem 0;

        &>div:last-child{
          flex: 1;
        }

        &.noMt{
          margin-top: 0;
        }

        &.noMb{
          margin-bottom: 0;
        }

        .itemTitle{
          width: 1.12rem;
          margin-right: .18rem;
          height: .72rem;
          display: flex;
          align-items: center;
        }

        .cycleTime{
          display: flex;
          align-items: center;
          justify-content: space-between;

          .flex{
            flex: 1;
            margin-right: .12rem;

            .label{
              color: $color-333;
            }

            span{
              font-size: .27rem;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              border-right: 1px solid $color-input;
              width: .9rem;

              &:last-child{
                border-right: 0px solid $color-input;
                border-left: 1px solid $color-input;
              }
            }
          }

          .instr{
            font-size: .27rem;
            color: $color-999;
            padding: 0 .18rem;
          }
        }

        .checkBoxDiv{
          padding-left: .22rem;
          display: flex;
          align-items: center;

          &.accountChoose{
            height: .72rem;
          }

          &.flexBtw{
            justify-content: space-between;
            flex: 1;
            font-size: .25rem;

            .flex{
              display: flex;
              align-items: center;
              flex: 1;
            }

            .instr{
              font-size: .27rem;
              color: $color-999;
            }
          }

          .checkBox{
            display: flex;
            align-items: center;
            font-size: .25rem;
            margin-left: .52rem;

            &:first-child{
              margin-left: 0rem;
            }

            .checkIcon{
              font-size: .3rem;
              margin-right: .08rem;
              border: 1px solid $color-input;
              height: .3rem;
              width: .3rem;
              box-sizing: border-box;
              border-radius: .0417rem;
              overflow: hidden;

              &.icon-huaban57{
                border: 0px solid $color-input;
                color: $color-this;
              }
            }
          }
        }

        .inputDiv{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          padding: 0px .22rem;
          border: 1px solid $color-input;
          height: .72rem;
          border-radius: .0662rem;
          color: $color-999;
          overflow: hidden;

          &.actSelf{
            border: 0px solid $color-input;
          }

          &.noPd{
            padding: 0;
          }
          &.error{
            border: 1px solid $color-red;
          }

          &.disabled{
            background: #f3f3f3;
          }

          input{
            width: 100%;
            height: 100%;
            flex: 1;
            font-size: .28rem;
          }
          .accountSpan{
            padding: 0 .22rem;
            // margin-right: .22rem;
            background: #fafafa;
            color: $color-333;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 1.56rem;
          }
          .actInput{
            margin-left: .22rem;
          }
          .clear{
            width: .4rem;
            // text-align: center;
            font-size: .18rem;
          }
        }
      }
      .flexEnd{
        display: flex;
        justify-content: flex-end;
        font-size: .25rem;
        color: $color-999;
        padding: .09rem .22rem 0 0;
      }
    }

    .sellContent{
      margin-top: .62rem;
      // height: 7.4rem;
      position: relative;
      font-size: .28rem;

      .sellItem{
        margin-top: .5rem;
      }
    }

    .btn{
      background: $color-green;
      height: .84rem;
      color: #FFF;
      border-radius: .1rem;
      margin-top: .2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .32rem;
      position: relative;

      &.bgColor-red{
        background: $color-red;
      }
      &.sellBtn{
        background: $color-this !important;
        margin-top: .5rem;
        width: 6.78rem;
      }
      &.bgColor-999{
        background: $color-999 !important;
      }
    }
  }

  .history{
    .subTitle{
      height: .74rem;
      background: #FAFAFA;
      display: flex;
      align-items: center;
      padding: 0 .24rem;
      font-size: .25rem;
      justify-content: space-between;
    }
  }
}
.changeAccountTip{
  border-radius: .1rem;
  background: transparent;
}
</style>
