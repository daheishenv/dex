<template>
  <div :class="{'isIOS': isIOS,'symbolList': $route.name !== 'index',
    'noSubNav': newAreaKey.length <= 1}">
    <div v-if="!showSort">
      <!-- 排序条件 -->
      <div class="tools" v-if="$route.name !== 'index'">
        <!-- 交易对字母排序 start -->
        <div>
          <span @click="handleSymbolSort">
            {{ $t('public.symbol') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': symbolSort === 1}"></i>
                <i class="bottom" :class="{'bottomActive': symbolSort === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <!-- 交易对字母排序 end -->
        <!-- 24H量排序 start -->
        <div class="mr15" :class="{'color-this': dealCount !== 0}">
          <span @click="handleDealCount">
            <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': dealCount === 1}"></i>
                <i class="bottom" :class="{'bottomActive': dealCount === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <!-- 24H量排序 end -->
        <!-- 最新价排序 start -->
        <div :class="{'color-this': newPrice !== 0}">
          <span @click="handleNewPrice">
            {{ $t('public.newPrice') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': newPrice === 1}"></i>
                <i class="bottom" :class="{'bottomActive': newPrice === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <!-- 最新价排序 end -->
        <!-- 24H涨跌 start -->
        <div :class="{'color-this': quoteChange !== 0}">
          <span @click="handleQuoteChange">
            <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('public.quoteChange') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': quoteChange === 1}"></i>
                <i class="bottom" :class="{'bottomActive': quoteChange === 2}"></i>
              </label>
            </span>
          </span>
        </div>
        <!-- 24H涨跌 end -->
        <!-- 上架时间排序 start -->
        <!-- <div :class="{'color-this': shelfTime !== 0}">
          <span @click="handleShelfTime">
            {{ $t('quotation.shelfTime') }}
            <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': shelfTime === 1}"></i>
                <i class="bottom" :class="{'bottomActive': shelfTime === 2}"></i>
              </label>
            </span>
          </span>
        </div> -->
        <!-- 上架时间排序 end -->
      </div>
      <!-- 交易对列表数据 -->
      <div class="listData" :class="{'scroll': $route.name !== 'index'}">
        <div class="itemData" v-for="(item, index) in showData" :key="index" @click="handleToLineK(item)">
          <!-- 交易对信息 -->
          <div class="info">
            <div class="imgDiv">
              <img width="100%" :src="item.coinImgUrl" @error="handleImgError(item)"
                :onerror="errorCoinImg"  alt="">
            </div>
            <div class="">
              <div class="coin">
                <span class="symbolName-item">
                  {{ item.symbol1.toUpperCase() }}/{{ item.symbol2.toUpperCase() }}

                  <!-- 即将上架角标 -->
                  <div class="marker" v-if="item.status === 5">
                    <span class="iconfont icon-huaban100"
                      v-if="$store.state.app.language === 'zh-CN' && item.status === 5"></span>
                    <span class="iconfont icon-huaban101"
                      v-if="$store.state.app.language === 'en' && item.status === 5"></span>
                    <span class="iconfont icon-huaban102"
                      v-if="$store.state.app.language === 'ko' && item.status === 5"></span>
                    <span class="iconfont icon-huaban98"
                      v-if="$store.state.app.language === 'zh-TW' && item.status === 5"></span>
                  </div>

                  <!-- 交易大赛角标 -->
                  <div class="marker" v-else-if="item.tag && item.tag === 1">
                    <span class="iconfont icon-huaban78"
                      v-if="$store.state.app.language === 'zh-CN' && item.tag && item.tag === 1"></span>
                    <span class="iconfont icon-huaban79"
                      v-if="$store.state.app.language === 'en' && item.tag && item.tag === 1"></span>
                    <span class="iconfont icon-huaban80"
                      v-if="$store.state.app.language === 'ko' && item.tag && item.tag === 1"></span>
                    <span class="iconfont icon-huaban81"
                      v-if="$store.state.app.language === 'zh-TW' && item.tag && item.tag === 1"></span>
                  </div>

                  <!-- 跨链 -->
                  <div class="chain" v-else-if="!item.sameChain" @click.stop="handleShowChainTip(index)">
                    <div class="note" v-if="item.showChainTip">{{ $t('quotation.acrossChain') }}</div>
                  </div>

                  <!-- 新币 -->
                  <div class="marker" v-else-if="item.status === 10">
                    <span class="iconfont icon-huaban60 color-this"></span>
                  </div>
                </span>
                <!-- MEETONE/USDT -->
              </div>
              <div class="tip color-999 longHidden">
                <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}
                <span class="num">{{ item.amount > 100000 ? parseInt(item.amount) : handleToFixed(item.amount, item.precision.coin) }}</span>
                <!-- <span class="num">10000000.00000000</span> -->
              </div>
            </div>
          </div>
          <!-- 价格 -->
          <div class="price">
            <div>
              <span v-if="item.resources !== 'resources'">
                {{ handleToFixed(item.price, item.precision.price) }}</span>
              <span v-else>{{ handleToFixed(item.price, 8) }}</span>
            </div>
            <div class="color-999 legalCurrency"
              v-if="item.resources !== 'resources'">
              <span v-if="$store.state.app.language === 'zh-CN'">
                <span>¥{{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}</span>
              </span>
              <span v-if="$store.state.app.language !== 'zh-CN'">
                <span>${{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}</span>
              </span>
            </div>
          </div>
          <!-- 涨跌幅 -->
          <div class="increase">
            <span class="riseAndFallSpan"
              :class="{'bgcolor-red': item.change < 0,'bgcolor-999':item.change === 0,'bgcolor-green':item.change > 0}">
              <span v-if="item.change > 0">+</span>{{ handleChange(item.change, 2) }}%
            </span>
          </div>
        </div>
        <div class="">
          <div class="loading" v-if="loading">
            <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
          </div>
          <div class="color-999 noData" v-else-if="showData.length === 0 && activeObj.key.toLowerCase() !== 'self'">
            {{ $t('public.noData') }}
          </div>
          <div v-if="showData.length === 0 && !loading && activeObj.key.toLowerCase() === 'self'">
            <!-- 自选为空时显示 -->
            <div class="noData selfNodata market">
              <div class="center">
                <img src="/static/img/order/search_keyword_ic.png" class="imgNodata">
                <div class="color-999">{{ $t('quotation.toAddFavoriteSymbol') }}</div>
                <button class="btn" @click="handleToAddSymbol">{{ $t('quotation.add') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易页面切换币种使用 -->
    <div v-if="showSort"
      class="tradeTable">
      <div class="item"
        :class="{'active':symbol === item.symbol}"
        v-for="(item, index) in showData" :key="index" @click="handleToLineK(item)">
        <div class="symbolName">
          <div class="imgDiv">
            <img class="coinImg" :src="item.coinImgUrl" @error="handleImgError(item)"
            :onerror="errorCoinImg" alt="">
          </div>
          <div>
            <!-- {{ item.symbol1.toUpperCase() }}/{{ item.symbol2.toUpperCase() }} -->
            <span class="symbolName-item">
              <span v-if="item.resources !== 'resources'">{{ item.symbol1.toUpperCase() }}/{{ item.symbol2.toUpperCase() }}</span>
              <span v-else>
                <span v-if="item.id === 'rex' || item.id === 'ram'">{{ item.symbol1.toUpperCase() }}</span>
                <span v-else>{{ `${item.symbol1.toUpperCase()} & ${item.symbol2.toUpperCase()}` }}</span>
              </span>

              <!-- 置顶角标 -->
              <div class="marker color-yellow"
                v-if="newAreaKey[activeObj.index] !== 'SELF'
                  && item.top_flag === 1">
                <span class="iconfont icon-huaban108"
                  v-if="$store.state.app.language === 'zh-CN' && item.top_flag === 1"></span>
                <span class="iconfont icon-huaban210"
                  v-if="$store.state.app.language === 'en' && item.top_flag === 1"></span>
                <span class="iconfont icon-huaban112"
                  v-if="$store.state.app.language === 'ko' && item.top_flag === 1"></span>
                <span class="iconfont icon-huaban113"
                  v-if="$store.state.app.language === 'zh-TW' && item.top_flag === 1"></span>
              </div>

              <!-- 即将上架角标 -->
              <div class="marker color-yellow" v-else-if="item.status === 5">
                <span class="iconfont icon-huaban100"
                  v-if="$store.state.app.language === 'zh-CN' && item.status === 5"></span>
                <span class="iconfont icon-huaban101"
                  v-if="$store.state.app.language === 'en' && item.status === 5"></span>
                <span class="iconfont icon-huaban102"
                  v-if="$store.state.app.language === 'ko' && item.status === 5"></span>
                <span class="iconfont icon-huaban98"
                  v-if="$store.state.app.language === 'zh-TW' && item.status === 5"></span>
              </div>

              <!-- 交易大赛角标 -->
              <div class="marker" v-else-if="item.tag && item.tag === 1">
                <span class="iconfont icon-huaban78"
                  v-if="$store.state.app.language === 'zh-CN' && item.tag && item.tag === 1"></span>
                <span class="iconfont icon-huaban79"
                  v-if="$store.state.app.language === 'en' && item.tag && item.tag === 1"></span>
                <span class="iconfont icon-huaban80"
                  v-if="$store.state.app.language === 'ko' && item.tag && item.tag === 1"></span>
                <span class="iconfont icon-huaban81"
                  v-if="$store.state.app.language === 'zh-TW' && item.tag && item.tag === 1"></span>
              </div>

              <!-- 跨链 -->
              <div class="chain" v-else-if="item.chain.split('-')[0] !== item.chain.split('-')[1]">
              </div>

              <!-- 新币 -->
              <div class="marker" v-else-if="item.status === 10">
                <span class="iconfont icon-huaban60 color-this"></span>
              </div>
            </span>
          </div>
        </div>
        <div class="symbolPrice">
          <span v-if="item.resources !== 'resources'">
            {{ handleToFixed(item.price, item.precision.price) }}</span>
          <span v-else>
            <span v-if="item.id === 'rex'">{{ handleToFixed(item.price, 8) }}</span>
            <span v-else-if="item.id === 'ram'">{{ handleToFixed(item.price, 4) }}</span>
            <span v-else>{{ handleToFixed(item.price, item.precision.price) }}</span>
          </span>
        </div>
        <div class="symbolChange"
          :class="{'color-red': item.change < 0,'color-999':item.change === 0,'color-green':item.change > 0}">
          <span v-if="item.change > 0">+</span>{{ handleToFixed(item.change *100, 2) }}%
        </div>
      </div>

      <!-- loading -->
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>

      <!-- noData -->
      <div class="noData" v-else-if="showData.length === 0 && activeObj.key.toLowerCase() !== 'self' && !loading">
        {{ $t('public.noData') }}
      </div>

      <!-- 没有更多记录 -->
      <div class="noData" v-if="showData && showData.length">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>

      <!-- 自选为空时显示 -->
      <div class="noData selfNodata" v-if="showData.length === 0 && !loading && activeObj.key.toLowerCase() === 'self'">
        <div class="center">
          <img src="/static/img/order/search_keyword_ic.png" class="imgNodata">
          <div class="color-999">{{ $t('quotation.toAddFavoriteSymbol') }}</div>
          <button class="btn" @click="handleToAddSymbol">{{ $t('quotation.add') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Io from '@/utils/socket/index';
import { toFixed, symbolRate } from '@/utils/public';
import { Spinner } from 'mint-ui';
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      showData: [], // 展示的数据 - 用于各个分区数据展示
      showDialog: false,

      // 排序 - 0:默认 | 1:生序 | 2:降序
      quoteChange: 0, // 24H涨跌幅
      newPrice: 0, // 最新价
      dealCount: 0, // 24量
      symbolSort: 0, // 交易对
      shelfTime: 0, // 上架时间排序(废除)

      // 收藏列表
      allFavoriteData: [],

      // loading
      loading: true,
      first: true,

      // 当前交易对
      symbol: '',
      isIOS: false,
      chainTipTimer: null, // 跨链提示倒计时
      oldIndex1: null,
      isEmbed: false,
    };
  },
  components: {
    mtSpinner: Spinner
  },
  props: [
    'activeIndex',
    'activeObj',
  ],
  computed: {
    newAreaKey() {
      if (this.$store.state.sys.newArea[this.activeObj.key]) {
        return Object.keys(this.$store.state.sys.newArea[this.activeObj.key])
      }
      return []
    },
    showSort() {
      const showList = [
        'trade',
        'linek',
        'resourceTradeRex',
        'resourceTradeCpu',
        'resourceTradeRam',
      ]
      const index = showList.findIndex(item => item === this.$route.name);
      if (index !== -1) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    this.isEmbed = !!this.$route.meta.isEmbed;
    this.handleMouted();
  },
  watch: {
    // 交易区切换
    activeIndex(newVal) {
      this.first = false;
      this.quoteChange = 0;
      this.newPrice = 0;
      this.dealCount = 0;
      this.showData = [];
      this.symbolSort = 0;
      this.handleWsListen();
      if (newVal === 1 && this.$route.name !== 'index') {
        this.handleGetFavorite();
      }
    },
    // 交易对改变
    '$route.params.symbol': function listen(newVal) {
      this.symbol = newVal;
    },
    // ws列表数据更新
    '$store.state.app.allSymbolDataChange': function listen() {
      this.handleWsListen();
    },
    activeObj() {
      this.handleWsListen();
      if (this.activeObj.key === 'self' && this.$route.name !== 'index') {
        this.handleGetFavorite();
      }
    },
  },
  methods: {
    handleMouted() {
      this.symbol = this.$route.params.symbol; // 切换交易对时标记目前交易对
      // 处理交易区
      this.handleWsListen();
      if (this.activeObj.key === 'self' && this.$route.name !== 'index') {
        this.handleGetFavorite();
      }
      // 判断是否为ios
      const u = navigator.userAgent;
      this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    },
    // 显示跨链交易对提示
    handleShowChainTip(index) {
      if (this.oldIndex1 !== null) {
        this.showData[this.oldIndex1].showChainTip = false;
      }
      this.oldIndex1 = index;
      this.showData[index].showChainTip = true;
      this.$forceUpdate();
      window.clearTimeout(this.chainTipTimer)
      this.chainTipTimer = window.setTimeout(() => {
        this.showData[index].showChainTip = false;
        this.$forceUpdate();
      }, 1500);
    },
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(item, 'coinImgUrl', 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png')
    },
    // 计算涨跌幅
    handleChange(num, len) {
      const newNum = Decimal.mul(num, 100);
      return toFixed(newNum, len)
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len)
      return price;
    },
    // 跳转到K线
    handleToLineK(item) {
      this.handleBackRoute();
      this.$store.dispatch('setPrecision', item.precision);

      // 资源交易对跳转
      if (item.resources === 'resources') {
        const params = {
          symbol: item.symbol
        }
        this.$emit('listenClose', false);
        if (this.$route.name === 'trade' || this.$route.name === 'tradeEmbed' || this.$route.meta.isResources) {
          if (item.id === 'rex') {
            this.$router.push({
              name: this.isEmbed ? 'resourceTradeRexEmbed' : 'resourceTradeRex',
              params,
            });
            return;
          }
          if (item.id === 'ram') {
            this.$router.push({
              name: this.isEmbed ? 'resourceTradeRamEmbed' : 'resourceTradeRam',
              params,
            });
            return;
          }
          this.$router.push({
            name: this.isEmbed ? 'resourceTradeCpuEmbed' : 'resourceTradeCpu',
            params,
          });
          return;
        }
        if (item.id === 'rex') {
          this.$router.push({
            name: this.isEmbed ? 'resourceKlineRexEmbed' : 'resourceKlineRex',
            params,
          });
          return;
        }
        if (item.id === 'ram') {
          this.$router.push({
            name: this.isEmbed ? 'resourceKlineRamEmbed' : 'resourceKlineRam',
            params,
          });
          return;
        }
        this.$router.push({
          name: this.isEmbed ? 'resourceKlineCpuEmbed' : 'resourceKlineCpu',
          params,
        });
        return;
      }

      // 正常交易对跳转
      const params = {
        symbol: item.symbol, // 交易对名称
      }
      // 交易页面切换币种时，刷新页面
      if (this.$route.name === 'trade' || this.$route.name === 'tradeEmbed' || this.$route.name === 'linek') {
        this.$emit('listenClose', false);
      }
      if (this.$route.name === 'trade' || this.$route.name === 'tradeEmbed' || this.$route.meta.isResources) {
        this.$router.push({
          name: this.isEmbed ? 'tradeEmbed' : 'trade',
          params,
        });
        return;
      }
      this.$router.push({
        name: this.isEmbed ? 'linekEmbed' : 'linek',
        params,
      });
    },
    // 跳转到交易
    handleToTrade(item) {
      this.$store.dispatch('setPrecision', item.precision)
      const params = {
        symbol: item.symbol,
      }
      this.$router.push({
        name: this.isEmbed ? 'tradeEmbed' : 'trade',
        params,
      });
      // 交易页面切换币种时，刷新页面
      if (this.$route.name === 'trade') {
        this.$emit('listenClose', false);
      }
    },
    // 记录返回路由
    handleBackRoute() {
      if (this.$route.name === 'linek') {
        return;
      }
      sessionStorage.setItem('backRoute', this.$route.path);
    },
    // 自选区无数据点击去添加
    handleToAddSymbol() {
      const keys = Object.keys(this.$store.state.sys.newArea)[1]
      this.$emit('listenActiveObj', {
        key: keys,
        index: 0,
      });
      // this.$emit('listenActiveIndex', 2);
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    // ws监听
    handleWsListen() {
      this.loading = true;
      try {
        if (this.activeObj.key.toLowerCase() === 'self' && this.$route.name !== 'index') {
          this.handleFavorite();
        }
        if (!this.$store.state.app.allSymbolData) {
          return;
        }
        const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
        const type = this.newPrice || this.quoteChange || this.dealCount || this.symbolSort;
        this.handleSort(key, type);
      } catch (error) {
        console.log(error); // eslint-disable-line
        setTimeout(() => {
          this.handleWsListen();
        }, 500);
      }
    },
    // 排序 - 交易对
    handleSymbolSort() {
      this.first = false;
      const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
      this.newPrice = 0;
      this.quoteChange = 0;
      this.dealCount = 0;
      this.shelfTime = 0;
      if (this.symbolSort === 0) {
        this.symbolSort = 1; // 降序
      } else if (this.symbolSort === 1) {
        this.symbolSort = 2; // 不排序
      } else {
        this.symbolSort = 0; // 升序
      }
      this.handleSort(key, this.symbolSort);
    },
    // 排序 - 成交量
    handleDealCount() {
      this.first = false;
      const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
      this.newPrice = 0;
      this.quoteChange = 0;
      this.symbolSort = 0;
      this.shelfTime = 0;
      if (this.dealCount === 0) {
        this.dealCount = 2; // 降序
      } else if (this.dealCount === 1) {
        this.dealCount = 0; // 不排序
      } else {
        this.dealCount = 1; // 升序
      }
      this.handleSort(key, this.dealCount);
    },
    // 排序 - 最新价
    handleNewPrice() {
      this.first = false;
      const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
      this.dealCount = 0;
      this.quoteChange = 0;
      this.symbolSort = 0;
      this.shelfTime = 0;
      if (this.newPrice === 0) {
        this.newPrice = 2;
      } else if (this.newPrice === 1) {
        this.newPrice = 0;
      } else {
        this.newPrice = 1;
      }
      this.handleSort(key, this.newPrice);
    },
    // 排序 - 涨跌幅
    handleQuoteChange() {
      this.first = false;
      const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
      this.newPrice = 0;
      this.dealCount = 0;
      this.symbolSort = 0;
      this.shelfTime = 0;
      if (this.quoteChange === 0) {
        this.quoteChange = 2;
      } else if (this.quoteChange === 1) {
        this.quoteChange = 0;
      } else {
        this.quoteChange = 1;
      }
      this.handleSort(key, this.quoteChange);
    },
    // 排序 - 上架时间
    handleShelfTime() {
      this.first = false;
      const key = Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index].toLowerCase();
      this.newPrice = 0;
      this.dealCount = 0;
      this.symbolSort = 0;
      this.quoteChange = 0;
      if (this.shelfTime === 0) {
        this.shelfTime = 2;
      } else if (this.shelfTime === 1) {
        this.shelfTime = 0;
      } else {
        this.shelfTime = 1;
      }
      this.handleSort(key, this.shelfTime);
    },
    handleSort(key, type) {
      // this.showData = [];
      const compare = function listenout(property) {
        return function listen(obj1, obj2) {
          const value1 = obj1[property];
          const value2 = obj2[property];
          if (type === 1) {
            if (value1 < value2) {
              return -1;
            }
            return 1;
          }
          if (value1 > value2) {
            return -1;
          }
          return 1;
        }
      }
      // 首页的排序
      if (this.activeIndex === 1 && this.$route.name === 'index') {
        const allData = [];
        for (const key in this.$store.state.app.allSymbolData) { // eslint-disable-line
          if (key !== 'change' && key !== 'self' && key !== 'resources') {
            allData.push(...this.$store.state.app.allSymbolData[key])
          }
        }
        let arr = JSON.stringify(allData);
        arr = JSON.parse(arr);
        // 对象去重
        let obj = {};
        arr = arr.reduce((prevArr, v) => {
          obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
          return prevArr;
        }, []);
        this.showData = arr.sort(compare('change')).slice(0, 10);
        this.loading = false;
        return;
      }
      if (this.activeIndex === 2 && this.$route.name === 'index') {
        const allData = [];
        for (const key in this.$store.state.app.allSymbolData) { // eslint-disable-line
          if (key !== 'change' && key !== 'self' && key !== 'resources') {
            allData.push(...this.$store.state.app.allSymbolData[key])
          }
        }
        let arr = JSON.stringify(allData);
        arr = JSON.parse(arr);
        // 对象去重
        let obj = {};
        arr = arr.reduce((prevArr, v) => {
          obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
          return prevArr;
        }, []);
        this.showData = arr.sort(compare('amount')).slice(0, 10);
        this.loading = false;
        return;
      }

      // type !==0 时，1 - 生序 、 2 - 降序
      let arr = JSON.stringify(this.$store.state.app.allSymbolData[key]) || '[]'; // 浅拷贝
      arr = JSON.parse(arr);
      if (this.symbolSort) {
        this.showData = arr.sort(compare('symbol1'));
        this.loading = false;
        return;
      }
      if (this.dealCount) {
        this.showData = arr.sort(compare('amount'));
        this.loading = false;
        return;
      }
      if (this.newPrice) {
        this.showData = arr.sort(compare('price'));
        this.loading = false;
        return;
      }
      if (this.quoteChange) {
        this.showData = arr.sort(compare('change'));
        this.loading = false;
        return;
      }
      if (this.shelfTime) {
        this.showData = arr.sort(compare('change'));
        this.loading = false;
        return;
      }
      this.showData = arr;
      this.loading = false;
    },
    // 自选
    handleFavorite() {
      this.loading = true;
      this.first = false;
      this.showData = [];
      const allData = this.$store.state.app.allSymbolData;
      // 本地数据展示
      if (this.allFavoriteData.length) {
        this.loading = false;
        let showData = [];
        // 循环收藏列表
        this.allFavoriteData.forEach((item) => {
          // 循环 allSymbolData 列表
          for (const i in allData) { // eslint-disable-line
            if (i !== 'change' && i !== 'self') {
              allData[i].forEach(((list) => {
                if (item.symbolId === list.id) {
                  showData.push(list);
                }
              }));
            }
          }
        });
        // 对象去重
        let obj = {};
        showData = showData.reduce((prevArr, v) => {
          obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
          return prevArr;
        }, []);
        this.showData = showData;
      }
      allData.self = this.showData;
      this.loading = false;
      this.$store.dispatch('setAllSymbolData', allData);
    },
    handleGetFavorite() {
      this.loading = true;
      // 异步获取自选交易对 - 进行匹配添加list
      const params = {
        account: this.$store.state.app.accountInfo.account,
      };
      this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
        this.loading = false;
        if (res.code !== 0) {
          return;
        }
        // 设置用户是否有自选
        localStorage.setItem('hasFavorite', false);
        if (res.symbolList.length > 0) {
          localStorage.setItem('hasFavorite', true);
        }
        if (this.activeObj.key !== 'self') {
          return;
        }
        this.allFavoriteData = res.symbolList;
        this.showData = [];
        const allData = this.$store.state.app.allSymbolData;
        // 循环收藏列表
        this.allFavoriteData.forEach((item) => {
          // 循环 allSymbolData 列表
          for (const i in allData) { // eslint-disable-line
            if (i !== 'change' && i !== 'self') {
              allData[i].forEach(((list) => {
                if (item.symbolId === list.id) {
                  this.showData.push(list);
                }
              }));
            }
          }
        });
        // 对象去重
        let obj = {};
        this.showData = this.showData.reduce((prevArr, v) => {
          obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
          return prevArr;
        }, []);
        allData.self = this.showData;
        this.$store.dispatch('setAllSymbolData', allData);
      });
    },
  },
  beforeDestroy() {
    // 取消所有推送
    // this.handleUnsubscribeWs();
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scroll{
    height: calc(100vh - 3.3rem) !important;
    overflow-y: auto;
  }

  .symbolList{
    &.isIOS{
      height: calc(100vh - 2rem) !important;
    }
    &.noSubNav{
      height: calc(100vh - 1.5rem) !important;
    }
  }
}

.mr15{
  margin-right: .15rem;
}

.color-777{
  color: #999 !important;
}

.symbolList{
  &.isIOS{
    height: calc(100vh - 1.5rem);
  }
  &.noSubNav{
    height: calc(100vh - 1rem);
  }
}

// 交易大赛角标
.symbolName-item{
  position: relative;
}
.marker{
  position: absolute;
  top: 0px;
  right: 0px;
  color: $color-red;
  font-size: .15rem;
  transform: translate(110%, -50%);

  &>span{
    font-size: .3rem;
  }
}

// 跨链
.chain{
  position: absolute;
  top: 50%;
  right: 0px;
  width: 17px;
  height: 17px;
  color: $color-yellow;
  transform: translate(110%, -55%);
  background: url('/static/img/market/chain.png') no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  margin-right: -.05rem;

  .note{
    position: absolute;
    padding: .05rem .35rem;
    left: 50%;
    transform: translate(-50%, 0);
    top: .45rem;
    background: #F3f3f3;
    color: $color-333;
    font-size: .21rem;
    white-space:nowrap;
    border-radius: .0314rem;

    &::before{
      content: '';
      position: absolute;
      border: .06rem solid #F3f3f3;
      top: -.06rem;
      left: 50%;
      transform: translate(-50%, 0) rotate(45deg);
    }
  }
}


// 文本过长隐藏
.longHidden{
  max-width: 2.65rem;
  overflow: hidden;
  white-space: nowrap;
}

// 排序工具
.tools{
  padding: 0px .15rem;
  border-bottom: 1px solid $color-e3e3e3;
  height: .7rem;
  display: flex;
  align-items: center;/*垂直居中*/

  &>div{
    color: $color-999;
    flex: 1;
    font-size: .25rem;
    height: .7rem;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: space-between;
    font-weight: 300;

    &>span{
      line-height: .7rem;
    }

    &:nth-child(1){
      padding-left: .05rem;
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4){
      justify-content: flex-end;
    }

    &:nth-child(3){
      min-width: 1.75rem;
    }

    &:nth-child(4){
      min-width: 1.85rem;
      padding-right: .05rem;
    }
  }
}

// 交易对列表
.listData{
  padding: 0px .15rem;
  font-size: .32rem;

  &.scroll{
    height: calc(100vh - 2.8rem);
    overflow-y: auto;

    &.noSubNav{
      height: calc(100vh - 2.6rem + .52rem);
    }
  }

  .itemData{
    height: 1.3rem;
    border-bottom: 1px solid $color-e3e3e3;
    display: flex;
    align-items: center;/*垂直居中*/

    &>div{
      flex: 1;
    }

    .info{
      flex: 2;
      text-align: left;
      display: flex;
      align-items: center;/*垂直居中*/

      .coin{
        position: relative;

        .symbolName-item{
          position: relative;
        }
      }

      .imgDiv{
        width: .65rem;
        height: .65rem;
        margin-right: .07rem;

        img{
          width: 100%;
        }
      }

      .tip{
        margin-top: .05rem;
        font-size: .24rem;
        color: $color-999;
      }
    }

    .price{
      text-align: right;
      min-width: 1.75rem;
      max-width: 1.75rem;
      position: relative;
      flex: 2;
      margin: 0rem .1rem 0px 0px;

      .resourceFont{
        font-size: .25rem;
      }

      .legalCurrency{
        margin-top: .05rem;
        font-size: .25rem;
        color: $color-999;
      }
    }

    .increase{
      text-align: right;
      // min-width: 2rem;
      position: relative;
      width: 1.55rem;

      /* 涨跌幅span标签 */
      .riseAndFallSpan{
        display: inline-block;
        border-radius: .12rem;
        box-sizing: border-box;
        line-height: .58rem;
        width: 1.55rem;
        max-width: 1.65rem;
        height: .55rem;
        font-size: .24rem;
        text-align: center;
        background-color: $color-green;
        color: white;
      }

      .bgcolor-999{
        background: #999;
      }
    }
  }
}

.loading{
  display: block;
  width: 45px;
  margin: auto;
  padding: .3rem 0rem;
}

.noData{
  height: .6rem;
  line-height: .6rem;
  font-size: .25rem;
  text-align: center !important;

  &.selfNodata{
    height: calc(100vh - .9rem);
    position: relative;

    .center{
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .imgNodata{
      width: 1.8rem;
      height: 1.8rem;
      padding-top: .30rem;
      padding-bottom: .1rem;
    }

    .btn{
      height: .8rem;
      line-height: .8rem;
      width: 3.8rem;
      background: $color-this;
      font-size: .32rem;
      color: #fFF;
      border-radius: .12rem;
      margin-top: .2rem;
    }
  }

  &.market{
    height: calc(100vh - 2.8rem);
  }
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}

.dialog{
  padding: .61rem 0rem;

  .tip{
    line-height: .45rem;
  }
}

.sortTip{
  width: .1rem;
  height: .7rem;
  display: flex;
  align-items: center;/*垂直居中*/


  .topActive{
    border-bottom: .07rem solid $color-this !important;
  }

  .bottomActive{
    border-top: .07rem solid $color-this !important;
  }

  .top{
    float: left;
    border: .07rem solid transparent;
    border-bottom: .07rem solid #999;
    margin: 0rem .05rem 0.015rem .05rem;
  }

  .bottom{
    float: left;
    border: .07rem solid transparent;
    border-top: .07rem solid #999;
    margin: .015rem .05rem 0.0rem .05rem;
  }
}

.tableData{
  font-size: .24rem;
  display: flex;

  .center{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .info{
    text-align: left;
    flex: 3;
  }

  .price{
    position: relative;
    flex: 2;
    margin: 0rem .1rem;
  }

  .increase{
    position: relative;
    width: 1.55rem;
  }
}

// 交易页面切换币种样式
.tradeTable{
  width: 100%;
  font-size: .28rem;
  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  .item{
    height: .8rem;
    padding: 0 .2rem 0 .15rem;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    display: flex;
    align-items: center;/*垂直居中*/

    &.active{
      border-top: 1px solid rgba(74,144,226,0.24);
      border-bottom: 1px solid rgba(74,144,226,0.24);
      background: rgba(74,144,226,0.11);
    }

    &>div{
      flex: 1;
    }

    .symbolName{
      flex: 2;
      min-width: 2.1rem;
      display: flex;
      align-items: center;

      .imgDiv{
        width: .5rem;
        min-width: .5rem;;
        display: flex;
        align-items: center;
        margin-right: .1rem;

        img{
          width: 100%;
        }
      }
    }

    .symbolPrice{
      font-size: .25rem;
    }

    .symbolPrice,
    .symbolChange{
      text-align: right;
    }
  }
}

</style>
