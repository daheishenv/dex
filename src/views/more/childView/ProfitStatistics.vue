<template>
  <div class="profit" @click="select = false">
    <div class="tools" :class="{'isScroll': isScroll > 0}">
      <!-- <span @click="handleBack" class="iconfont icon-huaban25 back"></span>
      <span class="title">{{ $t('profit.profit') }}</span>
      <span class="sort" @click="handleChangeSortType">
        <span>{{ $t('profit.profitShort') }}</span>
        <span class="icon">
          <span :class="{'checked': type === 2}"></span>
          <span :class="{'checked': type === 1}"></span>
        </span>
      </span> -->

      <div class="toolLeft">
        <div class="choose" @click.stop="select = !select">
          <!-- 筛选 start -->
          <div class="selectMenu" v-if="select">
            <div class="select color-333">
              <div  v-if="status !== 0" @click.stop="handleSelected(0)">
                {{ $t('profit.notSmall') }}
              </div>
              <div v-if="status !== 1" @click.stop="handleSelected(1)">
                {{ $t('order.all') }}
              </div>
            </div>
          </div>
          <!-- 筛选 end -->
          <span>
            <span v-if="status === 0">{{ $t('profit.notSmall') }}</span>
            <span v-if="status === 1">{{ $t('order.all') }}</span>
          </span>
          <span class="down"></span>
        </div>
        <div class="questionDiv" @click="showTip = true">
          <span class="iconfont icon-huaban31 question"></span>
        </div>
      </div>
      <div>
        <span class="sort" @click="handleChangeSortType">
          <span>{{ $t('profit.profitShort') }}</span>
          <span class="icon">
            <span :class="{'checked': type === 2}"></span>
            <span :class="{'checked': type === 1}"></span>
          </span>
        </span>
      </div>
    </div>

    <div class="list">
      <div class="noData" v-if="list.length === 0">
        <div>
          <img width="100%" v-if="$store.state.app.language === 'zh-CN'" src="/static/img/more/hold.png" alt="">
          <img width="100%" v-if="$store.state.app.language === 'zh-TW'" src="/static/img/more/hold-tw.png" alt="">
          <img width="100%" v-if="$store.state.app.language === 'en'" src="/static/img/more/hold-en.png" alt="">
          <img width="100%" v-if="$store.state.app.language === 'ko'" src="/static/img/more/hold-ko.png" alt="">
        </div>
        <div class="noDataTip">{{ $t('profit.noData') }}</div>
        <div class="toTrade" @click="handleToTrade">{{ $t('property.toTransaction') }}></div>
      </div>

      <!-- 列表 start -->
      <div class="item" v-for="(item, $index) in list" :key="$index" @click="handleShowPopup(item)">
        <div class="top">
          <div class="name">
            <img :src="item.coinImgUrl" :onerror="errorCoinImg" alt="">
            <span class="symbol" @click.stop="handleToKline(item)"
              >{{ `${item.symbol1.toUpperCase()}/${item.symbol2.toUpperCase()}` }}</span>
          </div>
        </div>

        <div class="bottom">
          <div class="left">
            <div class="itemTitle">
              {{ $t('profit.costPrice') }}<span class="coin">({{item.symbol2.toUpperCase()}})</span>
            </div>
            <div class="data">
              <span>{{ item.costPrice || '—' }}</span>
              <span v-if="Number(item.balance) !== 0" class="updata" @click.stop="handleShowChangePopup(item)">
                {{ $t('profit.change') }}
              </span>
            </div>
            <div class="itemTitle">
              {{ $t('profit.newPrice') }}<span class="coin">({{item.symbol2.toUpperCase()}})</span>
            </div>
            <div class="data">{{ item.realTimePrice }}</div>
          </div>
          <div class="right">
            <div class="itemTitle">
              {{ $t('profit.profitShort') }}<span class="coin">({{item.symbol2.toUpperCase()}})</span>
            </div>
            <div class="data">
              <span :class="{'color-green': item.profit > 0,'color-red': item.profit < 0}">
                <span v-if="item.profit !== '--'"><span v-if="item.profit > 0"
                  >+</span><span>{{ item.profit }}</span>
                </span>
                <span v-else>{{ item.profit }}</span>
              </span>
            </div>
            <div class="itemTitle">
              {{ $t('profit.balance') }}<span class="coin">({{item.symbol1.toUpperCase()}})</span>
            </div>
            <div class="data">{{ item.balance }}</div>
          </div>
        </div>
      </div>
      <!-- 列表 end -->

      <mt-popup
        class="showHold"
        popup-transition="popup-fade"
        v-model="showHold">
        <PopupToChandeHold v-if="showHold" :chooseItem="chooseItem"
          @listenClose="handleClose" @listenChangeData="handleChangeData"/>
      </mt-popup>

      <!-- 弹窗提示说明 -->
      <mt-popup
        class="showHold"
        popup-transition="popup-fade"
        v-model="showTip">
        <PopupProfitTip v-if="showTip" @listenClose="handleClose"/>
      </mt-popup>
    </div>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { toFixed, dealSymbolSplit } from '@/utils/public';
