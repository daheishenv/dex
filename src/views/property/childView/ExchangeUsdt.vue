<template>
  <section @click="showSelect = false;">
    <div class="header-title">
      {{$t('exchange.exchangeUsdt')}}

      <i class="iconfont icon-huaban122" @click="handleToExchangeRecord"></i>
    </div>
    <div class="container">
      <article class="box-bg">
        <div class="m-title">{{$t('exchange.use')}}</div>
        <div class="item">
          <!-- 显示列表名称 start -->
          <div class="checked-item color-333" v-if="!reverse" >
              <img class="checked-img" :src="chainList[selectType].icon" alt />
              <div><span>USDT</span> <span class="eos-chain">({{chainList[selectType].chain}}{{$t('exchange.chain')}})</span>
            </div>
          </div>
            <!-- 显示列表名称 end -->
            <!-- 相反情况 -->
          <div class="select" @click.stop="selectChainList" :class="{'color-this': showSelect}" v-else>
            <!-- 下拉列表 start -->
            <div class="selectMenu" v-if="showSelect">
              <div class="select color-333">
                <div v-for="item in chainList" :key="item.type" v-show="item.type !== selectType">
                  <div class="selectMenuItem" @click.stop="handleSelectItem(item)">
                      <img class="checked-img" :src="item.reIcon" />
                      <span>{{item.name}}</span> <span class="eos-chain">({{item.reChain}}{{$t('exchange.chain')}})</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 下拉列表 end -->
            <div class="checked-item color-333" >
              <img class="checked-img" :src="chainList[selectType].reIcon" alt />
              <div :class="{'color-this': showSelect}">
                <span>USDT</span><span class="eos-chain" :class="{'color-this': showSelect}">
                ({{chainList[selectType].reChain}}{{$t('exchange.chain')}})</span>
              </div>
              <span v-if="chainList.length > 1" class="showSubMenuIcon" :class="{'show': showSelect}"></span>
            </div>
          </div>
        </div>

        <!-- 兑换icon -->
        <div class="justifyCenter color-this" @click="reverse = !reverse">
          <div class="circle">
            <span class="iconfont icon-huaban123 exchangeIcon"></span>
          </div>
        </div>

        <div class="m-title ">
              <span>{{$t('exchange.exchangeFor')}}</span>
              <span class="chainNum" v-if="!reverse">
                1 USDT (EOS{{$t('exchange.chain')}}) = 1 USDT ({{chainList[selectType].reChain }}{{$t('exchange.chain')}})</span>
              <span class="chainNum" v-else>
                1 USDT ({{chainList[selectType].reChain}}{{$t('exchange.chain')}}) =1 USDT (EOS{{$t('exchange.chain')}})</span>
          </div>
        <div class="item">
          <!-- 显示列表名称 start -->
          <div class="select" v-if="!reverse" @click.stop="selectChainList" :class="{'color-this': showSelect}" >
            <!-- 下拉列表 start -->
            <div class="selectMenu" v-if="showSelect">
              <div class="select color-333">
                <div v-for="item in chainList" :key="item.type" v-show="item.type !== selectType">
                  <div class="selectMenuItem" @click.stop="handleSelectItem(item)">
                      <img class="checked-img" :src="item.reIcon" />
                      <span>{{item.name}}</span> <span class="eos-chain"> ({{item.reChain}}{{$t('exchange.chain')}})</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 下拉列表 end -->
            <div class="checked-item" >
              <img class="checked-img" :src="chainList[selectType].reIcon" alt />
              <div><span>USDT</span><span class="eos-chain" :class="{'color-this': showSelect}">
                ({{chainList[selectType].reChain}}{{$t('exchange.chain')}})</span>
              </div><span v-if="chainList.length > 1" class="showSubMenuIcon" :class="{'show': showSelect}"></span>
            </div>
          </div>

           <!-- 相反情况 -->
          <div class="checked-item color-333" v-else>
              <img class="checked-img" :src="chainList[selectType].icon" alt />
              <div><span>USDT</span> <span class="eos-chain">({{chainList[selectType].chain}}{{$t('exchange.chain')}})</span>
            </div>
          </div>
          <!-- 显示列表名称 end -->

        </div>
      </article>

      <article class="box-bg">
        <div v-if="!reverse">
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
                  <span >{{$t('exchange.warnNeed', {num: minLimit, coin:"USDT"})}} </span>
                </div>
                <!-- 大于1w时：兑换数量需≤10000 USDT -->
                <!-- <div class="fl color-red" v-if="ltStaked2" style="font-size: .24rem;">
                  <span >{{$t('exchange.warnNeedUsdt',{num:'3000',coin:"USDT"})}} </span>
                </div> -->
                <div class="fr color-red" v-if="gtStaked">
                <span style="font-size: .24rem;">{{$t('exchange.warnNeed2')}}</span>
                </div>
            </div>
          </div>
          <div style="margin-top:0.1rem;">
            <div class="m-title color-333">
              <span>USDT{{$t('exchange.tipReceive')}}
              <span class="eos-chain"> ({{chainList[selectType].reChain}}{{$t('exchange.chain')}})</span></span>
              <i class="iconfont icon-huaban212" @click="handleCheckAddress(chainList[selectType].reChain)"></i>
            </div>
            <div class="inputDiv">
              <input class="input" :class="{'error': warnAddress}" v-if="selectType === 0" maxlength="34" @click="warnAddress = false"
              type="text" v-model="toAccount" :placeholder="$t('exchange.usdtReceive',{coin:chainList[selectType].reChain})" />
              <input class="input" :class="{'error': warnAddress}" v-else maxlength="42" @click="warnAddress = false"
              type="text" v-model="toAccount" :placeholder="$t('exchange.usdtReceive',{coin:chainList[selectType].reChain})" />

            </div>
          </div>
          <!-- <div style="margin-top:0.1rem;">
            <div class="m-title color-333">
              <span>{{$t('exchange.memo')}}</span>
            </div>
            <div class="inputDiv">
              <input class="input"
              type="text" v-model="memo" placeholder="Memo" />
            </div>
          </div> -->
        </div>

        <div style="margin-top:0.1rem;" v-else>
           <div class="m-title color-333">
            <span>USDT {{$t('exchange.account')}}
              <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
            </span>
           </div>
          <div class="my-account">{{account_name}}</div>
        </div>

        </article>
        <!-- v-if="!reverse" -->
         <div class="justifyEnd color-999" >
            <span @click="showMinerFee = true"> {{$t('exchange.aboutUsdt')}} <i class="iconfont icon-xinxi iconChain"></i></span>
          <!-- <span style="margin-bottom: .2rem;" v-if="selectType === 0" @click="showFee = true" >
           {{$t('exchange.usdtFee')}}：0 USDT(TRON{{$t('exchange.chain')}}) <i class="iconfont icon-xinxi iconChain"></i> </span>
          <span style="margin-bottom: .2rem;" v-else-if="selectType === 1" @click="showFee = true" >
           {{$t('exchange.usdtFee')}}：0.5 USDT(ETH{{$t('exchange.chain')}}) <i class="iconfont icon-xinxi iconChain"></i> </span> -->
        </div>
        <div class="btn" @click="selSubmit(selectType)">{{$t('exchange.exchangeShort')}}</div>
        <!-- <div class="justifyEnd color-999" >
          <span @click="showMinerFee = true"> *{{$t('exchange.aboutUsdt')}} <i class="iconfont icon-xinxi iconChain"></i></span>
        </div> -->
         <div class="tip">{{$t('exchange.eos6')}}</div>
         <div class="tip" v-if="!reverse">{{$t('exchange.feeTip1')}}</div>
         <!-- <div class="tip" v-else>{{$t('exchange.minerFeeTip2')}}</div> -->
         <div class="tip">{{$t('exchange.eos2a1')}}{{ minLimit }} USDT{{$t('exchange.eos2a2')}}</div>
         <!-- <div class="tip">{{$t('exchange.minerFeeTip3')}}</div> -->
         <div class="tip" style="color: #F5A623">{{$t('exchange.minerFeeTip4')}}</div>
      <!-- 活动太火爆 start -->
        <mt-popup class="mtPopup" v-model="showHotTips" popup-transition="popup-fade">
          <PopupHotTips v-if="showHotTips" @listenClose="handleClose" />
        </mt-popup>
      <!-- 活动太火爆 end -->

      <!-- 活动太火爆 start -->
        <mt-popup class="mtPopup" v-model="showContract" popup-transition="popup-fade">
          <PopupContract v-if="showContract" @listenClose="handleClose" />
        </mt-popup>
      <!-- 活动太火爆 end -->

      <!-- 关于手续费 start -->
        <mt-popup class="mtPopup" v-model="showFee" popup-transition="popup-fade">
          <PopupFee v-if="showFee" :coin="chainList[selectType].reChain" @listenClose="handleClose" />
        </mt-popup>
      <!-- 关于手续费 end -->

      <!-- 关于矿工费 start -->
        <mt-popup class="mtPopup" v-model="showMinerFee" popup-transition="popup-fade">
          <PopupMinerFee v-if="showMinerFee" :feelist="converFee" :coin="chainList[selectType].reChain" :reverse='reverse' @listenClose="handleClose" />
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
import axios from 'axios';
// import moment from 'moment';
import { toFixed, validateETH, validateTRON } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import { Toast, Popup } from 'mint-ui';
import RequestApi from '@/utils/requestApi';
import PopupFee from './PopupFee';
import PopupExchangeUsdt from './PopupExchangeUsdt';
import PopupMinerFee from './PopupMinerFee';
import PopupHotTips from './PopupHotTips';
import PopupContract from './PopupContract';

