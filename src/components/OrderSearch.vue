<template>
  <div class="searchDiv" @click="handleBlur">
    <!-- 筛选条件 -->
    <div class="content" :class="{'iosVh': isIOS}">
      <!-- 交易对 -->
      <div class="orderStatus" v-if="$route.name === 'order'">
        <div class="label">{{ $t('public.symbol') }}</div>
        <div class="symbol">
          <span class="fl"><input @click.stop="select = true"
            class="input symbolInput" type="text" v-model="data.coinCode"
            :placeholder="$t('order.inputSymbol')"
            @focus="select = true"></span>

          <!-- 币种浮动窗口 start -->
          <div class="selectMenu" v-if="select && coinCodeJson.list.length !== 0">
            <div class="scroll">
              <div class="select color-333">
                <div class="item" v-for="(item, $index) in coinCodeJson.list" :key="$index" @click.stop="handleSelectItem(item)">
                  <span>{{ `${item.symbol1}/${item.symbol2}` }}</span>
                  <span class="chain" v-if="item.chain.split('-')[0] !== item.chain.split('-')[1]"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 币种浮动窗口 end -->
        </div>
      </div>

      <!-- 订单状态 -->
      <div class="orderStatus" v-if="$route.name !== 'order' && false">
        <div class="label">{{ $t('public.orderStatus') }}</div>
        <div class="chooses">
          <div class="item" v-if="$route.name === 'symbolOrderList'"
            :class="{'active': data.status === 0}" @click="handleStatus(0)">{{ $t('order.status5') }}</div>
          <div class="item" :class="{'active': data.status === 1}" @click="handleStatus(1)">{{ $t('order.status2') }}</div>
          <div class="item" :class="{'active': data.status === 2}" @click="handleStatus(2)">{{ $t('order.status3') }}</div>
          <div class="item" :class="{'active': data.status === 3}" @click="handleStatus(3)">{{ $t('order.status4') }}</div>
        </div>
      </div>
      <div class="orderStatus" v-if="$route.name === 'order' && false">
        <div class="label">{{ $t('public.orderStatus') }}</div>
        <div class="chooses">
          <div class="item" v-if="$route.name === 'order'"
            :class="{'active': orderStatus.doing}" @click="handleStatusList('doing')">{{ $t('order.status5') }}</div>
          <div class="item" :class="{'active': orderStatus.success}" @click="handleStatusList('success')">{{ $t('order.status2') }}</div>
          <div class="item" :class="{'active': orderStatus.cancel}" @click="handleStatusList('cancel')">{{ $t('order.status3') }}</div>
          <div class="item"
            :class="{'active': orderStatus.someSuccess}" @click="handleStatusList('someSuccess')">
            {{ $t('order.status4') }}
          </div>
        </div>
      </div>

      <!-- 交易方向 -->
      <div class="orderStatus orderDoirection">
        <div class="label">{{ $t('public.orderDirection') }}</div>
        <div class="chooses">
          <div class="item" :class="{'active': data.direction === 1}" @click="handleDirection(1)">{{ $t('public.buy') }}</div>
          <div class="item" :class="{'active': data.direction === 2}" @click="handleDirection(2)">{{ $t('public.sell') }}</div>
        </div>
      </div>

      <!-- 不看已撤销订单 -->
      <!-- <div class="orderStatus notSeeCancel" @click="handleStatusList('notWatchCancel')">
        <span class="iconfont choice" :class="{'icon-huaban57': orderStatus.notWatchCancel}"></span>
        <span>{{ $t('order.notWatchCancelOrder') }}</span>
      </div> -->

      <!-- 交易时间 -->
      <div class="orderStatus orderDate" v-if="active === 2">
        <div class="label">{{ $t('exportOrder.time') }}</div>
        <div class="chooses chooseDate">
          <span>
            <span class="input" v-html="data.beginTime || $t('exportOrder.beginDate')" @click="handleOpenPicker(false)"></span>
            <!-- <input v-else class="input" v-model="data.beginTime" :placeholder="$t('exportOrder.beginDate')" type="date"> -->
          </span>
          <span>{{ $t('exportOrder.to') }}</span>
          <span>
            <span class="input input2" v-html="data.endTime || $t('exportOrder.endDate')" @click="handleOpenPicker(true)"></span>
            <!-- <input v-else class="input input2" max="2019-04-05" :placeholder="$t('exportOrder.endDate')" v-model="data.endTime" type="date"> -->
          </span>
        </div>
        <div class="dateError" :class="{'hidden': !showDateError}">{{ $t('exportOrder.dateError') }}</div>
      </div>

      <!-- 导出订单 -->
      <div class="orderStatus orderDate" v-if="active === 2 && $appName === 'eosNewdex' && !$embed">
        <div class="label">{{ $t('exportOrder.exportOrderTitle') }}</div>
        <div class="chooses chooseDate">
          <div class="exportOrder">
            <div class="tip">{{ $t('exportOrder.tip') }}</div>
            <div class="exportOrderBtn" @click.stop="handleExportOrder">{{ $t('exportOrder.exportOrder') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- btn按钮 -->
    <div class="btn iphonex" :class="{'isIOSBtn': isIOS,'historyisIOSBtn': isIOS && $route.name === 'coinHistoryList'}">
      <button class="color-this" @click="handleReset">{{ $t('public.reset') }}</button>
      <button class="sureBtn" @click="handleSure">{{ $t('public.sure') }}</button>
    </div>
  </div>
</template>

<script>
// import { toLocalTime, isIOS } from '@/utils/public';
import { isIOS, handleSearchData, toLocalTime } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';

export default {
  data() {
    return {
      data: {
        coinCode: '', // 模糊查询 - 币种
        symbolId: null,
        status: -1, // 订单状态 - 单选(历史订单使用)
        direction: -1, // 订单方向 - 买入 | 卖出
        date: -1, // 日期 - 暂时隐藏
        flag: [], // 选中不看已撤销订单
        combineTypes: '', // 订单状态 - 多选(订单页面使用)
        hideCancelOrder: 0,
        area: '', // 分区
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
      },
      pickerVisible: '',
      isIOS: false,
      orderStatus: {
        doing: false,
        success: false,
        cancel: false,
        someSuccess: false,
        notWatchCancel: false,
      },
      showAreaList: false,
      showDateError: false,
      coinCodeJson: { // 币种筛选列表
        key: '',
        keyId: null,
        list: []
      },
      select: false,
    }
  },
  props: [
    'searchData',
    'active',
    'hideCancel',
    'startDate',
    'endDate',
    'historyType',
  ],
  watch: {
    'orderStatus.notWatchCancel': function listen(newVal) {
      if (newVal) {
        this.orderStatus.cancel = false;
        this.data.status = -1;
      }
    },
    'orderStatus.cancel': function listen(newVal) {
      if (newVal) {
        this.orderStatus.notWatchCancel = false;
      }
    },
    'data.status': function listen(newVal) {
      if (newVal === 2) {
        this.orderStatus.notWatchCancel = false;
      }
    },
    'data.coinCode': function listen(newVal) {
      if (!newVal) {
        this.data.symbolId = '';
        this.coinCodeJson.list = [];
        return;
      }
      this.coinCodeJson.list = handleSearchData(newVal, this)
    },
  },
  created() {
    this.isIOS = isIOS();
  },
  mounted() {
    this.data = this.searchData ? JSON.parse(this.searchData) : this.data;
    if (this.data.coinCode) {
      this.coinCodeJson.key = this.data.coinCode;
    }
    if (this.data.hideCancelOrder) {
      this.orderStatus.notWatchCancel = true;
    }
    if (this.data.combineTypes) {
      const arr = this.data.combineTypes.split(',');
      arr.forEach((val) => {
        if (Number(val) === 1) {
          this.orderStatus.doing = true;
        }
        if (Number(val) === 2) {
          this.orderStatus.success = true;
        }
        if (Number(val) === 3) {
          this.orderStatus.cancel = true;
        }
        if (Number(val) === 4) {
          this.orderStatus.someSuccess = true;
        }
      });
    }
  },
  methods: {
    // 筛选选中
    handleSelectItem(item) {
      this.coinCodeJson.key = `${item.symbol1}/${item.symbol2}`;
      this.coinCodeJson.keyId = item.id;
      this.data.coinCode = this.coinCodeJson.key;
      this.data.symbolId = item.id;
      this.handleBlur()
    },
    // 失去焦点事件
    handleBlur() {
      this.select = false;
      if (this.coinCodeJson.key !== this.data.coinCode) {
        this.data.coinCode = '';
        this.data.symbolId = '';
        this.coinCodeJson.list = []
      }
    },
    // 日历控件 - true: 结束日期 | false: 开始日期
    handleOpenPicker(type) {
      const data = {
        status: 'date',
        type
      }
      this.$emit('listenExportOrder', data);
    },
    // 订单导出
    handleExportOrder() {
      // emit参数
      const data = {
        status: 'send',
      }
      if (!this.$store.state.app.vipInfo.email) {
        data.status = 'toBindEmail'
        this.$emit('listenExportOrder', data);
        return;
      }

      if (this.data.beginTime && this.data.endTime && (this.data.endTime < this.data.beginTime)) {
        this.showDateError = true;
        return;
      }
      this.showDateError = false;
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleExportOrder()
        })
        return;
      }
      const params = {
        accountNo: this.$store.state.app.accountInfo.account, // 账户名
        symbol: this.$route.params.symbol || '', // 币种
        symbolId: this.data.symbolId,
        valuationCoinCode: this.data.area, // 查询分区
        orderByName: 'update_ts',
        orderByType: 'desc',
        direction: '', // 方向
        orderStatus: '', // 订单状态
        dealStatus: '', // 成交状态
        beginDate: this.data.beginTime || toLocalTime(this.startDate).substr(0, 10), // 开始时间
        endDate: this.data.endTime || toLocalTime(this.endDate).substr(0, 10), // 结束时间
        combineTypes: this.data.combineTypes, // 组合查询类型：1 - 进行中；2 - 已成交；3 - 已撤销；4 - 部分成交[已撤销]
        hideCancelOrder: this.data.hideCancelOrder ? 1 : 0,
        historyType: this.historyType,
      }
      // 处理订单状态
      if (this.data.status !== -1) {
        params.orderStatus = this.data.status;
      }
      // 未成交 & 已撤销
      if (this.data.status === 2) {
        params.orderStatus = 2;
        params.dealStatus = 0;
      }
      // 部分成交[已撤销]
      if (this.data.status === 3) {
        params.orderStatus = 2;
        params.dealStatus = 1;
      }
      // 处理交易方向
      if (this.data.direction !== -1) {
        params.direction = this.data.direction;
      }
      params.hideCancelOrder = this.hideCancel ? 1 : 0;
      this.$http.post('/order/exportHistoryOrderToEmail', params).then((res) => {
        // 授权过期处理
        if (res.code === 401) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleExportOrder()
            })
          }, 1000);
          return;
        }
        // 操作频繁
        if (res.code === 1016) {
          data.status = 'toMore'
          this.$emit('listenExportOrder', data);
          return;
        }
        // 无订单信息
        if (res.code === 1017) {
          data.status = 'noOrderList'
          this.$emit('listenExportOrder', data);
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
        this.$emit('listenExportOrder', data);
      });
    },
    // 订单状态点击事件
    handleStatus(i) {
      if (i === this.data.status) {
        this.data.status = -1;
        return;
      }
      this.data.status = i;
    },
    // 交易方向点击事件
    handleDirection(i) {
      if (i === this.data.direction) {
        this.data.direction = -1;
        return;
      }
      this.data.direction = i;
    },
    // 交易时间点击事件
    handleDate(i) {
      if (i === this.data.date) {
        this.data.date = -1;
        return;
      }
      this.data.date = i;
    },
    // 订单状态多选
    handleStatusList(type) {
      this.orderStatus[type] = !this.orderStatus[type];
    },
    // 重置
    handleReset() {
      this.data = {
        coinCode: '', // 模糊查询 - 币种
        symbolId: null,
        status: -1, // 订单状态 - 单选(历史订单使用)
        direction: -1, // 订单方向 - 买入 | 卖出
        date: -1, // 日期 - 暂时隐藏
        flag: [], // 选中不看已撤销订单
        combineTypes: '', // 订单状态 - 多选(订单页面使用)
        hideCancelOrder: 0,
        area: '', // 分区
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
      }
      this.orderStatus = {
        doing: false,
        success: false,
        cancel: false,
        someSuccess: false,
        notWatchCancel: false,
      }
    },
    // 确定
    handleSure() {
      if (this.$route.name === 'order') {
        // 订单多状态
        const combineTypes = [];
        let index = 1;
        for (const key in this.orderStatus) { // eslint-disable-line
          if (this.orderStatus[key] && key !== 'notWatchCancel') {
            combineTypes.push(index)
          }
          index += 1;
        }
        this.data.combineTypes = combineTypes.join(',');
        // 不看已撤销
        this.data.hideCancelOrder = false;
        if (this.orderStatus.notWatchCancel) {
          this.data.hideCancelOrder = true;
        }
        this.$emit('listenSure', this.data);
        return;
      }
      // 不看已撤销
      this.data.hideCancelOrder = false;
      if (this.orderStatus.notWatchCancel) {
        this.data.hideCancelOrder = true;
      }
      this.$emit('listenSure', this.data);
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .searchDiv{
    // height: calc(100vh - .6rem) !important;

    .iphonex{
      bottom: .5rem !important;
    }
  }
}

