<template>
  <div class="mana">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.mgtRenewalNum') }}</div>
    <div class="content">
      <div class="typeDiv">
        <div @click="type = 1" :class="{'active': type === 1}">{{ $t('resources.addLeaseTerm') }}</div>
        <div @click="type = 2" :class="{'active': type === 2}">{{ $t('resources.subLeaseTerm') }}</div>
      </div>
      <!-- <div class="existing">
        <span>{{ $t('resources.inned') }}:</span>
        <span>{{ popupData.balance }}</span>
      </div> -->
      <div class="hasDays">
        <span>{{ $t('resources.hadDays') }}: {{ hasDays }} {{ $t('resources.day') }}</span>
      </div>
      <div class="item noTop">
        <div class="left">
          <span v-if="type === 1">{{ $t('resources.addLeaseTerm') }}</span>
          <span v-else>{{ $t('resources.subLeaseTerm') }}</span>
        </div>
        <div class="inputDiv noPd">
          <span class="color-red" :class="{'disabledSpan': !abledSub}" @click="handleSubNum">—</span>
          <label class="label">{{ days }} {{ $t('resources.day') }}</label>
          <span class="iconfont icon-huaban26 color-green" :class="{'disabledSpan': !abledAdd}"
            @click="handleAddNum"></span>
        </div>
      </div>
      <div class="balance">
        <span>{{ $t('resources.totalDays') }}: {{ daysCount }} {{ $t('resources.day') }}</span>
      </div>
      <div class="item">
        <div class="left">
          <span v-if="type === 1">{{ $t('resources.addRent') }}</span>
          <span v-else>{{ $t('resources.subRent') }}</span>
        </div>
        <div class="inputDiv disabled" :class="{'error': error}">
          <span class="input">{{ addEosNum }}</span>
          <span>EOS</span>
        </div>
      </div>
      <div class="balance">
        <span v-if="type === 1">{{ $t('resources.abledEos') }}: {{ balance || '0.0000'}}</span>
        <span v-else>{{ $t('resources.abledBackRwnt') }}: {{ popupData.balance || '0.0000 EOS'}}</span>
      </div>
      <div class="btn" @click="handleRegInput">
        <span>{{ $t('resources.sureIn') }}</span>
      </div>

      <!-- <div class="tipDiv">
        <div class="tip">{{ $t('resources.rentTip1') }}</div>
        <div class="tip">{{ $t('resources.rentTip2') }}</div>
      </div> -->
    </div>

    <!-- 自定义吐司 -->
    <transition name="fade">
      <div class="myToast" v-if="toast">{{ toastInfo }}</div>
    </transition>
  </div>
</template>

