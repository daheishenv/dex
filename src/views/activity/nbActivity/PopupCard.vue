<template>
  <div class="rentTip">
      <div class="popupEvents">
        <span class="iconfont icon-huaban17 close"
          style="color: #eee;font-size: .25rem" @click="handleClosePopup"></span>
        <div class="logo">
          <div v-if="$store.state.app.language === 'zh-TW' || $store.state.app.language === 'zh-CN'">
            <img  width="100%" :src="cardItem.logop">
          </div>
          <div v-else>
            <img  width="100%" v-if="cardItem.logopen" :src="cardItem.logopen">
            <img  width="100%" v-else :src="cardItem.logop">
          </div>
          <!-- <img width="100%"
            v-if="$store.state.app.language === 'en' || $store.state.app.language === 'ko'"
            :src="activeItem.popupLogoEN"> -->
        </div>
        <div class="itemTime">
          <span class="time">{{$t(`activityCard.time${cardItem.id}`)}}</span>
        </div>
        <div class="title">{{$t(`activityCard.name${cardItem.id}`)}}</div>
        <div class="content">{{$t(`activityCard.desc${cardItem.id}`)}}</div>
        <div class="qrCode">
          <div class="imgDiv" v-if="cardItem.code"><img class="img" :src="cardItem.code" alt=""></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['cardItem'],
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

.popupEvents{
    width: 6.5rem;
    padding: .5rem;
    box-sizing: border-box;
    border-radius: .12rem;
    // background: linear-gradient(95deg, #505edf 0%, #8e8dec 100%);
    background: #333;
    .close{
      position: absolute;
      right: .2rem;
      top: .2rem;
      font-size: .18rem;
      color: #fff;
    }
    .logo{
      width: 2.8rem;
      margin: auto;
    }
    .itemTime{
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .14rem 0 .17rem 0;

      .time{
        font-size: .26rem;
        background: linear-gradient(95deg, #f543b5 0%, #facc31 100%);
        color: $color-333;
        border-radius: 3rem;
        padding: 0rem .3rem;
        display: inline-block;
        height: .56rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFF;
      }
    }
    .title{
      margin-top: .47rem;
      margin-bottom: .35rem;
      text-align: center;
      font-size: .46rem;
    }
    .content{
      font-size: .26rem;
      text-align: center;
    }
    .qrCode{
      margin-top: .44rem;
      text-align: center;

      .imgDiv{
        width: 2.33rem;
        height: 2.33rem;
        margin: auto;
        background: #FFF;
        border-radius: .08rem;
        padding: .06rem;
        box-sizing: border-box;
        margin-bottom: .1rem;

        .img{
          width: 100%;
        }
      }
      // .qrCodeTip{
      // }
    }
  }
</style>
