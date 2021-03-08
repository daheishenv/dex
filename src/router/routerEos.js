/* eslint-disable */
import Layout from "../views/layout/Layout";

const routerEos = [
  {
    path: "/",
    component: Layout,
    redirect: "/",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "index",
        component: () =>
          import(/* webpackChunkName: "market" */ "@/views/index/Index"),
        meta: { title: "Newdex" },
      },
      {
        path: "/candy-airdrop",
        name: "candyBox",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/index/childView/CandyBox"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/events/fool-day",
        name: "foolDay",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/index/childView/FoolDay"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/apply",
        name: "Apply",
        component: () =>
          import(/* webpackChunkName: "market" */ "@/views/apply/Index"),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      {
        path: "/airdrop-detail",
        name: "airdropDetail",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/index/childView/AirdropDetail"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
  {
    path: "/trad-view",
    name: "tradView",
    component: () => import("@/components/tradeView/TradView"),
    meta: { title: "Newdex" },
  },
  // 内嵌交易模块
  {
    path: "/embed-market",
    component: Layout,
    redirect: "/market",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "marketEmbed",
        component: resolve => require(['@/views/market/Index'],resolve),
        // component: () =>
        //   import(/* webpackChunkName: "market" */ "@/views/market/Index"),
        meta: { title: "Newdex", noTabbar: true, isEmbed: true },
      },
      {
        path: "selfAreaSetting",
        name: "selfAreaSettingEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/market/childView/SelfAreaSetting"
          ),
        meta: { title: "Newdex", noTabbar: true, isEmbed: true },
      },
      {
        path: "/embed-trade/:symbol",
        name: "tradeEmbed",
        component: () => import("@/views/market/childView/Trade"),
        meta: {
          title: "Newdex",
          noTabbar: true,
          keepAlive: false,
          isEmbed: true,
        },
      },
      {
        path: "/search",
        name: "searchEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/market/childView/Search"
          ),
        meta: {
          title: "Newdex",
          keepAlive: true,
          noTabbar: true,
          isEmbed: true,
        },
      },
      {
        path: "/embed-kline/:symbol",
        name: "linekEmbed",
        component: () => import("@/views/market/childView/LineK"),
        meta: { title: "Newdex", noTabbar: true, isEmbed: true },
      },
    ],
  },
  // 资源
  {
    path: "/embed-resources",
    component: Layout,
    redirect: "/property",
    meta: { title: "exchang" },
    children: [
      {
        // ram K线
        path: "kline/ram-eos",
        name: "resourceKlineRamEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/childViews/RamKLine"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },
      {
        // ram 交易
        path: "trade/ram-eos",
        name: "resourceTradeRamEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/childViews/ResourceRamTrade"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },
      {
        // rex K线
        path: "kline/rex-eos",
        name: "resourceKlineRexEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/Index"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },
      {
        // rex 交易
        path: "trade/rex-eos",
        name: "resourceTradeRexEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/childViews/ResourceRexTrade"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },

      {
        // cpu&net K线
        path: "kline/cpu-net",
        name: "resourceKlineCpuEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/childViews/CpuKLine"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },
      {
        // cpu&net 抵押赎回
        path: "trade/cpu-net",
        name: "resourceTradeCpuEmbed",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/resources/childViews/ResourceCpuTrade"
          ),
        meta: {
          title: "Newdex",
          noTabbar: true,
          isEmbed: true,
          isResources: true,
        },
      },
    ],
  },
  // 交易模块
  {
    path: "/market",
    component: Layout,
    redirect: "/market",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "market",
        component: resolve => require(['@/views/market/Index'],resolve),
        // component: () =>
        //   import(/* webpackChunkName: "market" */ "@/views/market/Index"),
        meta: { title: "Newdex" },
      },
      {
        path: "/selfAreaSetting",
        name: "selfAreaSetting",
        component: resolve => require(['@/views/market/childView/SelfAreaSetting'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/SelfAreaSetting"
        //   ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/trade/:symbol",
        name: "trade",
        component: resolve => require(['@/views/market/childView/Trade'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/Trade"
        //   ),
        meta: { title: "Newdex", keepAlive: false },
      },
      {
        path: "/coinHistoryList/:symbol",
        name: "coinHistoryList",
        component: resolve => require(['@/views/market/childView/CoinHistoryList'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/CoinHistoryList"
        //   ),
        meta: { title: "Newdex", noTabbar: true, keepAlive: true },
      },
      {
        path: "/kline/:symbol",
        name: "linek",
        component: resolve => require(['@/views/market/childView/LineK'],resolve),
        // component: () => import("@/views/market/childView/LineK"),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/search",
        name: "search",
        component: resolve => require(['@/views/market/childView/Search'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/Search"
        //   ),
        meta: { title: "Newdex", keepAlive: true, noTabbar: true },
      },
      {
        path: "/set-market-tip/:symbol",
        name: "setMarketTip",
        component: resolve => require(['@/views/market/childView/SetMarketTip'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/SetMarketTip"
        //   ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/updata-market-tip/:symbol",
        name: "updataMarketTip",
        component: resolve => require(['@/views/market/childView/SetMarketTip'],resolve),
        // component: () =>
        //   import(
        //     /* webpackChunkName: "market" */ "@/views/market/childView/SetMarketTip"
        //   ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
  // 订单
  {
    path: "/order",
    component: Layout,
    redirect: "/order",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "order",
        component: () =>
          import(/* webpackChunkName: "market" */ "@/views/order/Index"),
        meta: { title: "Newdex", keepAlive: true },
      },
      {
        path: "/orderDetail/:id",
        name: "orderDetail",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/order/components/OrderDetail"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/symbolOrderList/:symbol",
        name: "symbolOrderList",
        component: () =>
          import(
            /* webpackChunkName: "market" */ "@/views/order/components/SymbolOrderList"
          ),
        meta: { title: "Newdex", noTabbar: true, keepAlive: true, noPdb: true },
      },
    ],
  },
  // 资产
  {
    path: "/property",
    component: Layout,
    redirect: "/property",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "property",
        component: () =>
          import(/* webpackChunkName: "property" */ "@/views/property/Index"),
        meta: { title: "Newdex" },
      },
      {
        path: "/exchange/:symbol",
        name: "exchange",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "@/views/property/childView/Exchange"
          ),
        meta: { title: "Newdex" },
      },
      {
        path: "/exchangeRecord",
        name: "exchangeRecord",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "@/views/property/childView/ExchangeRecord"
          ),
        meta: { title: "Newdex" },
      },
      {
        path: "/exchangeUsdtRecord",
        name: "exchangeUsdtRecord",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "@/views/property/childView/ExchangeUsdtRecord"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/exchangeDetail",
        name: "exchangeDetail",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "@/views/property/childView/ExchangeDetail"
          ),
        meta: { title: "Newdex" },
      },
      // 跨链兑换 tron eth
      {
        path: "/exchangeUsdt",
        name: "exchangeUsdt",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "@/views/property/childView/ExchangeUsdt"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/exchangeUsdt-address",
        name: "exchangeUsdtAddress",
        component: () =>
          import(
            /* webpackChunkName: "property" */ "../views/property/childView/ExchangeUsdtAddress.vue"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
  // 更多
  {
    path: "/more",
    component: Layout,
    redirect: "/more",
    meta: { title: "exchang" },
    children: [
      {
        path: "/", // 我的
        name: "more",
        component: () =>
          import(/* webpackChunkName: "more" */ "@/views/more/Index"),
        meta: { title: "Newdex" },
      },
      // {
      //   path: "/chooseNode", // 节点选择
      //   name: "chooseNode",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "more" */ "@/views/more/ChooseNode"
      //     ),
      //   meta: { title: "Newdex", noTabbar: true },
      // },
      {
        path: "/vipDetail", // 会员详情
        name: "vipDetail",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/Vip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/transactionTip", // 成交提醒
        name: "transactionTip",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/TransactionTip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/market-tip", // 行情提醒
        name: "marketTip",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/MarketTip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/all-market-tip", // 全部提醒
        name: "allMarketTip",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/MarketTip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/luck-draw", // 会员抽奖
        name: "luckDraw",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/LuckDraw"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/email", // 绑定邮箱
        name: "email",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/Email"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/updata-email", // 绑定邮箱
        name: "updataEmail",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/Email"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/vip-notes/:type", // 绑定邮箱
        name: "vipNotes",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/VipNotes"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/anonymous", // 匿名交易
        name: "anonymous",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/Anonymous"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/profit-statistics", // 盈亏统计
        name: "profitStatistics",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/ProfitStatistics"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/update-log", // 更新日志
        name: "updateLog",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/UpdateLog"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/upgrade-vip", // 升级会员
        name: "upgradeVip",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/UpgradeVip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/renewal-vip", // 续费会员
        name: "renewalVip",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/RenewalVip"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/free-cpu", // 免费CPU
        name: "freeCpu",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/FreeCpu"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/stake", // 抵押赎回
        name: "stakeNdx",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/StakeNdx"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/stake-status", // 抵押|赎回成功
        name: "stakeStatus",
        component: () =>
          import(
            /* webpackChunkName: "more" */ "@/views/more/childView/StakeStatus"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
  // 矿池
  {
    path: "/newpos",
    component: Layout,
    redirect: "/newpos",
    meta: { title: "exchang" },
    children: [
      {
        path: "/",
        name: "newpos",
        component: () =>
          import(/* webpackChunkName: "newpos" */ "@/views/newpos/Index"),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/annual-profit",
        name: "annualProfit",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/Profit"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/bonus",
        name: "bonus",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/Bonus"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/increase-of-votes",
        name: "increaseOfVotes",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/IncreaseOfVotes"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/reduce-votes",
        name: "reduceVotes",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/ReduceVotes"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/rex-detail",
        name: "rexDetail",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/RexDetail"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
      {
        path: "/action-success",
        name: "actionSuccess",
        component: () =>
          import(
            /* webpackChunkName: "newpos" */ "@/views/newpos/childView/ActionSuccess"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
  // 资源
  {
    path: "/resources",
    component: Layout,
    redirect: "/property",
    meta: { title: "exchang" },
    children: [
      {
        // ram K线
        path: "kline/ram-eos",
        name: "resourceKlineRam",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/childViews/RamKLine"
          ),
        meta: { title: "Newdex", noTabbar: true, isResources: true },
      },
      {
        // ram 交易
        path: "trade/ram-eos",
        name: "resourceTradeRam",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/childViews/ResourceRamTrade"
          ),
        meta: { title: "Newdex", isResources: true },
      },
      {
        // rex K线
        path: "kline/rex-eos",
        name: "resourceKlineRex",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/Index"
          ),
        meta: { title: "Newdex", noTabbar: true, isResources: true },
      },
      {
        // rex 交易
        path: "trade/rex-eos",
        name: "resourceTradeRex",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/childViews/ResourceRexTrade"
          ),
        meta: { title: "Newdex", isResources: true },
      },

      {
        // cpu&net K线
        path: "kline/cpu-net",
        name: "resourceKlineCpu",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/childViews/CpuKLine"
          ),
        meta: { title: "Newdex", noTabbar: true, isResources: true },
      },
      {
        // cpu&net 抵押赎回
        path: "trade/cpu-net",
        name: "resourceTradeCpu",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/resources/childViews/ResourceCpuTrade"
          ),
        meta: { title: "Newdex", isResources: true },
      },
    ],
  },
  // 活动页面路由
  {
    path: "/events",
    component: Layout,
    redirect: "/events",
    meta: { title: "activity" },
    children: [
      // 聚合交易活动
      {
        path: "swap-trade",
        name: "swapTrade",
        component: () =>
          import(
            /* webpackChunkName: "events" */ "@/views/activity/swapTrade/Index"
          ),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      // 聚合交易活动
      {
        path: "shareImg",
        name: "shareImg",
        component: () =>
          import(
            /* webpackChunkName: "events" */ "@/views/activity/swapTrade/shareImg"
          ),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      // 圣诞活动
      {
        path: 'christmas',
        name: 'christmas',
        component: resolve => require(['@/views/activity/christmas/Index.vue'], resolve),
        meta: { title: 'Newdex', noTabbar: true, noPdb: true },
      },
      // 交易对报名
      {
        path: "api-trade/apply",
        name: "applySymbol",
        component: () =>
          import(
            /* webpackChunkName: "events" */ "@/views/activity/quantizedTrade/popup/ApplySymbol"
          ),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      // newdex 大使申请表
      {
        path: "apply",
        name: "apply",
        component: () =>
          import(/* webpackChunkName: "events" */ "@/views/activity/Apply"),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      // newdex 大使
      {
        path: "influencers",
        name: "influencers",
        component: () =>
          import(
            /* webpackChunkName: "events" */ "@/views/activity/Ambassador"
          ),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      {
        path: "influencer-detail",
        name: "influencerDetail",
        component: (resolve) =>
          require(["@/views/activity/InfluencerDetail"], resolve),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      //defibox 征文评选
      // {
      //   path: "articleContest",
      //   name: "articleContest",
      //   component: (resolve) =>
      //     require(["@/views/activity/dbArticle/articleVote.vue"], resolve),
      //     meta: { title: "Newdex", noTabbar: true, noPdb: true },
      // },
      // newdex 大使
      // {
      //   path: "influencer2020",
      //   name: "ambassador",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "influencers" */ "@/views/activity/ambassador/Index"
      //     ),
      //   meta: { title: "Newdex", noTabbar: true, noPdb: true },
      // },
      // newdex 大使
      {
        path: "vote",
        name: "vote",
        component: () =>
          import(/* webpackChunkName: "events" */ "@/views/activity/vote/Index"),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
      {
        path: ":name",
        name: "events",
        component: () =>
          import(/* webpackChunkName: "events" */ "@/views/activity/Index"),
        meta: { title: "Newdex", noTabbar: true, noPdb: true },
      },
    ],
  },
  {
    path: "/download",
    component: Layout,
    redirect: "/",
    meta: { title: "down" },
    children: [
      {
        path: "/",
        name: "down",
        component: () =>
          import(/* webpackChunkName: "resources" */ "@/views/down/Index"),
        meta: { title: "down", noTabbar: true },
      },
    ],
  },
  {
    path: "/appshow",
    name: "appshow",
    component: () =>
      import(/* webpackChunkName: "resources" */ "@/views/error/appshow"),
    meta: { title: "Newdex" },
  },
  // {
  //   path: "/otc", // otc
  //   name: "otc",
  //   component: () => import(/* webpackChunkName: "otc" */ "@/views/otc/Index"),
  //   meta: { title: "Newdex", noPdb: true },
  // },
  // {
  //   path: "/usn", // usn
  //   name: "usn",
  //   component: () => import(/* webpackChunkName: "resources" */ "@/views/usn/Index"),
  //   meta: { title: "Newdex", noPdb: true },
  // },
  // 兑换 Newdex code 内嵌
  // {
  //   path: "/swap",
  //   component: Layout,
  //   redirect: "/swap",
  //   meta: { title: "Newdex" },
  //   children: [
  //     {
  //       path: "/",
  //       name: "swap-old",
  //       component: () =>
  //         import(/* webpackChunkName: "swap" */ "@/views/codex/Index"),
  //       meta: { title: "Newdex", noTabbar: false },
  //     },
  //     {
  //       path: "/swap-embed",
  //       name: "swap",
  //       component: () =>
  //         import(/* webpackChunkName: "swap" */ "@/views/codex/Swap"),
  //       meta: { title: "Newdex", noTabbar: false },
  //     },
  //     {
  //       path: "/exchangeRecordOne",
  //       name: "exchangeRecordOne",
  //       component: () =>
  //         import(
  //           /* webpackChunkName: "exchangeRecordOne" */ "@/views/codex/components/ExchangeRecord"
  //         ),
  //       meta: { title: "Newdex", noTabbar: true },
  //     },
  //     {
  //       path: "/marketRecord",
  //       name: "marketRecord",
  //       component: () =>
  //         import(
  //           /* webpackChunkName: "marketRecord" */ "@/views/codex/components/MarketRecord"
  //         ),
  //       meta: { title: "Newdex", noTabbar: true },
  //     },
  //   ],
  // },
  // 兑换 Newdex code 内嵌
  {
    path: "/swap",
    component: Layout,
    meta: { title: "Newdex" },
    children: [
      {
        path: "/",
        name: "swap",
        component: () => import(/* webpackChunkName: "resources" */ "@/views/defibox/Index"),
        meta: { title: "Newdex" },
      },
    ],
  },
  // 账号簿
  {
    path: "/addressBook/:addressChain/:type",
    component: Layout,
    redirect: "/addressBook/:addressChain/:type",
    meta: { title: "addressBook" },
    children: [
      {
        path: "/addressBook/:addressChain/:type",
        name: "addressBook",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/addressBook/Index"
          ),
        meta: { title: "Newdex", keepAlive: true, noTabbar: true },
      },
      {
        path: "/addAddress/:addressChain/:type",
        name: "addAddress",
        component: () =>
          import(
            /* webpackChunkName: "resources" */ "@/views/addressBook/AddAddress"
          ),
        meta: { title: "Newdex", noTabbar: true },
      },
    ],
  },
];

export default routerEos;
