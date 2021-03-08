<template>
  <div class="symbolDetail">
    <div class="top">
      <div class="img">
        <img :src="coinUrl" alt="" width="100%">
      </div>
      <div class="coin">
        <div class="coinName">{{ coin }}</div>
        <div class="coinName color-this" v-if="showCoin" @click="tipCoin = true" >{{$t('lineK.about',{title:coinTitle})}} > </div>
      </div>
    </div>
    <!-- 关于EOSDT > start-->
     <mt-popup
      class="popup"
      v-model="tipCoin">
        <about-coin v-if="tipCoin" :coinTitle='coinTitle' @listenClose="handleClose"  />
    </mt-popup>
    <!-- 关于EOSDT > end-->

    <div class="center">
      <span v-if="data.introduction">{{ data.introduction }}</span>
      <span v-if="!data.introduction">
        <div>{{ $t('lineK.noDetail') }}</div>
        <!-- <div>
          {{ $t('lineK.addDetail1') }}
          <span class="color-this">newdex.io</span>
          {{ $t('lineK.addDetail2') }}
        </div> -->
      </span>
    </div>

    <div class="bottom">
      <div class="bottomTitle">{{ $t('lineK.base') }}</div>
      <div class="info">
        <div class="item" v-if="$appName === 'eosNewdex'">
          <span class="tip">{{ $t('lineK.issueNum') }}</span>
          <span @click="handleToBrowser(`${data.code}-${data.chain}-${data.contract}`, data.chain, 'token')">{{ data.publishCount }}</span>
        </div>

        <!-- <div class="item">
          <span class="tip">{{ $t('lineK.circulationPercent') }}</span>
          <span>10%</span>
        </div> -->
        <div class="item" v-if="$appName === 'eosNewdex'">
          <span class="tip">{{ $t('lineK.circulationNum') }}</span>
          <span @click="handleToBrowser(`${data.code}-${data.chain}-${data.contract}`, data.chain, 'token')">{{ data.circulateCount }}</span>
        </div>
        <!-- 关于流通市值 start -->
        <div v-if="$appName !== 'tronNewdex'" class="item" @click="handleShowMark">
          <span class="tip">{{ $t('lineK.marketValue') }}</span>
          <span v-if="$store.state.app.language !== 'zh-CN'">
            <span v-if="marketValue >1000000">${{ handleToW(marketValue, 1000000)}} Million</span>
            <span v-else>${{handleToW(marketValue, 1)}}</span>
            <!-- <span v-else>$ {{marketValue}}</span> -->
          </span>
          <span v-else>
            <span v-if="marketValue >10000">￥{{ handleToW(marketValue, 10000)}}万</span>
            <span v-else>￥{{handleToW(marketValue, 1)}}</span>
          </span>
          <i class="iconfont icon-huaban31 copyIcon color-333"></i>
        </div>
        <!-- 关于流通市值 end -->
        <!-- <div class="item">
          <span class="tip">{{ $t('lineK.changePercent') }}</span>
          <span>10%</span>
        </div> -->
        <!-- <div class="item">
          <span class="tip">{{ $t('lineK.total') }}</span>
          <span>0.05亿</span>
        </div> -->
        <div class="item" v-if="$appName === 'eosNewdex'">
          <span class="tip">{{ $t('lineK.contract') }}</span>
          <span @click="handleToBrowser(data.contract, data.chain, 'account')">{{ data.contract }}</span>
        </div>
        <div class="item" v-else-if="$appName === 'tronNewdex'">
          <span class="tip">{{ $t('tronNewdex.contractAddress') }}</span>
          <span @click.stop="handleToBrowser(`${data.code}-${data.chain}-${data.contract}`, data.chain, 'token')">
            {{ handleDealLongStr(data.contract) }}</span>
          <span class="color-this iconfont icon-huaban119 copyIcon"
            v-clipboard:copy="data.contract"
            v-clipboard:success="handleCopy"
            v-clipboard:error="handleCopyError"></span>
        </div>
        <div class="item">
          <span class="tip">{{ $t('lineK.officialNet') }}</span>
          <span>
            <a :href="data.dappLinkUrl ? data.dappLinkUrl : data.website" target="_blank" class="color-333">{{ data.website }}</a>
          </span>
        </div>
      </div>
      <div class="link">
        <!-- <div>
          <span class="tip">{{ $t('lineK.officialNet') }}</span>
          <span><a :href="data.website">{{ data.website }}</a></span>
        </div> -->
        <!-- <div>
          <span class="tip">{{ $t('lineK.officialNet') }}</span>
          <span><a href="https://www.abc.io/">https://www.abc.io/</a></span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// JS
