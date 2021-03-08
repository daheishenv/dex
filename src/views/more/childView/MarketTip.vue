<template>
  <!-- 行情提醒页面 -->
  <div class="marketTip">
    <!-- 头部工具 start -->
    <div class="tools" v-if="$route.name === 'marketTip' || $route.name === 'allMarketTip' ">
      <span class="iconfont icon-huaban25 back" @click="handleBack"></span>
      <span class="title" v-if="$route.name === 'marketTip'">{{ $t('marketTip.marketTip') }}</span>
      <span class="title" v-if="$route.name === 'allMarketTip'">{{ $t('marketTip.myTip') }}</span>
      <span class="myMarketTip" v-if="marketRemindRecordList.length" @click="handleShowPopup()">{{ $t('marketTip.removeAll') }}</span>
    </div>

    <div class="subTitle" v-if="$route.name === 'setMarketTip' && marketRemindRecordList.length">
      <span>{{ $t('marketTip.createdTip') }}</span>
      <span class="removeAll" @click="handleShowPopup()">{{ $t('marketTip.removeAll') }}</span>
    </div>
    <!-- 头部工具 end -->

    <!-- 剩余可开启交易对 start -->
    <!-- <div class="topTip" v-if="$route.name === 'marketTip' || $route.name === 'allMarketTip'" @click="handleToVipNotes">
      <span>{{ $t('marketTip.remainTip1') }}{{ $store.state.app.vipInfo.remainMarketRemindCount }}{{ $t('marketTip.remainTip2') }}</span>
    </div> -->
    <!-- 剩余可开启交易对 end -->

    <!-- 暂无开启行情提醒的交易对 start -->
    <div class="noOpenSymbol" v-if="!marketRemindRecordList.length && ($route.name === 'marketTip' || $route.name === 'allMarketTip')">
      <div class="imgDiv">
        <img v-if="$store.state.app.language === 'zh-CN'" src="/static/img/more/marketTip-CN.png" alt="">
        <img v-if="$store.state.app.language === 'zh-TW'" src="/static/img/more/marketTip-TW.png" alt="">
        <img v-if="$store.state.app.language === 'en'" src="/static/img/more/marketTip-EN.png" alt="">
        <img v-if="$store.state.app.language === 'ko'" src="/static/img/more/marketTip-KO.png" alt="">
      </div>
      <div class="toAddSymbolDiv">
        <div class="toAddSymbolTip">{{ $t('marketTip.noData') }}</div>
        <div class="actionToAddSymbol" @click="handleToMarket">{{ $t('marketTip.chooseSymbol') }}></div>
      </div>
    </div>
    <!-- 暂无开启行情提醒的交易对 end -->

    <!-- 开启中对行情提醒交易对 start -->
    <div class="openSymnolList" v-if="marketRemindRecordList.length">
      <div class="item" v-for="(item, $index) in marketRemindRecordList" :key="$index">
        <div class="itemTop">
          <span class="itemSymbolInfo">
            <img class="coinImg" :src="item.imageUrl" alt="">
            <span class="symbolName">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
          </span>
          <span class="itemAction">
            <!-- <span class="noTipTimes">今日提醒次数已用完</span> -->
            <span class="removeItem" @click="handleRemove(item)">{{ $t('marketTip.remove') }}</span>
          </span>
        </div>
        <div class="itemContent" @click="handleToUpdataMarket(item)">
          <div class="itemContentLeft">
            <div><span>{{ $t('marketTip.maxPrice') }}：</span><span>{{ item.maxPriceStr ? item.maxPriceStr : '—'}}</span></div>
            <div><span>{{ $t('marketTip.minPrice') }}：</span><span>{{ item.minPriceStr ? item.minPriceStr : '—' }}</span></div>
            <div><span>{{ $t('marketTip.wave') }}：</span><span>{{ item.volatility ? `${item.volatility}%` : '—' }}</span></div>
          </div>
          <div class="itemContentRight" v-if="$route.name === 'marketTip' || $route.name === 'allMarketTip'">
            <span class="iconfont icon-huaban11 right"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 开启中对行情提醒交易对 end -->

    <!-- 会员说明 start -->
    <div class="fr vipNotes" @click="handleToVipNotes" v-if="marketRemindRecordList.length || $route.name === 'setMarketTip'">
      <!-- <span v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos'">{{ $t('more.vipDetail') }}></span> -->
    </div>
    <!-- 会员说明 end -->

    <!-- 确认移除 start -->
    <mt-popup
      class="showRemovePopup"
      popup-transition="popup-fade"
      v-model="showRemovePopup">
      <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
      <div class="popTitle">{{ $t('public.tip') }}</div>
      <div class="popTip" v-if="removeAll">{{ $t('marketTip.isRemoveAll') }}</div>
      <div class="popTip" v-if="!removeAll">{{ $t('marketTip.isRemove') }}</div>
      <div class="btn" @click="handleRemoveAll">{{ $t('marketTip.remove') }}</div>
    </mt-popup>
    <!-- 确认移除 end -->
  </div>
