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
                <span>{{symbol1}}</span>
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
            <div :class="{'buy': type === 1}" @click="type = 1">{{ $t('public.buy') }}</div>
            <div :class="{'sell': type === 2}" @click="type = 2">{{ $t('public.sell') }}</div>
          </div>
          <div class="priceDiv">
            <div>
              <span v-if="type === 1">{{ $t('resources.buyPrice') }}</span>
              <span v-else>{{ $t('resources.sellPrice') }}</span>
            </div>
            <div class="inputDiv">
              <span>≈{{ ramPrice }}</span>
              <span>EOS/KB</span>
            </div>
          </div>
          <div class="countDiv">
            <div>
              <span v-if="type === 1">{{ $t('resources.buyNum') }}</span>
              <span v-else>{{ $t('resources.sellNum') }}</span>
            </div>
            <div class="inputDiv" :class="{'error': inputError}">
              <input type="number" v-model="dealNum" :placeholder="$t('resources.count')"
                @blur="handleBlur" @focus="handleFocus"/>
              <span>
                <span v-if="type === 1">EOS</span>
                <span v-else>KB</span>
              </span>
            </div>
          </div>
          <div class="aboutPrice">
            <span>
              <span>≈{{ aboutNum }}</span>
              <span v-if="type === 1">KB</span>
              <span v-else>EOS</span>
            </span>
          </div>
          <div class="range" :class="{'sellRange': type === 2}"
            @touchend="handleTouchEnd"
            @touchstart="handleTouchStart">
            <div class="desc">
              <span>
                <span class="before" @click="handleRangeSet(0)" :class="{'border-green': rangeValue >= 0}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(25)" :class="{'border-green': rangeValue >= 25}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(50)" :class="{'border-green': rangeValue >= 50}"></span>
              </span>
              <span>
                <span class="before" @click="handleRangeSet(75)" :class="{'border-green': rangeValue >= 75}"></span>
                <span class="last" @click.stop="handleRangeSet(100)" :class="{'border-green': rangeValue >= 100}"></span>
              </span>
            </div>
            <mt-range
              v-model="rangeValue"
              :min="0"
              :max="100"
              :step="1"
              :bar-height="5">
            </mt-range>
          </div>
          <div class="ableTradeDiv">
            <div class="ableTrade" @click="handleClickAble">
              <span v-if="type === 1">{{ $t('resources.abledEos') }}: {{ eosBalance }}</span>
              <span v-else>{{$t('resources.abledSellRam')}}: {{handleToFixed(ramAbleSell, 2) }}</span>
            </div>
            <div class="percent">{{ handleToFixed(rangeValue, 2) }}%</div>
          </div>
          <div class="btn" :class="{'bgColor-red': type !== 1,
            'bgColor-999': $store.state.app.accountInfo && $store.state.app.accountInfo.chain !== 'eos'}"
            @click="handleReg">
            <span v-if="type === 1">{{$t('public.buy')}} RAM</span>
            <span v-else>{{$t('public.sell')}} RAM</span>
          </div>
          <div class="btnBottom">
            <!-- <div v-if="type === 1" class="buyInStaked" @click="handleByBuyStaked">{{ $t('resources.buyInStaked') }}</div> -->
            <div v-if="type === 1"  ></div>
            <div v-else>
              <span>{{$t('resources.ramBalance')}}:</span>
              <span>{{handleToFixed(ramAbleSell, 2) }}</span>
              <!-- <span>{{ handleToFixed(ramBalance,2) }} KB</span> -->
            </div>
            <div class="ramTip" @click="ramTradeNote = true">
              <span>{{$t('resources.ramTradeNote')}}</span>
              <span class="iconfont icon-huaban31 question"></span>
            </div>
          </div>
        </div>

        <!-- 交易历史 -->
        <div class="history">
          <div class="subTitle">{{ $t('resources.tradeHistory') }}</div>
          <div class="lists">
            <template v-if="list.length">
              <div class="item"  v-for="(item, $index) in list" :key="$index">
              <div class="info">
                <span class="type" v-if="item.direction === 1">{{ $t('public.buy') }}</span>
                <span class="type color-red" v-else>{{ $t('public.sell') }}</span>
                <span class="ramCoin">RAM</span>
                <span class="date">{{ handleToLocalTime(item.blockTime) }}</span>
              </div>
              <!-- <div class="data">
                <div class="left">
                  <div class="itemtitle">{{ $t('resources.vol') }}(EOS)</div>
                  <div class="num">{{ handleToFixed(item.amount, 4) }}</div>
                </div>
                <div class="right">
                  <div class="itemtitle">{{ $t('resources.amt') }}(RAM)</div>
                  <div class="num">{{ handleToFixed(item.count, 4) }}</div>
                </div>
              </div> -->
              <div class="data">
                <div>
                  <span class="itemtitle">{{ $t('resources.trade') }}:</span>
                  <span class="unlockTime" >{{item.quantity}}</span>
                </div>
                <div class="trxDiv">
                  <span class="itemtitle">TrxID:</span>
                  <span class="trxId" @click="handleToTx(item.trxId, 'eos')">{{ item.trxId }}</span>
                </div>
              </div>
            </div>
            </template>


            <!-- 暂无数据 -->
            <div class="noData" v-if="!list.length">
              <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
              <div class="tip">{{ $t('public.noData') }}</div>
            </div>

            <!-- 没有更多 -->
            <div class="noMore" v-if="allLoaded && list.length">
              <div class="noTip color-999">{{ $t('public.noMore') }}</div>
            </div>
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

    <!-- Ram交易说明 -->
    <mt-popup
      v-model="ramTradeNote"
      class="changeAccountTip"
      popup-transition="popup-fade">
      <RamTradeNote v-if="ramTradeNote" :type="type"
      @listenClose="handleClose"/>
    </mt-popup>

  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import axios from 'axios';
