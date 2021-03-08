/* eslint-disable */
/**
 * 波宝钱包对接
 */
// store
import store from '../../store';
import { Decimal } from 'decimal.js';
import axios from 'axios';


const TronLink = {
  tronWeb: null,
  login: false,
  install: false,
  address: '',
  balanceList: [],

  // tron初始化
  init() {
    try {
      if (location.href.indexOf('&debug=open') > 0) {
        alert(JSON.stringify(window.tronWeb.defaultAddress))
      }
    } catch (error) {
      console.log(error);
    }
    console.log(window.tronWeb);
    if (window.tronWeb) {
      this.install = true;
      this.tronWeb = window.tronWeb;
      this.login = this.tronWeb.ready;
      this.address = this.tronWeb.defaultAddress.base58 || '';
      return;
    }
    setTimeout(() => {
      this.init();
    }, 1500);
  },

  // 验证版本 - 直接返回true
  checkAvailable(callback) {
    setTimeout(() => {
      let available = true;
      if (window.tronWeb) {
        available = true;
      }
      callback(null, available);
    }, 3000);
  },

  /* -------- 获取账户信息 start -------- */
  getAccount(callback) {
    console.log(this.tronWeb);
    if (!this.tronWeb) {
      setTimeout(() => {
        this.getAccount(callback)
      }, 200);
      return;
    }
    this.address = this.tronWeb.defaultAddress.base58;
    if (!this.address) {
      setTimeout(() => {
        this.getAccount(callback)
      }, 200);
      return
    }
    this.tronWeb.trx.getAccount(this.address).then((res) => {
      let accountName = '';
      if (res.account_name) {
        accountName = this.tronWeb.toUtf8(res.account_name);
      }
      const address = this.tronWeb.address.fromHex(res.address);
      const permissions = res.active_permission ? res.active_permission[0].permission_name : 'active';
      const permissionsId = res.active_permission ? res.active_permission[0].id : 1;
      const dataSet = {
        name: accountName, // 展示用 - 暂未发现实际用途
        account: address,
        address,
        addressHex: res.address,
        permissions, // 权限
        permissionsId, // 权限id
        chain: 'tron'
      }
      dataSet.timer = new Date().getTime();
      if (store.state.app.accountInfo
      && store.state.app.accountInfo.account !== dataSet.account) {
        dataSet.isChangeAccount = true;
      }
      store.dispatch('setAccountInfo', dataSet);
      // alert(JSON.stringify(newData))
      callback(null, dataSet);
    }).catch((e) => {
      console.log(e); // eslint-disable-line
    });
  },
  /* -------- 获取账户信息 end -------- */

  /* -------- 获取账户资源 start -------- */
  getAccountResources(callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.getAccountResources(callback)
      }, 200);
      return;
    }
    // TMjKTVZGJw9zwTBfZ6dDuhQ3YxHfSpzJrU this.address
    const address = this.tronWeb.defaultAddress.base58;
    if (!address) {
      setTimeout(() => {
        this.getAccountResources(callback)
      }, 200);
      return
    }
    this.tronWeb.trx.getAccountResources(address).then((res) => {
      callback(null, res);
    }).catch((e) => {
      this.init();
      setTimeout(() => {
        this.getAccountResources(callback)
      }, 2000);
    });
  },
  // 获取账户冻结资产
  getAccountFrozen(callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.getAccountResources(callback)
      }, 200);
      return;
    }
    this.tronWeb.trx.getUnconfirmedAccount().then((res) => {
      let energyFrozen = 0;
      if (res.account_resource && res.account_resource.frozen_balance_for_energy) {
        energyFrozen = this.tronWeb.fromSun(res.account_resource.frozen_balance_for_energy.frozen_balance || 0);
      }
      let netFrozen = 0;
      if (res.frozen) {
        netFrozen = this.tronWeb.fromSun(res.frozen[0].frozen_balance);
      }
      const totalFrozen = Number(netFrozen) + Number(energyFrozen);
      const newRes = {
        totalFrozen,
        energyFrozen,
        netFrozen,
      }
      callback(null, newRes);
    }).catch((e) => {
      console.log(e); // eslint-disable-line
      this.init();
      setTimeout(() => {
        this.getAccountResources(callback)
      }, 2000);
    });
  },
  /* -------- 获取账户资源 end -------- */

  /* -------- 设置用户名 start -------- */
  // obj: name - 8~32位
  updateAccount(obj, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.updateAccount(callback)
      }, 200);
      return;
    }
    this.tronWeb.trx.updateAccount(obj.name).then((res) => {
      callback(null, res);
    }).catch((e) => {
      if (e.indexOf('This name has existed') !== -1) {
        const err = {
          code: 1,
          msg: 'This name has existed',
        }
        callback(err, null)
      }
      console.log(e); // eslint-disable-line
    });
  },
  /* -------- 设置用户名 end -------- */

  /* -------- 获取余额 start -------- */
  async getCurrencyBalance(obj, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.getCurrencyBalance(obj, callback)
      }, 200);
      return;
    }
    try {
      // 查询TRX - 直接获取账户
      if (obj.coin === 'TRX') {
        const balan = await this.tronWeb.trx.getAccount(store.state.app.accountInfo.address);
        const balance = this.tronWeb.fromSun(balan.balance);
        callback(null, `${balance} ${obj.coin}`);
        return;
      }
      const trc10 = obj.code.length !== 34;
      // 获取TRC10余额
      if (trc10) {
        this.getBalanceTrc10(obj, callback);
        return;
      }
      // 查询其他币种余额 - 通过合约
      const balan = await this.tronWeb.contract().at(obj.code);
      const decimals = obj.decimal;
      // const balan = await this.tronWeb.contract().at('T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb');
      let balance = '0.000000';
      const t = await balan.balanceOf(store.state.app.accountInfo.address).call();
      if (isNaN(t)) {
        balance = t.balance / (10 ** decimals);
      } else {
        balance = t / (10 ** decimals);
      }
      callback(null, `${balance} ${obj.coin}`);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 获取TRX10的余额
  getBalanceTrc10(obj, callback) {
    this.tronWeb.trx.getUnconfirmedAccount().then((res) => {
      if (res.assetV2) {
        const arr = res.assetV2;
        let has = false;
        arr.forEach((item) => {
          if (item.key === obj.code) {
            has = true;
            const decimals = obj.decimal;
            const balance = item.value / (10 ** decimals);
            callback(null, `${balance} ${obj.coin}`);
            return;
          }
        });
        if (!has) {
          callback(null, `0 ${obj.coin}`);
        }
      }
    }).catch((err) => {
      callback(err, `0 ${obj.coin}`);
    });
  },
  /* -------- 获取余额 end -------- */

  /* -------- 转账 start -------- */
  async transfer(params, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.transfer(callback)
      }, 200);
      return;
    }
    // console.log(params)
    const ref = localStorage.getItem('channel');
    const source = `channel: dapp, ref: ${ref}`
    const trad = store.state.app.trad;
    // 调用合约转账
    if (params.status === 'buy') {
      // TRX/USDT交易对
      if (trad.symbol1 === 'TRX' && trad.symbol2 === 'USDT') {
        this.transferBuyTrxByUSdt(params, source, callback);
        return;
      }
      // TRX交易区
      if (trad.symbol2 === 'TRX') {
        this.transferBuy(params, source, callback);
        return;
      }
      // usdt交易区
      if (trad.symbol2 === 'USDT') {
        this.transferBuyByUsdt(params, source, callback);
      }
      return;
    }
    // TRX/USDT交易对
    if (trad.symbol1 === 'TRX' && trad.symbol2 === 'USDT') {
      this.transferSellTrxByUsdt(params, source, callback);
      return;
    }
    // TRX交易区
    if (trad.symbol2 === 'TRX') {
      this.transferSell(params, source, callback);
      return;
    }
    // usdt交易区
    if (trad.symbol2 === 'USDT') {
      this.transferSellByUsdt(params, source, callback);
    }
  },
  // 买入
  async transferBuy(params, source, callback) {
    try {
      const trad = store.state.app.trad;
      let contract = await this.tronWeb.contract().at(params.code);
      let decimals = trad.coinDecimal;
      const numCoinSun = new Decimal(params.coinCount).mul(new Decimal(10 ** decimals));
      const coinSun = numCoinSun.toFixed(); // 数量sun
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString()); // 价格 - 固定 *（10 ** 10）
      const memo = JSON.parse(params.memo); // 订单信息
      const quantity = params.quantity.split(' ')[0]; // 总估值
      const quantityCount = Number(Decimal.mul(quantity, 10 ** trad.valuationCoinDecimal).toString()); // 总估值转换成整数
      // console.log(params.code1, coinSun, price, quantityCount)
      // trc20
      if (params.code1.length === 34) {
        let result = await contract.buyOrder(params.code1, coinSun, price, memo.type, source).send({
          feeLimit: 1e7,
          shouldPollResponse: true,
          callValue: quantityCount
        })
        // result = await tronWeb.trx.getTransaction(result);
        callback(null, result);
        return;
      }
      // trc10
      let result = await contract.buyToken(params.code1, coinSun, price, memo.type, source).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: quantityCount
      })
      // result = txinfo = await tronWeb.trx.getTransaction(result);
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 买入 - 用usdt买入trx
  async transferBuyTrxByUSdt(params, source, callback) {
    // console.log('usdt买入trx')
    try {
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      // const decimals = params.precision;
      // const coinSun = Number(Decimal.mul(params.coinCount, 10 ** decimals).toString()); // 数量sun
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString());
      const memo = JSON.parse(params.memo)
      const trad = store.state.app.trad;
      const quantity = params.quantity.split(' ')[0]; // 总估值
      const quantityCount = Number(Decimal.mul(quantity, 10 ** trad.valuationCoinDecimal).toString()); // 总估值转换成整数
      // console.log(params.code1, price, quantityCount)
      let contract = await this.tronWeb.contract().at(params.code);
      let result = await contract.approve(params.dexCode, quantityCount).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: 0
      });
      result = await dexContract.buyTrx(params.code2, quantityCount, price, memo.type, source).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: 0
      });
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 买入 - 使用USDT买入其他币种
  async transferBuyByUsdt(params, source, callback) {
    // console.log('使用USDT买入其他币种')
    try {
      const trad = store.state.app.trad;
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      const quantity = params.quantity.split(' ')[0]; // 总估值
      const quantityCount = Number(Decimal.mul(quantity, 10 ** trad.valuationCoinDecimal).toString()); // 总估值转换成整数
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString());
      const decimals = trad.coinDecimal;
      const coinSun = Number(Decimal.mul(params.coinCount, 10 ** decimals).toString()); // 买入数量sun
      const memo = JSON.parse(params.memo)
      // console.log(params.code1, coinSun, price, quantityCount)
      let contract = await this.tronWeb.contract().at(params.code);
      let result = await contract.approve(params.dexCode, quantityCount).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: 0
      });
      // trc20
      if (params.code1.length === 34) {
        result = await dexContract.trc20Buy(params.code, params.code1, quantityCount, coinSun, price, memo.type, source).send({
          feeLimit: 1e7,
          shouldPollResponse: true,
          callValue: 0
        });
        callback(null, result);
        return;
      }
      // trc10
      result = await dexContract.trc20BuyToken(params.code, params.code1, quantityCount, coinSun, price, memo.type, source).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: 0
      });
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 卖出
  async transferSell(params, source, callback) {
    try {
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      const decimals = params.precision;
      const numCoinSun = new Decimal(params.coinCount).mul(new Decimal(10 ** decimals));
      const coinSun = numCoinSun.toFixed(); // 数量sun
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString()); // 价格 - 固定 *（10 ** 10）
      const memo = JSON.parse(params.memo)
      // console.log(params.code1, coinSun, price)
      if (params.code.length === 34) {
        // console.log(coinSun)
        const contract = await tronWeb.contract().at(params.code);
        let result = await contract.approve(params.dexCode, coinSun).send({
          feeLimit: 1e7,
          // shouldPollResponse: true,
          callValue: 0
        });
        result = await dexContract.sellOrder(params.code, coinSun, price, memo.type, source).send({
          feeLimit: 1e7,
          // shouldPollResponse: true,
          callValue: 0
        })
        // console.log(result)
        callback(null, result);
        return;
      }
      let result = await dexContract.sellToken(price, memo.type, source).send({
        feeLimit: 1e7,
        // shouldPollResponse: true,
        tokenId: params.code,
        tokenValue: coinSun,
      })
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 卖出TRX - 卖出trx得到usdt
  async transferSellTrxByUsdt(params, source, callback) {
    // console.log('卖出trx得到usdt')
    try {
      const trad = store.state.app.trad;
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      const decimals = params.precision;
      const numCoinSun = new Decimal(params.coinCount).mul(new Decimal(10 ** decimals));
      const coinSun = numCoinSun.toFixed(); // 数量sun
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString()); // 价格 - 固定 *（10 ** 10）
      const memo = JSON.parse(params.memo)
      const getCount = Number(Decimal.mul(params.getCount, 10 ** trad.valuationCoinDecimal).toString())
      // console.log(params.code1, coinSun, price, getCount)
      const result = await dexContract.sellTrx(params.code2, getCount, price, memo.type, source).send({
        feeLimit: 1e7,
        // shouldPollResponse: true,
        callValue: coinSun
      });
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 卖出 - usdt作为计价币
  async transferSellByUsdt(params, source, callback) {
    // console.log('usdt作为计价币 - 卖出基础币种')
    try {
      const trad = store.state.app.trad;
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      const price = Number(Decimal.mul(params.coinPrice, 10 ** 10).toString()); // 价格 - 固定 *（10 ** 10）
      const memo = JSON.parse(params.memo)
      const decimals = params.precision;
      const coinSun = Number(Decimal.mul(params.coinCount, 10 ** decimals).toString()); // 数量sun
      const getCount = Number(Decimal.mul(params.getCount, 10 ** trad.valuationCoinDecimal).toString())
      // console.log(params.code1, coinSun, price, getCount)
      if (params.code1.length === 34) {
        const contract = await tronWeb.contract().at(params.code);
        let result = await contract.approve(params.dexCode, coinSun).send({
          feeLimit: 1e7,
          // shouldPollResponse: true,
          callValue: 0
        });
        result = await dexContract.trc20Sell(
          params.code2, params.code1,
          getCount, coinSun,
          price,
          memo.type, source
        ).send({
          feeLimit: 1e7,
          // shouldPollResponse: true,
          callValue: 0
        });
        callback(null, result);
        return;
      }
      const result = await dexContract.trc20SellToken(
        params.code2, params.code1,
        getCount, coinSun,
        price,
        memo.type, source
      ).send({
        feeLimit: 1e7,
        // shouldPollResponse: true,
        tokenId: params.code1,
        tokenValue: coinSun,
      })
      callback(null, result);
    } catch (error) {
      // console.log(error)
      callback(error, null);
    }
  },
  // 转账TRX
  async sendTrx() {
    try {
      const params = {
        to: '41ec1cbf51cfcf0416ffab03778541728b4025153f',
        amount: this.tronWeb.toSun(100),
        from: store.state.app.accountInfo.addressHex,
        options: store.state.app.accountInfo.permissionsId,
        id: '1000001'
      }
      console.log(params)
      // // 转账TRX
      const rr = await this.tronWeb.transactionBuilder.sendTrx(
        params.to,
        params.amount,
        params.from,
        params.options);
      console.log('---- sendTrx start ----')
      console.log('rr === ', rr)
      console.log('---- sendTrx end ----')
      // // 转账Token
      // const rr = await this.tronWeb.transactionBuilder.sendToken(params.to, params.amount, params.id, params.from, params.options);
      // // 获得能量
      // let rr = await this.tronWeb.transactionBuilder.freezeBalance(this.tronWeb.toSun(10), 3, "ENERGY", store.state.app.accountInfo.addressHex);
      let result = await this.tronWeb.trx.sign(rr);
      result = await this.tronWeb.trx.sendRawTransaction(result);
      console.log(12345)
    } catch (error) {
      console.log(error)
    }
  },
  /* -------- 转账 end -------- */

  /* -------- 签名 start ------- */
  signText(data, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.signText(data, callback)
      }, 200);
      return;
    }
    const newData = this.tronWeb.toHex(data);
    this.tronWeb.trx.sign(newData).then((res) => {
      callback(null, res);
    }).catch((err) => {
      callback(err, null);
    });
  },
  /* -------- 签名 end ------- */

  /* -------- 合约撤单 start ------- */
  async revoke(params, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.revoke(params, callback)
      }, 200);
      return;
    }
    try {
      // console.log(params)
      const dexContract = await this.tronWeb.contract().at(params.dexCode);
      const result = await dexContract.cancelOrder(params.orderId).send({
        feeLimit: 1e7,
        shouldPollResponse: true,
        callValue: 0
      })
      callback(null, result)
    } catch (error) {
      // console.log(error)
      callback(error, null)
    }
  },
  /* -------- 合约撤单 end ------- */

  /* -------- 资源操作 start -------- */
  /*
  * 冻结trx获取资源
  * obj = {
  *   amount: 10,
  *   resource: true | false, // 可不传 不传默认带宽， true - 能量
  *   address: '', // 可不传
  * }
  * @param amount 要冻结的 TRX (在 SUN 中) 的数量
  * @param duration 冻结 TRX 的天数。至少 3 天
  * @param resource 你为了获得而冻结 TRX 的资源。必须是 “BANDWIDTH（带宽）” 或 “ENERGY（能量）”。
  * @param address（可选） 要冻结的 TRX 所有者的地址（默认为呼叫者的默认地址）
  */
  async freezeBalance(obj, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.freezeBalance(obj, callback)
      }, 200);
      return;
    }
    let resource = 'BANDWIDTH'; // “BANDWIDTH（带宽）” 或 “ENERGY（能量）”,
    if (obj.resource) {
      resource = 'ENERGY';
    }
    const amount = this.tronWeb.toSun(obj.amount);
    const address = store.state.app.accountInfo.addressHex;
    let receiver = address;
    if (obj.address !== store.state.app.accountInfo.addressHex) {
      receiver = obj.address;
    }
    try {
      const rr = await this.tronWeb.transactionBuilder.freezeBalance(amount, 3, resource, address, receiver);
      const sign = await this.tronWeb.trx.sign(rr);
      const result = await this.tronWeb.trx.sendRawTransaction(sign);
      callback(result);
    } catch (error) {
      callback(error);
    }
  },
  /*
  * 解冻trx资源
  * obj = {
  *   resource: true | false, // 不传默认带宽
  *   address: store.state.app.accountInfo.addressHex, // 解冻TRX的所有者地址
  *   receiver: store.state.app.accountInfo.addressHex, // 被解冻账户地址
  * }
  * @param resource 你为了获得而冻结 TRX 的资源。必须是 “BANDWIDTH（带宽）” 或 “ENERGY（能量）”。
  * @param address 要解冻的 TRX 所有者的地址
  */
  async unfreezeBalance(obj, callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.unfreezeBalance(obj, callback)
      }, 200);
      return;
    }
    let resource = 'BANDWIDTH'; // “BANDWIDTH（带宽）” 或 “ENERGY（能量）”,
    if (obj.resource) {
      resource = 'ENERGY';
    }
    if (!obj.address) {
      obj.address = store.state.app.accountInfo.addressHex;
    }
    if (!obj.receiver) {
      obj.receiver = obj.address;
    }
    try {
      const rr = await this.tronWeb.transactionBuilder.unfreezeBalance(resource, obj.address, obj.receiver);
      const sign = await this.tronWeb.trx.sign(rr);
      const result = await this.tronWeb.trx.sendRawTransaction(sign);
      callback(result);
    } catch (error) {
      callback(error);
    }
  },
  // 获取冻结列表
  async freeznList(callback) {
    const back = {
      meToAther: [], // 我给别人冻结的
      atherToMe: [], // 别人给我冻结的
      allBandwidthFromOther: 0, // 别人给我抵押的总带宽
      allEnergyForOther: 0, // 别人给我抵押的总能量
      
      allBandwidthToOther: 0, // 我给别人抵押的总带宽
      allEnergyToOther: 0, // 我给别人抵押的总能量

      meToMeBandwidth: { // 自己给自己的宽带冻结
        expire_time: 0,
        frozen_balance: 0
      },
      meToMeEnergy: { // 自己给自己的能量冻结
        expire_time: 0,
        frozen_balance: 0
      },
    }
    const result = await axios.get(`https://apilist.tronscan.org/api/account?address=${this.tronAccountAddress}`);
    if (result.status === 200) {
      const data = result.data;
      const delegated = data.delegated;
      if (delegated && delegated.sentDelegatedBandwidth.length > 0) {
        // 宽带
        delegated.sentDelegatedBandwidth.forEach((v) => {
          const item = {
            type: 'bandwidth', // 宽带
            tiem: v.expire_time_for_bandwidth,
            from: v.from,
            to: v.to,
            number: this.tronWeb.fromSun(v.frozen_balance_for_bandwidth)
          }
          back.meToAther.push(item)
        })
      }
      if (delegated && delegated.sentDelegatedResource.length > 0) {
        // 能量
        delegated.sentDelegatedResource.forEach((v) => {
          const item = {
            type: 'energy', // 能量
            tiem: v.expire_time_for_energy,
            from: v.from,
            to: v.to,
            number: this.tronWeb.fromSun(v.frozen_balance_for_energy)
          }
          back.meToAther.push(item)
        })
      }
      if (delegated && delegated.receivedDelegatedBandwidth.length > 0) {
        // 宽带
        delegated.receivedDelegatedBandwidth.forEach((v) => {
          const item = {
            type: 'bandwidth', // 宽带
            tiem: v.expire_time_for_bandwidth,
            from: v.from,
            to: v.to,
            number: this.tronWeb.fromSun(v.frozen_balance_for_bandwidth)
          }
          back.atherToMe.push(item)
        })
      }
      if (delegated && delegated.receivedDelegatedResource.length > 0) {
        // 能量
        delegated.receivedDelegatedResource.forEach((v) => {
          const item = {
            type: 'energy', // 能量
            tiem: v.expire_time_for_energy,
            from: v.from,
            to: v.to,
            number: this.tronWeb.fromSun(v.frozen_balance_for_energy)
          }
          back.atherToMe.push(item)
        })
      }
    }
    const firme = await this.tronWeb.trx.getUnconfirmedAccount(this.tronAccountAddress);
    if (firme && firme.account_resource) {
      back.allEnergyForOther = this.tronWeb.fromSun(firme.account_resource.acquired_delegated_frozen_balance_for_energy || 0);
      back.allBandwidthFromOther = this.tronWeb.fromSun(firme.acquired_delegated_frozen_balance_for_bandwidth || 0);
      back.allEnergyToOther = this.tronWeb.fromSun(firme.account_resource.delegated_frozen_balance_for_energy || 0);
      back.allBandwidthToOther = this.tronWeb.fromSun(firme.delegated_frozen_balance_for_bandwidth || 0);
      //自己给自己冻结
      const bandwidth = firme.frozen;
      if (bandwidth && bandwidth.length > 0) {
        back.meToMeBandwidth = {
          expire_time: bandwidth[0].expire_time,
          frozen_balance: this.tronWeb.fromSun(bandwidth[0].frozen_balance)
        }
      }
      const energy = firme.account_resource.frozen_balance_for_energy;
      if (energy) {
        back.meToMeEnergy = {
          expire_time: energy.expire_time,
          frozen_balance: this.tronWeb.fromSun(energy.frozen_balance)
        }
      }
    }
    callback(back);
  },
  /* -------- 资源操作 end -------- */

  // 获取已经投票节点信息
  async getVotes(callback) {
    if (!this.tronWeb) {
      setTimeout(() => {
        this.getVotes(callback)
      }, 200);
      return;
    }
    try {
      const data = await this.tronWeb.trx.getAccount();
      // 全部冻结
      let energy = 0;
      if (data.account_resource && data.account_resource.frozen_balance_for_energy) {
        energy = data.account_resource.frozen_balance_for_energy.frozen_balance;
      }
      let frozenToOtherEnergy = 0; // 自己为他人抵押的能量
      if (data.account_resource && data.account_resource.delegated_frozen_balance_for_energy) {
        frozenToOtherEnergy = data.account_resource.delegated_frozen_balance_for_energy;
      }
      let net = 0;
      if (data.frozen) {
        net = data.frozen[0].frozen_balance;
      }
      let frozenToOtherBandwidth = 0; // 自己为他人抵押的带框
      if (data.delegated_frozen_balance_for_bandwidth) {
        frozenToOtherBandwidth = data.delegated_frozen_balance_for_bandwidth;
      }
      let total = Decimal.add(Number(energy), Number(net)).toString();
      total = Decimal.add(Number(total), Number(frozenToOtherBandwidth)).toString();
      total = Decimal.add(Number(total), Number(frozenToOtherEnergy)).toString();
      total = Decimal.div(total, 10 ** 6).toString();
      // 已投票数
      let voted = 0;
      const votedLists = [];
      const lists = data.votes || [];
      lists.forEach((v) => {
        voted += v.vote_count;
        const address = this.tronWeb.address.fromHex(v.vote_address);
        votedLists.push({
          address,
          count: v.vote_count
        });
      });
      const ableToVotes = Decimal.sub(Number(total), Number(voted)).toString(); // 可投票数
      const trxBalance = this.tronWeb.fromSun(data.balance);
      const resData = {
        total, // 全部冻结 - 全部票数
        voted, // 已投票数
        // frozenToOtherEnergy,
        // frozenToOtherBandwidth,
        ableToVotes,
        trxBalance, // TRX余额
        votedLists, // 投票列表
      }
      callback(null, resData);
    } catch (error) {
      if (error === 'Invalid address provided') {
        this.init();
        setTimeout(() => {
          this.getVotes(callback)
        }, 200);
        return;
      }
      callback(error, null);
    }
  },
}

// setTimeout(() => {
//   TronLink.freeznList((err, res) => {
//     console.log(err)
//     console.log(res)
//   })
// }, 5000);

export default TronLink;
