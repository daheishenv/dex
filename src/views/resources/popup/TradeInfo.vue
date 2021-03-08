<template>
  <div class="comfig">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.sure') }}</div>
    <div class="content">
      <div class="item">
        <div>{{ $t('resources.leaseType') }}</div>
        <div>{{ action.status === 1 ? 'CPU' : 'NET' }}</div>
      </div>
      <div class="item">
        <div>{{ $t('newpos.receiveAccount') }}</div>
        <div>{{ action.receiver }}</div>
      </div>
      <div class="item">
        <div>{{ $t('resources.rentNum') }}</div>
        <div>{{ action.dealNum }} EOS</div>
      </div>
      <div class="item">
        <div>{{ $t('resources.rentTime') }}</div>
        <div>{{ $t('resources.dateLong') }}</div>
      </div>
      <div class="item">
        <div>{{ $t('resources.rentPrice') }}</div>
        <div>{{ action.dealNumToCount }} EOS</div>
      </div>
      <!-- <div class="item">
        <div>{{ $t('resources.isRenewal') }}</div>
        <div v-if="action.isRenewal">{{ $t('resources.yes') }}</div>
        <div v-else>{{ $t('resources.no') }}</div>
      </div> -->
      <div class="item">
        <div>{{ $t('resources.leaseTerm') }}</div>
        <div>{{ action.renewalDays }} {{ $t('resources.day') }}</div>
      </div>
      <div class="item">
        <div>{{ $t('resources.renewalNum') }}</div>
        <div>{{ action.renewalNum || '0.0000' }} EOS</div>
      </div>
      <div class="item allPrice">
        <div>{{ $t('resources.allPrice') }}</div>
        <div>{{ action.allRentCount.split(' ')[0] }} EOS</div>
      </div>
    </div>
    <div class="btn" @click="handleTrade">{{ $t('resources.surePay') }}</div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';

export default {
  data() {
    return {}
  },
  props: [
    'action',
  ],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 交易
    async handleTrade() {
      const obj = this.action;
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      // 存CPU | NET 贷款基金
      const actions = [{
        account: 'eosio',
        name: obj.type === 1 ? 'rentcpu' : 'rentnet',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          from: fromName,
          receiver: obj.receiver,
          loan_payment: obj.loan_payment,
          loan_fund: obj.loan_fund,
        },
      }];
      if (obj.topUp) {
        actions.unshift({ // 充值
          account: 'eosio',
          name: 'deposit',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            amount: obj.allRentCount, // eos 数量
          },
        })
      }
      const params = {
        actions,
      };
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
      this.$toast(this.$t('toastTip.success'));
      this.$emit('listenClose', true);
      // DApp.rent(this.action, (err, res) => {
      //   if (err) {
      //     return;
      //   }
      //   if (res) {
      //     this.$toast(this.$t('toastTip.success'));
      //     this.$emit('listenClose', true);
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.comfig{
  width: 6.8rem;
  background: #FFF;
  border-radius: .17rem;
  padding: .46rem .55rem .33rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
  }

  .title{
    color: $color-this;
    text-align: center;
    margin-bottom: .2rem;
    font-size: .32rem;
  }
  .btn{
    // width: 4.9rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #FFF;
    margin: auto;
    border-radius: .1rem;
    margin-top: .3rem;
    font-size: .26rem;
  }

  .content{
    margin-top: .45rem;
    font-size: .25rem;
    .item{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .17rem;

      &>div:first-child{
        flex: 2;
        color: $color-999;
        text-align: right;
        margin-right: .5rem;
      }
      &>div:last-child{
        flex: 3;
        text-align: left;
        font-size: .28rem;
      }

      &.allPrice{
        border-top: 1px solid $color-input;
        margin-top: .22rem;
        padding: .24rem 0 .35rem;

        &>div:last-child{
          font-size: .3rem;
          color: $color-green;
        }
      }
    }
  }
}
</style>
