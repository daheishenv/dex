<template>
  <div class="chain">
    <div class="flexc">
      <img class="imgTitle" v-if="$store.state.app.language === 'zh-CN'"
        src="/static/img/activity/ambassadors/title3-CN.png?v=1" alt="">
      <img class="imgTitle" v-else-if="$store.state.app.language === 'zh-TW'"
        src="/static/img/activity/ambassadors/title3-TW.png?v=1" alt="">
      <img class="imgTitle" v-else src="/static/img/activity/ambassadors/title3-en.png?v=1" alt="">
    </div>
    <div class="list">
      <div class="item" v-for="(item, index) in dealArr" :key="index" @click="handleToSymbol(item.symbol)">
        <div class="flex">
          <img :src="item.coinImgUrl" alt="">{{item.symbol1.toUpperCase()}}/{{item.symbol2.toUpperCase()}}
        </div>
        <div class="flexSides" v-if="item.change === 0">
          <span>{{handleToFixed(item.price,item.precision.price) }}<span class="small">{{ item.symbol2.toUpperCase() }}</span></span>
          <span>0.00%</span>
        </div>
        <div class="flexSides" v-else :class="[item.change<0 ? 'color-red':'color-green']">
          <span>{{handleToFixed(item.price,item.precision.price) }}<span class="small">{{ item.symbol2.toUpperCase() }}</span></span>
          <span>{{ handleChange(item.change) }}</span>
        </div>
        <!-- <div class="price" >≈ ¥ 18.73</div> -->
        <div class="price">≈<span v-if="$store.state.app.language !== 'zh-CN'">$</span>
              <span v-else>¥</span>{{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}</div>
      </div>
     </div>
  </div>
</template>
<script>
import { Decimal } from 'decimal.js';
import { toFixed, symbolRate } from '@/utils/public';

export default {
  data() {
    return {
      symbolRecommendList: ['bgbgbgbgbgbg', 'soultokeneos', 'effecttokens', 'betdicetoken',
                            'emanateoneos', 'boidcomtoken', 'vigortoken11', 'challengedac'], // 推荐交易对初始值
      allSymbolData: [],
      dealArr: [],
    }
  },
  watch: {
    // ws列表数据更新
    '$store.state.app.allSymbolDataChange': {
      handler() {
        this.handleGetAllSymbolData();
      },
      immediate: true
    },
  },
  methods: {
    // 计算汇率估值
    handleRate(num, rate, len) {
      const price = symbolRate(num, rate, len)
      return price;
    },

    handleGetAllSymbolData() {
      const arr = []
      const allSymbolData = JSON.parse(JSON.stringify(this.$store.state.app.allSymbolData));
      const keys = Object.keys(allSymbolData);
      if (keys.length < 3) {
        return;
      }
      keys.forEach((key) => {
        if (key === 'change' || key === 'self') return
        allSymbolData[key].forEach((item) => {
          arr.push(item)
        })
      })
      this.allSymbolData = arr
      this.handleDealData()
    },
    handleDealData() {
      this.dealArr = []
      this.symbolRecommendList.forEach((item) => {
        this.allSymbolData.forEach((ele) => {
          if (item === ele.contract && ele.symbol2.toUpperCase() === 'EOS') {
            this.dealArr.push(ele)
          } else if (item === ele.valuationCoinContract && ele.symbol2.toUpperCase() === 'VIGOR') {
            const newEle = ele;
            newEle.isUsds = true;
            this.dealArr.push(newEle)
          }
        })
      })
    },
    handleChange(num) {
      const newNum = Decimal.mul(num, 100);
      if (newNum > 0) {
        return `+${toFixed(newNum, 2)}%`
      }
      // change 自带负号
      return `${toFixed(newNum, 2)}%`
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    handleToSymbol(symbol) {
      this.$router.push({ name: 'linek', params: { symbol } })
    }
  },
}
</script>
<style lang="scss" scoped>
.flexc{
  display: flex;
  justify-content: center;
}
.imgTitle{
  // width: 4.54rem;
  // height: 1.07rem;
  max-width: 100%;
  margin: 0.8rem 0 0.3rem;
}
.chain{
  // margin-bottom: .5rem;
  font-size: .28rem;

}

.title{
  display: flex;
  align-items: center;
  padding: 0 .3rem;
  box-sizing: border-box;
  font-size: 0.3rem;
  margin: 0.5rem 0;
  color:#F1C89D;
  .line{
    flex: 1;
    height: .04rem;
    display: block;
    background-color: #F1C89D;
  }
  span{
    padding: 0 .2rem;
  }
}
.list{
  display: flex;
  width: 100%;
  padding: 0 0.22rem;
  box-sizing: border-box;
  flex-wrap: wrap;
  .item{
    width: 49%;
    background-image: linear-gradient(90deg, rgba(#848EFF, .3) 0%, rgba(#3452E3, .3) 100%);
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
    padding: 0.15rem;
    box-sizing: border-box;
    &:nth-of-type(2n){
      // background: #999;
      margin-left: 2%;
    }
    .flex{
      display: flex;
      align-items: center;
      font-size:0.24rem;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-bottom: 0.14rem;
      img{
        width: 0.4rem;
        height: 0.4rem;
        margin-right: .1rem;
        background: #ffffff;
        border-radius: 100rem;
      }
    }
    .flexSides{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.26rem;
      margin-bottom: 0.14rem;
      color: #fff;
      .small{
        font-size: 0.22rem;
      }
    }
    .price{
      font-size:0.22rem;
      font-weight:400;
      color:#fff;
    }
  }
}
</style>
