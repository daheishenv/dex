<template>
  <section @click="showSelect = false;">
    <div class="header-title">
      {{$t('exchange.exchangeUsdt')}}
      <!-- <i class="iconfont icon-huaban122" @click="$router.push({name:'exchangeUsdtRecord'})"></i> -->
    </div>
    <div class="container">
      <article class="box-bg">
        <div class="m-title">{{$t('exchange.use')}}</div>
        <div class="item">
          <!-- 显示列表名称 start -->
          <div class="checked-item color-333" >
              <img class="checked-img" :src="chainList[selectType].icon" alt />
              <div><span>USDT</span> <span class="eos-chain">({{chainList[selectType].chain}}{{$t('exchange.chain')}})</span>
            </div>
          </div>
            <!-- 显示列表名称 end -->
        </div>

        <!-- 兑换icon -->
        <div class="justifyCenter color-this" @click="reverse = !reverse">
          <div class="circle">
            <span class="iconfont icon-huaban123 exchangeIcon"></span>
          </div>
        </div>

        <div class="m-title ">
              <span>{{$t('exchange.exchangeFor')}}</span>
              <span class="chainNum">
                1 USDT (EOS{{$t('exchange.chain')}}) = 1 USDT ({{chainList[selectType].reChain }}{{$t('exchange.chain')}})</span>
        </div>
        <div class="item">
          <!-- 显示列表名称 start -->
          <div class="checked-item color-333">
              <img class="checked-img" :src="chainList[selectType].icon" alt />
              <div><span>USDT</span> <span class="eos-chain">({{chainList[selectType].chain}}{{$t('exchange.chain')}})</span>
            </div>
          </div>
          <!-- 显示列表名称 end -->
        </div>
      </article>

      <article class="box-bg">
        <div>
          <div class="m-title color-333">
            <span>{{$t('exchange.need')}}</span>
            <span class="color-999" @click="handleCopyStaked">{{$t('exchange.balance')}}{{staked}}</span>
          </div>
            <!-- 数量输入框 -->
          <div class="inputDiv">
            <input class="input" :class="{'error': warnNum}" type="number" @click="warnNum = false"
            v-model="exchangeObj.quantity" :placeholder="$t('exchange.inputPLACE')" @blur="handleFixNum" />
            <div v-if="exchangeObj.quantity">
                <!-- 小于1时：兑换数量需≥1 USDT -->
                <div class="fl color-red" v-if="ltStaked" style="font-size: .24rem;">
                  <span >{{$t('exchange.warnNeed',{num:'1',coin:"USDT"})}} </span>
                </div>
                <!-- 大于1w时：兑换数量需≤10000 USDT -->
                <div class="fl color-red" v-if="ltStaked2" style="font-size: .24rem;">
                  <span >{{$t('exchange.warnNeedUsdt',{num:'10000',coin:"USDT"})}} </span>
                </div>
                <div class="fr color-red" v-if="gtStaked">
                <span style="font-size: .24rem;">{{$t('exchange.warnNeed2')}}</span>
                </div>
            </div>
          </div>
          <div style="margin-top:0.1rem;">
            <div class="m-title color-333">
              <span>USDT{{$t('exchange.tipReceive')}}
              <span class="eos-chain"> ({{chainList[selectType].reChain}}{{$t('exchange.chain')}})</span></span>
            </div>
            <div class="inputDiv">
              <input class="input" :class="{'error': warnAddress}" @click="warnAddress = false"
              type="text" v-model="toAccount" :placeholder="$t('exchange.usdtReceive',{coin:chainList[selectType].reChain})" />
            </div>
          </div>
        </div>

        </article>
         <div class="justifyEnd color-999" v-if="!reverse">
          <span style="margin-bottom: .2rem;" v-if="selectType === 0" @click="showFee = true" >
           {{$t('exchange.usdtFee')}}：0 USDT(TRON{{$t('exchange.chain')}}) <i class="iconfont icon-xinxi iconChain"></i> </span>
        </div>
        <div class="btn" :class="{'minerBtn': reverse}" @click="selSubmit(selectType)">{{$t('exchange.exchange')}}</div>
        <div class="justifyEnd color-999" v-if="reverse">
          <span @click="showMinerFee = true">{{$t('exchange.fee')}} <i class="iconfont icon-xinxi iconChain"></i></span>
        </div>
      <!-- 关于手续费 start -->
        <mt-popup class="mtPopup" v-model="showFee" popup-transition="popup-fade">
          <PopupFee v-if="showFee" :coin="chainList[selectType].reChain" @listenClose="handleClose" />
        </mt-popup>
      <!-- 关于手续费 end -->
      <!-- 关于矿工费 start -->
        <mt-popup class="mtPopup" v-model="showMinerFee" popup-transition="popup-fade">
          <PopupMinerFee v-if="showMinerFee" :coin="chainList[selectType].reChain" @listenClose="handleClose" />
        </mt-popup>
      <!-- 关于矿工费 end -->

      <!-- 弹窗确认信息 start -->
        <mt-popup
          class="mtPopup"
          v-model="showPopupExchange"
          popup-transition="popup-fade">
          <PopupExchangeUsdt
            v-if="showPopupExchange"
            :toAccount= 'toAccount'
            :account="account_name"
            :exchangeObj= "exchangeObj"
            @listenClose="handleClose"
          />
        </mt-popup>
      <!-- 弹窗确认信息 end -->
    </div>
  </section>