// import { Decimal } from 'decimal.js';
import { accountToSign } from '@/utils/publicApi';

import PopupToChandeHold from '../components/PopupToChandeHold'
import PopupProfitTip from '../components/PopupProfitTip'

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      list: [],
      chooseItem: {},
      showHold: false,
      type: 1,
      status: 0,
      select: false,
      isScroll: 0, // 页面滚动距离
      showTip: false,
      aboutPrice: 0.01, // 非小额设置
      aboutProfit: 0.1, // 非小额设置
      allList: [],
    }
  },
  components: {
    PopupToChandeHold,
    PopupProfitTip,
    mtPopup: Popup,
  },
  watch: {
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/')
      return;
    }
    this.handleGetList();
    document.addEventListener('scroll', this.listenScroll, false);
  },
  methods: {
    // 页面滚动位置
    listenScroll() {
      this.isScroll = document.scrollingElement.scrollTop / ((screen.width / 750) * 100);
    },
    // 筛选
    handleSelected(index) {
      this.status = index;
      this.select = false;
      this.handleStatus();
    },
    // 切换显示类型 - 0: 非小额 | 1: 全部
    handleStatus() {
      if (this.status === 0) {
        const arr = [];
        this.allList.forEach((item) => {
          if (item.balanceEosValuation >= this.aboutPrice || Math.abs(item.profit) > this.aboutProfit) {
            arr.push(item);
          }
        });
        this.list = arr;
        return;
      }
      this.list = this.allList;
    },
    // 跳转到交易对
    handleToKline(item) {
      sessionStorage.setItem('backRoute', this.$route.path);
      const params = {
        symbol: item.symbol,
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 数字格式华
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    // 返回
    handleBack() {
      history.back();
    },
    // 去交易
    handleToTrade() {
      this.$router.push({
        name: 'market'
      })
    },
    // 显示弹窗
    handleShowPopup(item) {
      this.showHold = true;
      this.chooseItem = item;
      this.chooseItem.changeType = false;
    },
    // 显示弹窗 - 修改状态
    handleShowChangePopup(item) {
      this.showHold = true;
      this.chooseItem = item;
      this.chooseItem.changeType = true;
    },
    // 关闭弹窗
    handleClose() {
      this.showHold = false;
      this.showTip = false;
    },
    // 数据改变 - 或者外部重新请求接口
    handleChangeData(data) {
      this.list.forEach((item) => {
        if (item.id === data.id) {
          this.$set(item, 'costPrice', data.costPrice);
        }
      });
    },
    // 切换排序
    handleChangeSortType() {
      const params = {
        orderByName: 'profit',
        orderByType: '',
      }
      if (this.type === 2) {
        this.type = 1;
        params.orderByType = 'desc';
      } else if (this.type === 1) {
        this.type = 2;
        params.orderByType = 'asc';
      }
      // else {
      //   this.type = 0;
      //   params.orderByName = 'balance';
      //   params.orderByType = 'desc';
      // }
      this.handleGetList(params);
    },
    // 获取盈亏统计列表
    handleGetList(data) {
      let params = {
        orderByName: 'profit',
        orderByType: '',
      };
      if (data) {
        params = data;
      } else if (this.type === 1) {
        params.orderByType = 'desc';
      } else {
        params.orderByType = 'asc';
      }
      // const params = data || {
      //   orderByName: 'balance',
      //   orderByType: 'desc',
      // }
      this.$http.get('/exchangeAccountProfit/queryAccountProfits', { params }).then((res) => {
        if (res.code === 401) {
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleGetList(data)
            });
          }, 300);
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
        const list = res.accountProfitVoList || [];
        list.forEach((item) => {
          const chainArr = item.chain.split('-');
          const obj = dealSymbolSplit(item.symbol, chainArr[0]);
          this.$set(item, 'contract', obj.contract); // 合约号
          this.$set(item, 'symbol1', obj.symbol1);
          this.$set(item, 'symbol2', obj.symbol2);
          this.$set(item, 'coinImgUrl', obj.coinUrl)
        });
        this.list = list;
        this.allList = JSON.parse(JSON.stringify(list)); // 浅拷贝
        this.handleStatus();
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.profit{
  font-size: .25rem;
  position: relative;

  .tools{
    position: fixed;
    display: flex;
    justify-content: space-between;
    height: .628rem;
    padding: 0px .3rem;
    align-items: center;
    width: 7.5rem;
    max-width: 750px;
    box-sizing: border-box;
    background: #fafafa;
    top: 0px;

    &.isScroll{
      box-shadow: 0px 0px .05rem $color-input;
    }

    .back{
      font-size: .3rem;
      position: absolute;
      left: .3rem;
      height: .9rem;
      width: .5rem;
      display: flex;
      align-items: center;
    }

    .title{
      font-size: .36rem;
    }

    .toolLeft{
      display: flex;
      align-items: center;

      .questionDiv{
        margin-left: .4rem;
        height: .5rem;
        width: .5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .question{
          font-size: .3rem;
          color: $color-999;
        }
      }
    }

    .choose{
      position: relative;

      .down{
        content: '';
        position: absolute;
        border: .08rem solid transparent;
        border-top: .08rem solid $color-333;
        right: 0rem;
        top: 50%;
        transform: translate(140%, -20%)
      }

      .selectMenu{
        background: white;
        box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
        width: 2.4rem;
        position: absolute;
        left: 0rem;
        top: .55rem;
        border-radius: .13rem;
        padding: 0rem .33rem;
        text-align: center;
        box-sizing: border-box;
        z-index: 1000;

        &::after{
          content: '';
          border: .1rem solid white;
          position: absolute;
          top: -.1rem;
          left: .55rem;
          // right: .8rem;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          transform: rotate(45deg);
        }

        .select{
          position: relative;
          z-index: 10;;
          background: #FFF;
          font-size: .25rem;
          border-radius: .13rem;

          &>div{
            // line-height: .86rem;
            height: .86rem;
            border-bottom: 1px solid $color-e3e3e3;
            display: flex;
            justify-content: center;
            align-items: center;

            &:last-child{
              border-bottom: 0px solid $color-e3e3e3;
            }
          }
        }
      }
    }

    .sort{
      // position: absolute;
      right: .3rem;
      display: flex;
      align-items: center;/*垂直居中*/

      .icon{
        margin-left: .08rem;

        &>span:first-child{
          display: block;
          border: .07rem solid transparent;
          border-bottom:  .11rem solid $color-999;

          &.checked{
            border-bottom:  .11rem solid $color-this;
          }
        }
        &>span:last-child{
          margin-top: .04rem;
          display: block;
          border: .07rem solid transparent;
          border-top:  .11rem solid $color-999;

          &.checked{
            border-top:  .11rem solid $color-this;
          }
        }
      }
    }
  }

  .list{
    padding-top: .5rem;

    .noData{
      padding-top: 1.2rem;
      margin: auto;
      text-align: center;

      img{
        width: 3.48rem;
        height: 2.77rem;
      }

      .noDataTip{
        color: $color-999;
        margin-top: .35rem;
        margin-bottom: .21rem;
      }

      .toTrade{
        font-size: .32rem;
        color: $color-this;
      }
    }

    .item{
      background: #FFF;
      margin-top: .12rem;
      padding: .21rem .24rem .13rem;

      .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .2rem;

        .name{
          display: flex;
          align-items: center;
          flex: 10;

          img{
            width: .4rem;
          }
          .symbol{
            font-size: .3rem;
            margin-left: .04rem;
            margin-right: .08rem;
          }
          .detail{
            font-size: .27rem;
            position: relative;

            .showDetail{
              position: absolute;
              width: 2.8rem;
              background: #F3F3F3;
              transform: translate(-50%, .32rem);
              padding: .2rem;
              top: .08rem;
              border-radius: .04rem;

              &::before{
                content: '';
                position: absolute;
                border: 10px solid #F3F3F3;
                top: -.04rem;
                left: 51%;
                transform: rotate(-45deg);
              }
            }
          }
        }
        .count{
          flex: 8;
          display: flex;
          align-items: center;
          // padding-right: .3rem;

          // .percent{
          //   margin-left: .1rem;
          // }

          // &>span{
          //   white-space:nowrap;
          // }

          .wrap{
            white-space:nowrap;
          }
        }
      }
      .bottom{
        display: flex;
        justify-content: space-between;
        margin-left: .44rem;

        &>div{
          flex: 10;

          .itemTitle{
            color: $color-999;
            margin-bottom: .08rem;

            .coin{
              font-size: .21rem;
            }
          }
          .data{
            font-size: .3rem;
            display: flex;
            align-items: center;
            margin-bottom: .15rem;

            .updata{
              font-size: .25rem;
              color: $color-this;
              margin-left: .12rem;
            }
          }
        }
        // .left{
        // }
        .right{
          flex: 8;
        }
      }
    }
  }
}
.showHold{
  background: transparent;
}
</style>
