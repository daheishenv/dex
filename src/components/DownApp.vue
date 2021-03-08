<template>
  <div class="downApp">
    <div class="logoDiv">
      <!-- <span class="iconfont icon-huaban53 logo"></span> -->
      <img class="logoImg" src="https://nds.340wan.com/static/img/index/downApp.png" alt="">
    </div>
    <div class="content">{{ $t('down.installNow') }}</div>
    <div class="btnDiv">
      <button class="btn" @click="handleToDown">{{ $t('down.install') }}</button>
      <span class="iconfont icon-huaban17 close" @click="handleClose"></span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClose() {
      this.$emit('listenClose', true);
    },
    handleToDown() {
      window.location.href = 'https://app.newdex.vip';
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/public.scss";

.downApp{
  position: fixed;
  bottom: 0px;
  width: 100%;
  max-width: 750px;
  font-size: .3rem;
  height: 1.1rem;
  background: rgba(0, 0, 0, .60);
  color: white;
  display: flex;
  align-items: center;/*垂直居中*/
  padding: 0px .36rem 0px .36rem;
  box-sizing: border-box;

  .logoDiv{
    margin-right: .24rem;
    width: .62rem;
    height: .62rem;
    border-radius: 50%;
    .logoImg{
      width: 100%;
      height: 100%;
    }
    .logo{
      background: #0069FF;;
      font-size: .85rem;
      color: #FFF;
      border-radius: 50%;
    }
  }

  .content{
    flex: 1;
  }

  .btn{
    width: 1.3rem;
    height: .66rem;
    font-size: .28rem;
    color: #0069FF;
    background: #FFf;
    border-radius: .33rem;
    margin-right: .2rem;
  }

  .close{
    font-size: .28rem;
    position: absolute;
    right: .1rem;
    top: .1rem;
  }
}
</style>
