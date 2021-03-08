<template>
  <!-- 推荐币种 -->
  <div class="swiper-container swiper-containe_coin" v-show="dealArr.length">
    <div class="swiper-wrapper">
      <div class="swiper-slide swiper-slide_coin" v-for="(arr,index) in swiperDealArr" :key="index">
        <div
          class="coinItem"
          v-for="item in arr"
          :key="item.id"
          @click="handleToSymbol(item.symbol, item)"
        >
          <!-- <div class="recommend" v-show="item.isAd">{{$t('index.ad')}}</div> -->
          <div class="title">{{item.symbol1}}/{{item.symbol2}}</div>
          <div
            class="price"
            v-if="item.change === 0"
          >{{handleToFixed(item.price,item.precision.price) }}</div>
          <div
            class="price"
            v-else
            :class="[item.change<0 ? 'color-red':'color-green']"
          >{{handleToFixed(item.price,item.precision.price) }}</div>
          <div class="percent" v-if="item.change === 0">0.00%</div>
          <div
            class="percent"
            v-else
            :class="[item.change<0 ? 'color-red':'color-green']"
          >{{ handleChange(item.change) }}</div>
          <div>
            ≈
            <span v-if="$store.state.app.language !== 'zh-CN'">$</span>
            <span v-else>¥</span>
            {{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器容器 -->
    <div class="swiper-pagination swiper-pagination_coin"></div>
  </div>
</template>
<script>
import Swiper from "swiper";
// import 'swiper/dist/css/swiper.css';
import { Decimal } from "decimal.js";
import { toFixed, symbolRate } from "@/utils/public";

export default {
  data() {
    return {
      symbolRecommendList: [],
      allSymbolData: [],
      dealArr: [],
      setTimeout: null,
      swiper: null,
      setInterval: null,
    };
  },
  computed: {
    swiperDealArr() {
      const pages = [];
      this.dealArr.forEach((item, index) => {
        const page = Math.floor(index / 3);
        if (!pages[page]) {
          pages[page] = [];
        }
        pages[page].push(item);
      });
      return pages;
    },
  },
  watch: {
    // ws列表数据更新
    "$store.state.app.allSymbolDataChange": {
      handler() {
        // if (!this.symbolRecommendList.length) {
        //   return;
        // }
        this.handleGetAllSymbolData();
      },
      // immediate: true
      // deep: true
    },
  },
  mounted() {
    // this.handleSwiperCoinStart()
    // if (this.$appName === 'tronNewdex') {
    //   this.symbolRecommendList = [{
    //     symbolId: 157,
    //   }, {
    //     symbolId: 203,
    //   }];
    //   this.handleGetAllSymbolData()
    //   return;
    // }
    this.handleGetCommonParam();
    this.handleTimeGetCommonParam();
    // this.handleGetAllSymbolData()
  },
  beforeDestroy() {
    window.clearTimeout(this.setTimeout);
    window.clearInterval(this.setInterval);
  },
  methods: {
    handleSwiperCoinStart() {
      if (this.swiper) {
        return;
      }
      // swiper
      this.swiper = new Swiper(".swiper-containe_coin", {
        pagination: ".swiper-pagination_coin",
        // slidesPerView: 3,
        paginationClickable: true,
        // spaceBetween: 80
      });
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len);
      return price;
    },
    // 获取推荐交易
    handleGetCommonParam() {
      this.$http.get("symbol/getSymbolRecommend").then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.symbolRecommendList = res.symbolRecommendList;
        this.handleGetAllSymbolData();
      });
    },
    handleGetAllSymbolData() {
      let arr = [];
      const allSymbolData = JSON.parse(
        JSON.stringify(this.$store.state.app.allSymbolData)
      );
      const keys = Object.keys(allSymbolData);
      if (keys.length < 3) {
        return;
      }
      keys.forEach((key) => {
        if (key === "change" || key === "self") return;
        allSymbolData[key].forEach((item) => {
          arr.push(item);
        });
      });
      let obj = {};
      arr = arr.reduce((prevArr, v) => {
        obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
        return prevArr;
      }, []);
      this.allSymbolData = arr;
      this.handleDealData();
    },
    handleDealData() {
      this.dealArr = [];
      this.symbolRecommendList.forEach((item) => {
        this.allSymbolData.forEach((ele) => {
          if (item.symbolId === ele.id) {
            const newItem = ele;
            newItem.srid = item.id;
            this.dealArr.push(newItem);
          }
        });
      });
      // this.$forceUpdate();
      if (this.dealArr.length > 3) {
        setTimeout(() => {
          this.handleSwiperCoinStart();
        }, 200);
      }
    },
    handleChange(num) {
      const newNum = Decimal.mul(num, 100);
      if (newNum > 0) {
        return `+${toFixed(newNum, 2)}%`;
      }
      // change 自带负号
      return `${toFixed(newNum, 2)}%`;
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    handleTimeGetCommonParam() {
      this.setInterval = window.setInterval(() => {
        this.handleGetCommonParam();
      }, 180000);
    },
    async handleToSymbol(symbol, item) {
      if (item) {
        await this.handleCountClick(item);
      }
      this.$router.push({ name: "linek", params: { symbol } });
    },
    async handleCountClick(item) {
      const params = {
        id: item.srid,
        type: 2,
        ref: "dapp",
      };
      await this.$http
        .post("/accessStatistics/statistics", params)
        .then(() => {});
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/swiper.min.css";

.swiper-containe_coin.swiper-container {
  display: flex;
  height: 1.9rem;
  width: 100%;
  background-color: #fff;
  margin: 0.09rem 0;
  padding: 0 0rem 0rem 0;
  box-sizing: border-box;
  overflow: hidden;

  .swiper-slide_coin {
    width: 100%;
    display: flex;
    .coinItem {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // padding-top: .10rem;
      box-sizing: border-box;
      width: 33.33%;
      min-width: 2rem;
      // height: 100%;
      position: relative;
      font-size: 0.21rem;
      color: #646464;
      .title {
        font-size: 0.24rem;
        color: #000000;
        text-transform: uppercase;
        margin-bottom: 0.06rem;
        font-weight: 500;
        margin-top: -.18rem;
      }
      .price {
        font-size: 0.31rem;
        // color: #1BAF6B;
        color: #333;
        margin-bottom: 0.08rem;
        font-weight: 500;
      }
      .percent {
        font-size: 0.21rem;
        // color: #DE462A;
        color: #333;
        margin-bottom: 0.08rem;
      }
      .recommend {
        position: absolute;
        top: 0;
        left: 0;
        height: 0.26rem;
        width: 0.66rem;
        min-width: 0.66rem;
        font-size: 0.15rem;
        color: #4a90e2;
        background: #edf4f9;
        border-radius: 0 0 0.07rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .swiper-pagination-bullets {
    bottom: 0.07rem;

    /deep/ .swiper-pagination-bullet {
      width: 0.3rem;
      height: 0.02rem;
      border-radius: 0%;
      margin: 0 !important;
      background-color: #9e9e9e;
    }
    /deep/ .swiper-pagination-bullet-active {
      background-color: #4a4a4a;
    }
  }
}
</style>
