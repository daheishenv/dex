<template>
  <div :class="{'isIOS': isIOS,'symbolList': $route.name !== 'index'}">
    <div v-if="$route.name !== 'trade' && $route.name !== 'linek'">

      <!-- 开通成交提醒提示 start -->
      <div class="openRemind" @click="handleToAbout('usds')"
        v-if="isCusdOrEusd">
        <span v-if="$store.state.app.language !== 'ko'">
          <span>{{ $t('navName.about') }}</span><span class="usds">USDⓈ ></span>
        </span>
        <span v-if="$store.state.app.language === 'ko'">
          <span class="usds">USDⓈ </span><span>{{ $t('navName.about') }} ></span>
        </span>
        <span class="iconfont icon-huaban17 close" @click.stop="handleCloseTip('usds')"></span>
      </div>
      <!-- 开通成交提醒提示 end -->

      <!-- 开通成交提醒提示 start -->
      <div class="openRemind" @click="handleToAbout('usn')"
        v-if="isCusdOrUsn">
        <span v-if="$store.state.app.language !== 'ko'">
          <span>{{ $t('navName.about') }}</span><span class="usds">USN ></span>
        </span>
        <span v-if="$store.state.app.language === 'ko'">
          <span class="usds">USN </span><span>{{ $t('navName.about') }} ></span>
        </span>
        <span class="iconfont icon-huaban17 close" @click.stop="handleCloseTip('usn')"></span>
      </div>
      <!-- 开通成交提醒提示 end -->

      <!-- agg提醒 start -->
      <div class="openRemind" @click="handleToAbout('agg')"
        v-if="isAgg">
        <span v-if="$store.state.app.language !== 'ko'">
          <span>{{ $t('navName.about') }}</span><span class="usds">{{$t('marketDistribution.DeFi')}} ></span>
        </span>
        <span v-if="$store.state.app.language === 'ko'">
          <span class="usds">{{$t('marketDistribution.DeFi')}} </span><span>{{ $t('navName.about') }} ></span>
        </span>
        <span class="iconfont icon-huaban17 close" @click.stop="handleCloseTip('agg')"></span>
      </div>
      <!-- agg提醒 end -->


      <!-- 开通成交提醒提示 start -->
      <!-- <div class="openRemind" @click="handleToAbout('usdt')"
        v-if="isCusdOrEusdt">
        <span v-if="$store.state.app.language !== 'ko'">
          <span>{{ $t('navName.about') }}</span><span class="usds">USDT ></span>
        </span>
        <span v-if="$store.state.app.language === 'ko'">
          <span class="usds">USDT </span><span>{{ $t('navName.about') }} ></span>
        </span>
        <span class="iconfont icon-huaban17 close" @click.stop="handleCloseTip('usdt')"></span>
      </div> -->
      <!-- 开通成交提醒提示 end -->

      <!-- 排序条件 -->
      <div class="tools" v-if="$route.name !== 'index' &&
        Object.keys($store.state.sys.newArea[activeObj.key])[activeObj.index] !== 'resources'">
        <!-- 交易对 字母排序 start -->
        <div ><!-- :class="{'color-this': symbolSort !== 0}" @click="handleSymbolSort"-->
          <span>
            {{ $t('public.symbol') }}
            <!-- <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': symbolSort === 1}"></i>
                <i class="bottom" :class="{'bottomActive': symbolSort === 2}"></i>
              </label>
            </span> -->
          </span>
        </div>
        <!-- 交易对字母排序 end -->
        <!-- 24H量排序 start -->
        <div >
          <!-- class="mr15" :class="{'color-this': dealCount !== 0}" @click="handleDealCount"-->
          <span class="mr15" @click="handleShowCount">
            <i class="iconfont icon-huaban106 huabanIcon"></i>
            <span v-if="showHourCount"><span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}</span>
            <span v-else>24H{{ $t('quotation.amt') }}</span>
          </span>
            <!-- <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': dealCount === 1}"></i>
                <i class="bottom" :class="{'bottomActive': dealCount === 2}"></i>
              </label>
            </span> -->
        </div>
        <!-- 24H量排序 end -->
        <!-- 最新价排序 start -->
        <div >
          <!-- :class="{'color-this': newPrice !== 0}" @click="handleNewPrice" -->
          <span >
            {{ $t('public.newPrice') }}
            <!-- <span class="sortTip fr">
              <label>
                <i class="top" :class="{'topActive': newPrice === 1}"></i>
                <i class="bottom" :class="{'bottomActive': newPrice === 2}"></i>
              </label>
            </span> -->
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
      <div class="swiper-container swiper-container_market">
        <div class="swiper-wrapper" style="opacity: 0;" ref="swiperDiv">
          <div class="swiper-slide"
            :class="{'swiper-no-swiping': activeObj.key === 'self' || Object.keys($store.state.sys.newArea[activeObj.key]).length <= 1}"
            v-for="(area, $index) in showData" :key="$index">
            <!-- 交易对列表数据 -->
            <div class="listData" :class="{'scroll': $route.name !== 'index',
              'isEmbed': isEmbed,
              'hasTip': isCusdOrEusd || isCusdOrUsn || isAgg,
              'resoures': Object.keys($store.state.sys.newArea[activeObj.key])[activeObj.index] === 'resources',
              'noSubNav': activeObj.key === 'self' || Object.keys($store.state.sys.newArea[activeObj.key]).length <= 1}">
              <div>
                <div class="loading" v-if="loading">
                  <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
                </div>
              </div>
              <div class="itemData" v-for="(item, index) in area" :key="index" @click="handleToLineK(item)"
                :style="item.chain ? 'animation: myfirst .7s' : ''">
                <!-- 交易对信息 -->
                <div class="info">
                  <div class="imgDiv">
                    <img width="100%" :src="item.coinImgUrl" @error="handleImgError($index, index)"
                      :onerror="errorCoinImg" alt="">
                  </div>
                  <div class="">
                    <div class="coin">
                      <span class="symbolName">
                        <span v-if="item.resources !== 'resources'">{{ item.symbol1.toUpperCase() }}/{{ item.symbol2.toUpperCase() }}</span>
                        <span v-else>
                          <span v-if="item.id === 'rex' || item.id === 'ram'">{{ item.symbol1.toUpperCase() }}</span>
                          <span v-else>{{ `${item.symbol1.toUpperCase()} & ${item.symbol2.toUpperCase()}` }}</span>
                        </span>
                        <!-- 置顶角标 -->
                        <div class="marker color-yellow"
                          v-if="Object.keys($store.state.sys.newArea[activeObj.key])[activeObj.index] !== 'SELF'
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
                        <div class="marker color-yellow"
                          v-else-if="item.status === 5">
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
                        <span class="chain showNote" v-else-if="!item.sameChain" @click.stop="handleShowChainTip($index, index)">
                          <div class="note" v-if="item.showChainTip">{{ $t('quotation.acrossChain') }}</div>
                        </span>

                        <!-- 新币 -->
                        <div class="marker" v-else-if="item.status === 10">
                          <span class="iconfont icon-huaban60 color-this"></span>
                        </div>

                        <!-- 聚合交易币种 -->
                        <div v-else-if="item.area === '1-2'" style="display:inline-block">
                          <img src="@/assets/img/more/swap.png"
                            class="swapIcon" alt="">
                        </div>
                      </span>
                      <!-- MEETONE/USDT -->
                    </div>
                    <div class="tip color-999" v-if="item.id !== 'cpu'">
                      <div v-if="item.resources !== 'resources'">
                        <!--  显示24量 / 24额 -->
                        <div v-if="showHourCount">
                          <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}
                          <span class="num">
                            {{ item.amount > 100000 ? parseInt(item.amount) : handleToFixed(item.amount, item.precision.coin) }}</span>
                          <!-- <span class="num">10000000.00000000</span> -->
                        </div>
                        <div v-else>
                          24H{{ $t('quotation.amt') }}
                          <span class="num" v-if="$store.state.app.language === 'en'|| $store.state.app.language === 'ko' ">
                            {{ item.volume > 1000 ? parseInt(item.volume) : handleToFixed(item.volume, 4) }}
                          </span>
                          <span class="num" v-else>
                            {{ item.volume > 100000 ? parseInt(item.volume) : handleToFixed(item.volume, 4) }}
                          </span>
                          {{ item.symbol2.toUpperCase()}}
                        </div>
                      </div>
                      <div v-else>
                        <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}
                        <!-- 资源的RAM 24Hamount -->
                        <span class="num" v-if="item.id === 'ram'">{{handleToFixed(item.amount,4) }} EOS</span>
                        <span class="num" v-else>
                          {{ item.volume > 100000 ? parseInt(item.volume) : handleToFixed(item.volume, item.precision.coin) }}
                        </span>
                        <!-- <span class="num">10000000.00000000</span> -->
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 价格 -->
                <div class="price">
                  <!-- <div :class="{'resourceFont': Object.keys($store.state.sys.newArea[activeObj.key])[activeObj.index] === 'resources'}"> -->
                  <div>
                    <span v-if="item.resources !== 'resources'">
                      {{ handleToFixed(item.price, item.precision.price) }}</span>
                    <span v-else>
                      <span v-if="item.id === 'rex'">{{ handleToFixed(item.price, 8) }}</span>
                      <span v-else-if="item.id === 'ram'">{{ Number((item.price).toFixed(item.precision.price)) }}</span>
                      <span v-else>{{ handleToFixed(item.price, item.precision.price) }}</span>
                    </span>
                  </div>
                  <div class="color-999 legalCurrency"
                    v-if="Object.keys($store.state.sys.newArea[activeObj.key])[activeObj.index] !== 'resources'">
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
                    v-if="item.resources !== 'resources'"
                    :class="{'bgcolor-red': item.change < 0,'bgcolor-999':item.change === 0,'bgcolor-green':item.change > 0}">
                    <span v-if="item.change > 0">+</span>{{ handleChange(item.change, 2) }}%
                  </span>
                  <span class="riseAndFallSpan"
                    v-else
                    :class="{'bgcolor-red': item.change < 0,'bgcolor-999':item.change === 0,'bgcolor-green':item.change > 0}">
                    <span v-if="item.change > 0">+</span>{{ handleChange(item.change, 2, true) }}%
                  </span>
                </div>
              </div>
              <div class="">
                <div class="color-999 noData" v-if="area.length === 0 && !loading && $index !== 'self'">
                  {{ $t('public.noData') }}
                </div>
                <div v-if="area.length === 0 && !loading &&  $index === 'self'">
                  <!-- 自选为空时显示 -->
                  <div class="noData selfNodata market" v-if="area.length === 0 && !loading &&  $index === 'self'">
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
        </div>
        <!-- 如果需要分页器 -->
        <!-- <div class="swiper-pagination"></div> -->

        <!-- 如果需要导航按钮 -->
        <!-- <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div> -->
      </div>
    </div>
    <!-- 聚合交易提示 -->
    <mt-popup
      v-model="tipSwapVisible"
      class="specialTip"
      popup-transition="popup-fade">
      <about-swap v-if="tipSwapVisible" @listenClose="tipSwapVisible=false;"/>
    </mt-popup>
  </div>
