<template>
  <div>
    <div class="emailBind" v-if="inUpdataEmail">
      <!-- <div class="title">邮箱绑定:</div> -->
      <div class="imgDiv">
        <img src="/static/img/more/vip-email-ic.png" alt="">
      </div>
      <!-- 邮箱 -->
      <div class="emailAccount">
        <div class="input" v-html="email" @blur="handleRegEmail" :class="{'error': emailError}"></div>
        <div class="errorTip">
          <span v-if="emailError" :class="{'divHidden': !emailError}">{{ $t('vip.rightEmail') }}</span>
          <span :class="{'divHidden': !sameEmailError}">{{ $t('vip.sameEmail') }}</span>
        </div>
      </div>
      <!-- 图片验证码 -->
      <div class="codeReg" v-if="todayCount > 5">
        <div class="inputDiv">
          <span><input type="text" @blur="handleRegImgCode" v-model="imageCode" :placeholder="$t('vip.imgCodeTip')"
            :class="{'error': imageCodeError || imageCodeNull}" ></span>
          <span class="imageCode" @click="handleImgUrl">
            <img width="100%" :src="imgSrc" alt="">
          </span>
        </div>
        <div class="errorTip" :class="{'divHidden': !imageCodeError}">{{ $t('vip.imgCodeError') }}</div>
      </div>
      <!-- 验证码 -->
      <div class="codeReg">
        <div class="inputDiv">
          <span><input type="number" @blur="handleRegCode" v-model="code" :placeholder="$t('vip.inputCode')"
            :class="{'error': regCodeError || regCodeNull}" ></span>
          <span class="sendEmailCode" v-if="!isSendCodeEmail" @click="handleSendEmail">{{ $t('vip.sendEmailCode') }}</span>
          <span class="sendEmailCode isSendEmail" v-if="isSendCodeEmail">{{ $t('vip.send') }}（{{nextTime}}s）</span>
        </div>
        <div class="errorTip" :class="{'divHidden': !regCodeError}">{{ $t('vip.codeError') }}</div>
      </div>
      <!-- 按钮 -->
      <div class="btnDiv" @click="handleSureDeal">{{ $t('public.sure') }}</div>
    </div>

    <div class="emailBind" v-if="!inUpdataEmail && !success">
      <div class="imgDiv">
        <img src="/static/img/more/vip-email-ic.png" alt="">
      </div>
      <!-- 邮箱 -->
      <div class="emailAccount">
        <input type="email" v-model="email" @blur="handleRegEmail" :class="{'error': emailError || sameEmailError}"
          :placeholder="$route.name === 'updataEmail' ? $t('vip.emailNewEmail') : $t('vip.emailAdress')">
        <div class="errorTip">
          <span v-if="emailError" :class="{'divHidden': !emailError}">{{ $t('vip.rightEmail') }}</span>
          <span :class="{'divHidden': !sameEmailError}">{{ $t('vip.sameEmail') }}</span>
        </div>
        <!-- <div class="errorTip" v-if="sameEmailError" :class="{'divHidden': !sameEmailError}">{{ $t('vip.sameEmail') }}</div> -->
      </div>
      <!-- 图片验证码 -->
      <div class="codeReg" v-if="todayCount > 5">
        <div class="inputDiv">
          <span><input type="text" @blur="handleRegImgCode" v-model="imageCode" :placeholder="$t('vip.imgCodeTip')"
            :class="{'error': imageCodeError || imageCodeNull}" ></span>
          <span class="imageCode" @click="handleImgUrl">
            <img width="100%" :src="imgSrc" alt="">
          </span>
        </div>
        <div class="errorTip" :class="{'divHidden': !imageCodeError}">{{ $t('vip.imgCodeError') }}</div>
      </div>
      <!-- 验证码 -->
      <div class="codeReg">
        <div class="inputDiv">
          <span><input type="number" @blur="handleRegCode" v-model="code" :placeholder="$t('vip.inputCode')"
            :class="{'error': regCodeError || regCodeNull}" ></span>
          <span class="sendEmailCode" v-if="!isSendCodeEmail" @click="handleSendEmail">{{ $t('vip.sendEmailCode') }}</span>
          <span class="sendEmailCode isSendEmail" v-if="isSendCodeEmail">{{ $t('vip.send') }}（{{nextTime}}s）</span>
        </div>
        <div class="errorTip" :class="{'divHidden': !regCodeError}">{{ $t('vip.codeError') }}</div>
      </div>
      <!-- 按钮 -->
      <div class="btnDiv" @click="handleSureDeal">{{ $t('public.sure') }}</div>
    </div>
    <!-- 绑定成功 -->
    <div class="emailBind" v-if="!inUpdataEmail && success">
      <div class="imgDiv">
        <img src="/static/img/more/vip-aemail-ic.png" alt="">
      </div>
      <div class="bindSuccess">{{ $t('vip.bindEmailSuccess') }}</div>
      <div class="bindSuccessEmail">{{ email }}</div>
      <div class="btnDiv" style="margin-top: .45rem" @click="handleBack">{{ $t('public.back') }}（{{ backTime }}s）</div>
    </div>
  </div>
