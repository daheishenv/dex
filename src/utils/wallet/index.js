/* eslint-disable */

import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex

// import DAppEos from './indexEos';
// import newDApp from './src'
import { DApp as EOSDApp } from 'wallet-js-sdk';

import DAppTron from '@/utils/walletTron/indexTron';

let DApp = EOSDApp;
if (appName === 'tronNewdex') {
  DApp = DAppTron;
}
export default DApp;
