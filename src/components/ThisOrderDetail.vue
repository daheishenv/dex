<template>
  <div class="detailDiv item">
    <div class="itemTitle">
      <!-- 交易对 -->
      <div class="symbol">
        <!-- <span class="color-red" v-if="order.direction === 2">{{ $t('public.sellShort') }}</span>
        <span class="color-green" v-if="order.direction === 1">{{ $t('public.buyShort') }}</span>
        <span class="coin" @click="handleToTrade(order)">{{ order.symbol1 }}/{{ order.symbol2 }}</span> -->
        <span class="time tip">{{ toLocalTime(order.orderTime) }}</span>
        <span class="orderTime">{{ $t('order.entrust') }}</span>
      </div>

      <!-- status -->
      <div class="status">
        <span v-if="order.dealStatus === 0 && order.orderStatus === 0"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status') }}</span>
        <span v-if="order.dealStatus === 0 && order.orderStatus === 2" class="color-333">{{ $t('order.status3') }}</span>
        <span v-if="order.dealStatus === 1 && order.orderStatus === 0"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status1') }}</span>
        <span v-if="order.dealStatus === 1 && order.orderStatus === 2"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status4') }}</span>
        <span v-if="order.dealStatus === 2"
          :class="{'color-green': order.direction === 1,'color-red': order.direction === 2}">{{ $t('order.status2') }}</span>
      </div>
    </div>

    <!-- showContent -->
    <div class="showContent">
      <div class="textLeft">
        <div class="tip">{{ $t('public.myPrice') }}
          <span class="tradeCoin"
          >({{ order.symbol2 }})
          </span>
        </div>
        <div class="num" v-if="order.type === 1">{{ order.orderPriceStr }}</div>
        <div class="num" v-if="order.type === 2">{{ $t('quotation.market') }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.count') }}
          <span class="tradeCoin"
          >({{ order.symbol1 }})
          </span>
        </div>
        <div class="num">{{ order.orderCountStr || '—' }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.dealCount') }}
          <span class="tradeCoin"
          >({{ order.symbol1 }})
          </span>
        </div>
        <div class="num">{{ order.dealCountStr || '—' }}</div>
      </div>
    </div>
    <div class="showContent" style="margin-top: .2rem;">
      <div class="textLeft">
        <div class="tip">{{ $t('public.dealAveragePrice') }}
          <span class="tradeCoin"
          >({{ order.symbol2 }})
          </span>
        </div>
        <div class="num">{{ order.dealPriceStr }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('order.dealTotal') }}
          <span class="tradeCoin"
          >({{ order.symbol2 }})
          </span>
        </div>
        <div class="num">{{ order.dealAmountStr || '—' }}</div>
      </div>
      <div class="">
        <div class="tip">{{ $t('public.charge') }}
          <span class="tradeCoin"
          >({{ order.direction === 1 ? order.symbol1 : order.symbol2 }})
          </span>
        </div>
        <div class="num" v-if="order.direction === 1">{{ order.totalBidFees || '—'}}</div>
        <div class="num" v-if="order.direction === 2">{{ order.totalAskFees || '—'}}</div>
      </div>
    </div>
    <!-- 交易详情列表 -->
    <div class="hiddenContent">
      <div class="subList" v-for="(list, i) in order.orderDealRecords" :key="i">
        <!-- TxID start -->
        <div v-if="$appName === 'eosNewdex'">
          <div class="txid" v-if="order.direction === 2">
            <span class="subName">TrxID</span>
            <span class="subTxid overflow color-999"
              :class="{'color-this': list.askTrxId && list.askTrxId.indexOf('*') === -1}"
              v-if="list.askTrxId"
              @click="handleToTx(list.askTrxId, list.bidChain)">{{ list.askTrxId }}</span>
            <span v-if="!list.askTrxId">—</span>
          </div>
          <div class="txid" v-if="order.direction === 1">
            <span class="subName">TrxID</span>
            <span class="subTxid overflow color-999"
              :class="{'color-this': list.bidTrxId && list.bidTrxId.indexOf('*') === -1}"
              v-if="list.bidTrxId"
              @click="handleToTx(list.bidTrxId, list.askChain)">{{ list.bidTrxId }}</span>
            <span v-if="!list.bidTrxId">—</span>
          </div>
        </div>
        <!-- TxID end -->
        <!-- 波场 - 成交时间 start -->
        <div class="hex" v-else-if="$appName === 'tronNewdex'">
          <span class="subName">{{ $t('lineK.dealHash') }}</span>
          <span class="subTxid overflow" v-if="order.direction === 2"
            @click="handleToTx(list.askTrxId, list.bidChain)">{{ list.askTrxId }}</span>
          <span v-else @click="handleToTx(list.bidTrxId, list.askChain)">{{ list.bidTrxId }}</span>
        </div>
        <!-- 波场 - 成交时间 end -->

        <div class="showContent">
          <div class="textLeft">
            <div class="tip subTool">{{ $t('public.dealPrice') }}
              <span class="tradeCoin"
              >({{ order.symbol2 }})
              </span>
            </div>
            <div class="subNum">{{ list.dealPriceStr }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.dealCount') }}
              <span class="tradeCoin"
              >({{ order.symbol1 }})
              </span>
            </div>
            <div class="subNum">{{ list.dealCountStr }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('order.dealTotal') }}
              <span class="tradeCoin"
              >({{ order.symbol2 }})
              </span>
            </div>
            <div class="subNum">{{ list.dealAmountStr }}</div>
          </div>
        </div>

        <div class="showContent mt10">
          <div class="textLeft">
            <div class="tip subTool" v-if="$appName === 'eosNewdex'">{{ $t('public.dealAccount') }}</div>
            <div class="tip subTool" v-else-if="$appName === 'tronNewdex'">{{ $t('lineK.address') }}</div>
            <div class="subNum color-999"
              :class="{'color-this': list.askTrxId && list.askTrxId.indexOf('*') === -1}"
              v-if="order.direction === 1"
              @click="handleToAccount(list.askAccountNo, list.askChain)">{{ handleDealLongStr(list.askAccountNo) }}</div>
            <div class="subNum color-999"
              :class="{'color-this': list.bidTrxId && list.bidTrxId.indexOf('*') === -1}"
              v-if="order.direction === 2"
              @click="handleToAccount(list.bidAccountNo, list.bidChain)">{{ handleDealLongStr(list.bidAccountNo) }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.dealTime') }}</div>
            <div class="subNum">{{ toLocalTime(list.updateTs).substr(5, 11) }}</div>
          </div>
          <div class="">
            <div class="tip subTool">{{ $t('public.charge') }}
              <span class="tradeCoin"
              >({{ order.direction === 1 ? order.symbol1 : order.symbol2 }})
              </span>
            </div>
            <div class="subNum" v-if="order.direction === 2">{{ list.askChargeStr }}</div>
            <div class="subNum" v-if="order.direction === 1">{{ list.bidChargeStr }}</div>
          </div>
        </div>
        <div class="showContent mt10">
          <!-- 成交渠道 -->
          <div class="textLeft">
            <div class="tip subTool">{{$t('marketDistribution.channel')}}</div>
            <div class="subNum" v-if="Number(list.swapType) === 0">Newdex</div>
            <div class="subNum" v-else-if="Number(list.swapType) === 1">Defibox</div>
            <div class="subNum" v-else-if="Number(list.swapType) === 2">Defis</div>
            <div class="subNum" v-else>Newdex</div>
          </div>
        </div>
      </div>

    </div>
    <div class="contract">
      <span class="toTrade color-this" @click="handleTolinek(order)">{{ $t('property.toTransaction') }}</span>
      <div v-if="$appName === 'eosNewdex'">
        {{ $t('quotation.contract') }}:<span class="contractStr">{{ parseSymbol(order.symbol, order.valuationCoinContract)[0] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalTime, toBrowser, dealLongStr, parseSymbol } from '@/utils/public';
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      order: {},
    }
  },
  props: [
  ],
  components: {
  },
  watch: {
  },
  created() {
    this.order = this.$store.state.app.detail;
    this.handleRowDetail();
  },
  mounted() {
  },
  methods: {
    handleDealLongStr(str) {
      return dealLongStr(str);
    },
    // 跳转到k线页
    handleTolinek(item) {
      // sessionStorage.setItem('backRoute', this.$route.path);
      const params = {
        symbol: item.symbol.toLowerCase(),
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 跳转到交易对
    handleToTrade(item) {
      const params = {
        symbol: item.symbol,
      }
      this.$router.push({
        name: 'trade',
        params,
      });
    },
    // 时间转化
    toLocalTime(time) {
      return toLocalTime(time)
    },
    // 查询账户
    handleToAccount(account, chain) {
      if (account.indexOf('*') !== -1) {
        return;
      }
      toBrowser(account, chain, 'account', this.$embed);
    },
    // 查询Tx
    handleToTx(id, chain) {
      if (id.indexOf('*') !== -1) {
        return;
      }
      toBrowser(id, chain, 'tx', this.$embed);
    },
    // 订单详情
    handleRowDetail() {
      const params = {
        orderId: this.$route.params.id,
        aggOid: this.$route.params.aggOid,
      }
      this.$http.get('/order/getOrderDealRecords', { params }).then((res) => {
        if (res.code !== 0) {
          Toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$set(this.order, 'orderDealRecords', res.orderDealRecords);
        this.order.totalAskFees = res.totalAskFees;
        this.order.totalBidFees = res.totalBidFees;
      });
    },
    parseSymbol(a, b) {
      return parseSymbol(a, b)
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.tradeCoin{
  font-size: .21rem;
}

.tip{
  font-size: .25rem;
  color: $color-999;
}

.mt10{
  margin-top: .1rem;
}

.item{
  font-size: .3rem;
  background: #fff;
  padding: .24rem .36rem;

  .itemTitle{
    margin-bottom: .3rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: space-between;/*水平居中*/

    // &>div{
    //   // flex: 2;
    // }

    .symbol{
      .coin{
        margin-left: .28rem;
        margin-right: .5rem;
      }

      .orderTime{
        font-size: .25rem;
        // margin-right: .1rem;
      }

      .time{
        font-size: .25rem;
        color: $color-333;
      }
    }

    .status{
      // flex: 2;
      // max-width: 2.3rem;
      text-align: right;
      // min-width: 3.1rem;
      font-size: .25rem;
      color: $color-999;
    }
  }

  .showContent{
    display: flex;
    // align-items: center;/*垂直居中*/

    .textLeft{
      padding-left: .42rem;
      text-align: left;
    }

    &>div{
      flex: 3;
      text-align: right;
      margin-right: .1rem;

      &:last-child{
        margin-right: 0rem;
      }
    }

    .num{
      // height: .45rem;
      line-height: .45rem;
    }

    .tools{
      margin-right: 0rem;
      font-size: .25rem;
      flex: 1;
    }
  }

  .hiddenContent{
    margin-top: .12rem;

    .textLeft{
      padding-left: 0px;
    }

    .subList{
      background-color: #fafafa;
      border-radius: .08rem;
      padding: 0px .33rem;
      margin-bottom: .12rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .subTool{
        line-height: .5rem;
      }

      .subNum{
        font-size: .25rem;
        line-height: .5rem;

        &.overflow{
          max-width: 1.64rem;
          overflow: hidden;
          word-break: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .txid{
      display: flex;
      align-items: center;/*垂直居中*/
      height: .84rem;
      border-bottom: 1px solid $color-e3e3e3;

      .subName{
        color: $color-999;
        margin-right: .1rem;
      }

      .subTxid{
        display: inline-block;
        overflow: hidden;
        word-break: normal;
        text-overflow: ellipsis;
      }
    }

    .tronTime{
      display: flex;
      align-items: center;
      font-size: .25rem;
      height: .84rem;
      &>span:last-child{
        margin-left: .25rem;
      }
    }

    .hex{
      display: flex;
      align-items: center;
      height: .84rem;
      color: $color-999;
      font-size: .25rem;

      .subName{
        color: $color-999;
        margin-right: .1rem;
      }

      &>span:last-child{
        width: 4rem;
        color: $color-this;
        margin-left: .25rem;
        display: inline-block;
        overflow: hidden;
        word-break: normal;
        text-overflow: ellipsis;
      }
    }

  }

  .contract{
    font-size: .25rem;
    margin-top: .2rem;
    display: flex;
    justify-content: space-between;

    .toTrade {
      padding-left: .3rem;
    }

    .contractStr{
      font-size: .27rem;
      padding-left: .08rem;
    }
  }
}
</style>
