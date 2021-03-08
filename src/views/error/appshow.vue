<template>
  <div class="app">
    <div><button @click="handleAppInit"> 获取账户信息 </button></div>
    <div><button @click="handleAppToLogin"> 去登录 </button></div>
    <div><button @click="handleAppToTrade"> 去交易 </button></div>
    <div><button @click="handleAppToVipCenter"> 去会员中心 </button></div>
    <div><button @click="handleAppToNdxDialog"> 抵押弹窗 </button></div>
    <button @click="handleAppToShare"> 去分享 </button>

    <br />
    <br />
    <br />

    <div>
      <div>{{ type }}</div>
      {{ JSON.stringify($store.state.app.accountInfo) }}
    </div>
    <br />
    <div>
      {{ JSON.stringify($store.state.app.vipInfo) }}
    </div>
  </div>
</template>

<script>
import { AppInit, AppToLogin, AppToTrade, AppToVipCenter, AppToNdxDialog, AppToShare } from '@/utils/publicApi';

export default {
  data() {
    return {
      type: '',
    }
  },
  methods: {
    handleAppInit() {
      this.type = '获取账户信息'
      AppInit()
    },
    handleAppToLogin() {
      this.type = '去登录'
      AppToLogin()
    },
    handleAppToTrade() {
      AppToTrade('eosfaidchain-faid-eos')
    },
    handleAppToVipCenter() {
      AppToVipCenter()
    },
    handleAppToNdxDialog() {
      AppToNdxDialog(2)
    },
    handleAppToShare() {
      const params = {
        type: 3,
        content: 'http://ndt.340wan.com/upload/20190424/91c46b0745ec4db39873317feb8608f6.png'
      }
      AppToShare(params)
    },
  }
}
</script>

<style lang="scss" scoped>
.app{
  font-size: .25rem;
  white-space: pre-wrap;
}
</style>