import { Popup, Loadmore, Range } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { toFixed, toLocalTime, toBrowser } from '@/utils/public';
import Cpu from '@/views/market/components/Cpu';
import ChangeSymbol from '@/views/market/components/ChangeSymbol';
import ChangeAccountTip from '@/views/market/popup/ChangeAccountTip';
import RamTradeNote from '@/views/resources/popup/RamTradeNote';

export default {
  data() {
    return {
      changeSymbol: false,
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      coinImgUrl: 'https://nds.340wan.com/static/img/coin/EOS.png',
      symbol: 'ram-eos',
      symbol1: 'RAM',
      symbol2: 'EOS',
      type: 1,
      rangeValue: 0,
      rangeFocus: false,
      allLoaded: false,
      page: 1,
      list: [],
      ramPrice: '0.00000000000',
      // ramPriceAll: '0.000000000', // 完整的REX价格
      dealNum: '', // 买入EOS数量 | 卖出REX数量
      aboutNum: '0', // 计算大约数量
      ramBalance: '0.00',
      ramAbleSell: '0.0000',
      eosBalance: '0.0000',
      balanceTimer: null,
      numTimer: null,

      changeAccountTip: false,
      ramTradeNote: false, // 买入 卖出弹窗
      inputError: false,
      first: true,
      info: { // 账户代理信息
        producers: [],
        proxy: '',
      },
      stakedCount: '0.0000', // 自己账户的总抵押量
      stakeList: [], // 账户抵押资源列表
      dexProxyLists: [], // 平台代理列表
      newProxy: '', // 新设置的代理账户
      coin: 'EOS', // 基础币种 EOS - 主网 | SYS - 测试网
    }
  },
  components: {
    Cpu,
    ChangeSymbol,
    ChangeAccountTip,
    RamTradeNote,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
    mtRange: Range,
  },
  watch: {
    type() {
      this.dealNum = '';
      this.aboutNum = '0';
      this.rangeValue = 0;
      this.inputError = false;
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        if (!this.first) {
          this.changeAccountTip = true;
        }
      }
    },
    dealNum(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.dealNum = oldVal;
        return;
      }
      if (newVal >= 10000000000) {
        this.dealNum = oldVal;
        return;
      }
      this.inputError = false;
      if (!this.rangeFocus) {
        window.clearTimeout(this.numTimer);
        if (this.type === 1) {
          this.numTimer = window.setTimeout(() => {
            const aboutNum = Decimal.div(Number(newVal), this.ramPrice).toString();
            this.aboutNum = toFixed(aboutNum, 2);
            if (!Number(this.eosBalance)) {
              this.rangeValue = 0;
              return;
            }
            let range = Decimal.div(Number(newVal), Number(this.eosBalance)).toString();
            range = Decimal.mul(range, 100).toString();
            if (Number(range) > 100) {
              range = 100;
            }
            this.rangeValue = Number(range);
          }, 300);
          return;
        }
        this.numTimer = window.setTimeout(() => {
          const aboutNum = Decimal.mul(Number(newVal), this.ramPrice).toString();
          this.aboutNum = toFixed(aboutNum, 4);
          if (!Number(this.ramAbleSell)) {
            this.rangeValue = 0;
            return;
          }
          let range = Decimal.div(Number(newVal), Number(this.ramAbleSell)).toString();
          range = Decimal.mul(range, 100).toString();
          if (Number(range) > 100) {
            range = 100;
          }
          this.rangeValue = Number(range);
        }, 300);
      }
    },
    rangeValue(newVal) {
      if (this.rangeFocus) {
        const range = Decimal.div(Number(newVal), 100).toString();
        if (this.type === 1) {
          const dealNum = Decimal.mul(Number(range), Number(this.eosBalance)).toString();
          this.dealNum = toFixed(dealNum, 4);
          const aboutNum = Decimal.div(Number(this.dealNum), this.ramPrice).toString();
          this.aboutNum = toFixed(aboutNum, 2);
          return;
        }
        const dealNum = Decimal.mul(Number(range), Number(this.ramAbleSell)).toString();
        this.dealNum = toFixed(dealNum, 2);
        const aboutNum = Decimal.mul(Number(this.dealNum), this.ramPrice).toString();
        this.aboutNum = toFixed(aboutNum, 4);
      }
    },

    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
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
    handleMouted() {
      this.type = this.$route.params.activeType === 'sell' ? 2 : 1;
      setTimeout(() => {
        this.first = false;
      }, 500);
      this.handleGetLists(); // 获取交易历史
      // 需要定时的接口
      this.handleGetRamPrice();
      this.handleGetEosBalance();
      this.handleGetAccountInfo();
      window.clearInterval(this.balanceTimer);
      this.balanceTimer = window.setInterval(() => {
        this.handleGetRamPrice();
        this.handleGetEosBalance();
        this.handleGetAccountInfo();
      }, 3000);
    },
    // 手机滑动
    handleTouchStart() {
      this.rangeFocus = true;
    },
    handleTouchEnd() {
      this.rangeFocus = false;
    },
    // dealNum 失去焦点
    handleBlur() {
      if (this.type === 2) {
        this.dealNum = toFixed(Number(this.dealNum), 2);
        return
      }
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
    // 点击可用余额 - 带入数量
    handleClickAble() {
      if (this.type === 1) {
        this.dealNum = parseFloat(this.eosBalance);
        return;
      }
      this.dealNum = toFixed(this.ramAbleSell, 2)
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
      return toLocalTime(t).substr(0, 16)
    },
    // 下拉刷新
    loadTop() {
      this.dealNum = '';
      this.aboutNum = '0';
      this.rangeValue = 0;
      this.inputError = false;
      this.page = 1;
      this.handleGetLists();
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      this.handleGetLists();
    },
    // 滑块点击
    handleRangeSet(num) {
      this.rangeFocus = true;
      this.rangeValue = num;
      setTimeout(() => {
        this.rangeFocus = false;
      }, 500);
    },
    // 处理图片加载出错
    handleImgError() {
      this.coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
    },
    // 关闭切换币种
    handleClose(type) {
      this.changeSymbol = false;
      this.changeAccountTip = false;
      this.ramTradeNote = false;
      if (type) {
        setTimeout(() => {
          this.page = 1;
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
        name: 'resourceKlineRam',
        params,
      });
    },
    // 获取交易历史
    handleGetLists() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.allLoaded = true;
          this.list = [];
          if (this.page === 1) {
            this.$refs.loadmore.onTopLoaded();
            return;
          }
          this.$refs.loadmore.onBottomLoaded();
          return;
        }
        const params = {
          account: this.$store.state.app.accountInfo.account,
          page: this.page || 1,
          limit: 10,
        }
        this.$http.post('/eosRamAction/ramorders', params).then((res) => {
          if (res.code !== 0) {
            return;
          }
          const page = res.page;
          if (page.totalPage <= this.page) {
            this.allLoaded = true;
          } else {
            this.allLoaded = false;
          }
          if (this.page === 1) {
            this.list = page.list;
            this.$refs.loadmore.onTopLoaded();
            return;
          }
          this.list.push(...page.list);
          this.$refs.loadmore.onBottomLoaded();
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetLists()
        }, 200);
      }
    },
    // 获取Ram价格
    handleGetRamPrice() {
      const arr = this.$store.state.app.allSymbolData.resources;
      const ramData = arr.filter(item => item.id === 'ram')[0] || [];
      // console.log(ramData, 'ramData');
      // price: 0.1519355
      this.ramPrice = Number(ramData.price).toFixed(4)
      // this.ramPriceAll = ramData.price;
    },
    // 获取账户EOS余额
    async handleGetEosBalance() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.eosBalance = '0.0000';
          return;
        }
        // 正常获取余额
        const params = {
          account: this.$store.state.app.accountInfo.account,
          code: 'eosio.token',
          // coin: 'EOS',
          symbol: this.coin,
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.eosBalance = balance;
        } else {
          this.eosBalance = `0.0000 ${params.coin}`;
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     this.eosBalance = '0.0000';
        //     return;
        //   }
        //   // console.log(data, '账户EOS余额') 968252.1717 SYS 账户EOS余额
        //   this.eosBalance = data.split(' ')[0];
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetEosBalance();
        }, 200);
      }
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
          return;
        }
        axios.post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params)).then((response) => {
          if (response.data.voter_info) {
            this.info = response.data.voter_info;
          }
          this.ramBalance = Decimal.div(response.data.ram_quota, 1024).toString()
          this.ramAbleSell = Decimal.div(Decimal.sub(response.data.ram_quota, response.data.ram_usage), 1024).toString()
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    /* -------- btn 事件分发 -------- */
    // 按钮验证
    handleReg() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain !== 'eos') {
        this.changeAccountTip = true;
        return;
      }
      if (this.type === 1) {
        if (!this.dealNum || Number(this.aboutNum) < 0.01) {
          this.inputError = true;
          this.$toast(`${this.$t('trade.buyTrade')}0.01 KB`);
          return;
        }
        if (Number(this.dealNum) > Number(this.eosBalance)) {
          this.inputError = true;
          this.$toast(this.$t('quotation.low'));
          return;
        }
      } else {
        // if (!this.dealNum || Number(this.aboutNum) === 0) {
        //   this.inputError = true;
        //   this.$toast(`${this.$t('trade.minTrade')}0.01 KB`);
        //   return;
        // }
        if (!this.dealNum || Number(this.dealNum) < 0.01) {
          this.inputError = true;
          this.$toast(`${this.$t('trade.sellTrade')}0.01 KB`);
          return;
        }
        if (Number(this.dealNum) > Number(this.ramBalance)) {
          this.inputError = true;
          this.$toast(this.$t('quotation.low'));
          return;
        }
      }

      this.inputError = false;
      // const ramQuantity = Decimal.sub(Number(this.dealNum), 0.0001).toString();
      const ramQuantity = Number(this.dealNum).toFixed(4)
      this.handleDealBtn(ramQuantity)
    },
    // 事件分发
    handleDealBtn(quant) {
      if (this.type === 1) {
        this.handleBuy(quant)
      } else {
        this.handleSell(quant)
      }
    },
    // 买入
    async handleBuy(quant) {
      // console.log(`${quant} ${this.coin}`);
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{ // 买入RAM
          account: 'eosio',
          name: 'buyram',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            payer: fromName,
            receiver: fromName,
            quant: `${quant} ${this.coin}`,
          },
        }]
      }
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('newpos.toastBuySuccess'));
      this.handleGetRamPrice();
      this.handleGetEosBalance();
      setTimeout(() => {
        this.loadTop();
      }, 500);
      // DApp.eosBuyram(`${quant} ${this.coin}`, (err, res) => {
      //   if (err) {
      //     // this.$toast(`${this.$t('trade.buyTrade')}0.01 KB`);
      //     return;
      //   }
      //   if (res) {
      //     this.$toast(this.$t('newpos.toastBuySuccess'));
      //     this.handleGetRamPrice();
      //     this.handleGetEosBalance();
      //     setTimeout(() => {
      //       this.loadTop();
      //     }, 500);
      //   }
      // });
    },

    // 卖出
    async handleSell(quant) {
      const fixQuant = Decimal.mul(quant, 1024).toFixed(0);
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{ // 卖出RAM
          account: 'eosio',
          name: 'sellram',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            account: fromName,
            bytes: fixQuant,
          },
        }]
      }
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$toast(this.$t('newpos.toastSellSuccess'));
      this.handleGetRamPrice();
      this.handleGetEosBalance();
      setTimeout(() => {
        this.loadTop();
      }, 500);
      // DApp.eosSellram(fixQuant, (err, res) => {
      //   if (err) {
      //     // this.$toast(`${this.$t('trade.sellTrade')}0.01 KB`);
      //     return;
      //   }
      //   if (res) {
      //     this.$toast(this.$t('newpos.toastSellSuccess'));
      //     this.handleGetRamPrice();
      //     this.handleGetEosBalance();
      //     setTimeout(() => {
      //       this.loadTop();
      //     }, 500);
      //   }
      // });
    },
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
    height: calc(100vh - 1.6rem) !important;
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

    .priceDiv{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .5rem;
      height: .72rem;

      .inputDiv{
        box-sizing: border-box;
        padding: 0 .24rem;
        height: 100%;
        min-width: 5.48rem;
        max-width: 5.48rem;
        background: #F3F3F3;
        border: 1px solid #C7C7C7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .0662rem;
        color: #A9A8AF;
        font-size: .28rem;
      }
    }

    .countDiv{
      margin-top: .45rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: .72rem;

      .inputDiv{
        background: #FFF;
        box-sizing: border-box;
        padding: 0 .24rem;
        height: 100%;
        min-width: 5.48rem;
        max-width: 5.48rem;
        border: 1px solid #C7C7C7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: .0662rem;
        color: #A9A8AF;
        font-size: .28rem;

        &.error{
          border: 1px solid $color-red;
        }

        input{
          height: 100%;
          width: 100%;
          font-size: .28rem;
        }
      }
    }

    .aboutPrice{
      display: flex;
      justify-content: flex-end;
      font-size: .25rem;
      margin-top: .15rem;
      margin-right: .25rem;
      color: $color-999;
    }

    .range{
      margin-top: .2rem;
      position: relative;

      &.sellRange{
        /deep/ .mt-range-progress{
          background-color: $color-red !important;
        }

        .border-green{
          border-color: $color-red !important;
        }
      }

      /deep/ .mt-range{
        height: .5rem;
        line-height: .5rem;

        .mt-range-content{
          margin-right: .3rem;
        }

        .mt-range-runway{
          right: -0.05rem;
        }

        .mt-range-thumb{
          width: .5rem;
          height: .5rem;
          z-index: 10;
        }

        .mt-range-progress{
          background-color: $color-green;
        }
      }

      .desc{
        display: flex;
        align-items: center;/*垂直居中*/
        position: absolute;
        width: 100%;
        height: .50rem;
        z-index: 1;
        line-height: .5rem;

        &>span{
          flex: 1;
          height: .4rem;
          display: flex;
          align-items: center;/*垂直居中*/
          text-align: right;

          .before{
            display: inline-block;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            transform: translate(-50%, 0);
            background: #ffffff;

            &.border-green{
              border-color: $color-green;
            }
          }

          &:nth-child(2) .before{
            transform: translate(-25%, 0);
          }
          &:nth-child(1) .before{
            transform: translate(0, 0);
          }

          .last{
            background: #ffffff;
            border: 2px solid $color-999;
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
            position: absolute;
            right: 0px;
          }

        }
      }
    }

    .ableTradeDiv{
      display: flex;
      justify-content: space-between;
      font-size: .25rem;
      color: $color-999;
      margin-top: .24rem;
    }

    .btn{
      background: $color-green;
      height: .84rem;
      color: #FFF;
      border-radius: .1rem;
      margin-top: .6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &.bgColor-red{
        background: $color-red;
      }
      &.bgColor-999{
        background: $color-999 !important;
      }
    }

    .btnBottom{
      margin-top: .24rem;
      font-size: .25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .buyInStaked{
        color: $color-this;
      }

      .ramTip{
        color: $color-999;
        display: flex;
        align-items: center;

        .question{
          font-size: .25rem;
          margin-left: .09rem;
        }
      }
    }
  }

  .history{
    .subTitle{
      height: .74rem;
      background: #FAFAFA;
      display: flex;
      align-items: center;
      padding-left: .24rem;
      font-size: .25rem;
    }

    .lists{
      background: #fafafa;

      .noMore{
        text-align: center;
        padding-bottom: .2rem;
        font-size: .25rem;
      }

      .noData{
        margin-top: .5rem;
        margin-bottom: .5rem;
        text-align: center;
        color: $color-999;
        background: #FFF;

        img{
          width: 1.8rem;
        }

        .tip{
          font-size: .25rem;
          margin-top: .2rem;
        }
      }

      .item{
        margin-bottom: .2rem;
        background: #FFF;
        padding: .29rem .24rem .29rem;

        .info{
          display: flex;
          align-items: center;
          margin-bottom: .28rem;

          .type{
            color: $color-green;
            margin-right: .15rem;
            font-size: .32rem;
          }

          .ramCoin{
            font-size: .3rem;
            margin-right: .5rem;
          }

          .date{
            color: $color-999;
            font-size: .25rem;
          }
        }

        .data{
          margin-top: .21rem;
          display: flex;
          align-items: center;

          &>div{
            flex: 1;
            font-size: .25rem;

            .itemtitle{
              font-size: .25rem;
              color: $color-999;
            }

            .num{
              font-size: .3rem;
              margin-top: .02rem;
            }

            &.trxDiv{
              display: flex;
              align-items: center;

              .trxId{
                margin-left: .08rem;
                max-width: 2rem;
                overflow: hidden;
                word-break: normal;
                text-overflow: ellipsis;
                color: $color-this;
              }
            }
          }
        }
      }
    }
  }
}
.changeAccountTip{
  border-radius: .1rem;
  background: transparent;
  // top: 30%;
  // transform: translate(-50% -30%);
}
</style>
