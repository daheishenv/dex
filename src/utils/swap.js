/* eslint-disable */
'use strict';

// import { bitModel } from '@/utils/eos/bitpeicurrex';

// swap 

/**
 * @export
 * @param {*} number 币种数量
 * @param {*} direction 用户输入方向：1支付输入， 2得到输入
 * @param {*} left 合约（小写）-币种（大写）eosio.token-EOS
 * @param {*} right
 * @param {*} feeRate 手续费
 * @param {*} tableRowsData
 */
export async function swapInit(number, direction, left, right, feeRate, tableRowsData, resultData) {
  // console.log(number, direction, left, right, feeRate, tableRowsData);
  // const resultPathData = await getPath(left, right, tableRowsData);
  const {pathSet, pairInfoMap, pairMap} = resultData;
  // console.log('所有路径', resultData.pathSet);
  let bestPath = '';
  let bestCount = direction === 1 ? 0 : Number.MAX_VALUE;
  let bestRadio = 0;
  let shortestPath = '';
  let shortestNode = Number.MAX_VALUE;
  for(const path of pathSet) {
    let count = number; //前端传进来
    let ratio = 1;
    let pathArr = path.split(',');
    if(pathArr.length < shortestNode) {
      shortestPath = path;
      shortestNode = pathArr.length;
    }
    if(direction === 2) {
      pathArr.reverse();
    }
    let isBest = true;
    for(let i=0; i<pathArr.length; i++) {
      if(i + 1 >= pathArr.length) break;
      const pairInfo = pairInfoMap.get(`${pathArr[i]}+${pathArr[i+1]}`);
      if(!pairInfo) {
        isBest = false;
        break;
      }
      // console.log(`${pathArr[i]}+${pathArr[i+1]}`);
      count = swapCount(pairInfo, pathArr[i], direction, count, feeRate);
      ratio = ratioCount(pairInfo, pathArr[i], ratio);
      if(count === 0 || pairInfo.status === 0) {
        isBest = false;
        break;
      }
    }
    if(!isBest) continue;
    // console.log(`path:${path}, count=${count}, ratio=${ratio}`);
    // console.log('-----------------------------------------');
    if(direction === 1) {
      if(count > bestCount || bestCount === 0) {
        bestCount = count;
        bestPath = path;
        bestRadio = ratio;
      }
    } else {
      if(count < bestCount) {
        bestCount = count;
        bestPath = path;
        bestRadio = ratio;
      }
    }
  }
  bestPath = bestPath ? bestPath : shortestPath;
  const pairIdPath = parsePairIdPath(bestPath, pairMap);
  
  // console.log(`bestPath:${bestPath}, bestCount=${bestCount}, bestRadio=${bestRadio}, pairIdPath:${pairIdPath}`);
  const back = {
    bestPath,
    bestCount,
    pairIdPath,
    bestRadio,
  }
  return back
}

export async function initPath(left, right, tableRowsData) {
  const resultData = await getPath(left, right, tableRowsData);
  // console.log('所有路径', resultData.pathSet);
  return resultData;
}


/**
 * 调用入口
 * @param left
 * @param right
 * @param tableRowsData
 * @returns {*}
 */
function getPath(left, right, tableRowsData) {
  const result = parseTableData(tableRowsData);
  const pathSet = new Set(); //1-2-3
  if(result.pairRelateMap.get(left).has(right) && result.pairInfoMap.get(`${left}+${right}`).status === 1) {
    pathSet.add(left + ',' + right);
  } else {
    searchPath(left, right, '', result.pairRelateMap, pathSet);
  }
  return {pathSet: pathSet, pairMap: result.pairMap, pairInfoMap: result.pairInfoMap};
}

/**
 * 解析tableRowsData
 * @param tableRowsData
 * @param pairMap
 * @param pairRelateMap
 * @returns {Array}
 */
