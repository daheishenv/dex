/* eslint-disable no-unused-vars */
<template>
  <div class="inviteCode">
    <div id="imageWrapper" :class="lang==0?'imageWrapper_ch':'imageWrapper_en'">
      <p>
        <span>{{ $t('ZN.ZN101') }}：</span>
        <span>{{inviteCode}}</span>
      </p>
    </div>

    <div class="under">
      <p class="left">
        <span>{{$t("ZN.ZN104")}}</span>
        <i>{{inviteCode}}</i>
        <img src="~@/assets/img/activity/twoAnniversary/copy.png" alt="" v-clipboard:copy="inviteCode" v-clipboard:success="onCopy" v-clipboard:error="onError">
      </p>
      <div class="btn" v-clipboard:copy="link" v-clipboard:success="onCopy" v-clipboard:error="onError">
        <img src="~@/assets/img/activity/twoAnniversary/icon_down.png" alt="" style="width:.36rem;height:.36rem">
        <span>{{$t("ZN.ZN142")}}</span>
        <span style="display:none">{{link}}</span>
      </div>
    </div>

    <!-- <div class="btn" @click="toSave">Click</div> -->
  </div>
</template>
<script>
import { accountToSign } from "@/utils/publicApi";
// import html2canvas from "html2canvas";
// eslint-disable-next-line no-unused-vars
import VueClipboard from 'vue-clipboard2';

export default {
    name:'InviteCode',
    data(){
        return {
            inviteCode:"",
            lang:0, //0:中文  1：英文
            language:'',
            link:'https://newdex.340wan.com/events/anniversary2020',
        }
    },
    created(){
        this.getInviteCode()
    },
     mounted(){
      this.getLang()
    },
    watch: {
    '$store.state.app.language': function change() {
      this.getLang()
    }

    },
    methods:{
        getLang(){
          this.language = this.$store.state.app.language;
          if(this.language === 'zh-CN' || this.language === 'zh-TW'){
            this.lang = 0
          }else{
            this.lang = 1;
          }
        },
        // 复制成功时的回调函数
        onCopy () {
          this.$toast({
            message: this.$t('ZN.ZN108'),
            position: "center",
            duration: 2000,
          });
        },
        // 复制失败时的回调函数
        onError () {
          this.$toast({
            message: this.$t('ZN.ZN109'),
            position: "center",
            duration: 2000,
          });
        },
        getInviteCode() {
          const token = localStorage.getItem("token");
          if (!token) {
              accountToSign(this, () => {
                this.getInviteCode();
              });
              return;
          }
          this.$http.post("/anniversary2020/getInviteCode").then((res) => {
            this.inviteCode =res.inviteCode
          });
        },
    }
}
</script>

<style lang="scss" scoped>
  .inviteCode{
    width: 100vw;
    height: 100vh;
    background-color: #f7f7f9;
    overflow: hidden;
    .imageWrapper_ch{
      background: url("../../../assets/img/activity/twoAnniversary/bill.png") no-repeat;
    }
    .imageWrapper_en{
      background: url("../../../assets/img/activity/twoAnniversary/bill2.png") no-repeat;
    }
    #imageWrapper{
      width: 5.6rem;
      height: 10rem;
      margin: 1.1rem auto;
      border-radius: .3rem;
      background-size: 100% 100%;
      overflow: hidden;
      p{
        font-size: .34rem;
        color: white;
        text-align: center;
        margin-top: 2.8rem;
      }
    }
    .under{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 1.04rem;
      background: white;
      display: flex;justify-content: space-between;
      align-items: center;
      .left{
        margin-left: .3rem;
        span{
          color: #000000;
          font-size: .3rem;
          vertical-align: middle;
        }
        i{
          color: #719dff;
          font-size: .3rem;
          vertical-align: middle;
        }
        img{
          margin-left: .1rem;
          vertical-align: middle;
          width: .3rem;
          height: .3rem;
        }
      }
      .btn {
        margin-right:.2rem;
        width: 2.2rem;
        height: .7rem;
        border: solid .02rem #cdcae2;
        border-radius: .1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          color: #000000;
          font-size: .3rem;
          line-height: 0;
        }
        img{
          width: .28rem;
          height: .28rem;
          margin-right: .04rem;
        }
      }
    }
  }
</style>