<script>
// import { Decimal } from 'decimal.js'
import { Toast } from 'mint-ui';
import { Decimal } from 'decimal.js'
import DApp from '@/utils/wallet';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      type: 1,
      num: '',
      error: false,
      coin: 'EOS',
      toast: false,
      toastInfo: '',
      days: 0,
      addEosNum: '0.0000',
      abledSub: false,
      abledAdd: true,
      hasDays: 0,
      daysCount: 0,
    }
  },
  props: [
    'popupData', // 唯一索引
    'balance', // 余额
    'hasReserves', // 储备金
    'time', // 周期时间
  ],
  watch: {
    type() {
      this.error = false;
      this.num = '';
      this.days = 0;
      this.abledSub = false;
      this.abledAdd = true;
      if (this.type === 1) {
        if (Number(this.balance) < Number(this.popupData.payment.split(' ')[0])) {
          this.abledAdd = false;
        }
        return;
      }
      if (this.hasDays < this.time) {
        this.abledAdd = false;
      }
    },
    popupData() {
      this.hasDays = this.popupData.days
    },
    days(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.days = 0;
        this.abledSub = false; // 不能再点击减号
        return;
      }
      if (Number(newVal) === 0) {
        this.abledSub = false; // 不能再点击减号
        this.addEosNum = toFixed(0, 4);
        this.daysCount = this.hasDays;
        const payMent = this.popupData.payment.split(' ')[0];
        const balan = Number(this.balance.split(' ')[0]);
        // 判断 + 号是否可以点击
        if (this.type === 1) {
          if (Number(payMent) <= Number(balan)) {
            this.abledAdd = true;
            return;
          }
          this.abledAdd = false;
        } else {
          if (Number(this.hasDays)) {
            this.abledAdd = true;
            return;
          }
          this.abledAdd = false;
        }
        return;
      }
      this.abledSub = true;
      // 计算增加|退回租金
      let t = Decimal.div(this.days, this.time);
      const num = Decimal.mul(t, this.popupData.payment.split(' ')[0]);
      if (this.type === 1) { // 处理增加期限 加号 点击权限
        if (Number(num) > Number(this.balance.split(' ')[0])) {
          this.abledAdd = false; // 不能再点击加号
          this.days = oldVal;
          return;
        }
        t = Number(t) + 1;
        const addNum = Decimal.mul(t, this.popupData.payment.split(' ')[0]);
        if (Number(addNum) > Number(this.balance.split(' ')[0])) {
          this.abledAdd = false; // 不能再点击加号
        } else {
          this.abledAdd = true;
        }
        this.daysCount = Number(this.hasDays) + Number(this.days);
      } else { // 处理减少期限 加号 点击权限
        let newDay = Number(this.hasDays) - Number(this.days);
        if (newDay <= 0) {
          newDay = 0;
          this.abledAdd = false; // 不能再点击加号
        } else {
          this.abledAdd = true;
        }
        this.daysCount = newDay;
      }
      this.addEosNum = toFixed(num, 4);
    },
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.hasDays = this.popupData.days
      this.days = 0;
      this.daysCount = this.popupData.days;
    },
    handleClosePopup() {
      this.$emit('listenClose', false);
    },
    handleAddNum() {
      if (!this.abledAdd) {
        return;
      }
      this.days = Number(this.days) + Number(this.time);
    },
    handleSubNum() {
      if (!this.abledSub) {
        return;
      }
      const t = Number(this.days) - Number(this.time);
      if (t >= 0) {
        this.days = Number(this.days) - Number(this.time);
      }
    },
    // 失去焦点
    handleBlur() {
      if (Number(this.num) < 0) {
        this.num = '0.0000';
        return;
      }
      this.num = toFixed(this.num, 4);
    },
    // 获取焦点
    handleFocus() {
      if (!Number(this.num)) {
        this.num = '';
        return;
      }
      this.num = Number(this.num);
    },
    // 验证输入框
    handleRegInput() {
      if (!Number(this.addEosNum)) {
        this.error = true;
        return;
      }
      // 存入
      if (this.type === 1) {
        const balance = this.balance.split(' ')[0];
        if (Number(this.addEosNum) > Number(this.hasReserves.split(' ')[0])) {
          if (Number(this.addEosNum) > Number(balance)) {
            // 余额不足
            this.error = true;
            return;
          }
        }
        this.error = false;
        this.handleAdd();
        return;
      }
      // 取回
      const balance = this.popupData.balance.split(' ')[0]
      if (Number(this.addEosNum) > Number(balance)) {
        // 可赎回余额不足
        this.error = true;
        return;
      }
      this.error = false;
      this.handleGetBack()
    },
    // 存入租金
    async handleAdd() {
      const topUp = Number(this.addEosNum) > Number(this.hasReserves.split(' ')[0]) ? 1 : 0;
      const obj = {
        loan_num: this.popupData.loan_num.toString(),
        type: this.popupData.type,
        amount: `${this.addEosNum} ${this.coin}`,
        topUp,
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      // 存CPU | NET 贷款基金
      const actions = [{
        account: 'eosio',
        name: obj.type === 'CPU' ? 'fundcpuloan' : 'fundnetloan',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          from: fromName,
          loan_num: obj.loan_num,
          payment: obj.amount,
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
            amount: obj.amount, // eos 数量
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
        this.toastInfo = this.$t('toastTip.fail');
        this.toast = true;
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        return;
      }
      this.$emit('listenClose', true);
      Toast({
        message: this.$t('toastTip.success'),
        position: 'center',
        duration: 2000,
      });
      // DApp.depositRent(params, (err, res) => {
      //   if (err) {
      //     this.toastInfo = this.$t('toastTip.fail');
      //     this.toast = true;
      //     setTimeout(() => {
      //       this.toast = false;
      //     }, 2000);
      //     return;
      //   }
      //   if (res) {
      //     this.$emit('listenClose', true);
      //     Toast({
      //       message: this.$t('toastTip.success'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //   }
      // });
    },
    // 取回租金
    async handleGetBack() {
      const obj = {
        loan_num: this.popupData.loan_num.toString(),
        type: this.popupData.type,
        amount: `${this.addEosNum} ${this.coin}`
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const actions = [{
        account: 'eosio',
        name: obj.type === 'CPU' ? 'defcpuloan' : 'defnetloan',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          from: fromName,
          loan_num: obj.loan_num,
          amount: obj.amount,
        },
      }, { // 提现
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
        this.toastInfo = this.$t('toastTip.fail');
        this.toast = true;
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$emit('listenClose', true);
      Toast({
        message: this.$t('toastTip.success'),
        position: 'center',
        duration: 2000,
      });
      // DApp.collectRent(params, (err, res) => {
      //   if (err) {
      //     this.toastInfo = this.$t('toastTip.fail');
      //     this.toast = true;
      //     setTimeout(() => {
      //       this.toast = false;
      //     }, 2000);
      //     return;
      //   }
      //   if (res) {
      //     this.$emit('listenClose', true);
      //     Toast({
      //       message: this.$t('toastTip.success'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //   }
      // });
    },
  },
  beforeDestroy() {
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.mana{
  background: #FFF;
  border-radius: .1rem;
  width: 6.21rem;
  position: relative;
  padding: .32rem .56rem .46rem;
  box-sizing: border-box;
  font-size: .24rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
  }

  .title{
    font-size: .32rem;
    color: $color-this;
    text-align: center;
    margin-bottom: .27rem;
  }

  .typeDiv{
    display: flex;
    align-items: center;

    &>div{
      flex: 1;
      display: flex;
      height: .6rem;
      align-items: center;
      justify-content: center;
      font-size: .24rem;
      border: 1px solid $color-input;
      border-radius: .05rem 0 0 .05rem;
      color: $color-999;

      &:last-child{
        border-radius: 0 .05rem .05rem 0;
      }

      &.active{
        border: 1px solid $color-this;
        color: $color-this;
      }
    }
  }

  .existing{
    font-size: .21rem;
    margin: .18rem 0 .15rem;
  }

  .item{
    display: flex;
    margin-top: .3rem;
    justify-content: space-between;

    &.noTop{
      margin-top: 0rem;
    }

    .left{
      min-width: 1.12rem;
      width: 1.12rem;
      margin-right: .18rem;
      height: .72rem;
      display: flex;
      align-items: center;
    }
  }

  .inputDiv{
    border: 1px solid $color-input;
    border-radius: .0417rem;
    height: .73rem;
    padding: 0 .15rem 0 .2rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;

    &.disabled{
      background: #f3f3f3;
    }

    &.noPd{
      padding: 0;

      .label{
        color: $color-333;
      }

      span{
        font-size: .27rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid $color-input;
        width: .9rem;
        padding: 0;

        &:last-child{
          border-right: 0px solid $color-input;
          border-left: 1px solid $color-input;
        }

        &.disabledSpan{
          background: #f3f3f3;
          color: $color-999 !important;
        }
      }
    }

    &.error{
      border: 1px solid $color-red;
    }

    .input{
      width: 100%;
      flex: 1;
      height: 100%;
      font-size: .28rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    span{
      font-size: .28rem;
      color: $color-999;
      padding-left: .09rem;
    }
  }

  .hasDays,
  .balance{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: .09rem;
    margin-bottom: .2rem;
    height: .33rem;
    color: $color-999;
    font-size: .21rem;
  }
  .hasDays{
    margin-bottom: .15rem;
    margin-top: .24rem;
  }

  .btn{
    background: $color-this;
    font-size: .26rem;
    border-radius: .0965rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
  }

  .tipDiv{
    margin-top: .182rem;
    color: $color-333;

    .tip{
      padding-left: .15rem;
      margin-top: .14rem;
      position: relative;

      &::before{
        content: '';
        position: absolute;
        width: .0612rem;
        height: .0612rem;
        background: $color-input;
        border-radius: .10rem;
        left: 0px;
        top: .165rem;
        transform: translate(0px, -50%);
      }
    }
  }
}
.myToast{
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(0, 0, 0, .75);
  padding: .12rem .25rem;
  transform: translate(-50%, -50%);
  border-radius: .08rem;
  color: #FFF;
  font-size: .18rem;
  max-width: 5rem;
}
// vue过渡动画
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
