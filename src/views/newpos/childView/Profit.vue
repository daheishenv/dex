<template>
  <div class="profit">
    <div class="top">
      <div class="tools">
        <div class="backDiv">
          <!-- <span class="iconfont icon-huaban11 back"></span> -->
        </div>
        <div class="title">{{ $t('newpos.profit') }}</div>
        <div class="backDiv"><span class="iconfont question"></span></div>
      </div>

      <div class="data">
        <div class="percent">{{ posInfo.maxAnnualizedRate || '0.00' }}%</div>
        <div>
          <span>{{ $t('newpos.ysdMaxProfit') }}</span>
          <span class="posDetail" @click="showDetail = true">{{ $t('newpos.detail') }}</span>
        </div>
      </div>
    </div>

    <div class="lists">
      <div class="list" v-for="(item, $index) in list" :key="$index">
        <div class="bg" :style="`width: ${item.width}%;`"
          :class="{'today': $index === 0}">
        </div>
        <div class="data" :class="{'today': $index === 0}">
          <div class="time">{{ item.time }}</div>
          <div class="pre">{{ item.annualizedRate }}%</div>
        </div>
      </div>
    </div>

    <!-- 昨日最高年化收益 start -->
    <mt-popup
      class="popup"
      v-model="showDetail"
      popup-transition="popup-fade">
      <PopupYsdBonus v-if="showDetail" :posInfo="posInfo" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 昨日最高年化收益 end -->
  </div>
</template>

<script>
import { toLocalTime } from '@/utils/public';
import { Decimal } from 'decimal.js'
import PopupYsdBonus from '../components/PopupYsdBonus';

export default {
  data() {
    return {
      showDetail: false,
      posInfo: {},
      list: [],
    }
  },
  components: {
    PopupYsdBonus,
  },
  mounted() {
    this.handleGetPosInfo()
    this.handleGetPosLists();
  },
  methods: {
    handleToLocalTime(t) {
      return toLocalTime(t)
    },
    handleBack() {
      history.back();
    },
    handleClose() {
      this.showDetail = false;
    },
    // 获取矿池信息
    handleGetPosInfo() {
      this.$http.post('/pool/getPoolInfo').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.posInfo = res.poolInfo || {};
      });
    },
    // 获取矿池信息
    handleGetPosLists() {
      this.$http.post('/pool/getIncomeTrendList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        const list = res.incomeTrendList || [];
        let maxProfit = 0;
        list.forEach((item) => {
          const time = toLocalTime(item.incomeDate).substr(0, 10);
          this.$set(item, 'time', time);
          if (maxProfit < Number(item.annualizedRate)) {
            maxProfit = Number(item.annualizedRate);
          }
        });
        list.forEach((item) => {
          if (!Number(maxProfit)) {
            this.$set(item, 'width', 50);
            return;
          }
          let width = Decimal.div(item.annualizedRate, maxProfit).toString();
          width = Decimal.mul(width, 100).toString();
          this.$set(item, 'width', width);
        });
        this.list = list;
      });
    },
  },
  beforeDestroy() {
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.profit{
  font-size: .25rem;
  background: #fafafa;

  .top{
    padding-top: .1rem;
    color: #fff;
    background-image: linear-gradient(-1deg, #14152B 0%, #2C3859 100%);

    .tools{
      height: .83rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .backDiv{
        height: 100%;
        width: .7rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .back{
          display: block;
          font-size: .3rem;
          transform: rotate(180deg);
        }

        .question{
          font-size: .3rem;
        }
      }

      .title{
        display: flex;
        align-items: center;
        justify-content: center;
        height: .73rem;
        font-size: .36rem;
      }
    }

    .data{
      padding: .51rem 0 .57rem;
      text-align: center;

      .percent{
        font-size: .54rem;
        color: #F2DBA4;
        margin-bottom: .09rem;
      }

      .posDetail{
        color: #F2DBA4;
        margin-left: .15rem;
      }
    }
  }

  .lists{
    .list{
      margin-top: .21rem;
      background: #FFF;
      position: relative;

      .bg{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #EBEBEB;
        height: .75rem;
        color: #8B572A;
        box-sizing: border-box;

        &.today{
          background: #F2DBA4;
        }

        .time{
          color: $color-333;
        }
      }

      .data{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: .75rem;
        z-index: 100;
        padding: 0 .21rem 0 .3rem;
        color: $color-999;

        &.today{
          color: $color-333;
          .pre{
            color: #F5A623;;
          }
        }
      }
    }
  }
}
.popup{
  background: transparent;
  transform: translate(-50%, -80%)
}
</style>
