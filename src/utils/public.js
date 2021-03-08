/* eslint-disable */
import moment from 'moment';
import { Decimal } from 'decimal.js';

import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
import DApp from '@/utils/wallet';
// import { Toast } from 'mint-ui';
import store from '../store';

// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function getFullNum(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  // 处理不需要转换的数字
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num).toFixed(18).replace(/\.?0+$/, '');
}

// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number, pp) {
  let num = isNaN(number) || !number ? 0 : number;
  let p = isNaN(pp) || !pp ? 0 : pp;
  num = getFullNum(num);
  var n = (num + '').split('.'); // eslint-disable-line
  var x = n.length > 1 ? n[1] : ''; // eslint-disable-line
  if (x.length > p) { // eslint-disable-line
    x = x.substr(0, p); // eslint-disable-line
  } else { // eslint-disable-line
    x += Array(p - x.length + 1).join('0'); // eslint-disable-line
  } // eslint-disable-line
  return n[0] + (x == '' ? '' : '.' + x); // eslint-disable-line
}

/*
 ** 加法函数，用来得到精确的加法结果
 ** 返回值：arg1 + arg2的精确结果 Number 型
*/
export function accAdd(arg1, arg2) {
  const num = Decimal(arg1).add(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 减法函数，用来得到精确的减法结果
 ** 返回值：arg1 - arg2的精确结果 Number 型
*/
export function accSub(arg1, arg2) {
  const num = new Decimal(arg1).sub(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 乘法函数，用来得到精确的乘法结果
 ** 返回值：arg1 * arg2的精确结果 Number 型
*/
export function accMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  const num = new Decimal(arg1).mul(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 除法函数，用来得到精确的除法结果
 ** 返回值：arg1 / arg2的精确结果 Number 型
*/
export function accDiv(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0
  }
  const num = new Decimal(arg1).div(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

// 将科学计数法转换为小数
export function toNonExponential(num) {
  if (num === null) {
    return 0;
  }
  if (isNaN(num)) {
    return 0;
  }
  const fnum = new Decimal(num);
  return fnum.toFixed();
}

/**
 * 时间戳转成本地时间
 */
export function toLocalTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

export function toLocalTimeOld(time) {
  let changeTime = time;
  if (changeTime.length > 23) {
    changeTime = changeTime.substr(0, 23);
  }
  const myDate = new Date(changeTime);
  const year = myDate.getFullYear();
  const month = myDate.getMonth() + 1 > 9 ? (myDate.getMonth() + 1) : `0${(myDate.getMonth() + 1)}`;
  const day = myDate.getDate() > 9 ? myDate.getDate() : `0${myDate.getDate()}`;
  const hour = myDate.getHours() > 9 ? myDate.getHours() : `0${myDate.getHours()}`;
  const min = myDate.getMinutes() > 9 ? myDate.getMinutes() : `0${myDate.getMinutes()}`;
  const sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : `0${myDate.getSeconds()}`;

  const str = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  return str;
}

export function GetUrlPara() {
  const url = document.location.toString();
  const arrUrl = url.split('?');
  if (arrUrl.length === 1) {
    return {
      dapp: 'moreWallet',
    };
  }
  const para = arrUrl[1];
  const qureyArr = para.split('&');
  const params = {};
  for (let i = 0; i < qureyArr.length; i += 1) {
    const arr = qureyArr[i].split('=');
    params[arr[0]] = arr[1];
  }
  return params;
}

// 判断是否微信打开
export function isWeixn() {
  const ua = navigator.userAgent.toLowerCase();
  const uaArr = ua.match(/MicroMessenger/i);
  if (uaArr && uaArr[0] === 'micromessenger') {
    return true;
  }
  return false;
}

// 判断是否为ios
export function isIOS() { 
  const u = navigator.userAgent;
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isIos;
}

// 查看本地缓存是否存在该交易对id - routeSymbol : trybenetwork-trybe-eos
export function getCacheSymbolId(routeSymbol) {
  let res = '';
  const cacheData = store.state.app.allSymbolData;
  for (const key in cacheData) { // eslint-disable-line
    if (key !== 'change') {
      cacheData[key].forEach((item) => { // eslint-disable-line
        if (item.symbol.toLowerCase() === routeSymbol) {
          res = item.id;
        }
      });
    }
  }
  return res;
}

// 0舍1人截取 - PC端处理方式
// t 数值
// s 位数
export function toFixedReset(t, s) {
  var changenum = (parseInt(t * Math.pow( 10, s ) + 0.9) / Math.pow( 10, s )).toString(); // eslint-disable-line
  var index = changenum.indexOf("."); // eslint-disable-line
  if (index<0 && s>0) { // eslint-disable-line
    changenum = changenum + "."; // eslint-disable-line
    for (let i=0; i<s; i++) { // eslint-disable-line
      changenum = changenum + "0"; // eslint-disable-line
    }
  } else {
    index = changenum.length - index; // eslint-disable-line
    for(let i=0; i<(s-index)+1; i++) { // eslint-disable-line
      changenum = changenum + "0"; // eslint-disable-line
    }
  }
  return changenum;
}

// 处理数据 - 0舍1入 - 针对卖盘
// price 价格
// deep 深度
export function toFixedResetDapp(price, deep) {
  const sellPrice = toFixed(Number(price), deep);
  // 深度合并到个位及小数时
  // 处理前 === 处理后 ？ 是：不进行上合并 | 否：进行上合并
  if (Number(price) === Number(sellPrice) && deep >= 0) {
    return sellPrice;
  }
  // 深度合并到十位及以上
  const min = Decimal(`1e${-deep}`); // 上合并
  if (deep < 0) {
    const t1 = price % min;
    let t = toFixed(price / min, 0);
    if (t1 === 0) {
      return toFixed(min * t, deep);
    }
    t = Number(t) + 1;
    return toFixed(min * t, deep);
  }
  let ipSellPrice = Decimal.add(min, sellPrice).toString();
  ipSellPrice = toFixed(Number(ipSellPrice), deep);
  return ipSellPrice;
}

// 处理数据 - 0舍1入 - 针对买盘
// price 价格
// deep 深度
export function toFixedDownDapp(price, deep) {
  const sellPrice = toFixed(Number(price), deep);
  // 深度合并到个位及小数时
  if (deep >= 0) {
    return sellPrice;
  }
  // 深度合并到十位及以上
  const min = Decimal(`1e${-deep}`); // 下合并
  const t = toFixed(price / min, 0);
  return toFixed(min * t, deep);
}

// 倒计时
export function countdown(endtime) {
  let t = Date.parse(endtime.replace(/-/g, '/')) - Date.parse(new Date());
  t += 5000;
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let seconds = Math.floor((t / 1000) % 60);
  hours = hours >= 10 ? hours : `0${hours}`;
  minutes = minutes >= 10 ? minutes : `0${minutes}`;
  seconds = seconds >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }
  return { total: t, days, hours, minutes, seconds };
}

// 跳转对应链上的区块浏览器 - id: txid | account , chain: 所属链 , type: 'tx' | 'account' | 'token'
export function toBrowser(id, chain, type, isEmbed) {
  if (chain === 'tron') {
    if (type === 'token') {
      const arr = id.split('-');
      if (arr[2].length === 34) {
        location.href = `${store.state.sys.blockBrowser[chain].token20}${arr[2]}`;
        return;
      }
      location.href = `${store.state.sys.blockBrowser[chain][type]}${arr[2]}`;
      return
    }
  }
  // console.log(`${store.state.sys.blockBrowser[chain][type]}${id}`)
  let url = `${store.state.sys.blockBrowser.eos[type]}${id}`
  if (chain && chain !== 'eos') {
    url = `${store.state.sys.blockBrowser[chain][type]}${id}`;
  }
  if (GetUrlPara().embed || isEmbed) { // 内嵌TX跳转
    DApp.toBrowser(url)
    return
  }
  location.href = url;
}

// 侧链对应母币处理
export function handleChainBaseCoin() {
  // 波产母币筛选
  if (appName === 'tronNewdex') {
    return 'TRX'
  }
  if (store.state.app.accountInfo && store.state.app.accountInfo.chain === 'fibos') {
    return 'FO';
  }
  // if (store.state.app.accountInfo && store.state.app.accountInfo.chain === 'lynx') {
  //   return 'LNX';
  // }
  if (store.state.app.accountInfo && store.state.app.accountInfo.chain === 'proton') {
    return 'XUSDT';
  }
  // 分区计价币种处理
  const arr = {};
  const obj = store.state.sys.newArea;
  const t = Object.keys(obj);
  t.forEach((key) => {
    if (key === 'self') {
      return;
    }
    const subObj = Object.keys(obj[key])
    subObj.forEach((item) => {
      arr[item.toLowerCase()] = obj[key][item].chainCode;
    });
  });
  return store.state.app.accountInfo ? arr[store.state.app.accountInfo.chain] : 'EOS';
}

// 订单日期范围筛选
export function handleDateToOrder(index) {
  // 整年度
  if (index !== 0) {
    const year = 2017 + index;
    const dateArr = [
      `${year}-01-01`,
      `${year}-12-31`,
    ]
    return dateArr;
  }
  // 近三个月
  const nowDate = new Date();
  const years = nowDate.getFullYear();
  let months = nowDate.getMonth() + 1; // 0 ~ 11
  let days = nowDate.getDate(); // 1 ~ 31
  let beginYear = years;
  let beginMonth = months - 3;
  let beginDay = days;
  if (beginMonth <= 0) {
    beginMonth = 9 + months;
    beginYear -= 1;
  }
  if ((new Date(2019, 2, 0).getDate()) < days) {
    beginDay = new Date(2019, 2, 0).getDate()
  }
  months = months > 9 ? months : `0${months}`;
  days = days > 9 ? days : `0${days}`;
  beginMonth = beginMonth > 9 ? beginMonth : `0${beginMonth}`;
  beginDay = beginDay > 9 ? beginDay : `0${beginDay}`;
  const dateArr = [
    `${beginYear}-${beginMonth}-${beginDay}`,
    `${years}-${months}-${days}`,
  ]
  return dateArr;
}

// 搜索功能
export function handleSearchData(inSearchData, vthis) {
  // 处理数据
  let allData = [];
  for (const key in store.state.app.allSymbolData) { // eslint-disable-line
    if (key !== 'change' && key !== 'self') {
      allData.push(...store.state.app.allSymbolData[key])
    }
  }
  // 对象去重
  let obj = {};
  allData = allData.reduce((prevArr, v) => {
    obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
    return prevArr;
  }, []);
  // 浅拷贝 - 数据处理
  const sourceSymbolList = JSON.stringify(allData);
  const wsList = JSON.parse(sourceSymbolList);
  wsList.forEach((item) => {
    vthis.$set(item, 'symbol1', item.symbol1.toUpperCase());
    vthis.$set(item, 'symbol2', item.symbol2.toUpperCase());

    const price = toFixed(item.price, item.precision.price);
    vthis.$set(item, 'price', price);

    const change = toFixed(Decimal.mul(item.change, 100), 2);
    vthis.$set(item, 'change', change);
  });
  // 搜索符合symbol1的交易对
  const searchData = inSearchData.toUpperCase().split('/');
  let filterArr = wsList.filter((item) => {
    const index = item.symbol1.indexOf(searchData[0]);
    if (index !== -1) {
      vthis.$set(item, 'index', index);
      return true;
    }
    return false;
  })
  if (searchData.length === 2) {
    filterArr = filterArr.filter((item) => {
      const index = item.symbol2.indexOf(searchData[1]);
      if (index !== -1) {
        vthis.$set(item, 'index', index);
        return true;
      }
      return false;
    })
  }
  // 按字母排序 - [a ～ z]
  filterArr.sort((obj1, obj2) => {
    if (obj1.symbol1 >= obj2.symbol1) {
      return 1;
    }
    return -1;
  })
  // 按查询左优先排序
  filterArr.sort((obj1, obj2) => {
    if (obj1.index >= obj2.index) {
      return 1;
    }
    return -1;
  })
  return filterArr;
}

/*
* 多个对象的数组的sort重新排序 调用
* propertyName 排序值
*/
export function createComparison(propertyName) {
  return ((object1, object2) => {
    const value1 = object1[propertyName];
    const value2 = object2[propertyName];
    if (Number(value1) < Number(value2)) {
      return -1;
    } else if (Number(value1) > Number(value2)) {
      return 1;
    }
    return 0;
  });
}

// host判断
export function dealHost() {
  let env = 'formal'; // formal - 正式 | test - 测试
  const host = process.env.NODE_ENV;
  switch (host) {
    case 'test':
    case 'development':
    case 'tron':
    case 'texth5':
      env = 'test';
      break;
    default:
      env = 'formal';
      break;
  }
  return env;
}

// 处理IOS输入框失去焦点后网页不还原问题
export function iosInputBlurBug() {
  const u = navigator.userAgent;
  let flag;
  let myFunction;
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isIos) {
    document.body.addEventListener('focusin', () => { // 软键盘弹起事件
      flag = true;
      window.clearTimeout(myFunction);
    })
    document.body.addEventListener('focusout', () => { // 软键盘关闭事件
      flag = false;
      if (!flag) {
        const y = window.scrollY;
        myFunction = window.setTimeout(() => {
          window.scrollTo({ top: y || 0, left: 0, behavior: 'smooth' }) // 重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
        }, 200);
      }
    })
  }
}

// 处理字符串缩略 < 12 隐藏后半部分 | === 12 隐藏中间部分 | > 12 显示前五位和后五位
export function dealLongStr(str) {
  // let newStr = '';
  // if (str.length < 12) {
  //   const n = (str.length / 2).toFixed(0);
  //   newStr = str.substr(0, n);
  //   const m = str.substring(n).split('');
  //   let end = '';
  //   m.forEach(() => {
  //     end += '*';
  //   });
  //   return newStr + end;
  // }
  if (str.length <= 12) {
    // const str1 = str.substr(0, 3);
    // const str2 = '******';
    // const str3 = str.substring(9);
    // return str1 + str2 + str3;
    return str;
  }
  if (str.length > 12 && str.length <= 32) {
    const str1 = str.substr(0, 12);
    return `${str1}...`
  }
  const l = str.length;
  const str1 = str.substr(0, 5);
  const str2 = '...';
  const str3 = str.substring(l - 5);
  return str1 + str2 + str3;
}

// 处理交易对 - 返回obj: {contract: '',symbol1:'',symbol2:'', coinUrl: ''}
export function dealSymbolSplit(symbol, chain, bidContract, askContract, isEmbed) {
  if (appName === 'eosNewdex') {
    const eosSymbol = symbol.replace('_', '-')
    const arr = eosSymbol.split('-');
    if (arr.length === 2) {
      arr.unshift(bidContract)
    }
    const data = {
      contract: arr[0],
      symbol1: arr[1],
      symbol2: arr[2],
    }
    if (chain) {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${arr[0]}-${arr[1]}.png`;
    }
    if (arr[0] === 'eosio.token' && arr[1] === 'eos' && bidContract && arr[2] !== 'usdt') {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${bidContract}-${arr[2]}.png`;
    }
    if (arr[0] === 'issue.newdex' && askContract && askContract !== 'issue.newdex') {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${askContract}-${arr[1]}.png`;
    }
    if (isEmbed) {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${arr[0]}-${arr[1]}.png`;
    }
    if (bidContract === 'danchortoken') {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${arr[0]}-${arr[1]}.png`;
    }
    if (bidContract === 'tethertether') {
      data.coinUrl = `https://ndi.340wan.com/${chain}/${askContract}-${arr[1]}.png`;
    }
    return data;
  }
  // else if (appName === 'tronNewdex') {
  const arr = symbol.toLowerCase().split('_');
  const data = {
    contract: '',
    symbol1: arr[0],
    symbol2: arr[1],
  }
  if (chain) {
    data.coinUrl = `https://ndi.340wan.com/${chain}/${arr[0]}.png`;
  }
  return data;
  // }
}


// 处理不同格式的parseSymbol
export function parseSymbol(val, contract) {
  if (val.toString().indexOf('-') >= 0) {
    return val.split('-');
  }
  if (val.toString().indexOf('_') >= 0) {
    const sy = val.split('_');
    if (sy.length < 3) {
      sy.unshift(contract || '');
    }
    return sy;
  }
  return val;
}

// 处理兑换记录的TrxID问题
export function reverseHash(hash) {
  const groups = [
    [], [], [], [],
    [], [], [], []
  ];
  const bytes = hash.split('');
  for (let i = 0; i < bytes.length; i++) {
    const g = parseInt(i / 8);
    groups[g].push(bytes[i]);
  }
  const new_groups = []
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    const parts = [
      [], [], [], []
    ]

    for (let j = 0; j < group.length; j++) {
      const g = parseInt(j / 2);
      parts[g].push(group[j]);
    }

    const new_parts = parts.reverse();

    const s = new_parts.join().split(',').join('');

    new_groups.push(s);
  }
  let result = '';
  result = new_groups[3] + new_groups[2] + new_groups[1] + new_groups[0]
        + new_groups[7] + new_groups[6] + new_groups[5] + new_groups[4];
  return result;
}
// 快速排序
export function quickSort (arr) {
    if (arr.length <= 1) {
      return arr;
    }
    //取基准点
    const midIndex = Math.floor(arr.length / 2);
    //取基准点的值，splice(index,1) 则返回的是含有被删除的元素的数组。
    const valArr = arr.splice(midIndex, 1);
    const midIndexVal = valArr[0];
    const left = []; //存放比基准点小的数组
    const right = []; //存放比基准点大的数组
    //遍历数组，进行判断分配
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < midIndexVal) {
        left.push(arr[i]); //比基准点小的放在左边数组
      } else {
        right.push(arr[i]); //比基准点大的放在右边数组
      }
    }
    //递归执行以上操作，对左右两个数组进行操作，直到数组长度为 <= 1
    return quickSort(left).concat(midIndexVal, quickSort(right));
}

// 处理账号缩略 < 12 隐藏后半部分 | === 12 隐藏中间部分
export function dealAccountHide(str) {
  let newStr = '';
  if (str.length < 12) {
    const n = (str.length / 2).toFixed(0);
    newStr = str.substr(0, n);
    const m = str.substring(n).split('');
    let end = '';
    m.forEach(() => {
      end += '*';
    });
    return newStr + end;
  }
  if (str.length === 12) {
    const str1 = str.substr(0, 3);
    const str2 = '******';
    const str3 = str.substring(9);
    return str1 + str2 + str3;
  }
}

// 判断是否已经续费会员 - 到期日 <= 360天 ？ 未续费 - 0 ： 已经续费 - 1
export function regIsRenew(vipInfo) {
  const now = new Date().getTime()
  const toLocalDate = toLocalTime(vipInfo.expireTime);
  const expireTime = toLocalDate.replace(/-/g, '/');
  const lastDate = new Date(expireTime).getTime();
  const days = (lastDate - now) / (1000 * 60 * 60 * 24);
  if (days <= 360) {
    return 0;
  }
  return 1
}

// 计算交易对法币估值
export function symbolRate(num, rate, len) {
  const newNum = Decimal.mul(num, rate || 0).toString();
  let l = len;
  if (newNum >= 0.1) {
    l = 2;
  } else if (len >= 4 && store.state.app.language === 'zh-CN') {
    l = len - 2;
  } else if (len >= 4 && store.state.app.language !== 'zh-CN') {
    l = len - 1;
  }
  if (Number(toFixed(newNum, l)) === 0) {
    l = len;
  }
  const t = Decimal(`1e${l}`);
  let tNum = Decimal.mul(newNum, t);
  tNum = Decimal.round(tNum);
  tNum = Decimal.div(tNum, t);
  return toFixed(tNum, l);
}

// 返回iframe外层地址
export function handleParentUrl(str) {
  if (!str) return '';
  const params = {
    et: 'https://dice.endless.game/',
    etTest: 'http://dice.endless.game/', // ET test
    eosabc: 'https://eosabc.io/', // 正式
    eosjust: 'https://www.eosjust.com/',
    bloks: 'https://bloks.io/',
    'telos.bloks': 'https://telos.bloks.io/',
    'meetone.bloks': 'https://meetone.bloks.io/',
    'bos.bloks': 'https://bos.bloks.io/',
    newdexTest: 'http://192.168.8.253:8020/',
  }
  return params[str]
}

// 返回iframe外层地址
export function handleParentUrlEmbed() {
  const localHostList = [
    `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT18}`,
    'https://dapp.danchor.io',
    'https://dapp.danchor.io',
    'http://192.168.8.253:2032',
    'http://0.0.0.0:2032',
    'http://localhost:2032',
    'http://192.168.1.7:2032'
  ];
  const hostList = [
    `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT14}`,
    'https://newdex.340wan.com',
    'https://dapp.newdex.io',
    'http://192.168.8.253:9998',
    'http://0.0.0.0:9998',
    'http://localhost:9998',
    'http://192.168.1.7:9998'
  ];
  const host = location.origin;
  let index = hostList.findIndex(item => item === host);
  if (index < 0) {
    index = 0;
  }
  return localHostList[index]
}

// API 环境IP 返回链接
export function getReqUrl(hostname) {
  const env = process.env.NODE_ENV;
  const apiEnv = process.env.API_ENV;
  let linkUrl = '';
  switch (env) {
    case 'tron':
    case 'development':
      linkUrl = `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT1}`
      if (hostname) { // 只需要hostname
        linkUrl = process.env.VUE_APP_BASEURL
      }
      break;
    default:
      linkUrl = location.origin;
      break;
  }
  return linkUrl;
}

/* ETH地址的校验规则
  1、判断地址非空和是否0x开头
  2、把16进制字符串转成10进制数，看是否能否转换成功
  3、判断是否长度是40位（去掉0x）
*/
export function validateETH(str) {
  const reg = /^0x[a-f0-9]{40}$/i;
  return reg.test(str)
}

/* BTC地址的校验规则
  1、3开头的比特币地址，长度为34位。
  2、1开头的比特币地址，长度为26位到34位否转换成功
*/
export function validateBTC(str) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(1[a-z1-9]{25,33}|3[a-z1-9]{33})$/i;
  return reg.test(str)
}

