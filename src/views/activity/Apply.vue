<template>
  <div class="apply">
    <div class="banner">
      <div class="title">{{ $t('influencer.applyTitle') }}</div>
    </div>

    <div class="form">
      <div class="item inline">
        <div class="title">
          <span>{{ $t('influencer.applyType') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <mt-radio
            class="radio"
            v-model="params.type"
            :options="radio">
          </mt-radio>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>
            <span v-if="type">{{ $t('influencer.name') }}</span>
            <span v-else>{{ $t('influencer.applytype2') }}:</span>
          </span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.name.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="50" v-model="params.name" :class="{'error': error && !params.name.trim()}" type="text">
        </div>
      </div>
      <div class="item" v-if="type">
        <div class="title">
          <span>{{ $t('influencer.sex') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.sex.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="20" v-model="params.sex" :class="{'error': error && !params.sex.trim()}" type="text">
        </div>
      </div>
      <div class="item" v-if="type">
        <div class="title">
          <span>{{ $t('influencer.age') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.age.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" v-model="params.age" :class="{'error': error && !params.age.trim()}" type="number">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.nation') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.country.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="50" v-model="params.country" :class="{'error': error && !params.country.trim()}" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.city') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.city.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="50" v-model="params.city" :class="{'error': error && !params.city.trim()}" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.eosAccount') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.eosAccount.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="12" v-model="params.eosAccount" :class="{'error': error && !params.eosAccount.trim()}" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.email') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.email.trim()">{{ $t('influencer.must') }}</div>
          <input class="input" maxlength="100" v-model="params.email" :class="{'error': error && !params.email.trim()}" type="text">
        </div>
      </div>
      <div class="item" v-if="type">
        <div class="title">
          <span>{{ $t('influencer.profession') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="50" v-model="params.occupation" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.phone') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="50" v-model="params.phone" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.telAccount') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="100" v-model="params.telAccount" type="text">
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.vxAccount') }}</span>
        </div>
        <div class="inputDiv">
          <input class="input" maxlength="100" v-model="params.VXAccount" type="text">
          <div class="lessOne">{{ $t('influencer.or') }}</div>
        </div>
      </div>
      <div class="question">{{ $t('influencer.question') }}</div>
      <div class="center">
        {{ $t('influencer.centerTip') }}
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question1') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer1.trim()">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer1" :class="{'error': error && !params.answer1.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question2') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer2.trim()">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer2" :class="{'error': error && !params.answer2.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question3') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer3.trim()">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer3" :class="{'error': error && !params.answer3.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question4') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer4.trim()">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer4" :class="{'error': error && !params.answer4.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question5') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer5.trim()">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer5" :class="{'error': error && !params.answer5.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('influencer.question6') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer6.length">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer6" :class="{'error': error && !params.answer6.trim()}"></textarea>
        </div>
      </div>
      <div class="item">
        <div class="title">
          <span>{{ $t('ds.ds31') }}</span>
          <span class="color-red">*</span>
        </div>
        <div class="inputDiv">
          <div class="errorTip" v-if="error && !params.answer6.length">{{ $t('influencer.must') }}</div>
          <textarea class="textarea" maxlength="2000" v-model="params.answer7" :class="{'error': error && !params.answer7.trim()}"></textarea>
        </div>
      </div>
    </div>

    <div class="submit">
      <div class="btn" @click="handleApply">{{ $t('influencer.shortSubmit') }}</div>
    </div>

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      position="cneter"
      v-model="showSuccess"
      popup-transition="popup-fade">
      <PopupApplySuccess @listenClose="handleClose" />
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Radio } from 'mint-ui';
// import { accountToSign } from '@/utils/publicApi';

import PopupApplySuccess from './PopupApplySuccess';

export default {
  data() {
    return {
      params: {
        type: '',
        name: '',
        sex: '',
        age: '',
        country: '',
        city: '',
        eosAccount: '',
        email: '',
        occupation: '',
        phone: '',
        telAccount: '',
        VXAccount: '',

        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        answer5: '',
        answer6: '',
        answer7: '',
      },
      radio: [
        {
          label: this.$t('influencer.applytype1'),
          value: this.$t('influencer.applytype1')
        },
        {
          label: this.$t('influencer.applytype2'),
          value: this.$t('influencer.applytype2')
        },
      ],
      options: [
        {
          label: this.$t('influencer.checkbox1'),
          value: this.$t('influencer.checkbox1')
        },
        {
          label: this.$t('influencer.checkbox6'),
          value: this.$t('influencer.checkbox6')
        },
        {
          label: this.$t('influencer.checkbox7'),
          value: this.$t('influencer.checkbox7')
        },
      ],
      error: false,
      type: true,
      showSuccess: false,
    }
  },
  components: {
    PopupApplySuccess,
    mtPopup: Popup,
    mtRadio: Radio
  },
  watch: {
    'params.type': function listen(newVal) {
      if (newVal === this.$t('influencer.applytype1')) {
        this.type = true;
      } else {
        this.type = false;
      }
    },
    'params.age': function listen(newVal) {
      if (newVal > 200) {
        this.params.age = 200;
      }
    },
  },
  mounted() {
    this.params.type = this.$t('influencer.applytype1');
  },
  methods: {
    handleClose() {
      this.showSuccess = false;
    },
    handleApply() {
      if (this.type) { // 个人
        if (!this.params.name.trim() || !this.params.sex.trim() || !this.params.age.trim() || !this.params.country.trim() || !this.params.city.trim()
        || !this.params.eosAccount.trim() || !this.params.answer1.trim() || !this.params.answer2.trim() || !this.params.answer3.trim()
        || !this.params.answer4.trim() || !this.params.answer5.trim() || !this.params.answer6.trim() || !this.params.answer7.trim() || !this.params.email.trim()) {
          this.error = true;
          return;
        }
      }
      if (!this.type) { // 机构
        if (!this.params.name.trim() || !this.params.country.trim() || !this.params.city.trim()
        || !this.params.eosAccount.trim() || !this.params.answer1.trim() || !this.params.answer2.trim() || !this.params.answer3.trim()
        || !this.params.answer4.trim() || !this.params.answer5.trim() || !this.params.answer6.trim() || !this.params.answer7.trim() || !this.params.email.trim()) {
          this.error = true;
          return;
        }
      }

      if (!this.params.VXAccount.trim() && !this.params.telAccount.trim()) {
        this.error = true;
        return;
      }
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   accountToSign(this, () => {
      //     this.handleApply();
      //   })
      //   return;
      // }
      const params = {
        type: this.params.type,
        name: this.params.name,
        gender: this.params.sex,
        age: Number(this.params.age) || '',
        country: this.params.country,
        city: this.params.city,
        job: this.params.occupation,
        eosAccount: this.params.eosAccount,
        email: this.params.email,
        phoneNumber: this.params.phone,
        telegram: this.params.telAccount,
        wechat: this.params.VXAccount,
        wechatName: '',
        telegramName: '',
        answer1: this.params.answer1,
        answer2: this.params.answer2,
        answer3: this.params.answer3,
        answer4: this.params.answer4,
        answer5: this.params.answer5,
        answer6: this.params.answer6,
        answer7: this.params.answer7,
      }
      this.$http.post('/ambassador/apply', params).then((res) => {
        // if (res.code === 401) {
        //   this.$toast({
        //     message: res.msg,
        //     position: 'center',
        //     duration: 2000,
        //   });
        //   accountToSign(this, () => {
        //     this.handleApply();
        //   })
        //   return;
        // }
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.error = false;
        this.showSuccess = true;
        this.params = {
          type: this.$t('influencer.applytype1'),
          name: '',
          sex: '',
          age: '',
          country: '',
          city: '',
          eosAccount: '',
          email: '',
          occupation: '',
          phone: '',
          telAccount: '',
          VXAccount: '',

          answer1: '',
          answer2: '',
          answer3: '',
          answer4: '',
          answer5: '',
          answer6: '',
          answer7: '',
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/public.scss";

.apply{
  position: relative;
  font-size: .32rem;
  background: #FFF;

  .banner{
    height: 3.25rem;
    background: #020f32;
    background-image: url('https://nds.340wan.com/static/img/activity/ambassador/banner.png');
    background-repeat: no-repeat;
    background-size: cover;
    color: #FFF;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .38rem;
  }

  .form{
    padding: .08rem .25rem .9rem .25rem;

    .question{
      text-align: center;
    }

    .center{
      text-align: center;
      font-size: .21rem;
      margin: .05rem 0px .15rem 0px;
      color: $color-yellow;
    }

    .lessOne{
      color: $color-red;
      font-size: .25rem;
    }

    .item{
      padding-bottom: .3rem;

      // .radio{
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // }

      &.inline{
        display: flex;

        .title{
          height: 48px;;
          display: flex;
          align-items: center;
        }
      }

      .inputDiv{
        margin-top: .08rem;

        .input{
          width: 100%;
          height: .7rem;
          border-radius: .08rem;
          font-size: .3rem;
          padding-left: .1rem;
          box-sizing: border-box;
          border: 1px solid $color-input;
        }

        .textarea{
          outline: none;
          width: 100%;
          border-radius: .08rem;
          font-size: .3rem;
          padding-left: .1rem;
          box-sizing: border-box;
          border: 1px solid $color-input;
          height: 1.4rem;;
        }

        .error{
          border: 1px solid $color-red;
        }
        .errorTip{
          color: $color-red;
          font-size: .21rem;
        }
      }

      /deep/ .mint-checklist{
        border-radius: .08rem;
        overflow: hidden;
        box-sizing: border-box;

        .mint-checklist-title{
          height: 0px;
          margin: 0px;
        }

        .mint-cell{
          border: 0px !important;
          background-image: none;
        }
        .mint-cell-wrapper{
          border: 0px !important;
          background-image: none;
        }
        .mint-checklist-label{
          border: 0px !important;
        }
      }

      /deep/ .mint-radiolist{
        // display: flex;
        .mint-radiolist-title{
          margin: 0px;
        }
        .mint-cell{
          border: 0px !important;
          background-image: none;
        }
        .mint-cell-wrapper{
          border: 0px !important;
          background-image: none;
        }
        .mint-checklist-label{
          border: 0px !important;
        }
      }
    }
  }

  .submit{
    position: fixed;
    bottom: 0px;
    background: #FFF;
    height: 1rem;
    width: 100%;
    padding: .1rem .25rem;
    box-sizing: border-box;
    box-shadow: 0px 0rem .1rem $color-999;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn{
      width: 100%;
      background: $color-this;
      border-radius: .08rem;
      height: .7rem;
      color: #FFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.tipPopup{
  background: transparent;
}

</style>
