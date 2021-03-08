<template>
  <div class="rentTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="title">{{ $t('turnTable.Claim') }}</div>
    <div class="content">
      <div class="item">
        <div>{{ $t('turnTable.phyicalPrize') }}</div>
        <div>{{ $t('turnTable.phyicalPrize2') }}</div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn" @click="handleClosePopup">{{ $t('turnTable.cancel') }}</div>
      <div class="btn" @click="handleClosePopup"
      v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'">
      <a href="https://newdex.zendesk.com/hc/zh-cn/requests/new">{{ $t('turnTable.Submit') }}</a>
    </div>
      <div class="btn" @click="handleClosePopup" v-else>
       <a href="https://newdex.zendesk.com/hc/en-us/requests/new">{{ $t('turnTable.Submit') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
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
  padding: .46rem .55rem .55rem;
  box-sizing: border-box;
  position: relative;
  font-size: .28rem;
  background: #022930;
  border-radius: 0.15rem;

  .popupClose{
    position: absolute;
    right: .2rem;
    top: .2rem;
    font-size: .18rem;
    color: #fff;
  }

  .title{
    // color: $color-this;
    text-align: center;
    margin-bottom: .4rem;
    font-size: .32rem;
    // color: #FFC78A;
    color: #fff;
  }
  .item{
    display: flex;
    flex-direction: column;

    font-size: 0.27rem;
    color: #FFFFFF;
    div{
       margin-bottom: 0.2rem;
    }
  }
  .btn-box{
    display: flex;

    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      // border: 0.01rem solid #FFFFFF;
      margin-top: .3rem;
      font-size:0.28rem;
      border-radius: 0.05rem;
      width: 44%;
      height: .77rem;
      // color: #562802;
      // background: linear-gradient(to top, #FFE275, #FEAF37);
      background-image: linear-gradient(0deg, #e5ae65 0%, #ffea7a 100%);
      color: #68380f;
      a{
        color: #562802;
      }
    }
  }


}
</style>
