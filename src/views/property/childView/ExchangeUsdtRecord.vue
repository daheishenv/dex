<template>
  <section>
    <div class="header-title">
      {{$t('exchange.exchangeRecord')}}
      <!-- <i class="iconfont icon-huaban11" @click="$router.go(-1)"></i> -->
    </div>
    <div>

        <div class="list">
      <mt-loadmore
        :topPullText="$t('public.loadingMoreTip1')"
        :topDropText="$t('public.loadingMoreTip2')"
        :topLoadingText="$t('public.loadingMoreTip3')"
        :bottomPullText="$t('public.loadingMoreTip1')"
        :bottomDropText="$t('public.loadingMoreTip2')"
        :bottomLoadingText="$t('public.loadingMoreTip3')"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false" ref="loadmore">
        <!-- 没有数据 -->
        <div class="noData" v-if="!data.length">
          <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
          <div class="noTip">{{ $t('public.noData') }}</div>
        </div>
        <div class="item" v-else v-for="item in data" :key="item.id">
          <div class="title">
            <div>
              <img src="https://ndi.340wan.com/eos/tethertether-usdt.png" class="img" alt />
              <span>USDT</span>
              <span class="eos-chain color-666">({{item.fromChain.toUpperCase()}}{{$t('exchange.chain')}}</span>
              <i class="iconfont icon-huaban124 iconChain"></i>
              <span class="eos-chain color-666">{{item.toChain.toUpperCase()}}{{$t('exchange.chain')}})</span>
              <span class="time">{{item.createTime.substring(0,10)}}</span>
            </div>

            <!-- // c1 进行中 c2 完成 -->
            <div :class="`c${item.status}`">
              <span v-if="item.status === 0">{{$t('exchange.doing')}}</span>
              <span v-else-if="item.status === 1">{{$t('exchange.completed')}}</span>
              <span v-else>{{$t('quotation.cancel')}}</span>
            </div>
          </div>
          <div class="content">
            <div>
              <p class="m-title">{{$t('exchange.number')}}<span class="eos-chain">({{item.toChain.toUpperCase()}}{{$t('exchange.chain')}})</span></p>
              <p>{{handleToFixed(item.orderCount)}} USDT</p>
            </div>
            <div>
              <p class="m-title">{{item.toChain !== 'eos'? $t('exchange.receiveAdd'):$t('exchange.account')}}
                <span class="eos-chain">({{item.toChain.toUpperCase()}}{{$t('exchange.chain')}})</span>
              </p>
              <p class="elli">{{item.receiver}}</p>
            </div>
          </div>
          <div class="content">
            <div>
              <p class="m-title">{{$t('exchange.usdtFee')}}
                <span class="eos-chain">({{item.toChain.toUpperCase()}}{{$t('exchange.chain')}})</span>
              </p>
              <p class="elli">{{item.fee }} USDT</p>
            </div>
            <div>
              <p class="m-title" v-if="item.toChain !== 'eos'">Hash</p>
              <p class="m-title" v-else>TxID</p>
              <p class="elli" v-if="item.toChain === 'eth'">
                <span v-if="!item.outcomeTrx" class="color-666">-</span>
                <a v-else-if="item.outcomeTrx && ($store.state.app.language == 'en'|| $store.state.app.language == 'ko')"
                class="color-this" :href="`https://cn.etherscan.com/tx/${item.outcomeTrx}`">{{item.outcomeTrx}}</a>
                <a v-else class="color-this" :href="`https://cn.etherscan.com/tx/${item.outcomeTrx}`">{{item.outcomeTrx}}</a>
              </p>
              <p class="elli" v-else-if="item.toChain === 'tron'">
                <a v-if="item.outcomeTrx" class="color-this" :href="`https://tronscan.org/#/transaction/${item.outcomeTrx}`">{{item.outcomeTrx}}</a>
                <span v-else class="color-666">-</span>
              </p>
              <p class="elli" v-else>
                <a v-if="item.outcomeTrx" class="color-this" :href="`https://bloks.io/tx/${item.outcomeTrx}`">{{item.outcomeTrx}}</a>
                <span v-else class="color-666">-</span>
              </p>
            </div>
          </div>
        </div>

      <!-- 没有更多记录 -->
      <div class="noData" v-if="allLoaded && data.length">
        <div class="noTip color-999">{{ $t('public.noMore') }}</div>
      </div>
      </mt-loadmore>
      </div>
    </div>
  </section>
