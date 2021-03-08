/* eslint-disable */
import CFClient from './cfws';
import moment from 'moment';
import { dealHost } from '@/utils/public';

const host = dealHost();
let env = 'production';
switch (host) {
  case 'test':
    env = 'development';
    break;
  default:
    env = 'production';
    break;
}

const client = new CFClient({
  env,
  debug: false
});

const Io = {
  listener: null,
  lastSubscribe: null,
  subscribeCallback: null,
  // 交易中心 k线图部分
  cfwsKline: function (params, subscribe, callback) {
    var me = this;
    let resolution = params.resolution;
    delete params.resolution;
    client.ready(function () {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function (data) {
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: []
        };
        if (data.length > 0) {
          data.forEach(e => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: e[1],
              close: e[2],
              high: e[3],
              low: e[4],
              time: e[0] * 1000,
              volume: Number(e[5].toFixed(0))
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      params.symbol = params.symbol.toLowerCase();
      //请求k线数据
      client.request('kline.' + type, params, function (err, data) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      if (!subscribe) return;
      client.subscribe(`kline.${type}.${params.symbol.toLowerCase()}`, params, function (data) {
        const item = {
          close: data.close,
          date: me.dataFormat(data.id),
          high: data.high,
          low: data.low,
          open: data.open,
          time: data.id * 1000,
          volume: Number(data.amount.toFixed(0))
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: [item],
        };
        callback(res, 'one');
      })
    })
  },


  // ram kline
  lastSubscribeRam: null,
  subscribeCallbackRam: null,
  // Ram k线图部分
  cfwsKlineRam: function (params, callback) {
    var me = this;
    const resolution = params.resolution;
    delete params.resolution;
    client.ready(function() {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function(data) {
        const res = {
            resolution: resolution,
            symbol: params.symbol,
            from: params.from,
            klines: []
        };
        if (data.length > 0) {
          data.forEach(e => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: e[1],
              close: e[2],
              high: e[3],
              low: e[4],
              time: e[0] * 1000,
              volume: Number(e[5].toFixed(0))
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      //请求k线数据
      client.request('ramkline.' + type, params, function(err, data) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      client.subscribe(`ram.kline.${type}` , params, function(data) {
        const item = {
          close: data.close,
          date: me.dataFormat(data.id),
          high: data.high,
          low: data.low,
          open: data.open,
          time: data.id * 1000,
          volume: data.volume
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          kline: item,
        };
        callback(res, 'one');
      })
    })
  },

  // rex kline
  lastSubscribeRex: null,
  subscribeCallbackRex: null,
  // Rex k线图部分
  cfwsKlineRex: function (params, callback) {
    var me = this;
    const resolution = params.resolution;
    delete params.resolution;
    client.ready(function() {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function(data) {
        const res = {
            resolution: resolution,
            symbol: params.symbol,
            from: params.from,
            klines: []
        };
        if (data.length > 0) {
          data.forEach(e => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: e[1],
              close: e[2],
              high: e[3],
              low: e[4],
              time: e[0] * 1000,
              volume: Number(e[5].toFixed(0))
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      //请求k线数据
      client.request('rexkline.' + type, params, function(err, data) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      client.subscribe(`rex.kline.${type}` , params, function(data) {
        const item = {
          close: data.close,
          date: me.dataFormat(data.id),
          high: data.high,
          low: data.low,
          open: data.open,
          time: data.id * 1000,
          volume: data.volume
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          kline: item,
        };
        callback(res, 'one');
      })
    })
  },

  // cpu/net kline
  lastSubscribeCpu: null,
  subscribeCallbackCpu: null,
  // Rex k线图部分
  cfwsKlineCpu: function (params, callback) {
    var me = this;
    const resolution = params.resolution;
    delete params.resolution;
    client.ready(function() {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function(data) {
        const res = {
            resolution: resolution,
            symbol: params.symbol,
            from: params.from,
            klines: []
        };
        if (data.length > 0) {
          data.forEach(e => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: e[1],
              close: e[2],
              high: e[3],
              low: e[4],
              time: e[0] * 1000,
              volume: e[5] ? Number(e[5].toFixed(0)) : 0
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      //请求k线数据
      client.request('cpukline.' + type, params, function(err, data) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      client.subscribe(`cpu.kline.${type}` , params, function(data) {
        const item = {
          close: data.close,
          date: me.dataFormat(data.id),
          high: data.high,
          low: data.low,
          open: data.open,
          time: data.id * 1000,
          volume: data.volume
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          kline: item,
        };
        callback(res, 'one');
      })
    })
  },

  // 交易中心 头部信息
  cfwsHeard: function (params, callback) {
    const symbol = params.symbol;
    client.ready(function () {
      client.subscribe(`ticker.${symbol}`, function (data) {
        callback(data);
      });
    });
  },


  // 交易中心 深度数据
  cfwsDepth: function (params, callback) {
    const symbol = params.symbol;
    client.ready(function () {
      //订阅价格深度
      client.subscribe(`depth.${symbol}`, function (res) {
        if (!res) return;
        callback(JSON.stringify(res));
      });
    });
  },
  //   // 交易中心 订阅价格
  //   cfwsPrice: function(params, callback) {
  //     const symbol = params.symbol;
  //     client.ready(function() {
  //       // 订阅价格
  //       client.subscribe(`price.${symbol}`, function(data) {
  //         if (!data) return;
  //         callback(data);
  //       });
  //     });
  //   },

  // 获取交易对的实时数据
  //   cfwsPricesSymbol: function(params, callback) {
  //     // 订阅所有价格
  //     const symbol = params.symbol;
  //     client.subscribe(`prices.${symbol}`, function(data) {
  //         if (!data) return;
  //         callback(data);
  //     });
  //   },

  // 获取交易对的实时数据
  cfwsPricesSymbol: function (params, callback) {
    // 订阅所有价格
    const symbol = params.symbol;
    client.ready(function () {
      let data = params
      delete data.params
      delete data.symbol
      client.subscribe(`markets.${symbol}`, data, function (data) {
        if (!data) return;
        callback(data);
      });
    });
  },

  // 获取交易对的最新成交
  cfwsLatestTransaction: function (params, callback) {
    const symbol = params.symbol;
    client.ready(function () {
      client.subscribe(`latest.${symbol}`, callback);
    });
  },

  // 取消交易对所有推送
  cfwsUnsubscribe: function (params) {
    let unscribe = '*'
    client.ready(function () {
      if (params) {
        unscribe = params;
      }
      client.unsubscribe(unscribe);
    });
  },
  // 账号退出
  /**
   * params JSON 
   * {
   *  account: 'testtesttest',
   * chain: 'eos' || 'bos'
   * }
   */
  accountOut: function (params) {
    client.ready(function () {
      client.unsubscribe('account.message', params);
    });
  },

  //绑定账号
  /**
   * params JSON 
   * {
   *  account: 'testtesttest',
   * chain: 'eos' || 'bos'
   * }
   */
  accountBind: function (params) {
    client.ready(function () {
      client.subscribe('account.message', params);
    });
  },

  /*
   * 监听订单变动
   * @param way start 开始监听 stop 停掉监听
   */
  addListenerOrder: function (obj, callback) {
    client.ready(function () {
      if (typeof obj !== 'string' && obj.way === 'stop') {
        client.removeListener(obj.listenerId);
        return;
      }
      const listener = client.addListener('account.message', function (res) {
        res.listenerId = listener;
        callback(res)
      });
    })
  },

  /*
   * 监听网站暂停服务
   */
  addListenerRefresh: function () {
    client.ready(function () {
      client.addListener('refresh', () => {
        window.alert('The system is upgrading, please wait a moment');
        window.location.reload();
      });
    })
  },

  // 时间戳转换
  dataFormat(fdata) {
    return moment.unix(fdata).format('YYYY-MM-DD HH:mm:ss');
  },

  // 搜索功能
  searchWs(params, callback) {
    client.ready(function () {
      client.request('market.markets', {
        coin: params.coin,
        key: params.key
      }, function (err, data) {
        callback(err, data)
      });
    })
  },

  // 资源监听
  cfwsResource: function (params, callback) {
    const resource = params.resource;
    client.ready(function () {
      client.subscribe(`resource.${resource}`, function (data) {
        callback(data);
      });
    });
  },
  // 资源ticker
  cfwsTickerResource: function(params, callback) {
    const resource = params.resource;
    client.ready(function() {
      client.subscribe(`${resource}.ticker`, function(data) {
        callback(data);
      });
    });
  },
}
export default Io
