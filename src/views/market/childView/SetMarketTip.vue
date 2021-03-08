<template>
  <div class="setMarketDiv">
    <!-- setting Market Tip -->
    <!-- 头部工具 start -->
    <div class="tools">
      <span class="iconfont icon-huaban25 back" @click="handleBack"></span>
      <span class="title">{{ $t('marketTip.marketTip') }}</span>
      <span class="myMarketTip"  v-if="$route.name === 'setMarketTip'"
        @click="handleToMarketTip">{{ $t('marketTip.myTip') }}</span>
    </div>
    <!-- 头部工具 end -->

    <!-- 交易对信息 start -->
    <div class="itemData">
      <!-- 交易对信息 -->
      <div class="info">
        <div class="imgDiv">
          <img width="100%" :src="item.coinImgUrl" @error="handleImgError(item)"
          :onerror="errorCoinImg" alt="">
        </div>
        <div class="">
          <div class="coin">
            <span class="symbolName">
              {{ item.symbol1.toUpperCase() }}/{{ item.symbol2.toUpperCase() }}

              <!-- 交易大赛角标 -->
              <div class="marker">
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
              <span class="chain" v-if="!item.tag && item.chain.split('-')[0] !== item.chain.split('-')[1]">
              </span>
            </span>
            <!-- MEETONE/USDT -->
          </div>
          <div class="tip longHidden color-999">
            <span v-if="$store.state.app.language !== 'ko'">24H</span>{{ $t('quotation.num') }}
            <span class="num">{{ item.amount > 100000 ? parseInt(item.amount) : handleToFixed(item.amount, item.precision.coin) }}</span>
            <!-- <span class="num">10000000.00000000</span> -->
          </div>
        </div>
      </div>
      <!-- 价格 -->
      <div class="price" @click="handleDealPrice">
        <div>{{ handleToFixed(item.price, item.precision.price) }}</div>
        <div class="color-999 legalCurrency">
          <span v-if="$store.state.app.language === 'zh-CN'">
            <span>¥{{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}</span>
          </span>
          <span v-if="$store.state.app.language !== 'zh-CN'">
            <span>${{ handleRate(item.price, $store.state.app.exchangeRate[item.symbol2.toLowerCase()], item.precision.price) }}</span>
          </span>
        </div>
      </div>
      <!-- 涨跌幅 -->
      <div class="increase" @click="handleDealPrice">
        <span class="riseAndFallSpan"
          :class="{'bgcolor-red': item.change < 0,'bgcolor-999':item.change === 0,'bgcolor-green':item.change > 0}">
          <span v-if="item.change > 0">+</span>{{ handleChange(item.change, 2) }}%
        </span>
      </div>
    </div>
    <!-- 交易对信息 end -->

    <!-- 提醒条件设置 start -->
    <div class="condition">
      <div class="settingDiv">
        <span :class="{'span-EN': $store.state.app.language === 'en'}">{{ $t('marketTip.maxPrice') }}</span>
        <span>
          <input class="input" type="text" :placeholder="$t('marketTip.placeholder')" v-model="hightPrice" @blur="handleBlurMaxPrice">
          <span class="symbol2Name">{{ item.symbol2.toUpperCase() }}</span>
          <div class="error" v-if="maxError">{{ $t('marketTip.noLow') }}</div>
          <div class="error" v-if="maxError1">{{ $t('marketTip.correctPrice') }}</div>
        </span>
      </div>
      <div class="settingDiv">
        <span :class="{'span-EN': $store.state.app.language === 'en'}">{{ $t('marketTip.minPrice') }}</span>
        <span>
          <input class="input" type="text" :placeholder="$t('marketTip.placeholder')" v-model="lowPrice" @blur="handleBlurMinPrice">
          <span class="symbol2Name">{{ item.symbol2.toUpperCase() }}</span>
          <div class="error" v-if="minError">{{ $t('marketTip.noHeight') }}</div>
          <div class="error" v-if="minError1">{{ $t('marketTip.correctPrice') }}</div>
        </span>
      </div>
      <div class="settingDiv">
        <span :class="{'span-EN': $store.state.app.language === 'en'}">
          <span>{{ $t('marketTip.wave') }}</span>
          <span @click="tipToWave = true" class="iconfont icon-huaban31 what"></span>
        </span>
        <span class="wave">
          <span @click="handleWavePercent(10)" :class="{'actived': wavePercent === 10}">10%</span>
          <span @click="handleWavePercent(20)" :class="{'actived': wavePercent === 20}">20%</span>
          <span @click="handleWavePercent(30)" :class="{'actived': wavePercent === 30}">30%</span>
          <span @click="handleWavePercent(50)" :class="{'actived': wavePercent === 50}">50%</span>
          <span @click="handleWavePercent(80)" :class="{'actived': wavePercent === 80}">80%</span>
          <span @click="handleWavePercent(100)" :class="{'actived': wavePercent === 100}">100%</span>
        </span>
      </div>

      <div class="bindEmail" v-if="$store.state.app.vipInfo.email">
        <span>{{ $t('vip.bindEmail') }}</span>
        <span @click="handleToUpdataEmail">
          <span>{{ $store.state.app.vipInfo.email }}</span>
          <span class="iconfont icon-huaban21 updata"></span>
        </span>
      </div>

      <div>
        <div class="btn" v-if="$route.name === 'setMarketTip' && !(!lowPrice && !hightPrice && !wavePercent)"
          @click="handleCreateMarketTip">{{ $t('marketTip.create') }}</div>
        <div class="btn bgcolor-999" v-if="$route.name === 'setMarketTip' && (!lowPrice && !hightPrice && !wavePercent)">
          {{ $t('marketTip.create') }}
        </div>

        <div class="btn" v-if="$route.name === 'updataMarketTip' && !(!lowPrice && !hightPrice && !wavePercent)"
          @click="handleUpdataMarketTip">{{ $t('marketTip.save') }}</div>
        <div class="btn bgcolor-999" v-if="$route.name === 'updataMarketTip' && (!lowPrice && !hightPrice && !wavePercent)">
          {{ $t('marketTip.save') }}
        </div>
      </div>

      <div class="surplusTip color-red" v-if="$route.name === 'setMarketTip' && $store.state.app.vipInfo.remainMarketRemindCount === 0">
        {{ $t('marketTip.remainTip1') }}{{ $store.state.app.vipInfo.remainMarketRemindCount || 0 }}{{ $t('marketTip.remainTip2') }}
      </div>
    </div>
    <!-- 提醒条件设置 end -->

    <!-- 已创建提醒 start -->
    <div class="createdTip" v-if="$route.name === 'setMarketTip'">
      <market-tip ref="MarketTip" :symbolId="item.id" @listenHasList="handleHasList" />
    </div>
    <!-- 已创建提醒 end -->

    <!-- 去绑定邮箱提示 start -->
    <mt-popup
      v-model="tipToBindEmail"
      class="popupModel"
      popup-transition="popup-fade">
      <popup-to-bind-email v-if="tipToBindEmail" @listenClose="handleClosePopup" />
    </mt-popup>
    <!-- 去绑定邮箱提示 end -->

    <!-- 波动率解释 start -->
    <mt-popup
      v-model="tipToWave"
      class="popupModel"
      popup-transition="popup-fade">
      <div class="waveDiv">
        <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
        <div class="title">{{ $t('marketTip.wave') }}</div>
        <div class="content">
          <div>{{ $t('marketTip.saveTip1') }}</div>
          <div>{{ $t('marketTip.saveTip2') }}</div>
        </div>
        <div class="btn" @click="handleClosePopup">{{ $t('public.sure') }}</div>
      </div>
    </mt-popup>
    <!-- 波动率解释 end -->
  </div>
</template>

<script>
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
import { Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi';

import PopupToBindEmail from '@/views/more/components/PopupToBindEmail';
import MarketTip from '@/views/more/childView/MarketTip';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      item: {
        amount: 1333.3333,
        chain: 'eos-eos',
        change: 528.1005,
        coinImgUrl: 'https://ndi.340wan.com/eos/newdexissuer-ndx.png',
        contract: 'newdexissuer',
        high: 0.3,
        id: 100,
        low: 0.000567,
        precision: { coin: 4, price: 6 },
        price: 0.3,
        status: 0,
        symbol: 'newdexissuer-ndx-eos',
        symbol1: 'ndx',
        symbol2: 'eos',
        tag: 0,
        volume: 100.567,
      },
      // hasMarketTip: false,
      tipToBindEmail: false, // 去绑定邮箱
      tipToWave: false,
      wavePercent: 0,
      hightPrice: '',
      lowPrice: '',
      maxError: false,
      maxError1: false, // 价格不正确时显示
      minError: false,
      minError1: false, // 价格不正确时显示
      ToUpdataMarket: null, // 修改前的数据
    }
  },
  components: {
    MarketTip,
    PopupToBindEmail,
    mtPopup: Popup,
  },
  watch: {
    ToUpdataMarket(newVal) {
      this.wavePercent = newVal.volatility;
      this.hightPrice = newVal.maxPrice;
      this.lowPrice = newVal.minPrice;
    },
    $route(newVal) {
      if (newVal.name === 'updataMarketTip') {
        const marketData = sessionStorage.getItem('ToUpdataMarket') ? JSON.parse(sessionStorage.getItem('ToUpdataMarket')) : null;
        if (marketData && marketData.symbol === this.$route.params.symbol.toLowerCase()) {
          this.ToUpdataMarket = marketData;
        }
      } else {
        this.wavePercent = 0;
        this.hightPrice = '';
        this.lowPrice = '';
      }
    },
    hightPrice() {
      if (this.hightPrice && Number(this.hightPrice) < this.item.price) {
        this.maxError = true;
        return;
      }
      this.maxError = false;
    },
    lowPrice() {
      if (this.lowPrice && Number(this.lowPrice) > this.item.price) {
        this.minError = true;
        this.minError1 = false;
        return;
      }
      if (this.lowPrice && Number(this.lowPrice) < 0) {
        this.minError = false;
        this.minError1 = true;
        return;
      }
      this.minError = false;
      this.minError1 = false;
    }
  },
  mounted() {
    this.handleSearchSymbol();
    const marketData = sessionStorage.getItem('ToUpdataMarket') ? JSON.parse(sessionStorage.getItem('ToUpdataMarket')) : null;
    if (marketData && marketData.symbol === this.$route.params.symbol.toLowerCase() && this.$route.name === 'updataMarketTip') {
      this.ToUpdataMarket = marketData;
    }
  },
  methods: {
    // 点击价格带入input框
    handleDealPrice() {
      const maxPrice = Decimal.mul(this.item.price, 1.1).toString();
      const minPrice = Decimal.mul(this.item.price, 0.9).toString();
      this.hightPrice = toFixed(maxPrice, this.item.precision.price);
      this.lowPrice = toFixed(minPrice, this.item.precision.price);
    },
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(item, 'coinImgUrl', 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png')
    },
    // 处理最高价
    handleBlurMaxPrice() {
      if (!this.hightPrice) {
        return;
      }
      this.hightPrice = this.handleToFixed(this.hightPrice, this.item.precision.price);
      // this.handleRegMax();
    },
    // 处理最低价
    handleBlurMinPrice() {
      if (!this.lowPrice) {
        return;
      }
      this.lowPrice = this.handleToFixed(this.lowPrice, this.item.precision.price);
      // this.handleRegMin();
    },
    // 验证输入价格
    handleReg() {
      if (this.hightPrice && Number(this.hightPrice) < this.item.price) {
        this.maxError = true;
        return false;
      }
      if (this.lowPrice && Number(this.lowPrice) > this.item.price) {
        this.minError = true;
        this.minError1 = false;
        return false;
      }
      if (this.lowPrice && Number(this.lowPrice) < 0) {
        this.minError = false;
        this.minError1 = true;
        return false;
      }
      this.maxError = false;
      this.minError = false;
      this.minError1 = false;
      return true;
    },
    // handleRegMax() {
    //   if (this.hightPrice && (Number(this.hightPrice) <= 0 || Number(this.hightPrice) < this.item.price)) {
    //     this.maxError = true;
    //     return;
    //   }
    //   this.maxError = false;
    // },
    // handleRegMin() {
    //   if (this.lowPrice && (Number(this.lowPrice) < 0 || Number(this.lowPrice) > this.item.price)) {
    //     this.minError = true;
    //     return;
    //   }
    //   this.minError = false;
    // },
    // 查询交易对信息
    handleSearchSymbol() {
      try {
        const symbol = this.$route.params.symbol;
        const obj = this.$store.state.app.allSymbolData;
        const keys = Object.keys(obj);
        keys.forEach((key) => {
          if (key === 'change') {
            return;
          }
          if (key === 'self') {
            return;
          }
          obj[key].forEach((item) => {
            if (symbol === item.symbol) {
              this.item = item;
            }
          });
        });
      } catch (error) {
        setTimeout(() => {
          this.handleSearchSymbol();
        }, 200);
      }
    },
    // 返回
    handleBack() {
      history.back();
    },
    // 去我的提醒
    handleToMarketTip() {
      this.$router.push({
        name: 'allMarketTip',
      });
    },
    // 波动率帅选
    handleWavePercent(per) {
      if (Number(per) === Number(this.wavePercent)) {
        this.wavePercent = 0;
        return;
      }
      this.wavePercent = Number(per);
    },
    // 去修改邮箱
    handleToUpdataEmail() {
      this.$router.push({
        name: 'updataEmail',
      });
    },
    // 创建行情提醒
    handleCreateMarketTip() {
      if (!this.$store.state.app.vipInfo.email) {
        this.tipToBindEmail = true;
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleCreateMarketTip()
        })
        return;
      }
      if (!this.handleReg()) {
        return;
      }
      const params = {
        symbolId: this.item.id,
        maxPrice: this.hightPrice,
        minPrice: this.lowPrice,
        volatility: this.wavePercent || '',
      }
      this.hightPrice = '';
      this.lowPrice = '';
      this.wavePercent = 0;
      this.$http.post('/account/addMarketRemindRecord', params).then((res) => {
        if (res.code !== 0) {
          // 授权过期处理
          if (res.code === 401) {
            this.$toast({
              message: res.msg,
              position: 'center',
              duration: 2000,
            });
            setTimeout(() => {
              accountToSign(this, () => {
                this.handleCreateMarketTip()
              })
            }, 1000);
            return;
          }
          // 创建上限处理
          if (res.code === 1015) {
            this.$toast({
              message: this.$t('marketTip.createFull'),
              position: 'center',
              duration: 2000,
            });
            return;
          }
          this.$toast({
            message: this.$t('marketTip.createFailed'),
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$toast({
          message: this.$t('marketTip.createSuccess'),
          position: 'center',
          duration: 2000,
        });
        // 创建成功 - 更新已创建提醒列表 & 重制条件
        this.$refs.MarketTip.handleGetMArketTipList();
        const newVipInfo = this.$store.state.app.vipInfo;
        newVipInfo.remainMarketRemindCount -= 1;
        this.$store.dispatch('setVipInfo', newVipInfo);
        this.hightPrice = '';
        this.lowPrice = '';
        this.wavePercent = 0;
      });
    },
    // 更新行情提醒条件
    handleUpdataMarketTip() {
      try {
        if (!this.$store.state.app.vipInfo.email) {
          this.tipToBindEmail = true;
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
          accountToSign(this, () => {
            this.handleUpdataMarketTip()
          })
          return;
        }
        if (!this.handleReg()) {
          return;
        }
        const params = {
          id: this.ToUpdataMarket.id,
          symbolId: this.item.id,
          maxPrice: this.hightPrice,
          minPrice: this.lowPrice,
          volatility: this.wavePercent || '',
        }
        this.$http.post('/account/modMarketRemindRecord', params).then((res) => {
          if (res.code !== 0) {
            // 授权过期处理
            if (res.code === 401) {
              this.$toast({
                message: res.msg,
                position: 'center',
                duration: 2000,
              });
              setTimeout(() => {
                accountToSign(this, () => {
                  this.handleUpdataMarketTip()
                })
              }, 1000);
              return;
            }
            this.$toast({
              message: this.$t('marketTip.updataFailed'),
              position: 'center',
              duration: 2000,
            });
            return;
          }
          // 保存成功 - 跳转回上一页面 & 重制条件
          this.hightPrice = '';
          this.lowPrice = '';
          this.wavePercent = 0;
          this.$toast({
            message: this.$t('marketTip.updataSuccess'),
            position: 'center',
            duration: 2000,
          });
          this.handleBack();
        });
      } catch (error) {
        setTimeout(() => {
          this.handleUpdataMarketTip()
        }, 200);
      }
    },
    // 数字截取 - 保留小数
    handleToFixed(num, p) {
      return toFixed(num, p);
    },
    // 计算汇率估值
    handleRate(num, rate, len) {
      const newNum = Decimal.mul(num, rate || 0).toString();
      let l = len;
      if (newNum >= 0.1) {
        l = 2;
      } else if (len >= 4 && this.$store.state.app.language === 'zh-CN') {
        l = len - 2;
      } else if (len >= 4 && this.$store.state.app.language !== 'zh-CN') {
        l = len - 1;
      }
      const t = Decimal(`1e${l}`);
      let tNum = Decimal.mul(newNum, t);
      tNum = Decimal.round(tNum);
      tNum = Decimal.div(tNum, t);
      return toFixed(tNum, l);
    },
    // 计算涨跌幅
    handleChange(num, len) {
      const newNum = Decimal.mul(num, 100);
      return toFixed(newNum, len)
    },
    // 去会员说明页面
    handleToVipNotes() {
      this.$router.push({
        name: 'vipNotes',
        params: {
          type: 'market'
        }
      });
    },
    // 关闭弹窗
    handleClosePopup() {
      this.tipToBindEmail = false;
      this.tipToWave = false;
    },
    // 获取组件传递参数
    handleHasList() {
      this.handleGetAccountInfo();
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        }
        this.$http.post('/account/getAccountInfo', params).then((res) => {
          if (res.code === 1007) {
            const initVipInfo = this.$store.state.sys.initVipInfo;
            initVipInfo.account = this.$store.state.app.accountInfo.account;
            initVipInfo.chain = this.$store.state.app.accountInfo.chain;
            this.$store.dispatch('setVipInfo', initVipInfo);
            return;
          }
          if (res.code !== 0) {
            return;
          }
          this.$store.dispatch('setVipInfo', res.accountInfo);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.setMarketDiv{
  font-size: .3rem;

  // 工具栏样式
  .tools{
    padding: .2rem .24rem;
    background: #FFF;
    position: relative;
    text-align: center;

    .back{
      position: absolute;
      height: 100%;
      width: .7rem;
      line-height: .9rem;
      text-align: left;
      top: 50%;
      left: .24rem;
      transform: translate(0px, -50%);
      font-size: .3rem;
    }

    .title{
      font-size: .36rem;
    }

    .myMarketTip{
      position: absolute;
      top: 50%;
      right: .24rem;
      transform: translate(0px, -50%);
      font-size: .25rem;
    }
  }

  // 交易对样式
  .itemData{
    margin: .12rem 0px;
    height: 1.3rem;
    border-bottom: 1px solid $color-e3e3e3;
    display: flex;
    align-items: center;/*垂直居中*/
    padding: 0px .15rem;
    font-size: .32rem;
    background: #FFF;

    &>div{
      flex: 1;
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

  // 提醒条件设置
  .condition{
    background: #ffffff;
    padding: .36rem .38rem;

    .settingDiv{
      margin-bottom: .72rem;
      display: flex;
      position: relative;

      .error{
        position: absolute;
        color: $color-red;
        bottom:  -.32rem;
        font-size: .21rem;
      }

      &>span:first-child{
        flex: 2;
        white-space: nowrap;

        &.span-EN{
          margin-right: .1rem;
        }

        .what{
          font-size: .3rem;
          color: $color-999;
        }
      }

      &>span:nth-child(2){
        flex: 7;
        position: relative;
        border-bottom: 1px solid $color-e3e3e3;
        padding-bottom: 1px;

        .input{
          position: relative;
          width: 100%;
          height: calc(100% - 1px);
          font-size: .27rem;
        }

        .symbol2Name{
          position: absolute;
          right: 0px;
          top: 50%;
          padding-left: .08rem;
          color: $color-999;
          transform: translateY(-50%);
          background: #FFF;
        }
      }

      .wave{
        display: flex;
        border-bottom: 0px !important;
        flex-wrap: wrap;
        justify-content: space-between;

        &>span{
          flex: 3;
          min-width: 1.45rem;
          max-width: 1.45rem;
          text-align: center;
          border-radius: .08rem;
          height: .56rem;
          border: 1px solid $color-e3e3e3;
          display: flex;
          align-items: center;
          justify-content: center;
          // margin-right: .36rem;

          &.actived{
            border: 1px solid $color-this;
            color: $color-this;
          }

          // &:nth-child(3n){
          //   margin-right: 0rem;
          // }
          &:nth-child(n + 4){
            margin-top: .24rem;
          }
        }
      }
    }

    .bindEmail{
      font-size: .25rem;

      &>span:first-child{
        color: $color-999;
      }
      &>span:last-child{
        color: $color-this;
        float: right;
      }

      .updata{
        font-size: .25rem;
      }
    }

    .btn{
      background: $color-this;
      border-radius: .1rem;
      height: .84rem;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .2rem;
      margin-top: .36rem;

      &.bgcolor-999{
        background: $color-999;
      }
    }

    .surplusTip{
      font-size: .25rem;
      color: $color-999;
    }
  }

  // 会员说明样式
  .createdTip{

    .vipNotes{
      float: right;
      margin-top: .1rem;
      font-size: .25rem;
      color: #8B572A;
      padding-right: .24rem;
    }
  }

  // 弹窗样式
  .popupModel{
    background: transparent;

    .waveDiv{
      background: #FFF;
      border-radius: .1rem;
      width: 6rem;
      text-align: center;
      padding: .36rem;
      box-sizing: border-box;
      position: relative;

      .popupClose{
        position: absolute;
        right: .2rem;
        top: .2rem;
        color: $color-999;
        font-size: .25rem;
      }

      .title{
        color: $color-this;
        font-size: .36rem;
      }

      .content{
        font-size: .28rem;
        margin: .25rem 0px .4rem 0px;
      }

      .btn{
        background: $color-this;
        color: #FFF;
        font-size: .27rem;
        width: 4.27rem;
        height: .8rem;
        margin: auto;
        border-radius: .1rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

</style>
