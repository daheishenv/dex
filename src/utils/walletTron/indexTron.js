/* eslint-disable */
/**
 * 支持的钱包：
 *    morewallet  meetone   tokenpocket   mathwallet
 * default：
 *    支持scatter的所有钱包
 */

// 封装的js
import Tron from './tronlink';

// 来源于哪个APP
let channel = '';

const DAppTron = {
  obj: null,

  // 设置channel
  setChannel(c, chain) {
    channel = c;
    switch (channel) {
      case 'mathwallet':
        this.obj = Tron;
        break;
      // 其他钱包支持scatter
      default:
        this.obj = Tron;
        break;
    }

    this.obj.init(chain);
  },

  // 当前账号信息
  getAccount() {
    return new Promise((reslove) => {
      this.obj.getAccount((res, data) => {
        reslove(data)
      });
    })
    
  },

  // 获取账户资源
  getAccountResources(callback) {
    this.obj.getAccountResources(callback)
  },

  // 获取账户冻结资产
  getAccountFrozen(callback) {
    this.obj.getAccountFrozen(callback)
  },

  // 获取app版本，提示更新
  checkAvailable(callback) {
    this.obj.checkAvailable(callback);
  },

  // 设置账户名 - obj：name - 8～32 位
  updateAccount(params, callback) {
    this.obj.updateAccount(params, callback);
  },

  // 获取余额
  getCurrencyBalance(params, callback) {
    try {
      this.obj.getCurrencyBalance(params, callback);
    } catch (error) {
    }
  },

  // 转账
  transfer(params, callback) {
    this.obj.transfer(params, callback);
  },

  // 私钥加密文本
  signText(text, callback) {
    this.obj.signText(text, callback);
  },

  // 合约撤单
  revoke(params, callback) {
    this.obj.revoke(params, callback)
  },

  // 代理投票
  voteproducer(params, callback) {
    this.obj.voteproducer(params, callback)
  },

  // 冻结TRX
  freezeBalance(params, callback) {
    this.obj.freezeBalance(params, callback)
  },

  // 解冻TRX
  unfreezeBalance(params, callback) {
    this.obj.unfreezeBalance(params, callback)
  },

  // 获取冻结列表
  freeznList(callback) {
    this.obj.freeznList(callback)
  },

  // 获取冻结列表
  getVotes(callback) {
    this.obj.getVotes(callback)
  },
}

export default DAppTron;