</template>

<script>
import Swiper from 'swiper';
import Io from '@/utils/socket/index';
import { toFixed, symbolRate } from '@/utils/public';
import { Spinner, Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';
import AboutSwap from '@/views/market/popup/AboutSwap'; // 聚合交易对提示

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      partition: [ // 分区
        'eos',
        'eusd',
        'meetone',
        'bos'
      ],
      showData: {
      }, // 展示的数据 - 用于各个分区数据展示
      showDialog: false,

      // 排序 - 0:默认 | 1:生序 | 2:降序
      quoteChange: 0, // 24H涨跌幅
      newPrice: 0, // 最新价
      dealCount: 0, // 24H量
      symbolSort: 0, // 交易对
      quotaCount: 0, // 24H额
      shelfTime: 0, // 上架时间排序(废除)
      showHourCount: false, // 默认 24H量 false 24H额
      // 收藏列表
      allFavoriteData: [],

      // loading
      loading: true,
      first: true,

      // 当前交易对
      symbol: '',
      isIOS: false,

      swiper: null,
      aboutTipClose: {
        USDS: true,
        USDT: true,
        AGG: true,
      },
      isCusdOrEusd: false,
      isCusdOrEusdt: false,
      isCusdOrUsn: false,
      isAgg: false,
      chainTipTimer: null, // 跨链提示倒计时
      oldIndex1: null,
      oldIndex2: null,
      isEmbed: false,
      tipSwapVisible: false, // 聚合交易对提示
    };
  },
  props: [
    'activeIndex',
    'activeObj',
  ],
  components: {
    mtSpinner: Spinner,
    AboutSwap,
    mtPopup: Popup,
  },
  created() {
    this.aboutTipClose = localStorage.getItem('aboutTipClose') ? JSON.parse(localStorage.getItem('aboutTipClose')) : {
      USDS: true,
      USN: true,
      USDT: true,
      AGG: true,
    };
    if (this.aboutTipClose.USDS === undefined) {
      this.aboutTipClose = {
        USDS: true,
        USN: true,
        USDT: true,
        AGG: true,
      };
      localStorage.setItem('aboutTipClose', JSON.stringify(this.aboutTipClose));
    }
  },
  mounted() {
    // console.log(Object.keys(this.$store.state.sys.newArea[this.activeObj.key]));
    // console.log(this.activeObj.key);
    this.isEmbed = !!this.$route.meta.isEmbed;
    this.symbol = this.$route.params.symbol; // 切换交易对时标记目前交易对
    this.handleDealArea()
    this.handleGetFavorite();
    setTimeout(() => {
      this.first = false;
      // 24H量和24额
      // if (this.quoteChange) return // 24H涨跌幅存在
      // const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      // const key = t[this.activeObj.index].toLowerCase();
      // this.dealCount = 2; // 降序
      // this.handleSort(key, this.dealCount);
    }, 500);
    // 判断是否为ios
    const u = navigator.userAgent;
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端

    // console.log(Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index])
    // console.log(Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index])
    // console.log(this.aboutTipClose[Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index]])
  },
  watch: {
    // 交易对改变
    '$route.params.symbol': function listen(newVal) {
      this.symbol = newVal;
    },
    // ws列表数据更新
    '$store.state.app.allSymbolDataChange': function listen() {
      this.handleWsListen();
    },
    allFavoriteData() {
      if (this.$route.name !== 'index') {
        this.handleWsListen();
      }
    },
    // 切换二级交易区
    activeObj(newVal, oldVal) {
      // 判断分区
      if (Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index] === 'USDⓈ'
        && this.aboutTipClose.USDS) {
        this.isCusdOrEusd = true;
      } else {
        this.isCusdOrEusd = false;
      }
         // 判断分区
      if (Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index] === 'USN'
        && this.aboutTipClose.USN) {
        this.isCusdOrUsn = true;
      } else {
        this.isCusdOrUsn = false;
      }
      // 判断分区
      if (Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index] === 'USDT'
        && this.aboutTipClose.USDT) {
        this.isCusdOrEusdt = true;
      } else {
        this.isCusdOrEusdt = false;
      }
      // 判断分区
      if (Object.keys(this.$store.state.sys.newArea[this.activeObj.key])[this.activeObj.index] === 'DEFI'
        && this.aboutTipClose.AGG) {
        this.isAgg = true;
      } else {
        this.isAgg = false;
      }
      if (!this.first) {
        this.quoteChange = 0;
        this.newPrice = 0;
        this.quotaCount = 0;
        this.symbolSort = 0;
        this.dealCount = 0;
        // if (!this.showHourCount) {
        //   this.dealCount = 0;
        //   this.quotaCount = 2;
        // }
      }
      if (newVal.key !== oldVal.key) { // 切换了总分区 - 重新渲染
        this.handleDealArea();
        if (newVal.key.toLowerCase() === 'self' && this.$route.name !== 'index') {
          this.handleGetFavorite();
        }
        return;
      }
      // 切换二级分区 - swiper切换
      this.swiper.slideTo(newVal.index, 10, false); // 切换到第n个slide，速度为0.4秒
      this.handleWsListen();
    },
  },
  methods: {
    // 处理不同链各种精度 原因处理排版小数点chain
    // handleDealChain(item) {
    // USD(S)
    // const arr = this.$store.state.sys.newArea.EosMain.CUSD.chainCode.split(',')
    // USDT
    // const arr2 = ['EOS']

    // const USDS = arr.includes(item.symbol2.toUpperCase())
    // const EOS = arr2.includes(item.symbol2.toUpperCase())
    // if (USDS) {
    //   return item.volume > 1000 ? window.parseInt(item.volume) : this.handleToFixed(item.volume, 4)
    // }
    // if (EOS) {
    //   return item.volume > 100000 ? window.parseInt(item.volume) : this.handleToFixed(item.volume, 4)
    // }
    // return item.volume > 10000 ? window.parseInt(item.volume) : this.handleToFixed(item.volume, 4)
    // },
    // 显示 24H量 false 24H额
    handleShowCount() {
      // if (this.quoteChange === 0) {
      this.showHourCount = !this.showHourCount
      // }
      // this.first = false;
      // const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      // const key = t[this.activeObj.index].toLowerCase();
      // this.newPrice = 0;
      // this.quoteChange = 0;
      // this.symbolSort = 0;
      // this.shelfTime = 0;
      // if (this.showHourCount) {
      //   this.quotaCount = 0
      //   this.dealCount = 2; // 降序
      //   this.handleSort(key, this.dealCount);
      // } else {
      //   this.dealCount = 0
      //   this.quotaCount = 2
      //   this.handleSort(key, this.quotaCount);
      // }
    },
    // 显示跨链交易对提示
    handleShowChainTip($index, index) {
      if (this.oldIndex1 !== null) {
        this.showData[this.oldIndex1][this.oldIndex2].showChainTip = false;
      }
      this.oldIndex1 = $index;
      this.oldIndex2 = index;
      this.showData[$index][index].showChainTip = true;
      this.$forceUpdate();
      window.clearTimeout(this.chainTipTimer)
      this.chainTipTimer = window.setTimeout(() => {
        this.showData[$index][index].showChainTip = false;
        this.$forceUpdate();
      }, 1500);
    },
    // 跳转对应公告中心
    handleToAbout(way) {
      const lang = this.$store.state.app.language;
      if (way === 'usds') {
        if (lang !== 'en') {
          window.location.href = `https://support.newdex.net/hc/${lang.toLowerCase()}/articles/360030722672`;
          return;
        }
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360030722672';
      }
      if (way === 'usdt') {
        if (lang === 'ko') {
          window.location.href = 'https://support.newdex.net/hc/ko/articles/360041732392-USDT-Market-Summary';
          return;
        }
        if (lang === 'zh-TW') {
          window.location.href = 'https://support.newdex.net/hc/zh-tw/articles/360041732392-USDT%E5%B8%82%E5%A0%B4%E7%B0%A1%E4%BB%8B';
          return;
        }
        if (lang === 'zh-CN') {
          window.location.href = 'https://support.newdex.net/hc/zh-cn/articles/360041732392-USDT%E5%B8%82%E5%9C%BA%E7%AE%80%E4%BB%8B';
          return;
        }
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360041732392-USDT-Market-Summary';
      }
      if (way === 'usn') {
        if (lang === 'ko') {
          window.location.href = 'https://support.newdex.net/hc/ko/articles/360039020011-USN-StableCoin-Introduction';
          return;
        }
        if (lang === 'zh-TW') {
          window.location.href = 'https://support.newdex.net/hc/zh-tw/articles/360039020011-USN%E7%A9%A9%E5%AE%9A%E5%B9%A3%E7%9A%84%E4%BB%8B%E7%B4%B9';
          return;
        }
        if (lang === 'zh-CN') {
          window.location.href = 'https://support.newdex.net/hc/zh-cn/articles/360039020011-USN%E7%A8%B3%E5%AE%9A%E5%B8%81%E7%9A%84%E4%BB%8B%E7%BB%8D';
          return;
        }
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360039020011-USN-StableCoin-Introduction';
      }
      if (way === 'agg') {
        this.tipSwapVisible = true;
      }
    },
    // 关闭提示
    handleCloseTip(way) {
      let area = '';
      if (way === 'usds') {
        area = 'USDS';
        this.isCusdOrEusd = false;
      }
      if (way === 'usdt') {
        area = 'USDT';
        this.isCusdOrEusdt = false;
      }
      if (way === 'usn') {
        area = 'USN';
        this.isCusdOrUsn = false;
      }
      if (way === 'agg') {
        area = 'AGG';
        this.isAgg = false;
      }
      this.aboutTipClose[area] = false;
      localStorage.setItem('aboutTipClose', JSON.stringify(this.aboutTipClose));
    },
    // 切换分区处理 - 二级分区
    handleDealArea() {
      if (this.swiper) {
        this.swiper.slideTo(0, 10, false);
        this.swiper.destroy(true);
      }
      // 处理交易区
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      this.showData = {};
      t.forEach((item) => {
        this.showData[item.toLowerCase()] = []
      });
      this.handleWsListen();

      // swiper 初始化
      this.swiper = new Swiper('.swiper-container_market', {
        initialSlide: this.activeObj.index,
        noSwiping: true,
        onTransitionEnd: (swiper) => {
          this.$emit('listenActiveObj', {
            key: this.activeObj.key,
            index: swiper.activeIndex,
          });
        },
      })

      this.$nextTick(() => {
        // 延时更新下分区数量
        setTimeout(() => {
          this.swiper.updateSlidesSize();
          this.swiper.slideTo(this.activeObj.index, 10, false); // 切换到第n个slide，速度为0.4秒
          setTimeout(() => {
            this.$refs.swiperDiv.style.opacity = 1;
          }, 100);
        }, 100);
      })
    },
    // 处理图片加载出错
    handleImgError($index, index) {
      try {
        this.showData[$index][index].coinImgUrl = 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png';
      } catch (error) {
        setTimeout(() => {
          this.handleImgError($index, index)
        }, 200);
      }
    },
    // 计算涨跌幅
    handleChange(num, len, cut) {
      const newNum = Decimal.mul(num, 100);
      if (cut) {
        return Number(newNum).toFixed(len);
      }
      return toFixed(newNum, len)
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len)
      return price;
    },
    // 跳转到K线
    handleToLineK(itemws) {
      const item = itemws;
      this.handleBackRoute();
      if (item.valuationCoinContract === 'issue.newdex'
      && item.symbol === 'eos_usdt') {
        item.precision.coin = 4;
      }
      this.$store.dispatch('setPrecision', item.precision);
      const params = {
        symbol: item.symbol, // 交易对名称
      }
      // 资源交易对跳转
      if (item.resources === 'resources') {
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
      // 交易页面切换币种时，刷新页面
      if (this.$route.name === 'trade' || this.$route.name === 'linek') {
        this.$emit('listenClose', false);
      }
      if (this.$route.name === 'trade') {
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
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    // 取消所有推送
    handleUnsubscribeWs() {
      this.partition.forEach((item) => {
        Io.cfwsUnsubscribe(`markets.${item}`);
      });
    },
    // ws监听
    handleWsListen() {
      if (this.activeObj.key.toLowerCase() === 'self' && this.$route.name !== 'index') {
        this.handleFavorite();
      }
      if (!this.$store.state.app.allSymbolData) {
        return;
      }
      this.loading = false;
      // 排序展示 - 首页点击更多时执行
      const def = Object.keys(this.$store.state.sys.newArea)[1];
      if (this.$route.params.type && this.first && this.activeObj.key === def && this.activeObj.index === 0) {
        if (this.$route.params.type === 1) {
          this.quoteChange = 2;
        } else {
          this.dealCount = 2;
        }
        const areaArr = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
        areaArr.forEach((area) => {
          this.handleSort(area.toLowerCase(), 2);
        })
        return
      }
      const type = this.newPrice || this.quoteChange || this.quotaCount || this.dealCount || this.symbolSort;
      const areaArr = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      areaArr.forEach((area) => {
        this.handleSort(area.toLowerCase(), type);
      })
    },
    // 排序 - 交易对
    handleSymbolSort() {
      this.first = false;
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      const key = t[this.activeObj.index].toLowerCase();
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
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      const key = t[this.activeObj.index].toLowerCase();
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
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      const key = t[this.activeObj.index].toLowerCase();
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
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      const key = t[this.activeObj.index].toLowerCase();
      this.newPrice = 0;
      this.dealCount = 0;
      this.quotaCount = 0
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
      const t = Object.keys(this.$store.state.sys.newArea[this.activeObj.key]);
      const key = t[this.activeObj.index].toLowerCase();
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
          if (key !== 'self') {
            // 两个都是置顶的进行排序
            if (obj2.top_flag === 1 && obj1.top_flag === 1) {
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
            // 前为非置顶 & 后为置顶排序
            if (obj2.top_flag === 1 && obj1.top_flag !== 1) {
              return 1;
            }
            // 前为置顶 & 后为非置顶排序
            if (obj2.top_flag !== 1 && obj1.top_flag === 1) {
              return -1;
            }
          }
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
      const flagTop = function dealArr(arr) {
        let isTop = 0;
        const newArr = [];
        arr.forEach((item) => {
          if (item.top_flag === 1) {
            newArr.splice(isTop, 0, item);
            isTop += 1;
            return;
          }
          newArr.push(item)
        });
        return newArr;
      }
      // type !==0 时，1 - 生序 、 2 - 降序
      let arr = JSON.stringify(this.$store.state.app.allSymbolData[key]) || '[]'; // 浅拷贝
      arr = JSON.parse(arr);
      const tArr = flagTop(arr);
      if (this.symbolSort) {
        this.showData[key] = tArr.sort(compare('symbol1'));
      } else if (this.dealCount) {
        this.showData[key] = tArr.sort(compare('amount'));
      } else if (this.quotaCount) {
        this.showData[key] = tArr.sort(compare('volume'));
      } else if (this.newPrice) {
        this.showData[key] = tArr.sort(compare('price'));
      } else if (this.quoteChange) {
        this.showData[key] = tArr.sort(compare('change'));
      } else if (this.shelfTime) {
        this.showData[key] = tArr.sort(compare('change'));
      } else {
        this.showData[key] = tArr;
      }
      this.$forceUpdate();
    },
    // 自选
    handleFavorite() {
      this.showData.self = [];
      const allData = this.$store.state.app.allSymbolData;
      // 本地数据展示
      if (this.allFavoriteData.length) {
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
        this.showData.self = showData;
      }
      allData.self = this.showData.self;
      this.$store.dispatch('setAllSymbolData', allData);
    },
    handleGetFavorite() {
      try {
        if (this.first) {
          this.loading = true;
        }
        // 异步获取自选交易对 - 进行匹配添加list
        const params = {
          account: this.$store.state.app.accountInfo.account,
        };
        this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
          this.loading = false;
          if (res.code !== 0) {
            // Toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
            return;
          }
          this.loading = true;
          // 设置用户是否有自选
          localStorage.setItem('hasFavorite', false);
          if (res.symbolList.length > 0) {
            localStorage.setItem('hasFavorite', true);
          }
          this.allFavoriteData = res.symbolList;
          const self = [];
          const allData = this.$store.state.app.allSymbolData;
          // 循环收藏列表
          this.allFavoriteData.forEach((item) => {
            // 循环 allSymbolData 列表
            for (const i in allData) { // eslint-disable-line
              if (i !== 'change' && i !== 'self') {
                allData[i].forEach(((list) => {
                  if (item.symbolId === list.id) {
                    self.push(list);
                  }
                }));
              }
            }
          });
          allData.self = self;
          this.$store.dispatch('setAllSymbolData', allData);
          this.loading = false;
        });
      } catch (error) {
        const channelRef = localStorage.getItem('channelRef') || 'dapp';
        if (channelRef === 'h5') {
          return;
        }
        setTimeout(() => {
          this.handleGetFavorite()
        }, 200);
      }
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
@import '../assets/css/swiper.min.css';

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scroll{
    height: calc(100vh - 3.75rem) !important;
    overflow-y: auto;

    &.noSubNav{
      height: calc(100vh - 3.7rem + .5rem) !important;
    }
    &.hasTip{
      // height: calc(100vh - 3.9rem) !important;
      height: calc(100vh - 4.5rem) !important;
    }
  }
}


@keyframes myfirst{
  12% {
    transform: rotate(-30deg);
  }
  37% {
    transform: rotate(30deg);
  }
  62% {
    transform: rotate(-30deg);
  }
  87% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@-webkit-keyframes myfirst{
  12% {
    transform: rotate(-30deg);
  }
  37% {
    transform: rotate(30deg);
  }
  62% {
    transform: rotate(-30deg);
  }
  87% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}


// 成交提醒提示
.openRemind{
  height: .7rem;
  background: #E9F2FF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px .24rem;
  font-size: .25rem;
  color: $color-this;

  .usds{
    font-family: DINPro-Medium, IBMPlexSans-Medium, "Microsoft YaHei", Arial, sans-serif !important;
  }

  .close{
    font-size: .17rem;
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
    height: calc(100vh - .9rem);
  }
}

// 交易大赛角标
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
// 聚合图标
.swapIcon {
  // position: absolute;
  // top: 0px;
  // right: 0px;
  width: .28rem;
  display: inline-block;
  margin-left: .1rem;
  // transform: translate(110%, 0);
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
    .huabanIcon{
      font-size: .22rem;
    }
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
    height: calc(100vh - 3.4rem);
    overflow-y: auto;

    &.isEmbed{
      height: calc(100vh - 2.2rem);

      &.noSubNav{
        height: calc(100vh - 2.2rem + .52rem);
      }

      &.hasTip{
        height: calc(100vh - 2.9rem);
      }

      &.resoures{
        height: calc(100vh - 2.2rem + .7rem);
      }
    }

    &.noSubNav{
      height: calc(100vh - 3.2rem + .52rem);
    }

    &.hasTip{
      height: calc(100vh - 4.1rem);
    }

    &.resoures{
      height: calc(100vh - 3.2rem + .7rem);
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

        .symbolName{
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

      .legalCurrency{
        margin-top: .05rem;
        font-size: .25rem;
        color: $color-999;
      }

      .resourceFont{
        font-size: .25rem;
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
    position: relative;
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
