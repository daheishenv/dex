<template>
  <div class="list">
    <!-- <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"> -->
      <!-- 加载中 -->
      <div class="loading" v-if="loading">
        <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
      </div>

      <template v-for="(item, $index) in dataList">
        <div class="item" v-if="dataList.length" :key="$index" @click="handleGoToDetail(item)">
          <!-- title -->
          <div class="itemTitle">
            <!-- 交易对 -->
            <div class="symbol">
              <span class="color-red" v-if="item.direction === 2">{{ $t('public.sellShort') }}</span>
              <span class="color-green" v-if="item.direction === 1">{{ $t('public.buyShort') }}</span>
              <span class="coin">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
              <span class="time tip">{{ item.localTime }}</span>
              <!-- 聚合交易币种 -->
              <!-- <img v-if="item.aggOid"
                src="@/assets/img/more/swap.png"
                class="swapIcon" alt=""> -->
            </div>

            <!-- status -->
            <div class="status">
              <span v-if="item.orderStatus === 0" class="color-333">
                <button class="btn" @click="handleCancelOrder(item)">{{ $t('public.revoke') }}</button>
              </span>
              <span v-if="item.dealStatus === 0 && item.orderStatus === 2">{{ $t('order.status3') }}</span>
              <span v-if="item.dealStatus === 1 && item.orderStatus === 2"
                :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">
                {{ $t('order.status4') }}<span class="iconfont icon-huaban11" style="font-size: .25rem;"></span>
              </span>
              <span v-if="item.dealStatus === 2"
                :class="{'color-green': item.direction === 1,'color-red': item.direction === 2}">
                {{ $t('order.status2') }}<span class="iconfont icon-huaban11" style="font-size: .25rem;"></span>
              </span>
            </div>
          </div>

          <!-- showContent -->
          <div class="showContent">
            <div class="txLeft textLeft">
              <div class="tip">{{ $t('public.myPrice') }}
                <span class="tradeCoin">({{ item.symbol2 }})</span>
              </div>
              <div class="num" v-if="item.type === 1">{{ item.orderPriceStr }}</div>
              <div class="num" v-if="item.type === 2">{{ $t('quotation.market') }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('public.count') }}
                <span class="tradeCoin">({{ item.symbol1 }})</span>
              </div>
              <div class="num">{{ item.orderCountStr || '—' }}</div>
            </div>
            <div class="">
              <div class="tip">
                <span class="pointDiv">
                  <span class="point" v-if="!item.readStatus && item.dealStatus !== 0"></span>
                  {{ $t('public.dealCount') }}
                  <span class="tradeCoin">({{ item.symbol1 }})</span>
                </span>
              </div>
              <div class="num">{{ item.dealCountStr || '—' }}</div>
            </div>
          </div>
          <div class="showContent" style="margin-top: .2rem;" v-if="item.dealStatus !== 0">
            <div class="txLeft textLeft">
              <div class="tip">
                {{ $t('public.dealAveragePrice') }}
                <span class="tradeCoin">({{ item.symbol2 }})</span>
              </div>
              <div class="num">{{ item.dealPriceStr }}</div>
            </div>
            <div class="">
              <div class="tip">
                {{ $t('order.orderTotal') }}
                <span class="tradeCoin">({{ item.symbol2 }})</span>
              </div>
              <div class="num">{{ item.orderAmountStr || '—' }}</div>
            </div>
            <div class="">
              <div class="tip">{{ $t('order.dealTotal') }}
                <span class="tradeCoin">({{ item.symbol2 }})</span>
              </div>
              <div class="num">{{ item.dealAmountStr || '—' }}</div>
            </div>
            <div class="" v-if="false">
              <div class="tip">
                {{ $t('public.charge') }}
                <span class="tradeCoin">({{ item.direction === 1 ? item.symbol1 : item.symbol2}})</span>
              </div>
              <div class="num" v-if="item.direction === 1">{{ item.totalChargeStr || '—' }}</div>
              <div class="num" v-if="item.direction === 2">{{ item.totalChargeStr || '—' }}</div>
            </div>
          </div>

        </div>
      </template>

      <!-- 没有更多 -->
      <div class="noData" v-if="dataList.length <= showListLength && dataList.length !== 0 && allLoaded">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>

      <!-- 查看更多 -->
      <div class="noData" v-if="dataList.length === showListLength && !allLoaded">
        <div class="noTip color-this" @click="handleTomore()">{{ $t('index.more') }}</div>
      </div>

      <!-- 没有数据 -->
      <div class="noData" v-if="!dataList.length && !loading">
        <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div class="noTip color-999">{{ $t('order.nearThreeMonthNoData') }}</div>
      </div>

    <!-- </mt-loadmore> -->
  </div>
