/* eslint-disable */
import Layout from '../views/layout/Layout';

const routerTron = [
  {
    path: '/',
    component: Layout,
    redirect: '/',
    meta: { title: 'exchang' },
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Index'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/apply',
        name: 'Apply',
        component: () => import(/* webpackChunkName: "Apply" */ '@/views/apply/Index'),
        meta: { title: 'Newdex', noTabbar: true, noPdb: true },
      },
    ],
  },
  {
    path: '/trad-view',
    name: 'tradView',
    component: () => import(/* webpackChunkName: "tradView" */ '@/components/tradeView/TradView'),
    meta: { title: 'Newdex' },
  },
  // 交易模块
  {
    path: '/market',
    component: Layout,
    redirect: '/market',
    meta: { title: 'exchang' },
    children: [
      {
        path: '/',
        name: 'market',
        component: () => import(/* webpackChunkName: "market" */ '@/views/market/Index'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/selfAreaSetting',
        name: 'selfAreaSetting',
        component: () => import(/* webpackChunkName: "selfAreaSetting" */ '@/views/market/childView/SelfAreaSetting'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/trade/:symbol',
        name: 'trade',
        component: () => import(/* webpackChunkName: "trade" */ '@/views/market/childView/Trade'),
        meta: { title: 'Newdex', keepAlive: false },
      },
      {
        path: '/coinHistoryList/:symbol',
        name: 'coinHistoryList',
        component: () => import(/* webpackChunkName: "coinHistoryList" */ '@/views/market/childView/CoinHistoryList'),
        meta: { title: 'Newdex', noTabbar: true, keepAlive: true },
      },
      {
        path: '/kline/:symbol',
        name: 'linek',
        component: () => import(/* webpackChunkName: "linek" */ '@/views/market/childView/LineK'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/search',
        name: 'search',
        component: () => import(/* webpackChunkName: "search" */ '@/views/market/childView/Search'),
        meta: { title: 'Newdex', keepAlive: true, noTabbar: true },
      },
      {
        path: '/set-market-tip/:symbol',
        name: 'setMarketTip',
        component: () => import(/* webpackChunkName: "setMarketTip" */ '@/views/market/childView/SetMarketTip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/updata-market-tip/:symbol',
        name: 'updataMarketTip',
        component: () => import(/* webpackChunkName: "updataMarketTip" */ '@/views/market/childView/SetMarketTip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
    ],
  },
  // 订单
  {
    path: '/order',
    component: Layout,
    redirect: '/order',
    meta: { title: 'exchang' },
    children: [
      {
        path: '/',
        name: 'order',
        component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
        meta: { title: 'Newdex', keepAlive: true },
      },
      {
        path: '/orderDetail/:id',
        name: 'orderDetail',
        component: () => import(/* webpackChunkName: "orderDetail" */ '@/views/order/components/OrderDetail'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/symbolOrderList/:symbol',
        name: 'symbolOrderList',
        component: () => import(/* webpackChunkName: "symbolOrderList" */ '@/views/order/components/SymbolOrderList'),
        meta: { title: 'Newdex', noTabbar: true, keepAlive: true, noPdb: true },
      },
    ],
  },
  // 资产
  {
    path: '/property',
    component: Layout,
    redirect: '/property',
    meta: { title: 'exchang' },
    children: [
      {
        path: '/',
        name: 'property',
        component: () => import(/* webpackChunkName: "property" */ '@/views/property/Index'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/exchange',
        name: 'exchange',
        component: () => import(/* webpackChunkName: "exchange" */ '@/views/property/childView/Exchange'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/exchangeUsdt',
        name: 'exchangeUsdt',
        component: () => import(/* webpackChunkName: "exchangeUsdt" */ '@/views/property/childView/ExchangeUsdtTron.vue'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/exchangeRecord',
        name: 'exchangeRecord',
        component: () => import(/* webpackChunkName: "exchangeRecord" */ '@/views/property/childView/ExchangeRecord'),
        meta: { title: 'Newdex' },
      },
      {
        path: '/exchangeDetail',
        name: 'exchangeDetail',
        component: () => import(/* webpackChunkName: "exchangeDetail" */ '@/views/property/childView/ExchangeDetail'),
        meta: { title: 'Newdex' },
      }
    ],
  },
  // 更多
  {
    path: '/more',
    component: Layout,
    redirect: '/more',
    meta: { title: 'exchang' },
    children: [
      {
        path: '/', // 我的
        name: 'more',
        component: () => import(/* webpackChunkName: "more" */ '@/views/more/Index'),
        meta: { title: 'Newdex' },
      },
      // {
      //   path: '/chooseNode', // 节点选择
      //   name: 'chooseNode',
      //   component: () => import(/* webpackChunkName: "chooseNode" */ '@/views/more/ChooseNode'),
      //   meta: { title: 'Newdex', noTabbar: true },
      // },
      {
        path: '/vipDetail', // 会员详情
        name: 'vipDetail',
        component: () => import(/* webpackChunkName: "vipDetail" */ '@/views/more/childView/Vip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/transactionTip', // 成交提醒
        name: 'transactionTip',
        component: () => import(/* webpackChunkName: "transactionTip" */ '@/views/more/childView/TransactionTip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/market-tip', // 行情提醒
        name: 'marketTip',
        component: () => import(/* webpackChunkName: "marketTip" */ '@/views/more/childView/MarketTip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/all-market-tip', // 全部提醒
        name: 'allMarketTip',
        component: () => import(/* webpackChunkName: "allMarketTip" */ '@/views/more/childView/MarketTip'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/luck-draw', // 会员抽奖
        name: 'luckDraw',
        component: () => import(/* webpackChunkName: "luckDraw" */ '@/views/more/childView/LuckDraw'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/email', // 绑定邮箱
        name: 'email',
        component: () => import(/* webpackChunkName: "email" */ '@/views/more/childView/Email'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/updata-email', // 绑定邮箱
        name: 'updataEmail',
        component: () => import(/* webpackChunkName: "updataEmail" */ '@/views/more/childView/Email'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/vip-notes/:type', // 绑定邮箱
        name: 'vipNotes',
        component: () => import(/* webpackChunkName: "vipNotes" */ '@/views/more/childView/VipNotes'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/anonymous', // 匿名交易
        name: 'anonymous',
        component: () => import(/* webpackChunkName: "anonymous" */ '@/views/more/childView/Anonymous'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/profit-statistics', // 盈亏统计
        name: 'profitStatistics',
        component: () => import(/* webpackChunkName: "profitStatistics" */ '@/views/more/childView/ProfitStatistics'),
        meta: { title: 'Newdex', noTabbar: true },
      },
      {
        path: '/update-log', // 更新日志
        name: 'updateLog',
        component: () => import(/* webpackChunkName: "updateLog" */ '@/views/more/childView/UpdateLog'),
        meta: { title: 'Newdex', noTabbar: true },
      },
    ],
  },
  // 活动页面路由
  {
    path: '/events',
    component: Layout,
    redirect: '/activity',
    meta: { title: 'activity' },
    children: [
      {
        path: 'influencers',
        name: 'influencers',
        component: () => import(/* webpackChunkName: "influencers" */ '@/views/activity/Ambassador'),
        meta: { title: 'Newdex', noTabbar: true, noPdb: true },
      },
      {
        path: 'nb-activity',
        name: 'nb-activity',
        component: () => import(/* webpackChunkName: "influencers" */ '@/views/activity/nbActivity/Index'),
        meta: { title: 'Newdex', noTabbar: true, noPdb: true },
      },
      {
        path: ':name',
        name: 'events',
        component: () => import(/* webpackChunkName: "events" */ '@/views/activity/Index'),
        meta: { title: 'Newdex', noTabbar: true, noPdb: true },
      },
    ],
  },
  {
    path: '/download',
    component: Layout,
    redirect: '/',
    meta: { title: 'down' },
    children: [
      {
        path: '/',
        name: 'down',
        component: () => import(/* webpackChunkName: "down" */ '@/views/down/Index'),
        meta: { title: 'down', noTabbar: true },
      }
    ],
  },
  {
    path: '/appshow',
    name: 'appshow',
    component: () => import(/* webpackChunkName: "appshow" */ '@/views/error/appshow'),
    meta: { title: 'Newdex' },
  },
]

export default routerTron;
