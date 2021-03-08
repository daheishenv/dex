/**
 *
 * token pocket 全部接口
 *
 */
import tokenpocket from 'tp-eosjs'; // tokenpocket JS
import * as compareVersions from 'compare-versions';
import axios from 'axios';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
// import Enu from 'enujs';
// import Fibos from 'fibos.js';
import { handleUseFreeCpuPost } from '@/utils/publicApi';
import Eos from 'eosjs-without-sort';

// import { Toast } from 'mint-ui';
// store
import store from '../../store';

// const abi = require('./ulit/eosio.system.json');

ScatterJS.plugins(new ScatterEOS());

let envobj = null;
let networkOpt = null;
let eosOptions = null;
// let EosJs = null;

const regNode = (callback) => {
  // 网络
  networkOpt = {
    blockchain: 'eos',
    protocol: envobj.protocol,
    host: envobj.host,
    port: envobj.port,
    chainId: envobj.chainId,
  };
  eosOptions = {
    broadcast: true,
    sign: true,
    chainId: envobj.chainId,
  }
  callback();
}

// 获取节点配置信息
const getNodeInfo = (chain, callback) => {
  let thisChain = chain;
  if (!chain) {
    thisChain = 'eos';
  }
  if (!store.state.sys.nodeList || !store.state.sys.nodeList[`${thisChain}Node`]) {
    setTimeout(() => {
      getNodeInfo(chain, callback);
    }, 1000);
    return;
  }
  envobj = store.state.sys.nodeList[`${thisChain}Node`];
  regNode(callback);
}