export default {
  data() {
    return {
      tronChain: {
        type: 0,
        icon: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
        reIcon: 'https://nds.340wan.com/static/exchange/TRON.png?v=1',
        name: 'USDT',
        chain: 'EOS',
        reChain: 'TRON',
        contract: 'tethertether',
        accuracy: 8,
      },
      ethChain: {
        type: 1,
        icon: 'https://ndi.340wan.com/eos/eosio.token-eos.png',
        reIcon: 'https://nds.340wan.com/static/exchange/ETH.png?v=1',
        name: 'USDT',
        chain: 'EOS',
        reChain: 'ETH',
        contract: 'tethertether',
        accuracy: 8,
      },
      vipInfo: {}, // usdt剩余额
      selectType: 0, // 选中币种 0 tron 1eth
      reverse: true, // 兑换调换 默认 eos ->tron
      showSelect: false, // 打开下拉列表
      showPopupExchange: false, // 兑换确认信息弹窗
      toAccount: '', // 转账地址
      account_name: '', // 自己账户名
      exchangeObj: {
        quantity: null, // 转账数量
        startCoin: '', // 使用的币种
        endCoin: '', // 想兑换的币种
        useCoinUrl: '', // 使用的币种图片
        getCoinUrl: '', // 想兑换的币种图片
        address: ''
      },
      staked: '', // 账号余额
      warnNum: false,
      warnAddress: false,
      ethAddress: '', // 以太坊入账地址
      tronAddress: '', // tron入账地址
      showFee: false, // 关于手续费弹窗
      showMinerFee: false, // 关于矿工费弹窗
      // usdtBalance: {}, // 各链的USDT余额
      showHotTips: false, // 活动太火爆
      coinConvertStatus: false,
      ethConvertStatus: false, // ETH跨链兑换运行状态 (1-正常，0-维护)
      last_code_update: '',
      showContract: false,
      loading: false,
      converFee: []
    };
  },
  computed: {
    ltStaked() {
      return Number(this.exchangeObj.quantity) < this.minLimit
    },
    // ltStaked2() {
    //   return Number(this.exchangeObj.quantity) > 3000
    // },
    gtStaked() {
      const staked = Number(this.staked.split(' ')[0])
      if (this.ltStaked) return false
      return Number(this.exchangeObj.quantity) > staked
    },
    // 最小限制
    minLimit() {
      let currentFromChain = this.chainList[this.selectType].chain.toLowerCase()
      let currentToChain = this.chainList[this.selectType].reChain.toLowerCase()
      let findFee = this.converFee.find(el => el.fromChain.toLowerCase() === currentFromChain && el.toChain === currentToChain)
      return findFee ? findFee.minLimit : 1
    },
    chainList() {
      return !this.ethConvertStatus ? [this.tronChain] : [this.tronChain, this.ethChain]
    }
  },
  mounted() {
    this.handleCheckedAccountBook();
  },
  created() {
    this.account_name = this.$store.state.app.accountInfo.account
    this.vipInfo = this.$store.state.app.vipInfo
    this.tronAddress = this.$store.state.app.vipInfo.tronAddress
    this.ethAddress = this.$store.state.app.vipInfo.ethAddress
    this.getCurrencyBalance()
    // this.handleGetUsdtBalance()
    this.getCommonParam()
    // this.handleGetAccountInfo()
    this.getConvertFee()
  },
  watch: {},
  methods: {
    // 获取兑换费用
    getConvertFee() {
      this.$http.get('coinConvert/getConvertFee').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.converFee = res.data
      })
    },
    // 复制余额到输入框
    handleCopyStaked() {
      const staked = Number(this.staked.split(' ')[0])
      this.exchangeObj.quantity = toFixed(staked, 4)
    },
    // 关闭弹窗
    handleClose(val) {
      // 关闭转账弹窗后请求余额
      if (val) {
        this.getCurrencyBalance()
      }
      this.showHotTips = false
      this.showPopupExchange = false;
      this.showFee = false
      this.showMinerFee = false
      this.showContract = false
    },
    // 下拉框选择
    handleSelectItem(item) {
      this.selectType = item.type
      this.showSelect = false;
      this.toAccount = ''
    },
    // 失去焦点input数据
    handleFixNum() {
      this.exchangeObj.quantity = toFixed(Number(this.exchangeObj.quantity), 4)
    },
    // 获取当前账户余额
    async getCurrencyBalance() {
      const params = {
        code: 'tethertether',
        symbol: 'USDT',
        account: this.$store.state.app.accountInfo.account
      }
      const balance = await DApp.getBalance(params);
      if (balance || balance === 0) {
        this.staked = balance
        window.clearTimeout(this.timer)
      } else {
        this.staked = `0.0000 ${params.coin}`;
        this.timer = window.setTimeout(() => {
          this.getCurrencyBalance()
        }, 500)
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
    // 兑换
    selSubmit(type) {
      if (this.loading) return
      this.loading = true
      if (!this.coinConvertStatus) {
        this.showHotTips = true
        this.loading = false
        return
      }
      this.handleGetAccountInfo((v) => {
        this.loading = false
        const codeHash = v.data.code_hash
        if (codeHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
          this.showContract = true
          return
        }
        // const sameDay = moment().isSame(this.vipInfo.usdtConvertTime, 'day');
        // if (sameDay) {
        //   if (Number(this.exchangeObj.quantity) + Number(this.vipInfo.usdtConvertAmount) > 10000) {
        //     Toast(this.$t('exchange.limitAmt'))
        //     return
        //   }
        // }
        // 币种转换情况
        if (this.reverse) {
          this.reverseSubmit()
          return
        }
        // if (this.selectType === 0 && Number(this.usdtBalance.tronUsdtBalance) < 1000) {
        //   this.showHotTips = true
        //   return
        // }

        // if (this.selectType === 1 && Number(this.usdtBalance.ethUsdtBalance) < 1000) {
        //   this.showHotTips = true
        //   return
        // }
        if (this.ltStaked || this.gtStaked || !this.exchangeObj.quantity) {
          this.warnNum = true
          return
        }
        if (!this.toAccount) {
          this.warnAddress = true
          return
        }
        let reChain = this.chainList[this.selectType].reChain.toUpperCase()
        if(reChain === 'ETH' && !validateETH(this.toAccount) || reChain === 'TRON' && !validateTRON(this.toAccount)) {
          this.warnAddress = true
          Toast(this.$t('exchange.enterAddress'))
          return
        }
        // 弹窗币种
        this.exchangeObj.startCoin = this.chainList[type].chain
        this.exchangeObj.endCoin = this.chainList[type].reChain
        this.exchangeObj.contract = this.chainList[type].contract
        this.exchangeObj.useCoinUrl = this.chainList[type].icon
        this.exchangeObj.getCoinUrl = this.chainList[type].reIcon
        this.showPopupExchange = true
      })
    },
    // 转入兑换地址
    reverseSubmit() {
      // if (Number(this.usdtBalance.eosUsdtBalance) < 1000) {
      //   this.showHotTips = true
      //   return
      // }
      const address = this.selectType ? this.ethAddress : this.tronAddress
      const params = { blockchain: this.selectType ? 'eth' : 'tron' }
      if (!address) {
        this.$http.post('account/getConvertAddress', params).then((res) => {
          if (res.code === 401) {
            accountToSign(this, () => {
              this.reverseSubmit()
            })
            return
          }
          if (res.code !== 0) {
            return
          }
          const obj = {
            chain: this.chainList[this.selectType].reChain,
            address: this.selectType ? res.ethAddress : res.tronAddress
          }
          sessionStorage.setItem('exchangeUsdt', JSON.stringify(obj))
          this.$router.push({ name: 'exchangeUsdtAddress', params: { minfee: this.minLimit }})
        })
        return
      }
      const obj = {
        chain: this.chainList[this.selectType].reChain,
        address
      }
      sessionStorage.setItem('exchangeUsdt', JSON.stringify(obj))
      this.$router.push({ name: 'exchangeUsdtAddress', params: { minfee: this.minLimit }})
    },
    // 获取各链的USDT余额
    handleGetUsdtBalance() {
      this.$http.get('coinConvert/getUsdtBalance').then((res) => {
        if (res.code !== 0) {
          return
        }
        this.usdtBalance = res.data
      })
    },
    // 获取USDT是否在维护状态&ETH跨链兑换运行状态
    getCommonParam() {
      RequestApi.commonParam((res) => {
        this.coinConvertStatus = Number(res.coinConvertStatus)
        this.ethConvertStatus = Number(res.ethConvertStatus)
        if (!this.coinConvertStatus) {
          this.showHotTips = true
        }
        // else {
        //   this.handleGetAccountInfo()
        // }
      })
    },
    // 选择链
    selectChainList() {
      if(this.chainList.length > 1) {
        this.showSelect = !this.showSelect
      }
    },
    // usdt 兑换记录
    handleToExchangeRecord() {
      this.$router.push({ name: 'exchangeUsdtRecord' })
    },
    // 获取账户信息 判断是否是合约
    handleGetAccountInfo(cb) {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account,
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
        }
        axios.post(`${nodeHttp}/v1/chain/get_raw_abi`, JSON.stringify(params)).then((response) => {
          this.last_code_update = response.data.code_hash
          cb(response)
          // if (this.last_code_update !== '0000000000000000000000000000000000000000000000000000000000000000') {
          //   this.showContract = true
          // }
        }).catch((error) => {
          if (error) {
            setTimeout(() => {
              this.handleGetAccountInfo();
            }, 50000);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 选择地址簿
    handleCheckAddress(chain) {
      const token = localStorage.getItem('token');
      const rp = {
        name: 'addressBook',
        params: {
          type: 2,
          addressChain: chain.toLowerCase()
        },
        query: {
          backpath: this.$route.fullPath
        }
      }
      // 存储当前选项值
      this.$store.dispatch('setReverse', this.reverse)
      this.$store.dispatch('setSelectType', this.selectType);
      this.$store.dispatch('setQuantity', this.exchangeObj.quantity)
      this.$store.dispatch('setAddress', this.toAccount)
      if (!token) {
        accountToSign(this, () => {
          this.$router.push(rp);
        });
        return;
      }
      this.$router.push(rp);
    },
    // 获取地址簿中的选中地址
    handleCheckedAccountBook() {
      const reverse = this.$store.state.app.reverse
      if(!reverse) {
        this.reverse = reverse
        this.exchangeObj = Object.assign({}, this.exchangeObj, { quantity: this.$store.state.app.quantity })
        this.toAccount = this.$store.state.app.address
      }
      const sap = this.$store.state.app;
      if (sap && sap.accountBook && sap.accountBook.length > 0) {
        const item = sap.accountBook.find(v => v.checked);
        if (item) {
          this.selectType = this.$store.state.app.selectType
          this.exchangeObj = Object.assign({}, this.exchangeObj, { quantity: this.$store.state.app.quantity })
          this.reverse = false
          item.checked = false;
          this.toAccount = item.address; // 接受账户
          this.$store.dispatch('setAccountBook', sap.accountBook);
        }
      }
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
    PopupHotTips,
    PopupContract,
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
  min-height: calc(100vh - 1rem);
  .btn {
    // width: 4.9rem;
    height: 0.77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #fff;
    margin: 0 auto;
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
  .tip{
    // margin: .17rem .36rem;
    margin-top: .1rem;
    font-size: 0.24rem;
    color: #9B9B9B;
    padding-left: .3rem;
    position: relative;
    margin-bottom: .14rem;

  &::before{
    content: '';
    position: absolute;
    width: .06rem;
    height: .06rem;
    border-radius: 50%;
    background: #A6B6D7;
    left: .15rem;
    top: .18rem;
    transform: translate(-50%, -50%);
   }
  }
.popup{
  border-radius: 0.2rem;
}
</style>

