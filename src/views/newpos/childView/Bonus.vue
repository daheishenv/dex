<template>
  <div class="bonus">
    <div class="tools">
      <!-- <div class="backDiv" @click="handleBack"><span class="iconfont icon-huaban11 back"></span></div> -->
      <div class="title">{{ $t('newpos.accountBonusHistory') }}</div>
    </div>

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

      <div class="lists">
        <div class="noData" v-if="!list.length">
          <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
          <div class="tip">{{ $t('public.noData') }}</div>
        </div>
        <div class="list" v-for="(item, $index) in list" :key="$index">
          <div class="top">
            <div class="time">{{ handleToLocalTime(item.poolUtcDate) }}</div>
            <div class="type">{{ $t('newpos.perProfit') }}</div>
          </div>
          <div class="content">
            <div class="flex">
              <div>
                <div class="title">
                  <span>{{ $t('newpos.profitNum') }}(EOS)</span>
                  <span class="smallTip">{{ $t('newpos.profitNum_1') }}</span>
                </div>
                <div class="num">{{ handleToFixed(item.nodeIncome || 0, 4) }}</div>
              </div>
              <div>
                <div class="title">{{ $t('newpos.manaExp') }}(EOS)</div>
                <div class="num">{{ handleToFixed(item.manageFees || 0, 4) }}</div>
              </div>
            </div>
            <div class="trxid">
              <div>TrxID</div>
              <div v-if="item.trxId">
                <div class="short" @click="handleToTx(item.trxId, 'eos')">{{ item.trxId }}</div>
                <div v-if="item.trxId2" class="short mt10" @click="handleToTx(item.trxId2, 'eos')">{{ item.trxId2 }}</div>
                <div v-if="item.trxId3" class="short mt10" @click="handleToTx(item.trxId3, 'eos')">{{ item.trxId3 }}</div>
              </div>
              <div class="noTrxId" v-else>—</div>
            </div>
          </div>
        </div>
      </div>

      <div class="profitTip" v-if="list.length">
        <div>{{ $t('newpos.profitTip') }}</div>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import { toFixed, toLocalTime, toBrowser } from '@/utils/public';

export default {
  data() {
    return {
      page: 1,
      list: [],
      allLoaded: false,
    }
  },
  mounted() {
    this.handleGetBonusList();
  },
  methods: {
    handleBack() {
      history.back();
    },
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    handleToLocalTime(t) {
      return toLocalTime(t)
    },
    // 获取分红收益列表
    handleGetBonusList() {
      const params = {
        currPage: this.page || 1,
        pageSize: 20,
      }
      this.$http.post('/pool/getDividendDetailByPage', params).then((res) => {
        if (res.code !== 0) {
          return;
        }
        const list = res.page.list;
        if (list.length < 20) {
          this.allLoaded = true;
        } else {
          this.allLoaded = false;
        }

        // 判断刷新 / 更多
        if (this.page === 1 || res.page.currPage === 1) {
          this.handleRefresh(list);
          return;
        }
        this.handleTopage(list);
      });
    },
    // 下拉刷新
    loadTop() {
      this.page = 1;
      this.handleGetBonusList();
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      this.handleGetBonusList();
    },
    // 刷新
    handleRefresh(list) {
      this.list = list;
      this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    handleTopage(list) {
      this.list.push(...list);
      this.$refs.loadmore.onBottomLoaded();
    },
    // 查询Tx
    handleToTx(id, chain) {
      toBrowser(id, chain, 'tx', this.$embed);
    },
  },
  beforeDestroy() {
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.mt10{
  margin-top: .1rem;
}

.bonus{
  font-size: .25rem;

  .tools{
    background: #FFF;
    margin-bottom: .1rem;
    position: relative;
    height: .83rem;

    .backDiv{
      position: absolute;
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

    .title{
      height: 100%;
      font-size: .36rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // .myLoadMore{
  //   height: calc(100vh - .9rem);
  // }

  .lists{
    .noData{
      margin-top: 30%;
      text-align: center;
      color: $color-999;
      margin-bottom: .5rem;

      img{
        width: 1.8rem;
      }

      .tip{
        margin-top: .2rem;
      }
    }
    .noMore{
      text-align: center;
      padding-bottom: .2rem;
      font-size: .25rem;
    }
    .list{
      padding: .3rem;
      margin-bottom: .1rem;
      background: #FFF;

      .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .12rem;

        .time{
          color: $color-999;
        }
      }

      .content{
        background: #FAFAFA;
        padding: .3rem;

        .smallTip{
          font-size: .21rem;
        }

        .flex{
          display: flex;
          align-items: center;
          margin-bottom: .2rem;

          &>div{
            flex: 1;

            &>div:first-child{
              color: $color-999;
            }

            .num{
              font-size: .3rem;
            }
          }

          &>div:last-child{
            padding-left: .5rem;
          }
        }

        .trxid{
          display: flex;
          // align-items: center;

          .short{
            margin-left: .2rem;
            width: 2.02rem;
            overflow: hidden;
            color: $color-this;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .noTrxId{
            margin-left: .2rem;
          }
        }
      }
    }
  }

  .profitTip{
    font-size: .24rem;
    padding: .2rem .3rem;
    &>div{
      margin-top: .16rem;
      position: relative;
      padding-left: .15rem;
      color: #4a4a4a;

      &:first-child{
        margin-top: 0rem;
      }

      &::before{
        content: '';
        position: absolute;
        width: .0612rem;
        height: .0612rem;
        background: $color-input;
        border-radius: .10rem;
        left: 0px;
        top: 50%;
        transform: translate(0px, -50%);
      }
    }
  }
}

</style>
