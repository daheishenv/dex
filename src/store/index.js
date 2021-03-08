import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import sys from './modules/sys';
import whiteConfig from './modules/whiteConfig';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    sys,
    whiteConfig,
  },
  getters,
});

export default store;
