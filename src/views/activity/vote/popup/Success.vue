<template>
  <div class="">
    <div class="success">
      <div class="img">
        <img src="@/assets/img/activity/vote/success.png" width="100%" alt="">
      </div>
      <div class="main">{{$t('PX.PX31')}}</div>
      <div class="tip">
        <span>{{$t('PX.PX33')}}</span>
        <span>{{remainVoteCount}}</span>
        <span>{{$t('PX.PX54')}}</span>
      </div>
      <div class="btnDiv flexb">
        <div class="btn flexc" @click="handleSuccessEmit('close')">{{$t('PX.PX35')}}</div>
        <div class="btn flexc" @click="handleSuccessEmit('again')">{{$t('PX.PX34')}}</div>
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
    handleSuccessEmit(key) {
      this.$emit('listenSuccessEmit', key);
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
    color: #5845F5;
    margin: .24rem 0 .087rem;
  }
  .tip{
    color: #999;
    font-size: .24rem;
  }
  .btnDiv{
    margin-top: .35rem;
    .btn{
      flex: 1;
      height: .74rem;
      border: 1px solid #979797;
      border-radius: .0765rem;
      &:last-child{
        margin-left: .14rem;
        background: #5845F5;
        border: 0px;
        color: #FFF;
      }
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
