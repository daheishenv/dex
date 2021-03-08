<template>
  <div>
    <div class="energy flex-column">
      <div
        class="flex-column"
        :class="$store.state.app.language === 'zh-CN'||$store.state.app.language === 'zh-TW' ? 'title-zh' : 'title-en'"
      >
        <div class="content">{{ sharePrizeCount }}{{$t("ZN.ZN61")}}</div>
        <div id="liquidfill" class="liquidfill"></div>
        <div class="no-recharge-btn" v-if="sharePrizeStatus===1&&accountStatus===1">{{$t("ZN.ZN150")}}</div>
        <div
          class="recharge-btn"
          v-else-if="sharePrizeStatus===1&&accountStatus===0"
          @click="draw"
        >{{$t("ZN.ZN69")}}</div>
        <!-- 立即开奖 -->
        <div
          class="no-recharge-btn"
          v-else-if="sharePrizeStatus===1&&accountStatus===-1"
        >{{$t("ZN.ZN72")}}</div>
        <!-- 能量未集满 -->
        <div
          class="no-recharge-btn"
          v-else-if="sharePrizeStatus===0&&accountStatus===0"
        >{{$t("ZN.ZN68")}}</div>
        <!-- //等待开奖 -->
        <div
          class="recharge-btn"
          v-else-if="sharePrizeStatus===0&&accountStatus===-1&&energy >= 10000"
          @click="rechare"
        >{{$t("ZN.ZN62")}}</div>
        <!-- 冲1w能量 -->
        <div class="no-recharge-btn" v-else>{{$t("ZN.ZN65")}}</div>
        <!-- 无法充值 -->
        <div @click="jumpAnniversary" class="flex" style="margin-top:0.5rem">
          <span style="color:#FFDFB0;font-size:0.26rem;">{{$t("ZN.ZN63")}}</span>
          <img
            style="margin-left:0.1rem;width:0.27rem;height:0.27rem"
            src="~@/assets/img/activity/twoAnniversary/turn-right.png"
            alt
          />
        </div>
        <p style="color:#fff;font-size:0.24rem;margin-top:0.56rem;padding:0 .6rem">{{$t("ZN.ZN64")}}</p>
      </div>
    </div>
    <!-- 开奖弹窗 -->
    <mt-popup
      v-model="drawVisible"
      position="center"
      class="drawVisible flex-column"
      lockScroll="true"
    >
      <img
        v-if="$store.state.app.language === 'zh-CN'||$store.state.app.language === 'zh-TW'"
        src="~@/assets/img/activity/twoAnniversary/prize-top.png"
        alt
        class="top-title"
      />
      <img
        v-else
        src="~@/assets/img/activity/twoAnniversary/prize-top-en.png"
        alt
        class="top-title"
      />
      <div style="text-align:center">
        <!-- :src="'/static/img/activity/twoAnniversary/'+ownInfo.coinName+'.png'" -->

        <img
          :src="'/static/img/activity/twoAnniversary/'+prize.split(' ')[1]+'.png'"
          style="height:2rem;width:2rem;margin-top:1rem"
        />
        <p style="color:#000000;font-size:0.28rem;margin-top:0.3rem">{{$t("ZN.ZN73")}}</p>
        <p style="color:#FF7B03;font-size:0.54rem;margin-top:0.25rem">+{{prize}}</p>
        <p style="color:#666666;font-size:0.24rem;margin-top:0.55rem">{{$t("ZN.ZN152")}} <span style="cursor:pointer;color:#cd8121" @click="$router.push('/property/')"> {{$store.state.app.accountInfo.account}}</span></p>
      </div>
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="drawVisible = false"
        class="close-bottom"
      />
    </mt-popup>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-liquidfill/src/liquidFill.js";
// import echarts from "echarts/lib/echarts";
import { accountToSign } from "@/utils/publicApi";
import { Popup } from "mint-ui";

