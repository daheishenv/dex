// /* eslint-disable */
import * as waxjs from '@waxio/waxjs/dist';
import axios from 'axios';

import store from '../../store';

let envobj = null;

// 获取节点配置信息
const getNodeInfo = (chain) => {
  const p = new Promise((resolve, reject) => {
    let thisChain = chain;
    if (!chain) {
      thisChain = 'wax';
    }
    if (!store.state.sys.nodeList || !store.state.sys.nodeList[`${thisChain}Node`]) {
      reject('err');
      return;
    }
    envobj = store.state.sys.nodeList[`${thisChain}Node`];
    // envobj.httpEndpoint = 'https://wax.greymass.com'; // +++++
    resolve('success');
  })
  return p;
}

class WaxClass {
  constructor() {
    this.count = 0; // 统计次数
    this.Wax = null;
    this.waxjs = null;
    this.getWax = false; // 获取到 Wax 对象
  }

  init(chain) {
    store.dispatch('setUrlChain', chain || 'wax');
    getNodeInfo(chain).then(() => {
      this.Wax = new waxjs.WaxJS(envobj.httpEndpoint);
      this.waxjs = this.Wax;
      this.getWax = true; // 获取到 Wax 对象
    }).catch(() => {
      setTimeout(() => {
        this.count += 1;
        if (this.count >= 100) {
          return;
        }
        this.init();
      }, 100);
    });
  }

  // 登录
  async getAccount(callback) {
    const userAccount = await this.waxjs.login();
    const newAccount = {
      account_name: userAccount,
      permissions: 'active',
      chain: 'wax', // 声明账户当前链
      publicKey: '',
    }
    callback(null, newAccount)
  }

  checkAvailable = (callback) => {
    callback(null, true)
  }

  /* -------- 获取余额 start -------- */
  getCurrencyBalance(params, callback) {
    try {
      const newParams = {
        code: params.code,
        symbol: params.coin,
        account: store.state.app.accountInfo.account
        // account: 'eospublicbus' // +++++
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
    } catch (error) {
      setTimeout(() => {
        this.getCurrencyBalance(params, callback);
      }, 200);
    }
  }
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start ------- */
  /*
  * 转账/交易 操作
  * @params code 智能合约
  * @params toAccount 收款者
  * @params quantity  转账额度 如：'7.0000 SYS'
  * @memo 转账备注
  */
  async transfer(obj, callback) {
    // scatterEosJs 未配置
    if (!this.getWax) {
      setTimeout(() => {
        this.transfer(obj, callback);
      }, 200);
      return;
    }
    // scatterEosJs 已配置
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions;
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
    try {
      const res = await this.waxjs.api.transact(params, {
        blocksBehind: 3,
        expireSeconds: 1200,
      });
      callback(null, res);
    } catch (error) {
      this.errorCall(error, callback)
    }
  }
  /* -------- 转账 end ------- */

  /* 全变量 actions */
  async transactionApi(obj, callback) {
    if (!this.hasScatter) {
      setTimeout(() => {
        this.transactionApi(obj, callback);
      }, 200);
      return;
    }
    try {
      const res = await this.waxjs.api.transact(obj.params, {
        blocksBehind: 3,
        expireSeconds: 1200,
      });
      callback(null, res);
    } catch (error) {
      this.errorCall(error, callback)
    }
  }
  /* 全变量 actions end */

  /* -------- 签名 start -------- */
  /*
  * 给定的公钥的私钥对任意数据进行签名
  * @params publicKey EOS账户的公钥
  * @params data EOS账户名+时间戳
  * @params whatFor 标题
  * @params isHash data是否为hash
  */
  signText = (text, callback) => {
    const chainId = store.state.sys.nodeList.waxNode.chainId;
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions;

    const back = {
      timestamp: text,
      type: 'dapp'
    }

    const params = {
      actions: [
        {
          account: 'newdexverify',
          name: 'verify',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            data: text.toString()
          }
        }
      ]
    }
    this.waxjs.api.transact(params, {
      broadcast: !1, // 是否广播
      blocksBehind: 3,
      expireSeconds: 1200,
    }).then(async (res) => {
      if (res.signatures) {
        const chainIdBuf = new Buffer(chainId, 'hex');
        const buf = Buffer.from(Uint8Array.from(res.serializedTransaction), 'hex');
        const packedContextFreeData = new Buffer(new Uint8Array(32));
        const signBuf = Buffer.concat([chainIdBuf, buf, packedContextFreeData]);
        back.signature = res.signatures[0];
        back.signBase64 = Buffer.from(signBuf).toString('base64');
        callback(null, back);
      }
    }).catch((e) => {
      this.errorCall(e, callback);
    });
  }

  revoke = (obj, callback) => {
    const fromName = store.state.app.accountInfo.account;
    const permission = store.state.app.accountInfo.permissions;
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
            order_id: obj.orderId, // (string)订单id
            pair_id: obj.symbolId, // (string)交易对ID
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
        }
      }]
    }
    this.waxjs.api.transact(params, {
      blocksBehind: 3,
      expireSeconds: 1200,
    }).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.errorCall(e, callback)
    });
  }
  /* -------- 合约撤单 end -------- */

  //  catch 错误回调 ---- code: 3080004 - cpu不足 | 3080002 - net不足 | 3080001 - ram不足
  errorCall = (e, callback) => {
    let back = {
      error: {
        code: '0001',
      },
      message: 'Unknown anomaly',
    };
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
  }
}
// const waxJS = new WaxClass()
// waxJS.init()

// setTimeout(() => {
//   console.log(2345)
//   waxJS.getAccount()
// }, 2000);

export default new WaxClass();
