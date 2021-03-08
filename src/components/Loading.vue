<template>
  <div class="model" :class="{'showLoadingCls' : showLoading}">
    <div class="waiting" :style="speCls ? 'left: 0; top: 0;' : ''">
      <div class="waitImg">
        <!-- <svg-icon :icon="'loading'" class="loading " :size="38" /> -->
        <span class="iconfont icon-huaban134 loading"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTip: true,
    }
  },
  props: {
    showLoading: Boolean,
    speCls: {
      type: Boolean,
      default: false
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>

@-webkit-keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg);
  }
}

@keyframes rotating {
  0% {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }
  100% {
    -webkit-transform: rotateZ(360deg);
    transform: rotateZ(360deg);
  }
}

.showLoadingCls {
  position: relative;
}

.waiting{
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, .8);
  // border-radius: 10.42px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .loading{
    font-size: .38rem;
    color: #aaa;
    display: inline-block;
    animation: rotating 1.8s linear infinite;
  }
  .tip{
    margin-top: 21px;
  }
}
</style>
