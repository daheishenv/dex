<template>
  <div class="group" :class="{'androidFocus': androidFocus}" @click="select = false">
    <div class="banner">
      <span class="title">{{ $t('candyAirDrop.apply') }}</span>
    </div>

    <div class="content">
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.projectName') }}</span>
          <span class="tip">{{ $t('candyAirDrop.projectNameTip') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="50" @focus="handleAndroidFocus"
            :class="{'notNull': regError && !name.trim()}" type="text" v-model="name">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.chain') }}</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <div class="input chain color-999">
            <span>{{ chain }}</span>
            <!-- <span class="down" :class="{'up': select}"></span> -->
          </div>
          <!-- 币种浮动窗口 start -->
          <div class="selectMenu" v-if="select">
            <div class="scroll">
              <div class="select color-333">
                <div class="item" v-for="(item, $index) in coldWallet" :key="$index">{{ $index.toUpperCase() }}</div>
              </div>
            </div>
          </div>
          <!-- 币种浮动窗口 end -->
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.tokenName') }}</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <input maxlength="50" class="input" @focus="handleAndroidFocus" @blur="handleAndroidBlur"
            :class="{'notNull': regError && !tokenName.trim()}" type="text" v-model="tokenName">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.contact') }}</span>
          <span class="tip"></span>
        </div>
        <div class="inputDiv">
          <input maxlength="12" class="input" @focus="handleAndroidFocus" @blur="handleAndroidBlur"
            :class="{'notNull': regError && !contract.trim()}" type="text" v-model="contract">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.website') }}</span>
          <span class="tip mrle10"></span>
        </div>
        <div class="inputDiv">
          <input maxlength="255" class="input" @focus="handleAndroidFocus" @blur="handleAndroidBlur"
            :class="{'notNull': regError && !website.trim()}" type="text" v-model="website">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.airDropAmt') }}</span>
          <span class="tip mrle10">{{ $t('candyAirDrop.airDropAmtTip') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" type="number" @focus="handleAndroidFocus" @blur="handleAndroidBlur"
            :class="{'notNull': regError && !num.trim()}" v-model="num">
        </div>
      </div>
      <div class="item">
        <div class="subTitle">
          <span>{{ $t('candyAirDrop.tel') }}</span>
          <span class="tip mrle10">{{ $t('candyAirDrop.telTip') }}</span>
        </div>
        <div class="inputDiv">
          <input maxlength="255" class="input" @focus="handleAndroidFocus" @blur="handleAndroidBlur"
            :class="{'notNull': regError && !contact.trim()}" type="text" v-model="contact">
        </div>
      </div>
      <div class="applyBtn" @click="handleApply">{{ $t('influencer.shortSubmit') }}</div>
    </div>

    <!-- 弹窗 start -->
    <mt-popup
      v-model="applySuccess"
      class="popupModel"
      popup-transition="popup-fade">
      <PopupApplySuccess v-if="applySuccess" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 弹窗 end -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { accountToSign } from '@/utils/publicApi';
import { GetUrlPara } from '@/utils/public';

import PopupApplySuccess from '../components/PopupApplySuccess';

export default {
  data() {
    return {
      name: '',
      tokenName: '',
      contract: '',
      website: '',
      num: '',
      contact: '',
      chain: 'EOS',

      select: false,
      coldWallet: {},
      applySuccess: false,
      regError: false,
      androidFocus: false,
    }
  },
  watch: {
    num(newVal, oldVal) {
      if (Number(newVal) >= 1000000000000) {
        this.num = oldVal;
      }
    }
  },
  components: {
    PopupApplySuccess,
    mtPopup: Popup,
  },
  mounted() {
    this.coldWallet = this.$store.state.sys.coldWallet;
  },
  methods: {
    handleAndroidFocus() {
      const urlData = GetUrlPara();
      if (urlData.source === 'android') {
        this.androidFocus = true;
      }
    },
    handleAndroidBlur() {
      const urlData = GetUrlPara();
      if (urlData.source === 'android') {
        this.androidFocus = false;
      }
    },
    handleReg() {
      if (!this.name.trim() || !this.tokenName.trim() || !this.contract.trim() || !this.website.trim()
        || !this.num.trim() || !this.contact.trim()) {
        this.regError = true;
        return false;
      }
      this.regError = false;
      return true
    },
    handleApply() {
      if (!this.handleReg()) {
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleApply()
        })
        return;
      }
      const params = {
        type: 2,
        name: this.name,
        code: this.tokenName,
        contract: this.contract,
        website: this.website,
        airdropCount: this.num,
        contact: this.contact,
        chain: this.chain.toLowerCase(),
      }
      this.$http.post('/candy/apply', params).then((res) => {
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
        this.name = '';
        this.tokenName = '';
        this.contract = '';
        this.website = '';
        this.num = '';
        this.contact = '';
        this.chain = 'EOS';
        this.applySuccess = true;
      });
    },
    handleClose() {
      this.applySuccess = false;
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.group{
  font-size: .3rem;
  padding-bottom: .5rem;

  &.androidFocus{
    padding-bottom: 5rem;
  }

  .mrle10{
    margin-left: .1rem;
  }

  .banner{
    height: 2.28rem;
    width: 7rem;
    background-image: linear-gradient(133deg, #426BFF 0%, #3D9EFF 100%);
    border-radius: .11rem;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: .21rem auto;
    font-size: .64rem;
    letter-spacing: .0503rem;
  }

  .content{
    width: 7rem;
    margin: auto;

    .item{
      margin-bottom: .18rem;

      .subTitle{
        margin-bottom: .21rem;

        .tip{
          color: $color-999;
          font-size: .25rem;
        }
      }
      .inputDiv{
        position: relative;

        // 筛选框
        .selectMenu{
          background: white;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          width: 100%;
          position: absolute;
          left: 0rem;
          top: 1rem;
          border-radius: .13rem;
          box-sizing: border-box;
          z-index: 1000;

          &::after{
            content: '';
            border: .1rem solid white;
            position: absolute;
            top: -.1rem;
            box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
            transform: rotate(45deg);
            right: .3rem;
          }

          .scroll{
            z-index: 1000;
            position: relative;
            max-height: 4.6rem;
            overflow: auto;
            padding: 0rem .33rem;
            background: white;
            border-radius: .13rem;
          }

          .select{
            position: relative;
            z-index: 10;;
            background: #FFF;
            font-size: .25rem;

            &>div{
              font-size: .27rem;
              position: relative;
              height: .9rem;
              border-bottom: 1px solid $color-e3e3e3;
              display: flex;
              align-items: center;
              box-sizing: border-box;

              &:last-child{
                border-bottom: 0px solid $color-e3e3e3;
              }
            }
          }
        }
      }
      .input{
        width: 100%;
        height: .8rem;
        border: 1px solid $color-input;
        background: #FFFFFF;
        border-radius: .0694rem;
        font-size: .3rem;
        padding-left: .21rem;
        box-sizing: border-box;

        &.notNull{
          border: 1px solid red;
        }
      }

      .chain{
        display: flex;
        align-items: center;
        justify-content: space-between;

        .down{
          border: .1rem solid transparent;
          border-top: .1rem solid $color-333;
          position: absolute;
          right: .3rem;
          top: 50%;
          transform: translate(0, -25%);

          &.up{
            top: 30%;
            transform: translate(0, 0%) rotate(180deg);
          }
        }
      }
    }

    .applyBtn{
      margin-top: .3rem;
      background: $color-this;
      border-radius: .08rem;
      color: #FFF;
      height: .8rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.popupModel{
  background: transparent;
}
</style>
