/* eslint-disable */
<template>
  <div style="height: 6.2rem; width: 100%; position: relative;">
    <!-- loading -->
    <div class="loading"
         v-if="loading">
      <mt-spinner type="snake"
                  color="#0094d5"
                  class="color-this"></mt-spinner>
    </div>
    <!-- <div id="containerDepth" style="height:100%"></div> -->
    <div style="height: 100%; width: 100%; overflow-x: hidden; position: relative;">
      <div class="flexb depthConnet" style="height: 100%; margin: auto; position: relative; z-index: 10">
        <div id="containerDepthLeft" style="width:50%; height: 100%;"></div>
        <div id="containerDepthRight" style="width:50%; height: 100%"></div>
      </div>
      <div class="depthLine">
        <span class="su su1" style="left: 25%"></span>
        <!-- <span class="su su2" style="left: 50%"></span> -->
        <span class="su su3" style="left: 75%"></span>
        <span class="heng heng1" style="bottom: 25%">
          <i>{{handleNumYFormat(numY[0])}}</i>
        </span>
        <span class="heng heng2" style="bottom: 50%">
          <i>{{handleNumYFormat(numY[1])}}</i>
        </span>
        <span class="heng heng3" style="bottom: 75%">
          <i>{{handleNumYFormat(numY[2])}}</i>
        </span>
        <span class="heng heng4" style="bottom: 100%">
          <i>{{handleNumYFormat(numY[3])}}</i>
        </span>
        <!-- <span class="heng heng5" style="bottom: 100%"></span> -->
        <!-- <span class="heng heng6" style="top: 25%"></span> -->
      </div>
      <div class="depthPrice flexb">
        <div class="flexb" style="width: 50%">
          <span>{{numPrice[0]}}</span>
          <span style="padding-right: 5px">{{numPrice[1]}}</span>
        </div>
        <!-- <span>{{numPrice[2]}}</span> -->
        <div class="flexb" style="width: 50%">
          <span  style="padding-left: 5px">{{numPrice[2]}}</span>
          <span>{{numPrice[3]}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="depthxbox flexb">
      <span v-for="(item, index) in depthx"
            :key="index">{{ item }}</span>
    </div> -->
  </div>
</template>


<script>

import { Spinner } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { createComparison, toNonExponential, toFixed } from '@/utils/public';
import Depth from './index';

export default {
  data() {
    return {
      lang: '',
      tradName: '', // 交易对 ABC/ECS
      ticker: '', //  请求标示ABC_ECS
      symTrad: null,
      trad: {},
      theme: 'white',
      loading: true,
      depthx: [],
      itemsBuyForDepth: [],
      itemsSellForDepth: [],
      numPrice: ['', '', '', ''],
      numY: [null, null, null, null],
    }
  },
  components: {
    mtSpinner: Spinner
  },
  computed: {
  },
  props: {
    depthData: Object,
    subActive: Number,
  },
  watch: {
    'depthData.timesatep': function change() {
      this.handleDepthUpdate();
    },
    '$store.state.app.trad.id': function change() {
      this.trad = this.$store.state.app.trad;
      this.loading = false;
    },
    subActive: function change(val) {
      if (val === 2) {
        this.handleLoadDepth();
        this.handleUpdateSize();
      }
    }
  },
  created() {
  },
  mounted() {
    this.handleLoadDepth();
    this.handleUpdateSize();
  },
  methods: {
    handleLoadDepth() {
      const self = this;
      this.trad = this.$store.state.app.trad;
      if (!this.trad) {
        setTimeout(() => {
          this.handleLoadDepth()
        }, 2000);
        return;
      }
      const data = this.handleDepthFormat();
      const params = {
        data,
        self,
        trad: this.trad,
        theme: this.theme,
      };
      Depth.init(params);
      this.loading = false;
    },
    handleDepthUpdate() {
      this.trad = this.$store.state.app.trad;
      const data = this.handleDepthFormat();
      const params = {
        data,
        trad: this.trad
      }
      Depth.highChartsUpdate(params);
    },
    handleUpdateSize() {
      Depth.echartsUpdateSize();
    },
    handleDepthFormat() {
      const wsdata = this.depthData;
      if (!wsdata.asks) return false;
      if (!wsdata.bids) return false;
      const asks = JSON.parse(wsdata.asks);
      const bids = JSON.parse(wsdata.bids);
      this.itemsBuyForDepth = bids;
      this.itemsSellForDepth = asks;
      // 买入深度
      const itemsBuy = [];
      this.itemsBuyForDepth.sort(createComparison('price')); // 重新排序
      this.itemsBuyForDepth.reverse();
      this.itemsBuyForDepth.forEach((v) => {
        const numberAll = itemsBuy.length ? Number(Decimal.add(itemsBuy[itemsBuy.length - 1][1], v.num).toString()) : Number(v.num);
        const moneyAll = itemsBuy.length ? Number(Decimal.add(itemsBuy[itemsBuy.length - 1][2], Number(v.amount)).toString()) : Number(v.amount);
        itemsBuy.push([
          Number(v.price),
          numberAll,
          moneyAll,
        ])
      })
      // 卖出深度
      const itemsSell = [];
      this.itemsSellForDepth.sort(createComparison('price')); // 重新排序
      this.itemsSellForDepth.forEach((v) => {
        const numberAll = itemsSell.length ? Number(Decimal.add(itemsSell[itemsSell.length - 1][1], v.num).toString()) : Number(v.num);
        const moneyAll = itemsSell.length ? Number(Decimal.add(itemsSell[itemsSell.length - 1][2], Number(v.amount)).toString()) : Number(v.amount);
        itemsSell.push([
          Number(v.price),
          numberAll,
          moneyAll,
        ])
      })
      const depthFormat = {
        buy: itemsBuy.reverse(),
        sell: itemsSell,
      }
      try {
        // 获取x轴 5个价格
        let num1, // eslint-disable-line
          num2,
          num3,
          num4;
        const buyString = JSON.stringify(itemsBuy);
        const buyarr = JSON.parse(buyString);
        const leftLength = buyarr.length;
        const sellarr = itemsSell;
        const rightLength = sellarr.length;
        let yleftMap = [];
        let yrightMap = [];
        if (itemsBuy.length > 0) {
          num1 = toFixed(toNonExponential(buyarr[0][0]), this.trad.priceDecimal);
          num2 = toFixed(toNonExponential(buyarr[leftLength - 1][0]), this.trad.priceDecimal);
          yleftMap = itemsBuy.map(v => v[1]);
        }
        if (itemsSell.length > 0) {
          num3 = toFixed(toNonExponential(sellarr[0][0]), this.trad.priceDecimal);
          num4 = toFixed(toNonExponential(sellarr[rightLength - 1][0]), this.trad.priceDecimal);
          yrightMap = itemsSell.map(v => v[1]);
        }
        this.numPrice = [num1, num2, num3, num4];
        yleftMap.push(...yrightMap);
        let yMax = 0;
        if (yleftMap.length > 0) {
          yMax = Math.max.apply(null, yleftMap);
        }
        this.numY = [yMax * 0.25, yMax * 0.50, yMax * 0.75, yMax];
      } catch (error) {
        console.log(error); // eslint-disable-line
      }
      return depthFormat;
    },
    handleNumYFormat(item) {
      const val = parseFloat(item, 0);
      if (!val || isNaN(val) || val === 'undefined') {
        return null;
      }
      if (val >= 1000) {
        return `${toFixed(toNonExponential(val / 1000), 2 || 0)}k`
      }
      return toFixed(toNonExponential(val), 2 || 0);
    },
    handleFullScreen() {
      const tvid = document.getElementById('tv_chart_container');
      const button = document.getElementById('fullScreenBtn');
      if (tvid.className === 'tv_chart_container_full') {
        tvid.className = '';
        button.title = this.$t('tv.fullScreen');
        button.innerHTML = '<svg style="vertical-align: middle;fill: #9194a4;margin-top: -4px;" width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 586.09999 586.09996"><path d="M172.6 367.9l-97.7 97.7L0 390.7v195.4h195.4l-74.9-74.9 97.7-97.7-45.6-45.6zM195.4 0H0v195.4l74.9-74.9 97.7 97.7 45.6-45.6-97.7-97.7L195.4 0zm195.3 0l74.9 74.9-97.7 97.7 45.6 45.6 97.7-97.7 74.9 74.9V0H390.7zm22.8 367.9l-45.6 45.6 97.7 97.7-74.9 74.9h195.4V390.7l-74.9 74.9-97.7-97.7z"></path></svg>'; // eslint-disable-line
        this.handleLoadDepth()
        return;
      }
      tvid.className = 'tv_chart_container_full';
      button.title = this.$t('tv.fullScreenOut');
      button.innerHTML = '<svg style="vertical-align: middle;fill: #9194a4;margin-top: -1px;" width="19" height="19" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4719" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><style type="text/css"></style></defs><path d="M391 240.9c-0.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3c-3.1-3.1-8.2-3.1-11.3 0l-42.4 42.3c-3.1 3.1-3.1 8.2 0 11.3L280 333.6l-43.9 43.9c-4.7 4.7-1.9 12.8 4.7 13.6L401 410c5.1 0.6 9.5-3.7 8.9-8.9L391 240.9zM401.1 614.1L240.8 633c-6.6 0.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7c4.7 4.7 12.8 1.9 13.6-4.7l18.9-160.1c0.6-5.1-3.7-9.4-8.8-8.8zM622.9 409.9L783.2 391c6.6-0.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3c-3.1-3.1-8.2-3.1-11.3 0L690.3 279.9l-43.7-43.7c-4.7-4.7-12.8-1.9-13.6 4.7L614.1 401c-0.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9c4.7-4.7 1.9-12.8-4.7-13.6L623 614c-5.1-0.6-9.5 3.7-8.9 8.9L633 783.1c0.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z" p-id="4720"></path></svg>'; // eslint-disable-line
      this.handleLoadDepth()
    },

    handleKlineAction() {
      this.$emit('listenKlineAction')
    },

    /*
    * esc退出全屏
    */
    ESCFillWinClose() {
      const self = this;
      document.onkeydown = ((e) => {
        if (e.which === 27) {
          const tvid = document.getElementById('tv_chart_container');
          if (tvid.className === 'tv_chart_container_full') {
            tvid.className = '';
            self.handleLoadDepth();
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
$-width-depth: 94%;
.depthConnet {
  width: $-width-depth;
}
.depthLine {
  position: absolute;
  z-index: 9;
  width: $-width-depth;
  height: 85%;
  bottom: '35px';
  top: 7%;
  left: 0;
  right: 0;
  margin: auto;

  span {
    position: absolute;
    background: RGBA(153, 153, 156, 0.1);
    &.heng {
      width: 100%;
      height: 1px;

      i {
        position: absolute;
        font-style: normal;
        display: inline-block;
        top: -6px;
        left: 4px;
        color: #999;
      }
    }

    &.su {
      width: 1px;
      height: 100%;
    }
  }
}
.depthPrice {
  width: $-width-depth;
  // padding-top: 0.05rem;
  position: absolute;
  z-index: 9;
  bottom: 0.11rem;
  left: 0;
  right: 0;
  margin: auto;
  color: #888;
}

.flex,
.flexc,
.flex-column,
.flexb,
.flext,
.flex-column.sb {
  display: flex;
  align-items: center;
}
.flex-column {
  flex-direction: column;
}
.flex-column.sb {
  justify-content: space-between;
}
.flexc {
  justify-content: center;
}
.flexb {
  justify-content: space-between;
}
.flext {
  justify-content: flex-start;
  align-items: flex-start;
}

.depthxbox {
  z-index: 9;
  width: 100%;
  position: absolute;
  bottom: 0.2rem;
  font-size: 0.25rem;
  color: #999;
  left: 0;
  justify-content: space-around;
  padding: 0 5px;
  box-sizing: border-box;

  span {
    width: 20%;
    overflow: hidden;

    // &:first-child(1) {
    // }

    // &:nth-child(2) {
    // }

    &:nth-child(3) {
      text-align: center;
    }

    &:nth-child(4) {
      text-align: right;
    }
    &:nth-child(5) {
      text-align: right;
    }
  }
}

.flexstart {
  align-items: flex-start !important;
}
.loading {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  z-index: 9;
  text-align: center;

  /deep/ .mint-spinner-snake {
    margin: auto;
  }
}
#tv_chart_container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 40px;
  box-sizing: border-box;
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

  .klinebtn {
    display: none !important;
  }
}

.chartTop {
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 99;
  padding: 5px 0;

  .button {
    box-sizing: border-box;
    cursor: pointer;
    color: #9194a4;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid;
    border-color: #ffffff;
    font-size: 13px !important;
    display: inline-block;
    padding: 4px 8px;
    text-align: center;
    margin-right: 2px;
  }

  // .depthBtn {
  // }
  .fullScreenBtn {
    min-width: auto;
    padding: 5px;
    margin-right: 4px;
  }
  .fullScreenBtn svg {
    vertical-align: middle;
    fill: #9194a4;
    // opacity: 0.5;
    margin-top: -4px;
  }
  .button.selected,
  .button:hover {
    font-weight: normal;
    background-color: rgba(53, 116, 250, 0.12) !important;
    color: #8194a4 !important;
  }
  .button:hover {
    border-color: #b5b7b9;
  }
}

.tv_chart_container_full {
  .chartTop {
    .fullScreenBtn {
      padding: 3px;
      margin-top: -3px;
      vertical-align: middle;
    }
  }
}
</style>
