<template>
  <div style="height:100%; position: relative;">
      <!-- loading -->
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>
      <div id="tv_chart_container"></div>
  </div>
</template>

<script>
import Io from '@/utils/socket/index';
/* eslint-disable */
import Tv from './index'
import TvRam from './ram'
import TvRex from './rex'
import TvCpu from './cpu'
import { parseSymbol } from '@/utils/public';


export default {
  data () {
    return {
      lang: '',
      loading: false,
      theme: '',
      tradName: '', // 交易对 ABC/ECS
      ticker: '', //  请求标示ABC_ECS
      trad: null,
      interval: '240', // 分辨率，时间
      tvInit: false,
    }
  },
  props: {
    forwhat: {
      type: String,
      default: 'kline', // kline、ram、rex
    },
    symbolInfo: Object
  },
  computed: {
  },
  watch: {
    '$store.state.app.theme': function change(value) {
      this.handleLoadTradingView();
    },
    // symbolInfo: function change(val) {
    //   if (!this.tvInit) {
    //     this.trad = val;
    //     this.handleTradViewUnsubscribe();
    //     this.handleLoadTradingView();
    //   }
    // },
    '$store.state.app.language': function change(val) {
      this.lang = this.handleFormatLang(val);
      this.handleLoadTradingView();
    },
    '$store.state.app.klineConfig.interval': function change(val, oldVal) {
      this.handleTradViewUnsubscribe(oldVal);
      this.interval = val;
    },
    '$store.state.app.klineConfig.intervalRam': function change(val, oldVal) {
      this.handleTradViewUnsubscribe(oldVal);
      this.interval = val;
      if (val !== '1' && TvRam.widget) {
        TvRam.widget.chart().setChartType(1);
      }
      if (val === '1' && TvRam.widget) {
        TvRam.widget.chart().setChartType(2);
      }
    },
    '$store.state.app.klineConfig.intervalRex': function change(val, oldVal) {
      this.handleTradViewUnsubscribe(oldVal);
      this.interval = val;
      if (val !== '1' && TvRex.widget) {
        TvRex.widget.chart().setChartType(1);
      }
      if (val === '1' && TvRex.widget) {
        TvRex.widget.chart().setChartType(2);
      }
    },
    '$store.state.app.klineConfig.intervalCpu': function change(val, oldVal) {
      this.handleTradViewUnsubscribe(oldVal);
      this.interval = val;
      if (val !== '1' && TvCpu.widget) {
        TvCpu.widget.chart().setChartType(1);
      }
      if (val === '1' && TvCpu.widget) {
        TvCpu.widget.chart().setChartType(2);
      }
    },
  },
  created() {
  },
  mounted() {
    this.lang = this.handleFormatLang(this.$store.state.app.language);
    this.trad = this.handleFormatTrad();
    if (this.forwhat === 'kline') {
      this.interval = this.$store.state.app.klineConfig.interval;
      // if (!this.loading && this.trad.id) {
      this.handleLoadTradingView();
      // }
      return;
    }
    if (this.forwhat === 'ram') {
      this.interval = this.$store.state.app.klineConfig.intervalRam;
    }
    if (this.forwhat === 'rex') {
      this.interval = this.$store.state.app.klineConfig.intervalRex;
    }
    if (this.forwhat === 'cpu') {
      this.interval = this.$store.state.app.klineConfig.intervalCpu;
    }
    // if (!this.loading) {
    this.handleLoadTradingView();
    // }
  },
  beforeDestroy () {
    this.handleTradViewUnsubscribe();
  },
  methods: {
    // 格式化路由数据
    handleFormatTrad() {
      const symbol = this.$route.params && this.$route.params.symbol;
      let priceDecimal = 4;
      let allSymbolData = this.$store.state.app.allSymbolData;
      const chain = this.$store.state.sys.urlChain;
      if (allSymbolData && allSymbolData[chain]) {
        const item = allSymbolData[chain].find(v => v.symbol === symbol);
        if (item) {
          priceDecimal = item.precision.price;
        }
      }
      if (symbol) {
        const s = parseSymbol(symbol);
        return {
          symbol,
          symbol1: s[0].toUpperCase(),
          symbol2: s[1].toUpperCase(),
          priceDecimal
        }
      }
    },
    handleTradViewUnsubscribe(oldVal) {
      let type = 'minute';
      const resolution = oldVal || this.interval.toString();
      if (resolution === '5') {
        type = 'minute5'
      } else if (resolution === '15') {
        type = 'minute15'
      } else if (resolution === '30') {
        type = 'minute30'
      } else if (resolution === '60') {
        type = 'hour'
      } else if (resolution === '240') {
        type = 'hour4'
      } else if (resolution === '1D') {
        type = 'day'
      } else if (resolution === '1W') {
        type = 'week'
      } else if (resolution === '1M') {
        type = 'month'
      }
      if (this.ticker && this.forwhat === 'kline') {
        const tik = this.ticker.toLowerCase();
        Io.cfwsUnsubscribe(`kline.${type}.${tik}`);
        return
      }
      Io.cfwsUnsubscribe(`${this.forwhat}.kline.${type}`);
    },
    handleLoadTradingView() {
      this.loading = true;
      let theme_str = 'white';
      if (this.$store.state.app && this.$store.state.app.theme === 'theme-1B1D27') {
        theme_str = 'black';
      }
      let params = {
        interval: this.interval, // 分辨率（时间周期）
        wgconfig: this.handleGetThemeConfig(theme_str),
        self: this,
      };
      if (this.forwhat === 'kline') {
        const trad = this.trad;
        this.tradName = `${trad.symbol1}/${trad.symbol2}`;
        this.ticker = trad.symbol.toLowerCase();
        if (this.$appName === 'tronNewdex') {
          this.ticker = (`${trad.symbol1}_${trad.symbol2}`).toLowerCase();
        }
        params = Object.assign(params, {
          name: this.tradName, // k线显示的交易对
          ticker: this.ticker, // 后台请求币种对
          pricescale: 10 ** this.trad.priceDecimal, // 保留小数位位数
        });
        Tv.init(params, () => {
          this.loading = false;
          this.handleChartReady();
        });
      } else {
        this.tradName = this.forwhat.toUpperCase();
        let pri = 4;
        if (this.forwhat === 'rex') {
          pri = 11;
        }
        if (this.forwhat === 'ram') {
          pri = 7;
        }
        params = params = Object.assign(params, {
          name: this.tradName, // k线显示的交易对
          ticker: this.tradName, // 后台请求币种对
          pricescale: 10 ** pri, // 保留小数位位数
        });
        if (this.forwhat === 'ram') {
          TvRam.init(params, () => {
            this.loading = false;
            this.handleChartReadyRam();
          });
        }
        if (this.forwhat === 'rex') {
          TvRex.init(params, () => {
            this.loading = false;
            this.handleChartReadyRex();
          });
        }
        if (this.forwhat === 'cpu') {
          params.name = 'CPU & NET';
          TvCpu.init(params, () => {
            this.loading = false;
            this.handleChartReadyCpu();
          });
        }
      }
    },

    handleGetThemeConfig(str) {
      const themeobj = {
        'black': {
          locale: this.lang, // 多语言
          custom_css_url: '/static/chart_library/static/theme/black.css',
          toolbar_bg: '#152247', // 工具栏背景色
          // 加载背景色, 加载条颜色
          loading_screen: { backgroundColor: "#152247", foregroundColor: '#fff' },
          overrides: {
						"paneProperties.background": "#152247", // 背景色
            "paneProperties.vertGridProperties.color": "RGBA(153, 153, 156, 0.06)", //横线
            "paneProperties.horzGridProperties.color": "RGBA(153, 153, 156, 0.06)", //竖线
            "scalesProperties.textColor" : "#AAA", // 字体颜色
          },
        },
        'white': {
          locale: this.lang, // 多语言
          custom_css_url: '/static/chart_library/static/theme/white.css',
          toolbar_bg: '#fff', // 工具栏背景色
          // 加载背景色, 加载条颜色
          loading_screen: { backgroundColor: "#fff", foregroundColor: 'RGBA(0, 148, 213, 1)' },
          overrides: {
						"paneProperties.background": "#ffffff",
            "paneProperties.vertGridProperties.color": "RGBA(153, 153, 156, 0.18)",
            "paneProperties.horzGridProperties.color": "RGBA(153, 153, 156, 0.18)",
            "scalesProperties.textColor" : "#333",
          },
        }
      };
      const overrides = {
        // "mainSeriesProperties.candleStyle.upColor": "#14A670", // 涨、蜡烛图的颜色
        // "mainSeriesProperties.candleStyle.downColor": "#F83F3F", // 跌、蜡烛图的颜色
        "mainSeriesProperties.candleStyle.drawBorder": true, // 是否显示蜡烛图的边框
        "mainSeriesProperties.candleStyle.borderUpColor": "#40A771", // 蜡烛图的边框颜色
        "mainSeriesProperties.candleStyle.borderDownColor": "#E53A48",
        "mainSeriesProperties.candleStyle.wickUpColor": "#40A771", // 蜡烛图中间线的颜色
        "mainSeriesProperties.candleStyle.wickDownColor": "#E53A48",
        "volumePaneSize": "medium", // 成交量显示大小 支持的值: large, medium, small, tiny
        "timeScale.rightOffset": 2, // 蜡烛图最右边的那条与Y轴的距离
        // "paneProperties.legendProperties.showLegend": false, // 是否显示 交易对和分辨率（时间周期）
        // "paneProperties.legendProperties.showSeriesTitle": true, // // 是否显示 交易对和分辨率（时间周期）
        "paneProperties.legendProperties.showStudyArguments": false, // 是否显示成交量右上角Volume -> (20)
        "paneProperties.legendProperties.showStudyTitles": true, // 是否显示成交量右上角Volume
        "paneProperties.legendProperties.showStudyValues": true, // 是否显示成交量 数字
        "mainSeriesProperties.lineStyle.color": "#6ba583", // 折线图的颜色
      }
      themeobj.white.overrides = Object.assign(themeobj.white.overrides, overrides);
      themeobj.black.overrides = Object.assign(themeobj.black.overrides, overrides);
      return themeobj[str];
    },

    // TradingView 语言调整
    handleFormatLang(val) {
      let lang = val;
      if (lang === 'zh-TW') {
        lang = 'zh_TW';
      }
      if (lang === 'zh-CN') {
        lang = 'zh';
      }
      return lang;
    },

    handleChartReady(){
      const _this = this;
      Tv.widget.onChartReady(() => {
        Tv.createdDataBtn(this.$t('tv.minute'), this.interval === '1', '1');
        Tv.createdDataBtn(this.$t('tv.minute5'), this.interval === '5', '5');
        Tv.createdDataBtn(this.$t('tv.minute15'), this.interval === '15', '15');
        Tv.createdDataBtn(this.$t('tv.minute30'), this.interval === '30', '30');
        Tv.createdDataBtn(this.$t('tv.hour'), this.interval === '60', '60');
        Tv.createdDataBtn(this.$t('tv.hour4'), this.interval === '240', '240');
        Tv.createdDataBtn(this.$t('tv.day'), this.interval === '1D', '1D');
        Tv.createdDataBtn(this.$t('tv.week'), this.interval === '1W', '1W');
        Tv.createdDataBtn(this.$t('tv.mon'), this.interval === '1M', '1M');
        // this.createdToolBtn();
        // Tv.createdKlineBtn();
        // Tv.createdDepthBtn(() => this.handleDepthAction());
        Tv.createdFillWinBtn();
        // Tv.widget.chart().createStudy('volume', false, false);
        //默认展示MA Cross
        // Tv.widget.chart().createStudy("MA Cross", false, false, [10, 20]);
        // Tv.widget.chart().createStudy('macd', false, false);
        // 图表类型
        // Tv.widget.chart().setChartType(3);
        // Tv.widget.chart().onIntervalChanged().subscribe(null, function(resolution, obj) {
        //   obj.timeframe = Tv.getTimeframe(resolution);
        // });
        // 退出全屏K线
        Tv.widget.onShortcut('esc', function(){
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            const buttonEvent = window.fullscreenBtnEvent;
            const button = buttonEvent[0];
            button.innerHTML = '';
            button.title = _this.$t('tv.fullScreen');
            buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
            return;
          }
        });
        this.tvInit = true;
      });
    },
    handleChartReadyRam(){
      const _this = this;
      TvRam.widget.onChartReady(() => {
        TvRam.createdDataBtn(this.$t('tv.minute'), this.interval === '1', '1');
        TvRam.createdDataBtn(this.$t('tv.hour'), this.interval === '60', '60');
        TvRam.createdDataBtn(this.$t('tv.day'), this.interval === '1D', '1D');
        TvRam.createdDataBtn(this.$t('tv.week'), this.interval === '1W', '1W');
        TvRam.createdFillWinBtn();
        // 图表类型
        if (this.interval === '1') {
          TvRam.widget.chart().setChartType(2);
        } else {
          TvRam.widget.chart().setChartType(1);
        }
        // 退出全屏K线
        TvRam.widget.onShortcut('esc', function(){
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            const buttonEvent = window.fullscreenBtnEvent;
            const button = buttonEvent[0];
            button.innerHTML = '';
            button.title = _this.$t('tv.fullScreen');
            buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
            return;
          }
        });
      });
      this.tvInit = true;
    },
    handleChartReadyRex(){
      const _this = this;
      TvRex.widget.onChartReady(() => {
        TvRex.createdDataBtn(this.$t('tv.minute'), this.interval === '1', '1');
        TvRex.createdDataBtn(this.$t('tv.hour'), this.interval === '60', '60');
        TvRex.createdDataBtn(this.$t('tv.day'), this.interval === '1D', '1D');
        TvRex.createdDataBtn(this.$t('tv.week'), this.interval === '1W', '1W');
        TvRex.createdFillWinBtn();
        // 图表类型
        if (this.interval === '1') {
          TvRex.widget.chart().setChartType(2);
        } else {
          TvRex.widget.chart().setChartType(1);
        }
        // 退出全屏K线
        TvRex.widget.onShortcut('esc', function(){
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            const buttonEvent = window.fullscreenBtnEvent;
            const button = buttonEvent[0];
            button.innerHTML = '';
            button.title = _this.$t('tv.fullScreen');
            buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
            return;
          }
        });
      });
      this.tvInit = true;
    },
    handleChartReadyCpu(){
      const _this = this;
      TvCpu.widget.onChartReady(() => {
        TvCpu.createdDataBtn(this.$t('tv.minute'), this.interval === '1', '1');
        TvCpu.createdDataBtn(this.$t('tv.hour'), this.interval === '60', '60');
        TvCpu.createdDataBtn(this.$t('tv.day'), this.interval === '1D', '1D');
        TvCpu.createdDataBtn(this.$t('tv.week'), this.interval === '1W', '1W');
        TvCpu.createdFillWinBtn();
        // 图表类型
        if (this.interval === '1') {
          TvCpu.widget.chart().setChartType(2);
        } else {
          TvCpu.widget.chart().setChartType(1);
        }
        // 退出全屏K线
        TvCpu.widget.onShortcut('esc', function(){
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            const buttonEvent = window.fullscreenBtnEvent;
            const button = buttonEvent[0];
            button.innerHTML = '';
            button.title = _this.$t('tv.fullScreen');
            buttonEvent.append('<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>');
            return;
          }
        });
      });
      this.tvInit = true;
    },

    // 切换深度图
    handleDepthAction() {
      this.$emit('listenDepthAction');
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%);
    z-index: 999;
    text-align: center;

    /deep/ .mint-spinner-snake {
      margin: auto;
    }
  }
  #tv_chart_container {
    width: 100%;
    height: 100%;
  }
  .tv_chart_container_full {
      position: fixed !important;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
  }
  .theme-278EDA #tv_chart_container {
    background: #fff;
  }
  .theme-1B1D27 #tv_chart_container {
    background: #000;
  }
</style>

