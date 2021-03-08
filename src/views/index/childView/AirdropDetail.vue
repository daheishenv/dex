<template>
  <div class="airDetail" :class="`bg${detail ? detail.bgColorIndex % 4 : 0}`">
    <div class="content">
      <div class="coinImg">
        <img :src="detail ? detail.imageUrl : ''" width="100%">
      </div>
      <div class="top">
        <div class="code">{{ detail ? detail.code : '' }}</div>
        <div class="color-red">
          <span v-if="detail ? detail.status : false">{{ $t('candyAirDrop.gotLong') }}</span>
          <span v-else>{{ $t('candyAirDrop.willGet') }}</span>
        </div>
        <div class="get"
          v-if="!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account">
          — {{ detail ? detail.code : '' }}
        </div>
        <div v-else class="get">
          <span>{{ toFixed(detail ? detail.expectCount || '0' : '0', detail ? detail.coinDecimal : 4) }}</span>
          <span style="font-size: .36rem;">{{ detail ? detail.code : '' }}</span>
        </div>
      </div>
      <div class="bottom">
        <div>
          <span>{{ $t('candyAirDrop.airDropAmt') }}:</span>
          <span>{{  detail ? detail.airdropCount : '' }} {{ detail ? detail.code : '' }}</span>
        </div>
        <div class="mb45">
          <span>{{ $t('candyAirDrop.issueAmt') }}:</span>
          <span>{{  detail ? detail.publishCount : '' }} {{ detail ? detail.code : '' }}</span>
        </div>
        <!-- <div class="mb45">
          <span>{{ $t('candyAirDrop.airRatio') }}:</span>
          <span>{{  detail ? handleToFixed(detail.airdropCount, detail.publishCount): 0 }}%</span>
        </div> -->

        <div>
          <span>{{ $t('candyAirDrop.shortPhoto') }}:</span>
          <span v-if="detail">{{ `${detail.snapshotTime.slice(0, 11)} 00:00` }}(UTC)</span>
        </div>
        <div v-if="detail && detail.airdropTime && detail.airdropTime.indexOf(' ') >= 0">
          <span>{{ $t('candyAirDrop.airTime') }}:</span>
          <span>{{  detail ? detail.airdropTime.split(' ')[0] : '-' }}</span>
        </div>
        <!-- <div class="mb45">
          <span>{{ $t('candyAirDrop.airRules') }}:</span>
          <span>{{ $t('candyAirDrop.airRulesTip') }}</span>
        </div> -->

        <div>
          <span>{{ $t('candyAirDrop.intr') }}:</span>
          <span>{{  detail && detail.introduction ? detail.introduction : '—' }}</span>
        </div>
        <div class="mb45">
          <span>{{ $t('candyAirDrop.officialAddress') }}:</span>
          <span>{{  detail && detail.website ? detail.website : '—' }}</span>
        </div>

        <div v-if="gotoTradeSymbol" class="toTrade mt100" @click="handleToTrade">
          {{ $t('property.toTransaction') }}
        </div>

        <!-- <div v-if="isApp && (detail && detail.status === 1 ? true : false)" class="share mt100" @click="handleShare">
          {{ $t('candyAirDrop.share') }}
        </div> -->
        <!-- <div class="share mt100" @click="handleShare">{{ $t('candyAirDrop.share') }}</div> -->
        <!-- <div v-if="(detail ? !detail.status : true)" class="stakeMore" @click="handleToVipDetail(true)" -->
        <div class="stakeMore" @click="handleToVipDetail(false)"
          :class="{'mt100': !gotoTradeSymbol}">
          {{ $t('candyAirDrop.more') }} >
        </div>
      </div>
    </div>

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="h5ToDapp"
      popup-transition="popup-fade">
      <to-app />
    </mt-popup>

    <!-- appToLogin start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="appToLogin">
      <PopupToLogin @listenClose="handleClose" />
    </mt-popup>
    <!-- appToLogin end -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';
import { toFixed, GetUrlPara } from '@/utils/public';
import ToApp from '@/views/market/components/ToApp';
import PopupToLogin from '../components/PopupToLogin';