</template>

<script>
import { toLocalTime, dealSymbolSplit } from '@/utils/public';
import Io from '@/utils/socket/index';
import { Spinner } from 'mint-ui';

export default {
  data() {
    return {
      test: false,

      page: 1,
      pageSize: 20,
      totalPage: 1,

      dataList: [],
      allLoaded: false,

      loading: true,
      showListLength: 10, // 历史委托展示条数
      listenerId: null,
    }
  },
  props: [
    'symbol',
    'aggConfigs', // 是否是聚合交易对
  ],
  components: {
    mtSpinner: Spinner
  },
  watch: {
    symbol() {
      this.handleGetOrderList();
    },
  },
  mounted() {
    this.handleGetOrderList();

    /*
    * ORDER_UPDATE(1, "orderupdate", "订单更新"),
    * ORDER_SUCCESS(2, "ordersuccess", "下单成功"),
    * CANCEL_SUCCESS(3, "cancelsuccess", "撤单成功"),
    * ORDER_FAIL(4, "orderfail", "下单失败"),
    * CANCEL_FAIL(5, "cancelfail", "撤单失败");
    */
    Io.addListenerOrder('start', (res) => {
      // console.log('-------------历史订单-------------'); // eslint-disable-line
      this.listenerId = res.listenerId;
      if (res.type === 'orderupdate' || res.type === 'ordersuccess') { // 下单成功
        this.handleGetOrderList();
      }
      if (res.type === 'cancelsuccess') { // 撤单成功
        this.handleGetOrderList();
      }
    });
  },
  methods: {
    handleTomore() {
      this.$router.push({
        name: 'coinHistoryList',
        params: {
          symbol: this.symbol,
          aggConfigs: this.aggConfigs,
        }
      })
    },
    // 下拉刷新
    loadTop() {
      this.handleGetOrderList();
    },
    loadBottom() {
      this.page += 1;
      this.handleGetOrderList(this.page);
    },
    // 未读订单标志为已读
    handleRead(id, aggOid) {
      if (!id && !this.$store.state.app.unReadCount) {
        return;
      }
      const params = {
        accountNo: this.$store.state.app.accountInfo.account,
        orderId: id || '',
        aggOid: aggOid || '',
      }
      this.$http.post('/order/updateOrderIsReaded', params).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        // 判断是否还存在未读
        if (!id) { // 全部清除
          this.$store.dispatch('setUnReadCount', 0);
          this.dataList.forEach((item) => {
            if (!item.readStatus) {
              this.$set(item, 'readStatus', 1);
            }
          });
          return;
        }
        let n = this.$store.state.app.unReadCount;
        n -= 1;
        this.$store.dispatch('setUnReadCount', n);
      });
    },
    // goto 交易明细
    handleGoToDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      // 未读订单展开详情 - 请求接口标志为已读
      if (!item.readStatus) {
        this.handleRead(item.id, item.aggOid)
      }
      this.$store.dispatch('setDetail', item);
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: item.id,
          aggOid: item.aggOid
        }
      });
    },
    /* 数据请求操作 start */
    handleGetOrderList(page) { // 查询订单记录列表信息
      try {
        this.loading = true;
        const params = {
          currPage: page || 1, // 当前页码
          pageSize: this.showListLength, // 每页数量
          orderByName: '', // 排序字段
          orderByType: '', // 排序方式(asc, desc)
          accountNo: this.$store.state.app.accountInfo.account, // 账户名
          symbol: this.symbol, // 交易对
          historyType: 0, // 0 - 三个月订单 | 1 - 2018年 | 2 - 2019年
        };
        this.$http.post('/order/queryHistoryOrderPage', params).then((res) => {
          this.loading = false;
          if (res.code !== 0) {
            this.$toast({
              message: res.msg,
              position: 'center',
              duration: 2000,
            });
            return;
          }
          const list = res.page.list;
          list.forEach((item) => {
            const obj = dealSymbolSplit(item.symbol);
            this.$set(item, 'symbol1', obj.symbol1.toUpperCase());
            this.$set(item, 'symbol2', obj.symbol2.toUpperCase());
            const localTime = toLocalTime(item.orderTime);
            this.$set(item, 'localTime', localTime.substr(5, 5));
            this.$set(item, 'open', false);
          });

          if (res.page.list.length < params.pageSize) {
            this.allLoaded = true;
          } else {
            this.allLoaded = false;
          }

          // 判断刷新 / 更多
          if (!page) {
            this.handleRefresh(list);
            return;
          }
          this.handleTopage(list);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetOrderList();
        }, 500);
      }
    },
    // 首次加载 / 下拉刷新
    handleRefresh(list) {
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多
    handleTopage(list) {
      this.dataList.push(...list)
    },
    // 订单详情
    handleRowDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$set(item, 'open', !item.open);
    },
  },
  beforeDestroy() {
    Io.addListenerOrder({ // 停止监听订单信息
      way: 'stop',
      listenerId: this.listenerId
    });
  }
}
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";

