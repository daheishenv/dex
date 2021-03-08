<template>
  <div class="increase">
    <div class="tools">
      <!-- <div class="backDiv" @click="handleBack"><span class="iconfont icon-huaban11 back"></span></div> -->
      <div class="title">{{ $t('newpos.addPos') }}</div>
    </div>

    <div class="content">
      <div class="status">
        <div>{{ $t('newpos.posType') }}</div>
        <div class="typeDiv">
          <div class="type" :class="{'actived': type === 1}"
            @click="type = 1">
            <span v-if="type === 1" class="iconSpan"
              :class="{'en': $store.state.app.language === 'en'}">
              <img class="img" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
                src="https://nds.340wan.com/static/img/newpos/max.png" />
              <img v-if="$store.state.app.language === 'en'" class="img" src="https://nds.340wan.com/static/img/newpos/max-en.png" />
              <img v-if="$store.state.app.language === 'ko'" class="img" src="https://nds.340wan.com/static/img/newpos/max-ko.png" />
            </span>
            <span>{{ $t('newpos.buyRex') }}</span>
          </div>
          <div class="type" :class="{'actived': type === 2}"
            @click="type = 2">{{ $t('newpos.stakeCpu') }}</div>
        </div>
      </div>

      <div class="tipDiv">
        <div>
          <div class="title">{{ $t('newpos.nodeProfit') }}</div>
          <div class="rexTip">{{ $t('newpos.ysdNodeYearProfit') }} {{ nodeProfit }}%</div>
        </div>
        <div>
          <div class="title">{{ $t('newpos.rexProfit') }}</div>
          <div class="rexTip" v-if="type === 1">
            <div>{{ $t('newpos.ysdRexYearProfit') }} {{ maxAnnualizedRate }}%</div>
            <div class="subTip">({{ $t('newpos.maxProfit') }})</div>
          </div>
          <div v-else>{{ $t('newpos.null') }}</div>
        </div>
        <div>
          <div class="title">{{ $t('newpos.excRules') }}</div>
          <div class="tip" v-if="type === 1">
            <div>{{ $t('newpos.rexRulesTip1') }}</div>
            <div v-if="$store.state.app.language !== 'en'">
              {{ handleToLocalTime(ableSellDate).substr(0, 16) }} {{ $t('newpos.rexRulesTip2') }}</div>
            <div v-else>{{ $t('newpos.rexRulesTip2') }} {{ handleToLocalTime(ableSellDate).substr(0, 16) }}</div>
            <div>{{ $t('newpos.realTime') }}</div>
          </div>
          <div class="tip" v-else>
            <div>{{ $t('newpos.rexRulesTip3') }}</div>
            <div>{{ $t('newpos.rexRulesTip4') }}</div>
            <div>{{ $t('newpos.threeDay') }}</div>
          </div>
        </div>
        <div class="what">
          <span v-if="type === 1" @click="handleToZendesk">{{ $t('newpos.whatRex') }}</span>
          <span v-else @click="handleToZendesk">{{ $t('newpos.whatCpu') }}</span>
        </div>
      </div>

      <div class="hasRex">
        <div class="subTitle">
          <div v-if="type === 1">{{ $t('newpos.hasRex') }}</div>
          <div v-else>{{ $t('newpos.staked') }}</div>
          <div>({{ $t('newpos.hasVotes') }})</div>
        </div>
        <div class="hasRexRow">
          <div v-if="type === 1">
            <div class="has">{{ rexData.rex_balance }}</div>
            <div class="has">
              <div class="color-999">≈{{ rexData.vote_stake }}</div>
              <div class="tipColor">1 EOS = 1{{ $t('newpos.votes') }}</div>
            </div>
          </div>
          <div v-else>
            <div class="has">CPU：{{ cpuAndNetData.cpu_weight }}</div>
            <div class="has">
              <div>NET：{{ cpuAndNetData.net_weight }}</div>
              <div class="tipColor">1 EOS = 1{{ $t('newpos.votes') }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="buyDiv">
        <div class="left">
          <div v-if="type === 1">{{ $t('newpos.buyMore') }}</div>
          <div v-else>{{ $t('newpos.stakeMore') }}</div>
          <div>({{ $t('newpos.addVotes') }})</div>
        </div>
        <div>
          <div v-if="type === 1">
            <div class="input" :class="{'error': error }">
              <input type="number" v-model="rex_quantity" @blur="handleRexDeal"
                :placeholder="$t('newpos.inputTipBuyRex')">
              <span class="coin">EOS</span>
            </div>
            <div class="balance">
              <!-- <span>≈{{ aboutRexNum }} REX</span> -->
              <span @click="handleClick">{{ $t('newpos.balance') }}: {{ eosBalance }}</span>
            </div>
          </div>
          <div v-else>
            <div class="input" :class="{'error': accountError}">
              <span class="cpu">{{ $t('newpos.receiveAccount') }}</span>
              <input type="text" v-model="receiver" maxlength="12"
                :placeholder="$t('newpos.inputTipAccount')">
              <span class="coin"></span>
            </div>
            <div class="input net">
              <span class="cpu">CPU</span>
              <input type="number" v-model="cpu_quantity" @blur="handleCpuDeal"
                :placeholder="$t('newpos.inputTipStake')">
              <span class="coin">EOS</span>
            </div>
            <div class="input net">
              <span class="cpu">NET</span>
              <input type="number" v-model="net_quantity" @blur="handleNetDeal"
                :placeholder="$t('newpos.inputTipStake')">
              <span class="coin">EOS</span>
            </div>
            <div class="balance">
              <span style="visibility: hidden">≈{{ aboutRexNum }} REX</span>
              <span @click="handleClick">{{ $t('newpos.balance') }}: {{ eosBalance }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="btn" @click="handleRegInput">{{ $t('public.sure') }}</div>
    <div class="tipEnd">{{ $t('newpos.vToLow') }}</div>
    <div class="tipEnd">{{ $t('newpos.bottomTip1') }}</div>
    <div class="tipEnd color-red">{{ $t('newpos.bottomTip2') }}</div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import axios from 'axios';
import { Toast } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { toFixed, toLocalTime } from '@/utils/public';
import { getRexData, getAccountRexData } from '@/utils/publicApi';

export default {
  data() {
    return {
      rexInfo: null,
      rexData: {
        rex_balance: '0.0000 REX',
        vote_stake: '0.0000 EOS'
      },
      cpuAndNetData: {
        cpu_weight: '0.0000 EOS',
        net_weight: '0.0000 EOS',
      },
      info: {
        producers: [],
        proxy: '',
      },
      type: 1,
      rex_quantity: '',
      net_quantity: '',
      cpu_quantity: '',
      receiver: '',
      dexProxyLists: [], // 平台代理账户列表
      newProxy: '',

      // REX买入数量估值
      aboutRexNum: '0.0000',
      inputTimer: null, // 输入后，延迟300毫秒后计算大约数量
      eosBalance: '0.0000 EOS',
      balanceTimer: null, // 用户余额定时器（EOS & REX） 3s
      rexInfoTimer: null, // rex价格定时器 10s
      ableSellDate: new Date(), // 可卖出REX时间
      maxAnnualizedRate: '0.00',
      nodeProfit: '0.00',

      coin: 'EOS', // 抵押的是EOS | SYS - 测试
      accountError: false,
      error: false,
      stakedCount: 0,
    }
  },
  watch: {
    type() {
      this.rex_quantity = '';
      this.net_quantity = '';
      this.cpu_quantity = '';
      this.error = false;
    },
    rex_quantity(newVal, oldVal) {
      if (Number(newVal) < 0) {
        this.rex_quantity = oldVal;
        return;
      }
      if (!newVal) {
        return;
      }
      window.clearTimeout(this.inputTimer);
      this.inputTimer = window.setTimeout(() => {
        const aboutRexNum = Decimal.div(this.rex_quantity, this.rexInfo.priceCut).toString();
        this.aboutRexNum = toFixed(aboutRexNum, 4);
      }, 300);
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
    '$store.state.app.accountInfo': function listen(newVal) {
      this.receiver = newVal.account;
    },
  },
  mounted() {
    this.receiver = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
    const date = new Date(this.ableSellDate).getUTCDate() + 5;
    const ableSellDate = this.ableSellDate.setDate(date)
    this.ableSellDate = `${toLocalTime(ableSellDate).substr(0, 10)}T00:00:00.000+0000`;
    this.handleGetAccountInfo();
    this.handleGetDexProxyList();
    this.handleTimerBegin();
    this.handleGetYsdProfit();
  },
  methods: {
    handleToSuccess() {
      this.$router.push({
        name: 'actionSuccess',
        params: {
          action: 1, // 1 - 增加挖矿 | 0 - 减少挖矿
          type: this.type
        }
      })
    },
    handleToLocalTime(time) {
      return toLocalTime(time)
    },
    handleBack() {
      history.back();
    },
    // 点击带数量
    handleClick() {
      if (this.type === 1) {
        this.rex_quantity = this.eosBalance.split(' ')[0]
        return;
      }
      this.cpu_quantity = this.eosBalance.split(' ')[0]
    },
    handleToZendesk() {
      const lang = this.$store.state.app.language.toLowerCase();
      if (this.type === 1) {
        if (lang === 'en') {
          window.location.href = 'https://support.newdex.net/hc/en-us/articles/360028013572';
          return;
        }
        window.location.href = `https://support.newdex.net/hc/${lang}/articles/360028013572`;
        return;
      }
      if (lang === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360029339611';
        return;
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360029339611`;
    },
    // 获取昨日年华收益
    handleGetYsdProfit() {
      this.$http.post('/pool/getPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.maxAnnualizedRate = res.poolInfo.maxRexAnnualizedRate || '0.00';
        this.nodeProfit = res.poolInfo.maxNodeAnnualizedRate || '0.00';
      });
    },
    // 定时器运行
    handleTimerBegin() {
      // rexInfo - 10s查询一次
      window.clearInterval(this.rexInfoTimer);
      this.handleGetRexInfo();
      this.rexInfoTimer = window.setInterval(() => {
        if (this.type === 1) {
          this.handleGetRexInfo();
        }
      }, 10000);
      // 用户EOS & REX 余额 - 3s查询一次
      window.clearInterval(this.balanceTimer);
      this.handleGetAccountRex();
      this.handleGetEosBalance();
      this.balanceTimer = window.setInterval(() => {
        this.handleGetEosBalance();
        if (this.type === 1) {
          this.handleGetAccountRex();
          return;
        }
        this.handleGetAccountInfo();
      }, 3000);
    },
    // 获取账户EOS余额
    async handleGetEosBalance() {
      try {
        // 正常获取余额
        const params = {
          account: this.$store.state.app.accountInfo.account,
          code: 'eosio.token',
          symbol: 'EOS'
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.eosBalance = balance;
        } else {
          this.eosBalance = '0.0000 EOS';
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     this.eosBalance = '0.0000 EOS';
        //     return;
        //   }
        //   this.eosBalance = data;
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetEosBalance();
        }, 200);
      }
    },
    // 获取全网REX信息
    handleGetRexInfo() {
      getRexData((err, res) => {
        if (err || res.code !== 0) {
          return;
        }
        this.rexInfo = res.data;
      });
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
    // 获取账户信息
    handleGetAccountInfo() {
      try {
        const params = {
          account_name: this.$store.state.app.accountInfo.account,
        }
        let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
        }
        this.handleGetStakedInfo();
        axios.post(`${nodeHttp}/v1/chain/get_account`, JSON.stringify(params)).then((response) => {
          if (response.data.voter_info) {
            this.info = response.data.voter_info;
          }
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
    // 查询抵押列表
    handleGetStakedInfo() {
      try {
        const chain = this.$store.state.app.accountInfo.chain;
        if (chain !== 'eos') {
          this.accountVotesCount = '0.0000';
          return;
        }
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
        const nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
        axios.post(`${nodeHttp}/v1/chain/get_table_rows`, JSON.stringify(params)).then((response) => {
          if (response.data.rows.length < 1) {
            this.cpuAndNetData = {
              cpu_weight: '0.0000 EOS',
              net_weight: '0.0000 EOS',
            }
            return
          }
          const stakeList = response.data.rows;
          let stakedCount = 0;
          let cpuWeight = 0;
          let netWeight = 0;
          stakeList.forEach((item) => {
            const cpu = Number(item.cpu_weight.split(' ')[0]);
            const net = Number(item.net_weight.split(' ')[0]);
            stakedCount = Decimal.add(Number(stakedCount), cpu).toString();
            stakedCount = Decimal.add(Number(stakedCount), net).toString();
            netWeight = Decimal.add(Number(netWeight), net).toString();
            cpuWeight = Decimal.add(Number(cpuWeight), cpu).toString();
          });
          this.stakedCount = toFixed(stakedCount, 4);
          this.cpuAndNetData = {
            cpu_weight: `${toFixed(cpuWeight, 4)} EOS`,
            net_weight: `${toFixed(netWeight, 4)} EOS`,
          }
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetStakedInfo();
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
    // 获取平台代理账户列表
    handleGetDexProxyList() {
      this.$http.get('/pool/getNewdexProxyList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.dexProxyLists = res.newdexProxyList;
      });
    },
    // 验证input输入信息
    handleRegInput() {
      const balance = this.eosBalance.split(' ')[0];
      if (this.type === 1) {
        if (!Number(this.rex_quantity)) {
          this.error = true;
          return;
        }
        this.error = false;
        if (Number(this.rex_quantity) > Number(balance)) {
          Toast(this.$t('quotation.low'));
          return;
        }
      }
      if (this.type === 2) {
        // 抵押账户未填写
        if (!this.receiver.trim()) {
          Toast(this.$t('newpos.inputTipAccount'));
          this.accountError = true;
          return;
        }
        this.accountError = false;
        // 抵押数量未填写
        if (!Number(this.net_quantity) && !Number(this.cpu_quantity)) {
          Toast(this.$t('newpos.inputTipStake'));
          return;
        }
        // 抵押额相加大于余额
        const all = Decimal.add(Number(this.net_quantity), Number(this.cpu_quantity)).toString();
        if (Number(all) > Number(balance)) {
          Toast(this.$t('quotation.low'));
          return;
        }
      }

      this.handleRegAccountProxy();
    },
    // 验证账户代理权是否是平台的
    handleRegAccountProxy() {
      const index = this.dexProxyLists.findIndex(item => item === this.info.proxy);
      if (index === -1) { // 不是平台代理 - 获取平台可用代理账户
        let stakeCount = 0;
        if (this.type === 1) {
          stakeCount = Number(this.rex_quantity);
        } else {
          stakeCount = Decimal.add(Number(this.cpu_quantity), Number(this.net_quantity))
          stakeCount = Number(stakeCount);
        }
        const params = {
          stakeCount,
        }
        this.$http.get('/pool/getProxy', { params }).then((res) => {
          if (res.code !== 0) {
            return;
          }
          this.newProxy = res.proxy;
          this.handleDealBtn(this.newProxy);
        });
        return;
      }
      this.handleDealBtn(this.info.proxy);
    },
    // 按钮时间分发 - 1:买入rex | 2:抵押CPU/NET
    handleDealBtn(proxy) {
      if (this.type === 1) {
        this.handleBuyRex(proxy);
        return;
      }
      this.handleDelegatebw(proxy);
    },
    // 买入REX
    async handleBuyRex(proxy) {
      if (!Number(this.rex_quantity)) {
        Toast(this.$t('newpos.inputTipBuyRex'));
        return;
      }
      const obj = {
        action: 'buyrex',
        amount: `${this.rex_quantity || '0.0000'} ${this.coin}`,
        proxy: proxy || '',
        stakedCpu: false, // 识别账户是否需要添加一个0.0001的CPU抵押actions
      }
      // 判断账户抵押资源为0 - 处理抵押
      if (!Number(this.stakedCount)) {
        const rexQuantity = Decimal.sub(Number(this.rex_quantity), 0.0001).toString();
        obj.amount = `${toFixed(rexQuantity, 4) || '0.0000'} ${this.coin}`;
        obj.stakedCpu = true;
      }
      // 合约执行
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
      //     // Toast(this.$t('newpos.toastBuySuccess'));
      //     this.handleToSuccess();
      //     this.handleGetAccountRex();
      //   }
      // });
    },
    // 抵押CPU/NET
    handleDelegatebw(proxy) {
      // 抵押账户未填写
      if (!this.receiver.trim()) {
        Toast(this.$t('newpos.inputTipAccount'));
        this.accountError = true;
        return;
      }
      this.accountError = false;
      // 抵押数量未填写
      if (!Number(this.net_quantity) && !Number(this.cpu_quantity)) {
        Toast(this.$t('newpos.inputTipStake'));
        return;
      }
      // 验证账户是否存在
      this.handleGetAccount(async (e) => {
        if (e) {
          Toast(this.$t('vip.stakedAccountNull'));
          this.accountError = true;
          return;
        }
        this.accountError = false;
        // const transfer = this.receiver === this.$store.state.app.accountInfo.account ? 0 : 1;
        const obj = {
          net_quantity: `${this.net_quantity || '0.0000'} ${this.coin}`,
          cpu_quantity: `${this.cpu_quantity || '0.0000'} ${this.coin}`,
          transfer: 0, // 0自己给自己抵押  1给别人抵押&抵押的EOS也给对方
          receiver: this.receiver,
          proxy: proxy || '',
        }
        const fromName = this.$store.state.app.accountInfo.account;
        const permission = this.$store.state.app.accountInfo.permissions;
        const params = {
          actions: [{
            account: 'eosio',
            name: 'delegatebw',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              from: fromName,
              receiver: obj.receiver || fromName,
              stake_net_quantity: obj.net_quantity,
              stake_cpu_quantity: obj.cpu_quantity,
              transfer: obj.transfer || 0
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
        this.net_quantity = '';
        this.cpu_quantity = '';
        // 重新获取CPU/NET信息
        this.handleGetAccountInfo()
        // 重新获取CPU/NET信息
        this.handleGetAccountInfo()
        // DApp.delegatebw(params, (err, res) => {
        //   if (err) {
        //     Toast(this.$t('vip.mortgageError'));
        //     return;
        //   }
        //   if (res) {
        //     // Toast(this.$t('vip.mortgageSuccess'));
        //     this.handleToSuccess();
        //     this.net_quantity = '';
        //     this.cpu_quantity = '';
        //     // 重新获取CPU/NET信息
        //     this.handleGetAccountInfo()
        //   }
        // })
      });
    },
    // 账户存在判断
    handleGetAccount(callback) {
      // 交易对所属链相同下，不进行验证
      // 交易对所属链不同，进行验证
      const chainNode = 'eosNode';
      const params = {
        account_name: this.receiver,
      }
      axios.post(`${this.$store.state.sys.nodeList[chainNode].httpEndpoint}/v1/chain/get_account`, JSON.stringify(params)).then((result) => {
        const res = result.data;
        if (res.account_name === this.receiver) {
          callback(null);
          return;
        }
        callback('error');
      }).catch(() => {
        callback('error');
      });
    },
  },
  beforeDestroy() {
    window.clearTimeout(this.inputTimer);
    window.clearInterval(this.rexInfoTimer);
    window.clearInterval(this.balanceTimer);
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .maxProfit{
    top: -2px !important;
  }
}

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
        position: relative;

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
          box-sizing: border-box;

          &:last-child{
            border-radius: 0 .1rem .1rem 0;
            margin-left: .1rem;
          }

          &.actived{
            border: 1px solid #F6C85C;
            color: #F5A623;
          }

          .iconSpan{
            position: absolute;
            left: 0px;
            top: 0px;
            width: .78rem;

            &.en{
              width: .93rem;
            }
          }

          .img{
            width: 100%;
          }

          .maxProfit{
            position: absolute;
            left: -1px;
            top: -1px;
            font-size: .27rem;
            display: flex;
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

        &:nth-child(3){
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

          .subTip{
            color: $color-999;
            font-size: .24rem;
          }
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
      align-items: center;
      justify-content: space-between;
      margin-top: .4rem;

      &>div{
        margin-right: .35rem;

        .has{
          height: .4rem;
          display: flex;
          align-items: center;
        }

        &>div:nth-child(2){
          color: $color-999;
          font-size: .24rem;
          margin-top: .05rem;
        }

        .tipColor{
          font-size: .24rem;
          margin-left: .24rem;
          color: $color-999;
        }
      }

      .hasRexRow{
        margin-right: 0rem;
        flex: 1;
        padding-left: .24rem;
      }

      .subTitle{
        min-width: 1.48rem;
        max-width: 1.48rem;
        margin-right: .12rem;
        text-align: left;
      }
    }

    .buyDiv{
      display: flex;
      // align-items: center;
      justify-content: space-between;
      margin-top: .36rem;

      .left{
        margin-right: .12rem;
        min-width: 1.48rem;
        text-align: left;
        &>div:last-child{
          font-size: .24rem;
          color: $color-999;
          margin-top: .05rem;
        }
      }
      .input{
        border: 1px solid $color-input;
        width: 5.3rem;
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
        min-width: 1.5rem;
        max-width: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .balance{
      font-size: .24rem;
      color: $color-999;
      margin-top: .12rem;
      display: flex;
      align-items: center;
      // justify-content: space-between;
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
</style>
