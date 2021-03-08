/**
 *
 * lynx 全部接口
 *
 */
/* eslint-disable */
// js
import axios from 'axios';
import * as compareVersions from 'compare-versions';
import Eos from 'eosjs-without-sort';

// store
import store from '../../store';

// import { Toast } from 'mint-ui';

// let lynx = null; // lynx

const Lynx = {

  ready: false,
  
  /* -------- 初始化 start -------- */
  init() {
    window.addEventListener('lynxMobileLoaded', function listen() {
      // lynx is on the window and ready!
      Lynx.ready = true;
    });
  },
  /* -------- 初始化 end -------- */

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    (async () => {
      if (!this.ready) {
        setTimeout(() => {
          this.getAccount(callback);
        }, 100);
      } else {
        let account = await this.syncGetAccount();
        const dataSet = account;
        dataSet.timer = new Date().getTime();
        store.dispatch('setAccountInfo', dataSet);
        callback(null, account);
      }
    })();
  },

  async syncGetAccount() {
    let result = '';
    try {
      result = await window.lynxMobile.requestSetAccount();
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }
    let chain = 'eos';
    if (result.chainId === 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86') { // bos
      chain = 'bos';
    } else if (result.chainId === '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11') { // telos
      chain = 'telos';
    } else if (result.chainId === 'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422') { // meetone
      chain = 'meetone';
    } else if (result.chainId === 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f') { // enu
      chain = 'enu';
    } else if (result.chainId === '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a') { // fibos
      chain = 'fibos';
    } else if (result.chainId === '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4') { // wax
      chain = 'wax';
    } else if (result.chainId === 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573') { // lynx
      chain = 'lynx';
    }
    const newData = {
      account_name: result.account.account_name,
      encodeName: Eos.modules.format.encodeName(result.account.account_name, false),
      address: '',
      permissions: [],
      chain,
    }
    if (result.account.permissions[0].perm_name === 'active') {
      newData.permissions.push('active');
    } else {
      newData.permissions.push('owner');
    }
    return newData;
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    (async () => {
      if (!this.ready) {
        setTimeout(() => {
          this.checkAvailable(callback);
        }, 100);
      } else {
        // let available = await this.syncCheckAvailable();
        callback(null, true);
      }
    })();
  },

  async syncCheckAvailable() {
    let result;
    try {
      result = await window.lynxMobile.requestSetAccount(store.state.app.accountInfo.account);
    } catch (err) {
      console.log(JSON.stringify(err));
      return;
    }
    let available = true;
    if (compareVersions(result.version, '2.0.2') >= 0) {
      available = true;
    }
    return available;
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
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
  },
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start -------- */
  transfer(params, callback) {
    (async () => {
      let result;
      // const chain = store.state.app.accountInfo.chain;
      let transcation = {
        contract: params.code,
        symbol: params.tokenName,
        toAccount: params.toAccount,
        amount: params.quantity.split(' ')[0],
        memo: params.memo,
      };
      try {
        result = await window.lynxMobile.transfer(transcation);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
      // console.log(result);
    })();
  },
  /* -------- 转账 end -------- */

  /* 全变量 actions */
  async transactionApi(obj, callback) {
    (async () => {
      let result;
      try {
        result = await window.lynxMobile.transact(obj.params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
      // console.log(result);
    })();
  },
  /* 全变量 actions end */

  /* -------- 签名 start -------- */
  signText(text, callback) {
    (async () => {
      let result;
      try {
        result = await window.lynxMobile.requestArbitrarySignature({
          data: text,
          whatFor: 'sign Account',
        });
      } catch (err) {
        return;
      }
      callback(null, result);
      // console.log(result); // "SIG_K1_JvbGYMSe7auMt8TvLUkoi1A1ywdqoNMmZ4vSeMfaFFtLL58eRGBtzk8HqbmyyrGWTUvhmFAQFHoMeF4icHrtwJQAqynqcD"
    })();
  },
  /* -------- 签名 end -------- */

  /* -------- 抵押 & 赎回 start ------- */
  newdexStaked(obj, callback) {
    (async () => {
      let result;
      try {
        const formName = store.state.app.accountInfo.account;
        const permission = store.state.app.accountInfo.permissions[0];
        const params = {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        // console.log(err);
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      // console.log(result)
      callback(null, result);
    })();
  },
  /* -------- 抵押 & 赎回 end ------- */

  /* -------- 合约撤单 start -------- */
  revoke(obj, callback) {
    (async () => {
      let result;
      try {
        const formName = store.state.app.accountInfo.account;
        const permission = store.state.app.accountInfo.permissions[0];
        const params = {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        // console.log(err);
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      // console.log(result)
      callback(null, result);
    })();
  },
  /* -------- 合约撤单 end -------- */

  /* -------- 抵押|赎回 CPU/NET 操作 start -------- */
  delegatebw(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /*
  * 释放CPU/NET 操作
  * @params cpu_quantity 额度
  * @params net_quantity 额度
  */
  undelegatebw(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- 抵押|赎回 CPU/NET 操作 end -------- */

  /* -------- REX 买卖操作 start -------- */
  /*
  * REX 买卖
  * rex trasaction
  */
  rexTransaction(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /*
  * 赎回 并买入REX
  */
  rexUnstaketorexTransaction(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- REX 买卖操作 start -------- */

  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 start -------- */
  // 租借CPU | NET type: 1 - cpu | 2 - net
  rent(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  // 存入租金 type: 1 - cpu | 2 - net
  depositRent(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  // 取回租金
  collectRent(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  // 取回租金
  withdraw(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 end -------- */

  /* -------- 充值|提现 兑换 start -------- */
  // 生成用户充值地址
  newaddress(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- 充值|提现 兑换 end -------- */

  /* -------- 代理投票 start ------- */
  voteproducer(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- 代理投票 end ------- */

  /* -------- RAM 交易 start -------- */
  /*
  * 买入RAM 操作
  * @params quant 额度
  */
  eosBuyram(quant, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /*
  * 卖出RAM 操作
  * @params bytes 数量
  */
  eosSellram(bytes, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- RAM 交易 end -------- */

  /* -------- 切换会员升级状态 start -------- */
  choosemode(obj, callback) {
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
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
    (async () => {
      let result;
      try {
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
        result = await window.lynxMobile.transact(params);
      } catch (err) {
        if (err.code && err.code === 500) { // 处理错误吗500
          this.errorCall(err, callback)
        }
        return;
      }
      callback(null, result);
    })();
  },
  /* -------- 会员消耗接口 end -------- */

  /* -------- 生成USN - 减少抵押比率生成USN start -------- */
  async generateUsn(obj, callback) {
    let result;
    try {
      const fromName = store.state.app.accountInfo.account;
      const permission = store.state.app.accountInfo.permissions[0];
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
              issue: 1, // 1 - 生成 USN || 0 - 取出EOS
            }
          }
        ]
      };
      result = await window.lynxMobile.transact(params);
    } catch (err) {
      if (err.code && err.code === 500) { // 处理错误吗500
        this.errorCall(err, callback)
      }
      return;
    }
    callback(null, result);
  },
  /* -------- 生成USN - 减少抵押比率生成USN end -------- */

  /* -------- 管理抵押量 - 减少抵押量 start -------- */
  async manageStake(obj, callback) {
    let result;
    try{
      const fromName = store.state.app.accountInfo.account;
      const permission = store.state.app.accountInfo.permissions[0];
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
      result = await window.lynxMobile.transact(params);
    } catch (err) {
      if (err.code && err.code === 500) { // 处理错误吗500
        this.errorCall(err, callback)
      }
      return;
    }
    callback(null, result);
  },
  /* -------- 管理抵押量 - 减少抵押量 end -------- */

  // 免CPU合约执行
  // freeCpuTransaction(params, callback) {
  //   params.actions.forEach((item) => {
  //     item.authorization.unshift({
  //       actor: this.actor,
  //       permission: 'active',
  //     })
  //   })
  //   this.scatterEosJs.transaction(params, {
  //     broadcast: !1, // 是否广播
  //     sign: !0,
  //   }).then((res) => {
  //     if (res.processed || res.transaction_id) {
  //       const p = res;
  //       const l = p.transaction.transaction;
  //       l.signatures = p.transaction.signatures;
  //       l.context_free_data = [];
  //       const signed = JSON.stringify(l);
  //       callback(null, signed)
  //     }
  //   }).catch((e) => {
  //     this.errorCall(e, callback);
  //   });
  // },

  //  catch 错误回调 ---- code: 3080004 - cpu不足 | 3080002 - net不足 | 3080001 - ram不足
  errorCall(e, callback) {
    const origin = e;
    let back = {
      code: 1000,
      message: 'Unknown anomaly',
    };
    const err = JSON.stringify(e);
    // 订单上限
    if (err.indexOf('Sorry, your orders has exceeded') !== -1) {
      back = {
        code: 1,
        message: 'too more order',
      }
    }
    // CPU 不足
    if (origin.error.code === 3080004) {
      back = {
        code: 3080004,
        message: 'Insufficient CPU resources',
      }
    }
    // NET 不足
    if (origin.error.code === 3080002) {
      back = {
        code: 3080002,
        message: 'Insufficient Net resources',
      }
    }
    // RAM 不足
    if (origin.error.code === 3080001) {
      back = {
        code: 3080001,
        message: 'Insufficient RAM resources',
      }
    }
    callback(back, null);
  },
}

export default Lynx;
