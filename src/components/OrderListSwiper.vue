<template>
  <div class="list" @click="handleClose">
    <!-- 订单中心title -->
    <div v-if="$route.name === 'symbolOrderList' || $route.name === 'coinHistoryList'">
      <div class="title">
        <div class="iconfont icon-huaban25 back" @click="handleBack"></div>
        <div class="name">
          <span>{{ symbolName }}</span><span v-if="$route.name === 'coinHistoryList'">{{ $t('order.tradeOrder') }}</span>
        </div>
        <div class="iconfont icon-huaban15 search" :class="{'color-this': searchData}" @click="search = true"></div>
      </div>
      <div class="subTools">
        <div class="end" :class="{'color-this': active === 1}" @click="handleActive(1)">{{ $t('quotation.nowList') }}</div>
        <div :class="{'color-this': active === 2}" @click="handleActive(2)">{{ $t('quotation.oldList') }}</div>
      </div>
      <!-- 委托 start -->
      <div class="historyCondition" v-if="active === 1">
        <div class="entrust">
          <div class="entrust-item">
            <!-- 委托时间排序 -->
            <span @click="handleSortTime(dealCount)">{{ $t('order.entrust') }}</span>
            <span class="sortTip">
              <label>
                <i class="top" :class="{'topActive': dealCount === 2}"></i>
                <i class="bottom" :class="{'bottomActive': dealCount === 1}"></i>
              </label>
            </span>
          </div>
          <!-- 委托金额 排序-->
          <!-- <div class="entrust-item">
            <span>委托金额</span>
            <span class="sortTip">
              <label>
                <i class="top"></i>
                <i class="bottom"></i>
              </label>
            </span>
          </div> -->
        </div>
        <div>
          <div class="fr" @click.stop="isEntrust = true" v-if="$appName === 'eosNewdex'">
            {{ $t('order.orderTip') }} <i class="iconfont icon-huaban31 explain"></i>
          </div>
          <!-- 显示聚合订单 -->
          <div class="fr queryAgg orderStatus notSeeCancel color-999"
            v-if="$appName==='eosNewdex'"
            @click="queryAgg = !queryAgg">
            <span class="iconfont choice" :class="{'icon-huaban57': queryAgg}"></span>
            <span>{{$t('marketDistribution.aggOrder')}}</span>
          </div>
        </div>
      </div>
      <!-- 委托 end -->
      <!-- 历史委托查询条件 start -->
      <div class="historyCondition" v-if="active === 2">
        <div>
          <div class="choose" @click.stop="select = !select">
            <!-- 资产筛选 start -->
            <div class="selectMenu" v-if="select">
              <div class="select color-333">
                <div @click.stop="handleSelected(0)" v-if="historyType !== 0">{{ $t('order.nearThreeMonthOrder') }}</div>
                <div @click.stop="handleSelected(4)" v-if="historyType !== 4">
                  <span v-if="$store.state.app.language !== 'en'">2021{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2021</span>
                </div>
                <div @click.stop="handleSelected(3)" v-if="historyType !== 3">
                  <span v-if="$store.state.app.language !== 'en'">2020{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2020</span>
                </div>
                <div @click.stop="handleSelected(2)" v-if="historyType !== 2">
                  <span v-if="$store.state.app.language !== 'en'">2019{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2019</span>
                </div>
                <div @click.stop="handleSelected(1)" v-if="historyType !== 1 && $appName === 'eosNewdex'">
                  <span v-if="$store.state.app.language !== 'en'">2018{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2018</span>
                </div>
              </div>
            </div>
            <!-- 资产筛选 end -->
            <span>
              <span v-if="historyType === 0">{{ $t('order.nearThreeMonthOrder') }}</span>
              <span v-if="historyType === 4">
                <span v-if="$store.state.app.language !== 'en'">2021{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2021</span>
              </span>
              <span v-if="historyType === 3">
                <span v-if="$store.state.app.language !== 'en'">2020{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2020</span>
              </span>
              <span v-if="historyType === 2">
                <span v-if="$store.state.app.language !== 'en'">2019{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2019</span>
              </span>
              <span v-if="historyType === 1 && $appName === 'eosNewdex'">
                <span v-if="$store.state.app.language !== 'en'">2018{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2018</span>
              </span>
            </span>
            <span class="down"></span>
          </div>
        </div>
        <div>
          <!-- 不看已撤销订单 -->
          <div class="fr orderStatus notSeeCancel color-999" @click="hideCancel = !hideCancel">
            <span class="iconfont choice" :class="{'icon-huaban57': hideCancel}"></span>
            <span>{{ $t('order.hideCancel') }}</span>
          </div>
          <!-- 显示聚合订单 -->
          <!-- v-if="aggConfigs" -->
          <div class="fr queryAgg orderStatus notSeeCancel color-999"
            v-if="$appName==='eosNewdex'"
            @click="queryAgg = !queryAgg">
            <span class="iconfont choice" :class="{'icon-huaban57': queryAgg}"></span>
            <span>{{$t('marketDistribution.aggOrder')}}</span>
          </div>
        </div>
      </div>
      <!-- 历史委托查询条件 end -->
    </div>

    <div class="" v-if="$route.name === 'order'">
      <div class="subTools">
        <div class="clearDiv" @click="handleRead()">
          <span class="iconfont icon-huaban45 clear" v-if="$store.state.app.unReadCount">
            <span class="unReadCount point" v-if="$store.state.app.unReadCount"></span>
          </span>
        </div>
        <div class="end" :class="{'color-this': active === 1}" @click="handleActive(1)">
          <span>{{ $t('quotation.nowList') }}</span>
          <span class="point titlePoint" v-if="$route.name === 'order' && unReadCountCurrent"></span>
        </div>
        <div :class="{'color-this': active === 2}" @click="handleActive(2)">
          <span>{{ $t('quotation.oldList') }}</span>
          <span class="point titlePoint" v-if="$route.name === 'order' && unReadCountHistory"></span>
        </div>
        <div class="iconfont icon-huaban15 search" :class="{'color-this': searchData}" @click="search = true"></div>
      </div>
      <!-- 委托 start -->
      <div class="historyCondition" v-if="active === 1">
        <div class="entrust">
          <div class="entrust-item">
            <!-- 委托时间排序 -->
            <span @click="handleSortTime(dealCount)">{{ $t('order.entrust') }}</span>
            <span class="sortTip">
              <label>
                <i class="top" :class="{'topActive': dealCount === 2}"></i>
                <i class="bottom" :class="{'bottomActive': dealCount === 1}"></i>
              </label>
            </span>
          </div>
          <!-- 委托金额 排序-->
          <!-- <div class="entrust-item">
            <span>委托金额</span>
            <span class="sortTip">
              <label>
                <i class="top"></i>
                <i class="bottom"></i>
              </label>
            </span>
          </div> -->
        </div>
        <div>
          <div class="fr" @click.stop="isEntrust = true" v-if="$appName === 'eosNewdex'">
            {{ $t('order.orderTip') }} <i class="iconfont icon-huaban31 explain"></i>
          </div>
          <!-- 显示聚合订单 -->
          <div class="fr queryAgg orderStatus notSeeCancel color-999"
            @click="queryAgg = !queryAgg">
            <span class="iconfont choice" :class="{'icon-huaban57': queryAgg}"></span>
            <span>{{$t('marketDistribution.aggOrder')}}</span>
          </div>
        </div>
      </div>
      <!-- 委托 end -->
      <!-- 历史委托查询条件 start -->
      <div class="historyCondition" v-if="active === 2">
        <div>
          <div class="choose" @click.stop="select = !select">
            <!-- 资产筛选 start -->
            <div class="selectMenu" v-if="select">
              <div class="select color-333">
                <div @click.stop="handleSelected(0)" v-if="historyType !== 0">{{ $t('order.nearThreeMonthOrder') }}</div>
                <div @click.stop="handleSelected(4)" v-if="historyType !== 4">
                  <span v-if="$store.state.app.language !== 'en'">2021{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2021</span>
                </div>
                <div @click.stop="handleSelected(3)" v-if="historyType !== 3">
                  <span v-if="$store.state.app.language !== 'en'">2020{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2020</span>
                </div>
                <div @click.stop="handleSelected(2)" v-if="historyType !== 2">
                  <span v-if="$store.state.app.language !== 'en'">2019{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2019</span>
                </div>
                <div @click.stop="handleSelected(1)" v-if="historyType !== 1 && $appName === 'eosNewdex'">
                  <span v-if="$store.state.app.language !== 'en'">2018{{ $t('order.yearOrder') }}</span>
                  <span v-else>{{ $t('order.yearOrder') }}2018</span>
                </div>
              </div>
            </div>
            <!-- 资产筛选 end -->
            <span>
              <span v-if="historyType === 0">{{ $t('order.nearThreeMonthOrder') }}</span>
              <span v-if="historyType === 4">
                <span v-if="$store.state.app.language !== 'en'">2021{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2021</span>
              </span>
              <span v-if="historyType === 3">
                <span v-if="$store.state.app.language !== 'en'">2020{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2020</span>
              </span>
              <span v-if="historyType === 2">
                <span v-if="$store.state.app.language !== 'en'">2019{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2019</span>
              </span>
              <span v-if="historyType === 1 && $appName === 'eosNewdex'">
                <span v-if="$store.state.app.language !== 'en'">2018{{ $t('order.yearOrder') }}</span>
                <span v-else>{{ $t('order.yearOrder') }}2018</span>
              </span>
            </span>
            <span class="down"></span>
          </div>
        </div>
        <div>
          <!-- 不看已撤销订单 -->
          <div class="fr orderStatus notSeeCancel color-999" @click="hideCancel = !hideCancel">
            <span class="iconfont choice" :class="{'icon-huaban57': hideCancel}"></span>
            <span>{{ $t('order.hideCancel') }}</span>
          </div>
          <!-- 显示聚合订单 -->
          <div class="fr queryAgg orderStatus notSeeCancel color-999"
            @click="queryAgg = !queryAgg">
            <span class="iconfont choice" :class="{'icon-huaban57': queryAgg}"></span>
            <span>{{$t('marketDistribution.aggOrder')}}</span>
          </div>
        </div>
      </div>
      <!-- 历史委托查询条件 end -->
    </div>

    <div class="scrollView isHistory" ref="scrollView">
      <!-- 主订单列表展示去 start -->
      <mt-loadmore
        :topPullText="$t('public.loadingMoreTip1')"
        :topDropText="$t('public.loadingMoreTip2')"
        :topLoadingText="$t('public.loadingMoreTip3')"
        :bottomPullText="$t('public.loadingMoreTip1')"
        :bottomDropText="$t('public.loadingMoreTip2')"
        :bottomLoadingText="$t('public.loadingMoreTip3')"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false" ref="loadmore">

        <!-- 开通成交提醒提示 start -->
        <div class="openRemind" @click="handleToTransactionTip"
          v-if="$store.state.app.vipInfo.isDealRemind === 0 && !showOpenRemindTip && $route.name === 'order'
            && $appName === 'eosNewdex'">
          <span>{{ $t('order.remindTip') }} ></span>
          <span class="iconfont icon-huaban17 close" @click.stop="handleCloseTip"></span>
        </div>
        <!-- 开通成交提醒提示 end -->

        <div class="swiper-container swiper-container_order">
          <div class="swiper-wrapper">
            <div class="swiper-slide"
              v-for="(item, $index_out) in type" :key="$index_out">
              <!-- 加载中 -->
              <div class="loading" v-show="loading">
                <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
              </div>
              <div class="item" v-show="dataList.length" v-for="(item, $index) in dataList" :key="$index" @click="handleGoToDetail(item)">
                <!-- title -->
                <div class="itemTitle">
                  <!-- 交易对 -->
                  <div class="symbol" @click.stop="handleToTrade(item)">
                    <span class="color-red" v-if="item.direction === 2">{{ $t('public.sellShort') }}</span>
                    <span class="color-green" v-if="item.direction === 1">{{ $t('public.buyShort') }}</span>
                    <img class="coinImg" :src="item.coinImgUrl" @error="handleImgError(item)" alt="">
                    <span class="coin">{{ item.symbol1 }}/{{ item.symbol2 }}</span>
                    <span class="time tip">{{ item.localTime }}</span>
                    <!-- 聚合交易币种 -->
                    <img v-if="item.aggOid"
                      src="@/assets/img/more/swap.png"
                      class="swapIcon" alt="">
                  </div>

                  <!-- status -->
                  <div class="status">
                    <span v-if="item.orderStatus === 0" class="color-333">
                      <button class="btn" @click.stop="handleGetSymbolStatus(item, $index)">
                        <Loading  v-if="item.loading" class="btnLoading"/>
                        <span>{{ $t('public.revoke') }}</span>
                      </button>
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
                         <!-- && $route.name === 'order' -->
                        <span class="point" v-if="!item.readStatus && item.dealStatus !== 0"></span>
                        {{ $t('public.dealCount') }}
                        <span class="tradeCoin">({{ item.symbol1 }})</span>
                      </span>
                    </div>
                    <div class="num">{{ item.dealCountStr || '—' }}</div>
                  </div>
                </div>
                <div class="showContent" style="margin-top: .2rem;"
                  v-if="!(item.dealStatus === 0 && item.orderStatus === 2)">
                  <div class="txLeft textLeft">
                    <div class="tip">
                      {{ $t('public.dealAveragePrice') }}
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
                    <div class="tip">
                      {{ $t('order.dealTotal') }}
                      <span class="tradeCoin">({{ item.symbol2 }})</span>
                    </div>
                    <div class="num">{{ item.dealAmountStr || '—' }}</div>
                  </div>
                  <div class="" v-if="false">
                    <div class="tip">{{ $t('public.charge') }}
                      <span class="tradeCoin">({{ item.direction === 1 ? item.symbol1 : item.symbol2 }})</span>
                    </div>
                    <div class="num" v-if="item.direction === 1">{{ item.totalChargeStr || '—' }}</div>
                    <div class="num" v-if="item.direction === 2">{{ item.totalChargeStr || '—' }}</div>
                  </div>
                </div>
              </div>

              <!-- 没有数据 -->
              <div class="noData" v-show="!dataList.length && !loading">
                <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
                <div class="noTip">{{ $t('order.noOrderList') }}</div>
              </div>

              <!-- 没有更多记录 -->
              <div class="noData" v-show="allLoaded && dataList.length">
                <div class="noTip color-999">{{ $t('public.noMore') }}</div>
              </div>
            </div>

          </div>
        </div>


      </mt-loadmore>
      <!-- 主订单列表展示去 end -->
    </div>

    <!-- 暂停交易提示 -->
    <mt-popup
      class="popup"
      v-model="stop"
      popup-transition="popup-fade">
      <stop-tip :statusInfo="statusInfo" v-if="stop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 服务维护，停止交易 -->
    <mt-popup
      v-model="serverStop"
      class="popup"
      popup-transition="popup-fade">
      <server-stop v-if="serverStop" @listenClose="handleClose"/>
    </mt-popup>

    <!-- 筛选 -->
    <mt-popup
      v-model="search"
      position="right"
      popup-transition="popup-fade">
      <order-search ref="orderSearch" v-if="search"
        @listenSure="handleSearch" :active="active" :startDate="startDate" :endDate="endDate" :historyType="historyType"
        :searchData="isSearchStarus" :hideCancel="hideCancel" @listenExportOrder="handleExportOrder" />
    </mt-popup>

    <!-- 日历控件 -->
    <div class="date">
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        @confirm="handleConfirm"
        :startDate="startDate"
        :endDate="endDate"
        year-format="{value}"
        month-format="{value}"
        date-format="{value}">
      </mt-datetime-picker>
    </div>

    <!-- 去绑定邮箱提示 start -->
    <mt-popup
      v-model="tipToBindEmail"
      class="popupModel"
      popup-transition="popup-fade">
      <popup-toBind-email v-if="tipToBindEmail" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 去绑定邮箱提示 end -->

    <!-- 已发送 start -->
    <mt-popup
    v-model="sendEmail"
    class="popupModel"
    popup-transition="popup-fade">
      <send-email v-if="sendEmail" :sendEmail="sendEmail" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 已发送 end -->

    <mt-popup
      v-model="toMore"
      class="popupModel"
      popup-transition="popup-fade">
      <PopupToMoreError v-if="toMore" :toMore="toMore" @listenClose="handleClose"/>
    </mt-popup>

    <mt-popup
      v-model="noOrderList"
      class="popupModel"
      popup-transition="popup-fade">
      <PopupToNoOrderList v-if="noOrderList" :toMore="noOrderList" @listenClose="handleClose"/>
    </mt-popup>

    <mt-popup
      v-model="isEntrust"
      class="popupModel"
      popup-transition="popup-fade">
      <popup-entrust v-if="isEntrust" @listenClose="handleClose"/>
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
import Swiper from 'swiper';
import StopTip from '@/views/market/components/StopTip';
import ServerStop from '@/components/ServerStop';
import OrderSearch from '@/components/OrderSearch';
import PopupToBindEmail from '@/views/more/components/PopupToBindEmail';
import SendEmail from '@/views/more/components/SendEmail';
import PopupToMoreError from '@/views/more/components/PopupToMoreError';
import PopupToNoOrderList from '@/views/more/components/PopupToNoOrderList';
import PopupEntrust from '@/views/more/components/PopupEntrust';
import Loading from '@/components/Loading'
import CancelOrder from '@/components/CancelOrder'
import { Popup, Loadmore, Spinner, DatetimePicker } from 'mint-ui';
import { toLocalTime, handleDateToOrder, dealSymbolSplit, getReqUrl } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import RequestApi from '@/utils/requestApi';
import DApp from '@/utils/wallet';
// import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      /* ---- 订单中心tools参数设置 start ---- */
      active: 1, // 排序
      search: false, // 筛选
      searchData: null, // 筛选的数据
      isSearchStarus: null, // 是否处于筛选状态
      /* ---- 订单中心tools参数设置 end ---- */

      symbol: null,
      symbolName: null,

      page: 1,
      pageSize: 20,
      totalPage: 1,

      type: [
        'updataTime', // 更新时间排序
        'orderTime', // 委托时间排序
      ], // 排序类型
      dataList: [],
      allLoaded: false,

      // loading
      loading: true,
      first: true,
      stop: false,

      statusInfo: { // 交易对上架状态
        status: 0,
      },
      serverStop: false,
      showOpenRemindTip: false, // 展示开通提示 - json
      pickerVisible: new Date(), // 选择日期
      startDate: new Date('2015/01/01'),
      endDate: new Date(),
      inputEndDate: false,
      tipToBindEmail: false, // 去设置邮箱
      sendEmail: false, // 已发送订单报表邮件
      toMore: false, // 操作频繁
      noOrderList: false, // 无导出订单
      historyType: 0, // 历史订单类型： 0 - 近3个月 | 1 - 2018年订单 | 2 - 2019年订单
      hideCancel: true, // 隐藏已撤销
      select: false,
      dealCount: 0, // 委托时间 默认0 升序1 降序2
      unReadCountCurrent: 0,
      unReadCountHistory: 0,
      isEntrust: false, // 委托说明弹窗
      orderByName: 'update_ts', // 排序字段
      orderByType: 'desc', // 排序方式(asc, desc)
      showCancelChoose: false,
      cancelRow: {},
      cancelIndex: -1,
      useFreeCpu: false,
      queryAgg: false, // 是否聚合
      aggConfigs: null,
    }
  },
  props: [
  ],
  components: {
    StopTip,
    ServerStop,
    OrderSearch,
    PopupToBindEmail,
    SendEmail,
    PopupToMoreError,
    PopupToNoOrderList,
    PopupEntrust,
    Loading,
    CancelOrder,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
    mtSpinner: Spinner,
    mtDatetimePicker: DatetimePicker,
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      const remindTip = localStorage.getItem('RemindTip') ? JSON.parse(localStorage.getItem('RemindTip')) : {};
      const account = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
      this.showOpenRemindTip = remindTip[account] || false;
    },
    // dealCount: {
    //   handler(val) {
    //     this.handleGetOrderList(null, this.searchData);
    //   }
    // },
    hideCancel() {
      this.handleGetOrderList(null, this.searchData);
    },
    historyType() {
      // 日历控件设置时间
      const dateArr = handleDateToOrder(this.historyType);
      this.startDate = new Date(dateArr[0]);
      this.endDate = new Date(dateArr[1]);
      // this.handleGetOrderList(null, this.searchData);
      // 时间清空
      const newSearchData = JSON.parse(this.isSearchStarus);
      if (newSearchData) {
        newSearchData.beginTime = '';
        newSearchData.endTime = '';
        this.handleSearch(newSearchData)
        return
      }
      this.handleGetOrderList(null, this.searchData);
    },
    'queryAgg': function listen() {
      this.handleGetOrderList();
    },
  },
  created() {
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    // 委托时间排序
    handleSortTime(val) {
      switch (val) {
        case 0:
          this.dealCount = 1
          this.orderByName = 'orderTime'
          this.orderByType = 'desc'
          break;
        case 1:
          this.dealCount = 2
          this.orderByName = 'orderTime'
          this.orderByType = 'asc'
          break;
        default:
          this.dealCount = 0
          this.orderByName = 'update_ts'
          this.orderByType = 'desc'
          break;
      }
      this.handleGetOrderList(this.page, this.searchData, this.orderByName, this.orderByType);
    },
    // 重置初始化
    handleInit() {
      this.searchData = null; // 清空查询条件
      this.isSearchStarus = null; // 取消查询状态
      this.hideCancel = true; // 取消隐藏状态
      this.historyType = 0; // 默认2019订单
      this.pickerVisible = new Date(); // 选择日期
      this.startDate = new Date('2015/01/01');
      this.endDate = new Date();

      this.handleActive(1);
      this.handleMouted()
    },
    handleMouted() {
      // 路由传值 - 某个交易对
      if (this.$route.params && this.$route.params.symbol) {
        this.symbol = this.$route.params.symbol;
        const obj = dealSymbolSplit(this.symbol.toUpperCase());
        this.symbolName = `${obj.symbol1}/${obj.symbol2}`;
        this.symbolName = this.symbolName.toUpperCase();
      }

      if (this.$route.params && this.$route.params.aggConfigs) {
        this.aggConfigs = this.$route.params.aggConfigs;
      } else {
        this.aggConfigs = null;
      }

      // localStorage.removeItem('RemindTip')
      const remindTip = localStorage.getItem('RemindTip') ? JSON.parse(localStorage.getItem('RemindTip')) : {};
      const account = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
      this.showOpenRemindTip = remindTip[account] || false;

      this.handleGetOrderList();

      // swiper
      this.swiper = new Swiper('.swiper-container_order', { // eslint-disable-line
        initialSlide: 0,
        onTransitionEnd: (swiper) => {
          this.handleActive(swiper.activeIndex + 1);
        }
      })
      // 日历控件设置时间
      const dateArr = handleDateToOrder(this.historyType);
      this.startDate = new Date(dateArr[0]);
      this.endDate = new Date(dateArr[1]);
    },
    // 历史委托时间筛选
    handleSelected(index) {
      this.historyType = index;
      this.select = false;
    },
    // 订单导出弹窗控制分发
    handleExportOrder(data) {
      if (data.status === 'date') {
        this.openPicker(data.type)
      } else if (data.status === 'toMore') {
        this.search = false;
        this.toMore = true;
        setTimeout(() => {
          this.toMore = false;
        }, 2000);
      } else if (data.status === 'toBindEmail') {
        this.search = false;
        this.tipToBindEmail = true;
      } else if (data.status === 'send') {
        this.search = false;
        this.sendEmail = true; // 已发送订单报表邮件
      } else if (data.status === 'noOrderList') {
        this.search = false;
        this.noOrderList = true; // 已发送订单报表邮件
      }
    },
    // 日历控件
    openPicker(type) {
      this.inputEndDate = type;
      this.$refs.picker.open();
    },
    // 选择日历时间
    handleConfirm() {
      const str = toLocalTime(this.pickerVisible);
      if (!this.inputEndDate) {
        this.$refs.orderSearch.data.beginTime = str.substr(0, 10);
        return;
      }
      this.$refs.orderSearch.data.endTime = str.substr(0, 10);
    },
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(item, 'coinImgUrl', 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png')
    },
    // 返回
    handleBack() {
      history.back();
    },
    // 成交提醒
    handleToTransactionTip() {
      this.$router.push({
        name: 'transactionTip',
      });
    },
    // 关闭提示
    handleCloseTip() {
      const account = this.$store.state.app.accountInfo ? this.$store.state.app.accountInfo.account : '';
      this.showOpenRemindTip = true;
      const remindTip = localStorage.getItem('RemindTip') ? JSON.parse(localStorage.getItem('RemindTip')) : {};
      remindTip[account] = true;
      localStorage.setItem('RemindTip', JSON.stringify(remindTip));
    },
    // 跳转到交易对
    handleToTrade(item) {
      sessionStorage.setItem('backRoute', this.$route.path);
      const params = {
        symbol: item.symbol.toLowerCase(),
      }
      this.$router.push({
        name: 'linek',
        params,
      });
    },
    // 未读订单标志为已读
    handleRead(id, aggOid) {
      if (!id && !aggOid && !this.$store.state.app.unReadCount) {
        return;
      }
      if (id || aggOid) {
        if (this.active === 1) {
          this.unReadCountCurrent -= 1;
        } else {
          this.unReadCountHistory -= 1;
        }
      } else {
        this.unReadCountCurrent = 0;
        this.unReadCountHistory = 0;
      }

      const params = {
        accountNo: this.$store.state.app.accountInfo.account,
        orderId: id || '',
        aggOid: aggOid || '',
      }
      // console.log(params);
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
        if (!id && !aggOid) { // 全部清除
          this.$store.dispatch('setUnReadCount', 0);
          this.dataList.forEach((item) => {
            if (!item.readStatus) {
              this.$set(item, 'readStatus', 1);
            }
          });
          return;
        }
        const index = this.dataList.findIndex(item => item.id === id);
        this.dataList[index].readStatus = 1;
        let n = this.$store.state.app.unReadCount;
        n -= 1;
        this.$store.dispatch('setUnReadCount', n);
      });
    },
    // 切换排序
    handleActive(index) {
      if (this.active === index) {
        return;
      }
      // this.unReadCountHistory = 0;
      // this.unReadCountCurrent = 0;
      this.queryAgg = false;
      this.active = index;
      this.swiper.slideTo((index - 1), 0, false); // 切换到第n个slide，速度为0.4秒
      // this.dataList = [];
      // this.searchData = null; // 清空查询条件
      // this.isSearchStarus = null; // 取消查询状态
      this.page = 1;
      this.$refs.scrollView.scrollTop = 0;
      const newSearchData = JSON.parse(this.isSearchStarus);
      if (newSearchData) {
        newSearchData.beginTime = '';
        newSearchData.endTime = '';
        this.handleSearch(newSearchData)
        return
      }
      this.handleGetOrderList(this.page, this.searchData, this.orderByName, this.orderByType);
    },
    // 关闭暂停提示框
    handleClose() {
      this.stop = false;
      this.serverStop = false;
      this.sendEmail = false;
      this.toMore = false;
      this.select = false;
      this.tipToBindEmail = false;
      this.isEntrust = false
      this.showCancelChoose = false;
    },

    // 下拉刷新
    loadTop() {
      // this.searchData = null; // 清空查询条件
      // this.isSearchStarus = null; // 取消查询状态
      this.page = 1;
      this.handleGetOrderList(this.page, this.searchData, this.orderByName, this.orderByType);
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      if (this.isSearchStarus) {
        this.handleGetOrderList(this.page, this.searchData, this.orderByName, this.orderByType);
        return;
      }
      this.handleGetOrderList(this.page, this.searchData, this.orderByName, this.orderByType);
    },
    // 首次加载 / 下拉刷新 - 请求结束end
    handleRefresh(list) {
      if (!this.$refs.loadmore) {
        return;
      }
      this.$refs.loadmore.onTopLoaded();
      this.page = 1;

      this.dataList = list;
    },
    // 上拉加载更多 - 请求结束end
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();

      this.dataList.push(...list)
    },
    // goto 交易明细
    handleGoToDetail(item) {
      if (item.dealStatus === 0) {
        return;
      }
      // 未读订单展开详情 - 请求接口标志为已读
      if (!item.readStatus) {
        this.handleRead(item.id)
      }
      this.$store.dispatch('setDetail', item);
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: item.id,
          aggOid: item.aggOid,
        }
      });
      // this.$emit('listenToDetail', item);
    },
    // 获取账户未读消息总数
    handleNotReadCount() {
      RequestApi.getUnReadCount((res) => {
        this.handleGetCurrentUnReadCount(res.unReadCount);
      });
    },
    // 获取当前订单未读条数
    handleGetCurrentUnReadCount(allCount) {
      this.$http.post('/order/getProcessingUnReadCount').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.unReadCountCurrent = res.unReadCount;
        this.unReadCountHistory = allCount - res.unReadCount;
      });
    },
    // 筛选
    handleSearch(data) {
      this.search = false;
      /**
       * data 参数
       *    status: 订单状态
       *      0 - null | 1 - 已成交 | 2 - 已撤销 | 3 - 部分成交[已撤销]
       *    direction: 交易方向
       *      0 - null | 1 - 买入 | 2 - 卖出
       *    date: 交易时间
       *      0 - null | 1 - 最近三天 | 2 - 最近7天 | 3 - 最近30天
       *    beginTime: 开始时间
       *    endTime: 结束时间
       */
      // 筛选条件为空时 - 退出筛选状态
      if (data.status === -1 && data.direction === -1 && data.area === ''
        && data.date === -1 && !data.coinCode && !data.combineTypes && !data.flag.length && !data.hideCancelOrder
        && !data.endTime && !data.beginTime) {
        this.searchData = null; // 清空查询条件
        this.isSearchStarus = null; // 取消查询状态
        this.handleGetOrderList();
        return;
      }

      const params = {
        currPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        orderByName: '', // 排序字段
        orderByType: '', // 排序方式(asc, desc)
        historyType: '', // 历史订单类型： 0 - 近3个月 | 1 - 2018年订单 | 2 - 2019年订单
        accountNo: this.$store.state.app.accountInfo.account, // 账户名
        symbol: this.$route.params.symbol || '', // 币种
        symbolId: data.symbolId, // 币种ID
        // valuationCoinCode: data.area, // 查询分区
        direction: '', // 方向
        orderStatus: '', // 订单状态
        dealStatus: '', // 成交状态
        beginDate: data.beginTime, // 开始时间
        endDate: data.endTime, // 结束时间
        combineTypes: data.combineTypes, // 组合查询类型：1 - 进行中；2 - 已成交；3 - 已撤销；4 - 部分成交[已撤销]
        hideCancelOrder: data.hideCancelOrder ? 1 : 0,
      }

      // 处理订单状态
      if (data.status !== -1) {
        params.orderStatus = data.status;
      }
      // 未成交 & 已撤销
      if (data.status === 2) {
        params.orderStatus = 2;
        params.dealStatus = 0;
      }
      // 部分成交[已撤销]
      if (data.status === 3) {
        params.orderStatus = 2;
        params.dealStatus = 1;
      }
      // 处理交易方向
      if (data.direction !== -1) {
        params.direction = data.direction;
      }
      this.searchData = params; // 保存查询条件
      this.isSearchStarus = JSON.stringify(data); // 进入查询状态
      this.handleGetOrderList(null, this.searchData)
    },
    /* 数据请求操作 start */
    handleGetOrderList(page, data, orderByName, orderByType) { // 查询订单记录列表信息
      try {
        // 获取未读条数
        this.handleNotReadCount();

        this.loading = true;
        let params = null;
        if (data) {
          params = data;
          if (page) {
            params.currPage = page;
          }
        } else {
          params = {
            currPage: page || 1, // 当前页码
            pageSize: 20, // 每页数量
            orderByName: orderByName || 'update_ts', // 排序字段
            orderByType: orderByType || 'desc', // 排序方式(asc, desc)
            accountNo: this.$store.state.app.accountInfo.account, // 账户名
            symbol: this.$route.params.symbol || '', // 币种
            direction: '', // 方向
            orderStatus: '', // 订单状态
            beginDate: '', // 开始时间
            endDate: '', // 结束时间
            queryAgg: this.queryAgg ? 1 : 0, // 是否聚合
          };
        }
        // active: 1 - 当前委托 | 2 - 历史委托
        if (this.active === 1) {
          params.orderByName = this.orderByName
          params.orderByType = this.orderByType
          this.$http.post('/order/queryCurrentOrderPage', params).then((res) => {
            this.handleDealRes(res);
          });
          return;
        }
        params.hideCancelOrder = this.hideCancel ? 1 : 0;
        params.historyType = this.historyType;
        // 查询历史委托
        this.$http.post('/order/queryHistoryOrderPage', params).then((res) => {
          this.handleDealRes(res);
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetOrderList();
        }, 500);
      }
    },
    // 撤销订单
    handleCancelOrder(row, i) {
      if (this.$appName === 'eosNewdex' && this.statusInfo.onChain !== 1) {
        const token = localStorage.getItem('token');
        if (!token) {
          this.handleGetTimestampJson(row, i);
          return;
        }
      }
      this.showCancelChoose = true;
      this.cancelRow = row;
      this.cancelIndex = i;
      // MessageBox({
      //   title: this.$t('public.tip'),
      //   showConfirmButton: true,
      //   showCancelButton: true,
      //   message: `${this.$t('order.revokeTip')}?`,
      //   confirmButtonText: this.$t('public.sure'),
      //   cancelButtonText: this.$t('public.cancel')
      // }).then((data) => {
      //   if (data === 'confirm') {
      //     this.dataList[i].loading = true;
      //     // this.$http.get('common/getCommonParam').then((res) => {
      //     RequestApi.commonParam((res) => {
      //       if (res.code !== 0) {
      //         this.dataList[i].loading = false;
      //         return;
      //       }
      //       if (!Number(res.exchangeStatus)) {
      //         this.serverStop = true;
      //         this.dataList[i].loading = false;
      //         return;
      //       }
      //       if (this.$appName === 'tronNewdex') {
      //         this.handleCancleOrderTron(row, i)
      //         return;
      //       }
      //       this.handleRevoke(row, i);
      //     })
      //   }
      // }).catch(() => {
      // });
    },
    // 确认取消订单
    handleSureCancel(statusFreeCpu) {
      this.useFreeCpu = statusFreeCpu;
      this.showCancelChoose = false;
      const row = this.cancelRow;
      const i = this.cancelIndex;
      this.dataList[i].loading = true;
      RequestApi.commonParam((res) => {
        if (res.code !== 0) {
          this.dataList[i].loading = false;
          return;
        }
        if (!Number(res.exchangeStatus)) {
          this.serverStop = true;
          this.dataList[i].loading = false;
          return;
        }
        if (this.$appName === 'tronNewdex') {
          this.handleCancleOrderTron(row, i)
          return;
        }
        this.handleRevoke(row, i);
      })
    },
    // 获取交易对上架信息
    handleGetSymbolStatus(row, i) {
      if (row.loading) {
        return;
      }
      const params = {
        symbol: row.symbol,
      };
      this.dataList[i].loading = true;
      this.$http.post('/symbol/getSymbolInfo', params).then((res) => {
        this.dataList[i].loading = false;
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        // 服务器暂停
        if (Number(res.exchangeStatus) === 0) {
          sessionStorage.setItem('serverStatus', false); // 服务暂停
          return;
        }
        sessionStorage.setItem('serverStatus', true); // 服务正常

        this.statusInfo = res.symbolInfo;
        if (res.symbolInfo.status === 1) {
          this.stop = true;
          return;
        }
        this.handleCancelOrder(row, i);
      })
    },
    async handleRevoke(row, i) {
      // 合约撤单
      if (this.statusInfo.onChain === 1) {
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
        this.dataList[i].loading = false;
        // 错误信息
        if (result && result.code !== 0) {
          DApp.handleScatterErrorBack(result, (type, text) => {
            type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
          });
          return;
        }
        if (transferParams.useFreeCpu) { // 如果免CPU需要特殊处理结果
          if (result.code === 0) {
            this.handleUseFreeCpuPost(result.result, row, i);
          }
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        this.dataList[index].orderStatus = 2;
        this.$toast(this.$t('order.revokeSuccess'))
        // DApp.revoke(params, (err, res) => {
        //   if (err) {
        //     this.$toast(this.$t('error.revokeError'))
        //     this.dataList[i].loading = false;
        //     return;
        //   }
        //   if (params.useFreeCpu) {
        //     // 免cpu撤单
        //     this.handleUseFreeCpuPost(res, row, i);
        //     return;
        //   }
        //   if (res) {
        //     const index = this.dataList.findIndex(item => item.id === row.id);
        //     this.dataList[index].orderStatus = 2;
        //     // this.dataList.splice(index, 1);
        //     this.$toast(this.$t('order.revokeSuccess'))
        //   }
        // });
        return;
      }
      // 接口撤单
      const params = {
        orderId: row.id, // 订单id
      };
      this.$http.post('/order/cancel', params).then((res) => {
        if (res.code === 401) {
          localStorage.removeItem('token')
          this.handleGetTimestampJson(row, i);
          return;
        }
        if (res.code === 500) {
          this.stop = true;
          this.dataList[i].loading = false;
          return;
        }
        if (res.code !== 0) {
          this.messageclose = this.$message.error(res.msg);
          this.dataList[i].loading = false;
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        this.dataList[index].orderStatus = 2;
        this.$toast(this.$t('order.revokeSuccess'))
      })
    },
    // 调用免CPU撤单确认
    handleUseFreeCpuPost(signedTx, row, i) {
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
          this.dataList[i].loading = false;
          this.$toast(this.$t('error.revokeError'))
          return;
        }
        const index = this.dataList.findIndex(item => item.id === row.id);
        this.dataList[index].orderStatus = 2;
        // this.dataList.splice(index, 1);
        this.$toast(this.$t('order.revokeSuccess'))
      }).catch((error) => {
        console.log(error); // eslint-disable-line
        DApp.handleScatterErrorBack(error, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
      })
    },
    /* -------- 权限校验 start -------- */
    // 获取服务器时间戳
    handleGetTimestampJson(row, i) {
      accountToSign(this, () => {
        this.handleCancelOrder(row, i);
      })
    },
    /* -------- 权限校验 end -------- */

    // 订单查询结果处理
    handleDealRes(res) {
      this.loading = false;
      this.first = false;
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
        const obj = dealSymbolSplit(item.symbol, item.baseChain, item.valuationCoinContract, item.baseCoinContract, this.$embed);
        this.$set(item, 'symbol1', obj.symbol1.toUpperCase());
        this.$set(item, 'symbol2', obj.symbol2.toUpperCase());
        this.$set(item, 'coinImgUrl', obj.coinUrl);
        const localTime = toLocalTime(item.orderTime);
        this.$set(item, 'localTime', localTime.substr(5, 5));
        this.$set(item, 'open', false);
        this.$set(item, 'loading', false);
      });

      if (res.page.list.length < this.pageSize) {
        this.allLoaded = true;
      } else {
        this.allLoaded = false;
      }

      // 判断刷新 / 更多
      if (res.page.currPage === 1) {
        this.handleRefresh(list);
        return;
      }
      this.handleTopage(list);
    },
    // 波场撤单
    handleCancleOrderTron(row, i) {
      const params = {
        orderId: row.chainOrderId, // (string)订单id 如果是全部撤单为0
        dexCode: this.statusInfo.dexEntrustedAccount, // 交易所合约
      }
      DApp.revoke(params, (err, res) => {
        if (err) {
          this.$toast(this.$t('error.revokeError'))
          this.dataList[i].loading = false;
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
  }
}
</script>


<style scoped lang="scss">
@import "../assets/css/public.scss";
@import '../assets/css/swiper.min.css';

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .scrollView{
    height: calc(100vh - 2.6rem) !important;
    overflow: auto;;

    &.isHistory{
      height: calc(100vh - 3.06rem) !important;
    }
  }
}

.swiper-container_order{
  min-height: calc(100vh - 2rem);
  z-index: 0;
}

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
  padding: .3rem 0rem;
}

.popup{
  border-radius: .2rem;
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

.scrollView{
  height: calc(100vh - 2.0rem);
  overflow: auto;

  &.isHistory{
    height: calc(100vh - 2.55rem);
  }
}

// 成交提醒提示
.openRemind{
  height: .7rem;
  background: rgba(242,219,164,0.60);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px .24rem;
  font-size: .25rem;
  color: #8B572A;

  .close{
    font-size: .17rem;
  }
}

.list{
  font-size: .3rem;

  /* -------- 币种订单tools样式 start -------- */
  // 标题头部
  .title{
    background: #FFF;
    font-size: .36rem;
    height: .9rem;
    padding: 0px .24rem;
    display: flex;
    align-items: center;/*垂直居中*/
    // justify-content: center;/*水平居中*/

    .search,
    .clear{
      flex: 1;
      font-size: .4rem;
    }

    .name{
      flex: 10;
      text-align: center;
    }

    .back{
      // position: absolute;
      left: .3rem;
      font-size: .32rem;
      font-weight: normal;
    }
  }

  // 选项卡切换
  .subTools{
    background: #FFF;
    font-size: .32rem;
    height: .9rem;
    margin-bottom: .1rem;
    color: $color-999;
    display: flex;
    align-items: center; /*垂直居中*/
    // justify-content: center;/*水平居中*/

    &>div{
      flex: 1;
      text-align: center;
      position: relative;
    }

    &.mb10{
      margin-bottom: .1rem !important;
    }

    .titlePoint{
      position: absolute;
      top: 20%;
    }

    .end::after{
      content: '';
      border: 1px solid #f3f3f3;
      float: right;
      height: .27rem;
      margin-top: .05rem;
    }
  }
  /* -------- 币种订单tools样式 end -------- */

  /* -------- 订单中心tools样式 start -------- */
  // 标题头部
  .subTools{
    .search,
    .clearDiv{
      flex: 1;
      font-size: .32rem;
      display: flex;
      align-items: center;/*垂直居中*/
      // justify-content: center;
    }

    .clear{
      font-size: .4rem;
      position: relative;
    }

    .search{
      font-size: .4rem;
      justify-content: flex-end;
    }

    .unReadCount{
      position: absolute;
      right: -.15rem;
      margin: .05rem 0px;
      width: .1rem;
      min-width: 6px;
      height: .1rem;
      min-height: 6px;
      // margin-left: .1rem;
    }
  }

  // 选项卡切换
  .subTools{
    background: #FFF;
    font-size: .32rem;
    height: .9rem;
    margin-bottom: 0rem;
    color: $color-999;
    padding: 0px .24rem;
    display: flex;
    align-items: center; /*垂直居中*/
    // justify-content: center;/*水平居中*/

    &>div{
      flex: 5;
      text-align: center;
      position: relative;
    }

    .end::after{
      content: '';
      border: 1px solid #f3f3f3;
      float: right;
      height: .27rem;
      margin-top: .05rem;
    }
  }
  /* -------- 订单中心tools样式 end -------- */

  /* -------- 历史订单查询条件 start --------*/
  .historyCondition{
    display: flex;
    align-items: center; /*垂直居中*/
    justify-content: space-between;
    height: .64rem;
    padding: 0px .24rem;
    font-size: .25rem;
    .entrust{
      display: flex;
      .entrust-item{
        display: flex;
        align-items: center;/*垂直居中*/
        margin-right: 0.2rem;
      }
      .sortTip{
        width: .1rem;
        height: .64rem;
        display: flex;
        align-items: center;/*垂直居中*/
        .topActive{
          border-bottom: .08rem solid $color-this !important;
        }
        .bottomActive{
          border-top: .08rem solid $color-this !important;
        }
        .top{
          float: left;
          border: .08rem solid transparent;
          border-bottom: .08rem solid #999;
          margin: 0rem .05rem 0.015rem .05rem;
        }

        .bottom{
          float: left;
          border: .08rem solid transparent;
          border-top: .08rem solid #999;
          margin: .015rem .05rem 0.0rem .05rem;
        }
      }
    }
    .explain{
        font-size: 0.24rem;
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

    .notSeeCancel{
      display: flex;
      align-items: center;/*垂直居中*/

      .choice{
        border: 1px solid $color-input;
        display: inline-block;
        height: .3rem;
        width: .3rem;
        font-size: .3rem;
        border-radius: .04rem;
        color: $color-this;
        margin-right: .09rem;

        &.icon-huaban57{
          border: 1px solid transparent;
        }
      }
    }
  }
  /* -------- 历史订单查询条件 end --------*/

  .tip{
    font-size: .25rem;
    color: $color-999;

    .pointDiv{
      // display: flex;
      // align-items: center;/*垂直居中*/
      // justify-content: flex-end;
      position: relative;

      &>.point{
        position: absolute;
        left: -0.25rem;
        top: 48%;
        transform: translate(0px, -55%);
      }
    }
  }

  .item{
    background: #fff;
    padding: .24rem .24rem;
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
        display: flex;
        align-items: center;/*垂直居中*/

        .coin{
          margin: 0px .02rem;
        }

        .coinImg{
          width: .4rem;
          margin: 0px .08rem;
          border-radius: 50px;
        }

        .time{
          font-size: .25rem;
          margin-left: .1rem;
          color: $color-999;
        }
      }

      .status{
        flex: 2;
        text-align: right;
        max-width: 2.8rem;
        min-width: 2.8rem;
        font-size: .25rem;
        color: $color-999;
        position: relative;

        &>span{
          display: flex;
          align-items: center;/*垂直居中*/
          justify-content: flex-end;/*水平居中*/
        }

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
          position: relative;
          font-size: .25rem;
          height: .42rem;
          line-height: .42rem;
          min-width: .72rem;
          color: $color-this;
          background: transparent;
          border: 1px solid $color-this;
          border-radius: .08rem;
          padding: 0px .1rem;
        }
      }
    }

    .showContent{
      display: flex;
      // align-items: center;/*垂直居中*/

      .textLeft{
        // padding-left: .4rem;
        text-align: left;
      }

      &>div{
        flex: 3;
        text-align: right;
        margin-right: .1rem;
        max-width: 33%;

        &:last-child{
          margin-right: 0rem;
        }
      }

      .num{
        // height: .45rem;
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
      display: flex;
      align-items: center;/*垂直居中*/
      background-color: #fafafa;
      padding: .2rem 0rem;
      margin-top: .12rem;
      position: relative;

      .detail{
        flex: 9;
        // margin-right: .4rem;
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
            margin-right: .4rem;
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
            margin-right: .4rem;
            height: .5rem;
            line-height: .5rem;
          }
        }
      }

      .go{
        // flex: 1;
        width: .5rem;
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

// 日历控件 style
.date{
  /deep/ .mint-datetime-cancel{
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
  }

  /deep/ .mint-datetime-confirm{
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
  }
  // /deep/ .picker-slot-wrapper{
  //   height: 100px !important;
  //   transform: translate(0px, px) translateZ(0px) !important;
  // }
}
.popupModel{
  background: transparent;
}
// 聚合图标
.swapIcon {
  // position: absolute;
  // top: 0px;
  // right: 0px;
  margin-left: .1rem;
  width: .28rem;
  // transform: translate(110%, 0);
}
.queryAgg {
  margin-right: .15rem;
}
</style>
