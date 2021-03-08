
/**
 * scatter 所有接口
 *
 * 网页scatter 和 Dapp 的区别：
 *  网页: 先配置网络，再获取账户信息
 *  Dapp: 先推送过来账户信息，再配置网络
 *
 */
// import Eos from 'eosjs';
import Ecc from 'eosjs-ecc';
import axios from 'axios';
// ENU - JS
// import Enu from 'enujs';
// import Fibos from 'fibos.js';
import { dealHost } from '@/utils/public';
import { handleUseFreeCpuPost } from '@/utils/publicApi';
// import { Toast } from 'mint-ui';
import Eos from 'eosjs-without-sort';
// store
import store from '../../store';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';

ScatterJS.plugins( new ScatterEOS() );

const abi = require('../../views/resources/ulit/eosio.system.json');

let envobj = null;
let EosJs = null;
let network = null;
let eosOptions = null;
// const urlData = GetUrlPara();

const regNode = (callback) => {
  // 配置
  EosJs = Eos({
    httpEndpoint: envobj.httpEndpoint,
    chainId: envobj.chainId,
    verbose: false,
  });
  // 网络
  network = {
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

const Scatter = {
  // 保存window.scatter
  scatter: null,
  hasScatter: false,
  Ecc,
  scatterEosJs: null,
  actorToFreeCpu: '111.3',

  /* -------- 初始化 start -------- */
  init(chain) {
    // 判断账户所属链 - 获取配置节点信息
    getNodeInfo(chain, () => {
      this.initHasChain(chain || 'eos');
    });
  },

  // url带chain时处理方法
  initHasChain(chain) {
    // 直接获取当前链信息
    if (network && eosOptions) {
      ScatterJS.connect('newdex.io').then((connected) => {
        if (!connected) {
          this.hasScatter = false;
          setTimeout(() => {
            this.initHasChain(chain);
          }, 1000);
          return false;
        }
        // 连接成功
        this.hasScatter = true;
        this.scatter = window.scatter || ScatterJS.scatter;
        this.scatterEosJs = this.scatter.eos(network, Eos, eosOptions, 'https');
        this.getAccount(() => {});
      });
      return;
    }
    setTimeout(() => {
      this.initHasChain(chain)
    }, 1000);
  },
  /* -------- 初始化 end -------- */

  /* -------- 验证App版本 start -------- */
  checkAvailable(callback) {
    setTimeout(() => {
      let available = true;
      // console.log(this.scatter); // eslint-disable-line
      this.scatter = window.scatter || ScatterJS.scatter;
      if (this.scatter) {
        available = true;
        callback(null, available);
        return;
      } else if (window.ironman) {
        available = true;
        callback(null, available);
        return;
      }
      callback(null, available);
    }, 3000);
  },
  /* -------- 验证App版本 end -------- */

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    try {
      if (store.state.app.accountInfo.chain !== 'fibos') {
        const newParams = {
          code: params.code,
          symbol: params.coin,
          account: store.state.app.accountInfo.account
        }
        axios.post(`${envobj.httpEndpoint}/v1/chain/get_currency_balance`, JSON.stringify(newParams)).then((res) => {
          if (!res.data.length) {
            callback(null, `0.0000 ${params.coin}`);
            return;
          }
          const returnData = res.data[0];
          callback(null, returnData);
        }).catch((e) => {
          console.log(`e: ${e}`); // eslint-disable-line
        })
        return;
      }

      // FIBOS  余额获取
      const newParams = {
        json: true,
        code: 'eosio.token',
        scope: store.state.app.accountInfo.account,
        table: 'accounts',
        limit: 1000,
      };
      EosJs.getTableRows(newParams).then((rammarket) => {
        if (!rammarket.rows.length) {
          callback(null, `0.0000 ${params.coin}`);
          return;
        }
        const rows = rammarket.rows;
        let hasBalance = false;
        rows.forEach((item) => {
          const balanceArr = item.balance.quantity.split(' ');
          if (params.coin === balanceArr[1] && params.code === item.balance.contract) {
            hasBalance = true;
            callback(null, item.balance.quantity);
          }
        });
        if (!hasBalance) {
          callback(null, `0.0000 ${params.coin}`);
        }
      });
    } catch (error) {
      setTimeout(() => {
        this.getCurrencyBalance(params, callback);
      }, 1000);
    }
  },
  /* -------- 获取余额 end -------- */

  /* -------- 获取账户信息 start ------- */
  /*
  * 获取钱包身份
  * get scatter identityInfo => publicKey
  */
  getAccount(callback) {
    if (!this.scatter) {
      setTimeout(() => {
        this.getAccount(callback);
      }, 800);
      return;
    }
    const self = this;
    // 获取授权
    self.scatter.getIdentity({
      accounts: [network]
    }).then((identity) => {
      const testName = '';
      const newAccount = {
        account_name: testName || identity.accounts[0].name,
        encodeName: Eos.modules.format.encodeName(testName || identity.accounts[0].name, false),
        permissions: [identity.accounts[0].authority],
        chain: 'eos', // 声明账户当前链
      }
      const urlChain = store.state.sys.urlChain;
      if (!urlChain) {
        if (identity.accounts[0].chainId === 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906') { // 主网EOS - chainId
          newAccount.chain = 'eos';
        } else if (identity.accounts[0].chainId === 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86') { // 主网BOS - chainId
          newAccount.chain = 'bos';
        } else if (identity.accounts[0].chainId === '') { // 生产MEETONE - chainId
          newAccount.chain = 'meetone';
        }
      } else {
        newAccount.chain = urlChain;
      }
      newAccount.chain = newAccount.chain.toLowerCase();
      const dataSet = newAccount;
      dataSet.timer = new Date().getTime();
      if (store.state.app.accountInfo
      && store.state.app.accountInfo.account !== newAccount.account_name) {
        dataSet.isChangeAccount = true;
      }
      store.dispatch('setAccountInfo', dataSet);
      callback(null, newAccount);
    }).catch((error) => {
      // 用户拒绝
      if (error.code === 402) {
        self.scatter.forgetIdentity();
        return false;
      }
      // 未解锁
      if (error.code === 423) {
        // setTimeout(() => {
        //   this.getIdentity(callback);
        // }, 1000);
        return false;
      }
      return '';
    });
  },
  /* -------- 获取账户信息 end ------- */

  /*
  * 获取eos账号信息
  * @params eosAccount
  * @return 账户信息
  */
  getAccountMain(callback) {
    if (!this.scatter.identity) return;
    const params = {
      account_name: this.scatter.identity.accounts[0].name
    };
    EosJs.getAccount(params).then(callback).catch(e => this.errorCall(e, callback));
  },

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
    const whatFor = ''; // 提示用户签名原因
    const isHash = false;
    if (localStorage.getItem('channel').toLowerCase() === 'mykey') {
      const newParams = {
        scope: self.scatter.identity.accounts[0].name,
        code: 'mykeymanager',
        table: 'keydata',
        json: true
      };
      EosJs.getTableRows(newParams).then((response) => {
        const rows = response.rows;
        if (!rows) return
        const publicKey = rows[3].key.pubkey;
        self.scatter.getArbitrarySignature(publicKey, text, whatFor, isHash).then((signature) => {
          callback(null, signature);
        }).catch((error) => {
          callback(error, null);
        });
      });
      return;
    }
    self.getAccountMain((res) => {
      // onechain getAccountMain方法连续返回两次 - 1.正常 / 2.错误 - 这个作为容错处理。
      if (res.error) {
        return;
      }
      const permission = self.scatter.identity.accounts[0].authority;
      const publicKey = res.permissions.find(v => v.perm_name === permission).required_auth.keys[0].key;

      if (store.state.app.accountInfo.chain !== 'fibos') {
        self.scatter.getArbitrarySignature(publicKey, text, whatFor, isHash).then((signature) => {
          callback(null, signature);
        }).catch((error) => {
          callback(error, null);
        });
      } else if (store.state.app.accountInfo.chain === 'fibos') {
        self.scatter.getArbitrarySignature(publicKey, text, whatFor, isHash, (err, subData) => {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, subData.result);
        })
      }
    });
  },
  /* -------- 签名 start -------- */

  /* -------- 转账 start ------- */
  /*
  * 转账/交易 操作
  * @params code 智能合约
  * @params toAccount 收款者
  * @params quantity  转账额度 如：'7.0000 SYS'
  * @memo 转账备注
  */
  transfer(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.transfer(obj, callback);
      }, 200);
      return;
    }
    // scatterEosJs 已配置
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
    const quantity = obj.quantity;
    if (store.state.app.accountInfo.chain !== 'fibos') {
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
        const actor = '111.3';
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
    } else if (store.state.app.accountInfo.chain === 'fibos') { // fibos 转账
      this.scatterEosJs.contract('eosio.token').then((ctx) => {
        ctx.extransfer(fromName, obj.toAccount, `${quantity}@${obj.code}`, obj.memo, {
          authorization: `${fromName}@${permission}`
        }).then((res) => {
          callback(null, res);
        }).catch((e) => {
          this.errorCall(e, callback);
        });
      });
    }
  },
  /* -------- 转账 end ------- */

  /* 全变量 actions */
  transactionApi(obj, callback) {
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
    this.scatterEosJs.transaction(obj.params).then((res) => {
      // console.log(res)
      callback(null, res);
    }).catch((e) => {
      // console.log(e)
      this.errorCall(e, callback)
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

  /* -------- 抵押 & 赎回 start ------- */
  newdexStaked(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.newdexStaked(obj, callback);
      }, 200);
      return;
    }

    // scatterEosJs 已配置
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },
  /* -------- 抵押 & 赎回 end ------- */

  /* -------- 合约撤单 start -------- */
  revoke(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.revoke(obj, callback);
      }, 200);
      return;
    }
    // scatterEosJs 已配置
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
    const params = {
      actions: [
        {
          account: obj.actionsAccount, // 合约账户
          name: 'cancelorder', // 撤单方法
          authorization: [{
            actor: fromName, // 撤单账户
            permission, // 权限可选（active, owen）
          }],
          data: {
            // owner: fromName, // 权限（active, owen）
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
          actor: fromName, // 撤单账户
          permission, // 权限可选（active, owen）
        }],
        data: {
          owner: fromName, // 权限（active, owen）
          pair_id: obj.symbolId, // (string)交易对ID
          // auth_type: 1,
        }
      }]
    }
    /* 免CPU撤单 */
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },
  /* -------- 合约撤单 end -------- */

  /* -------- 抵押|赎回 CPU/NET 操作 start -------- */
  /*
  * 抵押CPU/NET 操作
  * @params cpu_quantity 额度
  * @params net_quantity 额度
  * @transfer: 0,
  */
  delegatebw(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.delegatebw(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },

  /*
  * 释放CPU/NET 操作
  * @params cpu_quantity 额度
  * @params net_quantity 额度
  */
  undelegatebw(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.undelegatebw(obj, callback);
      }, 200);
      return;
    }
    // const fromName = this.scatter.identity.accounts[0].name;
    // const params = {
    //   from: fromName,
    //   receiver: obj.receiver || fromName,
    //   unstake_cpu_quantity: obj.cpu_quantity,
    //   unstake_net_quantity: obj.net_quantity,
    // };
    // this.scatterEosJs.undelegatebw(params).then((res) => {
    //   callback(null, res);
    // }).catch((e) => {
    //   this.errorCall(e, callback);
    // });
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },
  /* -------- 抵押CPU/NET 操作 end -------- */

  /* -------- REX 买卖操作 start -------- */
  /*
  * REX 买卖
  * rex trasaction
  */
  rexTransaction(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.rexTransaction(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },

  // 添加abi方法
  addAbiTransaction(params, callback) {
    if (this.scatterEosJs.fc.abiCache) {
      this.scatterEosJs.fc.abiCache.abi('eosio', abi);
      this.scatterEosJs.transaction(params).then((res) => {
        callback(null, res);
      }).catch((e) => {
        this.errorCall(e, callback);
      });
      return;
    }
    const err = {
      code: 'Scatter',
    }
    this.errorCall(err, callback);
  },

  /*
  * 赎回 并买入REX
  */
  rexUnstaketorexTransaction(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.rexUnstaketorexTransaction(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  /* -------- REX 买卖操作 start -------- */

  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 start -------- */
  // 租借CPU | NET type: 1 - cpu | 2 - net
  rent(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.rent(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  // 存入租金 type: 1 - cpu | 2 - net
  depositRent(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.depositRent(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  // 取回租金
  collectRent(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.collectRent(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  // 取回储备金
  withdraw(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.withdraw(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  /* -------- CPU/NET 租赁 & 存入租金 & 取回租金 end -------- */

  /* -------- 充值|提现 兑换 start -------- */
  // 生成用户充值地址
  newaddress(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.newaddress(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },
  // EOS -> BTC: 相当于提现
  withdrawal(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.withdrawal(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
    const quantity = obj.quantity;
    const params = {
      actions: [
        {
          account: obj.code, // ebtc合约 | eusd合约
          name: 'transfer',
          authorization: [{
            actor: fromName, // 转账者
            permission,
          }],
          data: {
            from: fromName,
            to: obj.toAccount || 'bitpiecurrex', // 收款账户 - bitpiecurrex
            quantity, // 转账数量 - '20 EUSD'
            memo: obj.memo // 转账memo - btcaddress,account
          }
        }
      ]
    };
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  },
  /* -------- 充值|提现 兑换 end -------- */

  /* -------- 代理投票 start ------- */
  // 参数： obj = {proxy: 'string'} 回调： callback(err, res)
  voteproducer(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.voteproducer(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      // console.log(res)
      callback(null, res);
    }).catch((e) => {
      // console.log(e)
      const err = e.toString()
      if (err.indexOf('Missing ABI action') !== -1) {
        this.addAbiTransaction(params, callback)
        return;
      }
      this.errorCall(e, callback);
    });
  },
  /* -------- 代理投票 end ------- */

  /* -------- RAM 交易 start -------- */
  /*
    * 买入RAM 操作
    * @params quant 额度
    */
  eosBuyram(quant, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.eosBuyram(quant, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },

  /*
  * 卖出RAM 操作
  * @params bytes 数量
  */
  eosSellram(bytes, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.eosSellram(bytes, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },
  /* -------- RAM 交易 end -------- */

  /* -------- 切换会员升级状态 start -------- */
  /**
   * @param {*} obj = {
   *  type: 1 - 抵押 | 0 - 消耗
   *  unstake: true - 赎回 | false - 不赎回
   *  amount: '1.0000 NDX'
   * }
   * @param {*} callback
   */
  choosemode(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.choosemode(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
          is_staked: obj.type==0?0:1, // 抵押 - true | false - 消耗
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },
  /* -------- 切换会员升级状态 end -------- */

  /* -------- 会员消耗接口 start -------- */
  /**
   * @param {*} obj = {
   *  quantity: "10.0000 NDX",
   *  memo: "1-3-eospublicbus"
   *  choosemode: 0, // 0 - 消耗
   * }
   * @param {*} callback
   */
  consumption(obj, callback) {
    // scatterEosJs 未配置
    if (!this.hasScatter) {
      setTimeout(() => {
        this.consumption(obj, callback);
      }, 200);
      return;
    }
    const fromName = this.scatter.identity.accounts[0].name;
    const permission = this.scatter.identity.accounts[0].authority;
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
    this.scatterEosJs.transaction(params).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  },
  /* -------- 会员消耗接口 end -------- */

  /* -------- 生成USN - 减少抵押比率生成USN start -------- */
  async generateUsn(obj, callback) {
    // console.log('生成USN')
    // scatterEosJs 已配置
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
      this.errorCall(e, callback)
    });
  },
  /* -------- 生成USN - 减少抵押比率生成USN end -------- */

  /* -------- 管理抵押量 - 减少抵押量 start -------- */
  async manageStake(obj, callback) {
    // console.log('管理抵押量')
    // scatterEosJs 已配置
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
    if (obj.useFreeCpu) {
      this.freeCpuTransaction(params, callback)
      return;
    }
    this.scatterEosJs.transaction(params).then((res) => {
      // console.log(res)
      callback(null, res);
    }).catch((e) => {
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

  //  catch 错误回调 ---- code: 3080004 - cpu不足 | 3080002 - net不足 | 3080001 - ram不足
  errorCall(e, callback) {
    let back = {
      error: {
        code: '0001',
      },
      message: 'Unknown anomaly',
    };
    try {
      if (typeof (e) === 'object') {
        if (e.code === 402) {
          back = {
            code: '402',
            message: 'User rejected the signature request',
          }
        }
      }
      if (typeof (e) === 'string') {
        const err = JSON.parse(e);
        // 订单上限
        if (e.indexOf('Sorry, your orders has exceeded') !== -1) {
          back = {
            code: 1,
            message: 'too more order',
          }
        }
        // CPU 不足
        if (err.error.code === 3080004) {
          back = {
            code: 3080004,
            message: 'Insufficient CPU resources',
          }
        }
        // NET 不足
        if (err.error.code === 3080002) {
          back = {
            code: 3080002,
            message: 'Insufficient Net resources',
          }
        }
        // RAM 不足
        if (err.error.code === 3080001) {
          back = {
            code: 3080001,
            message: 'Insufficient RAM resources',
          }
        }
      }
      callback(back, null);
    } catch (error) {
      callback(back, null);
    }
  },
}

export function EosJsInit() {
  return EosJs;
}

export default Scatter;
