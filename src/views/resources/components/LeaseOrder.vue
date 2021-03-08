<template>
  <div class="lists">
    <!-- 没有数据 -->
    <div class="noData" v-if="!lists.length">
      <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
      <div class="noTip">{{ $t('order.noOrderList') }}</div>
    </div>

    <div class="item" v-for="(item, $index) in lists" :key="$index">
      <div class="top">
        <div class="left">
          <span class="type">{{ $t('resources.rentShort') }}</span>
          <span class="cpu">{{ item.type }}</span>
          <!-- <span class="time">{{ item.beginDate.substr(0, 16) }}</span> -->
        </div>
        <div class="right color-green">
          <span>{{ $t('resources.renting') }}</span>
        </div>
      </div>
      <div class="bottom">
        <div>
          <div class="btTitle">{{ $t('resources.number') }}(EOS)</div>
          <div class="btNum">{{ item.total_staked.split(' ')[0] }}</div>
        </div>
        <div>
          <div class="btTitle">{{ $t('resources.rentPrice') }}(EOS)</div>
          <div class="btNum">{{ item.payment.split(' ')[0] }}</div>
        </div>
        <div>
          <div class="btTitle">{{ $t('newpos.receiveAccount') }}</div>
          <div class="btNum trxid" @click="handleToAccount(item.receiver, $store.state.app.accountInfo.chain)">
            <span>{{ item.receiver }}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div>
          <div class="btTitle">{{ $t('resources.isRenewal') }}</div>
          <div class="btNum color-green" v-if="item.isLease">{{ $t('resources.yes') }}</div>
          <div class="btNum" v-else>{{ $t('resources.no') }}</div>
        </div>
        <div>
          <div class="btTitle">{{ $t('resources.renewalNum') }}(EOS)</div>
          <div class="btNum">
            <span>{{ item.balance.split(' ')[0] }}</span>
          </div>
        </div>
        <div>
          <div class="btTitle">{{ $t('resources.leaseTerm') }}</div>
          <div class="btNum">
            <span>{{ item.days }}{{ $t('resources.day') }}</span>
            <span class="mana" @click="handleSetting(item)">{{ $t('resources.mgt') }}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div>
          <div class="btTitle">{{ $t('resources.beginTime') }}</div>
          <div class="btNum">{{ item.beginDate.substr(0, 20) }}</div>
        </div>
        <div>
          <div class="btTitle">{{ $t('resources.overTime') }}</div>
          <div class="btNum">{{ item.endDate.substr(0, 20) }}</div>
        </div>
      </div>
    </div>

    <!-- 管理续租租金 -->
    <mt-popup
      class="popup"
      v-model="showRents"
      popup-transition="popup-fade">
      <LeaseRenewalRents v-if="showRents"
        :popupData="popupData"
        :balance="balance"
        :hasReserves="hasReserves"
        :time="time"
        @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js'
import { toLocalTime, toBrowser, toFixed } from '@/utils/public';
import LeaseRenewalRents from '@/views/resources/popup/LeaseRenewalRents';

