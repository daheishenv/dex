<template>
  <div class="evolution">
    <div class="content">
      <div class="tab flexc">
        <div class="tabItem flex" :class="{ active: activeIndex === 0 }" @click="activeIndex = 0">
          <img class="titleIcon" src="@/assets/img/index/a-ic-c.png" alt="" v-if="activeIndex === 0" />
          <img class="titleIcon" src="@/assets/img/index/a-ic.png" alt="" v-else />
          <!-- Newdex发展重要里程碑 -->
          <span>{{ $t('New_home.New_home45') }}</span>
        </div>
        <div class="border"></div>
        <div class="tabItem flex" :class="{ active: activeIndex === 1 }" @click="activeIndex = 1">
          <img class="titleIcon" src="@/assets/img/index/b-ic-c.png" alt="" v-if="activeIndex === 1" />
          <img class="titleIcon" src="@/assets/img/index/b-ic.png" alt="" v-else />
          <!-- 2021年发展路线规划 -->
          <span>{{ $t('New_home.New_home84') }}</span>
        </div>
      </div>
      <div v-show="activeIndex === 0">
        <div class="evaBox">
          <div class="arrow">
            <img v-show="current !== 0" @click="handleLeft" src="@/assets/img/index/fill.png" alt="" />
          </div>
          <div class="swiper-container swiper-no-swiping">
            <div class="swiper-wrapper">
              <div v-for="(item, index) in evolutionList" :key="index" class="swiper-slide">
                <div v-if="index !== evolutionList.length-1" :class="[index % 2 ? 'bottomWord' : 'topWord']">
                  <div class="date" >{{ $t(item.date) }}</div>
                  <div>{{ $t(item.des) }}</div>
                </div>
                <div v-else :class="[index % 2 ? 'bottomWord' : 'topWord']">
                  <div class="value" >{{ $t(item.date) }}</div>
                </div>
                <img v-if="index !== evolutionList.length  -1" class="lineIcon" :src="item.imgUrl" alt="" />
                <img v-else @click="handle2021" style="" class="finally lineIcon" :src="item.imgUrl" alt="" />
              </div>
            </div>
          </div>
          <div class="arrow" @click="handleRight">
            <img v-show="(current + 1) * 4 < evolutionList.length" src="@/assets/img/index/right.png" alt="" />
          </div>
        </div>
      </div>
      <div v-if="activeIndex === 1" class="flexc evaImgCont">
        <img class="evaImg" v-if="language === 'zh-CN'" src="@/assets/img/index/eva-cn.png" alt="" />
        <img class="evaImg" v-else-if="language === 'zh-TW'" src="@/assets/img/index/eva-tw.png" alt="" />
        <img class="evaImg" v-else src="@/assets/img/index/eva-en.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/swiper.min.css';
import Swiper from 'swiper';

export default {
  name: 'Evolution',
  data() {
    return {
      activeIndex: 0,
      language: 'zh-CN',
      current: 0, //第一页
      mySwiper: null,
      evolutionList: [
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home46', des: 'New_home.New_home47' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home48', des: 'New_home.New_home49' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home50', des: 'New_home.New_home51' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home52', des: 'New_home.New_home53' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home54', des: 'New_home.New_home55' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home56', des: 'New_home.New_home57' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home58', des: 'New_home.New_home59' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home60', des: 'New_home.New_home61' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home62', des: 'New_home.New_home63' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home64', des: 'New_home.New_home65' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home66', des: 'New_home.New_home67' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home68', des: 'New_home.New_home69' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home70', des: 'New_home.New_home71' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home72', des: 'New_home.New_home73' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home74', des: 'New_home.New_home75' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home76', des: 'New_home.New_home77' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home78', des: 'New_home.New_home79' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home80', des: 'New_home.New_home81' },
        { imgUrl: require('@/assets/img/index/licheng.png'), date: 'New_home.New_home82', des: 'New_home.New_home83' },
        { imgUrl: require('@/assets/img/index/finally.png'), date: 'New_home.New_home103', des: '' },
      ],
    };
  },
  watch: {
    '$store.state.app.language': function change(newVal) {
      this.language = newVal;
    },
  },
  computed: {
    getEvolutionList() {
      return this.evolutionList.slice(this.current, this.current + 4);
    },
  },
  created() {},
  mounted() {
    this.language = this.$store.state.app.language;
    if (this.mySwiper) {
      return;
    }
    this.mySwiper = new Swiper('.swiper-no-swiping', {
      slidesPerView: 4,
      paginationClickable: false,
      spaceBetween: 0,
      direction : 'vertical',
    });
  },
  methods: {
    handle2021(){
      this.activeIndex = 1
    },
    handleLeft() {
      this.current--;
      this.mySwiper.slideTo(this.current * 4);
    },
    handleRight() {
      if ((this.current + 1) * 4 >= this.evolutionList.length) return;
      this.current++;
      this.mySwiper.slideTo(this.current * 4);
    },
  },
};
</script>

<style lang="scss" scoped>
.evolution {
  // height: 6.52rem;
  background: url('../../../assets/img/index/2-bg.png') no-repeat;
  background-size: cover;
  image-rendering: -webkit-optimize-contrast;
  margin-bottom: .15rem;
  margin-top: .15rem;

  .content {
    margin: 0 auto;
    .tab {
      padding-top: .60rem;
      color: rgba($color: #fff, $alpha: 0.66);
      font-size: .3rem;
      .active {
        color: #fff;
      }
      .tabItem {
        cursor: pointer;
        .titleIcon {
          height: .32rem;
          width: .32rem;
          margin-right: .12rem;
        }
      }
      .border {
        border-left: .01rem solid rgba($color: #fff, $alpha: 0.3);
        margin: 0 .26rem;
        height: .30rem;
      }
    }
    .evaBox {
      padding: .2rem 0 .8rem;
      position: relative;
      .arrow {
        width: .47rem;
        height: 1rem;
        margin: 0 auto;
        img {
          width: .47rem;
          height: 1rem;
          cursor: pointer;
        }
      }
      .you {
        z-index: 999;
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translate(0, -50%);
      }
    }

    .evaImgCont {
      padding-bottom: .6rem;
    }

    .evaImg {
      width: 100%;
      height: 9.7rem;
      margin-top: 0.70rem;
      // padding-bottom: 1rem;
      box-sizing: border-box;
    }

    .swiper-container {
      width: 100%;
      height: 8rem;
      .lineIcon {
        width: .47rem;
        // height: 1.6rem;
      }
      .finally{
        cursor: pointer;
        z-index: 999;
      }
      .date {
        font-size: .27rem;
        margin-bottom: .10rem;
        color: #fff;
      }
      .topWord {
        text-align: left;
        width: 3rem;
        position: absolute;
        left: 8%;
        top: 0;
        word-break: break-all;
        font-size: .24rem;
        color: rgba($color: #fff, $alpha: 0.8);
      }
      .bottomWord {
        text-align: left;
        width: 2.8rem;
        position: absolute;
        right: 7%;
        top: 0;
        word-break: break-all;
        font-size: .24rem;
        color: rgba($color: #fff, $alpha: 0.8);
      }
    }
    .swiper-slide {
      font-size: .18rem;
      // width: 3.40rem;
      height: 1.5rem;
      position: relative;
      color: #fff;
      .value{
        // width: 1.70rem;
        // margin-top: 1.93rem;
        font-size: .24rem;
      }
    }
  }
}
</style>
