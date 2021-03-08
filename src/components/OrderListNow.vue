<template>
  <div class="list">
    <mt-loadmore
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="$t('public.loadingMoreTip1')"
      :bottomDropText="$t('public.loadingMoreTip2')"
      :bottomLoadingText="$t('public.loadingMoreTip3')"
      :bottom-all-loaded="allLoaded"
      :bottom-method="loadBottom"
      :auto-fill="false" ref="loadmore">
      <!-- 加载中-->
      <div class="loading" v-if="loading || showLoading">
        <!-- <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner> -->
        <loading :showLoading="true"/>
      </div>
      <template v-for="(item, $index) in dataList">
        <div v-if="dataList.length" :key="$index" class="item">
          <!-- title -->
          <div class="itemTitle">
            <!-- 交易对 -->
            <div class="symbol">
              <span class="color-red" v-if="item.direction === 2">{{ $t('public.sellShort') }}</span>
              <span class="color-green" v-if="item.direction === 1">{{ $t('public.buyShort') }}</span>
              <span class="coin">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
              <span class="time tip">{{ item.localTime }}</span>
            </div>
            <!-- status -->
            <div class="status">
              <button class="btn" v-if="statusInfo.status != 1 && item.orderStatus !== -1"
                @click="handleCancelOrder(item, $index)">
                <Loading v-if="revokeAllLoading || item.loading" class="btnLoading"/>
                <span>{{ $t('public.revoke') }}</span>
              </button>
              <button class="btn comfiring" v-if="item.orderStatus === -1">{{ $t('order.status6') }}</button>
              <button class="btn stop" v-if="statusInfo.status === 1" @click="handleStop">{{ $t('public.revoke') }}</button>
              <button class="btn stop" v-if="statusInfo.status === 3" @click="oldDown = true">{{ $t('public.revoke') }}</button>
            </div>
          </div>

          <!-- showContent -->
          <div class="showContent" @click="handleGoToDetail(item)">
            <div>
              <div class="showContentItem">
                <div class="textLeft">
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
                  <div class="tip">{{ $t('public.dealCount') }}
                    <span class="tradeCoin">({{ item.symbol1 }})</span>
                  </div>
                  <div class="num">{{ item.dealCountStr || '—' }}</div>
                </div>
              </div>
              <div class="showContentItem">
                <div class="textLeft">
                  <div class="tip">{{ $t('public.dealAveragePrice') }}
                    <span class="tradeCoin">({{ item.symbol2 }})</span>
                  </div>
                  <div class="num">{{ item.dealPriceStr || '—'  }}</div>
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
                    <span class="tradeCoin">({{ item.direction === 1 ? item.symbol1 : item.symbol2 }})</span>
                  </div>
                  <div class="num" v-if="item.direction === 1">{{ item.totalChargeStr || '—' }}</div>
                  <div class="num" v-if="item.direction === 2">{{ item.totalChargeStr || '—' }}</div>
                </div>
              </div>
            </div>
            <div class="tools color-this">
              <span v-if="(item.dealStatus !== 0)">
                <span class="iconfont icon-huaban11 toDetail"></span>
              </span>
            </div>
          </div>
          <div class="hiddenContent" v-if="item.open" @click="handleGoToDetail(item)">
            <div class="detail">
              <div class="detailTitle">
                <div class="tip textLeft">{{ $t('public.dealPrice') }}<span class="tradeCoin"
                  >({{ item.symbol2 }})
                  </span>
                </div>
                <div class="tip">{{ $t('public.dealCount') }}<span class="tradeCoin"
                  >({{ item.symbol1 }})
                  </span>
                </div>
                <div class="tip">{{ $t('public.charge') }}<span
                    class="tradeCoin">({{ item.direction === 1 ? item.symbol1 : item.symbol2 }})
                  </span>
                </div>
              </div>
              <template v-for="(list, i) in item.orderDealRecords">
                <div class="datailList" v-if="item.orderDealRecords.length" :key="i">
                  <div class="num textLeft">{{ list.dealPriceStr }}</div>
                  <div class="num">{{ list.dealCountStr }}</div>
                  <div class="num" v-if="item.direction === 2">{{ list.askChargeStr }}</div>
                  <div class="num" v-if="item.direction === 1">{{ list.bidChargeStr }}</div>
                </div>
              </template>
              <div v-if="item.orderDealRecords && !item.orderDealRecords.length" class="color-999" style="text-align:center;font-size: .25rem;">
                {{ $t('public.noData') }}
              </div>
            </div>

            <div class="go color-this" @click="handleGoToDetail(item)">
              <span class="iconfont icon-huaban36-copy goRight"></span>
            </div>

          </div>
        </div>
      </template>

      <!-- 没有数据 -->
      <div class="noData" v-if="!dataList.length && !loading && !showLoading">
        <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div class="noTip color-999">{{ $t('order.noOrderList') }}</div>
      </div>

      <!-- 没有更多记录 -->
      <div class="noData" v-if="allLoaded && dataList.length && !showLoading">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>
    </mt-loadmore>

    <!-- 暂停交易提示 -->
    <mt-popup
      class="popup"
      v-model="stop"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="statusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 已下架 -->
    <mt-popup
      v-model="oldDown"
      class="specialTip"
      popup-transition="popup-fade">
      <old-down-tip :statusInfo="statusInfo" v-if="oldDown" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="popup"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 撤单提示 -->
    <mt-popup
      v-model="showCancelChoose"
      class="popup"
      popup-transition="popup-fade">
      <cancel-order v-if="showCancelChoose" @listenClose="handleClose" @listenSureCancel="handleSureCancel"/>
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
import Bus from '@/utils/bus';
import StopTip from '@/views/market/components/StopTip';
import OldDownTip from '@/views/market/components/OldDownTip';
import ServerStop from '@/components/ServerStop';
import Loading from '@/components/Loading'
import CancelOrder from '@/components/CancelOrder'

