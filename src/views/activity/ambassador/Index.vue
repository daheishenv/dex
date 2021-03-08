<template>
  <div class="wrapper" @click="showMore = true">
    <header id="barrage">
      <div class="mapbox" id="mapBox">
        <canvas id="activeMap"></canvas>
        <div class="layer"></div>
      </div>
      <i class="iconfont icon-huaban23 logoicon"></i>
      <!-- <i class="iconfont icon-huaban129 moreIcon"></i> -->
      <div class="language">
        <Language/>
      </div>
      <img v-if="language === 'zh-CN'" src="/static/img/activity/ambassadors/banner-CN.png" alt="">
      <img v-else-if="language === 'zh-TW'" src="/static/img/activity/ambassadors/banner-TW.png" alt="">
      <img v-else src="/static/img/activity/ambassadors/banner-en.png" alt="">
    </header>
    <div class="bannerBottom">
      <div class="bannerWord">
        {{ $t('ds.ds2') }}
      </div>
      <div class="bannerBtn flexb">
        <div @click="hahndleRouterTo('apply')">{{ $t('ds.ds3') }}</div>
        <div @click="hahndleRouterTo('influencerDetail')">{{ $t('ds.ds4') }}</div>
      </div>
    </div>
    <div id="video">
      <Video></Video>
    </div>
    <div id="card">
      <CardComp></CardComp>
    </div>
    <div>
      <TurnComp id="draw"></TurnComp>
      <Chain id="symbol"></Chain>
      <Website id="website"></Website>
    </div>
    <div class="more" v-if="showMore" @click.stop="showMore = false">
      <i class="iconfont icon-huaban129 moreIcon"></i>
    </div>
    <div class="anchor" v-else>
      <!-- <div @click.stop="handleScroll('#barrage')"></div> -->
      <div @click.stop="handleScroll('#video')">{{ $t('ds.ds4') }}</div>
      <div @click.stop="handleScroll('#card')">{{ $t('ds.ds5') }}</div>
      <div @click.stop="handleScroll('#draw')">{{ $t('ds.ds92') }}</div>
      <div @click.stop="handleScroll('#symbol')">{{ $t('ds.ds93') }}</div>
      <div @click.stop="handleScroll('#website')">{{ $t('ds.ds94') }}</div>
      <div @click.stop="showMore = true">
        <span class="iconfont icon-huaban35 arrowIcon"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { TweenMax, Elastic } from 'gsap';
import * as THREE from 'three';
import Language from '@/components/Language';
import { mapState } from 'vuex';
import Video from './Video';
import CardComp from './CardComp';
import TurnComp from './TurnComp';
import Chain from './Chain';
import Website from './Website';
// import mapPng from '@/assets/img/activity/ds/map.png';
// import mapPng from '../../../../public/static/img/activity/ambassadors/map.png';
// import mapPng from 'https://newdex.340wan.com/static/img/map.7facde9c.png';