const TokenPocketModel = {
  scatter: null,
  hasScatter: false,
  scatterEosJs: null,
  times: 0, // 次数
  isWinScatter: false, // 是否是window的scatter
  actorToFreeCpu: '111.3',
  /* -------- 初始化 start -------- */
  init() {
    if (window.scatter) {
      this.scatter = window.scatter;
    }
  },
  // url带chain时处理方法
  initHasChain(chain) {
    // 直接获取当前链信息
    getNodeInfo(chain, () => {
      if (networkOpt && eosOptions) {
        try {
          this.isWinScatter = true;
          this.initEosClass();
        } catch (error) {
          this.hasScatter = false;
          setTimeout(() => {
            this.init(chain)
          }, 1500);
        }
      }
    });
  },
  initEosClass() {
    if (window.scatter) { // 有scatter对象
      this.scatter = window.scatter;
      this.hasScatter = true;
      this.scatterEosJs = this.scatter.eos(networkOpt, Eos, eosOptions, 'https');
      this.isWinScatter = true;
    }
    // 没有scatter对象
    const network = ScatterJS.Network.fromJson(networkOpt);
    ScatterJS.connect('Newdex.io', { network }).then((connected) => {
      // Toast('connected === ' + connected)
      if (!connected) {
        setTimeout(() => {
          this.times += 1;
          if (this.times >= 25) {
            return;
          }
          this.initEosClass()
        }, 800);
        return;
      }
      this.times = 0;
      this.isWinScatter = false;
      this.hasScatter = true;
      this.scatterEosJs = ScatterJS.eos(network, Eos);
      this.scatter = ScatterJS; // 链接成功后的别名
    }).catch((error) => {
      console.log(error); // eslint-disable-line
    });
  },
  /* -------- 初始化 end -------- */

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    tokenpocket.getCurrentWallet().then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      const newData = {
        account_name: data.data.name,
        encodeName: Eos.modules.format.encodeName(data.data.name, false),
        address: data.data.address,
        permissions: data.data.permissions, // 权限
        blockchain_id: data.data.blockchain_id, // chainId： 4 -  EOS | 6 - BOS | 5 - ENU
        chain: 'eos'
      }
      if (Number(data.data.blockchain_id) === 6) {
        newData.chain = 'bos';
      }
      //  else if (Number(data.data.blockchain_id) === 5) {
      //   newData.chain = 'enu';
      // }
      newData.timer = new Date().getTime();
      if (store.state.app.accountInfo
      && store.state.app.accountInfo.account !== newData.account_name) {
        newData.isChangeAccount = true;
      }
      store.dispatch('setAccountInfo', newData);
      this.initHasChain(newData.chain);
      callback(null, newData)
    }).catch((e) => {
      console.log(e); // eslint-disable-line
      // alert(`err: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    tokenpocket.getAppInfo().then(((data) => {
      let available = false;
      if (data.data.system === 'android') {
        available = compareVersions(data.data.version, '0.4.7') >= 0;
      } else {
        available = compareVersions(data.data.version, '0.4.5') >= 0;
      }
      callback(null, available);
    })).catch((e) => {
      callback(e, null)
    });
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    // alert(store.state.app.accountInfo.account)
    // alert(store.state.app.accountInfo.chain)
    const accountName = store.state.app.accountInfo.account;
    const chain = store.state.app.accountInfo.chain;
    // if (chain === 'eos') {
    // alert(JSON.stringify({
    //   blockchain: 'eos',
    //   account: 'aixinjueluo1',
    //   contract: params.code,
    //   symbol: params.coin
    // }));
    tokenpocket.getBalance({
      blockchain: chain,
      account: accountName,
      contract: params.code,
      symbol: params.coin
    }).then((data) => {
      if (!data.result) {
        callback(data, null);
        return;
      }
      if (!data.data.balance.length) {
        callback(null, `0.0000 ${params.coin}`);
        return;
      }
      // 处理返回多个币种余额
      for (let i = 0; i < data.data.balance.length; i += 1) {
        const arr = data.data.balance[i].split(' ');
        if (arr[1] === params.coin.toUpperCase()) {
          const returnData = data.data.balance[i];
          callback(null, returnData);
          return;
        }
      }
      callback(null, `0.0000 ${params.coin}`);
      // const returnData = data.data.balance[0];
      // callback(null, returnData);
    })
    //  return;
    // }
    // 其他链走自己节点
    // this.getCurrencyBalanceScatter(params, chain, callback)
  },
  /* -------- 获取余额 end -------- */

  /* -------- 获取余额 scatter start -------- */
  getCurrencyBalanceScatter(params, chain, callback) {
    try {
      const newParams = {
        code: params.code,
        symbol: params.coin,
        account: store.state.app.accountInfo.account
      }
      const httpEndpoint = store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
      axios.post(`${httpEndpoint}/v1/chain/get_currency_balance`, JSON.stringify(newParams)).then((res) => {
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
      }, 1000);
    }
  },
  /* -------- 获取余额 scatter end -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    const accountInfo = store.state.app.accountInfo;
    const chain = accountInfo.chain;
    const accountName = accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    if (params.useFreeCpu) {
      this.transferByFreeCpu(params, callback)
      return;
    }
    const action = {
      blockchain: chain,
      actions: [
        {
          account: params.code,
          name: 'transfer',
          authorization: [{
            actor: accountName,
            permission
          }],
          data: {
            from: accountName,
            to: params.toAccount,
            quantity: params.quantity,
            memo: params.memo
          }
        },
      ],
      address: accountInfo.address,
      account: accountName
    }
    tokenpocket.pushAction(action).then((data) => {
      if (!data.result) {
        this.errorCall(data, callback);
        return;
      }
      callback(null, data)
    }).catch((e) => {
      this.errorCall(e, callback)
      console.log(`e: ${e}`); // eslint-disable-line
    })
  },
  transferByFreeCpu(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.transfer(obj, callback);
      }, 200);
      return;
    }
    // scatterEosJs 已配置
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    const quantity = obj.quantity;
    const params = {
      actions: [
        {
          account: obj.code,
          name: 'transfer',
          authorization: [{
            actor: fromName, // 转账者
            permission,
          }],
          data: {
            from: fromName,
            to: obj.toAccount,
            quantity,
            memo: obj.memo
          }
        }
      ]
    };
    if (obj.useFreeCpu) {
      let actor = '111.3';
      params.actions[0].authorization.unshift({ actor, permission: 'active' })
      this.scatterEosJs.transaction(params, {
        broadcast: !1,
        sign: !0,
      }).then((res) => {
        const l = res.transaction.transaction;
        l.signatures = res.transaction.signatures;
        l.context_free_data = [];
        callback(null, l);
      }).catch((e) => {
        this.errorCall(e, callback)
      });
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },
  /* -------- 转账 end -------- */

  /* 全变量 actions */
  transactionApi(obj, callback) {
    const chain = store.state.app.accountInfo.chain;
    const accountName = store.state.app.accountInfo.account;
    if (!this.hasScatter) {
      setTimeout(() => {
        this.transactionApi(obj, callback);
      }, 200);
      return;
    }
    if (obj.useFreeCpu) {
      this.freeCpuTransactionApi(obj.params, callback)
      return;
    }
    const action = {
      blockchain: chain,
      actions: obj.params.actions,
      address: store.state.app.accountInfo.address,
      account: accountName
    }
    tokenpocket.pushAction(action).then((data) => {
      if (!data.result) {
        this.errorCall(data, callback);
        return;
      }
      callback(null, data)
    }).catch((e) => {
      this.errorCall(e, callback)
      console.log(`e: ${e}`); // eslint-disable-line
    });
  },

  // 免CPU合约执行
  freeCpuTransactionApi(params, callback) {
    params.actions.forEach((item) => {
      item.authorization.unshift({
        actor: this.actorToFreeCpu,
        permission: 'active',
      })
    })
    this.scatterEosJs.transaction(params, {
      broadcast: !1, // 是否广播
      sign: !0,
    }).then((res) => {
      if (res.processed || res.transaction_id) {
        const p = res;
        const l = p.transaction.transaction;
        l.signatures = p.transaction.signatures;
        l.context_free_data = [];
        const signed = JSON.stringify(l);
        handleUseFreeCpuPost(signed, (error, resFree) => {
          if (resFree) {
            callback(null, { processed: true, transaction_id: true });
            return;
          }
          this.errorCall(error, callback);
        })
      }
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },
  /* 全变量 actions end */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    /* ---- tp SDK ---- */
    const chain = store.state.app.accountInfo.chain;
    const params = {
      blockchain: chain,
      from: store.state.app.accountInfo.account,
      publicKey: store.state.app.accountInfo.address,
      signdata: `${store.state.app.accountInfo.account} ${text}`
    }
    tokenpocket.authSign(params).then((data) => {
      // alert(JSON.stringify(data))
      if (!data.result) {
        callback(data, null);
        return;
      }
      const res = data.data;
      callback(null, res);
    }).catch((e) => {
      console.log(`e: ${e}`); // eslint-disable-line
    });

    /* ---- scatter ---- */
    // const self = this;
    // if (!self.scatter) {
    //   return;
    // }
    // window.scatter.getIdentity().then((res) => {
    //   // alert(JSON.stringify(res))
    //   const publicKey = res.accounts[0].publicKey;
    //   const data = text.split(' ')[1]; // eg: '1544412189605'
    //   const whatFor = ''; // 提示用户签名原因
    //   const isHash = false;

    //   self.scatter.getArbitrarySignature(publicKey, data, whatFor, isHash).then((signature) => {
    //     callback(null, signature);
    //   }).catch((error) => {
    //     callback(error, null);
    //   });
    // })
  },
  /* -------- 签名 end -------- */

  /* -------- 抵押 & 赎回 start -------- */
  // 抵押目前只支持EOS链上抵押
  newdexStaked(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    const params = {
      // blockchain: 'eos',
      actions: [
        {
          account: 'newdexstaked',
          name: obj.name || 'stake',
          authorization: [{
            actor: fromName, // 转账者
            permission,
          }],
          data: {
            owner: fromName,
            quantity: obj.quantity,
            blockchain: obj.blockchain, // 抵押账户所属链
            stakefor: obj.stakefor, // 抵押账户
          }
        }
      ]
    };
    tokenpocket.pushEosAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 抵押 & 赎回 end -------- */

  /* -------- 合约撤单 start -------- */
  revoke(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const formName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;

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
    /* 免CPU撤单 */
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return
    }
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        callback(res, null);
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 合约撤单 end -------- */

  /* -------- 抵押|赎回 CPU/NET 操作 start -------- */
  delegatebw(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /*
  * 释放CPU/NET 操作
  * @params cpu_quantity 额度
  * @params net_quantity 额度
  */
  undelegatebw(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 抵押|赎回 CPU/NET 操作 end -------- */

  /* -------- REX 买卖操作 start -------- */
  /*
  * REX 买卖
  * rex trasaction
  */
  rexTransaction(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /*
  * 赎回 并买入REX
  */
  rexUnstaketorexTransaction(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- REX 买卖操作 start -------- */

  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 start -------- */
  // 租借CPU | NET type: 1 - cpu | 2 - net
  rent(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  // 存入租金 type: 1 - cpu | 2 - net
  depositRent(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  // 取回租金
  collectRent(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  // 取回储备金
  withdraw(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 end -------- */

  /* -------- 充值|提现 兑换 start -------- */
  // 生成用户充值地址
  newaddress(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 充值|提现 兑换 end -------- */

  /* -------- 代理投票 start ------- */
  voteproducer(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 代理投票 end ------- */

  /* -------- RAM 交易 start -------- */
  /*
  * 买入RAM 操作
  * @params quant 额度
  */
  eosBuyram(quant, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /*
  * 卖出RAM 操作
  * @params bytes 数量
  */
  eosSellram(bytes, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- RAM 交易 end -------- */

  /* -------- 切换会员升级状态 start -------- */
  choosemode(obj, callback) {
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
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
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
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
    tokenpocket.pushAction(params).then((res) => {
      if (!res.result) {
        return;
      }
      callback(null, res);
    }).catch(e => this.errorCall(e, callback));
  },
  /* -------- 会员消耗接口 end -------- */

  /* -------- 获取账户列表 start -------- */
  getWalletList(callback) {
    const params = 'eos';
    tokenpocket.getWalletList(params).then((data) => {
      callback(null, data.wallets.eos);
    }).catch((e) => {
      console.log(`e: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 获取账户列表 end -------- */

  /* -------- 一键卖出 start -------- */
  pushEosAction(dataList, callback) {
    // dataList = [{
    //   code: 'eosio.token',
    //   quantity: '0.0001 EOS',
    //   memo: 'lost - eos'
    // }, {
    //   code: 'eosatidiumio',
    //   quantity: '0.0001 ATD',
    //   memo: 'lost - atd'
    // }]
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    const actionObj = {
      address: store.state.app.accountInfo.address, // 公钥
      account: fromName, // 账户
    }
    const actions = [];
    const chain = store.state.app.accountInfo.chain;
    dataList.forEach((list) => {
      const action = {
        account: list.code, // 合约名
        name: 'transfer', // 类型 - 转账
        authorization: [{ // 账户权限 - 名称 & 权限
          actor: fromName,
          permission,
        }],
        data: {
          from: fromName, // 转出账户 - 自己
          to: store.state.sys.toAccountList[chain], // 转入账户 - 对方
          quantity: list.quantity, // 合计数量 - 转账金额
          memo: list.memo, // memo - 交易信息
        }
      };
      actions.push(action);
    });
    actionObj.actions = actions;
    tokenpocket.pushEosAction(actionObj).then((data) => {
      alert(JSON.stringify(data)); // eslint-disable-line
      callback(null, data);
    }).catch((e) => {
      alert(`e: ${e}`); // eslint-disable-line
    });
  },
  /* -------- 一键卖出 end -------- */

  /* -------- 生成USN - 减少抵押比率生成USN start -------- */
  async generateUsn(obj, callback) {
    // console.log('生成USN')
    // scatterEosJs 已配置
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    const params = {
      actions: [
        {
          account: obj.toAccount, // 合约账户
          name: 'adjust', // adjust - 下调质押率
          authorization: [{
            actor: fromName, // 转账者
            permission, // 权限 active | owner
          }],
          data: {
            owner: fromName,
            rate: window.parseInt(obj.percent * 100),
            issue: obj.issue, // 1 - 生成 USN || 0 - 取出EOS
          }
        }
      ]
    };
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      // alert(e); // eslint-disable-line
      this.errorCall(e, callback)
    });
  },
  /* -------- 生成USN - 减少抵押比率生成USN end -------- */

  /* -------- 管理抵押量 - 减少抵押量 start -------- */
  async manageStake(obj, callback) {
    // console.log('管理抵押量')
    // scatterEosJs 已配置
    const accountInfo = store.state.app.accountInfo;
    const fromName = store.state.app.accountInfo.account;
    const permission = Array.isArray(accountInfo.permissions) ? accountInfo.permissions[0] : accountInfo.permissions;
    const params = {
      actions: [
        {
          account: obj.toAccount, // 合约账户
          name: 'withdraw', // adjust - 下调质押率
          authorization: [{
            actor: fromName, // 转账者
            permission, // 权限 active | owner
          }],
          data: {
            owner: fromName,
            quantity: obj.quantity,
          }
        }
      ]
    };
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      // console.log(res)
      callback(null, res);
    }).catch((e) => {
      // alert(e); // eslint-disable-line
      // console.log(e)
      this.errorCall(e, callback)
    });
  },
  /* -------- 管理抵押量 - 减少抵押量 end -------- */

  // 免CPU合约执行
  freeCpuTransaction(params, callback) {
    params.actions.forEach((item) => {
      item.authorization.unshift({
        actor: this.actorToFreeCpu,
        permission: 'active',
      })
    })
    this.scatterEosJs.transaction(params, {
      broadcast: !1, // 是否广播
      sign: !0,
    }).then((res) => {
      if (res.processed || res.transaction_id) {
        const p = res;
        const l = p.transaction.transaction;
        l.signatures = p.transaction.signatures;
        l.context_free_data = [];
        const signed = JSON.stringify(l);
        callback(null, signed)
      }
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },

  /* -------- 错误处理 start ------- */
  errorCall(err, callback) {
    let back = {
      code: 0,
      message: 'Unknown'
    }
    if (typeof (err) === 'string') {
      const e = JSON.parse(err);
      callback(e, null)
      return
    }
    const e = JSON.stringify(err);
    // 订单上限
    if (e.indexOf('Sorry, your orders has exceeded') !== -1) {
      back = {
        code: 1,
        message: 'too more order',
      }
    }
    if (err.msg === 'fail') {
      back = {
        code: 1,
        message: 'too more order',
      }
    }
    callback(back, null)
  }
  /* -------- 错误处理 end ------- */
};

export default TokenPocketModel;
