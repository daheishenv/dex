<template>
  <section @click="handleShowSelect = false;">
    <div class="header-title">
      {{$t('exchange.exchange')}}
      <i class="iconfont icon-huaban122" @click="$router.push('/exchangeRecord')"></i>
    </div>
    <div class="container">
      <article class="box-bg">
        <div class="m-title">{{$t('exchange.use')}}</div>
        <div class="item">
          <div
            class="select"
            @click.stop="handleShowSelect = !handleShowSelect"
            :class="{'color-this': handleShowSelect}"
          >
            <!-- 下拉列表 start -->
            <div class="selectMenu" v-if="handleShowSelect">
              <div class="select color-333" >
                <div  v-for="item in list" :key="item.type"  v-show="item.type !== selectType">
                  <div class="selectMenuItem" @click.stop="handleSelectItem(item)" v-if="!reverse">
                      <img class="checked-img" :src="item.img" />
                    <span>{{item.name}} </span> <span class="eos-chain"> (EOS{{$t('exchange.chain')}})</span>
                  </div>
                  <div v-else class="selectMenuItem" @click.stop="handleSelectItem(item)">
                    <img class="checked-img" :src="item.relImg" />
                    <span>{{item.relevant}}</span> <span class="eos-chain"> (BTC{{$t('exchange.chain')}})</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 下拉列表 end -->
            <div class="checked-item" v-if="selectType === 0 && !reverse">
              <img class="checked-img" src="https://ndi.340wan.com/eos/bitpietokens-ebtc.png" alt />
              <div>
                <span>EBTC</span> <span class="eos-chain" :class="{'color-this': handleShowSelect}"> (EOS{{$t('exchange.chain')}})</span>
              </div>
              <span class="showSubMenuIcon" :class="{'show': handleShowSelect}"></span>
            </div>
            <div class="checked-item" v-if="selectType === 0 && reverse">
              <img class="checked-img" src="https://ndi.340wan.com/upload/20190725/d5757dd9d73f4b78994799ef7e53df90.png" alt />
              <div>
                <span>BTC</span> <span class="eos-chain" :class="{'color-this': handleShowSelect}"> (BTC{{$t('exchange.chain')}})</span>
              </div>
              <span class="showSubMenuIcon" :class="{'show': handleShowSelect}"></span>
            </div>
            <div class="checked-item" v-if="selectType === 1 && !reverse">
              <img class="checked-img" src="https://ndi.340wan.com/eos/bitpietokens-eusd.png" alt />
              <div>
                <span>EUSD</span> <span class="eos-chain" :class="{'color-this': handleShowSelect}"> (EOS{{$t('exchange.chain')}})</span>
              </div>
              <span class="showSubMenuIcon" :class="{'show': handleShowSelect}"></span>
            </div>
            <div class="checked-item" v-if="selectType === 1 && reverse">
              <img class="checked-img" src="https://ndi.340wan.com/upload/20190725/1b3aa8830f584448a1a2f8cb2b717adc.png" alt />
              <div>
                <span>USDT</span> <span class="eos-chain" :class="{'color-this': handleShowSelect}"> (BTC{{$t('exchange.chain')}})</span>
              </div>
              <span class="showSubMenuIcon" :class="{'show': handleShowSelect}"></span>
            </div>
          </div>
        </div>
        <!-- 兑换icon -->
        <div class="justifyCenter color-this" @click="reverse = !reverse">
          <div class="circle">
            <span class="iconfont icon-huaban123 exchangeIcon"></span>
          </div>
        </div>
        <div class="item">
          <div class="m-title ">
              <span>{{$t('exchange.exchangeFor')}}</span>
              <span class="color-999" v-if="selectType === 0 && reverse">1 BTC=1 EBTC</span>
              <span class="color-999" v-else-if="selectType === 0 && !reverse">1 EBTC=1 BTC</span>
              <span class="color-999" v-if="selectType === 1 && reverse">1 USDT= 1 EUSD </span>
              <span class="color-999" v-if="selectType === 1 && !reverse">1 EUSD=1 USDT</span>
          </div>
            <!-- 显示列表名称 start -->
          <div class="checked-item color-666" v-if="selectType === 0 && reverse">
              <img class="checked-img" src="https://ndi.340wan.com/eos/bitpietokens-ebtc.png" alt />
              <div>
                <span>EBTC</span> <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
              </div>
            </div>
            <div class="checked-item color-666" v-if="selectType === 0 && !reverse">
              <img class="checked-img" src="https://ndi.340wan.com/upload/20190725/d5757dd9d73f4b78994799ef7e53df90.png" alt />
              <div>
                <span>BTC</span>  <span class="eos-chain">(BTC{{$t('exchange.chain')}})</span>
              </div>
            </div>
            <div class="checked-item color-666" v-if="selectType === 1 && reverse">
              <img class="checked-img" src="https://ndi.340wan.com/eos/bitpietokens-eusd.png" alt />
              <div>
                <span>EUSD</span> <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
              </div>
            </div>
            <div class="checked-item color-666" v-if="selectType === 1 && !reverse">
              <img class="checked-img" src="https://ndi.340wan.com/upload/20190725/1b3aa8830f584448a1a2f8cb2b717adc.png" alt />
              <div>
                <span>USDT</span> <span class="eos-chain">(BTC{{$t('exchange.chain')}})</span>
              </div>
            </div>
          <!-- 显示列表名称 start -->
        </div>
      </article>
      <article class="box-bg">
        <div v-if="!reverse">
          <div class="m-title color-333">
            <span>{{$t('exchange.need')}}</span>
            <span class="color-999" @click="copyStaked">{{$t('exchange.balance')}}{{staked}}</span>
          </div>
            <!-- 数量输入框 -->
          <div class="inputDiv">
            <input class="input"
            :class="{redWarn: warnNum}"
            type="number"
            v-model="exchangeObj.quantity"
            :placeholder="$t('exchange.inputPLACE')"
            @blur="toFixNum"
             />
            <div v-if="exchangeObj.quantity">
                <div class="fl color-red" v-if="ltStaked" style="font-size: .24rem;">
                <span v-if="selectType === 1"> {{$t('exchange.warnNeed',{num:'20',coin:"EUSD"})}}</span>
                    <span v-else>{{$t('exchange.warnNeed',{num:'0.001',coin:"EBTC"})}} </span>
                </div>
                <div class="fr color-red" v-if="gtStaked">
                <span style="font-size: .24rem;">{{$t('exchange.warnNeed2')}}</span>
                </div>
            </div>
          </div>
        </div>
        <div style="margin-top:0.1rem;" v-if="!reverse">
           <div class="m-title color-333">
            <span>{{list[selectType].relevant}}{{$t('exchange.tipReceive')}} <span class="eos-chain"> (BTC{{$t('exchange.chain')}})</span></span>
          </div>
          <div class="inputDiv">
            <input class="input"
            :class="{redWarn: warnAddress}"
            type="text" v-model="toAccount"
            :placeholder="$t('exchange.Receive',{coin:list[selectType].relevant})" />
          </div>
        </div>

        <div style="margin-top:0.1rem;" v-else>
           <div class="m-title color-333">
            <span>{{list[selectType].name}} {{$t('exchange.account')}}
              <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
            </span>
           </div>
          <div class="my-account">{{account}}</div>
        </div>
        </article>
        <div class="btn" @click="selSubmit(selectType)">{{$t('exchange.exchange')}}</div>
        <div class="justifyEnd color-999">
          <span>{{$t('exchange.fee')}}</span>
        </div>
      <!-- 弹窗兑换地址 start -->
        <mt-popup
          class="popup"
          v-model="isPopupAddress"
          popup-transition="popup-fade">
          <PopupAddress
            v-if="isPopupAddress"
            :address= 'address'
            :addressTitle= "addressTitle"
            :addressDesc= "addressDesc"
            @listenClose="handleClosePopup"
          />
        </mt-popup>
      <!-- 弹窗兑换地址 end -->

      <!-- 弹窗确认信息 start -->
        <mt-popup
          class="popup"
          v-model="isPopupExchange"
          popup-transition="popup-fade">
          <PopupExchange
            v-if="isPopupExchange"
            :toAccount= 'toAccount'
            :account="account"
            :exchangeObj= "exchangeObj"
            @listenClose="handleClosePopup"
          />
        </mt-popup>
      <!-- 弹窗确认信息 end -->
    </div>
  </section>
