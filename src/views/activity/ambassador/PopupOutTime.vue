<template>
  <div>
    <div class="rentTip">
      <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
      <div class="content">
        <div class="item">
          <div class="desc">不在抽奖时间范围</div>
        </div>
      </div>
      <div class="btn" @click="handleClosePopup">{{ $t('trade.comfirm') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {};
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.rentTip {
  width: 6rem;
  border-radius: 0.17rem;
  padding: 0.46rem 0.55rem 0.2rem;
  box-sizing: border-box;
  position: relative;
  font-size: 0.28rem;
  // background: url('https://nds.340wan.com/static/assets/img/activity/moonFestival/popupbg.png') no-repeat;
  background: #020D33;
  background-size: cover;

  .popupClose {
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    font-size: 0.18rem;
    color: #fff;
  }

  .title {
    text-align: center;
    margin-bottom: 0.4rem;
    font-size: 0.45rem;
    // color: #FFC78A;
    color: #fff;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    font-size: 0.3rem;
    // color: #FFC78A;
    color: #fff;

    .img {
      width: 2.05rem;
      height: 2.05rem;
      margin: 0.4rem 0;
    }
    p:last-child{
      margin-top: .1rem;
      font-size: .24rem;
      font-weight: normal;
    }
    .desc {
      font-size: 0.21rem;
      color: #ffe4a1;
      margin-top: 0.2rem;
    }
  }
  .btn {
    border-radius: 0.05rem;
    width: 3rem;
    height: 0.77rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.27rem;
    margin: 0.6rem auto 0.3rem;
    color: #fff;
    background-image: linear-gradient(90deg, #848EFF 0%, #3452E3 100%);
    border-radius: 0.1rem;
    font-size: 0.27rem;
    // color: #8B572A;
  }
  .btnDesc{
    // font-size: 0.18rem;
    text-align: center;
    margin-bottom: 0.1rem;
    font-size: 0.21rem;
    color:#f1c89dcc;
  }
}
</style>