// import Io from '@/utils/socket/index';
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';
// import { EosJsInit } from '@/utils/wallet/scatter';
import { dealLongStr, toBrowser, parseSymbol } from '@/utils/public';
import axios from 'axios';
import AboutCoin from '../popup/AboutCoin'

export default {
  data() {
    return {
      data: {
        id: 65,
        code: '-',
        name: '-',
        contract: '-',
        publishCount: '-',
        circulateCount: '-',
        marketValueRank: null,
        circulateValue: null,
        turnoverRate: null,
        icoCost: null,
        website: '-',
        introduction: '',
        status: 1,
        coinDecimal: 4,
        priceDecimal: 6,
        incomeChargeRate: 0,
        expenseChargeRate: 0,
        imageUrl: '-',
        dappLinkUrl: null,
      },
      showCoin: false, // 显示关于EOSDT >
      tipCoin: false, // 弹窗关于EOSDT >
      coinTitle: '', // 关于EOSDT,CUSD名称
      timer: null,
      marketValue: '-', // 关于流通市值
      coinUrl: '',
    }
  },
  components: {
    AboutCoin,
    mtPopup: Popup
  },
  props: [
    'coin',
    'coinImgUrl',
    'symbol2',
    'symbolData'
  ],
  mounted() {
  },
  watch: {
    coinImgUrl: {
      handler: function listen3() {
        if (this.coin === 'EOS') {
          this.coinUrl = 'https://ndi.340wan.com/eos/eosio.token-eos.png';
          return;
        }
        this.coinUrl = this.coinImgUrl;
      },
      immediate: true
    },
    '$store.state.app.trad.timer': function change() {
      this.handleGetCoinInfo()
    },
    'symbolData.price': function listen1() {
      this.handleMarketValue()
    },
    '$store.state.app.exchangeRate': {
      handler: function listen2() {
        this.handleMarketValue()
      },
      deep: true,
    }
  },
  beforeDestroy() {
    window.clearTimeout(this.timer)
  },
  methods: {
    // 关闭关于EOSDT弹窗
    handleClose() {
      this.tipCoin = false
    },
    // 流通市值
    handleMarketValue() {
      // 加了半秒延迟解决值返回慢的问题
      const exchangeRate = this.$store.state.app.exchangeRate
      const symbol = parseSymbol(this.$route.params.symbol, this.data.contract)[2];
      const rate = exchangeRate[symbol]
      const price = this.symbolData.price
      const circulateCount = this.data.circulateCount
      const resultPrice = Decimal.mul(Number(price), Number(rate))
      // console.log(exchangeRate, this.symbolData, price, rate, symbol, exchangeRate[symbol], circulateCount, resultPrice);
      // console.log(price, circulateCount, 'xxxxxxxzzzz')
      this.marketValue = Decimal.mul(Number(circulateCount), Number(resultPrice))
    },
    // 按W统计
    handleToW(n, m) {
      if (n === '-') {
        return '-'
      }
      return Decimal.div(Number(n), Number(m)).toFixed(2);
    },
    // 流通市值
    handleShowMark() {
      this.$emit('handleShowMark', true)
    },
    handleGetCoinInfo() {
      const params = {
        symbol: this.$route.params.symbol,
      }
      this.$http.post('/coinInfo/getBySymbol', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        if (!res.exchangeCoinInfo) {
          return;
        }
        this.data = res.exchangeCoinInfo;
        const { contract, code } = this.data
        if (contract === 'eosio.token' && code === 'EOS') {
          this.showCoin = true
          this.coinTitle = this.symbol2
        }
        this.handleMaxCoin();
      });
    },
    handleMaxCoin() {
      if (this.$appName !== 'eosNewdex') {
        this.handleMaxCoinTron()
        return
      }
      const routeSymbolArr = parseSymbol(this.$route.params.symbol, this.data.contract);
      const symbol1 = routeSymbolArr[1].toUpperCase();
      const params = {
        code: routeSymbolArr[0],
        symbol: symbol1,
      };
      // 获取不同链的币种流通量
      let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
      const chain = this.$store.state.app.trad.baseChain || 'eos';
      if (this.$store.state.app.trad && chain !== 'eos') { // 非eos链数据
        nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
      }
      axios.post(`${nodeHttp}/v1/chain/get_currency_stats`, JSON.stringify(params), {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        }
      }).then((result) => {
        if (result.status !== 200 && result.status !== 304) {
          return;
        }
        const res = result.data;
        this.data.publishCount = this.data.publishCount || parseInt(res[params.symbol].max_supply, 10);
        this.data.circulateCount = this.data.circulateCount || parseInt(res[params.symbol].supply, 10);
        this.handleMarketValue()
      }).catch((error) => { // 错误处理
        console.log(error); // eslint-disable-line
      })
    },
    handleDealLongStr(str) {
      return dealLongStr(str)
    },
    handleMaxCoinTron() {
      try {
        let contract = this.$store.state.app.trad.symbol1_code;
        contract = 'TZGQJY1QbZuXJmMgDgoZVeG4mD1Ef6SdWU';
        const len = contract.length;
        const type = len === 34 ? 'trc20' : 'trc10';
        let url = `https://apilist.tronscan.org/api/token_trc20?contract=${contract}&showAll=1`;
        if (type === 'trc10') {
          url = `https://apilist.tronscan.org/api/token?id=${contract}&showAll=1`;
        }
        axios.get(url, {
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
          }
        }).then((result) => {
          if (result.status === 200) {
            if (type === 'trc10' && result.data.data.length > 0) {
              const data = result.data.data[0];
              // 发行量
              this.data.publishCount = data.totalSupply;
              // this.data.publishCountHref = `https://tronscan.org/#/token/${code}`
            }
            if (type === 'trc20' && result.data.trc20_tokens.length > 0) {
              const data = result.data.trc20_tokens[0];
              // 发行量
              this.data.publishCount = Number(data.total_supply_with_decimals) / (10 ** data.decimals);
            }
          }
        })
      } catch (error) {
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(() => {
          this.handleMaxCoinTron();
        }, 200);
      }
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
    // 去浏览器
    handleToBrowser(id, chain, type) {
      // const id = `${this.data.code}-${this.data.chain}-${this.data.contract}`;
      // const chain = this.data.chain;
      // const type = 'token';
      if (type === 'token' && chain !== 'eos' && chain !== 'tron') {
        return;
      }
      toBrowser(id, chain, type, this.$embed);
    },
  },

}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.symbolDetail{
  background: #fff;
  padding: 0px .25rem;

  .copyIcon{
    font-size: .26rem;
    margin-left: .05rem;
    color: #A8D0FF;
  }

  .top{
    padding: .2rem 0px 0rem 0px;
    display: flex;
    align-items: center;/*垂直居中*/

    .img{
      width: .7rem;
      height: .7rem;
    }

    .coin{
      padding: .2rem;
      display: flex;
      flex: 1;
      justify-content: space-between;

      .coinName{
        font-size: .29rem;
      }
    }
  }

  .center{
    padding: .1rem 0px .24rem 0px;
    border-bottom: 1px solid $color-e3e3e3;
  }

  .bottom{
    padding: .2rem .17rem;
    font-size: .25rem;

    .tip{
      color: $color-999;
      margin-right: .3rem;
    }

    .bottomTitle{
      font-size: .29rem;
    }

    .info{
      margin-top: .1rem;
      display: flex;
      align-items: center;/*垂直居中*/
      flex-wrap: wrap;

      .item{
        width: 100%;
        // height: .5rem;
        line-height: .5rem;

        // &:nth-child(2n){
        //   text-align: center;
        // }
      }
    }

    .link{
      margin-top: .5rem;
    }
  }
}

</style>
