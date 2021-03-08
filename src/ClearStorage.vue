<template>
  <div style="padding: 20px; text-align:center; font-size:0.3em">
    页面缓存已清除，请重新进入
  </div>
</template>
<script>
export default {
  mounted() {
    window.localStorage.clear();
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g); // eslint-disable-line
    if(keys) {
      for(var i = keys.length; i--;) // eslint-disable-line
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() // eslint-disable-line
    }
  }
}
</script>