/* TRON地址的校验规则
*/
export function validateTRON(str) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^T[a-z0-9]{33}$/i;;
  return reg.test(str)
}

// 解析url参数为数据字典
export function getUrlParams(url) {
  const params = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { // eslint-disable-line
    params[key] = value;
  });
  return params;
}

// 被内嵌使用
export function getTargetOrigin() {
  const embedUrl = localStorage.getItem('swapEmbedUrl');
  if (embedUrl) {
    const paUrl = JSON.parse(embedUrl);
    const targetOrigin = decodeURIComponent(paUrl.origin);
    return targetOrigin;
  }
  const paUrl = getUrlParams(window.location.href);
  localStorage.setItem('swapEmbedUrl', JSON.stringify(paUrl));
  const targetOrigin = decodeURIComponent(paUrl.origin);
  return targetOrigin;
}

// 跨链充提独立站
export function jumpCross(direction, coin) {
  let coinCode = coin;
  if (coin === 'EOS') {
    coinCode = 'USDT';
  }
  const language = store.state.app.language;
  const channel = localStorage.getItem('channel') || 'scatter';
  const host = location.host;
  const token = localStorage.getItem('token');
  switch (process.env.NODE_ENV) {
    case 'test':
    case 'tron': // eslint-disable-line
    case 'testh5': // eslint-disable-line
    case 'development': // eslint-disable-line
      location.href = `http://${ process.env.VUE_APP_BASEURL }:${ process.env.VUE_APP_PORT24 }?channel=${channel}&chain=eos&crosscoin=${coinCode}&crossway=${direction}&language=${language}&token=${token}&t=${new Date().getTime()}`;
      break;
    default:
      if (host.indexOf('newdex.340wan.com') > -1) {
        location.href = `https://ccdw.340wan.com?channel=${channel}&chain=eos&crosscoin=${coinCode}&crossway=${direction}&language=${language}&token=${token}&t=${new Date().getTime()}`;
      } else {
        location.href = `https://ccdw.newdex.io?channel=${channel}&chain=eos&crosscoin=${coinCode}&crossway=${direction}&language=${language}&token=${token}&t=${new Date().getTime()}`;
      }
      break;
  }
}

