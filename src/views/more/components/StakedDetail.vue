<template>
  <!-- 抵押详情 start -->
  <div class="stakeDetail" :class="{'isPopup': $route.name === 'stakeNdx'}" :style="`height: ${height}px`">
    <span class="iconfont icon-huaban17 popupClose" v-if="$route.name === 'stakeNdx'" @click="listenClose"></span>
    <!-- <span class="iconfont icon-huaban11 back"></span> -->
    <div class="title">{{ $t('vip.stakedOtherDetail') }}</div>
    <div class="content">
      <div class="noData" v-if="!list.length">
        <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div>{{ $t('vip.noStakedData') }}</div>
      </div>
      <div class="item" v-for="(item, $index) in list" :key="$index">
        <div class="account">
          <span>{{ $t('newpos.account') }}:</span>
          <span>{{ item.stakefor }}</span>
          <span>({{ item.blockchain.toUpperCase() }})</span>
        </div>
        <div class="staked">
          <span @click="handleNum(item)">
            <span>{{ $t('vip.mortgage') }}:</span>
            <span>{{ item.amount }}</span>
            <span>NDX</span>
          </span>
          <span @click="handleShowTool($index)">
            <span>{{ $t('vip.redeem') }}</span>
            <span class="iconfont icon-huaban11 down"
              :class="{'up': item.showTool}"></span>
          </span>
        </div>
        <div class="hide" v-if="item.showTool">
          <div class="inputDiv" :class="{'error': error && !Number(num)}">
            <div><input type="number" v-model="num" :placeholder="$t('vip.inputTipRedeem')"
              @blur="hamdleInputBlur"></div>
            <div @click="handleStake(item)">{{ $t('public.sure') }}</div>
          </div>
          <div class="tip">{{ $t('vip.unstakedTip') }}</div>
        </div>
      </div>
    </div>

    <!-- 自定义吐司 -->
    <transition name="fade">
      <div class="myToast" v-if="toast">{{ toastInfo }}</div>
    </transition>

  </div>
  <!-- 抵押详情 end -->
</template>

<script>
import axios from 'axios';
import DApp from '@/utils/wallet';
import { toFixed } from '@/utils/public';
import { AppActions } from '@/utils/publicApi';
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      list: [],
      num: '',
      error: false,
      toastInfo: '',
      toast: false,
    }
  },
  props: [
    'height',
    'isRoute'
  ],
  watch: {
    num(newVal, oldVal) {
      if (newVal < 0) {
        this.num = oldVal;
      }
    },
  },
  mounted() {
    this.handleGetStakedDetail();
  },
  methods: {
    // 带数量
    handleNum(item) {
      if (item.showTool) {
        this.num = item.amount;
      }
    },
    listenClose() {
      this.$emit('listenClose', false)
    },
    // input 失去焦点处理
    hamdleInputBlur() {
      this.num = toFixed(Math.abs(this.num), 4);
    },
    // 获取抵押明细
    handleGetStakedDetail() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stake2others',
          scope: this.$store.state.app.accountInfo.encodeName,
          json: true,
          limit: 1000,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            const list = res.data.rows;
            list.forEach((item) => {
              const amount = toFixed(Decimal.div(item.amount, 10000), 4);
              this.$set(item, 'amount', amount);
              this.$set(item, 'showTool', false);
            });
            this.list = list;
            return;
          }
          this.list = [];
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetStakedDetail();
        }, 200);
      }
    },
    // 展示赎回
    handleShowTool(index) {
      this.num = '';
      this.error = false;
      this.list.forEach((item, i) => {
        if (index === i) {
          this.list[index].showTool = !this.list[index].showTool;
          return;
        }
        this.$set(item, 'showTool', false);
      });
    },
    // 赎回 -- unstake - 赎回
    async handleStake(item) {
      if (!this.num || !Number(this.num)) {
        this.error = true;
        return;
      }
      if (Number(this.num) <= 0) {
        return;
      }
      if (Number(this.num) > item.amount) {
        this.toast = true;
        this.toastInfo = this.$t('vip.overUnstaked');
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        return;
      }
      const obj = {
        name: 'unstake',
        quantity: `${this.num} NDX`,
        blockchain: item.blockchain,
        stakefor: item.stakefor
      }
      if (this.tab === 1) {
        obj.blockchain = this.$store.state.app.accountInfo.chain;
        obj.stakefor = this.$store.state.app.accountInfo.account;
      }
      // 是否是APP打开？
      if (this.$store.state.sys.isAppView) {
        const newParams = {
          name: obj.name,
          account: 'newdexstaked',
          data: {
            blockchain: 'eos',
            owner: this.$store.state.app.accountInfo.account,
            quantity: obj.quantity,
            stakefor: obj.stakefor,
          }
        }
        AppActions([newParams])
        return;
      }
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [
          {
            account: 'newdexstaked', // 抵押账户
            name: obj.name || 'stake', // stake - 抵押 | unstake - 赎回
            authorization: [{
              actor: fromName, // 转账者
              permission, // 权限 active | owner
            }],
            data: {
              owner: fromName, // 转账者 - 'testtesttest'
              quantity: obj.quantity, // 数量 - '1.0000 NDX'
              blockchain: obj.blockchain, // 抵押账户所属链
              stakefor: obj.stakefor, // 抵押账户
            }
          }
        ]
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        this.toastInfo = this.$t('vip.redeemError');
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        // DApp.handleScatterErrorBack(result, (type, text) => {
        //   type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        // });
        return;
      }
      this.toastInfo = this.$t('vip.redeemSuccess');
      setTimeout(() => {
        this.toast = false;
      }, 2000);
      this.handleGetStakedDetail();
      // DApp.newdexStaked(params, (err, res) => {
      //   this.toast = true;
      //   if (err) {
      //     this.toastInfo = this.$t('vip.redeemError');
      //     setTimeout(() => {
      //       this.toast = false;
      //     }, 2000);
      //     return;
      //   }
      //   if (res) {
      //     this.toastInfo = this.$t('vip.redeemSuccess');
      //     setTimeout(() => {
      //       this.toast = false;
      //     }, 2000);
      //     this.handleGetStakedDetail();
      //   }
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

