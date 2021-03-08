<template>
  <section>
    <div class="header-title">
      {{$t('exchange.exchangeRecord')}}
      <!-- <i class="iconfont icon-huaban11" @click="$router.go(-1)"></i> -->
    </div>
    <div>
      <!-- 没有数据 -->
      <div class="noData" v-if="!data1.length && !data2.length">
        <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
        <div class="noTip">{{ $t('public.noData') }}</div>
      </div>
      <!-- 状态1 -->
      <div v-if="data1.length">
        <div class="item" v-for="item of data1" :key="item.id">
          <div class="title">
            <div v-if="item.coin === 'EBTC'">
              <img :src="list[0].relImg" class="img" alt />
              <span>BTC</span>
              <span class="eos-chain color-666">(BTC{{$t('exchange.chain')}})</span>
              <i class="iconfont icon-huaban121"></i>
              <img :src="list[0].img" class="img" alt />
              <span>EBTC</span>
              <span class="eos-chain color-666">(EOS{{$t('exchange.chain')}})</span>
            </div>
            <div v-else-if="item.coin === 'EUSD'">
              <img :src="list[1].relImg" class="img" alt />
              <span>USD</span>
              <span class="eos-chain color-666">(BTC{{$t('exchange.chain')}})</span>
              <i class="iconfont icon-huaban121"></i>
              <img :src="list[1].img" class="img" alt />
              <span>EUSD</span>
              <span class="eos-chain color-666">(EOS{{$t('exchange.chain')}})</span>
            </div>

            <!-- // c1 进行中 c2 完成 -->
            <div class="c2">{{$t('exchange.completed')}}</div>
          </div>
          <div class="content">
            <div>
              <p class="m-title">
                {{$t('exchange.account')}}
                <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
              </p>

              <p class="elli">{{item.user}}</p>
            </div>
            <div>
              <p class="m-title">
                {{$t('exchange.number')}}
                <span class="eos-chain">(EOS)</span>
              </p>
              <p>{{item.amount}}</p>
            </div>
          </div>
          <div class="desc">
            <span>TrxID</span>
            <span class="elli">
              <a :href="`https://btc.com/${handleHash(item.extern_tx)}`">{{handleHash(item.extern_tx)}}</a>
            </span>
          </div>
        </div>
      </div>
      <!-- 状态2 -->
      <div v-if="data2.length">
        <div class="item" v-for="item of data2" :key="item.id">
          <div class="title">
            <div v-if="item.coin === 'EBTC'">
              <img :src="list[0].img" class="img" alt />
              <span>EBTC</span>
              <span class="eos-chain color-666">(EOS{{$t('exchange.chain')}})</span>
              <i class="iconfont icon-huaban121"></i>
              <img :src="list[0].relImg" class="img" alt />
              <span>BTC</span>
              <span class="eos-chain color-666">(BTC{{$t('exchange.chain')}})</span>
            </div>
            <div v-else-if="item.coin === 'EUSD'">
              <img :src="list[1].relImg" class="img" alt />
              <span>EUSD</span>
              <span class="eos-chain color-666">(EOS{{$t('exchange.chain')}})</span>
              <i class="iconfont icon-huaban121"></i>
              <img :src="list[1].img" class="img" alt />
              <span>USD</span>
              <span class="eos-chain color-666">(BTC{{$t('exchange.chain')}})</span>
            </div>
            <!-- //  c1 进行中，c2 完成 -->
            <div class="c1" v-if="item.sell">{{$t('exchange.doing')}}</div>
            <div class="c2" v-else> {{$t('exchange.completed')}}</div>
          </div>
          <div class="content">
            <div>
              <p class="m-title">
                {{$t('exchange.receiveAdd')}}

                <span class="eos-chain">(EOS{{$t('exchange.chain')}})</span>
              </p>

              <p class="elli">{{item.to_address}}</p>
            </div>
            <div>
              <p class="m-title">
                {{$t('exchange.number')}}
                <span class="eos-chain">(EOS)</span>
              </p>
              <p>{{item.amount}}</p>
            </div>
          </div>
          <div class="desc">
            <span>TrxID</span>
            <span class="elli">
              <a :href="`https://btc.com/${item.extern_tx}`">
              {{item.extern_tx}}</a>
              </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { getAccountExchangeData } from '@/utils/publicApi';
import { reverseHash } from '@/utils/public';

export default {
  data() {
    return {
      list: [
        {
          type: 0,
          name: 'EBTC',
          relevant: 'BTC',
          img: 'https://ndi.340wan.com/eos/bitpietokens-ebtc.png',
          relImg:
            'https://ndi.340wan.com/upload/20190725/d5757dd9d73f4b78994799ef7e53df90.png',
          percent: 8
        },
        {
          type: 1,
          name: 'EUSD',
          relevant: 'USDT',
          img: 'https://ndi.340wan.com/eos/bitpietokens-eusd.png',
          relImg:
            'https://ndi.340wan.com/upload/20190725/1b3aa8830f584448a1a2f8cb2b717adc.png'
        }
      ],
      data1: [],
      data2: []
    };
  },
  methods: {
    handleHash(val) {
      return reverseHash(val)
    }
  },
  created() {
    getAccountExchangeData('buyorders', (err, res) => {
      if (!err) {
        const data = res.data;
        data.forEach((ele, index) => {
          data[index].coin = ele.amount.split(' ')[1];
        });
        this.data1 = data;
      }
    });
    getAccountExchangeData('sellorders', (err, res) => {
      if (!err) {
        const data = res.data;
        data.forEach((ele, index) => {
          data[index].coin = ele.amount.split(' ')[1];
          data[index].sell = true
        });
        this.data2 = data
      }
    });
    getAccountExchangeData('soldorders', (err, res) => {
      if (!err) {
        const data = res.data;
        data.forEach((ele, index) => {
          data[index].coin = ele.amount.split(' ')[1];
        });
        this.data2.push(...data)
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/color.scss";
.c0 {
  color: $color-red;
  font-size: 0.25rem;
}
.c1 {
  color: #4a90e2;
  font-size: 0.25rem;
}
.c2 {
  color: #00be66;
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

.item {
  margin-bottom: 0.1rem;
  width: 100%;
  min-height: 2.22rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 0.24rem;
  box-sizing: border-box;
  font-size: 0.3rem;
  .title {
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #353442;
    div {
      display: flex;
      align-items: center;
    }
  }
  .img {
    width: 0.42rem;
    height: 0.42rem;
    margin-top: -0.05rem;
    margin-right: 0.1rem;
  }
  .icon-huaban121 {
    font-size: 0.2rem;
    margin-right: 0.1rem;
  }
  .eos-chain {
    font-size: 0.21rem;
    color: #9b9b9b;
  }
  .content {
    display: flex;
    div {
      width: 50%;
      padding-right: 20px;
      box-sizing: border-box;
      .m-title {
        line-height: 0.66rem;
        font-size: 0.25rem;
        color: #9b9b9b;
      }
    }
  }
  .elli {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .desc {
    display: flex;
    height: 1rem;
    align-items: center;
    font-size: 0.25rem;
    color: #4a90e2;
    span:first-child {
      width: 0.7rem;
      font-size: 0.25rem;
      color: #9b9b9b;
      flex-shrink: 0;
    }
    a{
      color:$color-this;
    }
  }
}
</style>