export default {
  data() {
    return {
      detail: null,
      isApp: false,
      channelRef: 'dapp',
      h5ToDapp: false,
      appToLogin: false,
      gotoTradeSymbol: '', // 交易对
    }
  },
  components: {
    ToApp,
    PopupToLogin,
    mtPopup: Popup,
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
    this.detail = JSON.parse(sessionStorage.getItem('AirdropDetail')) || null;
    if (!this.detail) {
      this.$router.push('/');
    }
    this.handleGetTradInfo();
    const urlData = GetUrlPara();
    if (urlData.source) {
      this.isApp = true;
    }
  },
  methods: {
    toFixed(n, l) {
      return toFixed(n, l)
    },
    handleClose() {
      this.appToLogin = false;
    },
    // 获取糖果上否上架
    handleGetTradInfo() {
      const params = {
        candyId: this.detail.id
      }
      this.$http.get('/candy/info', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        if (res.gotoTrade.length !== 0) {
          this.gotoTradeSymbol = res.gotoTrade[0].symbol;
        }
      });
    },
    handleToFixed(n, m) {
      if (n == null || m == null) {
        return '0.00'
      }
      let rate = Decimal.div(Number(n), Number(m));
      rate = Decimal.mul(rate, 100).toString();
      return toFixed(rate, 2);
    },
    // 跳转至会员说明页面 type: true - 弹窗 | false - 不弹窗
    handleToVipDetail() {
      if (this.channelRef === 'h5') {
        if (this.isApp && (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account)) {
          this.appToLogin = true;
          return;
        }
        if (this.isApp) {
          // window.action.goToVipCenter(this.$store.state.app.vipInfo.level)
          this.$router.push({
            name: 'vipDetail',
          })
          return;
        }
        this.h5ToDapp = true;
        return;
      }

      // this.$router.push({
      //   name: 'vipDetail',
      //   params: {
      //     show: type || false,
      //   }
      // });
      this.$router.push({
        name: 'upgradeVip' });
    },
    // app分享
    handleShare() {
      const params = {
        type: 4,
        content: ''
      }
      window.action.goToShare(JSON.stringify(params));
    },
    // 去交易
    handleToTrade() {
      if (this.isApp) {
        window.action.goToTrade(this.gotoTradeSymbol);
        return;
      }
      this.$router.push({
        name: 'linek',
        params: {
          symbol: this.gotoTradeSymbol, // 交易对名称
        },
      });
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.airDetail{
  font-size: .27rem;
  background: linear-gradient(0deg, #426BFF 0%, #3D9EFF 100%);
  min-height: 100vh;
  padding-top: 1.1rem;
  padding-bottom: .5rem;
  box-sizing: border-box;

  &.bg0{
    background: linear-gradient(0deg, #426BFF 0%, #3D9EFF 100%);

    .coinImg{
      border: .04rem solid #3D9EFF !important;
    }
  }

  &.bg1{
    background: linear-gradient(-180deg, #FABC4F 0%, #F76B1C 100%);

    .coinImg{
      border: .04rem solid #FABC4F !important;
    }
  }

  &.bg3{
    background: linear-gradient(1deg, #FF0948 0%, #FF5D7F 100%);

    .coinImg{
      border: .04rem solid #FF5D7F !important;
    }
  }

  &.bg2{
    background: linear-gradient(1deg, #8007F9 0%, #A54CFF 100%);

    .coinImg{
      border: .04rem solid #A54CFF !important;
    }
  }

  .coinImg{
    width: 1rem;
    height: 1rem;
    background: #FFFFFF;
    border: .04rem solid #3D97FF;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content{
    background: #FFF;
    // height: 11.25rem;
    width: 7rem;
    margin: auto;
    border-radius: .11rem;
    padding: 0px .23rem;
    box-sizing: border-box;

    .top{
      padding-top: .75rem;
      text-align: center;
      padding-bottom: .25rem;
      border-bottom: 2px dashed #A2A2A2;

      .code{
        font-size: .48rem;
        margin-bottom: .2rem;
      }

      .get{
        margin-top: .2rem;
        font-size: .54rem;
        color: #FF001F;
      }
    }

    .bottom{
      padding:.4rem .13rem;

      &>div{
        margin-bottom: .14rem;
        display: flex;
        // justify-content: center;
        // align-items: center;

        &>span:nth-child(1){
          // max-width: 1.7rem;
          // min-width: 1.07rem;
          margin-right: .24rem;
          font-size: .25rem;
          white-space: nowrap;
        }
        &>span:nth-child(2){
          font-size: .27rem;
          display: flex;
          align-items: center;
          word-break: break-all;
        }

        &.mb45{
          margin-bottom: .45rem;
        }

        &.mt100{
          margin-top: 1rem;
        }
      }

      .toTrade{
        background: #FFF;
        border: 1px solid #4A90E2;
        border-radius: .15rem;
        height: .85rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #4A90E2;
        font-size: .32rem;
        width: 3rem;
        margin: auto;
      }

      .share{
        background: linear-gradient(-180deg, #FFF002 0%, #F76B1C 100%);
        border-radius: .15rem;
        height: .85rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #D0021B;
        font-size: .32rem;
      }

      .stakeMore{
        color: $color-this;
        // justify-content: flex-end;
        justify-content: center;
        font-size: .25rem;
        margin-top: .2rem;
      }
    }
  }
}
.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}
.mortgageNDX{
  background: transparent !important;
}
</style>
