<template>
  <div class="transactionTip">
    <!-- 剩余次数提醒 start -->
    <!-- <div class="numTip" @click="handleToVipNotes">
      {{ $t('vip.surplus1') }}{{ $store.state.app.vipInfo.remainDealRemindCount }}{{ $t('vip.surplus2') }}</div> -->
    <!-- 剩余次数提醒 end -->
    <!-- 成交提醒状态Div start -->
    <div class="typeDiv">
      <div class="type">
        <div>{{ $t('more.dealRemind') }}</div>
        <!-- <div><mt-switch v-model="type"></mt-switch></div> -->
        <div @click="handleChangeType"><tSwitch :type="type"/></div>
      </div>
      <div class="openListsDiv" v-show="type">
        <div class="list" @click="handleChangeTipType">
          <span listContent>{{ $t('vip.noRemindPartial') }}</span>
          <span class="iconfont chiose fr" :class="{'icon-huaban57 selectIcon': noRemindPartial}"></span>
        </div>
      </div>
      <div class="openTip">
        {{ $t('vip.remindTip') }}
      </div>
      <div class="bindEmail" v-if="$store.state.app.vipInfo && $store.state.app.vipInfo.email">
        <span>{{ $t('vip.bindEmail') }}</span>
        <span class="bindEmailAccount" @click="handleToUpdataEmail">
          <span>{{ $store.state.app.vipInfo.email }}</span>
          <span class="iconfont icon-huaban21 updata"></span>
        </span>
      </div>
      <div class="fr vipNotes" @click="handleToVipNotes">
        <!-- <span v-if="$store.state.app.accountInfo && $store.state.app.accountInfo.chain === 'eos'">{{ $t('more.vipDetail') }}></span> -->
      </div>
    </div>
    <!-- 成交提醒状态Div end -->

    <!-- 去开通会员提示 start -->
    <mt-popup
      v-model="tipToOpenVip"
      class="popupModel"
      popup-transition="popup-fade">
      <div class="popupTip" v-if="tipToOpenVip">
        <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
        <div class="popupTitle">{{ $t('public.tip') }}</div>
        <div class="popupContent">{{ $t('vip.pleaseOpenVip') }}</div>
        <div class="popupBtn" @click="handleToVipDetail(false)">{{ $t('vip.toOpen') }}</div>
      </div>
    </mt-popup>
    <!-- 去开通会员提示 end -->

    <!-- 去绑定邮箱提示 start -->
    <mt-popup
      v-model="tipToBindEmail"
      class="popupModel"
      popup-transition="popup-fade">
      <div class="popupTip" v-if="tipToBindEmail">
        <span class="iconfont icon-huaban17 popupClose" @click="handleClosePopup"></span>
        <div class="popupTitle">{{ $t('public.tip') }}</div>
        <div class="popupContent">{{ $t('vip.pleaseBindEmail') }}</div>
        <div class="popupBtn" @click="handleToBindEmail">{{ $t('vip.toBind') }}</div>
      </div>
    </mt-popup>
    <!-- 去绑定邮箱提示 end -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi';

import tSwitch from '../components/Switch';

