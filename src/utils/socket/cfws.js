/* eslint-disable */
import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
import { getReqUrl } from '@/utils/public';
function CFClient(opts) {
  
  if (!opts) {
    opts = {}
  }
  this.env = opts.env ? opts.env : 'local';
  this.debug = !!opts.debug
  var uri = 'wss://newdex.340wan.com/ws';
  const host = window.location.host;
  if (host.indexOf('newdex.io') >= 0) {
    uri = 'wss://ws.newdex.io';
  }
  // Tron项目 - 根据host配置ws
  if (appName === 'tronNewdex') {
    uri = 'wss://tron.340wan.com/tws';
    if (host === 'dapp.tron.newdex.io') {
      uri = 'wss://wstron.newdex.io';
    }
  }
  if (this.env != 'production') {
    uri = `ws://${getReqUrl('ip')}:${process.env.VUE_APP_PORT6}`;
    // uri = 'wss://newdex.340wan.com/ws';
    if (appName === 'tronNewdex') {
      uri = `ws://${getReqUrl('ip')}:${process.env.VUE_APP_PORT7}`;
      // 测试使用
      // uri = 'wss://tron.340wan.com/tws';
    }
  }
  
  this.uri = uri;
  this.requestMaps = {}
  this.listeners = {}
  this.timer = null;
  this.listenerId = 0;
  this.readyed = false;
  this.readyCallbacks = [];
  this.autoReconnect = true;
  this.reconnectTime = 1000;
  this.subscribes = [];
  this.userListeners = [];

  this.connect();
}

CFClient.prototype.connect = function() {
  var me = this;
  this.ws = new WebSocket(this.uri);
  this.ws.onopen = function(evt) {
    me.ws.send('{"type":"handshake", "version":"1.5"}');
  };

  this.ws.onmessage = function(evt) {
    me.onmessage(evt);
  };

  this.ws.onclose = function(evt) {
    me.onclose(evt);
  };
}

CFClient.prototype.onmessage = function(evt) {
  var msg = evt.data ? JSON.parse(evt.data): {};
  //console.log(evt)
  if (msg.type == 'handshake') {
    var interval = msg.data.heartbeat.interval
    this.heartbeat(interval)
    this.readyed = true;
    this.reconnectTime = 1000;
    var subscribes = this.subscribes.concat();
    this.subscribes = [];
    this.resubscribe(subscribes);
    var userListeners = this.userListeners.concat();
    this.userListeners = [];
    for (var ul of userListeners) {
      this.addListener(ul.channel, ul.callback);
    }
    for (var i in this.readyCallbacks) {
      this.readyCallbacks[i].call(this, this)
    }
    this.readyCallbacks = [];
  } else if (msg.type == 'response') {
    if (this.requestMaps[msg.id]) {
      var callback = this.requestMaps[msg.id]
      delete this.requestMaps[msg.id]
      callback(msg.error, msg.data)
    }
  } else if (msg.type == 'push') {
    if (this.listeners[msg.channel]) {
      var listeners = this.listeners[msg.channel]
      for (var i in listeners) {
        listeners[i].callback(msg.data)
      }
    }
  }
}

CFClient.prototype.resubscribe = function(subscribes) {
  if (subscribes.length > 20) {
    subscribes = [];
  }
  if (subscribes.length > 0) {
    var sub = subscribes.shift();
    this.subscribe(sub.channel, sub.params, sub.callback);
    var me = this;
    setTimeout(function() {
      me.resubscribe(subscribes);
    }, 100); 
  }
}

CFClient.prototype.onclose = function(evt) {
  console.log("Connection closed.");
  if (this.timer != null) {
    window.clearInterval(this.timer);
    this.timer = null
  }
  this.listeners = {};
  var me = this;
  console.log('will connect after ' + me.reconnectTime + ' seconds');
  setTimeout(function() {
    if (me.autoReconnect) {
      if (me.reconnectTime < 5000) {
        me.reconnectTime += 1000;
      }
      me.connect();
    }
  }, me.reconnectTime)
}

CFClient.prototype.close = function() {
  this.autoReconnect = false
  this.ws.close();
}

CFClient.prototype.heartbeat = function(interval) {
  var me = this;
  this.timer = window.setInterval(function() {
    me.ws.send('{"type":"heartbeat"}');
  }, interval * 1000)
}

CFClient.prototype.request = function(route, params, callback) {
  if (typeof params == 'function') {
    callback = params
    params = null
  }
  var requestId = Math.floor(Math.random() * 89999999) + 10000000
  //console.log(requestId)
  if (typeof callback == 'function') {
    this.requestMaps[requestId] = callback
  }
  var request = {
      type: 'request',
      id: requestId,
      route: route,
      params: params
  }
  this.ws.send(JSON.stringify(request));
}

CFClient.prototype.subscribe = function(channel, params, callback) {
  if (typeof params == 'function') {
    callback = params
    params = null
  }
  if (typeof callback == 'function') {
    this.addListener(channel, callback, true)
  }
  var request = {
      type: 'subscribe',
      channel: channel
  }
  if (params) {
    request.params = params
  }
  this.subscribes.push({channel, params, callback});
  this.ws.send(JSON.stringify(request));
}

CFClient.prototype.unsubscribe = function(channel, params) {
  var request = {
      type: 'unsubscribe',
      channel: channel
  }
  if (params) {
    request.params = params
  }
  this.ws.send(JSON.stringify(request));
  this.removeListeners(channel)
  if (channel == '*') {
    this.subscribes = [];
  } else {
    for (var i in this.subscribes) {
      var sub = this.subscribes[i];
      if (sub.channel == channel) {
        //check params ?
        this.subscribes.splice(i, 1);
        break;
      }
    }
  }
}

CFClient.prototype.addListener = function(channel, callback, autoListen=false) {
  if (!channel || typeof callback != 'function') {
    return
  }
  this.listenerId++;
  if (typeof this.listeners[channel] == 'undefined') {
    this.listeners[channel] = [];
  }
  if (!autoListen) {
    this.userListeners.push({
      channel,
      callback
    })
  }
  var listeners = this.listeners[channel]
  listeners.push({
    id: this.listenerId,
    callback: callback
  })
  return this.listenerId
}

CFClient.prototype.removeListener = function(listenerId) {
  for (var event in this.listeners) {
    for (var idx in this.listeners[event]) {
      if (this.listeners[event][idx].id == listenerId) {
        this.listeners[event].splice(idx, 1)
        return
      }
    }
  }
}

CFClient.prototype.removeListeners = function(event) {
  if (event == null || typeof event == 'undefined' || event == '*') {
    this.listeners = {}
  } else if (typeof this.listeners[event] != 'undefined') {
    delete this.listeners[event]
  }
}

CFClient.prototype.ready = function(callback) {
  if (typeof callback == 'function') {
    if (this.readyed) {
      callback.call(this, this)
    } else {
      this.readyCallbacks.push(callback)
    }
  }
}

// if (typeof module != 'undefined' && module.exports) {
//   module.exports = CFClient
// }
export default CFClient