export default {
  components: {
    TurnComp,
    Video,
    CardComp,
    Chain,
    Language,
    Website,
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      language: state => state.app.language
    }),
  },
  data() {
    return {
      scrollTop: 0,
      showMore: true,
      centerVector: null, // map参数
      previousTime: 0, // map参数
      webGLRenderer: null, // map参数
      sceneShili: null, // map参数
      cameraShili: null, // map参数
      particlesShili: null, // map参数
    };
  },
  methods: {
    hahndleRouterTo(name) {
      this.$router.push({
        name,
      })
    },
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
    },
    // 地球动画
    handleMapInit() {
      /* eslint-disable */
      const ww = document.getElementById('mapBox').offsetWidth;
      const wh = document.getElementById('mapBox').offsetHeight;
      THREE.ImageUtils.crossOrigin = '';
      this.webGLRenderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("activeMap"),
        antialias: !0,
        // alpha:true,
        logarithmicDepthBuffer: true
      });
      this.webGLRenderer.setSize(ww, wh);
      this.webGLRenderer.setClearColor('#020D33');

      this.sceneShili = new THREE.Scene();

      this.cameraShili = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
      this.cameraShili.position.set(-100, -35, 290),
      this.cameraShili.lookAt(this.centerVector);
      this.sceneShili.add(this.cameraShili);
      
      const that = this;
      const texture = THREE.ImageUtils.loadTexture('/static/img/activity/ambassadors/map.png', undefined, function() { // eslint-disable-line
        const imagedata = that.handleMapGetImageData(texture.image);
        that.handleDrawTheMap(imagedata);
      });
      /* eslint-disable */
    },
    handleMapRender(a) {
      /* eslint-disable */
      requestAnimationFrame(this.handleMapRender);

      for (var i = 0, j = this.particlesShili.geometry.vertices.length; i < j; i++) {
        var particle = this.particlesShili.geometry.vertices[i];
        particle.x += (particle.destination.x - particle.x) * particle.speed;
        particle.y += (particle.destination.y - particle.y) * particle.speed;
        particle.z += (particle.destination.z - particle.z) * particle.speed;
      }

      if (a - this.previousTime > 100) {
        var index = Math.floor(Math.random() * this.particlesShili.geometry.vertices.length);
        var particle1 = this.particlesShili.geometry.vertices[index]; // eslint-disable-line
        var particle2 = this.particlesShili.geometry.vertices[this.particlesShili.geometry.vertices.length - index];
        TweenMax.to(particle, Math.random() * 2 + 1, {
          x: particle2.x,
          y: particle2.y,
          ease: Elastic.easeInOut
        });
        TweenMax.to(particle2, Math.random() * 2 + 1, {
          x: particle1.x,
          y: particle1.y,
          ease: Elastic.easeInOut
        });
        this.previousTime = a;
      }

      this.particlesShili.geometry.verticesNeedUpdate = true;
      this.cameraShili.position.x = Math.sin(a / 4000) * 30; // 旋转时间及角度
      // this.cameraShili.position.x = false;
      this.cameraShili.lookAt(this.centerVector);

      this.webGLRenderer.render(this.sceneShili, this.cameraShili);
      /* eslint-disable */
    },
    handleDrawTheMap(imagedata) {
      /* eslint-disable */
      var geometry = new THREE.Geometry();
      var material = new THREE.PointsMaterial({
        size: 3,
        color: '#03C0E2',
        sizeAttenuation: !1
      });
      for (var y = 0, y2 = imagedata.height; y < y2; y+=2) {
        for (var x = 0, x2 = imagedata.width; x < x2; x+=2) {
          if (imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 128) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 1000 - 500;
            vertex.y = Math.random() * 1000 - 500;
            vertex.z = -Math.random() * 500;

            vertex.destination = {
              x: x - imagedata.width / 2,
              y: -y + imagedata.height / 2,
              z: 0
            };

            vertex.speed = Math.random() + 0.15; // 显示的速度

            geometry.vertices.push(vertex);
          }
        }
      }
      this.particlesShili = new THREE.Points(geometry, material);

      this.sceneShili.add(this.particlesShili);

      requestAnimationFrame(this.handleMapRender);
      /* eslint-disable */
    },
    handleMapGetImageData(image) {
      /* eslint-disable */
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      return ctx.getImageData(0, 0, image.width, image.height);
      /* eslint-disable */
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
    // 地球动画参数
    this.centerVector = new THREE.Vector3(0, 0, 50);
    this.previousTime = 0;
    setTimeout(() => {
      this.$nextTick(this.handleMapInit())
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollToTop)
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/public.scss";
header {
  display: flex;
  align-items: center;
  justify-content: center;
  // font-size: 0.6rem;
  padding: 1.2rem 0.3rem 1rem 0.3rem;
  height: 5rem;
  box-sizing: border-box;
  color: #fff;
  position: relative;
  .language{
    position: absolute;
    top: 0.4rem;
    right: 0.2rem;
    z-index: 2;
  }
  .logoicon {
    position: absolute;
    top: 0.4rem;
    left: 0.2rem;
    font-size: .4rem;
    z-index: 2;
  }
  img {
    width: 90%;
    z-index: 2;
  }
}
.mapbox {
  width: 100%;
  height: 5rem;
  position: absolute;
  top: 0;
  left: 0;

  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(0deg, #020D33 12%, rgba(2,13,51,0.36) 75%, #020D33 100%);
    z-index: 1;
  }
}
.bannerBottom {
  padding: 0 .5rem;
  .bannerWord {
    font-size: .24rem;
    color: #FFFFFF;
    letter-spacing: 1.5px;
    margin-bottom: .45rem;
  }

  .bannerBtn {
    padding: 0 .5rem;
    font-size: .24rem;
    color: #FFFFFF;
    letter-spacing: 1.5px;
    margin-bottom: .5rem;

    div {
      width: 2.5rem;
      text-align: center;
      line-height: .7rem;
      border-radius: .08rem;
    }

    div:nth-child(1) {
      background-image: linear-gradient(-82deg, #65A8F8 0%, #307BE1 100%);
    }

    div:nth-child(2) {
      border: 1px solid #FFFFFF;
    }
  }
}
.moreIcon{
  position: fixed;
  right: .2rem;
  bottom: 1rem;
  font-size: .40rem;
  color: #333;
  padding: .2rem;
  border-radius: .08rem;
  background-color: #CDE4FF;
}
.wrapper {
  display: flex;
  flex-direction: column;
  background: #020D33;
  min-height: 100vh;
  // overflow: hidden;
}
.anchor {
  position: fixed;
  right: 0.1rem;
  bottom: 1rem;
  background-color: #CDE4FF;
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

</style>
