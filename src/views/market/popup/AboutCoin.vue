<template>
  <div class="specialTip">
    <span class="iconfont icon-huaban17" @click="handleClose"></span>
    <div class="title">{{$t('lineK.about',{title:coinTitle})}}</div>

    <!-- <div class="tip" v-if="coinTitle === 'CUSD'">{{$t('lineK.CUSD')}}</div>
    <div class="tip" v-else-if="coinTitle === 'EUSD'">
      <p>{{$t('lineK.EUSD')}}</p>
      <p>{{$t('lineK.EUSD2')}}</p>
    </div>
    <div class="tip" v-else-if="coinTitle === 'EOSDT'">
      {{$t('lineK.EOSDT')}}
    </div>
    <div class="tip" v-else-if="coinTitle === 'ZIG'">
      {{$t('lineK.ZIG')}}
    </div>
    <div class="tip" v-else-if="coinTitle === 'USDE'">
      {{$t('lineK.USDE')}}
    </div>
    <div class="tip" v-else-if="coinTitle === 'PAXE'">
      <p>{{$t('lineK.PAXE1')}}</p>
      <p>{{$t('lineK.PAXE2')}}</p>
    </div>
    <div class="tip" v-else-if="coinTitle === 'USDT'">
      <p>{{$t('lineK.USDT')}}</p>
    </div>
    <div class="tip" v-else-if="coinTitle === 'USN'">
      <p>{{$t('lineK.usn1')}}</p>
      <p>{{$t('lineK.usn2')}}</p>
      <p>{{$t('lineK.usn3')}}</p>
      <p>{{$t('lineK.usn4')}}</p>
    </div> -->
    <div class="tip" v-html="introduction"></div>
    <div class="info-box">
      <div class="info">
        <span>{{$t('lineK.issueNum')}}</span>
        <a @click="handleToBrowser(`${coinInfo.code}-eos-${coinInfo.contract}`, 'eos', 'token')">
          {{coinInfo.publishCount?coinInfo.publishCount:'-'}}</a>
      </div>
      <div class="info">
        <span>{{$t('lineK.circulationNum')}}</span>
        <a @click="handleToBrowser(`${coinInfo.code}-eos-${coinInfo.contract}`, 'eos', 'token')">
          {{coinInfo.circulateCount?coinInfo.circulateCount:'-'}}</a>
      </div>
      <div class="info">
        <span>{{$t('lineK.contract')}}</span>
        <a @click="handleToBrowser(coinInfo.contract, chain, 'account')">{{coinInfo.contract?coinInfo.contract:'-'}}</a>
      </div>
      <div class="info">
        <span>{{$t('lineK.website')}}</span>
        <a :href="coinInfo.website?coinInfo.website:'#'" target="_blank">{{coinInfo.website?coinInfo.website:'-'}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toBrowser } from '@/utils/public';

export default {
  data() {
    return {
      coinInfo: {},
      introduction: '',
    }
  },
  methods: {
    // 去浏览器
    handleToBrowser(id, chain, type) {
      toBrowser(id, chain, type, this.$embed);
    },
    handleClose() {
      this.$emit('listenClose', false);
    },
    async getById() {
      const params = {
        symbol: this.$route.params.symbol,
      }
      // console.log(this.$route.params.symbol, bitpietokens)
      await this.$http.get('/symbol/getSymbolInfo', { params }).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.coinInfo = res.valuationCoinInfo
        this.introduction = res.valuationCoinInfo.introduction.replace(/\n/g, '<br/>');

        // console.log(res.valuationCoinInfo);
        const { publishCount, circulateCount, code, contract } = res.valuationCoinInfo
        if (!publishCount || !circulateCount) {
          const param = {
            code: contract,
            symbol: code,
          };
          // console.log(publishCount, circulateCount,'没值请求axios 接口'); // eslint-disable-line
          // 获取不同链的币种流通量
          let nodeHttp = this.$store.state.sys.nodeList.eosNode.httpEndpoint;
          const chain = this.$store.state.app.trad.baseChain || 'eos';
          if (this.$store.state.app.trad && chain !== 'eos') { // 非eos链数据
            nodeHttp = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
          }
          axios.post(`${nodeHttp}/v1/chain/get_currency_stats`, JSON.stringify(param), {
            headers: {
              'Content-Type': 'text/plain;charset=UTF-8',
            }
          }).then((result) => {
            if (result.status !== 200 && result.status !== 304) {
              return;
            }
            const resp = result.data;
            this.coinInfo.publishCount = parseInt(resp[code].max_supply, 10);
            this.coinInfo.circulateCount = parseInt(resp[code].supply, 10);
          }).catch((error) => { // 错误处理
              console.log(error); // eslint-disable-line
          })
        }
      });
    },
  },
  props: {
    coinTitle: {
      type: String
    }
  },

  created() {
    this.getById()
  }

}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.specialTip{
  padding: .5rem;
  width: 5.5rem;
  border-radius: .3rem;
  background: #FFF;
  position: relative;
  .icon-huaban17{
    position: absolute;
    font-size: 0.2rem;
    right: 0.3rem;
    top: 0.3rem;
  }
  .title{
    text-align: center;
    color: $color-this;
    font-size: 0.36rem;
  }

  .tip{
    font-size: .28rem;
    margin: .3rem 0px;
    line-height: 0.4rem;
    word-break: break-all;
    p{
      margin-bottom: 0.2rem;
    }
    p:last-child{
      margin-bottom: 0;
    }
  }
  .info-box{
    display: flex;
    flex-wrap: wrap;
    .info{
      width: 50%;
      line-height: 0.46rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span:first-child{
        display: block;
        font-size: 0.25rem;
        color: #9B9B9B;
      }
    }
  }

}
</style>
