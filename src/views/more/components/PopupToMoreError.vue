<template>
  <div class="toMoreDiv" :class="{'maxWidth': $store.state.app.language === 'en' || $store.state.app.language === 'ko'}" @click="handleClosePopup">
    <span class="iconfont icon-huaban91 toMore"></span>
    <span class="tipContent">{{ $t('exportOrder.toMore') }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: [
    'toMore'
  ],
  methods: {
    handleClosePopup() {
      this.$emit('listenClose', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.toMoreDiv{
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF;
  border-radius: .18rem;
  height: 1.1rem;
  width: 4.46rem;

  &.maxWidth{
    width: 6.8rem;
  }

  .toMore{
    font-size: .47rem;
    color: $color-red;
    margin-right: .15rem;
  }

  .tipContent{
    font-size: .32rem;
    color: $color-333;
  }
}
</style>