input::-webkit-input-placeholder{
  color: $color-999;
}

.popupClose{
  position: absolute;
  right: .2rem;
  top: .2rem;
  color: $color-333;
  font-size: .25rem;
}

.stakeDetail{
  font-size: .25rem;
  border-radius: .18rem;

  &.isPopup{
    width: 6.5rem;
    padding: .3rem;
    box-sizing: border-box;
  }

  .back{
    position: absolute;
    left: .2rem;
    top: .2rem;
    transform: rotate(180deg);
    font-size: .21rem;
  }

  .title{
    font-size: .32rem;
    color: $color-this;
    text-align: center;
    padding-bottom: .26rem;
  }

  .content{
    height: calc(100% - 1rem);
    overflow: auto;

    .noData{
      text-align: center;
      color: $color-999;
      margin-top: 30%;

      .imgNodata{
        margin-bottom: .2rem;
      }
    }

    .item{
      background: #F3F3F3;
      padding: .24rem .35rem;
      margin-bottom: .1rem;
      border-radius: .0417rem;

      &:last-child{
        margin-bottom: 0rem;
      }

      .account{
        &>span:nth-child(2){
          margin-left: .08rem;
        }
      }

      .account,
      .staked{
        font-size: .2812rem;
        display: flex;
        align-items: center;

        &>span:last-child{
          font-size: .21rem;
          margin-left: .12rem;
        }
      }

      .staked{
        justify-content: space-between;
        margin-top: .12rem;

        &>span:last-child{
          font-size: .25rem;
          display: flex;
          align-items: center;
          color: $color-this;

          .down{
            font-size: .22rem;
            transform: rotate(90deg);
            margin-left: .05rem;

            &.up{
              transform: rotate(-90deg);
            }
          }
        }
      }

      .hide{
        margin-top: .3rem;

        .inputDiv{
          margin-bottom: .15rem;
          display: flex;
          align-items: center;
          height: .58rem;
          border-radius: .0729rem;
          border: 1px solid $color-input;
          overflow: hidden;
          box-sizing: border-box;

          &.error{
            border: 1px solid $color-red;
          }

          &>div:first-child{
            flex: 1;

            input{
              width: 100%;
              height: .58rem;
              font-size: .24rem;
              padding-left: .15rem;
              box-sizing: border-box;
            }
          }

          &>div:last-child{
            width: 1.44rem;
            background: $color-this;
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: .25rem;
          }
        }

        .tip{
          font-size: .2188rem;
          color: $color-999;
        }
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
