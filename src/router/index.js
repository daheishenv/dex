/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import appName from '@/utils/environments'; // Dapp版本 - eosNewdex | tronNewdex
import Layout from '../views/layout/Layout';
import routerEos from './routerEos';
import routerTron from './routerTron';

Vue.use(Router);

/**
 * @for meta
 * @param title 标题
 * @param icon 图标
 * @param name 用来匹配路由名称
 */


export const constantRouterMap = [
  // cmc 币种状态
  {
    path: '/page/status',
    component: Layout,
    redirect: '/page/status',
    meta: { title: 'cmcStatus' },
    children: [
      {
        path: '',
        name: 'cmcStatus',
        component: () => import(/* webpackChunkName: "cmcStatus" */ '@/views/cmc/Index'),
        meta: { title: 'cmcStatus' },
      }
    ],
  },
  // clearLocalStorage
  {
    path: '/clear-storage',
    component: () => import(/* webpackChunkName: "error" */ '@/ClearStorage.vue'),
    meta: { title: 'Newdex' },
  },
  // 错误码处理
  {
    path: '/error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/error/Error.vue'),
    meta: { title: 'Newdex - Error Code' },
  },
  // error
  {
    path: '*',
    component: () => import(/* webpackChunkName: "error" */ '@/views/error/404.vue'),
    meta: { title: '404 - Newdex' },
  },
];

if (appName === 'tronNewdex') {
  constantRouterMap.unshift(...routerTron)
} else {
  constantRouterMap.unshift(...routerEos)
}

const myRouter = new Router({
  base: '/',
  mode: 'history',
  routes: constantRouterMap,
});

myRouter.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

myRouter.afterEach(() => {});


export default myRouter;
