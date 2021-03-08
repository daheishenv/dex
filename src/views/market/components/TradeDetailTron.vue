<template>
  <div class="detail">
    <!-- 关闭按钮 -->
    <span class="iconfont icon-huaban17 close" @click="listenClose"></span>
    <!-- 交易对标题 -->
    <div class="title">{{ symbol }}{{ $t('order.detailTitle')}}</div>
    <!-- 交易基本信息 -->
    <div class="tradeInfo">
      <div class="item">
        <div class="subTitle">{{ $t('public.dealPrice') }}<span class="unit">({{ symbol2 }})</span></div>
        <div class="num">{{ detail.dealPriceStr }}</div>
      </div>
      <div class="item">
        <div class="subTitle">{{ $t('public.dealCount') }}<span class="unit">({{ symbol1 }})</span></div>
        <div class="num">{{ detail.dealCountStr }}</div>
      </div>
      <div class="item">
        <div class="subTitle">{{ $t('lineK.successAmount') }}<span class="unit">({{ symbol2 }})</span></div>
        <div class="num">{{ detail.dealAmountStr }}</div>
      </div>
      <div class="item">
        <div class="subTitle">{{ $t('public.dealTime') }}</div>
        <div class="num">{{ detail.dealTime ? toLocalTime(detail.dealTime) : '-' }}</div>
      </div>
    </div>
    <!-- 交易方 - 买方 -->
    <div class="buyInfo">
      <div class="direction color-green">{{ $t('lineK.buyer') }}</div>
      <div>
        <span class="label">{{ $t('lineK.address') }}：</span>
        <span class="color-this" @click="handleToAccount(detail.bidAccountNo, detail.bidChain)">{{dealLongStr(detail.bidAccountNo)}}</span>
      </div>
      <div v-if="buyAnonymous">
        <span class="anonymous">
          <span class="position">
            <span>{{ $t('anonymous.anonymousCondition') }}</span>
            <span class="toUpperVip" @click="handleToUpper">{{ $t('anonymous.openAnonymous') }}></span>
          </span>
        </span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealCount') }}：</span>
        <span class="num">{{ detail.bidSettleStr }} {{ symbol1 }}</span>
      </div>
      <div>
        <span class="label" v-if="!detail.bidSaveChargeStr">{{ $t('public.charge') }}：</span>
        <span class="label" v-if="detail.bidSaveChargeStr">{{ $t('lineK.charge') }}：</span>
        <span class="num">{{ detail.bidChargeStr }} {{ symbol1 }}</span>
      </div>
      <div v-if="false">
        <span class="label">{{ $t('lineK.saveCharge') }}：</span>
        <span class="num">{{ detail.bidSaveChargeStr || 0 }} {{ symbol1 }}</span>
      </div>
      <!-- 矿工费： -->
      <div v-if="false">
        <span class="label">{{ $t('tronNewdex.minersFee') }}：</span>
        <span class="num">{{ detail.bidSaveChargeStr || 0 }} TRX</span>
        <div style="margin-left:0.1rem" :class="{triangle:isExplain}" @click="isExplain= !isExplain">
          <i class="iconfont icon-huaban31 triTcon"></i>
        </div>
      </div>
      <div class="explainBox" v-if="isExplain">
        <div class="explain">{{ $t('tronNewdex.aboutMinersFee') }}＞</div>
      </div>
      <div>
        <span class="label">{{ $t('lineK.tradeHash') }}：</span>
        <span @click="handleToTx(detail.bidOrderTrxId, detail.bidChain)"
          :class="{'color-this': detail.bidOrderTrxId && detail.bidOrderTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.bidOrderTrxId || '-' }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealHash') }}：</span>
        <span @click="handleToTx(detail.bidTrxId, detail.askChain)"
          :class="{'color-this': detail.bidTrxId && detail.bidTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.bidTrxId || '-' }}</span>
      </div>
    </div>
    <!-- 交易方 - 卖方 -->
    <div class="buyInfo">
      <div class="direction color-red">{{ $t('lineK.seller') }}</div>
      <div>
        <span class="label">{{ $t('lineK.address') }}：</span>
        <span class=" color-this" @click="handleToAccount(detail.askAccountNo, detail.askChain)">{{dealLongStr(detail.askAccountNo)}}</span>
      </div>
      <div v-if="sellAnonymous" @click="sellAnonymous = !sellAnonymous">
        <span class="anonymous">
          <span class="position">
            <span>{{ $t('anonymous.anonymousCondition') }}</span>
            <span @click.stop="handleToUpper" class="toUpperVip">{{ $t('anonymous.openAnonymous') }}></span>
          </span>
        </span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealCount') }}：</span>
        <span class="num">{{ detail.askSettleStr }} {{ symbol2 }}</span>
      </div>
      <div>
        <span class="label" v-if="!detail.askSaveChargeStr">{{ $t('public.charge') }}：</span>
        <span class="label" v-if="detail.askSaveChargeStr">{{ $t('lineK.charge') }}：</span>
        <span class="num">{{ detail.askChargeStr }} {{ symbol2 }}</span>
      </div>
      <!-- 节省手续费 -->
      <div v-if="false">
        <span class="label">{{ $t('lineK.saveCharge') }}：</span>
        <span class="num">{{ detail.askSaveChargeStr || 0 }} {{ symbol2 }}</span>
      </div>
      <!-- 矿工费： -->
      <div v-if="false">
        <span class="label">{{ $t('tronNewdex.minersFee') }}：</span>
        <span class="num" >{{ detail.bidSaveChargeStr || 0 }} TRX</span>
        <div style="margin-left:0.1rem" :class="{triangle:isExplain2}" @click="isExplain2= !isExplain2">
          <i class="iconfont icon-huaban31 triTcon" ></i>
        </div>
      </div>
      <div class="explainBox" v-if="isExplain2">
        <div class="explain">{{ $t('tronNewdex.aboutMinersFee') }}＞</div>
      </div>
      <div>
        <span class="label">{{ $t('lineK.tradeHash') }}：</span>
        <span @click="handleToTx(detail.askOrderTrxId, detail.askChain)"
          :class="{'color-this': detail.askOrderTrxId && detail.askOrderTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.askOrderTrxId || '-' }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealHash') }}：</span>
        <span @click="handleToTx(detail.askTrxId, detail.bidChain)"
          :class="{'color-this': detail.askTrxId && detail.askTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.askTrxId || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalTime, toBrowser, dealSymbolSplit, dealLongStr } from '@/utils/public';

