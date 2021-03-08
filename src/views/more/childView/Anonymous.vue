<template>
  <div class="anonymous">
    <div class="title">
      <div>{{ $t('anonymous.anonymous') }}</div>
      <div @click="handleChangeType"><tSwitch :type="type"/></div>
    </div>
    <div class="tip">{{ $t('anonymous.anonymousTip') }}</div>
    <div class="vipTip" @click="handleToVipNotes">{{ $t('more.vipDetail') }} ></div>
    <div class="imgDiv">
      <img class="img" v-if="$store.state.app.language === 'zh-CN'" src="/static/img/more/anonymous.png" alt="">
      <img class="img" v-if="$store.state.app.language === 'zh-TW'" src="/static/img/more/anonymous-tw.png" alt="">
      <img class="img" v-if="$store.state.app.language === 'en'" src="/static/img/more/anonymous-en.png" alt="">
      <img class="img" v-if="$store.state.app.language === 'ko'" src="/static/img/more/anonymous-ko.png" alt="">
    </div>

    <!-- 提示 start -->
    <mt-popup
      class="tipPopup"
      popup-transition="popup-fade"
      v-model="tip">
      <div class="tipDiv">
        <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
        <div class="popupTitle">{{ $t('public.tip') }}</div>
        <div class="popupContent">{{ $t('anonymous.anonymousCondition') }}</div>
        <div class="popupBtn" @click="handleToVipDetail(false)">{{ $t('vip.updataVip') }}</div>
      </div>
    </mt-popup>
    <!-- 提示 end -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi';
import tSwitch from '../components/Switch';

export default {
  data() {
    return {
      type: false,
      tip: false,
    }
  },
  components: {
    tSwitch,
    mtPopup: Popup,
  },
  watch: {
    '$store.state.app.vipInfo': function listen() {
      this.type = this.$store.state.app.vipInfo.anonymous;
    }
  },
  mounted() {
    this.type = this.$store.state.app.vipInfo.anonymous;
  },
  methods: {
    // 初始化
    handleMouted() {
      try {
        this.type = !!this.$store.state.app.vipInfo.anonymous;
      } catch (error) {
        setTimeout(() => {
          this.handleMouted();
        }, 200);
      }
    },
    // 切换开关
    handleChangeType() {
      // 判断会员等级
      if (this.$store.state.app.vipInfo && this.$store.state.app.vipInfo.level < 5) {
        this.tip = true;
        return;
      }
      // 判断token
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleChangeType()
        })
        return;
      }
      // 请求接口
      const params = {
        isAnonymous: !this.type ? 1 : 0
      }
      this.$http.post('account/updateAnonymousConfig', params).then((res) => {
        if (res.code === 401) {
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          // 延时调用授权
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleApply();
            });
          }, 2000);
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.type = !this.type;
        this.$toast({
          message: this.type ? this.$t('anonymous.open') : this.$t('anonymous.close'),
          position: 'center',
          duration: 1000,
        });
      });
    },
    // 去会员说明页面
    handleToVipNotes() {
      this.$router.push({
        name: 'vipNotes',
        params: {
          type: 'anonymous'
        }
      });
    },
    // 关闭弹窗
    handleClosePopup() {
      this.tip = false;
    },
    // 跳转至会员说明页面 type: true - 弹窗 | false - 不弹窗
    handleToVipDetail(type) {
      this.$router.push({
        name: 'vipDetail',
        params: {
          show: type || false,
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.anonymous{
  font-size: .32rem;
  padding: .36rem;
  position: relative;

  .title{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tip{
    font-size: .25rem;
    color: $color-999;
    margin-top: .03rem;
  }

  .vipTip{
    font-size: .25rem;
    color: #8B572A;
    letter-spacing: 0;
    position: absolute;
    right: .36rem;
    top: 1.4rem;
  }

  .imgDiv{
    text-align: center;

    .img{
      padding-top: 2rem;
      width: 4.42rem;;
    }
  }
}
.tipPopup{
  background: transparent;
  .tipDiv{
    width: 6rem;
    border-radius: .1rem;
    background: #FFF;
    min-height: 3.13rem;
    text-align: center;
    padding: .41rem .36rem .36rem .36rem;
    box-sizing: border-box;
    position: relative;

    .popupClose{
      position: absolute;
      right: .2rem;
      top: .2rem;
      color: $color-999;
      font-size: .25rem;
    }

    .popupTitle{
      font-size: .36rem;
      color: #F6C85C;
    }

    .popupContent{
      margin-top: .21rem;
      margin-bottom: .4rem;
    }

    .popupBtn{
      background: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: .1042rem;
      width: 4.27rem;
      height: .8rem;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .27rem;
      color: #8B572A;
    }
  }
}
</style>
