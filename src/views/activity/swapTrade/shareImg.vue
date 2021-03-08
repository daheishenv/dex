<template>
  <div class="invitationPage flexc">
    <!-- 加载中 -->
    <div class="loading flexc" v-if="loading">
      <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
    </div>
    <div class="imgCont" v-else>
      <img :src="invitationUrl" alt="">
      <div class="imgTips flexc">
        <span>{{$t('Trading.Trading37')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from 'mint-ui';
export default {
  name: 'invitationPage', // 邀请页面
  data() {
    return {
      invitationUrl: '',
      loading: false,
    }
  },
  components: {
    mtSpinner: Spinner
  },
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.handlePosterShare();
  },
  beforeDestroy() {},
  methods: {
    async handlePosterShare() {
      this.loading = true;
      const params = {
        eventCode: 'swap-trade'
      };
      this.$http.post('/exchangeCompetitionRank/shareImage', params).then((res) => {
        if (res.code !== 0) {
          // this.$message.error(res.msg);
          return;
        }
        this.loading = false;
        this.invitationUrl = res.imageUrl;
      });
    }
  },
}
</script>
<style lang="scss" scoped>
.invitationPage {
  width: 100%;
  height: 100%;
  .imgCont {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .imgTips {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .8rem;
      background: #fff;
      font-size: .24rem;
    }
  }
}
.loading{
  display: block;
  width: 30px;
  margin: auto;
  padding: 3rem 0rem;
  height: 100vh;
}
</style>