import { toLocalTime, dealSymbolSplit, getReqUrl } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import RequestApi from '@/utils/requestApi';
import DApp from '@/utils/wallet';
import Io from '@/utils/socket/index';
import { Popup, Loadmore } from 'mint-ui';

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

      // status
      stop: false, // 交易对暂停
      down: false, // 交易对下架
      oldDown: false, // 已下架
      serverStop: false,
      symbol: '',

      listenerId: null, // ws 订单监听id
      showCancelChoose: false,
      cancelRow: {},
      cancelIndex: -1,
      useFreeCpu: false,
      showLoading: false, // 委托未成功loading的状态
    }
  },
  props: [
    'statusInfo',
    'revokeAllLoading',
    'queryAgg',
  ],
  components: {
    StopTip,
    OldDownTip,
    ServerStop,
    Loading,
    CancelOrder,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
  },
  watch: {
    '$route.params.symbol': function listen(newVal) {
      if (!newVal) {
        return;
      }
      this.handleGetOrderList();
    },
    dataList: {
      handler: function listen(newVal) {
        this.$store.dispatch('setSymbolOrderListData', newVal);
      },
      deep: true,
    },
    '$store.state.app.accountInfo': function listen1() {
      // this.handleWsListener();
      this.handleGetOrderList();
    },
    '$store.state.app.accountMsg': function listen2(newVal, oldVal) {
      if (newVal.times !== oldVal.times) {
        if (newVal.type === 'orderupdate' || newVal.type === 'ordersuccess') { // 下单成功 - 接口获取新的列表
          this.handleGetOrderList();
        }
        if (newVal.type === 'cancelsuccess') { // 撤单成功
          this.handleGetOrderList();
        }
        if (newVal.type === 'cancelfail') { // 撤单失败
          this.$toast(this.$t('error.revokeError'));
          this.handleGetOrderList();
        }
      }
    },
    'queryAgg': function listen() {
      this.handleGetOrderList();
    },
  },
  created() {
  },
  mounted() {
    this.handleGetOrderList();
    Bus.$on('showLoading', (val) => {
      this.showLoading = val;
      if (!val) {
        this.handleGetOrderList();
      }
      // else {
      // 如果是委托中不取消loading状态
      // this.dataList = [];
      // this.$forceUpdate();
      // }
    })
    // this.handleWsListener();
  },
  methods: {
    handleWsListener() {
      /*
      * ORDER_UPDATE(1, "orderupdate", "订单更新"),
      * ORDER_SUCCESS(2, "ordersuccess", "下单成功"),
      * CANCEL_SUCCESS(3, "cancelsuccess", "撤单成功"),
      * ORDER_FAIL(4, "orderfail", "下单失败"),
      * CANCEL_FAIL(5, "cancelfail", "撤单失败");
      */
      Io.addListenerOrder('start', (res) => {
        // console.log('-------------当前订单-------------',res); // eslint-disable-line
        this.listenerId = res.listenerId;
        if (res.type === 'orderupdate' || res.type === 'ordersuccess') { // 下单成功 - 接口获取新的列表
          this.handleGetOrderList();
          // this.$store.dispatch('setBadge', true); // 标记
        }
        if (res.type === 'cancelsuccess') { // 撤单成功
          this.handleGetOrderList();
        }
        if (res.type === 'cancelfail') { // 撤单失败
          this.$toast(this.$t('error.revokeError'));
          this.handleGetOrderList();
        }
        // this.$toast(JSON.stringify(res))
      });
    },
    // 展示暂停交易
    handleStop() {
      this.stop = true;
    },
    // 关闭暂停提示框
    handleClose() {
      this.stop = false;
      this.oldDown = false;
      this.serverStop = false;
      this.showCancelChoose = false;
    },
    // 下拉刷新
    loadTop() {
      this.handleGetOrderList();
    },
    loadBottom() {
      this.page += 1;
      this.handleGetOrderList(this.page);
    },
    // goto 交易明细
    handleGoToDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$store.dispatch('setDetail', item);
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: item.id
        }
      });
    },
    /* 数据请求操作 start */
    handleGetOrderList(page) { // 查询订单记录列表信息
      try {
        this.symbol = this.$route.params.symbol.toLowerCase();
        this.loading = true;
        const params = {
          currPage: page || 1, // 当前页码
          pageSize: 20, // 每页数量
          orderByName: '', // 排序字段
          orderByType: '', // 排序方式(asc, desc)
          accountNo: this.$store.state.app.accountInfo.account, // 账户名
          symbol: this.symbol, // 交易对
          queryAgg: this.queryAgg ? 1 : 0,
        };
        this.$http.post('/order/queryCurrentOrderPage', params).then((res) => {
          if (this.showLoading) {
            this.showLoading = false;
          }
          this.loading = false;
          if (res.code !== 0) {
            // this.$toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
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
            this.$set(item, 'loading', false);
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
      if (!this.$refs.loadmore) {
        return;
      }
      this.$refs.loadmore.onTopLoaded();
      this.page = 1;
      this.dataList = list;
      this.$forceUpdate();
    },
    // 上拉加载更多
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();
      this.dataList.push(...list);
      this.$forceUpdate();
    },
    // 订单详情
    handleRowDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      this.$set(item, 'open', !item.open);
    },
    // 撤销订单
    handleCancelOrder(row, index) {
      if (this.revokeAllLoading || row.loading) {
        return;
      }
      if (this.$appName === 'eosNewdex' && this.$store.state.app.trad.onChain !== 1) {
        const token = localStorage.getItem('token');
        if (!token) {
          this.handleGetTimestampJson(row, index);
          return;
        }
      }
      this.showCancelChoose = true;
      this.cancelRow = row;
      this.cancelIndex = index;
    },
    // 确认取消订单
    handleSureCancel(freeCpuStatus) {
      this.useFreeCpu = freeCpuStatus;
      this.showCancelChoose = false;
      const row = this.cancelRow;
      const index = this.cancelIndex;
      this.dataList[index].loading = true;
      // 判断服务器状态
      // this.$http.get('common/getCommonParam').then((res) => {
      RequestApi.commonParam((res) => {
        if (res.code !== 0) {
          this.dataList[index].loading = false;
          return;
        }
        if (!Number(res.exchangeStatus)) {
          this.serverStop = true;
          this.dataList[index].loading = false;
          return;
        }
        if (this.$appName === 'tronNewdex') {
          this.handleCancleOrderTron(row, index)
          return;
        }
        this.handleGetSymbolStatus(row, index);
      })
    },
    // 调用免CPU撤单确认
    handleUseFreeCpuPost(signedTx, row, $index) {
      let url = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT2}/cpu/pushTxWithoutCPU`;
      if (this.$evn !== 'test') {
        const host = location.origin;
        url = `${host}/cpu/pushTxWithoutCPU`;
      }
      axios.post(url, {
        signed: signedTx
      }, {
        headers: {
          accept: 'application/json, text/plain, */*',
        },
      }).then((res) => {
        if (res.data.code === 500) {
          this.$toast(res.data.message);
          return;
        }
        if (!res.data || res.data.code !== 200) {
          this.dataList[$index].loading = false;
          this.$toast(this.$t('error.revokeError'))
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        this.dataList[index].orderStatus = 2;
        this.$toast(this.$t('order.revokeSuccess'))
      }).catch((error) => {
        console.log(error); // eslint-disable-line
        DApp.handleScatterErrorBack(error, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
      })
    },
    async handleGetSymbolStatus(row, $index) {
      // 合约撤单
      if (this.$store.state.app.trad.onChain === 1) {
        const chain = this.$store.state.app.accountInfo.chain;
        const account = this.$store.state.sys.toAccountList[`chain-${chain}`];
        const obj = {
          actionsAccount: account,
          orderId: row.chainOrderId, // (string)订单id 如果是全部撤单为0
          symbolId: row.symbolId,
          chain,
          useFreeCpu: this.useFreeCpu
        }

        const fromName = this.$store.state.app.accountInfo.account;
        const permission = this.$store.state.app.accountInfo.permissions;
        const params = {
          actions: [
            {
              account: obj.actionsAccount, // 合约账户
              name: 'cancelorder', // 撤单方法
              authorization: [{
                actor: fromName, // 撤单账户
                permission, // 权限可选（active, owen）
              }],
              data: {
                // owner: fromName, // 权限（active, owen）
                order_id: obj.orderId, // (string)订单id
                pair_id: obj.symbolId, // (string)交易对ID
                // auth_type: 1,
              }
            }
          ]
        }
        const transferParams = {
          useFreeCpu: obj.useFreeCpu,
          params
        }
        const result = await DApp.transactionApi(transferParams);
        this.dataList[$index].loading = false;
        // 错误信息
        if (result && result.code !== 0) {
          DApp.handleScatterErrorBack(result, (type, text) => {
            type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
          });
          return;
        }
        if (transferParams.useFreeCpu) { // 如果免CPU需要特殊处理结果
          if (result.code === 0) {
            this.handleUseFreeCpuPost(result.result, row, $index);
          }
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        this.dataList[index].orderStatus = 2;
        this.$toast(this.$t('order.revokeSuccess'));
        // DApp.revoke(params, (err, res) => {
        //   if (err) {
        //     this.dataList[$index].loading = false;
        //     this.$toast(this.$t('error.revokeError'))
        //     return;
        //   }
        //   if (params.useFreeCpu) {
        //     // 免cpu撤单
        //     this.handleUseFreeCpuPost(res, row, $index);
        //     return;
        //   }
        //   if (res) {
        //     const index = this.dataList.findIndex(item => item.id === row.id);
        //     this.dataList[index].orderStatus = 2;
        //     this.$toast(this.$t('order.revokeSuccess'))
        //   }
        // });
        return;
      }

      // 撤单接口请求
      const params = {
        orderId: row.id, // 订单uuid
      };
      this.$http.post('/order/cancel', params).then((res) => {
        if (res.code === 401 || res.code === 500) {
          localStorage.removeItem('token')
          this.dataList[$index].loading = false;
          this.handleGetTimestampJson(row, $index);
          return;
        }
        if (res.code !== 0) {
          this.dataList[$index].loading = false;
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        if (index !== -1) {
          this.dataList.splice(index, 1)
        }
        this.$toast(this.$t('order.revokeSuccess'))
      });
    },
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson(row, index) {
      accountToSign(this, () => {
        this.handleCancelOrder(row, index);
      });
    },
    /* -------- 权限校验 end -------- */

    // 波场撤单
    handleCancleOrderTron(row, $index) {
      const params = {
        orderId: row.chainOrderId, // (string)订单id 如果是全部撤单为0
        dexCode: this.$store.state.app.trad.dexContract,
      }
      DApp.revoke(params, (err, res) => {
        if (err) {
          this.dataList[$index].loading = false;
          this.$toast(this.$t('error.revokeError'))
          return;
        }
        if (res) {
          const index = this.dataList.findIndex(item => item.id === row.id);
          if (index !== -1) {
            this.dataList[index].orderStatus = 2;
          }
          this.$toast(this.$t('order.revokeSuccess'))
        }
      });
    },
  },
  beforeDestroy() {
    Io.addListenerOrder({
      way: 'stop',
      listenerId: this.listenerId
    })
  }
}
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";

.stop{
  border-color: $color-999 !important;
  color: $color-999 !important;
}

.popup{
  border-radius: .2rem;
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
  // height: 100%;
  // overflow: auto;
  // padding: .24rem .36rem;
  background: #fafafa;

  .tip{
    font-size: .25rem;
    color: $color-999;
  }

  .tradeCoin{
    font-size: .21rem;
  }

  .item{
    background: #fff;
    padding: .24rem .28rem .24rem .25rem;
    margin-bottom: .12rem;

    .itemTitle{
      margin-bottom: .25rem;
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;/*水平居中*/

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
        max-width: 2.3rem;
        text-align: right;
        font-size: .25rem;
        color: $color-999;
        position: relative;

        .btnLoading{
          position: absolute;
          height: calc(100% + .2rem);;
          width: calc(100% + .2rem);
          right: -.1rem;
          top: -.1rem;
          z-index: 10;
          /deep/ .loading{
            font-size: .21rem !important;
          }
        }

        .btn{
          font-size: .25rem;
          height: .5rem;
          line-height: .5rem;
          min-width: .82rem;
          color: $color-this;
          background: transparent;
          border: 1px solid $color-this;
          border-radius: .08rem;
          padding: 0px .1rem;
          position: relative;
          box-sizing: border-box;

          &.comfiring{
            border: 1px solid transparent;
          }
        }
      }
    }

    .showContent{
      display: flex;
      align-items: center;/*垂直居中*/

      .showContentItem{
        margin-top: .2rem;
        display: flex;
        align-items: center;/*垂直居中*/

        &:first-child{
          margin-top: 0rem;
        }

        &>div{
          flex: 3;
          text-align: right;
          margin-right: .1rem;
          // max-width: 33%;

          &:last-child{
            margin-right: 0rem;
          }
        }

        .textLeft{
          // padding-left: .4rem;
          text-align: left;
        }
      }

      &>div{
        flex: 17;
        text-align: right;
        // margin-right: .2rem;
      }

      .num{
        // height: .45rem;
        line-height: .45rem;
        overflow: hidden;
      }

      .tools{
        margin-right: 0rem;
        font-size: .25rem;
        text-align: right;
        min-width: .3rem;
        flex: 1;
        margin-right: -.04rem;

        .toDetail{
          font-size: .26rem;
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

      .textLeft{
        // padding-left: .4rem;
        text-align: left !important;
      }

      .detail{
        flex: 11;
        margin-right: .2rem;
        // display: flex;
        // align-items: center;/*垂直居中*/

        .detailTitle{
          display: flex;
          align-items: center;/*垂直居中*/
          height: .5rem;
          line-height: .5rem;

          &>div{
            flex: 3;
            text-align: right;
            margin-right: .1rem;

            &:last-child{
              margin-right: 0rem;
            }
          }
        }

        .datailList{
          text-align: right;
          font-size: .25rem;
          display: flex;
          align-items: center;/*垂直居中*/
          // margin-right: .4rem;

          &>div{
            flex: 1;
            height: .4rem;
            line-height: .4rem;
            margin-right: .1rem;
            height: .5rem;
            line-height: .5rem;
          }
        }
      }

      .go{
        // flex: 1;
        width: .55rem;
        text-align: left;

        .goRight{
          position: absolute;
          font-size: .2rem;
          transform: translate(-20%, 0)
        }
      }
    }
  }
}
</style>
