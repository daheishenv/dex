<template>
  <div class="wrapper" @click="showMore = true">
    <div id="barrage">
      <Barrage></Barrage>
    </div>
    <!-- <div id="video">
      <Video></Video>
    </div>
    <div id="card">
      <CardComp></CardComp>
    </div> -->
    <div id="draw">
      <TurnComp></TurnComp>
      <Chain></Chain>
      <Sponsor></Sponsor>
      <div class="power">* {{ $t('influencer.ndxHas') }}</div>
    </div>
    <div class="more" v-if="showMore" @click.stop="showMore = false">
      <i class="iconfont icon-huaban129 moreIcon"></i>
    </div>
    <div class="anchor" v-else>
      <!-- <div><a href="#barrage">{{$t('christmas.chris50')}}</a></div>
      <div><a href="#video">{{$t('christmas.chris51')}}</a></div>
      <div><a href="#card">{{$t('christmas.chris52')}}</a></div>
      <div><a href="#draw">{{$t('christmas.chris53')}}</a></div> -->
      <div @click.stop="handleScroll('#barrage')">{{$t('christmas.chris50')}}</div>
      <!-- <div @click.stop="handleScroll('#video')">{{$t('christmas.chris51')}}</div>
      <div @click.stop="handleScroll('#card')">{{$t('christmas.chris52')}}</div> -->
      <div @click.stop="handleScroll('#draw')">{{$t('christmas.chris53')}}</div>
      <div @click.stop="showMore = true">
        <span class="iconfont icon-huaban35 arrowIcon"></span>
      </div>
    </div>
  </div>
</template>
<script>
import Barrage from './Barrage';
// import Video from './Video';
// import CardComp from './CardComp';
import TurnComp from './TurnComp';
import Chain from './Chain';
import Sponsor from './Sponsor';


export default {
  components: {
    TurnComp,
    // Video,
    // CardComp,
    Barrage,
    Chain,
    Sponsor,
  },
  data() {
    return {
      scrollTop: 0,
      showMore: true
    };
  },
  methods: {
    handleScroll(val) {
      const anchor = document.querySelector(val).offsetTop;
      // alert(anchor)
      // console.log([document])
      // document.activeElement.scrollTop = anchor
      window.scrollTo(0, anchor)
    },
    // 监听滚动事件
    scrollToTop() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
    },
    // 回到顶部
    handleBackTop() {
      const timer = window.setInterval(() => {
        const ispeed = Math.floor(-this.scrollTop / 5);
        window.scrollTo(0, this.scrollTop + ispeed)
        if (this.scrollTop === 0) {
          window.clearInterval(timer);
        }
      }, 10)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollToTop)
  },
};
</script>
<style lang="scss" scoped>
.moreIcon{
  position: fixed;
  right: .2rem;
  bottom: 1rem;
  font-size: .40rem;
  color: #333;
  padding: .2rem;
  border-radius: .08rem;
  background-color: #F1C89E;
}
.wrapper {
  display: flex;
  flex-direction: column;
  background: #022930;
  min-height: 100vh;
  // overflow: hidden;
  padding-bottom: .5rem;
}
.anchor {
  position: fixed;
  right: 0.1rem;
  bottom: 1rem;
  background-color: #F1C89E;
  // padding: .3rem;
  color: #4D3325;
  font-size: 0.26rem;
  border-radius: .15rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  &>div{
     color: #4D3325;
       height: .7rem;
       line-height: .7rem;
       display: block;
       padding: 0 .3rem;
    // a{
    // }
    // margin-bottom: .2rem;
    &:last-child{
      margin-bottom: 0;
    }
  }
  .arrowIcon{
    font-size: .18rem;
  }
}

.power{
  // margin-top: 0.3rem;
  text-align: center;
  font-size: 0.22rem;
  color:rgba(241, 200, 157,0.8);
  width: 100%;
}

</style>
