<template>
<div>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClose"></span>
    <div class="title">{{ $t('turnTable.tip') }}</div>
    <div class="content">
      <div class="item" v-if="isState === 0">
        <div> {{$t('christmas.chris19')}}</div>
      </div>
      <div class="item" v-else-if="isState === 1">
        <div>
           <p class="bold">{{$t('christmas.chris20')}}</p>
           <p>{{$t('christmas.chris21')}}</p>
        </div>

      </div>
    </div>
    <div class="btn" @click="handleClose">{{ $t('turnTable.sure') }}</div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  // isState 0 活动太火爆 isState 1 超过次数
  props: ['isState'],
  methods: {
    // 关闭弹窗
    handleClose() {
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
  background: #333438;
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
    color: #FFC78A;
  }
  .item{
    display: flex;
    justify-content: center;
    margin: 0.5rem 0;
    font-size: 0.27rem;
    color: #FFFFFF;
    p{
      text-align: center;
      color: #999;
    }
    .bold{
      color: #fff;
      margin-bottom: .15rem;
    }
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
    color: #562802;
    background: linear-gradient(to top, #FFE275, #FEAF37);
  }

}
</style>