function parseTableData(tableRowsData) {
  const pairMap = new Map();
  const pairInfoMap = new Map();
  const pairRelateMap = new Map();
  for(const pairInfo of tableRowsData.rows) {
    const pair = {
      pair_id: pairInfo.pair_id,
      base_contract: pairInfo.base_symbol.contract,
      base_coin: pairInfo.base_symbol.sym.split(',')[1],
      quote_contract: pairInfo.quote_symbol.contract,
      quote_coin: pairInfo.quote_symbol.sym.split(',')[1],
      base_count: pairInfo.base_quantity.split(' ')[0],
      quote_count: pairInfo.quote_quantity.split(' ')[0],
      status: pairInfo.status,
    };
    //状态：1正常, 0暂停交易
    // if(pairInfo.status == 0 || parseInt(pair.base_count) === 0 || parseInt(pair.quote_count) === 0) continue;
    pair.base_key = `${pair.base_contract}-${pair.base_coin}`;
    pair.quote_key = `${pair.quote_contract}-${pair.quote_coin}`;
    // pairList.push(pair);
    pairMap.set(`${pair.base_key}+${pair.quote_key}`, pair.pair_id);
    pairMap.set(`${pair.quote_key}+${pair.base_key}`, pair.pair_id);
    pairInfoMap.set(`${pair.quote_key}+${pair.base_key}`, pair);
    pairInfoMap.set(`${pair.base_key}+${pair.quote_key}`, pair);
    let baseRelateSet = pairRelateMap.get(pair.base_key);
    if(!baseRelateSet) {
      baseRelateSet = new Set();
    }
    baseRelateSet.add(pair.quote_key);
    pairRelateMap.set(pair.base_key, baseRelateSet);
    let quoteRelateSet = pairRelateMap.get(pair.quote_key);
    if(!quoteRelateSet) {
      quoteRelateSet = new Set();
    }
    quoteRelateSet.add(pair.base_key);
    pairRelateMap.set(pair.quote_key, quoteRelateSet);
  }
  return {pairMap, pairRelateMap, pairInfoMap};
}

/**
 * 寻找所有路径
 * @param left contract-COIN
 * @param right contract-COIN
 * @returns {Promise<void>}
 */

function searchPath(left, right, path, pairRelateMap, pathSet) {
  const relateSet = pairRelateMap.get(left);
  for(const relate of relateSet) {
    if(path.indexOf(relate) != -1) continue;
    if(relate === right) {
      const newPath = path ? path  + ',' + left + ',' + right : left + ',' + right;
      pathSet.add(newPath);
    } else {
      const newPath = path ? path  + ',' + left : left;
      searchPath(relate, right, newPath, pairRelateMap, pathSet);
    }
  }
}

/**
 * 把路径解析成pairId
 * @param path
 * @param pairMap
 * @returns {Set<any>}
 */
function parsePairIdPath(path, pairMap) {
  const pathNode = path.split(',');
  let pairIdPath = [];
  let add = true;
  for(let j=0; j<pathNode.length; j++) {
    if(j + 1 >= pathNode.length) break;
    const pairId = pairMap.get(`${pathNode[j]}+${pathNode[j+1]}`);
    if(pairId) {
      pairIdPath.push(pairId);
    } else {
      add = false;
    }
  }
  if(add) {
    return pairIdPath.join('-');
  }
  return '';
}

function swapCount(pairInfo, key, direction, count, feeRate) {
  let leftCount, rightCount, resultCount;
  if(pairInfo.base_key === key) {
    leftCount = parseFloat(pairInfo.base_count);
    rightCount = parseFloat(pairInfo.quote_count);
  } else {
    leftCount = parseFloat(pairInfo.quote_count);
    rightCount = parseFloat(pairInfo.base_count);
  }
  if(leftCount === 0 || rightCount === 0) {
    resultCount = 0;
  }
  const min = 0.0000000000000001;
  if(direction === 1) {
    const fee = count * feeRate;
    const leftPool = leftCount + (count - fee);
    const rightPool = leftCount * rightCount / leftPool;
    resultCount = rightCount - rightPool;
  } else if(direction === 2) {
    const leftPool = leftCount > count ? leftCount - count : min;
    const rightPool = leftCount * rightCount / leftPool;
    resultCount = (rightPool - rightCount) / (1- feeRate);
  }
  return resultCount;
}


function ratioCount(pairInfo, key, count) {
  if(count === 0) return 0;
  let leftCount, rightCount;
  if(pairInfo.base_key == key) {
    leftCount = parseFloat(pairInfo.base_count);
    rightCount = parseFloat(pairInfo.quote_count);
  } else {
    leftCount = parseFloat(pairInfo.quote_count);
    rightCount = parseFloat(pairInfo.base_count);
  }
  if(leftCount == 0 || rightCount == 0) return 0;
  return count * rightCount / leftCount;
}
