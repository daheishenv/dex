<template>
  <div class="sponsor">
    <div class="title flexc">
      <img class="imgTitle" v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
        src="@/assets/img/activity/christmas2019/zzs.png" alt="">
      <img class="imgTitle" v-else
        src="@/assets/img/activity/christmas2019/zzsEn.png" alt="">
    </div>
    <div class="mainView">
      <div class="flexb">
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/boxLogo.png" alt="">
        </div>
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/pizzaLogo.png" alt="">
        </div>
      </div>
      <div class="flexb">
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/ogxLogo.png" alt="">
        </div>
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/dfsLogo.png" alt="">
        </div>
      </div>
      <div class="flexb">
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/pumlLogo.png" alt="">
        </div>
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/tpLogo.png" alt="">
        </div>
      </div>
      <div class="flexb">
        <div class="flexc item">
          <img src="@/assets/img/activity/logo/ysdLogo.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sponsor', // 赞助商
  data() {
    return {
    }
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.sponsor {
  margin-top: .6rem;
  .title {
    display: flex;
    align-items: center;
    padding: 0 .3rem;
    box-sizing: border-box;
    font-size: 0.3rem;
    margin: 0.2rem 0 0.2rem;
    color:#F1C89D;
    img {
      display: block;
      width: 2rem;
      height: 100%;
    }
  }
  .mainView {
    padding: .2rem .2rem;
  }
  .item {
    border-radius: 0.1rem;
    height: 1.5rem;
    width: 49%;
    margin-bottom: .15rem;
    background: rgba(255, 255, 255, 0.08);

    img {
      display: block;
      width: 60%;
    }
  }
}
</style>
