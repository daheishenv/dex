<template>
  <div class="tabbar">
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 0}" @click="handleChangeTabbar(0)">
        <div class="iconfont icon-huaban43 img"></div>
        <div class="name">{{ $t('public.home') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 1}" @click="handleChangeTabbar(1)">
        <div class="iconfont icon-huaban5 img"></div>
        <div class="name">{{ $t('public.market') }}</div>
      </div>
    </div>
    <div class="tabar-item" v-if="$appName === 'tronNewdex'">
      <div class="content" :class="{'color-this': active === 2}" @click="handleChangeTabbar(2)">
        <span class="tabPoint" v-if="$store.state.app.unReadCount > 0">{{ $store.state.app.unReadCount }}</span>
        <div class="iconfont icon-huaban151 img"></div>
        <div class="name">{{ $t('public.order') }}</div>
      </div>
    </div>
    <div class="tabar-item" v-else>
      <div class="content" :class="{'color-this': active === 2}" @click="handleChangeTabbar(2)">
        <div class="iconfont icon-shandui img"></div>
        <div class="name">{{ $t('merge.swap') }}</div>
      </div>
    </div>
    <!-- otc法币 -->
    <!-- <div class="tabar-item" v-if="$appName === 'eosNewdex' && $store.state.app.accountInfo &&  $store.state.app.accountInfo.chain === 'eos'">
      <div class="content" :class="{'color-this': active === 3}" @click="handleChangeTabbar(3)">
        <div class="iconfont icon-huaban6 img"></div>
        <div class="name">{{ $t('merge.legalCurr') }}</div>
      </div>
    </div> -->
    <div class="tabar-item" v-if="$appName === 'eosNewdex'">
      <div class="content" :class="{'color-this': active === 3}" @click="handleChangeTabbar(3)">
        <span class="tabPoint" v-if="$store.state.app.unReadCount > 0">{{ $store.state.app.unReadCount }}</span>
        <div class="iconfont icon-huaban151 img"></div>
        <div class="name">{{ $t('public.order') }}</div>
      </div>
    </div>
    <div class="tabar-item">
      <div class="content" :class="{'color-this': active === 4}" @click="handleChangeTabbar(4)">
        <div class="iconfont icon-huaban83 img"></div>
        <div class="name">{{ $t('public.my') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { jumpSwap } from '@/utils/public';

export default {
  data() {
    return {
      active: 0, // 选择 tabbar
      url: [ // 页面路由
        'index',
        'market',
        'swap',
        'order',
        'property'
      ],
      tronUrl: [
        'index',
        'market',
        'order',
        '',
        'property'
      ]
    }
  },
  props: [
  ],
  components: {
  },
  watch: {
    // 根据路由判断当前选中tabbar
    $route: function listen(newVal) {
      const path = newVal.name;
      if (this.$appName === 'tronNewdex') {
        this.active = this.tronUrl.findIndex(item => item === path);
        return;
      }
      this.active = this.url.findIndex(item => item === path);
    },
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // tabbar 切换
    handleChangeTabbar(num) {
      if (this.active === num && (num === 3 || num === 2)) {
        const timestamp = Date.parse(new Date()) + (Math.random() * 999);
        this.$store.dispatch('setTimestamp', timestamp);
        return
      }
      this.active = num;
      const routeName = this.$route.name;
      let url = this.url;
      if (this.$appName === 'tronNewdex') {
        url = this.tronUrl;
      }
      if (routeName === url[num]) {
        return;
      }
      // if (this.$appName === 'eosNewdex' && num === 2) {
      //   jumpSwap();
      //   return;
      // }
      if (this.$appName === 'tronNewdex' && num === 2) {
        this.$router.push({
          name: 'order',
        });
        return;
      }
      this.$router.push({
        name: this.url[num],
      });
    },
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.tabbar{
  height: 1rem;
  font-size: .21rem;
  display: flex;
  color: $color-999;

  .tabar-item{
    flex: 1;
    display: flex;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    position: relative;

    .content{
      // width: 1rem;
      text-align: center;

      .hot{
        background: #FFF;
        padding-left: .01rem;
        color: $color-red;
        font-size: .25rem;
        position: absolute;
        top: 0.06rem;
        right: .44rem;
        z-index: 10;
      }
    }

    .tabPoint{
      position: absolute;
      right: .4rem;
      top: 0.05rem;
      color: white;
      width: .35rem;
      height: .35rem;
      background: $color-red;
      border-radius: 100%;
      font-size: .18rem;
      display: flex;
      align-items: center;/*垂直居中*/
      justify-content: center;/*水平居中*/
    }
  }

  .img{
    width: .45rem;
    height: .45rem;
    font-size: .35rem;
    line-height: .45rem;
    display: inline-block;
  }
}
</style>
