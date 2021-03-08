/* eslint-disable */
import { GetUrlPara, handleParentUrl } from '@/utils/public';
import axios from 'axios';
// store
import store from '../../store';

const BloksIo = {
  link: false, // 标志位 - 是否连接上
  bodyScrollHeight: 0,
  callbackDict: {},
  targetOrigin: '',
  init() {
    const urlRes = GetUrlPara().ref || null;
    if (urlRes) {
      const parentUrl = handleParentUrl(urlRes);
      this.targetOrigin = parentUrl;
      this.link = true;
      // 回调监听
      window.addEventListener('message', this.handleReceiveMessage, false);
      // 配置信息
      this.getConfig();
      return;
    }
    setTimeout(() => {
      this.init();
    }, 200);
  },
  handleReceiveMessage(event) {
    const self = BloksIo;
    console.log('newdex -> back event');
    const origin = event.origin || event.originalEvent.origin;
    if (origin === window.location.origin) return;
    const message = JSON.parse(event.data);
    switch (message.action) {
      case 'getAccount': { // 获取账户信息
        console.log(message.data)
        const data = message.data;
        const newData = {
          account_name: data.account,
          address: data.publicKey,
          permissions: [data.authority], // 权限
          chain: data.blockchain || 'eos',
        }
        self.callbackDict.getAccount(null, newData)
        break;
      }
      case 'getArbitrarySignature': {
        console.log(message.data)
        const data = message.data;
        self.callbackDict.getArbitrarySignature(null, data);
        break;
      }
      case 'transaction': {
        console.log(message.data)
        const data = message.data;
        self.callbackDict.transaction(null, data);
        break;
      }
    }
  },
  // 嵌入交易 body 高度实时获取
  handleGetBodyScrollHeight() {
    setTimeout(() => {
      const scrollHeight = window.document.getElementById('app').scrollHeight;
      if (this.bodyScrollHeight !== scrollHeight) {
        this.bodyScrollHeight = scrollHeight;
        // console.log('newdex -> request setHeight');
        const messageGetConfig = { action: 'setHeight', data: { height: scrollHeight } }
        // console.log(messageGetConfig);
        window.parent.postMessage(JSON.stringify(messageGetConfig), this.targetOrigin);
      }
      this.handleGetBodyScrollHeight();
    }, 800);
  },
  // 获取内嵌配置 - 语言
  getConfig() {
    // 获取语言配置
    // console.log('newdex -> request getConfig');
    const messageGetConfig = { action: 'getConfig', data: null }
    window.parent.postMessage(JSON.stringify(messageGetConfig), this.targetOrigin);
    // this.handleGetBodyScrollHeight();
  },
  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    // console.log('newdex -> request getAccount');
    this.callbackDict.getAccount = callback;
    const messageGetAccount = { action: 'getAccount', data: null }
    window.parent.postMessage(JSON.stringify(messageGetAccount), this.targetOrigin);
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    callback(null, true);
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    //  查询节点数据
    try {
      const newParams = {
        code: params.code,
        symbol: params.coin,
        account: store.state.app.accountInfo.account
      }
      const chainNode = `${store.state.app.accountInfo.chain}Node`
      axios.post(`${store.state.sys.nodeList[chainNode].httpEndpoint}/v1/chain/get_currency_balance`, JSON.stringify(newParams)).then((res) => {
        if (!res.data.length) {
          callback(null, `0.0000 ${params.coin}`);
          return;
        }
        const returnData = res.data[0];
        callback(null, returnData);
      }).catch((e) => {
        console.log(`e: ${e}`); // eslint-disable-line
      })
    } catch (error) {
      setTimeout(() => {
        this.getCurrencyBalance(params, callback);
      }, 200);
    }
  },
  /* -------- 获取余额 end -------- */


  /* -------- 签名 start -------- */
  /*
  * 给定的公钥的私钥对任意数据进行签名
  * @params publicKey EOS账户的公钥
  * @params data EOS账户名+时间戳
  * @params whatFor 标题
  * @params isHash data是否为hash
  */
  signText(text, callback) {
    const self = this;
    self.callbackDict.getArbitrarySignature = callback;
    const whatFor = ''; // 提示用户签名原因
    const isHash = false;
    const dataItem = {
      publicKey: store.state.app.accountInfo.address,
      data: text,
      whatFor,
      isHash
    };
    const messageArbitrarySignature = { action: 'getArbitrarySignature', data: dataItem }
    // console.log('newdex -> request getArbitrarySignature'); // eslint-disable-line
    // console.log(messageArbitrarySignature); // eslint-disable-line
    window.parent.postMessage(JSON.stringify(messageArbitrarySignature), this.targetOrigin);
  },
  /* -------- 签名 start -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    this.callbackDict.transaction = callback;
    const accountName = store.state.app.accountInfo.account;
    const action = {
      actions: [
        {
          account: params.code,
          name: 'transfer',
          authorization: [{
            actor: accountName,
            permission: store.state.app.accountInfo.permissions[0]
          }],
          data: {
            from: accountName,
            to: params.toAccount,
            quantity: params.quantity,
            memo: params.memo
          }
        },
      ],
      address: store.state.app.accountInfo.address,
      account: accountName
    }
    const messageTransaction = { action: 'transaction', data: action }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 转账 end -------- */
  /* 全变量 actions */
  async transactionApi(obj, callback) {
    this.callbackDict.transaction = callback;
    const accountName = store.state.app.accountInfo.account;
    const action = obj.params;
    action.address = store.state.app.accountInfo.address;
    action.account = accountName;
    const messageTransaction = { action: 'transaction', data: action }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* 全变量 actions end */
  /* -------- 抵押 & 赎回 start -------- */
  // 抵押目前只支持EOS链上抵押
  newdexStaked(obj, callback) {
    const formName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      // blockchain: 'eos',
      actions: [
        {
          account: 'newdexstaked',
          name: obj.name || 'stake',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            owner: formName,
            quantity: obj.quantity,
            blockchain: obj.blockchain, // 抵押账户所属链
            stakefor: obj.stakefor, // 抵押账户
          }
        }
      ]
    };
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 抵押 & 赎回 end -------- */

  /* -------- 合约撤单 start -------- */
  revoke(obj, callback) {
    const formName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      blockchain: obj.chain,
      actions: [
        {
          account: obj.actionsAccount, // 合约账户
          name: 'cancelorder', // 撤单方法
          authorization: [{
            actor: formName, // 撤单账户
            permission, // 权限可选（active, owen）
          }],
          data: {
            // owner: formName, // 权限（active, owen）
            order_id: obj.orderId, // (string)订单id
            pair_id: obj.symbolId, // (string)交易对ID
            // auth_type: 1,
          }
        }
      ]
    }
    if (!obj.orderId) {
      params.actions = [{
        account: obj.actionsAccount, // 合约账户
        name: 'cancelpair', // 撤单方法
        authorization: [{
          actor: formName, // 撤单账户
          permission, // 权限可选（active, owen）
        }],
        data: {
          owner: formName, // 权限（active, owen）
          pair_id: obj.symbolId, // (string)交易对ID
          // auth_type: 1,
        }
      }]
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 合约撤单 end -------- */

  /* -------- 抵押|赎回 CPU/NET 操作 start -------- */
  delegatebw(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      blockchain: 'eos',
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /*
  * 释放CPU/NET 操作
  * @params cpu_quantity 额度
  * @params net_quantity 额度
  */
  undelegatebw(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      blockchain: 'eos',
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 抵押|赎回 CPU/NET 操作 end -------- */

  /* -------- REX 买卖操作 start -------- */
  /*
  * REX 买卖
  * rex trasaction
  */
  rexTransaction(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /*
  * 赎回 并买入REX
  */
  rexUnstaketorexTransaction(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- REX 买卖操作 start -------- */

  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 start -------- */
  // 租借CPU | NET type: 1 - cpu | 2 - net
  rent(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    // 存CPU | NET 贷款基金
    const actions = [{
      account: 'eosio',
      name: obj.type === 1 ? 'rentcpu' : 'rentnet',
      authorization: [{
        actor: fromName,
        permission,
      }],
      data: {
        from: fromName,
        receiver: obj.receiver,
        loan_payment: obj.loan_payment,
        loan_fund: obj.loan_fund,
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
          amount: obj.allRentCount, // eos 数量
        },
      })
    }
    const params = {
      actions,
    };
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  // 存入租金 type: 1 - cpu | 2 - net
  depositRent(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  // 取回租金
  collectRent(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    // 存CPU | NET 贷款基金
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  // 取回储备金
  withdraw(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    // 存CPU | NET 贷款基金
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 end -------- */

  /* -------- 充值|提现 兑换 start -------- */
  // 生成用户充值地址
  newaddress(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
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
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 充值|提现 兑换 end -------- */

  /* -------- 代理投票 start ------- */
  voteproducer(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      actions: [{ // 投票
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
      }]
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 代理投票 end ------- */

  /* -------- RAM 交易 start -------- */
  /*
  * 买入RAM 操作
  * @params quant 额度
  */
  eosBuyram(quant, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      actions: [{ // 买入RAM
        account: 'eosio',
        name: 'buyram',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          payer: fromName,
          receiver: fromName,
          quant,
        },
      }]
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /*
  * 卖出RAM 操作
  * @params bytes 数量
  */
  eosSellram(bytes, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      actions: [{ // 卖出RAM
        account: 'eosio',
        name: 'sellram',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          account: fromName,
          bytes,
        },
      }]
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- RAM 交易 end -------- */

  /* -------- 切换会员升级状态 start -------- */
  choosemode(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
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
          is_staked: obj.type==0?false:true, // 抵押 - true | false - 消耗
        },
      }]
    }
    if (obj.unstake) {
      const unstakeActions = {
        account: 'newdexstaked', // 抵押账户
        name: 'unstake', // stake - 抵押 | unstake - 赎回 
        authorization: [{
          actor: fromName, // 转账者
          permission, // 权限 active | owner
        }],
        data: {
          owner: fromName, // 转账者 - 'testtesttest'
          quantity: obj.amount, // 数量 - '1.0000 NDX'
          blockchain: 'eos', // 抵押账户所属链
          stakefor: fromName, // 抵押账户
        }
      }
      params.actions.unshift(unstakeActions)
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 切换会员升级状态 end -------- */

  /* -------- 会员消耗接口 start -------- */
  /**
   * @param {*} obj = {
   *  quantity: "10.0000 NDX",
   *  memo: "1-3-eospublicbus"
   * }
   * @param {*} callback
   */
  consumption(obj, callback) {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions[0];
    const params = {
      actions: [{ // 切换会员升级状态
        account: 'newdexissuer',
        name: 'transfer',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          from: fromName,
          to: 'newdexstaked',
          quantity: obj.quantity,
          memo: obj.memo, // 1-3-testa2b12345
        },
      }]
    }
    if (obj.choosemode === 0) {
      const chooseActions = { // 选择消耗方式
        account: 'newdexstaked',
        name: 'choosemode',
        authorization: [{
          actor: fromName,
          permission,
        }],
        data: {
          owner: fromName,
          is_staked: false, // 抵押 - 1 | 0 - 消耗
        },
      }
      params.actions.push(chooseActions)
    }
    this.callbackDict.transaction = callback;
    const messageTransaction = { action: 'transaction', data: params }
    window.parent.postMessage(JSON.stringify(messageTransaction), this.targetOrigin);
  },
  /* -------- 会员消耗接口 end -------- */
}

export default BloksIo;
