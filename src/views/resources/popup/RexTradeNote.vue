<template>
  <div class="rexNote">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div v-if="type === 1">
      <div class="title">{{ $t('resources.buyRexNote') }}</div>
      <div class="content">
        <div class="item">{{ $t('resources.buyRexNote_1') }}</div>
        <div class="item">{{ $t('resources.buyRexNote_2') }}</div>
        <div class="item">{{ $t('resources.buyRexNote_3') }}</div>
      </div>
    </div>
    <div v-else>
      <div class="title">{{ $t('resources.sellRexNote') }}</div>
      <div class="content">
        <div class="item">{{ $t('resources.sellRexNote_3') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleClosePopup">{{ $t('public.sure') }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: [
    'type'
  ],
  watch: {
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rexNote{
  width: 6.21rem;
  background: #FFF;
  border-radius: .17rem;
  padding: .46rem .55rem .33rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
  }

  .title{
    color: $color-this;
    text-align: center;
    margin-bottom: .2rem;
    font-size: .36rem;
  }

  .content{
    .item{
      margin-bottom: .2rem;
    }
  }

  .btn{
    width: 4.9rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-this;
    color: #FFF;
    margin: auto;
    border-radius: .1rem;
    margin-top: .3rem;
    font-size: .26rem;
  }
}
</style>