.symbolInput::-webkit-input-placeholder{
  color: $color-999;
  font-size: .25rem;
}

.searchDiv{
  width: 5.6rem;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 1rem;

  .content{
    padding: .36rem;

    // &.iosVh{
    //   height: calc(100% - 1.9rem);
    // }

    .notSeeCancel{
      font-size: .25rem;
      display: flex;
      align-items: center;/*垂直居中*/

      .choice{
        border: 1px solid $color-e3e3e3;
        display: inline-block;
        height: .3rem;
        width: .3rem;
        font-size: .3rem;
        border-radius: .04rem;
        color: $color-this;
        margin-right: .19rem;

        &.icon-huaban57{
          border: 1px solid transparent;
        }
      }
    }

    .orderStatus{
      margin-bottom: .4rem;

      .symbol{
        height: .62rem;
        line-height: .62rem;
        text-align: center;
        padding-right: .12rem;
        margin-top: .2rem;
        position: relative;

        &>span{
          font-size: .3rem;
        }

        .input{
          border: 1px solid $color-e3e3e3;
          font-size: .3rem;
          height: .6rem;
          text-align: center;
          width: 2.3rem;
          border-radius: .12rem;
          display: inline-block;

          &:disabled{
            background: #FFF;
          }
        }

        &>span:last-child .input{
          background: #FFF;
          color: $color-333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .areaCoinListOutDiv{
          position: relative;
        }

        .areaCoinList{
          position: absolute;
          width: 100%;
          border: 1px solid $color-e3e3e3;
          background: #FFF;
          margin-top: .15rem;
          border-radius: .13rem;
          box-shadow: 0 0 .07rem #f0f0f0;

          &::before{
            content: '';
            position: absolute;
            border: 1px solid $color-e3e3e3;
            width: .15rem;
            height: .15rem;
            background: #FFF;
            transform: translate(-50%, -50%) rotate(45deg);
            box-shadow: 0 0 .07rem #f0f0f0;
          }

          &>div{
            position: relative;
            z-index: 10;
            background: #FFF;
            border-radius: .13rem;
            border-bottom: 1px solid $color-e3e3e3;
            height: 1rem;
            line-height: 1rem;
          }
        }

        // 筛选框
        .selectMenu{
          background: white;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          // width: 2rem;
          position: absolute;
          left: 0rem;
          top: .8rem;
          border-radius: .13rem;
          text-align: center;
          box-sizing: border-box;
          z-index: 1000;

          &::after{
            content: '';
            border: .1rem solid white;
            position: absolute;
            top: -.1rem;
            box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
            transform: rotate(45deg);
          }

          .scroll{
            z-index: 1000;
            position: relative;
            max-height: 4.6rem;
            overflow: auto;
            padding: 0rem .33rem;
            background: white;
            border-radius: .13rem;
          }

          .select{
            position: relative;
            z-index: 10;;
            background: #FFF;
            font-size: .25rem;

            &>div{
              font-size: .27rem;
              position: relative;
              height: .9rem;
              border-bottom: 1px solid $color-e3e3e3;
              display: flex;
              align-items: center;
              box-sizing: border-box;

              &:last-child{
                border-bottom: 0px solid $color-e3e3e3;
              }

              // 跨链
              .chain{
                width: 17px;
                height: 17px;
                color: $color-yellow;
                transform: translate(0%, -5%);
                background: url('/static/img/market/chain.png') no-repeat;
                background-size: 100% 100%;
                background-position: center center;
                margin-left: .08rem;
              }
            }
          }
        }
      }

      .label{
        font-size: .3rem;
      }

      .chooses{
        font-size: .25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        &.chooseDate{
          margin-top: .2rem;
          flex-wrap: nowrap;
          color: $color-999;
        }

        .input{
          border: 1px solid $color-input;
          font-size: .25rem;
          width: 2.3rem;
          height: .6rem;
          margin-right: .05rem;
          border-radius: .07rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF;
        }

        .input2{
          margin-right: 0rem;
          margin-left: .05rem;
        }

        .item{
          text-align: center;
          min-width: 2.3rem;
          max-width: 2.3rem;
          flex: 4;
          height: .6rem;
          line-height: .6rem;
          background: $active-white;
          border-radius: .12rem;
          border: 1px solid transparent;
          margin-top: .2rem;
        }

        .active{
          border: 1px solid $color-this;
          color: $color-this;
        }

        .item:nth-child(2n-1){
          margin-right: .12rem;
        }
      }

      .dateError{
        color: $color-red;
        font-size: .18rem;
        padding-top: .08rem;
        padding-left: .1rem;

        &.hidden{
          visibility: hidden;
        }
      }

      .exportOrder{
        text-align: center;
        font-size: .25rem;
        text-align: left;

        .exportOrderBtn{
          color: $color-this;
          border: 1px solid $color-this;
          width: 2.3rem;
          height: .6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: .07rem;
          margin-top: .3rem;
        }

        .tip{
          margin-top: .18rem;
          color: $color-999;
        }
      }
    }
  }

  .btn{
    position: absolute;
    bottom: 0px;
    width: 100%;
    display: flex;
    align-items: center;/*垂直居中*/
    border-top: 1px solid $color-e3e3e3;

    // &.isIOSBtn{
    //   bottom: .5rem !important;
    // }

    &.historyisIOSBtn{
      bottom: 0rem !important;
    }

    &>button{
      background: #FFF;
      font-size: .32rem;
      height: 1rem;
      flex: 1;
    }

    &>button:active{
      background: $active-white;
    }

    .sureBtn{
      background: $color-this;
      color: #FFF;
    }
  }
}

</style>