export default {
  data() {
    return {
      showRents: false,
      channelRef: 'dapp',
      lists: [],
      cpuLists: [],
      netLists: [],
      popupData: null,
    }
  },
  props: [
    'balance',
    'hasReserves',
    'time',
  ],
  components: {
    LeaseRenewalRents, // 管理续租租金
    mtPopup: Popup,
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
    },
    cpuLists: {
      handler: function listen(newVal) {
        this.lists = [];
        const lists = [...newVal, ...this.netLists];
        const arr = lists.sort((obj1, obj2) => {
          if (obj1.time > obj2.time) {
            return -1;
          }
          return 1;
        })
        this.lists = arr;
      },
      deep: true,
    },
    netLists: {
      handler: function listen(newVal) {
        this.lists = [];
        const lists = [...newVal, ...this.cpuLists];
        const arr = lists.sort((obj1, obj2) => {
          if (obj1.loan_num > obj2.loan_num) {
            return -1;
          }
          return 1;
        })
        this.lists = arr;
      },
      deep: true,
    },
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      // 判断是否是h5
      this.channelRef = localStorage.getItem('channelRef') || 'dapp';
      if (this.channelRef === 'h5') {
        return;
      }
      this.handleGetLists();
    },
    // 查询Tx
    handleToAccount(account, chain) {
      if (account.indexOf('*') !== -1) {
        return;
      }
      toBrowser(account, chain, 'account', this.$embed);
    },
    // 处理链上时间
    handleDealChainDate(time) {
      const zone = moment().zone() / 60; // 时区
      const jsTime = moment(time).add(0 - zone, 'hours').format('YYYY/MM/DD HH:mm:ss'); // 解锁时间
      return jsTime;
    },
    // 获取账户租赁订单
    handleGetLists(cb) {
      // 查询cpu
      const params = {
        code: 'eosio',
        index_position: 3,
        json: true,
        key_type: 'name',
        limit: 100,
        lower_bound: this.$store.state.app.accountInfo.account,
        scope: 'eosio',
        table: 'cpuloan',
        table_key: '',
        upper_bound: this.$store.state.app.accountInfo.account,
      }
      const chain = this.$store.state.app.accountInfo.chain;
      const net = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
      if (chain !== 'eos') {
        return;
      }
      let count = 0;
      // axios.post('https://mainnet.eoscanada.com/v1/chain/get_table_rows', JSON.stringify(params)).then((res) => {
      axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
        count += 1;
        if (count === 2 && cb) {
          cb();
        }
        if (res.data && res.data.rows.length >= 1) {
          const cpuLists = res.data.rows;
          this.cpuLists = this.handleDealChaindata(cpuLists, 'CPU');
          return
        }
        this.cpuLists = [];
      });
      //  查询net
      params.table = 'netloan';
      // axios.post('https://mainnet.eoscanada.com/v1/chain/get_table_rows', JSON.stringify(params)).then((res) => {
      axios.post(`${net}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
        count += 1;
        if (count === 2 && cb) {
          cb();
        }
        if (res.data && res.data.rows.length >= 1) {
          const netLists = res.data.rows;
          this.netLists = this.handleDealChaindata(netLists, 'NET');
          return;
        }
        this.netLists = [];
      });
    },
    // 处理链上数据
    handleDealChaindata(list, type) {
      const cpuLists = list;
      cpuLists.forEach((item) => {
        const jsTime = this.handleDealChainDate(item.expiration);
        this.$set(item, 'endDate', toLocalTime(jsTime))
        const sec = moment(jsTime).second();
        const minute = moment(jsTime).minute();
        const hour = moment(jsTime).hour();
        const date = moment(jsTime).date();
        let month = moment(jsTime).month();
        const year = moment(jsTime).year();
        const day = date - 30;
        if (day > 0) {
          month += 1;
        }
        const beginDate = new Date(year, month, day, hour, minute, sec);
        this.$set(item, 'beginDate', toLocalTime(beginDate));
        this.$set(item, 'time', Date.parse(beginDate));
        this.$set(item, 'type', type);
        const balance = Number(item.balance.split(' ')[0]);
        const pay = Number(item.payment.split(' ')[0]);
        this.$set(item, 'isLease', balance >= pay ? 1 : 0);
        const cycle = Decimal.div(Number(item.balance.split(' ')[0]), Number(item.payment.split(' ')[0]));
        const days = Decimal.mul(toFixed(cycle, 0), this.time);
        this.$set(item, 'days', toFixed(days, 0));
      });
      return cpuLists;
    },
    // 打开管理弹窗
    handleSetting(item) {
      this.popupData = item;
      this.showRents = true;
    },
    // 关闭弹窗
    handleClose(type) {
      if (type) {
        this.handleGetLists();
      }
      this.showRents = false;
    },
  },
  beforeDestroy() {
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.lists{
  font-size: .25rem;
  background: #fafafa;

  .noData{
    text-align: center;
    padding: .5rem 0px;
    background: #FFF;

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

  .item{
    padding: .31rem .24rem .22rem;
    background: #FFF;
    margin-bottom: .25rem;

    &:last-child{
      margin-bottom: 0;
    }

    .top{
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left{
        display: flex;
        align-items: center;

        .type{
          color: $color-green;
          font-size: .32rem;
          margin-right: .15rem;
        }
        .cpu{
          font-size: .3rem;
          margin-right: .44rem;
        }
        .time{
          color: $color-999;
        }
      }
    }

    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: $color-999;
      margin-top: .21rem;

      &>div{
        flex: 3;
        text-align: right;

        &:first-child{
          flex: 2;
          text-align: left;
        }
        &:nth-child(2){
          flex: 2;
        }
      }

      .btNum{
        color: $color-333;
        font-size: .3rem;
        line-height: .42rem;
        margin-top: .02rem;

        .mana{
          font-size: .28rem;
          color: $color-this;
          margin-left: .1rem;
        }

        &.trxid{
          display: flex;
          justify-content: flex-end;

          &>span{
            // max-width: 2.07rem;
            overflow: hidden;
            word-break: normal;
            // text-overflow: ellipsis;
            white-space: nowrap;
            font-size: .25rem;
            color: $color-this;
          }
        }
      }
    }
  }
}
.popup{
  top: 40%;
  transform: translate(-50%, -40%);
  background: transparent;
}
</style>
