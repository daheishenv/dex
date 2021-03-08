<template>
  <div class="freeCpu">
    <div class="tools">
      <!-- <div class="back" @click="handleBack">
        <span class="iconfont icon-huaban25 backIcon"></span>
      </div> -->
      <div>{{ $t('vip.freeCpu') }}</div>
    </div>
    <div class="main">
      <div class="up">
        <span>{{ $t('vip.upLvTip') }}</span>
        <span @click="handleToUpLv">{{ $t('vip.open') }}＞</span>
      </div>
      <div class="list">
        <div class="item">
          <span>{{ $t('vip.nowLv') }}：</span>
          <span>
            <span :class="`iconfont vip ${vipCoinClass(lv)}`"></span>
          </span>
        </div>
        <div class="item">
          <span v-if="type">{{ $t('vip.ableGetCpu') }}：</span>
          <span v-else>{{ $t('vip.abledGotCpu') }}：</span>
          <span>{{ num }} EOS</span>
        </div>
        <div class="item" v-if="!type">
          <span>{{ $t('vip.endTime') }}：</span>
          <span>{{ endTime }}</span>
        </div>
      </div>
      <div class="btn" v-if="type" :class="{'disabled': !Number(num)}" @click="handleGet">
        {{ $t('vip.get') }}
      </div>
      <div class="btn disabled" v-else @click="handleGet">
        {{ $t('vip.got') }}
      </div>
      <div class="tip">{{ $t('vip.freeCpuTip') }}</div>
    </div>

    <!-- appToLogin start -->
    <mt-popup
      class="popup"
      popup-transition="popup-fade"
      v-model="appToLogin">
      <PopupToLogin @listenClose="handleClose" />
    </mt-popup>
    <!-- appToLogin end -->

  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { toLocalTime } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';
import PopupToLogin from '@/views/index/components/PopupToLogin';

export default {
  components: {
    PopupToLogin,
    mtPopup: Popup,
  },
  data() {
    return {
      lv: 0,
      type: false,
      endTime: '-',
      num: 0,
      isLoading: false,
      appToLogin: false,
    }
  },
  watch: {
    '$store.state.app.accountInfo': function listen() {
      this.handleMouted();
    },
    '$store.state.app.vipInfo': function listen() {
      this.handleMouted();
    },
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleClose() {
      this.appToLogin = false;
    },
    handleMouted() {
      try {
        this.lv = this.$store.state.app.vipInfo.level;
        this.type = !this.$store.state.app.vipInfo.freeCpuStatus;
        if (this.type) {
          this.num = this.$store.state.app.vipInfo.availableCpuQuantity || 0;
        } else {
          this.num = this.$store.state.app.vipInfo.receivedCpuQuantity || 0;
          this.endTime = this.handleToLocalTime(this.$store.state.app.vipInfo.freeCpuExpireTime)
        }
      } catch (error) {
        setTimeout(() => {
          this.handleMouted();
        }, 200);
      }
    },
    handleGet() {
      if (!this.type || Number(this.num) === 0) {
        return
      }
      if (this.isLoading) { // 加载中 - 返回
        return;
      }
      this.isLoading = true;
      const token = localStorage.getItem('token');
      if (!token) {
        this.isLoading = false;
        accountToSign(this, () => {
          this.handleGet()
        })
        return;
      }
      this.$http.get('account/getFreeCpu').then((res) => {
        this.isLoading = false;
        if (res.code === 401) {
          accountToSign(this, () => {
            this.handleGet()
          })
          return;
        }
        if (res.code !== 0) {
          this.$toast(this.$t('vip.claimError'))
          return;
        }
        this.handleGetVipInfo();
      })
    },
    handleToLocalTime(time) {
      if (!time) {
        return '-'
      }
      return toLocalTime(time).substr(0, 10)
    },
    // 获取等级样式
    vipCoinClass(item) {
      const index = item
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
    // 升级
    handleToUpLv() {
      const token = localStorage.getItem('token');
      if (this.$store.state.sys.isAppView && !token) {
        this.appToLogin = true;
        return
      }
      this.$router.push({
        name: 'vipDetail'
      })
    },
    handleBack() {
      history.back();
    },
    // 获取账户vip信息
    handleGetVipInfo() {
      const params = {
        account: this.$store.state.app.accountInfo.account
      }
      this.$http.post('/account/getAccountInfo', params).then((res) => {
        if (res.code === 1007) {
          const initVipInfo = this.$store.state.sys.initVipInfo;
          initVipInfo.account = this.$store.state.app.accountInfo.account;
          initVipInfo.chain = this.$store.state.app.accountInfo.chain;
          this.$store.dispatch('setVipInfo', initVipInfo);
          return;
        }
        if (res.code !== 0) {
          return;
        }
        this.$store.dispatch('setVipInfo', res.accountInfo);
        // 修改页面数据
        this.type = !this.type;
        this.$toast(this.$t('vip.claimSuccess'))
        this.num = this.$store.state.app.vipInfo.receivedCpuQuantity || 0;
        this.endTime = this.handleToLocalTime(this.$store.state.app.vipInfo.freeCpuExpireTime)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.vip{
  color: #F6C85C !important;
  font-size: .35rem;

  &.vip0{
    color: $color-999 !important;
  }
}

.freeCpu{
  font-size: .25rem;
  color: $color-333;
  background: #fafafa;
  min-height: 100vh;
  .tools{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: .36rem;
    height: .9rem;
    background: #FFF;

    .back{
      position: absolute;
      left: 0px;
      height: .9rem;
      width: .6rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .backIcon{
        font-size: .3rem;
      }
    }
  }

  .main{
    .up{
      background: rgba($color: #F2DBA4, $alpha: .3);
      // min-height: .7rem;
      color: #8B572A;
      padding: .1rem .26rem .1rem .36rem;
      box-sizing: border-box;

      &>span:last-child{
        // float: right;
        margin-left: .15rem;
      }
    }
    .list{
      background: #FFF;
    }
    .item{
      margin: 0 .31rem;
      padding: 0 .05rem;
      height: 1.14rem;
      display: flex;
      align-items: center;
      font-size: .3rem;
      box-sizing: border-box;
      border-bottom: 1px solid $color-input;
      line-height: .42rem;

      &:last-child{
        border-bottom: 0px solid $color-input;
      }

      &>span:last-child{
        margin-left: .15rem;
      }
    }
    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F6C85C;
      border-radius: .1042rem;
      height: .84rem;
      color: #8B572A;
      font-size: .32rem;
      margin: .41rem .36rem .17rem;

      &.disabled{
        background: #C7C7C7;
        color: #FFF;
      }
    }

    .tip{
      margin: .17rem .36rem;
      color: $color-999;
      padding-left: .3rem;
      position: relative;

      &::before{
        content: '';
        position: absolute;
        width: .0916rem;
        height: .0916rem;
        border-radius: .2rem;
        background: #A6B6D7;
        left: .15rem;
        top: .18rem;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
