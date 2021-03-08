<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.leaseFail') }}</div>
    <div class="content">
      <div class="item">{{ $t('resources.leaseFailTip1') }}</div>
      <div class="item">
        <span>{{ $t('resources.canExtract') }}:</span>
        <span class="color-green">{{ hasReserves }}</span>
      </div>
      <!-- <div class="item">{{ $t('resources.renewalTip3') }}</div> -->
    </div>
    <div class="btn disabled" v-if="!Number(hasReserves.split(' ')[0])">{{ $t('resources.extractAll') }}</div>
    <div class="btn" v-else @click="handleWithdrawAll">{{ $t('resources.extractAll') }}</div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';

export default {
  data() {
    return {}
  },
  props: [
    'hasReserves',
  ],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 全部取回
    async handleWithdrawAll() {
      const obj = {
        amount: this.hasReserves,
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const actions = [{ // 提现
        account: 'eosio',
        name: 'withdraw',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          owner: fromName,
          amount: obj.amount
        },
      }];
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
      this.$toast({
        message: this.$t('toastTip.success'),
        position: 'center',
        duration: 2000,
      });
      this.$emit('listenClose', false);
      // DApp.withdraw(params, (err, res) => {
      //   if (err) {
      //     this.$toast({
      //       message: this.$t('toastTip.fail'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     return;
      //   }
      //   if (res) {
      //     this.$toast({
      //       message: this.$t('toastTip.success'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //     this.$emit('listenClose', false);
      //   }
      // });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rentTip{
  width: 6.21rem;
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
    width: 4.9rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #FFF;
    margin: auto;
    border-radius: .1rem;
    margin-top: .5rem;
    font-size: .26rem;

    &.disabled{
      background: $color-input;
      color: $color-999;
      border: 1px solid $color-input;
    }
  }
  .content{
    font-size: .28rem;

    .item{
      margin-bottom: .2rem;
    }
  }
}
</style>