export default {
  name: "energy",
  components: {
    mtPopup: Popup,
  },
  data() {
    return {
      nowEnergy: "sa",
      accountInfo: {
        danchor: 0,
        defi: 0,
        depositUsdt: 0,
        drawLog: [],
        energy: 0,
        eosArea: 0,
        invite: 0,
        ndxTrade: 0,
        newUser: 0,
        newpool: 0,
        signIn: 0,
        swap: 0,
        usdtArea: 0,
        vip3: 0,
        vipUpgrade: 0,
      }, //用户的基本信息
      depositEnergy: 0, //已充值能量
      energy: 0, //用户剩余能量
      isStart: 0,
      sharePrizeCount: 0, //瓜分大奖人数
      sharePrizeStatus: 0, // 是否已经开奖
      accountStatus: -1,
      drawVisible: false,
      prize: "",
    };
  },
  created() {
    this.getsharePrizeCount();
  },
  mounted() {
    this.echartsMit();
    this.getEnergyInfo();
  },
  methods: {
    //开奖
    draw() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.rechare();
        });
        return;
      }
      this.$http.post("/anniversary2020/getPrize").then((res) => {
        if (res.code === 0) {
          this.drawVisible = true;
          this.sharePrizeStatus = 1;
          this.accountStatus = 1;
          this.prize = res.prize;
          this.setEnergy(880000);
        }
      });
    },
    getsharePrizeCount() {
      // 获取瓜分大奖资格人数
      this.$http.post("/anniversary2020/sharePrizeCount").then((res) => {
        this.sharePrizeCount = res.sharePrizeCount;
      });
    },
    getsharePrizeInfo() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.rechare();
        });
        return;
      }
      this.$http.post("/anniversary2020/sharePrizeInfo").then((res) => {
        if (res.code === 0) {
          this.sharePrizeStatus = res.sharePrizeStatus;
          this.accountStatus = res.accountStatus;
          if (res.prize) {
            this.prize = res.prize;
          }
          this.setEnergy(this.depositEnergy);
        } else {
          this.$toast({
            message: this.$t("ZN.ZN132"),
            position: "center",
            duration: 2000,
          });
        }
      });
    },
    echartsMit() {
      var dom = document.getElementById("liquidfill");
      var myChart = echarts.init(dom);
      myChart.setOption({
        series: [
          {
            radius: "95%",
            backgroundStyle: {
              color: "transparent",
            },
            type: "liquidFill",
            data: [
              { value: 0, num: 0 },
              { value: 0, num: 0 },
            ],
            itemStyle: {
              shadowBlur: 0,
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "rgba(58, 71, 212, 0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(31, 222, 225, .2)",
                  },
                  {
                    offset: 0,
                    color: "rgba(31, 222, 225, 1)",
                  },
                ],
                globalCoord: false,
              },
            },
            outline: {
              show: false,
            },
            label: {
              position: ["50%", "40%"],
              formatter: (p) => {
                let title = "";
                if (this.$store.state.app.language === "zh-CN") {
                  title = "当前能量";
                  if (this.accountStatus === 1) {
                    return `\n\n{title|恭喜您}\n\n{title|获得 ${this.prize}}`;
                  } else if (this.accountStatus === 0) {
                    return `\n\n{title|恭喜您}\n\n{title|能量已集满}`;
                    // 已开奖
                  } else if (
                    this.sharePrizeStatus === 1 &&
                    this.accountStatus === -1
                  ) {
                    return `\n\n\n\n{title|很遗憾，能量未集满}`;
                  } else {
                    return `\n\n{title|${title}}\n\n{num|${p.data.num}}`;
                  }
                } else if (this.$store.state.app.language === "ko") {
                  title = "Current energy";
                  if (this.accountStatus === 1) {
                    return `\n\n{title|Congratulations}\n\n{title|on getting${this.prize}}`;
                  } else if (this.accountStatus === 0) {
                    return `\n\n{title|Congratulations}\n\n{title|the energy collection is completed}`;
                    // 已开奖
                  } else if (
                    this.sharePrizeStatus === 1 &&
                    this.accountStatus === -1
                  ) {
                    return `\n\n\n\n{title|Insufficient energy}`;
                  } else {
                    return `\n\n{title|${title}}\n\n{num|${p.data.num}}`;
                  }
                } else if (this.$store.state.app.language === "zh-TW") {
                  title = "當前能量";
                  if (this.accountStatus === 1) {
                    return `\n\n{title|恭喜您}\n\n{title|獲得 ${this.prize}}`;
                  } else if (this.accountStatus === 0) {
                    return `\n\n{title|恭喜您}\n\n{title|能量已集滿}`;
                    // 已开奖
                  } else if (
                    this.sharePrizeStatus === 1 &&
                    this.accountStatus === -1
                  ) {
                    return `\n\n\n\n{title|很遺憾，能量未集滿}`;
                  } else {
                    return `\n\n{title|${title}}\n\n{num|${p.data.num}}`;
                  }
                } else {
                  title = "Current energy";
                  if (this.accountStatus === 1) {
                    return `\n\n{title|Congratulations}\n\n{title|on getting${this.prize}}`;
                  } else if (this.accountStatus === 0) {
                    return `\n\n{title|Congratulations}\n\n{title|the energy collection is completed}`;
                    // 已开奖
                  } else if (
                    this.sharePrizeStatus === 1 &&
                    this.accountStatus === -1
                  ) {
                    return `\n\n\n\n{title|Insufficient energy}`;
                  } else {
                    return `{title|${title}}\n\n{num|${p.data.num}}`;
                  }
                }
              },
              fontSize: 10,
              color: "#D94854",
              rich: {
                title: {
                  color: "#E5E1FF",
                },
                num: {
                  color: "#fff",
                },
              },
            },
          },
        ],
      });
    },
    // 充值10000能量
    rechare() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.rechare();
        });
        return;
      }
      this.$http.post("/anniversary2020/depositEnergy").then((res) => {
        if (res.code === 0) {
          this.$toast({
            message: this.$t("ZN.ZN93"),
            position: "center",
            duration: 2000,
          });
        } else if (res.code === 1032) {
          this.$toast({
            message: this.$t("ZN.ZN86"),
            position: "center",
            duration: 2000,
          });
        } else if (res.code === 1040) {
          this.$toast({
            message: this.$t("ZN.ZN145"),
            position: "center",
            duration: 2000,
          });
        } else if (res.code == 1028) {
          this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000,
          });
        } else {
          this.$toast({
            message: this.$t("ZN.ZN132"),
            position: "center",
            duration: 2000,
          });
        }
        this.getAccountInfo();
        this.getEnergyInfo();
      });
    },
    getAccountInfo() {
      // 获取用户活动信息
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.getAccountInfo();
        });
        return;
      }
      this.$http.post("/anniversary2020/accountInfo").then((res) => {
        this.accountInfo = res.accountInfo;
      });
    },
    setEnergy(num) {
      var dom = document.getElementById("liquidfill");
      var myChart = echarts.init(dom);
      myChart.setOption({
        series: [
          {
            data: [
              { value: num / 880000, num },
              { value: num / 880000, num },
            ],
          },
        ],
      });
    },
    getEnergyInfo() {
      // 获取用户剩余能量和已充值能量
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.getEnergyInfo();
        });
        return;
      }
      this.$http.post("/anniversary2020/energyInfo").then((res) => {
        const { depositEnergy, energy } = res;
        if (depositEnergy !== undefined) {
          this.depositEnergy = depositEnergy;
          this.energy = energy;
        }
        this.getsharePrizeInfo();
        // this.accountInfo = res.accountInfo;
      });
    },
    // 跳转回两周年庆首页
    jumpAnniversary() {
      this.$router.push("/events/anniversary2020?task=1");
    },
  },
};
</script>

