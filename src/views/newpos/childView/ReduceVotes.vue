<template>
  <div class="increase" @click="selectMenu = false">
    <div class="tools">
      <!-- <div class="backDiv" @click="handleBack"><span class="iconfont icon-huaban11 back"></span></div> -->
      <div class="title">{{ $t('newpos.lessPos') }}</div>
    </div>

    <div class="content">
      <div class="status">
        <div>{{ $t('newpos.lessType') }}</div>
        <div class="typeDiv">
          <div class="type" :class="{'actived': type === 1}"
            @click="type = 1">{{ $t('newpos.sellRex') }}</div>
          <div class="type" :class="{'actived': type === 2}"
            @click="type = 2">{{ $t('newpos.unstaked') }}</div>
        </div>
      </div>

      <div class="tipDiv">
        <div>
          <div class="title">{{ $t('newpos.paymentDate') }}</div>
          <div v-if="type === 1">{{ $t('newpos.realTime') }}</div>
          <div v-else>
            <div>{{ $t('newpos.cpuTip') }}</div>
            <div>{{ $t('newpos.threeDay') }}</div>
          </div>
        </div>
      </div>

      <div class="hasRex">
        <div class="subTitle left">
          <div v-if="type === 1">{{ $t('newpos.hasRex') }}</div>
          <div v-else>{{ $t('newpos.staked') }}</div>
          <div>({{ $t('newpos.hasVotes') }})</div>
        </div>
        <div>
          <div v-if="type === 1" class="rexInput">
            <div class="has pl20">{{ rexData.rex_balance }}</div>
            <div class="has pl20">
              <div class="color-999">≈{{ rexData.vote_stake }}</div>
              <div class="tipColor">1 EOS = 1{{ $t('newpos.votes') }}</div>
            </div>
          </div>
          <div style="position: relative;" v-else>
            <!-- 账户筛选 start -->
            <div class="selectMenu" v-if="selectMenu">
              <div class="select color-333">
                <div v-for="(item, $index) in stakeList" :key="$index"
                  @click="selectIndex = $index">{{ item.to }}</div>
              </div>
            </div>
            <!-- 账户筛选 end -->
            <div class="input net" @click.stop="selectMenu = !selectMenu">
              <span class="cpu">{{ $t('newpos.account') }}</span>
              <span class="account">{{ stakeList[selectIndex].to }}</span>
              <span class="down" :class="{'up': selectMenu}"></span>
            </div>
            <div class="has staked" @click="handleClickNum('cpu')">CPU：{{ stakeList[selectIndex].cpu_weight }}</div>
            <div class="has staked" @click="handleClickNum('net')">NET：{{ stakeList[selectIndex].net_weight }}</div>
          </div>
        </div>
      </div>

      <!-- 可卖出 -->
      <div class="abledSell buyDiv" v-if="type === 1">
        <div class="subTitle">{{ $t('newpos.abledSell') }}</div>
        <div class="ableTrade">
          <div @click="handleClickNum('rex')">{{ rexData.abledTrade }} REX</div>
          <div class="detail" @click="handleToRexDetail">{{ $t('newpos.toUnlock') }}</div>
        </div>
      </div>

      <div class="buyDiv" :class="{'type2': type === 2}">
        <div class="left">
          <div v-if="type === 1">{{ $t('newpos.sellRex') }}</div>
          <div v-else>{{ $t('newpos.unstakedNum') }}</div>
          <div>({{ $t('newpos.lessVotes') }})</div>
        </div>
        <div>
          <div v-if="type === 1">
            <div class="input" :class="{'error': rexInputError}">
              <input type="number" v-model="rex_quantity" @blur="handleRexDeal"
                :placeholder="$t('newpos.inputTipSellRex')">
              <span class="coin">REX</span>
            </div>
            <div class="aboutNum">≈{{ aboutNum }} EOS</div>
          </div>
          <div v-else>
            <div class="input">
              <span class="cpu">CPU</span>
              <input type="number" v-model="cpu_quantity" @blur="handleCpuDeal"
                :placeholder="$t('newpos.inputTipUnstake')">
              <span class="coin">EOS</span>
            </div>
            <div class="input net">
              <span class="cpu">NET</span>
              <input type="number" v-model="net_quantity" @blur="handleNetDeal"
                :placeholder="$t('newpos.inputTipUnstake')">
              <span class="coin">EOS</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="btn" @click="handleRegInput">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import axios from 'axios';
