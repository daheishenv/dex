/* eslint-disable */
/*
  开发目的：提供交易所的深度、提高交易所的交易量
  开发需求：
  现有订单薄结合SWAP(defibox+defis)的深度
  价格从SWAP实时获取
  卖单价格公式：初始价格+((初始价格*滑点)/挂单数)
  买单价格公式：初始价格-((初始价格*滑点)/挂单数)
  金额(EOS)公式：金额(EOS)=(滑点*EOS底池数)-(滑点*EOS底池数*0.3%）
  数量(BOX)公式：数量(BOX)=金额(EOS)/价格(EOS)
  滑点：0.5%
**/
import axios from 'axios';
import store from '../../store';
// accAdd、accSub、accMul、accDiv
import { toFixed, accAdd, accSub, accMul, accDiv } from '@/utils/public';

const isProduction = process.env.NODE_ENV === 'production';
const eosNode = store.state.sys.nodeList.eosNode;

export default {
  slip: 0.003, // 滑点
  orderNumber: 50, // 挂单数
  free: 0.003, // 手续费
  node: eosNode,
  options: {
    boxPairId: '',
    dfsPairId: '',
    depthMergeNumber: 0, // 深度合并位
  },
  init: async function(options) {
    this.options = options;
    this.slip = options.slip;
    // 获取池子合并后的数据
    const mergePond = await this.mergePond();
    const quote = mergePond.quote;
    const base = mergePond.base;
    // 初始价格
    const price = parseFloat((accDiv(parseFloat(quote.quantity), parseFloat(base.quantity)) * 1).toFixed(this.options.priceDecimal));
    const sell = this.sell(parseFloat(price), mergePond); // 卖出深度
    const buy = this.buy(parseFloat(price), mergePond); // 买入深度
    const asks = this.depthMerge(sell);
    const bids = this.depthMerge(buy);

    return {
      price,
      pond: mergePond,
      asks, // 卖出深度
      bids // 买入深度
    }
  },
  /**
   * price 初始价格
   * pairData 池子数据
  */
  sell: function(price, pairData) { // 卖
    const sellArr = [];
    for (let i = 0; i < this.orderNumber; i++) {
      let dwPrice = price; // 档位价格
      let dwNumber = 0; // 档位对应数量
      if (sellArr.length !== 0) {
        dwPrice = sellArr[sellArr.length - 1].price;
        dwNumber = sellArr.reduce((all, item) => accAdd(all, item.num) , 0);
      }
      // 卖单价格公式：档位价格+((初始价格 * 滑点))
      const sellPrice = parseFloat((accAdd(dwPrice, accMul(price, this.slip)) * 1).toFixed(this.options.priceDecimal));
      // 卖单数量公式：数量=((价格/前一档价格)*滑点*(矿币底池-前一挡卖单数量))/2
      const num = accDiv(accMul(accMul(accDiv(sellPrice, dwPrice), this.slip),accSub(parseFloat(pairData.base.quantity), dwNumber)), 2);
      // 卖单金额(EOS)公式：金额(EOS)=卖单价格*卖单数量
      const amount = accMul(sellPrice, num)
      sellArr.push({
        price: sellPrice,
        checked: false,
        amount,
        num
      });
    }
    // 数据整合前先调整深度合并
    if (this.options.priceDecimal !== this.options.depthMergeNumber) {
      let addDecime = accDiv(1, Math.pow(10, this.options.depthMergeNumber));
      sellArr.forEach(v => {
        v.price = accAdd(addDecime, parseFloat(toFixed(v.price, this.options.depthMergeNumber)));
      });
    }
    // 数据整合
    const dexArr = this.options.depthData.asks;
    if (dexArr.length === 0) {
      return sellArr;
    }
    // 两组数据并集
    const arr = dexArr.concat(sellArr);
    return arr;
  },
  buy: function(price, pairData) { // 买
    const buyArr = [];
    for (let i = 0; i < this.orderNumber; i++) {
      let dwPrice = price; // 档位价格
      let dwNumber = 0; // 档位对应数量
      if (buyArr.length !== 0) {
        dwPrice = buyArr[buyArr.length - 1].price;
        dwNumber = buyArr.reduce((all, item) => accAdd(all, item.num) , 0);
      }
      // 价格(EOS)=前一档价格-(初始价格*滑点)
      const buyPrice = parseFloat((accSub(dwPrice, accMul(price, this.slip)) * 1).toFixed(this.options.priceDecimal));
      // 买单数量公式：数量=((价格/前一档价格)*滑点*(矿币底池+前一挡卖单数量))/2
      // console.log(buyPrice, dwPrice, this.slip, pairData.base.quantity, dwNumber);
      const num = accDiv(accMul(accMul(accDiv(buyPrice, dwPrice), this.slip),accAdd(parseFloat(pairData.base.quantity), dwNumber)), 2);
      // 买单金额(EOS)公式：金额(EOS)=买单价格*买单数量
      const amount = accMul(buyPrice, num);
      buyArr.push({
        price: buyPrice,
        checked: false,
        amount,
        num
      })
    }
    // 数据整合
    let dexArr = this.options.depthData.bids;
    if (dexArr.length === 0) {
      return buyArr;
    }
    // 两组数据并集
    const arr = dexArr.concat(buyArr);
    return arr;
  },
  depthMerge: function(arr) { // 深度合并
    let depthArr = arr;
    depthArr.forEach(v => {
      v.price = parseFloat(toFixed(v.price, this.options.depthMergeNumber));
    });
    depthArr.sort((a, b) => a.price - b.price);
    // 深度合并 找出有价格相同的
    const items = [];
    if (depthArr.length > 0) {
      depthArr.forEach((v, i) => {
        if (i === 0) {
          items.push(v)
        } else {
          if (v.price === items[items.length - 1].price) {
            const item = items[items.length - 1];
            item.num = accAdd(parseFloat(item.num), parseFloat(v.num));
            item.amount = accAdd(parseFloat(item.amount), parseFloat(v.amount));
          } else {
            items.push(v)
          }
        }
      })
    }
    return items;
  },
  // 获得最大的池子
  maxPond: async function() {
    const box = await this.boxPair();
    const dfs = await this.dfsPair();
    if (box && dfs) {
      return parseFloat(box.base.quantity) >= parseFloat(dfs.base.quantity) ? box : dfs;
    }
    if (box) {
      return box
    }
    if (dfs) {
      return dfs
    }
  },
  // 获取累计池子-所有池子合并
  mergePond: async function() {
    const box = await this.boxPair();
    const dfs = await this.dfsPair();
    // 格式统一
    if (box && dfs) {
      const backItem = {
        box_id: box.id,
        dfs_id: dfs.id,
        token: accAdd(parseFloat(box.liquidity_token), parseFloat(dfs.liquidity_token)),
      }
      backItem.quote = box.quote;
      backItem.quote.quantity = accAdd(parseFloat(box.quote.quantity), parseFloat(dfs.quote.quantity));
      backItem.base = box.base;
      backItem.base.quantity = accAdd(parseFloat(box.base.quantity), parseFloat(dfs.base.quantity));
      return backItem;
    }
    if (box) {
      const backItem = {
        box_id: box.id,
        dfs_id: null,
        token: parseFloat(box.liquidity_token)
      }
      backItem.quote = box.quote;
      backItem.quote.quantity = parseFloat(box.quote.quantity);
      backItem.base = box.base;
      backItem.base.quantity = parseFloat(box.base.quantity);
      return backItem;
    }
    if (dfs) {
      const backItem = {
        box_id: null,
        dfs_id: dfs.id,
        token: parseFloat(dfs.liquidity_token),
      }
      backItem.quote = dfs.quote;
      backItem.quote.quantity = parseFloat(dfs.quote.quantity);
      backItem.base = dfs.base;
      backItem.base.quantity = parseFloat(dfs.base.quantity);
      return backItem;
    }
  },
  boxPair: async function() {
    if (!this.options.boxPairId) return null;
    const JsonBOX = {
      "code": "swap.defi",
      "scope": "swap.defi",
      "table": "pairs",
      "lower_bound": this.options.boxPairId,
      "upper_bound": this.options.boxPairId,
      "json": true,
      "limit": 1
    }
    const rows = await this.getTableRows(JsonBOX);
    if (rows.length > 0) {
      const item = rows[0];
      // 统一整理
      return this.pairArrangement({
        id: this.options.boxPairId,
        liquidity_token: item.liquidity_token,
        symbol0: item.token0.symbol.split(','),
        symbol1: item.token1.symbol.split(','),
        contract0: item.token0.contract,
        contract1: item.token1.contract,
        reserve0: item.reserve0,
        reserve1: item.reserve1
      })
    }
  },
  dfsPair: async function() {
    if (!this.options.dfsPairId) return null;
    const JsonDFS = {
      "code": "defisswapcnt",
      "scope": "defisswapcnt",
      "lower_bound": this.options.dfsPairId,
      "upper_bound": this.options.dfsPairId,
      "table": "markets",
      "json": true,
      "limit": 1
    }
    const rows = await this.getTableRows(JsonDFS);
    if (rows.length > 0) {
      // 格式统一
      const item = rows[0];
      // 统一整理
      return this.pairArrangement({
        id: this.options.dfsPairId,
        liquidity_token: item.liquidity_token,
        symbol0: item.sym0.split(','),
        symbol1: item.sym1.split(','),
        contract0: item.contract0,
        contract1: item.contract1,
        reserve0: item.reserve0,
        reserve1: item.reserve1
      })
    }
  },
  // 池子数据统一格式整理
  pairArrangement(obj) {
    const {
      id,
      liquidity_token,
      symbol0,
      symbol1,
      contract0,
      contract1,
      reserve0,
      reserve1
    } = obj;
    // 格式统一
    const backItem = {
      id,
      token: liquidity_token,
      quote: { // 计价币EOS
      },
      base: { // 基础币
      }
    }
    const symbol = this.options.symbol;
    let priceCoin = '';
    if (symbol && symbol.indexOf('-') !== -1) {
      priceCoin = symbol.split('-')[2];
    }
    if (priceCoin.toUpperCase() === symbol0[1].toUpperCase()) {
      backItem.quote = {
        coin: symbol0[1],
        contract: contract0,
        decimal: symbol0[0],
        quantity: reserve0,
      }
      backItem.base = {
        coin: symbol1[1],
        contract: contract1,
        decimal: symbol1[0],
        quantity: reserve1,
      }
    } else {
      backItem.quote = {
        coin: symbol1[1],
        contract: contract1,
        decimal: symbol1[0],
        quantity: reserve1,
      }
      backItem.base = {
        coin: symbol0[1],
        contract: contract0,
        decimal: symbol0[0],
        quantity: reserve0,
      }
    }
    return backItem;
  },

  // 获取所有池子数据
  getPonds: async function(options) {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    // accAdd、accSub、accMul、accDiv
    const box = await this.boxPair();
    const dfs = await this.dfsPair();
    if (box && dfs) {
      const totalQuantity = accAdd(parseFloat(box.base.quantity), parseFloat(dfs.base.quantity));
      box.zb = toFixed(accDiv(parseFloat(box.base.quantity), totalQuantity)*100, 2);
      dfs.zb = toFixed(accDiv(parseFloat(dfs.base.quantity), totalQuantity)*100, 2);
      box.price = toFixed(accDiv(parseFloat(box.quote.quantity), parseFloat(box.base.quantity)), this.options.priceDecimal)
      dfs.price = toFixed(accDiv(parseFloat(dfs.quote.quantity), parseFloat(dfs.base.quantity)), this.options.priceDecimal)
      box.logo = 'https://ndi.340wan.com/eos/token.defi-box.png';
      dfs.logo = 'https://ndi.340wan.com/eos/minedfstoken-dfs.png';
      return { Defibox: box, Defis: dfs }
    }
    if (box) {
      const totalQuantity = accAdd(parseFloat(box.base.quantity), 0);
      box.zb = toFixed(accDiv(parseFloat(box.base.quantity), totalQuantity)*100, 2);
      box.price = toFixed(accDiv(parseFloat(box.quote.quantity), parseFloat(box.base.quantity)), this.options.priceDecimal)
      box.logo = 'https://ndi.340wan.com/eos/token.defi-box.png';
      return { Defibox: box }
    }
    if (dfs) {
      const totalQuantity = accAdd(0, parseFloat(dfs.base.quantity));
      dfs.zb = toFixed(accDiv(parseFloat(dfs.base.quantity), totalQuantity)*100, 2);
      dfs.price = toFixed(accDiv(parseFloat(dfs.quote.quantity), parseFloat(dfs.base.quantity)), this.options.priceDecimal)
      dfs.logo = 'https://ndi.340wan.com/eos/minedfstoken-dfs.png';
      return { Defis: dfs }
    }
    return false;
  },
  getTableRows: async function(params) {
    // const href = 'https://eos.newdex.one';
    const net = this.node.url; // href || 
    const result = await axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params),
    {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      }
    });
    if (result && result.status === 200) {
      return result.data.rows;
    }
  },
}