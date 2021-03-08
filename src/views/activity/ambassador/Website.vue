<template>
  <div class="website">
    <div class="flexc">
      <img class="imgTitle" v-if="$store.state.app.language === 'zh-CN'"
        src="/static/img/activity/ambassadors/title4-CN.png?v=1" alt="">
      <img class="imgTitle" v-else-if="$store.state.app.language === 'zh-TW'"
        src="/static/img/activity/ambassadors/title4-TW.png?v=1" alt="">
      <img class="imgTitle" v-else src="/static/img/activity/ambassadors/title4-en.png?v=1" alt="">
    </div>
    <div class="webList">
      <div class="item" v-for="(item, index) in webList" :key="index"
        @click="handleToWebsite(item)"><img :src="item.logoUrl" alt=""></div>
    </div>
    <div class="power">* {{ $t('foolDay.tip2') }}</div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      webList: []
    }
  },
  components: {},
  props: {},
  watch: {},
  computed: {},
  created() {},
  mounted() {
    this.handleGetList();
  },
  beforeDestroy() {},
  methods: {
    handleToWebsite(item) {
      location.href = item.linkUrl
    },
    handleGetList() {
      this.$http.get('/influencer2020/getEventPartners').then((res) => {
        if (res.code !== 0) {
          return
        }
        this.webList = res.eventPartnerList;
        this.$forceUpdate();
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.flexc{
  display: flex;
  justify-content: center;
}
.website {
  .imgTitle{
    // width: 4.54rem;
    // height: 1.07rem;
    max-width: 100%;
    margin: 0.8rem 0 0.3rem;
  }
  .webList{
    padding: 0 .22rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .item{
      width: 2.2rem;
      // border: 1px dashed #FFF;
      margin: 0 .2rem .25rem 0;
      box-sizing: border-box;
      &:nth-child(3n) {
        margin-right: 0px;
      }
      img{
        display: block;
        width: 100%;
      }
    }
  }
}
.power{
  margin-top: 0.3rem;
  padding-right: .33rem;
  padding-bottom: .5rem;
  text-align: right;
  font-size: .18rem;
  color: #8197D3;
}
</style>

