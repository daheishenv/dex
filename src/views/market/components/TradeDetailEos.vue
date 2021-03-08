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
        <span class="label">{{ detail.bidChain ? detail.bidChain.toUpperCase() : 'EOS' }}{{ $t('lineK.accountName') }}：</span>
        <span class="num color-999"
          :class="{'color-this': detail.bidAccountNo.indexOf('*') === -1}"
          @click="handleToAccount(detail.bidAccountNo, detail.bidChain)">
          <!-- 会员等级 -->
          <span class="iconfont icon-v vip" v-if="!detail.bidLevel || detail.bidLevel === 0"></span>
          <span class="iconfont icon-huaban74 vip isVip" v-if="detail.bidLevel === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" v-if="detail.bidLevel === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" v-if="detail.bidLevel === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" v-if="detail.bidLevel === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" v-if="detail.bidLevel === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" v-if="detail.bidLevel === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" v-if="detail.bidLevel === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" v-if="detail.bidLevel === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" v-if="detail.bidLevel === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" v-if="detail.bidLevel === 10"></span>
          <span> {{ detail.bidAccountNo }}</span>
          <span @click.stop="buyAnonymous = !buyAnonymous"
            v-if="detail.bidAccountNo.indexOf('*') !== -1"
            class="iconfont icon-huaban31 anonymousTip"></span>
        </span>
      </div>
      <div v-if="buyAnonymous">
        <span class="anonymous">
          <span class="position">
            <span>{{ $t('anonymous.anonymousCondition') }}</span>
            <span class="toUpperVip" v-if="!$embed" @click="handleToUpper">{{ $t('anonymous.openAnonymous') }}></span>
          </span>
        </span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealCount') }}：</span>
        <span class="num">{{ detail.bidSettleStr }} {{ symbol1 }}</span>
      </div>
      <div>
        <span class="label" v-if="!detail.bidSaveChargeStr">{{ $t('public.charge') }}：</span>
        <span class="label" v-if="detail.bidSaveChargeStr">{{ $t('lineK.postDiscount') }}：</span>
        <span class="num">{{ detail.bidChargeStr }} {{ symbol1 }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.saveCharge') }}：</span>
        <span class="num">{{ detail.bidSaveChargeStr || 0 }} {{ symbol1 }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.tradeOrder') }}TrxID：</span>
        <span @click="handleToTx(detail.bidOrderTrxId, detail.bidChain)"
          :class="{'color-this': detail.bidOrderTrxId && detail.bidOrderTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.bidOrderTrxId || '-' }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealOrder') }}TrxID：</span>
        <span @click="handleToTx(detail.bidTrxId, detail.askChain)"
          :class="{'color-this': detail.bidTrxId && detail.bidTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.bidTrxId || '-' }}</span>
      </div>
    </div>
    <!-- 交易方 - 卖方 -->
    <div class="buyInfo">
      <div class="direction color-red">{{ $t('lineK.seller') }}</div>
      <div>
        <span class="label">{{ detail.askChain ? detail.askChain.toUpperCase() : 'EOS' }}{{ $t('lineK.accountName') }}：</span>
        <span class="num color-999"
          :class="{'color-this': detail.askAccountNo.indexOf('*') === -1}"
          @click="handleToAccount(detail.askAccountNo, detail.askChain)">
          <!-- 会员等级 -->
          <span class="iconfont icon-v vip" v-if="!detail.askLevel || detail.askLevel === 0"></span>
          <span class="iconfont icon-huaban74 vip isVip" v-if="detail.askLevel === 1"></span>
          <span class="iconfont icon-huaban73 vip isVip" v-if="detail.askLevel === 2"></span>
          <span class="iconfont icon-huaban72 vip isVip" v-if="detail.askLevel === 3"></span>
          <span class="iconfont icon-huaban68 vip isVip" v-if="detail.askLevel === 4"></span>
          <span class="iconfont icon-huaban71 vip isVip" v-if="detail.askLevel === 5"></span>
          <span class="iconfont icon-huaban69 vip isVip" v-if="detail.askLevel === 6"></span>
          <span class="iconfont icon-huaban66 vip isVip" v-if="detail.askLevel === 7"></span>
          <span class="iconfont icon-huaban70 vip isVip" v-if="detail.askLevel === 8"></span>
          <span class="iconfont icon-huaban67 vip isVip" v-if="detail.askLevel === 9"></span>
          <span class="iconfont icon-huaban65 vip isVip" v-if="detail.askLevel === 10"></span>
          <span> {{ detail.askAccountNo }}</span>
          <span v-if="detail.askAccountNo.indexOf('*') !== -1"
            @click.stop="sellAnonymous = !sellAnonymous" class="iconfont icon-huaban31 anonymousTip"></span>
        </span>
      </div>
      <div v-if="sellAnonymous" @click="sellAnonymous = !sellAnonymous">
        <span class="anonymous">
          <span class="position">
            <span>{{ $t('anonymous.anonymousCondition') }}</span>
            <span v-if="!$embed" @click.stop="handleToUpper" class="toUpperVip">{{ $t('anonymous.openAnonymous') }}></span>
          </span>
        </span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealCount') }}：</span>
        <span class="num">{{ detail.askSettleStr }} {{ symbol2 }}</span>
      </div>
      <div>
        <span class="label" v-if="!detail.askSaveChargeStr">{{ $t('public.charge') }}：</span>
        <span class="label" v-if="detail.askSaveChargeStr">{{ $t('lineK.postDiscount') }}：</span>
        <span class="num">{{ detail.askChargeStr }} {{ symbol2 }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.saveCharge') }}：</span>
        <span class="num">{{ detail.askSaveChargeStr || 0 }} {{ symbol2 }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.tradeOrder') }}TrxID：</span>
        <span @click="handleToTx(detail.askOrderTrxId, detail.askChain)"
          :class="{'color-this': detail.askOrderTrxId && detail.askOrderTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.askOrderTrxId || '-' }}</span>
      </div>
      <div>
        <span class="label">{{ $t('lineK.dealOrder') }}TrxID：</span>
        <span @click="handleToTx(detail.askTrxId, detail.bidChain)"
          :class="{'color-this': detail.askTrxId && detail.askTrxId.indexOf('*') === -1}"
          class="num txid color-999">{{ detail.askTrxId || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toLocalTime, toBrowser, parseSymbol } from '@/utils/public';

export default {
  data() {
    return {
      symbol: null,
      symbol1: null,
      symbol2: null,
      buyAnonymous: false,
      sellAnonymous: false,
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
    'aggOid',
  ],
  mounted() {
    const symbolArr = parseSymbol(this.$route.params.symbol.toUpperCase(), '');
    this.symbol = `${symbolArr[1]}/${symbolArr[2]}`;
    this.symbol1 = symbolArr[1];
    this.symbol2 = symbolArr[2];
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
      toBrowser(account, chain, 'account', this.$embed);
    },
    // 查询trxid
    handleToTx(id, chain) {
      if (id.indexOf('*') !== -1) {
        return;
      }
      toBrowser(id, chain, 'tx', this.$embed);
    },
    // 时间转化
    toLocalTime(time) {
      return toLocalTime(time)
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
  color: $color-999;
}

.isVip{
  color: #F6C85C !important;
  opacity: 1;
}

.detail{
  width: 6.36rem;
  box-sizing: border-box;
  padding: .4rem .5rem;
  font-size: .27rem;
  position: relative;

  .title{
    text-align: center;
    color: $color-333;
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
