<template>
  <div class="popupTip">
    <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
    <div class="popupTitle">{{$t('tronNewdex.setUserName')}}</div>
    <div class="popupContent">
      <input class="input" :class="{'errorInput': nameHas || nameError}" type="text" v-model="name" :placeholder="$t('tronNewdex.setUserName')">
      <div v-if="nameHas" class="error">{{$t('tronNewdex.warnTip')}}</div>
      <div v-if="nameError" class="error">{{$t('tronNewdex.warnTip2')}}</div>
    </div>
    <div class="popupBtn" @click="handleSure">{{$t('public.sure')}}</div>
    <div class="tipDiv">
      <div class="tip">{{$t('tronNewdex.tip')}}</div>
      <div class="tip">{{$t('tronNewdex.tip2')}}</div>
    </div>
  </div>
</template>

<script>
import DApp from '@/utils/wallet';

export default {
  data() {
    return {
      nameHas: false, // 账户名已存在
      nameError: false, // 账户名验证错误
      name: '', // 用户名
    }
  },
  watch: {
    name() {
      if (this.nameError || this.nameHas) {
        this.nameError = false;
        this.nameHas = false;
      }
    }
  },
  mounted() {
  },
  methods: {
    // 关闭弹窗
    handleClosePopup() {
      this.$emit('listenClose', false)
    },
    // 验证账户正确性
    handleRegName() {
      const reg = new RegExp(/^[a-zA-Z0-9]{8,32}$/);
      return reg.test(this.name);
    },
    // 确认设置用户名
    handleSure() {
      if (!this.handleRegName()) {
        this.nameError = true;
        return;
      }
      this.nameError = false;
      const params = {
        name: this.name,
      }
      DApp.updateAccount(params, (err, res) => {
        if (err) {
          if (err.code === 1) {
            this.nameHas = true;
            return
          }
          this.$toast(err)
          return;
        }
        if (res) {
          this.$toast('设置成功');
          // 配置本地账户信息
          const info = this.$store.state.app.accountInfo;
          info.name = this.name;
          this.$store.dispatch('setAccountInfo', info)
          this.$emit('listenClose', true)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.popupTip{
  padding: .41rem;
  box-sizing: border-box;
  background: #FFF;
  border-radius: .17rem;
  width: 6.21rem;
  text-align: center;
  position: relative;

  .popupClose{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: .4rem;
    height: .4rem;
    right: .15rem;
    top: .15rem;
    font-size: .17rem;
  }

  .popupTitle{
    font-size: .32rem;
    color: $color-this;
    margin-bottom: .45rem;
  }

  .popupContent{
    padding-bottom: .53rem;
    position: relative;

    .input{
      border: 1px solid $color-input;
      width: 100%;
      font-size: .28rem;
      height: .72rem;
      padding-left: .28rem;
      box-sizing: border-box;
      border-radius: .0417rem;

      &.errorInput{
        border: 1px solid $color-red;
      }
    }

    .error{
      position: absolute;
      color: $color-red;
      font-size: .24rem;
      padding-left: .28rem;
      padding-top: .08rem;
    }
  }

  .popupBtn{
    font-size: .25rem;
    background: #4A90E2;
    border-radius: 10.35px;
    height: .82rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
  }

  .tipDiv{
    text-align: left;
    margin-top: .25rem;

    .tip{
      font-size: .24rem;
      color: #4A4A4A;
      padding-left: .28rem;
      margin-top: .15rem;
      position: relative;

      &::before{
        content: '';
        position: absolute;
        border-radius: 1rem;
        width: 0.0612rem;
        height: 0.0612rem;
        background: #c7c7c7;
        border-radius: 0.1rem;
        left: .12rem;
        top: .165rem;
        transform: translate(0px, -50%);
      }
    }
  }
}
</style>
