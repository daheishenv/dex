<template>
<div>
    <div class="videoDiv">
    <video
      class="video"
      width="100%"
      height="400"
      preload="auto"
      controls="controls"
      v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
      poster="@/assets/img/activity/christmas2019/video.png"
    >
      <source
        type="video/mp4"
        src="https://cdn.340wan.com/newdex-otc2.mp4"
      />
    </video>
    <div v-else>
      <iframe class="video" src="https://www.youtube.com/embed/BmIHUh0PVa0" frameborder="0"></iframe>
    </div>

  </div>
  <div class="btn" @click="handleToOTC">{{$t('halloween.otc')}}</div>
</div>

</template>
<script>
export default {
  methods: {
    handleToOTC() {
      if (this.channelRef === 'h5' && !this.$store.state.sys.isAppView) {
        this.toApp = true;
        return;
      }
      this.$router.push({ name: 'otc' })
    }
  },
};
</script>
<style lang="scss" scoped>
.videoDiv {
  // background: url("../../../assets/img/activity/influencer/video.png") no-repeat;
  background-size: 100% 100%;
  width: 6.8rem;
  height: 4rem;
  border-radius: 0.1rem;
  margin: 0.3rem auto 0.3rem;
  .video {
    width: 6.8rem;
    height: 4rem;
    max-height: 100%;
    max-width: 100%;
    border-radius: 0.1rem;
    overflow: hidden;
  }
}
.btn {
  font-size: 0.28rem;
  font-weight: 400;
  border-radius: 0.05rem;
  width:fit-content;
  padding: 0 .2rem;
  margin: 0 auto;
  height: 0.68rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #63381a;
  background-color: #f1c89e;
}
</style>
