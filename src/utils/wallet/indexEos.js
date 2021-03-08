/* eslint-disable */
/**
 * 支持的钱包：
 *    morewallet  meetone   tokenpocket   mathwallet
 * default：
 *    支持scatter的所有钱包
 */

// 封装的js
import { Toast } from 'mint-ui';
import Scatter from './scatter';
import TokenPocket from './tokenpocket';
import BloksIo from './bloksIo';
import Lynx from './lynx';
import WaxJS from './wax';
import scatterEmbed from './Embed';

// 来源于哪个APP
let channel = '';

const DAppEos = {
  obj: null,

  // 设置channel
  setChannel(c, chain) {
    channel = c.toLowerCase();
    switch (channel) {
      // morewallet
      case 'scatterembed':
        this.obj = scatterEmbed;
        break;
      // WaxJS
      case 'wax':
        this.obj = WaxJS;
        break;
      // bloks.io内嵌钱包
      case 'bloksio':
        this.obj = BloksIo;
        break;
      // tokenpocket
      case 'tokenpocket':
        this.obj = TokenPocket;
        break;
      // Lynx
      case 'eoslynx':
        this.obj = Lynx;
        break;
      // 其他钱包支持scatter
      default:
        this.obj = Scatter;
        break;
    }
    this.obj.init(chain);
  },

  // 当前账号信息
  getAccount(callback) {
    this.obj.getAccount(callback);
  },

  // 获取app版本，提示更新
  checkAvailable(callback) {
    this.obj.checkAvailable(callback);
  },

  // 获取余额
  getCurrencyBalance(params, callback) {
    try {
      this.obj.getCurrencyBalance(params, callback);
    } catch (error) {
      console.log(error)
    }
  },

  // 转账
  transfer(params, callback) {
    this.obj.transfer(params, callback);
  },

  // 执行合约
  transactionApi(params, callback) {
    this.obj.transactionApi(params, callback);
  },

  // 私钥加密文本
  signText(text, callback) {
    this.obj.signText(text, callback);
  },

  // 抵押 & 赎回
  newdexStaked(params, callback) {
    this.obj.newdexStaked(params, callback);
  },

  // 合约撤单
  revoke(params, callback) {
    this.obj.revoke(params, callback)
  },

  // cpu/net 抵押
  delegatebw(params, callback) {
    this.obj.delegatebw(params, callback)
  },

  // cpu/net 赎回
  undelegatebw(params, callback) {
    this.obj.undelegatebw(params, callback)
  },

  // rex买入卖出
  rexTransaction(params, callback) {
    this.obj.rexTransaction(params, callback)
  },

  // 赎回并买入REX
  rexUnstaketorexTransaction(params, callback) {
    this.obj.rexUnstaketorexTransaction(params, callback)
  },

  // 租赁 cpu | net
  rent(params, callback) {
    this.obj.rent(params, callback)
  },

  // 存入租金
  depositRent(params, callback) {
    this.obj.depositRent(params, callback)
  },
  // 取回租金
  collectRent(params, callback) {
    this.obj.collectRent(params, callback)
  },
  // 取回储备金
  withdraw(params, callback) {
    this.obj.withdraw(params, callback)
  },

  // 生成账户充值地址
  newaddress(params, callback) {
    this.obj.newaddress(params, callback)
  },

  // 代理投票
  voteproducer(params, callback) {
    this.obj.voteproducer(params, callback)
  },

  // RAM交易 - 买入
  eosBuyram(quant, callback) {
    this.obj.eosBuyram(quant, callback)
  },
  // RAM交易 - 卖出
  eosSellram(bytes, callback) {
    this.obj.eosSellram(bytes, callback)
  },

  // 切换获得会员方式
  choosemode(params, callback) {
    this.obj.choosemode(params, callback)
  },
  // 消耗NDX获得会员
  consumption(params, callback) {
    this.obj.consumption(params, callback)
  },

  // 获取账户列表
  getWalletList(callback) {
    this.obj.getWalletList(callback);
  },
  // 一键卖出
  pushEosAction(dataList, callback) {
    this.obj.pushEosAction(dataList, callback);
  },
  // 生成USN
  generateUsn(params, callback) {
    this.obj.generateUsn(params, callback);
  },
  // 偿还USN
  repayUsn(params, callback) {
    this.obj.repayUsn(params, callback);
  },
  // 管理抵押量
  manageStake(params, callback) {
    this.obj.manageStake(params, callback);
  },
  // 爆单抢拍
  snatch(params, callback) {
    this.obj.snatch(params, callback);
  },
  // 控制页面是否需要tabbar
  setTabbar(type) {
    this.obj.setTabbar(type);
  },
  // 内嵌浏览器跳转
  toBrowser(dataList, callback) {
    this.obj.toBrowser(dataList, callback);
  },
  // 路由跳转
  routerTo(params) {
    this.obj.routerTo(params);
  },
  // scatter操作回调
  handleScatterErrorBack(res, vthis) {
    console.log('Error');
    console.log(res);
    if (res.code || res.error) {
      let code = res.code;
      if (code === 500 && res.error) {
        code = res.error.code;
      }
      if (res.error && res.error.details && res.error.details.length > 0
        && code !== 3080001
        && code !== 3080002
        && code !== 3080004
        && code !== 3040005) {
        const errorDetails = res.error.details[0].message.split(':')[1] || res.error.details[0].message;
        if (errorDetails.indexOf('too small') !== -1) {
          Toast(`${vthis.$t('db.db153')}`);
          return;
        }
        if (errorDetails.indexOf('too more order') !== -1 ||
        errorDetails.indexOf('Invalid packed transaction') !== -1 ||
        errorDetails.indexOf('User rejected the signature') !== -1) {
          Toast(`${vthis.$t('toastTip.fail')}`);
          return;
        }
        Toast(`${errorDetails}【${code}】`);
        return;
      }
      switch (code) {
        case 3080001:
          Toast(`${vthis.$t('error.error3080001')}`);
          break;
        case 3080002:
          Toast(`${vthis.$t('error.error3080002')}`);
          break;
        case 3080004:
          Toast(`${vthis.$t('error.error3080004')}`);
          break;
        case 3040005:
          Toast(`${vthis.$t('error.error3040005')}`);
          break;
        case 3050003:
          Toast(`${vthis.$t('error.error3050003')}`);
          break;
        default:
          if (res.code && res.message) {
            if (res.message.indexOf('too more order') !== -1 ||
            res.message.indexOf('Invalid packed transaction') !== -1 ||
            res.message.indexOf('User rejected the signature') !== -1) {
              Toast(`${vthis.$t('toastTip.fail')}`);
              return;
            }
            Toast(`${res.message} 【${res.code}】`);
            return;
          }
          Toast(`${res.message} `);
          break;
      }
      return;
    }
    if (res.data && res.data.code === 500 && typeof(res.data.message) === 'string') {
      const fjres = eval('('+res.data.message+')');
      console.log(fjres);
      this.handleScatterErrorBack(fjres);
      return;
    }
    Toast(`Unknow Error!【${res}】`);
  },
}

export default DAppEos;
