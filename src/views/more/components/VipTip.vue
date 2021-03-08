<template>
  <div class="vipTip">
    <!-- K线 & 交易页面 -->
    <span class="iconfont icon-v vip" :class="{'trade font40': $route.name === 'trade' || $route.name === 'candyBox',
      'trade': $route.name === 'index'}"
      v-if="!vipLv" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban74 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 1" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban73 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 2" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban72 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 3" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban68 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 4" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban71 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 5" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban69 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 6" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban66 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 7" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban70 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 8" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban67 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 9" @click.stop="handleShowPop"></span>
    <span class="iconfont icon-huaban65 vip isVip" :class="{'font40': $route.name === 'trade'}"
      v-if="vipLv === 10" @click.stop="handleShowPop"></span>

    <!-- 提示弹窗 -->
    <mt-popup
      class="popup"
      v-model="showVipTip"
      popup-transition="popup-fade">
      <div class="showVipTip">
        <!-- 关闭按钮 start -->
        <span class="iconfont icon-huaban17 close" @click="showVipTip = false"></span>
        <!-- 关闭按钮 end -->

        <!-- 非会员提示 start -->
        <div class="notVip" v-if="!vipLv">
          <div class="title color-999">{{ $t('vip.notVip') }}</div>
          <div class="tip">{{ $t('vip.openTip') }}</div>
          <div class="btnDiv">
            <!-- <button class="btn">{{ $t('public.cancel') }}</button> -->
            <button class="btn" @click="handleToVipDetail(false)">{{ $t('vip.open') }}</button>
          </div>
        </div>
        <!-- 非会员提示 end -->

        <!-- 会员优惠提示 start -->
        <div v-if="vipLv">
          <div class="title ">{{ $t('vip.isVip') }}</div>
          <div class="tip">
            {{ $t('vip.isVipTip1') }} {{ vipLv }}{{ $t('vip.isVipTip2') }}<span
              v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
              {{ handleGetCharge(vipRate || 1, 10) }}</span><span
              v-if="$store.state.app.language !== 'zh-CN' && $store.state.app.language !== 'zh-TW'">
              {{ handleGetChargeEn(vipRate || 0, 100) }}</span>{{ $t('vip.isVipTip3') }}
          </div>
          <div class="btnDiv">
            <!-- <button class="btn">{{ $t('public.sure') }}</button> -->
            <button class="btn" @click="handleToVipDetail(true)">{{ $t('vip.updataVip') }}</button>
          </div>
        </div>
        <!-- 会员优惠提示 end -->
      </div>
    </mt-popup>

  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';

export default {
  data() {
    return {
      showVipTip: false, // 是否显示弹窗
      isVip: false, // 是否会员
      vipLv: 0,
      vipRate: 0.95,
    }
  },
  components: {
    mtPopup: Popup
  },
  props: [
    'level',
    'discountRate',
  ],
  watch: {
    // level(newVal) {
    //   this.vipLv = newVal;
    // },
    // discountRate(newVal) {
    //   this.vipRate = newVal;
    // },
    '$store.state.app.vipInfo': function listen(newVal) {
      this.vipLv = newVal.level;
      this.vipRate = newVal.discountRate;
    },
  },
  mounted() {
    this.vipRate = this.$store.state.app.vipInfo.discountRate;
    this.vipLv = this.$store.state.app.vipInfo.level;
    // 避免同一个页面多次请求
    // if (this.level === 'undefined') {
    //   this.vipLv = this.level
    // } else {
    //   this.handleGetAccountInfo();
    // }
  },
  methods: {
    // 计算折扣
    handleGetCharge(n, m) {
      return Decimal.mul(n, m).toString();
    },
    handleGetChargeEn(n, m) {
      const t = Decimal.mul(n, m);
      return Decimal.sub(100, t).toString();
    },
    // 显示会员弹窗
    handleShowPop() {
      // 资产页面 & 首页 - 跳转到会员详情
      if (this.$route.name === 'property' || this.$route.name === 'index' || this.$route.name === 'candyBox') {
        this.handleToVipDetail();
        return;
      }
      this.showVipTip = true;
    },
    // 跳转至会员说明 ---- 升级会员 - true | false - 开通会员
    handleToVipDetail(type) {
      this.$router.push({
        name: 'vipDetail',
        params: {
          show: type || false,
        }
      })
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
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
          this.vipLv = 2;
          this.vipRate = res.accountInfo.discountRate || 0.95;
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.vipTip{
  border-radius: .12rem;
  float: left;
  height: .44rem;
  width: .44rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .vip{
    font-size: .35rem;
    opacity: .6;
    color: #FFF;

    &.font40{
      font-size: .4rem
    }
  }

  .trade{
    color: #b7b7b7;
  }

  .isVip{
    color: #F6C85C !important;
    opacity: 1;
  }
}

// vip提示
.showVipTip{
  text-align: center;
  padding: .41rem .24rem .37rem .24rem;
  position: relative;
  font-size: .3rem;
  width: 6.2rem;
  box-sizing: border-box;

  .close{
    position: absolute;
    font-size: .25rem;
    right: .15rem;
    top: .15rem;
    color: $color-999;
  }

  .title{
    font-size: .36rem;
    // color: #F6C85C;
    color: $color-333;
    text-align: center;
    padding-bottom: .25rem;
  }

  .tip{
    padding-bottom: .4rem;
    color: $color-333;
  }

  .btnDiv{
    .btn{
      width: 4.27rem;
      height: .8rem;
      background: #F6C85C;
      // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: .1042rem;
      font-size: .3rem;
      color: #8B572A;
      text-align: center;
    }
  }
}

</style>
