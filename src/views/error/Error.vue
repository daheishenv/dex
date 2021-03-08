<template>
  <div class="errorCode">
    <div v-clipboard:copy="JSON.stringify(errCodeData)" class="color-this"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">点击复制</div>
    <div v-for="(val, key) in errCodeData" :key="key">
      <span>{{ key }}</span>: '<span>{{ val }}</span>',
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errCodeData: '',
    }
  },
  mounted() {
    this.handleGetErrorCode();
  },
  methods: {
    handleGetErrorCode() {
      this.$http.get('/common/getErrorCode').then((res) => {
        const newJson = {};
        const ksys = Object.keys(res.list);
        ksys.forEach((i) => {
          newJson[`error${i}`] = res.list[i];
        })
        this.errCodeData = newJson;
      })
    },
    onCopy() {
      this.$toast(this.$t('public.copySuccess'));
    },
    onError() {
      this.$toast(this.$t('public.copyError'));
    }
  }
}
</script>

<style lang="scss" scoped>
.color-this{
  color: rgba(74, 144, 226, 1);
}
.errorCode{
  font-size: .3rem;
}
</style>
