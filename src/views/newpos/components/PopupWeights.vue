<template>
  <div class="Weights">
    <div v-if="step === 1">
      <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
      <div class="title" :class="{'color-red': type === 2}">
        <!-- 韩语特殊，韩文即将衰减弹窗标题不要 -->
        <div v-if="$store.state.app.language === 'ko'">
          <div v-if="type === 2">{{ $t('newpos.weightsTitle2',{num:rate})}}</div>
          <!-- <div v-else>{{ $t('newpos.weightsTitle',{num:rate})}}</div> -->
        </div>

        <div v-else>
          <div v-if="type === 2">{{$t('newpos.weightsTitle2',{num:rate})}} </div>
          <div v-else>{{$t('newpos.weightsTitle',{num:rate}) }}</div>
        </div>

      </div>
      <div class="text">
        <div>
          <!-- 您的挖矿权重将于2019-07-31衰减5%，节点收益也将减少5%。 -->
          <div v-if="type === 1">
            <div v-if="$store.state.app.language === 'en'">
             {{$t('newpos.weightsInfo1')}}{{ dateTime }}{{
              $t('newpos.weightsInfo2',{num:rate})}}
            </div>

            <div v-else-if="$store.state.app.language === 'ko'">
               {{ dateTime }} {{$t('newpos.weightsInfo1')}}{{
              $t('newpos.weightsInfo2',{num:rate})}}
            </div>

            <!-- 汉化 -->
            <div v-else>
              {{$t('newpos.weightsInfo1')}}{{ dateTime }}{{
              $t('newpos.weightsInfo2')}}{{rate}}%。
            </div>
          </div>
          <!-- 您的挖矿权重于2019-07-31已开始衰减5%，节点收益也已减少5%。 -->
          <div v-else>
            <div v-if="$store.state.app.language === 'en'">
             {{$t('newpos.weightsInfos1')}}{{ dateTime }}{{
              $t('newpos.weightsInfos2',{num:rate})}}
            </div>
            <div v-else-if="$store.state.app.language === 'ko'">
               {{ dateTime }} {{$t('newpos.weightsInfos1')}}{{
              $t('newpos.weightsInfos2',{num:rate})}}
            </div>
            <!-- 汉化 -->
            <div v-else>
              {{$t('newpos.weightsInfos1')}}{{ dateTime }}{{
              $t('newpos.weightsInfos2')}}{{rate}}%。
            </div>
          </div>

        </div>
        <!-- 请你再次确认您的委托投票，及时避免衰减。 -->
        <p>{{$t('newpos.weightsInfo5')}}</p>
      </div>
      <div class="whyWeights" @click="handleStep(2)">{{$t('newpos.weightsWhat')}}</div>
      <div class="btn" @click="submit(accountProxy)">{{$t('newpos.weightsSubmit')}}</div>
    </div>
    <div v-else>
      <span class="iconfont icon-huaban11 popupReturn" @click="handleStep(1)"></span>
      <div class="title">{{$t('newpos.weightsWhat')}}</div>
      <div class="text">
        <div>{{$t('newpos.weightsWhat1')}}<span class="color-yellow">{{$t('newpos.weightsWhat2')}}</span></div>

        <div>{{$t('newpos.weightsWhat3')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';
import { Toast } from 'mint-ui';
import { toLocalTime } from '@/utils/public';

export default {
  data() {
    return {
      step: 1,
      type: 1
    };
  },
  props: ['accountProxy', 'accountPoolInfo'],
  mounted() {
    this.type = this.accountPoolInfo.attenuationStatus;
  },
  computed: {
    dateTime() {
      if (this.accountPoolInfo && this.accountPoolInfo.attenuationDate) {
        return toLocalTime(this.accountPoolInfo.attenuationDate).substr(0, 10);
      }
      return toLocalTime(new Date()).substr(0, 10);
    },
    rate() {
      if (this.accountPoolInfo && this.accountPoolInfo.attenuationRate) {
        return this.accountPoolInfo.attenuationRate;
      }
      return 5;
    }
    // dateTime() {
    //   if (!this.accountPoolInfo && !this.accountPoolInfo.attenuationDate) {
    //     return toLocalTime(new Date()).substr(0, 10);
    //   }
    //   return toLocalTime(this.accountPoolInfo.attenuationDate).substr(0, 10);
    // },
    // rate() {
    //   if (!this.accountPoolInfo || !this.accountPoolInfo.attenuationRate) {
    //     return 10;
    //   }
    //   return this.accountPoolInfo.attenuationRate;
    // }
  },
  methods: {
    handleClose() {
      this.$emit('listenClose', false);
    },
    handleStep(val) {
      this.step = val;
      // console.log(this.accountPoolInfo) // eslint-disable-line
    },

    async submit(val) {
      // 参数： obj = {proxy: 'string'} 回调： callback(err, res)
      if (this.$store.state.sys.isAppView) {
        this.$emit('listenClose', true);
        return;
      }
      const obj = { proxy: val };
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [{ // 投票
          account: 'eosio',
          name: 'voteproducer',
          authorization: [{
            actor: fromName,
            permission,
          }],
          data: {
            voter: fromName,
            proxy: obj.proxy, // 投票的节点名称
            producers: [],
          },
        }]
      }
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        DApp.handleScatterErrorBack(result, (type, text) => {
          type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        });
        return;
      }
      this.$emit('listenClose', true);
      this.showToast(this.$t('toastTip.success'));
      // DApp.voteproducer(obj, (err) => {
      //   if (err) {
      //     this.showToast(this.$t('toastTip.fail'));
      //     return;
      //   }
      //   this.$emit('listenClose', true);
      //   this.showToast(this.$t('toastTip.success'));
      // });
    },
    showToast(val) {
      Toast({
        message: val,
        position: 'center',
        duration: 2000
      });
    }
  },
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.Weights {
  background: #fff;
  width: 6.2rem;
  box-sizing: border-box;
  border-radius: 0.1725rem;
  padding: 0.46rem 0.36rem 0.58rem;

  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.21rem;
  }
  .popupReturn {
    position: absolute;
    left: 0.2rem;
    top: 0.2rem;
    font-size: 0.22rem;
    transform: rotate(180deg);
  }

  .title {
    text-align: center;
    color: $color-yellow;
    font-size: 0.36rem;
    margin-bottom: 0.3rem;
  }
  .text {
    font-size: 0.28rem;
    color: #3a3949;
    div {
      margin-bottom: 0.5rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .whyWeights {
    font-size: 0.24rem;
    color: #4a90e2;
    text-align: right;
    line-height: 0.84rem;
  }
  .btn {
    margin-top: 0.24rem;
    background: #f6c85c;
    border-radius: 0.096rem;
    width: 100%;
    height: 0.77rem;
    line-height: 0.77rem;
    font-size: 0.27rem;
    color: #8b572a;
    text-align: center;
  }
}
</style>
