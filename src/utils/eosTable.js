
import Eos from 'eosjs-without-sort';
import axios from 'axios';
import store from '../store';

export function getTableRows(obj) {
  const params = obj;
  if (obj.lower_bound && obj.boundFormat) {
    const encodeName = Eos.modules.format.encodeName(obj.lower_bound, false);
    params.lower_bound = encodeName;
  }
  if (obj.upper_bound && obj.boundFormat) {
    const encodeName = Eos.modules.format.encodeName(obj.upper_bound, false);
    params.upper_bound = encodeName;
  }
  if (obj.scope && obj.scopeFormat) {
    const encodeScope = Eos.modules.format.encodeName(obj.scope, false);
    params.scope = encodeScope;
  }
  return new Promise((resolve, reject) => {
    try {
      const net = store.state.sys.nodeList.eosNode.httpEndpoint;
      axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params),
      {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        }
      }).then((result) => {
        const res = result.data;
        if (res && res.rows && res.rows.length) {
          resolve(res.rows);
          return;
        }
        resolve([]);
      }).catch((error) => {
        resolve([], error);
      });
    } catch (error) {
      reject([], error);
    }
  })
}

export function getCurrencyStats(obj) {
  const params = obj;
  return new Promise((resolve) => {
    try {
      const net = store.state.sys.nodeList.eosNode.httpEndpoint;
      axios.post(`${net}/v1/chain/get_currency_stats`, JSON.stringify(params)).then((result) => {
        const res = result.data;
        if (result.status === 200) {
          resolve(res);
          return;
        }
        resolve({});
      }, error => {
        resolve({}, error);
      });
    } catch (error) {
      resolve({}, error);
    }
  })
}