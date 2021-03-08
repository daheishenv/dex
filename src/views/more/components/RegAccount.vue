<template>
  <div class="accountReg">
    <div class="title">
      <span>{{ $t('vip.account') }}</span>
      <div class="action" v-if="vipInfo.account" @click="handleChangeAccount">{{ $t('vip.replace') }} ></div>
    </div>
    <div class="step" v-if="!vipInfo.account">
      <div class="inputDiv">
        <span class="chain">EOS</span>
        <span class="input">
          <input type="text" v-model="otherAccount" maxlength="12"
            :placeholder="name === 'renewal' ? $t('vip.otherInputAccount') : $t('vip.otherInputAccountUp')"/>
        </span>
      </div>
      <div class="error" v-if="noThisAccount">{{ $t('vip.otherNoAccount') }}</div>
      <div class="btn" @click="handleRegAccountBtn">{{ $t('public.sure') }}</div>
    </div>

    <div v-if="vipInfo.account">
      <div class="accountInfo">
        <div :class="`iconfont vip ${vipCoinClass()}`"></div>
        <span class="account">{{ vipInfo.account }}</span>
        <span class="chain">({{ vipInfo.chain ? vipInfo.chain.toUpperCase() : 'EOS' }})</span>
        <!-- 到期时间 -->
        <span class="date" v-if="!vipInfo.vipMode && vipInfo.toLocalDate && vipInfo.level !== 0">
          ({{ $t('vip.expire', {time: vipInfo.toLocalDate}) }})</span>
      </div>

      <!-- 续费下特殊情况展示 -->
      <div class="accountTypeError" v-if="name === 'renewal'">
        <div v-if="isLv0" @click="handleToUp">{{ $t('vip.otherAccountMode') }}</div>
        <div v-if="isStaked">{{ $t('vip.otherAccountMode1') }}</div>
        <div v-if="isRenewal" class="Renewal">
          <p>{{ $t('vip.otherAccountMode2') }}</p>
          <p>{{ $t('vip.otherAccountMode3',{time:handleTime(vipInfo.expireTime)}) }}</p>
        </div>
      </div>
      <!-- 抵押时，抵押账户为最高级 - 显示提示 -->
      <div class="accountTypeError" v-if="showMaxLv">
        <div>{{ $t('vip.otherAccountTop') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Decimal } from 'decimal.js';
import { regIsRenew, toLocalTime } from '@/utils/public';
import RequestApi from '@/utils/requestApi'

export default {
  props: [
    'status'
  ],
  data() {
    return {
      name: 'upgrade',
      vipInfo: {},
      otherAccount: '', // 其他账户用户名 - 输入框
      noThisAccount: false, // 账户不存在? false - 存在 | true - 不存在
      otherAccountType: '', // 其他账户状态
      showNext: false, // 显示获取到他人账户信息后的操作 false - 不显示 | true - 显示
      showMaxLv: false, // 此账户已达到最高等级
      isLv0: false, // lv0 ？
      isStaked: false, // 抵押会员？
      isRenewal: false, // 已续费？
    }
  },
  mounted() {
    if (this.$route.name !== 'upgradeVip') {
      this.name = 'renewal';
    }
  },
  methods: {
    handleChangeAccount() {
      this.otherAccount = '';
      this.vipInfo = {};
      this.showMaxLv = false;
      this.noThisAccount = false;
    },
    // 为其他用户续费上限弹窗
    handleTime(val) {
      const toLocalDate = toLocalTime(val);
      const expireTime = toLocalDate.replace(/-/g, '/');
      const lastDate = new Date(expireTime).getTime();
      const countDay = 360 * 1000 * 60 * 60 * 24
      const result = Decimal.sub(lastDate, countDay).toString()
      return toLocalTime(Number(result)).substring(0, 10)
    },
    // 去升级
    handleToUp() {
      sessionStorage.setItem('otherVipInfo', JSON.stringify(this.vipInfo))
      this.$router.push({
        name: 'upgradeVip',
        params: {
          name: this.vipInfo.account
        }
      })
    },
    // 获取等级样式
    vipCoinClass(item) {
      let index = this.vipInfo.level || 0;
      if (!item) {
        if (this.func === 2) {
          index = this.vipInfo.stakeLevel
        }
      } else {
        index = item;
      }
      const coinList = [
        'icon-v vip0',
        'icon-huaban74',
        'icon-huaban73',
        'icon-huaban72',
        'icon-huaban68',
        'icon-huaban71',
        'icon-huaban69',
        'icon-huaban66',
        'icon-huaban70',
        'icon-huaban67',
        'icon-huaban65',
      ]
      return coinList[index];
    },
    // 验证账户按钮
    handleRegAccountBtn() {
      this.showMaxLv = false;
      if (this.otherAccount.trim() === '') {
        return;
      }
      this.handleGetAccount((err) => {
        if (err) {
          this.noThisAccount = true;
          return;
        }
        this.noThisAccount = false;
        // 账户存在 - 获取账户会员信息
        this.handleGetVipInfo();
      })
    },
    // 账户存在判断
    handleGetAccount(callback) {
      const chain = this.$store.state.app.accountInfo.chain;
      if (chain !== 'eos') {
        return;
      }
      const net = this.$store.state.sys.nodeList[`${chain}Node`].httpEndpoint;
      const params = {
        account_name: this.otherAccount,
      }
      axios.post(`${net}/v1/chain/get_account`, JSON.stringify(params)).then((result) => {
        const res = result.data;
        if (res.account_name === this.otherAccount) {
          callback(null);
          return;
        }
        callback('error');
      }).catch(() => {
        callback('error');
      });
    },
    // 获取账户会员信息
    handleGetVipInfo() {
      const params = {
        account: this.otherAccount,
      }
      // this.$http.post('/account/getAccountInfo', params).then((res) => {
      RequestApi.accountInfo(params, (res) => {
        if (res.code !== 0) {
          this.$toast(this.$t('vip.getAccountFail'))
          return;
        }
        this.vipInfo = res.accountInfo;
        const toLocalDate = toLocalTime(this.vipInfo.expireTime);
        this.vipInfo.toLocalDate = toLocalDate.substr(0, 10);
        // 续费页面时 - vip0 - 提示请升级
        if (this.name === 'renewal') {
          if (this.vipInfo.level === 0) {
            this.isLv0 = true;
            this.showMaxLv = false;
            this.isRenewal = false;
            this.isStaked = false;
            return;
          }
          // 账户vip为抵押方式
          if (this.vipInfo.vipMode === 1) {
            this.isLv0 = false;
            this.showMaxLv = false;
            this.isRenewal = false;
            this.isStaked = true;
            return
          }
          // 账户已经续费过 - 提示不支持二次续费
          const isRenew = regIsRenew(this.vipInfo);
          if (isRenew === 1) {
            this.isRenewal = true;
            this.isLv0 = false;
            this.showMaxLv = false;
            this.isStaked = false;
            return;
          }
        }
        // 升级页面时 - maxLv - 提示最高级
        // if (this.name === 'upgrade' && this.vipInfo.level === this.vipInfo.maxLevel) {
        //   this.showMaxLv = true;
        //   return;
        // }
        this.showMaxLv = false;
        this.isLv0 = false;
        this.isRenewal = false;
        this.isStaked = false;
        this.showNext = true;
        this.$emit('listenGetAccount', this.vipInfo);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.accountReg{
  padding: .24rem .36rem;
  // background-color: #fff;
  height: calc(100vh - 1.58rem);

  .vip{
    color: #F6C85C !important;
    font-size: .41rem;

    &.vip0{
      color: $color-999 !important;
    }
  }


  .title{
    font-size: .27rem;
    margin-bottom: .24rem;
    display: flex;
    align-items: center;

    .action{
      margin-left: .18rem;
      font-size: .24rem;
      color: #8B572A;
    }
  }

  .inputDiv{
    display: flex;
    align-items: center;
    height: .72rem;
    border-radius: .0662rem;
    overflow: hidden;
    border: 0.02rem solid $color-input;
    box-sizing: border-box;

    .chain{
      width: .96rem;
      height: 100%;
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .input{
      flex: 1;
      display: flex;
      align-items: center;
      padding-left: .33rem;
      input{
        width: 100%;
        height: 100%;
        font-size: .24rem;
      }
      // input::-webkit-input-placeholder {
      //    font-size: 0.28rem;
      // }
    }
  }
  .error{
    color: $color-red;
    padding-left: 1.30rem;
    margin: .19rem 0;
  }
  .accountTypeError{
    text-align: center;
    margin-top: .56rem;
    font-size: .25rem;
    color: #F5A623;
    .Renewal{
      p{
        line-height: 0.4rem;
      }
    }
  }
  .btn{
    margin-top: .8rem;
    background: #F6C85C;
    // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: .1042rem;
    height: .84rem;
    color: #8B572A;
    font-size: .32rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .accountInfo{
    display: flex;
    align-items: center;
    .account{
      font-size: .32rem;
      margin: 0 .08rem;
    }
    .chain{
      font-size: .21rem;

    }
    .date{
      margin-left: .25rem;
      font-size: .21rem;
      color: $color-999;
    }
  }
}
</style>
