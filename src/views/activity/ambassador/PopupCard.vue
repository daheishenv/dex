<template>
  <div class="rentTip">
      <div class="popupEvents">
        <span class="iconfont icon-huaban17 close"
          style="color: #eee;font-size: .25rem" @click="handleClosePopup"></span>
        <div class="logo" v-if="cardItem.logo && false">
          <div v-if="$store.state.app.language === 'zh-TW' || $store.state.app.language === 'zh-CN'">
            <img  width="100%" :src="cardItem.logop">
          </div>
          <div v-else>
            <img  width="100%" v-if="cardItem.logopen" :src="cardItem.logopen">
            <img  width="100%" v-else :src="cardItem.logop">
          </div>
        </div>
        <div class="project" v-else>
          <div class="imgDiv"><img :src="cardItem.logo" alt=""></div>
          <div>{{ $t(`ds.${cardItem.id}`) }}</div>
        </div>
        <div class="itemTime">
          <span class="time">{{$t(`ds.${cardItem.time}`)}}</span>
        </div>
        <div class="title">{{$t(`ds.${cardItem.name}`)}}</div>
        <div class="content">{{$t(`ds.${cardItem.desc}`)}}</div>
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
    background: #020D33;
    .project{
      font-size: .32rem;
      margin-bottom: .3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .imgDiv{
        display: flex;
        margin-right: .08rem;
        img{
          width: .45rem;
        }
      }
    }
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