</template>

<script>
import { accountToSign } from '@/utils/publicApi';
import { getReqUrl } from '@/utils/public';

export default {
  data() {
    return {
      inUpdataEmail: false, // 是否处于修改邮箱状态: true - 是 | false - 否
      email: '', // 邮箱
      code: '', // 验证码
      emailError: false, // 邮箱错误: false - 邮箱正确 | true - 邮箱错误
      sameEmailError: false, // 新旧邮箱相同提示
      regCodeError: false, // 验证码错误: false - 验证码正确 | true - 验证码错误
      regCodeNull: false, // 验证码为空
      isSendCodeEmail: false, // 已发送邮箱验证码: true - 已发送 | false - 未发送
      nextTime: 60, // 倒计时
      timer: null, // 定时器
      backTime: 3, // 绑定成功自动返回倒计时
      backTimer: null, // 绑定成功自动返回定时器
      success: false, // 绑定成功
      lvList: [], // 会员等级信息

      imgSrc: '', // 图片地址
      todayCount: 0, // 验证码获取次数
      imageCode: '', // 图片验证码
      imageCodeNull: false,
      imageCodeError: false, // 图片验证码错误
    }
  },
  watch: {
    $router() {
      this.handleMouted()
    },
    inUpdataEmail() {
      this.imageCode = '';
      this.handleImgUrl();
    }
  },
  mounted() {
    this.handleMouted()
  },
  methods: {
    handleMouted() {
      this.email = '';
      this.code = '';
      this.imageCode = '';
      if (this.$route.name === 'updataEmail') {
        this.inUpdataEmail = true;
        this.email = this.$store.state.app.vipInfo.email;
      }
      this.handleImgUrl();
    },
    // 获取次数验证码 - 超过6次之后请求
    handleImgUrl() {
      switch (process.env.NODE_ENV) {
        case 'test':
        case 'tron': // eslint-disable-line
        case 'testh5': // eslint-disable-line
        case 'development': // eslint-disable-line
          this.imgSrc = `http://${getReqUrl('ip')}:${process.env.VUE_APP_PORT1}/api/account/getImageCaptcha?account=${
            this.$store.state.app.accountInfo.account}&chain=${
            this.$store.state.app.accountInfo.chain}&t=${Date.parse(Date())}`;
          break;
        default:
          this.imgSrc = `${window.location.origin}/api/account/getImageCaptcha?account=${
            this.$store.state.app.accountInfo.account}&chain=${
            this.$store.state.app.accountInfo.chain}&t=${Date.parse(Date())}`
          break;
      }
    },
    // 获取会员等级列表
    handleGetVipLvList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.lvList = res.ruleList;
      });
    },
    // 验证邮箱
    handleRegEmail() {
      // ^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$ - 邮箱验证
      const reg = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$');
      // 邮箱为空处理 && 邮箱验证错误处理
      if (!this.email || !reg.test(this.email)) {
        this.emailError = true;
        this.sameEmailError = false;
        return false;
      }
      // 绑定邮箱时，新旧邮箱相同错误提示
      if (!this.inUpdataEmail) {
        if (this.email === this.$store.state.app.vipInfo.email) {
          this.emailError = false;
          this.sameEmailError = true;
          return false;
        }
      }
      this.sameEmailError = false;
      this.emailError = false;
      return true;
    },
    // 验证验证码
    handleRegImgCode() {
      if (!this.handleRegEmail()) {
        return;
      }
      if (this.imageCode.trim() !== '') {
        this.imageCodeError = false;
        this.imageCodeNull = false;
        return;
      }
      this.imageCodeNull = true;
    },
    // 验证验证码
    handleRegCode() {
      if (!this.handleRegEmail()) {
        return;
      }
      if (this.code !== '') {
        this.regCodeError = false;
        this.regCodeNull = false;
        return;
      }
      this.regCodeNull = true;
    },
    // 点击发送邮箱验证 - 倒计时 & 接口调用 - 发送验证码
    handleSendEmail() {
      if (!this.handleRegEmail()) {
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          // alert('签名成功 - 调用')
          this.handleSendEmail()
        })
        return;
      }
      // 发送验证码
      this.handleToSendMailVerifyCode();
    },
    // 发送邮箱验证码
    handleToSendMailVerifyCode() {
      if (this.todayCount > 5) {
        if (!this.imageCode.trim()) {
          this.imageCodeNull = true;
          return;
        }
        this.imageCodeNull = false;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          // alert('签名成功 - 调用')
          this.handleToSendMailVerifyCode()
        })
        return;
      }
      const params = {
        email: this.email,
        imageCode: this.imageCode,
      }
      this.$http.post('/account/sendMailVerifyCode', params).then((res) => {
        if (res.code === 401) {
          this.$toast(res.msg);
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleToSendMailVerifyCode()
            })
          }, 1000);
          return;
        }
        if (res.code === 1025) {
          this.imageCodeError = true;
          this.handleImgUrl(); // 刷新验证码
          return;
        }
        if (res.code === 1026) {
          this.imageCodeError = true;
          return;
        }
        if (res.code !== 0) {
          this.todayCount = res.todayCount || this.todayCount + 1;
          return;
        }
        this.imageCodeError = false;
        this.imageCodeNull = false;
        this.todayCount = res.todayCount;
        // 倒计时 60s
        this.isSendCodeEmail = !this.isSendCodeEmail;
        window.clearInterval(this.timer)
        this.nextTime = 60;
        this.timer = window.setInterval(() => {
          this.nextTime -= 1;
          if (this.nextTime < 0) {
            this.isSendCodeEmail = !this.isSendCodeEmail;
            this.nextTime = 60;
            window.clearInterval(this.timer)
          }
        }, 1000);
      })
    },
    // 确定按钮事件分发处理
    handleSureDeal() {
      if (!this.handleRegEmail()) {
        return;
      }
      if (!this.code.trim()) {
        this.regCodeNull = true;
        return;
      }
      if (this.todayCount > 5) {
        if (!this.imageCode.trim()) {
          this.imageCodeNull = true;
          return;
        }
        this.imageCodeNull = false;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          // alert('签名成功 - 调用')
          this.handleSureDeal()
        })
        return;
      }
      if (this.inUpdataEmail) { // 修改邮箱时调用
        this.handleRegOldEmail();
        return;
      }
      // 绑定邮箱时调用
      this.handleBindEmail();
    },
    // 验证旧邮箱
    handleRegOldEmail() {
      const params = {
        verifyCode: this.code.trim(),
        email: this.email,
        imageCode: this.imageCode.trim()
      }
      this.$http.post('/account/verifyOriginEmail', params).then((res) => {
        if (res.code !== 0) {
          if (res.code === 1011) { // 验证码错误
            this.regCodeError = true;
            return;
          }
          if (res.code === 1026) {
            this.imageCodeError = true;
            return;
          }
          if (res.code === 1025) {
            this.imageCodeError = true;
            this.handleImgUrl(); // 刷新验证码
            return;
          }
          // 授权过期处理
          if (res.code === 401) {
            setTimeout(() => {
              accountToSign(this, () => {
                // alert('签名成功 - 调用')
                this.handleRegOldEmail()
              })
            }, 1000);
          }
          this.$toast(res.msg)
          return;
        }
        // 跳转到绑定邮箱
        this.inUpdataEmail = false;
        this.email = '';
        this.code = '';
        window.clearInterval(this.timer)
        window.clearInterval(this.backTimer)
        this.isSendCodeEmail = false;
      });
    },
    // 发送请求，绑定邮箱
    handleBindEmail() {
      const params = {
        verifyCode: this.code.trim(),
        email: this.email,
        imageCode: this.imageCode.trim()
      }
      this.$http.post('/account/bindOrModEmail', params).then((res) => {
        if (res.code !== 0) {
          if (res.code === 1011) { // 验证码错误
            this.regCodeError = true;
            return;
          }
          if (res.code === 1026) {
            this.imageCodeError = true;
            return;
          }
          if (res.code === 1025) {
            this.imageCodeError = true;
            this.handleImgUrl(); // 刷新验证码
            return;
          }
          // 授权过期处理
          if (res.code === 401) {
            setTimeout(() => {
              accountToSign(this, () => {
                // alert('签名成功 - 调用')
                this.handleBindEmail()
              })
            }, 1000);
          }
          this.$toast(res.msg)
          return;
        }
        const vipInfo = this.$store.state.app.vipInfo;
        vipInfo.email = params.email;
        this.$store.dispatch('setVipInfo', vipInfo);
        // 跳转到绑定成功页面 - 倒计时
        this.handleBackTimer();
      });
    },
    // 绑定成功 - 3秒后自动返回
    handleBackTimer() {
      this.success = true;
      window.clearInterval(this.backTimer);
      this.backTime = 3;
      this.backTimer = window.setInterval(() => {
        this.backTime -= 1;
        if (this.backTime <= 0) {
          this.handleBack();
        }
      }, 1000)
    },
    handleBack() {
      // this.$router.push({
      //   name: 'transactionTip',
      // });
      history.back();
    },
    // 去绑定邮箱 - 跳转到绑定邮箱页面
    handleToBindEmail() {
      this.$router.push({
        name: 'email',
        params: {
          show: false,
        }
      });
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    window.clearInterval(this.backTimer)
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

input::-webkit-input-placeholder{
  color: $color-999;
}

.emailBind{
  font-size: .32rem;
  text-align: center;

  .title{
    padding-left: .17rem;
    text-align: left;
  }

  .imgDiv{
    &>img{
      max-width: 1.29rem;
      height: 1.07rem;;
    }
  }

  .codeReg,
  .emailAccount{
    padding-top: .4rem;

    .input,
    input{
      width: 100%;
      height: .8rem;
      border-radius: .07rem;
      padding-left: .2rem;
      box-sizing: border-box;
      font-size: .32rem;
      border: 1px solid $color-input;
      color: $color-333;
      background: #FFF;
    }

    .input{
      color: $color-999;
      background: #f0f0f0;
      display: flex;
      align-items: center;
    }

    .imageCode{
      font-size: .25rem;
      padding-top: .06rem;
      text-align: left;
      max-width: 2.18rem;
      height: .8rem;
      overflow: hidden;
      flex: 1;
      margin-left: .12rem;
      box-sizing: border-box;
      font-size: .27rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-this;
      // background: #F5A623;
      border-radius: .07rem;
    }

    .errorTip{
      color: red;
      font-size: .25rem;
      padding-top: .06rem;
      text-align: left;
      padding-left: .2rem;
    }
  }

  .codeReg{
    padding-top: .1rem;

    .inputDiv{
      display: flex;

      &>span{
        flex: 2;
      }

      .sendEmailCode{
        flex: 1;
        margin-left: .12rem;
        box-sizing: border-box;
        font-size: .27rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-this;
        // background: #F5A623;
        border-radius: .07rem;
        border: 1px solid $color-this;

        &.isSendEmail{
          background: #f0f0f0;
          color: $color-999;
          border: 1px solid transparent;
        }
      }
    }
  }

  .btnDiv{
    width: 100%;
    background: $color-this;
    margin-top: .13rem;
    height: .84rem;
    color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .1rem;
    margin-bottom: 1rem;
  }

  .bindSuccess{
    margin: .2rem 0 .05rem 0;
    font-size: .32rem;
    color: $color-this;
  }

  .bindSuccessEmail{
    font-size: .25rem;
  }
}
// 样式公用部分
.error{
  border: 1px solid $color-red !important;
  // color: red !important;
}
.divHidden{
  visibility: hidden;
}
</style>