export default {
  data() {
    return {
      type: false, // 成交提醒状态： true - 开启 | false - 关闭
      showToOpenVip: false, // 非会员状态下，点击开启成交提醒时，显示去开通界面 - true - 显示 | fasle - 不显示
      nextTime: 0, // 倒计时
      timer: null, // 定时器

      noRemindPartial: false, // 不提醒部分成交订单
      accountData: {
        email: '',
      },
      // 弹窗提示参数
      tipToOpenVip: false, // 提示去开通VIP
      tipToBindEmail: false, // 提示去绑定邮箱

      lvList: [], // 会员列表
    }
  },
  watch: {
    '$store.state.app.vipInfo': function listen() {
      this.handleMouted();
    },
  },
  components: {
    tSwitch,
    mtPopup: Popup,
  },
  mounted() {
    this.handleMouted();
  },
  methods: {
    handleMouted() {
      this.handleGetVipLvList()
      // 是否显示去开通会员
      if (this.$store.state.app.vipInfo && this.$store.state.app.vipInfo.level) {
        this.showToOpenVip = false;
      } else {
        this.showToOpenVip = true;
      }
      this.type = this.$store.state.app.vipInfo.isDealRemind;
      this.noRemindPartial = this.$store.state.app.vipInfo.noRemindPartial;

      // 是否绑定邮箱 - 有 - 展示 | 没有 - 不展示
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
    // 全换成交提醒开启状态
    handleChangeType() {
      // 非会员 - 弹窗提示去开通会员
      // if (this.showToOpenVip) {
      //   this.tipToOpenVip = true;
      //   return;
      // }
      // 会员 & 未绑定邮箱 - 弹窗提示去绑定邮箱
      if (!this.$store.state.app.vipInfo.email) {
        this.tipToBindEmail = true;
        return;
      }
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   accountToSign(this, () => {
      //     this.type = !this.type;
      //     this.noRemindPartial = false;
      //     this.handleSureChangeTip()
      //   })
      //   return;
      // }
      this.type = !this.type;
      // this.changeSetting = true; // 保存按钮显示
      this.noRemindPartial = false;
      this.handleSureChangeTip();
    },
    // 手动切换提醒状态 typeName - some | all  &&  status - true | false
    handleChangeTipType() {
      // 非会员不可点击
      // if (this.showToOpenVip) {
      //   return;
      // }
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   accountToSign(this, () => {
      //     // alert('签名成功 - 调用')
      //     this.noRemindPartial = !this.noRemindPartial;
      //     this.handleSureChangeTip()
      //   })
      //   return;
      // }
      // 配置提醒设置
      this.noRemindPartial = !this.noRemindPartial;
      this.handleSureChangeTip()
    },
    // 成交提醒确认修改
    handleSureChangeTip() {
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   accountToSign(this, () => {
      //     // alert('签名成功 - 调用')
      //     this.handleSureChangeTip()
      //   })
      //   return;
      // }
      const params = {
        isDealRemind: this.type ? 1 : 0,
        noRemindPartial: this.noRemindPartial ? 1 : 0,
      }
      this.$http.post('/account/updateDealRemindConfig', params).then((res) => {
        if (res.code !== 0) {
          this.$toast(res.msg);
          // 授权过期处理
          if (res.code === 401) {
            setTimeout(() => {
              accountToSign(this, () => {
                // alert('签名成功 - 调用')
                this.handleSureChangeTip()
              })
            }, 1000);
          }
          return;
        }
        const vipInfo = this.$store.state.app.vipInfo;
        vipInfo.isDealRemind = params.isDealRemind;
        vipInfo.noRemindPartial = params.noRemindPartial;
        this.$store.dispatch('setVipInfo', vipInfo);
      })
    },
    // 发送验证码 - 修改邮箱
    handleSendUpdataEmail() {
      window.clearInterval(this.timer); // 清除旧的定时器
      this.nextTime = 60;
      this.timer = window.setInterval(() => {
        this.nextTime -= 1;
        if (this.nextTime <= 0) {
          window.clearInterval(this.timer); // 清除旧的定时器
        }
      }, 1000);
    },
    // 去vip详情
    handleToVipDetail(type) {
      this.$router.push({
        name: 'vipDetail',
        params: {
          show: type || false,
        }
      });
    },
    // 去会员说明页面
    handleToVipNotes() {
      this.$router.push({
        name: 'vipNotes',
        params: {
          type: 'transaction'
        }
      });
    },
    // 去修改邮箱
    handleToUpdataEmail() {
      this.$router.push({
        name: 'updataEmail',
      });
    },
    /* ---- 弹窗操作 start ---- */
    // 关闭弹窗
    handleClosePopup() {
      this.tipToOpenVip = false;
      this.tipToBindEmail = false;
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
    /* ---- 弹窗操作 end ---- */
  },
  beforeDestroy() {
    window.clearInterval(this.timer); // 清除旧的定时器
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.transactionTip{
  font-size: .32rem;
  // background: #FFF;
  box-sizing: border-box;
  min-height: calc(100vh - 1rem);

  // 剩余次数提醒
  .numTip{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .25rem;
    color: #4A90E2;
    background: #E9F2FF;
    height: .7rem;
  }

  // 成交提醒状态Div
  .typeDiv{
    padding: .25rem .35rem;
    margin-bottom: .5rem;

    .type{
      display: flex;
      align-items: center;
      justify-content: space-between;

      /deep/ .mint-switch-input:checked + .mint-switch-core::after{
        transform: translateX(.36rem);
      }

      /deep/ .mint-switch-input:checked + .mint-switch-core{
        border-color: #1BAF6B;
        background-color: #1BAF6B;
      }

      /deep/ .mint-switch-core{
        width: .72rem;
        height: .34rem;
        overflow: hidden;
        background-color: #c7c7c7;

        &::before{
          width: .72rem;
          height: .34rem;
          background-color: #c7c7c7;
        }

        &::after{
          width: .31rem;
          height: .3rem;
          border-radius: 50px;
        }
      }
    }

    .openListsDiv{
      margin-top: .39rem;
      // display: flex;
      // align-items: center;
      font-size: .28rem;

      &>div{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: .34rem;
      }

      .chiose{
        box-sizing: border-box;
        border: 1px solid $color-999;
        width: .3rem;
        height: .3rem;
        border-radius: .04rem;
        margin-right: .05rem;
      }

      .selectIcon{
        font-size: .3rem;
        color: $color-this;
        border: 0px;
      }
    }

    .openTip{
      margin-top: .1rem;
      font-size: .25rem;
      color: $color-999;
    }

    .bindEmail{
      margin-top: .36rem;
      font-size: .25rem;
      color: $color-999;
      display: flex;
      align-items: center;

      .bindEmailAccount{
        color: $color-this;
        flex: 2;
        text-align: right;
        margin-right: .05rem;

        .updata{
          font-size: .25rem;
        }
      }
    }

    .btn{
      font-size: .32rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: .36rem;
      background: $color-this;
      color: #FFF;
      height: .84rem;
      border-radius: .1rem;
    }
  }

  // 非会员打开成交提醒时样式
  .toOpenVip{
    height: 3.22rem;
    background: url('/static/img/more/vipcard-bg.png') no-repeat;
    border-radius: .12rem;
    text-align: center;
    color: #F2DBA4;
    font-size: .25rem;

    .imgDiv{
      padding-top: .4rem;
      padding-bottom: .2rem;

      &>img{
        max-width: 1.09rem;
        width: 100%;
      }
    }

    .openVipBtn{
      width: 1.8rem;
      height: .74rem;;
      background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: .1rem;;
      color: #8C633E;
      letter-spacing: 0.0085rem;
      margin: auto;
      margin-top: .21rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

// 会员说明样式
.vipNotes{
  float: right;
  margin-top: .3rem;
  font-size: .25rem;
  color: #8B572A;
}

// 弹窗提示style
.popupModel{
  background: transparent;

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
      right: .2rem;
      top: .2rem;
      color: $color-999;
      font-size: .25rem;
    }

    .popupTitle{
      font-size: .36rem;
      color: $color-this;
      margin-bottom: .33rem;
    }

    .popupContent{
      font-size: .28rem;
      color: $color-333;
      margin-bottom: .44rem;
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
  }
}
</style>
