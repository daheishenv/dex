<template>
  <section>
    <div v-if="$appName === 'eosNewdex'">
      <AccountPropertyEos ref="accountProperty" :ndxNum="ndxNum" :isRefresh="isRefresh"></AccountPropertyEos>
    </div>
    <div v-else-if="$appName === 'tronNewdex'">
      <AccountPropertyTron ref="accountProperty" :isRefresh="isRefresh"></AccountPropertyTron>
    </div>
  </section>
</template>

<script>
// import AccountPropertyEos from './AccountPropertyEos'
// 组件优化=>函数式组件按需加载
const AccountPropertyEos = () => import('./AccountPropertyEos');
const AccountPropertyTron = () => import('./AccountPropertyTron');
export default {
  components: {
    AccountPropertyEos,
    AccountPropertyTron
  },
  props: [
    'isRefresh',
    'ndxNum'
  ],
  methods: {
    handleGetAccountInfo() {
      this.$refs.accountProperty.handleGetAccountInfo();
    }
  }
}
</script>