export default {
  data() {
    return {
      symbol: null,
      symbol1: null,
      symbol2: null,
      buyAnonymous: false,
      sellAnonymous: false,
      isExplain: false, // 第一个显示关于矿工费说明＞
      isExplain2: false, // 第二个显示关于矿工费说明＞
      detail: {
        dealPriceStr: '-.----',
        dealCountStr: '-.----',
        dealAmountStr: '-.----',
        dealTime: '',

        askAccountNo: '-',
        askChargeStr: '-',
        bidOrderTrxId: '-',
        bidTrxId: '-',
        bidSettleStr: '-',
        bidChain: 'eos',

        bidAccountNo: '-',
        bidChargeStr: '-',
        askOrderTrxId: '-',
        askTrxId: '-',
        askSettleStr: '-',
        askChain: 'eos',

      },
    }
  },
  props: [
    'id',
  ],
  mounted() {
    const obj = dealSymbolSplit(this.$route.params.symbol.toUpperCase())
    this.symbol = (`${obj.symbol1}/${obj.symbol2}`).toUpperCase();
    this.symbol1 = obj.symbol1.toUpperCase();
    this.symbol2 = obj.symbol2.toUpperCase();
    this.handleGetTradeInfo();
  },
  methods: {
    // 关闭
    listenClose() {
      this.$emit('listenClose', false);
    },
    // 查询
    handleGetTradeInfo() {
      const params = {
        id: this.id,
      }
      this.$http.post('/order/getDealDetailById', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.detail = res.dealDetail;
      });
    },
    // 查询账户
    handleToAccount(account, chain) {
      if (account.indexOf('*') !== -1) {
        return;
      }
      toBrowser(account, chain, 'account');
    },
    // 查询trxid
    handleToTx(id, chain) {
      if (id.indexOf('*') !== -1) {
        return;
      }
      toBrowser(id, chain, 'tx');
    },
    // 时间转化
    toLocalTime(time) {
      return toLocalTime(time)
    },
    dealLongStr(val) {
      return dealLongStr(val)
    },
    // 去升级
    handleToUpper() {
      this.$router.push({
        name: 'anonymous'
      });
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.vip{
  font-size: .2rem;
  color: #b7b7b7;
  opacity: .6;
}

.close{
  position: absolute;
  right: .15rem;
  top: .15rem;
  font-size: 0.2rem;
  color: $color-999;
}


.detail{
  width: 6.36rem;
  box-sizing: border-box;
  padding: .4rem .5rem;
  font-size: .27rem;
  position: relative;

  .title{
    text-align: center;
    color: $color-this;
    font-size: .32rem;
    margin-bottom: .3rem;
  }

  .tradeInfo{
    display: flex;
    flex-wrap: wrap;

    &>.item:nth-child(2n-1){
      width: 2.4rem;
    }

    .item{
      margin-bottom: .25rem;

      .subTitle{
        margin-bottom: .06rem;
        color: $color-999;

        .unit{
          font-size: .21rem;
        }
      }

      .num{
        font-size: .25rem;
      }
    }
  }

  .buyInfo{
    margin-bottom: .3rem;
    font-size: .25rem;

    &:last-child{
      margin-bottom: 0rem;
    }

    &>div{
      display: flex;
      align-items: center;/*垂直居中*/
      margin-bottom: .04rem;
    }

    .direction{
      margin: .1rem 0px;
      font-size: .27rem;
    }

    .label{
      color: $color-999;
    }

    .triTcon{
      font-size: 0.28rem;
    }
    // 显示三角箭头
    .triangle{
      position: relative;
      .icon-huaban31{
        &::after{
          content: '';
          position: absolute;
          border: .08rem solid transparent;
          border-bottom: .08rem solid #F3F3F3;
          right: 0.3rem;
          top: 0.26rem;
          transform: translate(140%, -20%)
        }
      }
    }

    .explainBox{
      display: flex;
      .explain{
      background: #F3F3F3;
      color: #F5A623;
      font-size: 0.21rem;
      padding: 0.1rem 0.15rem;
      margin: 0 0 0.12rem 1.3rem;
      }
    }
    .txid{
      display: inline-block;
      max-width: 1.76rem;
      overflow: hidden;
      word-break: normal;
      text-overflow: ellipsis;
    }

    .anonymousTip{
      font-size: .25rem;
    }
  }

  .anonymous{
    background: #F3F3F3;
    font-size: .25rem;
    display: flex;
    align-items: center;
    padding: .08rem .22rem .08rem .12rem;
    box-sizing: border-box;
    border-radius: .04rem;
    position: relative;

    &::before{
      content: '';
      position: absolute;
      border: .1rem solid #F3F3F3;
      top: -2px;
      left: .5rem;
      transform: rotate(45deg);
    }

    .position{
      position: relative;
      background: #F3F3F3;
      display: flex;
    }

    .toUpperVip{
      color: #F5A623;
      margin-left: .2rem;
    }
  }
}
</style>