import { Decimal } from 'decimal.js'
import { Toast } from 'mint-ui';
import { toFixed } from '@/utils/public';
import { getAccountRexData, getRexData } from '@/utils/publicApi';

export default {
  data() {
    return {
      netRexInfo: {},
      rexData: {
        rex_balance: '0.0000 REX',
        vote_stake: '0.0000 EOS',
        abledTrade: '0.0000',
      },
      cpuAndNetData: {
        cpu_weight: '0.0000 EOS',
        net_weight: '0.0000 EOS',
      },
      info: {
        producers: [],
        proxy: '',
      },
      dexProxyLists: [],
      type: 1,
      rex_quantity: '',
      net_quantity: '',
      cpu_quantity: '',
      inputTimer: null,
      balanceTimer: null,
      selectMenu: false,
      stakeList: [], // 账户抵押资源列表
      selectIndex: 0, // 抵押列表选择项
      rexInputError: false,
      coin: 'EOS', // 抵押的是EOS | SYS - 测试
      aboutNum: '0.0000',
    }
  },
  watch: {
    type() {
      this.rex_quantity = '';
      this.net_quantity = '';
      this.cpu_quantity = '';
      this.rexInputError = false;
    },
    rex_quantity(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.rex_quantity = oldVal;
        return;
      }
      const aboutNum = Decimal.mul(Number(newVal), this.netRexInfo.price);
      this.aboutNum = toFixed(aboutNum, 4);
    },
    cpu_quantity(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.cpu_quantity = oldVal;
      }
    },
    net_quantity(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.net_quantity = oldVal;
      }
    },
  },
  mounted() {
    // 接口未请求时，默认数据 - 防止报错
    this.stakeList = [{
      cpu_weight: '0.0000 EOS',
      from: this.$store.state.app.accountInfo.account,
      net_weight: '0.0000 EOS',
      to: this.$store.state.app.accountInfo.account,
    }]
    this.handleGetDexProxyList();
    this.handleGetAccountVotesInfo();
    this.handleGetAccountRex();
    this.handleGetRexInfo();
    this.handleGetAccountInfo();

    this.balanceTimer = window.setInterval(() => {
      if (this.type === 1) {
        this.handleGetAccountRex();
        this.handleGetRexInfo();
        return;
      }
      this.handleGetAccountInfo();
    }, 3000);
  },
  methods: {
    handleToSuccess() {
      this.$router.push({
        name: 'actionSuccess',
        params: {
          action: 0, // 1 - 增加挖矿 | 0 - 减少挖矿
          type: this.type
        }
      })
    },
    handleBack() {
      history.back();
    },
    handleToRexDetail() {
      this.$router.push({
        name: 'rexDetail',
      })
    },
    // 点击带数量
    handleClickNum(type) {
      if (type === 'rex') {
        this.rex_quantity = this.rexData.abledTrade;
        return;
      }
      if (type === 'cpu') {
        this.cpu_quantity = this.stakeList[this.selectIndex].cpu_weight.split(' ')[0];
        return;
      }
      this.net_quantity = this.stakeList[this.selectIndex].net_weight.split(' ')[0];
    },
    // 获取平台代理账户列表
    handleGetDexProxyList() {
      this.$http.get('/pool/getNewdexProxyList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.dexProxyLists = res.newdexProxyList;
      });
    },
    // 获取账户代理信息
    handleGetAccountVotesInfo() {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account,
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
        }
        axios.post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params)).then((response) => {
          if (response.data.voter_info) {
            this.info = response.data.voter_info;
          }
        }).catch((error) => {
          if (error) {
            setTimeout(() => {
              this.handleGetAccountVotesInfo();
            }, 50000);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountVotesInfo();
        }, 200);
      }
    },
    // 获取已有REX信息
    handleGetAccountRex() {
      getAccountRexData((err, res) => {
        if (err) {
          return;
        }
        this.rexData = res.data;
      });
    },
    // 获取全网REX信息
    handleGetRexInfo() {
      getRexData((err, res) => {
        if (err || res.code !== 0) {
          return;
        }
        this.netRexInfo = res.data;
      });
    },
    // 获取账户信息
    handleGetAccountInfo() {
      try {
        const params = {
          code: 'eosio',
          json: true,
          limit: 50,
          lower_bound: '',
          scope: this.$store.state.app.accountInfo.encodeName,
          table: 'delband',
          table_key: '',
          upper_bound: '',
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
        }
        axios.post(`${nodeHttp}/v1/chain/get_table_rows`, JSON.stringify(params)).then((response) => {
          if (response.data.rows.length < 1) {
            this.stakeList = [{
              cpu_weight: '0.0000 EOS',
              from: this.$store.state.app.accountInfo.account,
              net_weight: '0.0000 EOS',
              to: this.$store.state.app.accountInfo.account,
            }]
            return
          }
          const rows = response.data.rows;
          const arr = [];
          rows.forEach((item) => {
            if (this.$store.state.app.accountInfo.account === item.to) {
              arr.unshift(item)
              return;
            }
            arr.push(item)
          });
          this.stakeList = arr;
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
    handleCpuDeal() {
      this.cpu_quantity = toFixed(Number(this.cpu_quantity), 4);
    },
    handleNetDeal() {
      this.net_quantity = toFixed(Number(this.net_quantity), 4);
    },
    handleRexDeal() {
      this.rex_quantity = toFixed(Number(this.rex_quantity), 4);
    },
    // 验证输入框数值
    handleRegInput() {
      if (this.type === 1 && !Number(this.rex_quantity)) {
        this.rexInputError = true;
        return;
      }
      this.rexInputError = false;
      if (this.type === 2 && !Number(this.net_quantity) && !Number(this.cpu_quantity)) {
        Toast(this.$t('newpos.inputTipUnstake'));
        return;
      }
      this.handleRegAccountProxy();
    },
    // 验证账户代理权是否是平台的
    handleRegAccountProxy() {
      const index = this.dexProxyLists.findIndex(item => item === this.info.proxy);
      if (index === -1) { // 不是平台代理 - 获取平台可用代理账户
        const stakeCount = 0;
        const params = {
          stakeCount,
        }
        this.$http.get('/pool/getProxy', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.newProxy = res.proxy;
          this.handleDealBtnEvents(this.newProxy);
        });
        return;
      }
      this.handleDealBtnEvents(this.info.proxy);
    },
    // btn事件分发
    handleDealBtnEvents(proxy) {
      if (this.type === 1) {
        this.handleSellRex(proxy);
        return;
      }
      this.handleUndelegatebw(proxy);
    },
    // 卖出rex
    async handleSellRex(proxy) {
      if (Number(this.rex_quantity) > Number(this.rexData.abledTrade)) {
        Toast(this.$t('quotation.low'));
        return;
      }
      // 计算卖出rex得到的EOS amount
      let amount = Decimal.mul(this.netRexInfo.price, this.rex_quantity).toString();
      amount = toFixed(amount, 4);
      const obj = {
        proxy,
        action: 'sellrex',
        amount: `${amount || '0.0000'} EOS`,
        rex: `${this.rex_quantity || '0.0000'} REX`,
      }

      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      let actions = [];
      const buyaction = [
        { // 充值
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
        },
        { // 买入：buyrex
          account: 'eosio',
          name: 'buyrex',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            amount: obj.amount, // eos 数量
          },
        }
      ];
      actions.push(...buyaction);
      if (obj.action === 'sellrex') {
        actions = [
          { // 卖出：sellrex
            account: 'eosio',
            name: 'sellrex',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              from: fromName,
              rex: obj.rex
            },
          },
          { // 提现
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
          }
        ]
      }
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
      if (obj.stakedCpu) {
        actions.unshift({
          account: 'eosio',
          name: 'delegatebw',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            receiver: fromName,
            stake_net_quantity: '0.0000 EOS',
            stake_cpu_quantity: '0.0001 EOS',
            transfer: 0
          }
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
      this.handleToSuccess();
      this.handleGetAccountRex();
      // DApp.rexTransaction(params, (err, res) => {
      //   if (err) {
      //     return;
      //   }
      //   if (res) {
      //     this.handleToSuccess();
      //     this.handleGetAccountRex();
      //   }
      // });
    },
    // 赎回cpu/net
    async handleUndelegatebw(proxy) {
      if (!Number(this.net_quantity) && !Number(this.cpu_quantity)) {
        Toast(this.$t('newpos.inputTipStake'));
        return;
      }
      const net = this.stakeList[this.selectIndex].net_weight.split(' ')[0]
      const cpu = this.stakeList[this.selectIndex].cpu_weight.split(' ')[0]
      if (Number(this.net_quantity) > Number(net) || Number(this.cpu_quantity) > Number(cpu)) {
        Toast(this.$t('newpos.notEnoughMortgage'));
        return;
      }
      const obj = {
        proxy,
        net_quantity: `${this.net_quantity || '0.0000'} ${this.coin}`,
        cpu_quantity: `${this.cpu_quantity || '0.0000'} ${this.coin}`,
        transfer: 0, // 0自己给自己抵押  1给别人抵押
        receiver: this.stakeList[this.selectIndex].to,
      }
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{
          account: 'eosio',
          name: 'undelegatebw',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            from: fromName,
            receiver: obj.receiver || fromName,
            unstake_net_quantity: obj.net_quantity,
            unstake_cpu_quantity: obj.cpu_quantity,
          }
        }]
      }
      if (obj.proxy) {
        params.actions.push({ // 投票
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
      this.handleToSuccess();
      // Toast(this.$t('vip.redeemSuccess'));
      this.net_quantity = '';
      this.cpu_quantity = '';
      // 重新获取CPU/NET信息
      this.handleGetAccountInfo()
      // DApp.undelegatebw(params, (err, res) => {
      //   if (err) {
      //     Toast(this.$t('vip.redeemError'));
      //     return;
      //   }
      //   if (res) {
      //     this.handleToSuccess();
      //     // Toast(this.$t('vip.redeemSuccess'));
      //     this.net_quantity = '';
      //     this.cpu_quantity = '';
      //     // 重新获取CPU/NET信息
      //     this.handleGetAccountInfo()
      //   }
      // })
    }
  },
  beforeDestroy() {
    window.clearInterval(this.balanceTimer)
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.increase{
  font-size: .28rem;
  padding-bottom: .5rem;

  .tools{
    height: .9rem;
    margin-bottom: .1rem;;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .3611rem;
    background: #FFF;
    position: relative;

    .backDiv{
      position: absolute;
      left: 0px;
      height: 100%;
      width: .7rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .back{
        font-size: .3rem;
        display: block;
        transform: rotate(180deg);
      }
    }
  }

  .content{
    background: #FFF;
    padding: .36rem .3rem;

    .status{
      display: flex;
      align-items: center;
      justify-content: space-between;

      .typeDiv{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .type{
          width: 2.66rem;
          height: .83rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $color-999;
          font-size: .27rem;
          border: 1px solid $color-input;
          border-radius: .1rem 0 0 .1rem;

          &:last-child{
            border-radius: 0 .1rem .1rem 0;
            margin-left: .1rem;
          }

          &.actived{
            border: 1px solid #F6C85C;
            color: #F5A623;
          }
        }
      }
    }

    .tipDiv{
      margin-top: .36rem;
      padding: .24rem .2rem;
      background: #fafafa;

      &>div{
        display: flex;
        margin-bottom: .3rem;

        &:nth-child(2){
          margin-bottom: .1rem;
        }
        &:last-child{
          margin-bottom: 0px;
        }

        .title{
          color: $color-999;
          margin-right: .2rem;
        }

        .rexTip{
          color: #F5A623;
        }
        .tip{
          text-align: left;
        }

        .tip>div{
          margin-bottom: .12rem;

          &:last-child{
            margin-bottom: 0;
          }
        }
      }

      .what{
        justify-content: flex-end;
        color: $color-this;
        font-size: .24rem;
      }
    }

    .hasRex{
      display: flex;
      justify-content: space-between;
      margin-top: .4rem;

      .left{
        min-width: 1.32rem;
      }

      &>div{
        // margin-right: .35rem;

        .rexInput{
          width: 5.46rem;
        }

        .input{
          border: 1px solid $color-input;
          width: 5.46rem;
          height: .72rem;
          border-radius: .0662rem;
          display: flex;
          align-items: center;
          // justify-content: space-between;
          box-sizing: border-box;
          overflow: hidden;
          margin-bottom: .2rem;
          position: relative;

          input{
            width: 100%;
            height: 100%;
            font-size: .28rem;
            padding-left: .22rem;
            box-sizing: border-box;
          }

          .account{
            margin-left: .24rem;
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
            color: $color-999;
            margin-right: .21rem;
          }
          .cpu{
            background: #f3f3f3;
            font-size: .25rem;
            height: 100%;
            min-width: 1.2rem;
            max-width: 1.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .has{
          height: .4rem;
          display: flex;
          align-items: center;

          &.staked{
            padding-left: 1.46rem;
          }

          &.pl20{
            padding-left: .23rem;
          }

          .tipColor{
            color: $color-999;
            font-size: .24rem;
            margin-left: .25rem;
          }
        }

        &>div:nth-child(2){
          color: $color-999;
          font-size: .222rem;
          margin-top: .05rem;
        }
      }
    }

    .subTitle{
      text-align: left;
      min-width: 1.32rem;
      margin-right: .12rem;
    }

    .abledSell{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .6rem;
      position: relative;

      .ableTrade{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        // width: 5.46rem;
        padding-left: .23rem;
        box-sizing: border-box;
      }

      .detail{
        font-size: .24rem;
        color: $color-this;
      }
    }

    .buyDiv{
      display: flex;
      // align-items: center;
      justify-content: space-between;
      margin-top: .6rem;

      &.type2{
        margin-top: .2rem;
      }

      .aboutNum{
        margin-top: .1rem;
        text-align: right;
        color: $color-999;
        font-size: .25rem;
        padding-right: .22rem;
      }

      .left{
        min-width: 1.32rem;
        text-align: left;
        margin-right: .12rem;
        &>div:last-child{
          font-size: .22rem;
          color: $color-999;
          margin-top: .05rem;
        }
      }
      .input{
        border: 1px solid $color-input;
        width: 5.46rem;
        height: .72rem;
        border-radius: .0662rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        overflow: hidden;

        &.error{
          border: 1px solid $color-red;
        }

        input{
          width: 100%;
          height: 100%;
          font-size: .28rem;
          padding-left: .22rem;
          box-sizing: border-box;
        }

        .coin{
          color: $color-999;
          margin-right: .21rem;
        }
      }
      .net{
        margin-top: .2rem;
      }
      .cpu{
        background: #f3f3f3;
        font-size: .25rem;
        height: 100%;
        min-width: 1.2rem;
        max-width: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .balance{
      color: $color-999;
      margin-top: .06rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .btn{
    font-size: .32rem;
    color: #8B572A;
    background: #F6C85C;
    border-radius: .1042rem;
    height: .84rem;
    margin: .5rem .36rem .2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tipEnd{
    text-align: center;
    margin-top: .1rem;
    font-size: .25rem;
    color: $color-999;
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
</style>
