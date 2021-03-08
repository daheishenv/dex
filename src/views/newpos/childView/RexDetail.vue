<template>
  <div class="rexDetail">
    <div class="tools">
      <!-- <div class="backDiv" @click="handleBack"><span class="iconfont icon-huaban11 back"></span></div> -->
      <div class="title">{{ $t('newpos.toUnlock') }} REX</div>
    </div>

    <div class="content">
      <div class="noData" v-if="!lists.length">
        <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div class="tip">{{ $t('public.noData') }}</div>
      </div>
      <div class="item" v-for="(item, $index) in lists" :key="$index">
        <div>
          <div class="subTitle">{{ $t('newpos.buyTime') }}</div>
          <div>{{ toLocalTime(item.tradeTime).substr(0, 16) }}</div>
        </div>
        <div>
          <div class="subTitle">{{ $t('newpos.rexNum') }}(REX)</div>
          <div class="num">{{ item.rexCount }}</div>
        </div>
        <div>
          <div class="subTitle">{{ $t('newpos.unlockTime') }}</div>
          <div>{{ toLocalTime(item.unlockTime).substr(0, 16) }}</div>
        </div>
        <div>
          <div class="subTitle">TrxID</div>
          <div class="trxId" @click="handleToTx(item.trxId, 'eos')">{{ item.trxId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Decimal } from 'decimal.js'
// import { getAccountRexData } from '@/utils/publicApi';
import { toFixed, toLocalTime, toBrowser } from '@/utils/public';

export default {
  data() {
    return {
      rexData: {},
      lists: [],
    }
  },
  mounted() {
    this.handleGetUnlock();
  },
  methods: {
    handleBack() {
      history.back();
    },
    toFixed(n, l) {
      return toFixed(n, l);
    },
    toLocalTime(t) {
      return toLocalTime(t)
    },
    handleGetUnlock() {
      // getAccountRexData((err, res) => {
      //   if (err || res.code !== 0) {
      //     return;
      //   }
      //   this.rexData = res.data;
      //   const lists = this.rexData.rex_maturities || [];
      //   lists.forEach((item) => {
      //     this.$set(item, 'time', toLocalTime(`${item.first}.000+0000`))
      //     const count = Decimal.div(item.second, 10000).toString();
      //     this.$set(item, 'count', toFixed(count, 4));
      //   });
      //   this.lists = lists;
      // });
      this.$http.post('/pool/getUnunlockedRexList').then((res) => {
        if (res.code !== 0) {
          return;
        }
        const lists = res.ununlockedRexList || [];
        // lists.forEach((item) => {
        //   this.$set(item, 'time', toLocalTime(`${item.first}.000+0000`))
        //   const count = Decimal.div(item.second, 10000).toString();
        //   this.$set(item, 'count', toFixed(count, 4));
        // });
        this.lists = lists;
      });
    },
    // 查询Tx
    handleToTx(id, chain) {
      toBrowser(id, chain, 'tx', this.$embed);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rexDetail{
  font-size: .25rem;
  position: relative;

  .tools{
    height: .9rem;
    margin-bottom: .1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .3611rem;
    background: #FFF;
    position: relative;

    .backDiv{
      position: absolute;
      left: 0px;
      height: 100%;
      width: .7rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .back{
        font-size: .3rem;
        display: block;
        transform: rotate(180deg);
      }
    }
  }

  .content{
    .noData{
      margin-top: 30%;
      text-align: center;
      color: $color-999;

      img{
        width: 1.8rem;
      }

      .tip{
        margin-top: .2rem;
      }
    }

    .item{
      margin-top: .09rem;
      background: #FFF;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: .3rem .36rem;

      &>div{
        float: 1;
        min-width: 50%;
        margin-bottom: .27rem;

        .subTitle{
          color: $color-999;
        }

        &>div:last-child{
          margin-top: .1rem;
        }

        .num{
          // font-size: .3rem;
          margin-top: .07rem !important;
        }

        .trxId{
          color: $color-this;
          width: 1.67rem;
          overflow: hidden;
          word-break: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
