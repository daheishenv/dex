<template>
  <!-- 添加地址簿 -->
  <div class="addAddress">
    <!-- 添加地址 -->
    <div class="tools">
      {{ $t('address.ls4', {chain:place}) }}
    </div>
    <div class="addAddressCont">
      <!-- 名称 -->
      <div class="inputDiv">
        <div class="my-account">
          <span class="red">*</span>
          {{ $t('address.ls5') }}
        </div>
        <input class="input" type="text" :maxlength="99"
        :class="{'error': warnName}"
        @click="warnName = false"
        v-model="form.name" :placeholder="$t('address.ls6')"/>
      </div>
      <!-- 地址 -->
      <div class="inputDiv">
        <div class="my-account">
          <span class="red">*</span>
          {{ $t('address.ls7') }}
        </div>
        <input class="input" type="text"
        :class="{'error': warnAddress}"
        @click="warnAddress = false"
        v-model="form.address" :placeholder="$t('address.ls8', {chain:place})"/>
      </div>
      <!-- 提取 -->
      <div class="btn" @click="handleSuer">
        {{ $t('address.ls12') }}
        <i class="iconfont icon-huaban134 el-icon-loading mlx" v-if="false"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { validateBTC, validateETH, validateTRON } from '@/utils/validate';
export default {
  name: 'addAddress', // 添加地址
  data() {
    return {
      query: {},
      form: {
        name: '', // 名称
        address: '', // 地址
      },
      place: '',
      warnAddress: false, // 地址错误提示
      warnName: false, // 名称错误提示
    }
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.query = this.$route.params;
    if (this.query && this.query.addressChain) {
      this.place = this.query.addressChain.toUpperCase()
    }
  },
  beforeDestroy() {},
  methods: {
    async handleSuer() {
      if (!this.form.name.trim()) {
        this.$toast(this.$t('address.ls6'));
        this.warnName = true;
        return;
      }
      if (!this.form.address.trim()) {
        this.$toast(this.$t('address.ls17'));
        this.warnAddress = true;
        return;
      }
      // 判断是否正确地址
      const ga = await this.handleGetAccount();
      if (ga === 'error') { // 该账户不存在
        this.$toast(this.$t('trade.receiverErrorTip2'));
        this.warnAddress = true;
        return;
      }
      const params = Object.assign(this.form, this.query);
      this.$http.post('/accountAddress/addAddress', params).then((res) => {
        // 账户存在判断
        if (res.code === 600) {
          this.$toast(this.$t('address.ls16'));
          return;
        }
        if (res.code !== 0) {
          return;
        }
        this.$toast(this.$t('toastTip.success'));
        if (this.$route.query && Boolean(this.$route.query.backpath)) {
          this.$router.push({
            path: this.$route.query.backpath
          });
          return;
        }
        // this.$router.back();
      })
    },

    // 账号是否正确
    handleGetAccount() {
      return new Promise((resolve) => {
        const address = this.form.address
        const chain = this.query.addressChain
        if(chain === 'btc' || chain === 'eth' || chain === 'tron') {
          if ((chain === 'btc' && validateBTC(address)) ||
            (chain === 'eth' && validateETH(address)) ||
            (chain === 'tron' && validateTRON(address))) {
            resolve('success');
          } else {
            resolve('error');
          }
        } else {
          // 交易对所属链不同，进行验证
          const chainNode = `${ chain }Node`;
          const params = {
            account_name: address,
          }
          const { httpEndpoint } = this.$store.state.sys.nodeList[chainNode] || {}
          let url = `${ httpEndpoint }/v1/chain/get_account`
          axios.post(url, JSON.stringify(params)).then((result) => {
            const res = result.data;
            if (res.account_name === address) {
              resolve('success');
              return;
            }
            resolve('error');
          }).catch(() => {
            resolve('error');
          });
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.addAddress {
  background: #fafafa !important;

  .tools{
    padding: .2rem .24rem;
    background: #FFF;
    position: relative;
    text-align: center;
    margin-bottom: .1rem;
    font-size: .36rem;
  }

  .addAddressCont {
    width: 100%;
    height: 100%;
    background: #fff !important;
    padding: 0 .4rem;
    box-sizing: border-box;

    .inputDiv {
      background: #fff;
      position: relative;
      overflow: hidden;
      .input {
        box-sizing: border-box;
        border: 1px solid $color-input;
        width: 100%;
        height: 0.73rem;
        border-radius: 0.0417rem;
        padding-left: 0.2rem;
        font-size: 0.25rem;
        margin-bottom: 0.1rem;
      }
      .error{
        border: 1px solid $color-red;
      }

      .textRight {
        text-align: right;
        color: #999;
      }

      .my-account{
        height: 0.72rem;
        line-height: 0.72rem;
        width: 100%;
        font-size: 0.27rem;
        box-sizing: border-box;
        color: #3A3949;
        margin-bottom: -.5rem;

        .red {
          color: red;
        }
      }
    }
  }
  .btn {
    box-sizing: border-box;
    width: 100%;
    height: 0.72rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    margin: 0 auto;
    border-radius: 0.1rem;
    margin-top: 0.3rem;
    font-size: 0.28rem;
    color: #FFFFFF;
    border: 0.02rem solid #4A90E2;
  }
}
</style>
