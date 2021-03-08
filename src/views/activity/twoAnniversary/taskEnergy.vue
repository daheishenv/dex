<template>
  <div class="taskEnergy">
    <p class="title">{{$t("ZN.ZN63")}}</p>
    <div class="taskEnergy-con">
      <!--每日签到  -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/qd.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN31")}}</p>
          <p>+2500</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="getSignIn" v-else-if="accountInfo.signIn === 0">{{$t("ZN.ZN32")}}</div>
        <div class="no-sign" v-else-if="accountInfo.signIn === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- 邀请好友 -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/invite.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN33")}}</p>
          <p>+2500</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="openInvite" v-else-if="accountInfo.invite === 0">{{$t("ZN.ZN34")}}</div>
        <div class="no-sign" v-else-if="accountInfo.invite === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- 完成任意一笔NDX/EOS -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/ndxeos.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN35")}}</p>
          <p>+25000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="jumpNDXEOS" v-else-if="accountInfo.ndxTrade === 0">{{$t("ZN.ZN36")}}</div>
        <div class="no-sign" v-else-if="accountInfo.ndxTrade === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- vip3 专属任务 -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/vip3.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN39")}}</p>
          <p>+10000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="no-sign" v-else-if="accountInfo.vip3 === -1">{{$t("ZN.ZN87")}}</div>
        <div class="sign" @click="getVip3" v-else-if="accountInfo.vip3 === 0">{{$t("ZN.ZN38")}}</div>
        <div class="no-sign" v-else-if="accountInfo.vip3 === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- 新用户专属任务 -->
      <div class="flex" v-if="accountInfo.newUser !== '-1'">
        <img src="~@/assets/img/activity/twoAnniversary/newuser.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN37")}}</p>
          <p>+10000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="no-sign" v-else-if="accountInfo.newUser === -1">{{$t("ZN.ZN88")}}</div>
        <div
          class="sign"
          @click="getNewUser"
          v-else-if="accountInfo.newUser === 0"
        >{{$t("ZN.ZN38")}}</div>
        <div class="no-sign" v-else-if="accountInfo.newUser === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- EOS交易区交易额满5  -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/eos.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN43")}}</p>
          <p>+50000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="jumpNDXEOS" v-else-if="accountInfo.eosArea === 0">{{$t("ZN.ZN42")}}</div>
        <div class="no-sign" v-else-if="accountInfo.eosArea === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- USDT交易区交易额满15 -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/usdt.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN45")}}</p>
          <p>+50000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="jumpNDXUSDT" v-else-if="accountInfo.usdtArea === 0">{{$t("ZN.ZN44")}}</div>
        <div class="no-sign" v-else-if="accountInfo.usdtArea === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- 升一级VIP -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/update.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN41")}}</p>
          <p>+50000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="jumpVip" v-else-if="accountInfo.vipUpgrade === 0">{{$t("ZN.ZN44")}}</div>
        <div class="no-sign" v-else-if="accountInfo.vipUpgrade === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- 跨链充值USDT满10 -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/kl.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN46")}}</p>
          <p>+50000</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div
          class="sign"
          @click="handleCoinCharging(2, 'USDT')"
          v-else-if="accountInfo.depositUsdt === 0"
        >{{$t("ZN.ZN44")}}</div>
        <div class="no-sign" v-else-if="accountInfo.depositUsdt === 1">{{$t("ZN.ZN75")}}</div>
      </div>
      <!-- Newpool完成任意抵押 -->
      <div class="flex">
        <img src="~@/assets/img/activity/twoAnniversary/newpool.png" />
        <div class="popup-test">
          <p>{{$t("ZN.ZN48")}}</p>
          <p>+2500</p>
        </div>
        <div class="no-sign" v-if="isStart === 2">{{$t("ZN.ZN136")}}</div>
        <div class="sign" @click="toNewpool" v-else-if="accountInfo.newpool === 0">{{$t("ZN.ZN44")}}</div>
        <div class="no-sign" v-else-if="accountInfo.newpool === 1">{{$t("ZN.ZN75")}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { accountToSign } from "@/utils/publicApi";
import { jumpCross, getReqUrl } from "@/utils/public";

export default {
  name: "taskEnergy",
  props: {
    accountInfo: {
      type: Object,
      required: true
    },
    isStart: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
    };
  },
  created() {
    this.getTaskEnergyList();
  },
  methods: {
    getTaskEnergyList() {
      this.$http.post("/anniversary2020/taskEnergyList").then(() => {
      });
    },
    // 跳转邀请码海报界面
    openInvite() {
       if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }else{
        this.$router.push("/events/inviteCode");
      }
    },
    // 每日签到
    getSignIn() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          // 获取用户活动信息
          this.getSignIn();
        });
        return;
      }
       if(this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$http.post("/anniversary2020/signIn").then(res => {
        if (res.code === 0) {
          this.$toast({
            message: this.$t("ZN.ZN137"),
            position: "center",
            duration: 2000
          });
          // 签到成功后，更新用户信息
          this.$emit("getAccountInfo");
        } else if (res.code == 1028) {
          this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1029) {
          this.$toast({
            message: this.$t("ZN.ZN138"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1031) {
          this.$toast({
            message: this.$t("ZN.ZN138"),
            position: "center",
            duration: 2000
          });
        }
      });
    },
    //跳转NDX/EOS交易区
    jumpNDXEOS() {
      if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push("/kline/newdexissuer-ndx-eos");
    },
    //跳转交易区
    jumpEOS() {
       if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push("/market/");

      // this.$router.push("/kline/newdexissuer-ndx-eos");
    },
    //跳转NDX/USDT交易区
    jumpNDXUSDT() {
       if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push("/kline/eos_usdt");
      // this.$router.push("/kline/ndx_usdt");
    },
    // 跳转到VIP会员中心界面
    jumpVip() {
      if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push("/vipDetail");
    },
    // 去Newpool 引流
    toNewpool() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          // 获取用户活动信息
          this.toNewpool();
        });
        return;
      }
       if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$http.post("/anniversary2020/toNewpool").then(() => {
        let http = "https://newpool.340wan.com";
        if (this.$evn === "test") {
          http = `http://${getReqUrl("ip")}:${process.env.VUE_APP_PORT21}`;
        }
        const lang = this.$store.state.app.language || "en";
        const channel = this.$store.state.app.channel || "scatter";
        const chain =
          this.$store.state.sys.urlChain ||
          this.$store.state.app.accountInfo.chain ||
          "eos";
        window.location.href = `${http}/eos/?language=${lang}&chain=${chain}&channel=${channel}`;
      });
    },
    // 跳转
    handleCoinCharging(direction, coin) {
       if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      jumpCross(direction, coin);
    },
    // 领取vip3能量
    getVip3() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.getVip3();
        });
        return;
      }
      this.$http.post("/anniversary2020/vip3").then(res => {
        if (res.code === 0) {
          this.$toast({
            message: this.$t("ZN.ZN94"),
            position: "center",
            duration: 2000
          });
          // VIP3领取成功后，更新用户信息，按钮状态
          this.$emit("getAccountInfo");
        } else if (res.code == 1028) {
          this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1029) {
          this.$toast({
            message: this.$t("ZN.ZN84"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1031) {
          this.$toast({
            message: this.$t("ZN.ZN85"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1033) {
          // not a user above vip3
          this.$toast({
            message: this.$t("ZN.ZN87"),
            position: "center",
            duration: 2000
          });
        } else {
          // not a user above vip3
          this.$toast({
            message: this.$t("ZN.ZN132"),
            position: "center",
            duration: 2000
          });
        }
      });
    },
    // 领取新用户能量
    getNewUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.getNewUser();
        });
        return;
      }
      this.$http.post("/anniversary2020/newUser").then(res => {
        this.$emit('getAccountInfo')
        if (res.code === 0) {
          this.$toast({
            message: this.$t("ZN.ZN94"),
            position: "center",
            duration: 2000
          });
          this.$emit("getAccountInfo");
        } else if (res.code == 1028) {
          this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
        } else if (res.code === 1034) {
          // not a new user
          this.$toast({
            message: this.$t("ZN.ZN88"),
            position: "center",
            duration: 2000
          });
        } else {
          this.$toast({
            message: this.$t("ZN.ZN132"),
            position: "center",
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.taskEnergy {
  .title {
    font-weight: bolder;
    line-height: 1rem;
    text-align: center;
  }
  .taskEnergy-con {
    height: 9.37rem;
    overflow: auto;
    img {
      width: 0.66rem;
      height: 0.66rem;
      border-radius: 0.1rem;
    }
    > div {
      width: 6.72rem;
      height: 1.38rem;
      margin: 0 auto 0.14rem auto;
      background: #f6f4fc;
      border-radius: 0.1rem;
      padding: 0 0.32rem 0 0.19rem;
      .popup-test {
        flex: 1;
        margin-left: 0.2rem;
        p:nth-child(1) {
          font-size: 0.26rem;
          color: #000;
        }
        p:nth-child(2) {
          font-size: 0.28rem;
          color: #ff7029;
        }
      }
      .sign {
        color: #fff;
        width: 1.06rem;
        height: 0.44rem;
        background: #b276fc;
        border-radius: 0.2rem;
        line-height: 0.43rem;
        text-align: center;
        font-size: 0.24rem;
      }
      .no-sign {
        color: #fff;
        width: 1.06rem;
        height: 0.44rem;
        background: linear-gradient(#c6cee9, #8e929d);
        border-radius: 0.2rem;
        line-height: 0.43rem;
        text-align: center;
        font-size: 0.24rem;
      }
    }
  }
}
</style>
