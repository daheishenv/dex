<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('vip.upgradeType') }}</div>
    <div class="btn-box">
      <div class="btn" :class="{active: active === 0 }" @click="handleType(0)">{{ $t('vip.consumeNDX') }}</div>
      <div class="btn" :class="{active: active === 1 }" @click="handleType(1)">{{ $t('vip.mortgageNdx') }}</div>
    </div>
    <div class="content">
      <div class="item">
        <div v-if="type === 1 && active === 0 && Number(stakeNdx) !==0"
             class="notSeeCancel color-999" @click="hideCancel = !hideCancel">
          <span class="iconfont choice" :class="{'icon-huaban57': hideCancel}"></span>
          <span>{{ $t('vip.tipReplace',{num:stakeNdx}) }}</span>
        </div>
        <div v-else-if="type === 0 && active === 1" >{{ $t('vip.tipReplace2') }}</div>
      </div>
    </div>
    <div class="sureBtn" @click="handleUpgrade(active, type)">{{ $t('public.sure') }}</div>

  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { AppActions } from '@/utils/publicApi';

export default {
  data() {
    return {
      hideCancel: false, // 抵押 NDX换成消耗 是否赎回NDX
      active: -1 // 0 消耗NDX 1抵押NDX
    }
  },
  props: {
    type: Number, // 0代表消耗NDX类型 1 抵押NDX
    stakeNdx: String
  },
  mounted() {
    // 类型赋值 升级方式
    this.active = this.type
  },
  watch: {
    // active(val) {
    //   // console.log(this.type, val);
    //   if (this.type === 0 && val === 1) {
    //     this.showStake = true
    //   }
    // },
    type() {
      this.active = this.type
    }
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 选择升级方式
    handleType(active) {
      this.active = active
    },
    // 确认升级方式
    async handleUpgrade(active, type) {
      if (active === type) {
        this.$emit('listenClose', false)
        return
      }
      const obj = {
        type: active,
        unstake: this.hideCancel,
        amount: `${this.stakeNdx} NDX`
      }
      // 是否是APP打开？
      if (this.$store.state.sys.isAppView) {
        const newParams = [{
          name: 'choosemode',
          account: 'newdexstaked',
          data: {
            blockchain: 'eos',
            owner: this.$store.state.app.accountInfo.account,
            is_staked: obj.type,
          }
        }]
        if (obj.unstake) {
          const account = this.$store.state.app.accountInfo.account;
          newParams.unshift({
            account: 'newdexstaked', // 抵押账户
            name: 'unstake', // stake - 抵押 | unstake - 赎回
            data: {
              owner: account, // 转账者 - 'testtesttest'
              quantity: obj.amount, // 数量 - '1.0000 NDX'
              blockchain: 'eos', // 抵押账户所属链
              stakefor: account, // 抵押账户
            }
          })
        }
        AppActions(newParams)
        return;
      }
      // console.log(obj, 'choosemode')

      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{ // 切换会员升级状态
          account: 'newdexstaked',
          name: 'choosemode',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            owner: fromName,
            is_staked: obj.type, // 抵押 - true | false - 消耗
          },
        }]
      }
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
      this.$emit('listenChangeFunc', {
        name: 'changeFunc',
        type: active,
      })
      this.$emit('listenClose', false)
      // DApp.choosemode(obj, (err) => {
      //   if (err) {
      //     return;
      //   }
      //   this.$emit('listenChangeFunc', {
      //     name: 'changeFunc',
      //     type: active,
      //   })
      //   this.$emit('listenClose', false)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
.notSeeCancel{
  display: flex;
  // align-items: center;/*垂直居中*/

  .choice{
    border: 1px solid $color-input;
    display: inline-block;
    height: .3rem;
    width: .3rem;
    font-size: .3rem;
    border-radius: .04rem;
    color: $color-this;
    margin-right: .09rem;
    flex-shrink: 0;
    &.icon-huaban57{
      border: 1px solid transparent;
    }
  }
}
.rentTip{
  width: 6.21rem;
  background: #FFF;
  padding: .46rem .55rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #FFFFFF;
  border-radius: 0.1725rem;
  padding: 0.36rem 0.7rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #333;
  }

  .title{
    color: $color-this;
    text-align: center;
    margin-bottom: .4rem;
    color: #FFC78A;
    font-size: 0.36rem;
    color: #8B572A;
  }
  .item{
    display: flex;
    flex-direction: column;
    color: #333;
    font-size: 0.24rem;
    color: #9B9B9B;
    line-height: 0.3456rem;
  }
  .btn-box{
    display: flex;
    margin-bottom: .3rem;
    .btn{
      flex:1;
      height: .74rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      border: 0.02rem solid #ccc;
      border-radius: 0.1rem;
      box-sizing: border-box;

      font-size: 0.25rem;
      color: #9B9B9B;
      &:last-child{
        margin-left: 0.1rem;
      }
    }
    .active{
      background: rgba(242,219,164,0.40);
      border: 0.02rem solid #FFC78A;
      color: #F5A623;
    }
  }
  .sureBtn{
    background: #F6C85C;
    // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: 0.0965rem;
    font-size: 0.27rem;
    color: #8B572A;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.77rem;
    margin-top: 0.5rem;
  }
}
</style>