.tradeCoin{
  font-size: .21rem;
}

.hidden{
  visibility: hidden;
}

.loading{
  display: block;
  width: 30px;
  margin: auto;
  padding: .5rem 0rem;
}

.noData{
  text-align: center;
  padding: .3rem 0px;

  .noTip{
    font-size: .25rem;
    color: $color-666;
  }
  .imgNodata{
    height: 1.8rem;
    padding-top: .30rem;
    padding-bottom: .1rem;
  }
}

.list{
  font-size: .3rem;
  background: #fafafa;

  .tip{
    font-size: .25rem;
    color: $color-999;

    .pointDiv{
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: flex-end;
      position: relative;
    }
  }

  .item{
    background: #fff;
    padding: .24rem .24rem .24rem .25rem;
    margin-bottom: .12rem;

    .itemTitle{
      margin-bottom: .25rem;
      display: flex;
      align-items: center;/*垂直居中*/

      &>div{
        flex: 2;
      }

      .symbol{
        .coin{
          margin: 0px .02rem;
        }

        .time{
          font-size: .25rem;
          color: $color-999;
        }
      }

      .status{
        flex: 2;
        max-width: 3.1rem;
        min-width: 3.1rem;
        text-align: right;
        font-size: .25rem;
        color: $color-999;
      }
    }

    .showContent{
      display: flex;
      align-items: center;/*垂直居中*/

      &>div{
        flex: 3;
        text-align: right;
        margin-right: .1rem;
        max-width: 33%;

        &:last-child{
          margin-right: 0px;
        }
      }

      .textLeft{
        // padding-left: .4rem;
        text-align: left;
      }

      .num{
        line-height: .45rem;
        overflow: hidden;
      }

      .tools{
        margin-right: 0rem;
        font-size: .25rem;
        text-align: center;
        flex: 1;

        .toDetail{
          font-size: .16rem;
        }
      }
    }

    .hiddenContent{
      position: relative;
      display: flex;
      align-items: center;/*垂直居中*/
      background-color: #fafafa;
      padding: .2rem 0rem;
      margin-top: .12rem;

      .detail{
        flex: 9;
        .detailTitle{
          display: flex;
          align-items: center;/*垂直居中*/
          height: .5rem;
          line-height: .5rem;

          &>div{
            flex: 3;
            text-align: right;
            margin-right: .4rem;
          }
        }

        .datailList{
          text-align: right;
          font-size: .25rem;
          display: flex;
          // align-items: center;/*垂直居中*/
          // margin-right: .4rem;

          &>div{
            flex: 1;
            line-height: .4rem;
            margin-right: .4rem;
            // height: .5rem;
            line-height: .5rem;
          }
        }
      }

      .go{
        width: .55rem;
        text-align: left;

        .goRight{
          position: absolute;
          font-size: .2rem;
          transform: translate(-30%, 0)
        }
      }
    }
  }
}
// 聚合图标
.swapIcon {
  // position: absolute;
  // top: 0px;
  // right: 0px;
  width: .28rem;
  margin-left: .1rem;
  // transform: translate(110%, 0);
}
</style>