<style lang="scss" scoped>
.energy {
  background: #320562;
  padding-bottom: 1.21rem;
  color: #fff;
  .title-zh {
    width: 100%;
    background: url("~@/assets/img/activity/twoAnniversary/star.png") no-repeat
        center 0.2rem/6.5rem 4.3rem,
      url("~@/assets/img/activity/twoAnniversary/energy-title.png") no-repeat
        center 0.96rem/5.37rem 2.13rem;
  }
  .title-en {
    width: 100%;
    background: url("~@/assets/img/activity/twoAnniversary/star.png") no-repeat
        center 0.2rem/6.5rem 4.3rem,
      url("~@/assets/img/activity/twoAnniversary/energy-title-en.png") no-repeat
        center 1.96rem/6.73rem 1.06rem;
  }
  .content {
    width: 5.36rem;
    height: 0.57rem;
    line-height: 0.57rem;
    color: #ffeed2;
    font-size: 0.26rem;
    text-align: center;
    margin-top: 3.5rem;
    margin-bottom: 0.4rem;
  }
  .liquidfill {
    width: 4.67rem;
    height: 4.67rem;
    margin-top: 0.3rem;
    background: url("~@/assets/img/activity/twoAnniversary/light.png") no-repeat
      0 0/4.67rem 4.67rem;
  }

  .no-recharge-btn,
  .recharge-btn {
    margin-top: 0.61rem;
    width: 3.47rem;
    height: 0.81rem;
    background: linear-gradient(#ff80ab, #d93853);
    color: #fff;
    line-height: 0.81rem;
    text-align: center;
    font-size: 0.34rem;
    border-radius: 0.5rem;
  }
  .no-recharge-btn {
    background: linear-gradient(#c6cee9, #8e929d);
  }
}
.drawVisible {
  width: 5.6rem;
  height: 5.31rem;
  background: #fff;
  border-radius: 0.3rem;
  font-size: 0.32rem;
  color: #fff;
  p {
    width: 100%;
    text-align: center;
  }
}
.close-bottom {
  width: 0.6rem;
  height: 0.6rem;
  position: absolute;
  right: 50%;
  top: 100%;
  margin-top: 0.4rem;
  margin-right: -0.3rem;
  // margin-left: -0.2rem;
  z-index: 999;
}
.top-title {
  width: 5.6rem;
  height: 2.48rem;
  position: absolute;
  top: -2.2rem;
}
/deep/ .v-modal{
  background: rgba(0, 0, 0, 1)!important;
  opacity: 0.8;
}

</style>
