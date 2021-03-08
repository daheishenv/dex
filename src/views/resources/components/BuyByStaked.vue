<template>
  <div class="buyByStaked" @click="selectMenu = false">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('resources.useStaked') }}</div>
    <div class="tip">
      {{ $t('resources.useStakedTip') }}
    </div>
    <div class="content">
      <div class="item">
        <div class="left">{{ $t('resources.stakedAccount') }}:</div>
        <div class="right">
          <!-- 账户筛选 start -->
          <div class="selectMenu" v-if="selectMenu">
            <div class="select color-333">
              <div v-for="(item, $index) in stakeList" :key="$index"
                @click="selectIndex = $index">{{ item.to }}</div>
            </div>
          </div>
          <!-- 账户筛选 end -->
          <div class="account" @click.stop="selectMenu = !selectMenu">
            <span>{{ stakeList[selectIndex].to }}</span>
            <span class="down" :class="{'up': selectMenu}"></span>
          </div>
          <div class="subTip color-999">{{ $t('resources.stakedAccountTip') }}</div>
        </div>
      </div>
      <div class="item">
        <div class="left">CPU:</div>
        <div class="right">
          <div class="inputDiv"
            :class="{'error': Number(cpu) > Number(stakeList[selectIndex].cpu_weight.split(' ')[0])}">
            <input type="number" v-model="cpu"
              @blur="handleCpuBlur"
              :placeholder="$t('newpos.inputTipUnstake')">
            <span class="coin">EOS</span>
          </div>
          <div class="staked">
            <span @click="handleGetNum('cpu')">
              <span>{{ $t('newpos.staked') }}:</span>
              <span>{{ stakeList[selectIndex].cpu_weight }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="left">NET:</div>
        <div class="right">
          <div class="inputDiv"
            :class="{'error': Number(net) > Number(stakeList[selectIndex].net_weight.split(' ')[0])}">
            <input type="number" v-model="net"
              @blur="handleNetBlur"
              :placeholder="$t('newpos.inputTipUnstake')">
            <span class="coin">EOS</span>
          </div>
          <div class="staked">
            <span @click="handleGetNum('net')">
              <span>{{ $t('newpos.staked') }}:</span>
              <span>{{ stakeList[selectIndex].net_weight }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="btn" @click="handleReg">{{ $t('resources.unstakedAndBuy') }}</div>
    <div class="bottomTip">{{ $t('resources.actionTip') }}</div>

    <!-- 自定义吐司 -->
    <transition name="fade">
      <div class="myToast" v-if="toast">{{ toastInfo }}</div>
    </transition>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { Toast } from 'mint-ui';
import { toFixed } from '@/utils/public';

export default {
  data() {
    return {
      selectMenu: false,
      selectIndex: 0, // 抵押列表选择项
      net: '',
      cpu: '',
      timer: null, // input输入定时器 - 300ms
      cpuTimer: null, // input输入定时器 - 300ms
      netTimer: null, // input输入定时器 - 300ms
      toast: false,
      toastInfo: '',
    }
  },
  props: [
    'stakeList', // 账户抵押列表
    'info', // 账户代理信息
    'dexProxyLists', // 平台代理列表
    'coin', // EOS | SYS
    'stakedCount', // 账户抵押总量
  ],
  watch: {
    net(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.net = oldVal;
      }
    },
    cpu(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.net = oldVal;
      }
    },
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    handleCpuBlur() {
      this.cpu = toFixed(this.cpu, 4);
    },
    handleNetBlur() {
      this.net = toFixed(this.net, 4);
    },
    handleGetNum(type) {
      if (type === 'cpu') {
        this.cpu = this.stakeList[this.selectIndex].cpu_weight.split(' ')[0];
        return;
      }
      this.net = this.stakeList[this.selectIndex].net_weight.split(' ')[0];
    },
    // 输入框验证
    handleReg() {
      if (!Number(this.net) && !Number(this.cpu)) {
        this.toast = true;
        this.toastInfo = this.$t('newpos.inputTipStake')
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        return;
      }
      if (Number(this.cpu) > Number(this.stakeList[this.selectIndex].cpu_weight.split(' ')[0]) ||
        Number(this.net) > Number(this.stakeList[this.selectIndex].net_weight.split(' ')[0])) {
        this.toast = true;
        this.toastInfo = this.$t('newpos.notEnoughMortgage');
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        return;
      }
      this.handleRegAccountProxy();
    },
    // 验证账户代理权是否是平台的
    handleRegAccountProxy() {
      const index = this.dexProxyLists.findIndex(item => item === this.info.proxy);
      if (index !== -1) { // 不是平台代理 - 获取平台可用代理账户
        const stakeCount = Number(this.stakedCount); // 赎回购买 - 抵押票数不变
        const params = {
          stakeCount,
        }
        this.$http.get('/pool/getProxy', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.newProxy = res.proxy;
          this.handleUnstakedAndBuy(this.newProxy);
        });
        return;
      }
      this.handleUnstakedAndBuy(this.info.proxy);
    },
    async handleUnstakedAndBuy(proxy) {
      const obj = {
        proxy,
        receiver: this.stakeList[this.selectIndex].to, // 其它用户给你的抵押
        fromCpu: `${toFixed(this.cpu, 4)} ${this.coin}`,
        fromNet: `${toFixed(this.net, 4)} ${this.coin}`,
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const actions = [];
      if (obj.proxy) {
        actions.unshift({ // 投票
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            voter: fromName,
            proxy: obj.proxy, // 投票的节点名称
            producers: [],
          },
        })
      }
      const buyaction = [
        {
          account: 'eosio',
          name: 'unstaketorex',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            receiver: obj.receiver || fromName, // 其它用户给你的抵押
            from_net: obj.fromNet,
            from_cpu: obj.fromCpu
          },
        },
      ];
      actions.push(...buyaction);
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
      Toast(this.$t('newpos.toastBuySuccess'));
      this.net = '';
      this.cpu = '';
      this.$emit('listenClose', true)
      // DApp.rexUnstaketorexTransaction(params, (err, res) => {
      //   if (err) {
      //     this.toast = true;
      //     this.toastInfo = this.$t('newpos.toastBuyFail');
      //     setTimeout(() => {
      //       this.toast = false;
      //     }, 2000);
      //     return;
      //   }
      //   if (res) {
      //     Toast(this.$t('newpos.toastBuySuccess'));
      //     this.net = '';
      //     this.cpu = '';
      //     this.$emit('listenClose', true)
      //   }
      // });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.buyByStaked{
  font-size: .24rem;
  width: 6.8rem;
  background: #FFF;
  border-radius: .17rem;
  padding: .46rem .55rem .39rem;
  box-sizing: border-box;
  position: relative;

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

  .tip{
    color: $color-999;
  }

  .content{
    padding: .3rem 0;

    .item{
      display: flex;
      justify-content: space-between;

      .left{
        height: .73rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-width: 1.25rem;
        max-width: 1.25rem;
      }

      .right{
        min-width: 4.27rem;
        max-width: 4.27rem;
        position: relative;

        .account,
        .inputDiv{
          height: .73rem;
          box-sizing: border-box;
          border: 1px solid $color-input;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: .0417rem;
          padding-left: .22rem;
          padding-right: .15rem;
          position: relative;

          &.error{
            border: 1px solid $color-red;
          }

          input{
            width: 100%;
            height: 100%;
            font-size: .28rem;
          }

          .down,
          .up{
            position: absolute;
            display: block;
            border: .1rem solid transparent;
            border-top: .1rem solid $color-333;
            right: .21rem;
            top: 50%;
            transform: translate(0, -20%);
          }

          .up{
            border: .1rem solid transparent;
            border-bottom: .1rem solid $color-333;
            transform: translate(0, -60%);
          }

          .coin{
            font-size: .28rem;
            color: $color-999;
          }
        }

        .subTip,
        .staked{
          margin-top: .09rem;
          text-align: right;
          padding-right: .15rem;
          margin-bottom: .24rem;
        }
      }
    }
  }

  .btn{
    width: 5.3rem;
    height: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #FFF;
    margin: auto;
    border-radius: .0965rem;
    margin-bottom: .15rem;
    font-size: .27rem;
  }

  .bottomTip{
    font-size: .24rem;
    position: relative;
    padding-left: .12rem;

    &::before{
      content: '';
      position: absolute;
      width: .0612rem;
      height: .0612rem;
      background: $color-input;
      border-radius: .10rem;
      left: 0px;
      top: 50%;
      transform: translate(0px, -50%);
    }
  }
}
.selectMenu{
  background: white;
  box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
  width: 4.26rem;
  position: absolute;
  right: 0rem;
  top: .8rem;
  border-radius: .08rem;
  text-align: left;
  box-sizing: border-box;
  z-index: 1000;

  &::after{
    content: '';
    // border: 10px solid transparent;
    border: .1rem solid #FFF;
    position: absolute;
    top: -.08rem;
    right: .21rem;
    box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
    transform: rotate(45deg);
  }

  .select{
    padding: 0 .1rem;
    position: relative;
    z-index: 10;;
    background: #FFF;
    font-size: .28rem;
    max-height: 2.58rem;
    overflow: auto;
    border-radius: .08rem;

    &>div{
      line-height: .86rem;
      height: .86rem;
      border-bottom: 1px solid $color-e3e3e3;
      padding-left: .15rem;

      &:last-child{
        border-bottom: 0px solid $color-e3e3e3;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
