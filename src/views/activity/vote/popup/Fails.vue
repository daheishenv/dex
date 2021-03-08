<template>
  <div class="">
    <div class="success">
      <div class="img">
        <img v-if="voteActionCode == 1031" src="@/assets/img/activity/vote/fails.png" width="100%" alt="">
      </div>
      <div class="main">{{voteActionCode == 1029 ? $t('PX.PX38'): $t('PX.PX32')}}</div>
      <div v-if="voteActionCode == 1031" class="tip">
        <span>{{$t('PX.PX55')}}</span>
        <span>{{remainVoteCount}}</span>
        <span>{{$t('PX.PX54')}}</span>
      </div>
      <div class="btnDiv flexc">
        <div class="btn flexc" @click="handleClose">{{$t('PX.PX36')}}</div>
      </div>
    </div>
    <div class="minBanner" @click="handleUpVip">
      <img v-if="language === 'zh-CN' || language === 'zh-TW'" src="@/assets/img/activity/vote/banner-zh.png" alt="">
      <img v-else src="@/assets/img/activity/vote/banner-en.png" alt="">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'rules',
  methods: {
    handleClose() {
      this.$emit('listenClose', false)
    },
    // 升级VIP
    handleUpVip() {
      this.$router.push({ path: '/upgrade-vip' });
    },
  },
  props: ['remainVoteCount', 'voteActionCode'],
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      accountInfo: state => state.app.accountInfo,
      language: state => state.app.language
    }),
  },
}
</script>

<style lang="scss" scoped>
.success{
  width: 5.50rem;
  position: relative;
  padding: .45rem .32rem .40rem;
  box-sizing: border-box;
  text-align: center;
  background: #ffffff;
  .img {
    width: .89rem;
    margin: auto;
  }
  .main{
    font-size: .30rem;
    color: #333;
    margin: .24rem 0 .087rem;
  }
  .tip{
    color: #999;
    font-size: .24rem;
  }
  .btnDiv{
    margin-top: .35rem;
    .btn{
      max-width: 2.38rem;
      width: 2.38rem;
      flex: 1;
      height: .74rem;
      border: 1px solid #979797;
      border-radius: .0765rem;
    }
  }
}
.minBanner{
  margin-top: .15rem;
  width: 5.50rem;
  img{
    width: 100%;
  }
}
</style>