</template>

<script>
import DApp from '@/utils/wallet';
import { toFixed } from '@/utils/public';
import { Toast, Popup } from 'mint-ui';
import { getAccountExchangeAddress } from '@/utils/publicApi';
import PopupAddress from './PopupAddress';
import PopupExchange from './PopupExchange';

export default {
  data() {
    return {
      list: [
        { type: 0,
          name: 'EBTC',
          relevant: 'BTC',
          contract: 'bitpietokens',
          img: 'https://ndi.340wan.com/eos/bitpietokens-ebtc.png',
          relImg: 'https://ndi.340wan.com/upload/20190725/d5757dd9d73f4b78994799ef7e53df90.png',
          percent: 8,
          chain: 'btc'
        },
        {
          type: 1,
          name: 'EUSD',
          relevant: 'USDT',
          contract: 'bitpietokens',
          img: 'https://ndi.340wan.com/eos/bitpietokens-eusd.png',
          relImg: 'https://ndi.340wan.com/upload/20190725/1b3aa8830f584448a1a2f8cb2b717adc.png',
          percent: 8,
          chain: 'btc'
        },
      ],
      selectType: 0,
      reverse: false, // 兑换调换
      handleShowSelect: false, // 打开下拉列表
      isPopupAddress: false, // 兑换地址弹窗
      isPopupExchange: false, // 兑换确认信息弹窗
      toAccount: '', // 转账地址
      account: '', // 自己账户名
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
      address: '', // EOS兑换地址
      secondLock: true,
      addressTitle: '', // 弹窗地址标题
      addressDesc: '', // 弹窗地址下标
    };
  },
  computed: {
    ltStaked() {
      if (this.selectType === 1) {
        return Number(this.exchangeObj.quantity) < 20
      }
      return Number(this.exchangeObj.quantity) < 0.001
    },
    gtStaked() {
      const staked = Number(this.staked.split(' ')[0])
      return Number(this.exchangeObj.quantity) > staked
    }
  },
  created() {
    this.account = this.$store.state.app.accountInfo.account
    // 刚进入页面选择币种
    const code = this.$route.params.symbol
    switch (code) {
      case 'EBTC':
        this.getCurrencyBalance(0)
        // this.selectType = 0
        break;
      case 'EUSD':
        this.selectType = 1
        break;
      default:
        this.$router.push('/')
    }
  },
  watch: {
    selectType: {
      handler(val) {
        if (!this.reverse) {
          this.getCurrencyBalance(val)
        }
      },

    },
    'exchangeObj.quantity': function listen(val) {
      if (val) {
        this.warnNum = false
      }
    },
    toAccount(val) {
      if (val.length > 0) this.warnAddress = false
    },

  },
  methods: {
    // 复制余额到输入框
    copyStaked() {
      const staked = Number(this.staked.split(' ')[0])
      this.exchangeObj.quantity = toFixed(staked, this.list[this.selectType].percent)
    },
    // 关闭弹窗
    handleClosePopup() {
      this.isPopupAddress = false;
      this.isPopupExchange = false;
    },
    // 下拉框选择
    handleSelectItem(item) {
      this.selectType = item.type
      this.handleShowSelect = false;
    },
    // 失去焦点input数据
    toFixNum() {
      this.exchangeObj.quantity = toFixed(Number(this.exchangeObj.quantity), this.list[this.selectType].percent)
    },
    // 获取账户余额
    async getCurrencyBalance(type) {
      const params = {
        code: this.list[type].contract,
        symbol: this.list[type].name,
        account: this.$store.state.app.accountInfo.account
      }
      const balance = await DApp.getBalance(params);
      if (balance || balance === 0) {
        this.eosBalance = balance;
      } else {
        this.eosBalance = `0.0000 ${params.coin}`;
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
      //   const result = toFixed(res.split(' ')[0], this.list[type].percent)
      //   this.staked = `${result} ${res.split(' ')[1]}`
      //   window.clearTimeout(this.timer)
      // })
    },
    // 提交兑换
    selSubmit(type) {
      // 币种转换情况
      if (this.reverse) {
        this.reverseSubmit(type)
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
      this.exchangeObj.startCoin = this.list[type].name
      this.exchangeObj.endCoin = this.list[type].relevant
      this.exchangeObj.contract = this.list[type].contract
      this.exchangeObj.useCoinUrl = this.list[type].img
      this.exchangeObj.getCoinUrl = this.list[type].relImg
      // this.exchangeObj.quantity = toFixed(Number(this.exchangeObj.quantity), this.list[type].percent)
      this.isPopupExchange = true
    },
    // btc兑换地址
    reverseSubmit(type) {
      const coin = type === 0 ? 'EBTC' : 'EUSD'
      this.addressTitle = type === 0 ? 'BTC' : 'USDT'
      this.addressDesc = coin
      this.address = ''
      getAccountExchangeAddress(async (err, res) => {
        if (err) {
          this.failToast()
          return
        }
        const result = res.data.rows
        result.forEach((item) => {
          if (item.symbol === coin) {
            this.address = item.address
            this.isPopupAddress = true
          }
        });
        if (!this.address && this.secondLock) {
          this.secondLock = false
          // const symbol = type === 0 ? 'EBTC' : 'EUSD'
          const obj = { symbol: coin }
          // 合约执行
          const fromName = this.$store.state.app.accountInfo.account;
          const permission = this.$store.state.app.accountInfo.permissions;
          const actions = [{
            account: 'bitpiecurrex', // 兑换合约名 - bitpiecurrex
            name: 'newaddress', // 方法名
            authorization: [{
              actor: fromName, // 用户名
              permission, // 许可证
            }],
            data: {
              user: fromName,
              symbol: obj.symbol, // 兑换币种 - EBTC | EUSD
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
          this.reverseSubmit(type);
          // DApp.newaddress(obj, (errs) => {
          //   if (errs) {
          //     this.secondLock = true
          //     this.failToast()
          //     return
          //   }
          //   this.reverseSubmit(type)
          // })
          return;
        }
        if (!this.secondLock) {
          Toast({
            message: this.$t('exchange.newAddress'),
            position: 'center',
            duration: 2000,
          });
        }
      })
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
    PopupAddress,
    PopupExchange,
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
    margin-top: 0.3rem;
    font-size: 0.26rem;
  }
  .eos-chain{
    font-size: 0.21rem;
    color: #3A3949;
    margin-left: 0.05rem;
  }
  .justifyEnd {
      padding-right: 0.2rem;
      line-height: 0.6rem;
      width: 100%;
      display: flex;
      font-size: 0.25rem;
      justify-content: flex-end;
    }
  .box-bg {
    padding: 0.4rem;
    &:first-child{
     border-radius: .1rem;
     background: #E9F2FF;
    }
  }
  .m-title {
    color: $color-this;
    font-size: 0.25rem;
    display: flex;
    line-height: 0.6rem;
    justify-content: space-between;
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
      background: white;
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
          align-items: center;
          vertical-align: middle;
          // line-height: 0.86rem;
          height: 0.86rem;
        }
        & > div {
          line-height: 0.86rem;
          height: 0.86rem;
          border-bottom: 1px solid $color-e3e3e3;
          &:last-child {
            border-bottom: 0px solid $color-e3e3e3;
          }
        }
      }
    }
  }
}
// 列表和下拉框图片大小通用,写出来
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
  margin-bottom: 0.1rem;
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
    font-size: 0.28rem;
    margin-bottom: 0.1rem;
  }
  .redWarn{
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

