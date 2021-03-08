<template>
<div>
  <!-- 活动未开始 -->
  <div class="rentTip" v-if="isStart === 0 || isStart === 3">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('turnTable.tip') }}</div>
    <div class="content">
      <div class="item noFlex">
        <div>{{ $t('ds.ds102') }}</div>
        <div>{{ $t('ds.ds103') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleClosePopup">{{ $t('turnTable.sure') }}</div>
  </div>

  <!-- 活动结束 -->
  <div class="rentTip" v-else-if="isStart === 2">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('turnTable.tip') }}</div>
    <div class="content">
      <div class="item center">
        <div>{{ $t('turnTable.activityOver') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleClosePopup">{{ $t('turnTable.sure') }}</div>
  </div>

  <div class="rentTip" v-else>
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('turnTable.tip') }}</div>
    <div class="content">
      <div class="item">
        <div>{{ $t('turnTable.noDraw') }}</div>
      </div>
    </div>
    <div class="btn" @click="handleClosePopup">{{ $t('turnTable.sure') }}</div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['isStart'],
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rentTip{
  width: 6.21rem;
  border-radius: .17rem;
  padding: .46rem .55rem .33rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #020D33;
  border-radius: 0.15rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #FFFFFF;
  }

  .title{
    text-align: center;
    margin-bottom: .4rem;
    font-size: 0.32rem;
    color: #848EFF;
  }
  .item{
    display: flex;
    margin: 0.5rem 0;
    font-size: 0.27rem;
    color: #FFFFFF;
    &.center{
      justify-content: center;
    }
  }
  .noFlex{
    display: block;
  }
  .btn{
    background: #FFFFFF;
    border-radius: 0.05rem;
    width: 3rem;
    height: .77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.27rem;
    margin: .6rem auto 0.3rem;
    color: #fff;
    background-image: linear-gradient(90deg, #848EFF 0%, #3452E3 100%);
  }

}
</style>