</template>

<script>
import DApp from '@/utils/wallet';
import { toFixed } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import { Toast, Popup } from 'mint-ui';
import PopupFee from './PopupFee';
import PopupExchangeUsdt from './PopupExchangeUsdt';
import PopupMinerFee from './PopupMinerFee';


export default {
  data() {
    return {
      chainList: [{
        type: 0,
        icon: '/static/exchange/EOS.png',
        reIcon: '/static/exchange/TRON.png',
        name: 'USDT',
        chain: 'EOS',
        reChain: 'TRON',
        contract: 'tethertether',
        accuracy: 8,
      },
      {
        type: 1,
        icon: '/static/exchange/EOS.png',
        reIcon: '/static/exchange/ETH.png',
        name: 'USDT',
        chain: 'EOS',
        reChain: 'ETH',
        contract: 'tethertether',
        accuracy: 8,
      }],
      selectType: 0, // 币种
      reverse: false, // 兑换调换
      showSelect: false, // 打开下拉列表
      showPopupExchange: false, // 兑换确认信息弹窗
      toAccount: '', // 转账地址
      account_name: '', // 自己账户名
      popupSubmit: false,
      exchangeObj: {
        quantity: null, // 转账数量
        startCoin: '', // 使用的币种
        endCoin: '', // 想兑换的币种
        useCoinUrl: '', // 使用的币种图片
        getCoinUrl: '', // 想兑换的币种图片
      },
      staked: '', // 账号余额
      warnNum: false,
      warnAddress: false,
      ethAddress: '', // 以太坊入账地址
      tronAddress: '', // tron入账地址
      showFee: false, // 关于手续费弹窗
      showMinerFee: false, // 关于矿工费弹窗
      // memo: ''
    };
  },
  computed: {
    ltStaked() {
      return Number(this.exchangeObj.quantity) < 1
    },
    ltStaked2() {
      return Number(this.exchangeObj.quantity) > 10000
    },
    gtStaked() {
      const staked = Number(this.staked.split(' ')[0])
      return Number(this.exchangeObj.quantity) > staked
    },
  },
  created() {
    this.account_name = this.$store.state.app.accountInfo.account
    this.tronAddress = this.$store.state.app.vipInfo.tronAddress
    this.ethAddress = this.$store.state.app.vipInfo.ethAddress
    this.getCurrencyBalance()
  },
  watch: {
    // reverse(newVal) {
    //   if (newVal) {
    //     this.getCurrencyAddress()
    //   }
    // }
  },
  methods: {
    // 复制余额到输入框
    handleCopyStaked() {
      const staked = Number(this.staked.split(' ')[0])
      this.exchangeObj.quantity = toFixed(staked, 4)
    },
    // 关闭弹窗
    handleClose() {
      this.showPopupExchange = false;
      this.showFee = false
      this.showMinerFee = false
    },
    // 下拉框选择
    handleSelectItem(item) {
      this.selectType = item.type
      this.showSelect = false;
    },
    // 失去焦点input数据
    handleFixNum() {
      this.exchangeObj.quantity = toFixed(Number(this.exchangeObj.quantity), 4)
    },
    // 获取账户转入地址
    getCurrencyAddress() {
    },
    async getCurrencyBalance() {
      const params = {
        code: 'tethertether',
        symbol: 'USDT',
        account: this.$store.state.app.accountInfo.account
      }
      const balance = await DApp.getBalance(params);
      if (balance || balance === 0) {
        this.staked = balance;
        window.clearTimeout(this.timer)
      } else {
        this.staked = `0.0000 ${params.coin}`;
        this.timer = window.setTimeout(() => {
          this.getCurrencyBalance()
        }, 3000);
      }

      // DApp.getCurrencyBalance(obj, (err, res) => {
      //   if (err) {
      //     this.timer = window.setTimeout(() => {
      //       this.getCurrencyBalance()
      //     }, 500)
      //     return
      //   }

      //   const result = toFixed(res.split(' ')[0], 4)
      //   this.staked = `${result} ${res.split(' ')[1]}`
      //   window.clearTimeout(this.timer)
      // })
    },
    // 转出兑换
    selSubmit(type) {
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   accountToSign(this, () => {
      //     this.selSubmit(type)
      //   })
      //   return
      // }
      // 币种转换情况
      if (this.reverse) {
        this.reverseSubmit()
        return
      }
      if (this.ltStaked || this.gtStaked || !this.exchangeObj.quantity) {
        this.warnNum = true
        return
      }
      if (!this.toAccount) {
        this.warnAddress = true
        return
      }
      // 弹窗币种
      this.exchangeObj.startCoin = this.chainList[type].chain
      this.exchangeObj.endCoin = this.chainList[type].reChain
      this.exchangeObj.contract = this.chainList[type].contract
      this.exchangeObj.useCoinUrl = this.chainList[type].icon
      this.exchangeObj.getCoinUrl = this.chainList[type].reIcon
      const address = type ? this.ethAddress : this.tronAddress
      this.exchangeObj.address = address
      this.showPopupExchange = true
    },
    // 转入兑换地址
    reverseSubmit() {
      let address = this.selectType ? this.ethAddress : this.tronAddress
      if (!address) {
        this.$http.post('account/getConvertAddress').then((res) => {
          if (res.code === 401) {
            accountToSign(this, () => {
              this.reverseSubmit()
            })
            return
          }
          if (res.code !== 0) {
            return
          }
          address = this.selectType ? res.ethAddress : res.tronAddress
          const obj = {
            chain: this.chainList[this.selectType].reChain,
            address
          }
          sessionStorage.setItem('exchangeUsdt', JSON.stringify(obj))
          this.$router.push({ name: 'exchangeUsdtAddress' })
        })
        return
      }
      const obj = {
        chain: this.chainList[this.selectType].reChain,
        address
      }
      sessionStorage.setItem('exchangeUsdt', JSON.stringify(obj))
      this.$router.push({ name: 'exchangeUsdtAddress' })
    },
    // 错误提示
    failToast() {
      Toast({
        message: this.$t('toastTip.fail'),
        position: 'center',
        duration: 2000,
      });
    }
  },
  components: {
    PopupExchangeUsdt,
    PopupFee,
    PopupMinerFee,
    mtPopup: Popup,
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";
.header-title {
  position: relative;
  width: 100%;
  height: 0.9rem;
  background-color: #fff;
  text-align: center;
  line-height: 0.9rem;
  font-size: 0.36rem;
  color: #333;
  border-bottom: 0.1rem solid #fafafa;
  .icon-huaban122 {
    font-size: 0.4rem;
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
.container {
  width: 100%;
  background: #ffffff;
  padding: 0.46rem 0.5rem 0.33rem;
  box-sizing: border-box;
  position: relative;
  font-size: 0.28rem;
  min-height: calc(100vh - 2rem);
  .btn {
    // width: 4.9rem;
    height: 0.77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #fff;
    margin: auto;
    border-radius: 0.1rem;

    font-size: 0.26rem;
    &.minerBtn{
      margin-top: 0.3rem;
    }
  }
  .eos-chain{
    font-size: 0.21rem;
    color: #3A3949;
    margin-left: 0.05rem;
  }
  .justifyEnd {
      // padding-right: 0.2rem;
      line-height: 0.6rem;
      width: 100%;
      display: flex;
      font-size: 0.23rem;
      justify-content: flex-end;
      .iconChain{
        font-size: .23rem;
        color: #999;
      }
    }
  .box-bg {
    padding: 0.4rem 0.4rem .1rem;
    &:first-child{
     border-radius: .1rem;
     background: #E9F2FF;
     padding: 0.4rem;
    }
  }
  .m-title {
    color: $color-this;
    font-size: 0.25rem;
    display: flex;
    line-height: 0.6rem;
    justify-content: space-between;
    .chainNum{
      font-size: .2rem;
      color: #999;
    }
  }
  .staked{
    line-height: 0.4rem;
    padding: 0 0.1rem;
    display: inline-block;
  }
  .item {
    position: relative;
    // 打开下拉框
    .selectMenu {
      background: #fff;
      box-shadow: 0px 0px 0.07rem rgba(74, 144, 226, 0.31);
      // width: 2.8rem;
      width: 100%;
      position: absolute;
      right: 0;
      top: 0.75rem;
      border-radius: 0.13rem;
      padding: 0rem 0.2rem;
      // text-align: center;
      box-sizing: border-box;
      z-index: 20;
      &::after {
        content: "";
        // border: 10px solid transparent;
        border: 0.1rem solid white;
        position: absolute;
        top: -0.1rem;
        right: 0.3rem;
        box-shadow: 0px 0px 0.07rem rgba(74, 144, 226, 0.31);
        transform: rotate(45deg);
      }

      .select {
        position: relative;
        z-index: 10;
        background: #fff;
        font-size: 0.25rem;

        .selectMenuItem {
          display: flex;
          flex: 1;
          align-items: center;
          vertical-align: middle;
          // line-height: 0.86rem;
          height: 0.86rem;
        }
        & > div {
          // line-height: 0.86rem;
          // height: 0.86rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid $color-e3e3e3;
          &:last-child {
            border-bottom: 0px solid $color-e3e3e3;
          }
        }
      }
    }
  }
}
// 列表和下拉框图片大小通用
.checked-img {
  width: 0.42rem;
  height: 0.42rem;
  margin-right: 0.1rem;
  // margin-top: -0.08rem;
}
.checked-item {
  background-color: #fff;
  position: relative;
  border: 1px solid $color-input;
  width: 100%;
  height: 0.73rem;
  border-radius: 0.0417rem;
  padding-left: 0.2rem;
  box-sizing: border-box;
  font-size: 0.28rem;
  display: flex;
  align-items: center;

  div {
    flex: 1;
    display: flex;
    align-items: center;
    // line-height: 0.73rem;
    // span {
    //   font-weight: bold;
    // }
  }
  .showSubMenuIcon {
    border: 0.08rem solid transparent;
    border-top: 0.08rem solid black;
    margin-right: 0.3rem;
    margin-top: 0.04rem;

    &.show {
      transform: rotate(180deg);
      margin-top: -0.08rem;
      border-top: 0.08rem solid $color-this;
    }
  }
}
.inputDiv {
  overflow: hidden;
  .input {
    box-sizing: border-box;
    border: 1px solid $color-input;
    width: 100%;
    height: 0.73rem;
    border-radius: 0.0417rem;
    padding-left: 0.2rem;
    font-size: 0.25rem;
    margin-bottom: 0.1rem;
  }
  .error{
    border: 1px solid $color-red;
  }
}
// 相反兑换账户名地址
.my-account{
  background: #FAFAFA;
  border-radius: 0.0434rem;
  height: 0.72rem;
  line-height: 0.72rem;
  width: 100%;
  font-size: 0.27rem;
  padding-left: 0.24rem;
  box-sizing: border-box;
  color: #A2A2A2;
}
// 兑换iconfont 图标
.justifyCenter {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 0.6rem;
  margin: 0.4rem 0 0.2rem 0;
  .circle {
    font-size: 0.4rem;
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    text-align: center;
    background-color: #fff;
    border: 1px solid $color-this;
  }
  .exchangeIcon{
    font-size: 0.3rem;
  }
}
.popup{
  border-radius: 0.2rem;
}
</style>

