<template>
  <div class="comfig">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <!-- <div class="title">{{ $t('resources.sure') }}</div> -->
    <div class="title">{{$t('exchange.confirm')}}</div>
    <div class="content">
      <div class="item">
        <span class="item-name">{{$t('exchange.use')}}</span>
        <div class="flex">
          <span class="useCoinUrl"><img width="100%" :src="exchangeObj.useCoinUrl" /></span>
          <span class="item-info">
          {{exchangeObj.quantity}} {{exchangeObj.startCoin}}
            <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
          </span>
        </div>
      </div>
      <div class="justifyCenter color-this">
        <div class="circle">
          <span class="iconfont icon-huaban124 changeTo"></span>
        </div>
      </div>
      <div class="item">
        <span class="item-name">{{$t('exchange.exchangeFor')}}</span>
        <div class="flex">
          <span class="useCoinUrl"><img width="100%" :src="exchangeObj.getCoinUrl" /></span>
          <span class="item-info">
            {{exchangeObj.quantity}} {{exchangeObj.endCoin}}
            <span class="eos-chain">(BTC{{$t('exchange.chain')}})</span>
          </span>
        </div>
      </div>
    </div>

    <div class="address">
      <div class="item">
        <div class="item-name">{{$t('exchange.tipReceive')}}</div>
        <span class="item-info">{{toAccount}}</span>
      </div>
      <div class="btnbox">
        <div class="btn" @click="handleClosePopup">{{$t('exchange.cancel')}}</div>
        <div class="btn" @click="submit" >{{$t('exchange.agree')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';

export default {
  data() {
    return {};
  },
  props: ['exchangeObj', 'toAccount', 'account'],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    async submit() {
      const { quantity, startCoin, contract } = this.exchangeObj
      const obj = {
        code: contract, // 合约名
        toAccount: this.toAccount,
        quantity: `${quantity} ${startCoin}`,
        memo: `${this.toAccount},${this.account}`, // 接收地址,当前账号名
      };
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [
          {
            account: obj.code,
            name: 'transfer',
            authorization: [{
              actor: fromName, // 转账者
              permission,
            }],
            data: {
              from: fromName,
              to: obj.toAccount,
              quantity: obj.quantity,
              memo: obj.memo
            }
          }
        ]
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      // 错误信息
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$emit('listenClose', false);
      // DApp.transfer(obj, (err) => {
      //   if (err) {
      //     this.$toast({
      //       message: this.$t('toastTip.fail'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     return;
      //   }
      //   // this.popupSubmit = false
      //   this.$emit('listenClose', false);
      // });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.comfig {
  width: 6.21rem;
  background: #fff;
  border-radius: 0.17rem;
  padding: 0.36rem 0.36rem 0.33rem;
  box-sizing: border-box;
  position: relative;
  font-size: 0.28rem;
  // height: 80vh;
  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.18rem;
  }

  .title {
    color: $color-this;
    text-align: center;
    margin-bottom: 0.2rem;
    font-size: 0.36rem;
  }
  .btnbox {
    display: flex;
  }
  .btn {
    // width: 4.9rem;
    flex: 0 0 50%;
    height: 0.77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #fff;
    margin: auto;
    border-radius: 0.1rem;
    margin-top: 0.3rem;
    font-size: 0.26rem;
    &:first-child {
      background: #c7c7c7;
      color: #fff;
      border-radius: 0.1rem;
      margin-right: 0.1rem;
    }
  }

  .content {
    margin-top: 0.22rem;
    font-size: 0.25rem;
    background: #E9F2FF;
    border-radius: .1rem;

    .item {
      // display: flex;
      padding: .3rem 0.6rem;
      box-sizing: border-box;
      // height: 0.96rem;
      // line-height: 0.96rem;
      .item-name {
        width: 1.6rem;
        text-align: right;
        flex-shrink: 0;
        color: #9B9B9B;
      }
      // .item-info {
      //   margin-left: 0.4rem;
      //   text-overflow: ellipsis;
      //   white-space: nowrap;
      //   overflow: hidden;
      .eos-chain{
        font-size: 0.21rem;
        color: #3A3949;
      }
      // }

      .flex{
        display: flex;
        align-items: center;
        margin-top: .1rem;
      }

      .useCoinUrl{
        width: .42rem;
        height: .42rem;
        margin-right: .12rem;
      }
    }
  }
  .justifyCenter {
    width: 100%;
    display: flex;
    justify-content: center;
    .icon-huaban117{
      font-size: 0.34rem;
    }
    .circle {
      border: 1px solid $color-this;
      width: 0.43rem;
      height: 0.43rem;
      display: flex;
      align-items: center;
      justify-content: center;
      // line-height: 0.55rem;
      border-radius: 50%;
      text-align: center;
      background: #FFF;
      .changeTo{
        font-size: 0.26rem;
      }
    }
  }

  .address{
    margin-top: .3rem;

    .item{
      padding-left: .2rem;
      margin-bottom: .2rem;

      .item-name{
        color: $color-999;
        font-size: .25rem;
        margin-bottom: .1rem;
      }
    }
  }
}
</style>
