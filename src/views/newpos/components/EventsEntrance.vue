<template>
  <div class="events" ref="events" @touchstart.stop="handleStart" @touchmove.stop="handleMove" @touchend.stop="handleMoveEnd"
    :style="`left: ${left}px;top: ${top}px`"
    @click="handleToZendesk">
  </div>
</template>

<script>
export default {
  data() {
    return {
      startTop: '',
      startLeft: '',
      top: '',
      left: '',
      box: null,
    }
  },
  props: [
  ],
  mounted() {
    this.box = this.$refs.events;
  },
  methods: {
    // 跳转zendesk
    handleToZendesk() {
      const lang = this.$store.state.app.language.toLowerCase();
      if (lang === 'en') {
        window.location.href = 'https://support.newdex.net/hc/en-us/articles/360029251332';
        return;
      }
      window.location.href = `https://support.newdex.net/hc/${lang}/articles/360029251332`;
    },
    // 获取
    handleStart(e) {
      const oevent = e || event;
      this.startTop = oevent.targetTouches[0].clientY - this.box.offsetTop;
      this.startLeft = oevent.targetTouches[0].clientX - this.box.offsetLeft;
      this.$emit('listenMove', true);
    },
    // 拖动
    handleMove(e) {
      const oevent = e || event;
      oevent.stopPropagation();
      const distanceX = oevent.targetTouches[0].clientX - this.box.offsetLeft - this.startLeft;
      const distanceY = oevent.targetTouches[0].clientY - this.box.offsetTop - this.startTop;
      this.left = this.box.offsetLeft + distanceX;
      this.top = this.box.offsetTop + distanceY;
    },
    // 结束
    handleMoveEnd(e) {
      this.$emit('listenMove', false);
      const oevent = e || event;
      const boxOffSetLeft = this.box.offsetLeft;
      const boxOffSetTop = this.box.offsetTop;
      // 左侧
      const left = oevent.target.scrollWidth * (2 / 3) * -1;
      if (boxOffSetLeft < left) {
        this.left = left;
      }
      // 右侧
      const right = oevent.target.scrollWidth / 3;
      if (boxOffSetLeft > screen.width - right) {
        this.left = screen.width - right;
      }
      // 上侧
      const top = oevent.target.scrollHeight * (2 / 3) * -1;
      if (boxOffSetTop < top) {
        this.top = top;
      }
      // 下侧
      const bottom = oevent.target.scrollHeight / 3;
      if (boxOffSetTop > screen.height - bottom) {
        this.top = screen.height - bottom;
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

@keyframes myfirst{
  12% {
    transform: rotate(-30deg);
  }
  37% {
    transform: rotate(30deg);
  }
  62% {
    transform: rotate(-30deg);
  }
  87% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// @-moz-keyframes myfirst{
//   12% {
//     transform: rotate(-45deg);
//   }
//   37% {
//     transform: rotate(45deg);
//   }
//   62% {
//     transform: rotate(-45deg);
//   }
//   87% {
//     transform: rotate(45deg);
//   }
//   100% {
//     transform: rotate(0deg);
//   }
// }

@-webkit-keyframes myfirst{
  12% {
    transform: rotate(-30deg);
  }
  37% {
    transform: rotate(30deg);
  }
  62% {
    transform: rotate(-30deg);
  }
  87% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.events{
  position: fixed;
  top: 80%;
  left: calc(100% - .78rem);
  z-index: 99999999;
  width: .6rem;
  background: url('/static/img/activity/events.png') no-repeat;
  background-size: contain;
  height: .62rem;
  animation: myfirst .7s;
  -moz-animation: myfirst .7s;	/* Firefox */
  -webkit-animation: myfirst .7s;	/* Safari 和 Chrome */
  -o-animation: myfirst .7s;	/* Opera */

  .img{
    display: block;
    width: .6rem;
    height: .62rem;
  }
}

</style>
