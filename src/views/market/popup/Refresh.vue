<template>
  <div v-if="showRefresh">
    <span class="iconfont icon-huaban42 refreshbox" @click="handleRefresh"></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showRefresh: false,
    }
  },
  mounted() {
    // const channel = localStorage.getItem('channel')
    // if (channel === 'ede') {
    //   this.showRefresh = true;
    // }
  },
  methods: {
    handleRefresh() {
      const url = window.location.href;
      const arr = url.split('?')[0]
      const newUrl = `${arr}?channel=ede&chain=eos&_t=${Date.parse(new Date())}`;
      window.location.href = newUrl;
    }
  }
}
</script>


<style scoped lang='scss'>
  .refreshbox {
    font-size: 0.38rem;
    margin-right: 0.36rem;
    display: inline-block;
  }
</style>