// 闪兑独立站
export function jumpSwap() {
  const language = store.state.app.language;
  const channel = localStorage.getItem('channel') || 'scatter';
  const host = location.host;
  switch (process.env.NODE_ENV) {
    case 'test':
    case 'tron': // eslint-disable-line
    case 'testh5': // eslint-disable-line
    case 'development': // eslint-disable-line
      location.href = `http://192.168.8.3:2002?channel=${channel}&chain=eos&language=${language}`;
      break;
    default:
      if (host.indexOf('newdex.340wan.com') > -1) {
        location.href = `https://defibox.340wan.com?channel=${channel}&chain=eos&language=${language}`;
      } else {
        location.href = `https://defibox.340wan.com/?channel=${channel}&chain=eos&language=${language}`;
      }
      break;
  }
}

export function setTabbar(type) {
  const msg = {
    action: 'setTabbar',
    data: {
      type,
    }
  }
  window.parent.postMessage(JSON.stringify(msg), targetOrigin());
}

// 跳转到pbtc
export function jumpPtokenSwap() {
  let language = store.state.app.language;
  if (language === 'ko') language = 'en';
  const channel = localStorage.getItem('channel') || 'scatter';
  const host = location.host;
  switch (process.env.NODE_ENV) {
    case 'test':
    case 'development': // eslint-disable-line
      location.href = `http://192.168.8.3:2002/ptoken/generate?embed=true&channel=${channel}&chain=eos&language=${language}`;
      break;
    default:
      if (host.indexOf('newdex.340wan.com') > -1) {
        location.href = `https://defibox.340wan.com/ptoken/generate?embed=true&channel=${channel}&chain=eos&language=${language}`;
      } else {
        location.href = `https://defibox.340wan.com/ptoken/generate?embed=true&channel=${channel}&chain=eos&language=${language}`;
      }
      break;
  }
}

// 跳转到usdt兑换
export function jumpUsdt() {
  let language = store.state.app.language;
  if (language === 'ko') language = 'en';
  const channel = localStorage.getItem('channel') || 'scatter';
  const host = location.host;
  switch (process.env.NODE_ENV) {
    case 'test':
    case 'development': // eslint-disable-line
      location.href = `http://192.168.8.3:2004?object=Newdex&channel=${channel}&chain=eos&language=${language}`;
      break;
    default:
      location.href = `https://convert.340wan.com/?object=Newdex&channel=${channel}&chain=eos&language=${language}`;
      break;
  }
}

/* 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
*/
export function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
  prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
  sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
  dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
  s = '',
  toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec);
    return '' + Math.ceil(n * k) / k;
  };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}