</template>

<script>
// import { toFixed } from '@/utils/public';
// import { Decimal } from 'decimal.js';
import { Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi';
import { dealSymbolSplit } from '@/utils/public';

export default {
  data() {
    return {
      noData: false, // 无数据 ？ true - 无数据 | false - 有数据
      showRemovePopup: false, // 显示移除确认提示
      marketRemindRecordList: [], // 用户行情提醒列表
      removeId: null,
      removeAll: false,
      symbolId: null,
    }
  },
  components: {
    mtPopup: Popup,
  },
  mounted() {
    this.handleGetMArketTipList();
  },
  methods: {
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
              this.symbolId = item.id;
            }
          });
        });
      } catch (error) {
        setTimeout(() => {
          this.handleSearchSymbol();
        }, 200);
      }
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
    // 返回
    handleBack() {
      history.back();
    },
    // 关闭弹窗
    handleClose() {
      this.showRemovePopup = false;
    },
    // 去选择交易对
    handleToMarket() {
      this.$router.push({
        name: 'market'
      })
    },
    // 显示移除确认弹窗
    handleShowPopup(item) {
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleShowPopup(item)
        })
        return;
      }
      if (item) {
        this.removeId = item.id;
        this.removeAll = false;
      } else {
        this.removeAll = true;
        this.removeId = null;
      }
      this.showRemovePopup = true;
    },
    // 全部移除
    handleRemoveAll() {
      this.showRemovePopup = false;
      const params = {
        symbolId: this.symbolId || '',
      }
      this.$http.post('/account/delAllMarketRemindRecord', params).then((res) => {
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
                this.handleRemoveAll()
              })
            }, 1000);
            return;
          }
          this.$toast({
            message: this.$t('marketTip.removeFailed'),
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$toast({
          message: this.$t('marketTip.removed'),
          position: 'center',
          duration: 2000,
        });
        this.handleGetAccountInfo();
        this.handleGetMArketTipList();
      });
    },
    // 确认移除
    handleRemove(item) {
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleRemove(item)
        })
        return;
      }
      // 删除单个
      this.removeId = item.id;
      const params = {
        id: this.removeId
      };
      this.$http.post('/account/delMarketRemindRecord', params).then((res) => {
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
                this.handleRemove()
              })
            }, 1000);
            return;
          }
          this.$toast({
            message: this.$t('marketTip.removeFailed'),
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.$toast({
          message: this.$t('marketTip.removed'),
          position: 'center',
          duration: 2000,
        });
        const newVipInfo = this.$store.state.app.vipInfo;
        newVipInfo.remainMarketRemindCount += 1;
        this.$store.dispatch('setVipInfo', newVipInfo);
        this.handleGetMArketTipList();
      });
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
    // 获取行情提醒列表
    handleGetMArketTipList() {
      try {
        if (this.$route.params.symbol) {
          this.handleSearchSymbol()
        }
        const params = {
          symbolId: this.symbolId,
        }
        if (this.$store.state.app.accountInfo.account) {
          this.$http.post('/account/queryMarketRemindRecord', params).then((res) => {
            if (res.code === 1007) {
              this.$emit('listenHasList', true);
              this.marketRemindRecordList = [];
              return;
            }
            if (res.code !== 0) {
              this.$toast({
                message: res.msg,
                position: 'center',
                duration: 2000,
              });
              return;
            }
            this.$emit('listenHasList', true);
            const list = res.marketRemindRecordList;
            list.forEach((item) => {
              const obj = dealSymbolSplit(item.symbol, item.baseChain, item.valuationCoinContract, item.contract, this.$embed);
              this.$set(item, 'coinImgUrl', obj.coinUrl);
              this.$set(item, 'symbol1', obj.symbol1.toUpperCase());
              this.$set(item, 'symbol2', obj.symbol2.toUpperCase());
            });
            this.marketRemindRecordList = res.marketRemindRecordList;
          });
        }
      } catch (error) {
        setTimeout(() => {
          this.handleGetMArketTipList()
        }, 200);
      }
    },
    // 去更新行情提醒条件
    handleToUpdataMarket(item) {
      if (this.$route.name === 'setMarketTip') {
        return;
      }
      sessionStorage.setItem('ToUpdataMarket', JSON.stringify(item));
      this.$router.push({
        name: 'updataMarketTip',
        params: {
          symbol: item.symbol,
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.marketTip{
  // min-height: 100vh;
  // background: #FFF;
  font-size: .32rem;

  // 工具栏样式
  .tools{
    padding: .2rem .24rem;
    background: #FFF;
    position: relative;
    text-align: center;

    .back{
      position: absolute;
      top: 50%;
      height: 100%;
      width: .7rem;
      line-height: .9rem;
      text-align: left;
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

  .subTitle{
    font-size: .25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: .72rem;
    padding: 0px .26rem;

    .removeAll{
      color: $color-this;
    }
  }

  // 剩余可开启行情提醒样式
  .topTip{
    font-size: .25rem;
    height: .7rem;
    color: #4A90E2;
    background: #E9F2FF;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 无行情提醒样式
  .noOpenSymbol{
    margin-top: 1.28rem;

    .imgDiv{
      height: 2.77rem;
      width: 3.44rem;
      margin: auto;

      img{
        width: 100%;
      }
    }

    .toAddSymbolDiv{
      text-align: center;
      margin-top: .35rem;

      .toAddSymbolTip{
        font-size: .25rem;
        margin-bottom: .21rem;
      }

      .actionToAddSymbol{
        color: #4A90E2;
      }
    }
  }

  // 行情提醒列表
  .openSymnolList{
    padding-top: .1rem;

    .item{
      position: relative;
      padding: .24rem;
      background: #FFF;
      margin-bottom: .12rem;

      .itemTop{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .itemSymbolInfo{
          display: flex;
          align-items: center;

          .coinImg{
            width: .4rem;
            margin: 0px .08rem;
            border-radius: 50px;
          }
        }

        .itemAction{
          display: flex;
          align-items: center;

          .noTipTimes{
            font-size: .25rem;
            color: $color-red;
            margin-right: .1rem;
          }

          .removeItem{
            border: 1px solid #4A90E2;
            border-radius: .12rem;
            font-size: .25rem;
            padding: .06rem .16rem;
            color: #4A90E2;
          }
        }
      }

      .itemContent{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .27rem;
        margin-top: .2rem;

        .itemContentLeft{
          padding-left: .54rem;

          &>div{
            margin: .08rem 0px;
          }
        }

        .itemContentRight{
          text-align: center;
          width: .8rem;

          .right{
            font-size: .3rem;
            color: $color-this;
          }
        }
      }
    }
  }

  // 会员说明样式
  .vipNotes{
    float: right;
    margin-top: .1rem;
    font-size: .25rem;
    color: #8B572A;
    padding-right: .24rem;
  }

  // 提示框样式
  .showRemovePopup{
    width: 6rem;
    // height: 3.13rem;
    border-radius: .08rem;
    text-align: center;
    padding: .37rem;
    box-sizing: border-box;

    .close{
      font-size: .2rem;
      position: absolute;
      right: .24rem;
      top: .24rem;
      color: $color-333;
    }

    .popTitle{
      color: $color-this;
    }

    .popTip{
      font-size: .28rem;
      margin: .25rem 0px .4rem 0px;
    }

    .btn{
      font-size: .27rem;
      color: #fff;
      background: $color-this;
      height: .8rem;
      width: 4.27rem;
      border-radius: .08rem;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
