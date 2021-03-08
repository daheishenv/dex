<template>
  <div class="imgCode">
    <div class="title">{{ $t('ds.ds96') }}</div>
    <div class="imgDiv">
      <div class="iptDiv"><input type="text" v-model="imgCode"></div>
      <div class="codeDiv" @click="handleGetImgSrc"><img :src="imgSrc" alt=""></div>
    </div>
    <div class="btnDiv">
      <div class="btn color-999" @click="handleCancel">{{ $t('public.cancel') }}</div>
      <div class="btn" @click="handleSure">{{ $t('trade.comfirm') }}</div>
    </div>
    <!-- 自定义吐司 -->
    <transition name="fade">
      <div class="myToast" v-if="toast">{{ toastInfo }}</div>
    </transition>
  </div>
</template>

<script>
import { getReqUrl } from '@/utils/public';
import { mapState } from 'vuex';

export default {
  name: 'imgCode',
  data() {
    return {
      imgSrc: '',
      imgCode: '',
      toastInfo: '',
      toast: false,
    }
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      accountInfo: state => state.app.accountInfo
    }),
  },
  mounted() {
    this.handleGetImgSrc()
  },
  methods: {
    handleImgCodeErr() {
      this.toastInfo = this.$t('ds.ds97');
      this.toast = true;
      setTimeout(() => {
        this.toast = false;
      }, 2000);
    },
    handleCancel() {
      this.$emit('listenCancel', true)
    },
    handleGetImgSrc() {
      // 获取次数验证码
      switch (process.env.NODE_ENV) {
        case 'test':
        case 'tron': // eslint-disable-line
        case 'testh5': // eslint-disable-line
        case 'development': // eslint-disable-line
          this.imgSrc = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT1}/api/influencer2020/getImageCaptcha?account=${
            this.accountInfo.account}&chain=${
            this.accountInfo.chain}&t=${Date.parse(Date())}`;
          break;
        default:
          this.imgSrc = `${window.location.origin}/api/influencer2020/getImageCaptcha?account=${
            this.accountInfo.account}&chain=${
            this.accountInfo.chain}&t=${Date.parse(Date())}`
          break;
      }
    },
    handleReg() {
      if (this.imgCode.trim() === '') {
        this.toastInfo = this.$t('ds.ds96');
        this.toast = true;
        setTimeout(() => {
          this.toast = false;
        }, 2000);
        return false;
      }
      return true;
    },
    handleSure() {
      if (!this.handleReg()) {
        return
      }
      this.$emit('listenSure', this.imgCode)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/public.scss";
.imgCode{
  background: #FFF;
  border-radius: .12rem;
  font-size: .26rem;
  width: 5.21rem;
  padding: .3rem .3rem .15rem .3rem;
  .title{
    font-size: .28rem;
    text-align: center;
    color: #333;
  }
  .imgDiv{
    margin-top: .3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: .8rem;
    background: #f8f9ff;
    overflow: hidden;
    border-radius: .12rem;
    .iptDiv{
      flex: 2;
      display: flex;
      height: .8rem;
      input{
        width: 100%;
        font-size: .28rem;
        padding-left: .2rem;
        background: transparent;
      }
    }
    .codeDiv{
      margin-left: .1rem;
      height: .7rem;
      margin-right: .05rem;
      max-width: 2rem;
      display: flex;
      img{
        // transform: scale(.8);
        width: 100%;
      }
    }
  }
  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .btn{
    font-size: .26rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-333;
    height: .6rem;
    border-radius: .12rem;
    margin-top: .3rem;
    position: relative;
    &:last-child{
      &::after{
        content: '';
        position: absolute;
        border-left: 1px solid #999;
        height: .32rem;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}

.myToast{
  position: absolute;
  top: 50%;
  left: 50%;
  background: rgba(0, 0, 0, .75);
  padding: .12rem .25rem;
  transform: translate(-50%, -50%);
  border-radius: .08rem;
  color: #FFF;
  font-size: .18rem;
  max-width: 5rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
