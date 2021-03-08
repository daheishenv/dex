<template>
    <div class="addressDiv">
    <div class="header-title">
      {{$t('exchange.exchangeUsdt')}}
      <i class="iconfont icon-huaban122" @click="handleToExchangeRecord"></i>
    </div>


      <div class="content">
        <div class="title">{{$t('exchange.follow',{coin:'USDT', chain: exchange.chain})}}</div>
        <div class="tip">1 USDT ({{exchange.chain}}{{$t('exchange.chain')}}) = 1 USDT (EOS{{$t('exchange.chain')}})</div>
        <div class="qrcode" ref="qrCodeUrl"></div>
        <div class="addressText">
          {{exchange.address}}
        </div>
        <div class="btn" v-clipboard:copy="`${exchange.address}`" v-clipboard:success="onCopy" v-clipboard:error="onError">
          {{$t('exchange.copy')}}</div>
        <div class="posTip">
          <div class="color-333">{{$t('exchange.eos1')}}</div>
          <div>{{$t('exchange.eos2a1')}}{{ minFee }} USDT{{$t('exchange.eos2a2')}}</div>
          <!-- <div>{{$t('exchange.eos2_1')}}</div> -->
          <div>{{$t('exchange.eos3',{coin: exchange.chain})}}</div>
          <div>{{$t('exchange.eos4',{coin: exchange.chain})}}</div>
          <div>{{$t('exchange.eos5')}}</div>
        </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  data() {
    return {
      qrcode: '',
      exchange: {},
      minFee: 1
    }
  },
  created() {
    this.exchange = sessionStorage.getItem('exchangeUsdt') ?
      JSON.parse(sessionStorage.getItem('exchangeUsdt')) : ''
  },
  mounted() {
    let { minfee } = this.$route.params || 1
    this.minFee = minfee
    this.creatQrCode(this.exchange.address)
  },
  methods: {
    creatQrCode(text) {
      const size = (270 * 0.5 * (document.documentElement.clientWidth / 375))
      this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    // usdt 兑换记录
    handleToExchangeRecord() {
      // const obj = {
      //   fromChain: this.selectType ? 'eth' : 'tron',
      //   toChain: 'eos'
      // }
      // sessionStorage.setItem('exchangeUsdtRecord', JSON.stringify(obj))
      this.$router.push({ name: 'exchangeUsdtRecord' })
    },
    onCopy() {
      this.$emit('listenClose', false);
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    onError() {
      this.$emit('listenClose', false);
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
.addressDiv {
  width: 100%;
  font-size: 0.36rem;
  .header-title {
    position: relative;
    width: 100%;
    height: 0.9rem;
    background-color: #fff;
    text-align: center;
    line-height: 0.9rem;
    font-size: 0.36rem;
    color: #000000;
    border-bottom: 0.1rem solid #fafafa;
    .icon-huaban122 {
      font-size: 0.4rem;
      position: absolute;
      right: 0.3rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .content{
    padding: .36rem;
    box-sizing: border-box;
    background-color: #fff;
    .title {
      color: $color-this;
      text-align: center;
      margin-bottom: 0.2rem;
      font-size: 0.32rem;
    }
    .tip{
      font-size: .22rem;
      color: $color-999;
      text-align: center;
      margin-bottom: .12rem;
    }
    .qrcode{
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto .3rem;
    }
    .addressText{
      width: 6.7rem;
      margin: 0 auto;
      background-color: #eee;
      box-sizing: border-box;
      padding: .18rem .35rem;
      font-size: 0.25rem;
      color: #3A3949;
      border-radius: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn {
      box-sizing: border-box;
      width: 2.3rem;
      height: 0.72rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $color-this;
      margin: 0 auto;
      border-radius: 0.1rem;
      margin-top: 0.3rem;
      font-size: 0.28rem;
      color: #FFFFFF;
      border: 0.02rem solid #4A90E2;
    }
    .posTip {
      margin-top: 0.6rem;
      font-size: 0.24rem;
      & > div {
        margin-top: 0.16rem;
        position: relative;
        padding-left: 0.15rem;
        color: $color-999;
        &:first-child {
          margin-top: 0rem;
        }
        &::before {
          content: "";
          position: absolute;
          width: 0.0612rem;
          height: 0.0612rem;
          background: $color-input;
          border-radius: 0.1rem;
          left: 0;
          top: 0.1rem;
        }
      }
    }
  }

}

</style>