</template>
<script>
import { toFixed } from '@/utils/public';
import { Loadmore } from 'mint-ui'

export default {
  data() {
    return {
      data: [],
      allLoaded: false,
      loading: false,
      page: 1,
      pageSize: 20,
      totalPage: 1,
    };
  },
  components: {
    mtLoadmore: Loadmore,
  },
  methods: {
    handleToFixed(val) {
      return toFixed(val, 4)
    },
    loadBottom() {
      if (this.allLoaded) return
      this.page += 1;
      this.handleGetOrderList(this.page);
    },
    /* 数据请求操作 start */
    handleGetOrderList(page) { // 查询订单记录列表信息
      try {
        // this.symbol = this.$route.params.symbol.toLowerCase();
        this.loading = true;
        const params = {
          currPage: page || 1, // 当前页码
          pageSize: 20, // 每页数量
        };
        this.$http.post('coinConvert/orderList', params).then((res) => {
          if (res.code !== 0) {
            return
          }
          if (res.orderList.length) {
            this.data = [...this.data, ...res.orderList]
            this.$forceUpdate();
          } else {
            this.allLoaded = true;
            this.$refs.loadmore.onBottomLoaded();
          }
          // if (res.page.list.length < params.pageSize) {
          //   console.log(12321);

          //   this.allLoaded = true;
          //   // this.allLoaded = true;// 若数据已全部获取完毕
          //   this.$refs.loadmore.onBottomLoaded();
          // } else {
          //   this.allLoaded = false;
          // }
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetOrderList();
        }, 500);
      }
    },
  },
  created() {
    // const params = JSON.parse(sessionStorage.getItem('exchangeUsdtRecord'))
    // if (!params) {
    //   this.$router.push({ name: 'exchangeUsdt' })
    //   return
    // }
    // this.$http.post('coinConvert/orderList').then((res) => {
    //   if (res.code !== 0) {
    //     return
    //   }
    //   this.data = res.orderList
    // })
    this.handleGetOrderList(1)
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/color.scss";
.c0 {
  color: #4a90e2;
  font-size: 0.25rem;
}
.c1 {
  color: #00be66;
  font-size: 0.25rem;
}
.c2 {
  color: $color-red;
  font-size: 0.25rem;
}
.header-title {
  position: relative;
  width: 100%;
  height: 0.9rem;
  background-color: #fff;
  text-align: center;
  line-height: 0.9rem;
  font-size: 0.36rem;
  color: #000000;
  border-bottom: 0.12rem solid #fafafa;
  .icon-huaban11 {
    position: absolute;
    left: 0.3rem;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
  }
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
  height: calc(100vh - 1.05rem);
  overflow: auto;
   font-size: .3rem;
}
.item {
  margin-bottom: 0.1rem;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 0.24rem 0.3rem;
  box-sizing: border-box;
  .title {
    // height: 1rem;
    display: flex;
    align-items: center;
    padding: .3rem 0;
    justify-content: space-between;
    color: #353442;
    font-size: 0.28rem;
    div {
      display: flex;
      align-items: center;
    }
    .time{
      margin-left: .2rem;
      font-size: 0.21rem;
      color: #9B9B9B;
    }
  }
  .img {
    width: 0.42rem;
    // height: 0.33rem;
    // margin-top: -0.05rem;
    margin-right: 0.1rem;
  }
  .iconChain{
    font-size: .25rem;
    color: #4A90E2;
    margin: 0 .1rem;
    transform: rotate(-90deg);
  }
  .eos-chain {
    font-size: 0.21rem;
    color: #9b9b9b;
  }
  .content {
    display: flex;
    padding-left: .52rem;
    box-sizing: border-box;
    margin-bottom: .16rem;
    div {
      width: 50%;
      // padding-right: 20px;
      // box-sizing: border-box;
      font-size: 0.28rem;
      color: #3A3949;
      .m-title {
        font-size: 0.25rem;
        color: #9b9b9b;
      }
      a{ color: $color-this;}
    }
  }
  .elli {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

