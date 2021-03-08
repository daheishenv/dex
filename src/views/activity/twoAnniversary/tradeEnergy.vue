<template>
  <div>
    <!-- 交易能量的标题 -->
    <div class="flexc title2">
      <img src="~@/assets/img/activity/twoAnniversary/left.png" />
      <span>{{$t("ZN.ZN17")}}</span>
      <img src="~@/assets/img/activity/twoAnniversary/right.png" />
    </div>
    <!-- 交易能量下面的任务 -->
    <div class="flexb task">
      <div
        class="flex-column flexc flexstart"
        v-for="(item, index) in designateSymbols"
        :key="index"
      >
        <div class="item flex">
          <img
            v-if="item=='VTX/EOS'"
            src="https://ndi.340wan.com/eos/volentixgsys-vtx.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='EAP/EOS'"
            src="https://ndi.340wan.com/eos/eosauctionpt-eap.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='NDX/EOS'"
            src="https://ndi.340wan.com/eos/newdexissuer-ndx.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='BG/EOS'"
            src="https://ndi.340wan.com/eos/bgbgbgbgbgbg-bg.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='DICE/EOS'"
            src="https://ndi.340wan.com/eos/betdicetoken-dice.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='BAP/EOS'"
            src="https://ndi.340wan.com/eos/baccaratoken-bap.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='HASH/EOS'"
            src="https://ndi.340wan.com/eos/eoshashcoins-hash.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='XBL/EOS'"
            src="https://ndi.340wan.com/eos/billionairet-xbl.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='VIG/EOS'"
            src="https://ndi.340wan.com/eos/vig111111111-vig.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='BOX/EOS'"
            src="https://ndi.340wan.com/eos/token.defi-box.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <p style="font-size:0.3rem;margin-left:0.2rem">{{item}}</p>
        </div>
        <p style="font-size:0.26rem;line-height:0.6rem;width:100%">{{$t("ZN.ZN18")}}</p>
        <div class="item flex">
          <img
            src="~@/assets/img/activity/twoAnniversary/icon_energy.png"
            style="width:0.4rem;height:0.4rem;border-radius:50%"
          />
          <p style="font-size:0.28rem;margin-left:0.1rem">+25000</p>
          <div class="receive receive2" v-if="isStart==0">{{$t("ZN.ZN148")}}</div>
          <div class="receive receive2" v-else-if="isStart==2">{{$t("ZN.ZN136")}}</div>
          <div
            class="receive"
            v-else-if="designateSymbols_f.indexOf(item)==-1&& isStart==1"
            @click="jumpToDesignate(index)"
          >{{$t("ZN.ZN28")}}</div>
          <div class="receive receive2" v-else>{{$t("ZN.ZN75")}}</div>
        </div>
      </div>
    </div>
    <!-- EOS DeFi的标题 -->
    <div class="flexc title2">
      <img src="~@/assets/img/activity/twoAnniversary/left.png" />
      <span>{{$t("ZN.ZN26")}}</span>
      <img src="~@/assets/img/activity/twoAnniversary/right.png" />
    </div>
    <!-- EOS DeFi下面的任务 -->
    <div class="flexb task">
      <div class="flex-column flexc" v-for="(item, index) in defiSymbols" :key="index">
        <div class="item flex">
          <img
            v-if="item=='VIG/EOS'"
            src="https://ndi.340wan.com/eos/vig111111111-vig.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='NUT/EOS'"
            src="https://ndi.340wan.com/eos/eosdtnutoken-nut.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='PIZZA/EOS'"
            src="https://ndi.340wan.com/eos/pizzatotoken-pizza.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='EOS/VIGOR'"
            src="https://ndi.340wan.com/eos/vigortoken11-vigor.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='EOS/EOSDT'"
            src="https://ndi.340wan.com/eos/eosdtsttoken-eosdt.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <img
            v-else-if="item=='EOS/USDE'"
            src="https://ndi.340wan.com/eos/usdetotokens-usde.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <p style="font-size:0.3rem;margin-left:0.2rem">{{item}}</p>
        </div>
        <p style="font-size:0.26rem;line-height:0.6rem;width:100%">{{$t("ZN.ZN18")}}</p>
        <div class="item flex">
          <img
            src="~@/assets/img/activity/twoAnniversary/icon_energy.png"
            style="width:0.4rem;height:0.4rem;border-radius:50%"
          />
          <p style="font-size:0.28rem;margin-left:0.1rem">+30000</p>
          <div class="receive receive2" v-if="isStart==0">{{$t("ZN.ZN148")}}</div>
          <div class="receive receive2" v-else-if="isStart==2">{{$t("ZN.ZN136")}}</div>
          <div
            class="receive"
            v-else-if="defiSymbols_f.indexOf(item)==-1&& isStart==1"
            @click="jumpToEos(index)"
          >{{$t("ZN.ZN19")}}</div>
          <div class="receive receive2" v-else>{{$t("ZN.ZN75")}}</div>
        </div>
      </div>
    </div>
    <p class="tip">{{ $t('ZN.ZN29') }}</p>
    <!-- Newdex Defi的标题 -->
    <div class="flexc title2">
      <img src="~@/assets/img/activity/twoAnniversary/left.png" />
      <span>{{$t("ZN.ZN20")}}</span>
      <img src="~@/assets/img/activity/twoAnniversary/right.png" />
    </div>
    <!-- Newdex Defi下面的任务 -->
    <div class="flexb task">
      <div class="flex-column flexc">
        <div class="item flex">
          <img
            src="https://ndi.340wan.com/eos/token.defi-box.png"
             style="width:0.5rem;height:0.5rem;border-radius:50%"
            alt
          />
          <p style="font-size:0.3rem;margin-left:0.2rem;width:100%">{{$t("ZN.ZN21")}}</p>
        </div>
        <p
          style="font-size:0.26rem;line-height:0.6rem;width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"
        >{{$t("ZN.ZN22")}}</p>
        <div class="item flex">
          <img
            src="~@/assets/img/activity/twoAnniversary/icon_energy.png"
            style="width:0.4rem;height:0.4rem;border-radius:50%"
          />
          <p style="font-size:0.28rem;margin-left:0.1rem">+2500</p>
          <div class="receive receive2" v-if="isStart==0">{{$t("ZN.ZN148")}}</div>
          <div class="receive receive2" v-else-if="isStart==2">{{$t("ZN.ZN136")}}</div>
          <div class="receive" v-else-if="accountInfo.swap === 0&& isStart==1" @click="jumpSwap">{{$t("ZN.ZN19")}}</div>
          <div class="receive receive2" v-else>{{$t("ZN.ZN75")}}</div>
        </div>
      </div>
      <div class="flex-column flexc">
        <div class="item flex">
          <img
            src="~@/assets/img/activity/twoAnniversary/dan.png"
            style="width:0.5rem;height:0.5rem;border-radius:50%"
          />
          <p style="font-size:0.3rem;margin-left:0.2rem">Danchor</p>
        </div>
        <p style="font-size:0.26rem;line-height:0.6rem;width:100%">{{$t("ZN.ZN24")}}</p>
        <div class="item flex">
          <img
            src="~@/assets/img/activity/twoAnniversary/icon_energy.png"
            style="width:0.4rem;height:0.4rem;border-radius:50%"
          />
          <p style="font-size:0.28rem;margin-left:0.1rem">+2500</p>
          <div class="receive receive2" v-if="isStart==0">{{$t("ZN.ZN148")}}</div>
          <div class="receive receive2" v-else-if="isStart==2">{{$t("ZN.ZN136")}}</div>
          <div
            class="receive"
            v-else-if="accountInfo.danchor === 0 && isStart"
            @click="jumpDanchor"
          >{{$t("ZN.ZN28")}}</div>
          <div class="receive receive2" v-else>{{$t("ZN.ZN75")}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { accountToSign } from "@/utils/publicApi";
import { getReqUrl } from "@/utils/public";

export default {
  name: "tradeEnergy",
  props: {
    accountInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      designateSymbols: [], //不带前缀（页面上要显示）
      designateSymbols0: [], //带前缀的
      designateSymbols_f: [], //已完成的
      defiSymbols: [],
      defiSymbols0: [],
      defiSymbols_f: [],
      name: localStorage.getItem("Frontend-Token"),
      isStart: 1
    };
  },
  created() {},
  mounted() {
    this.getDesignateSymbols();
    this.getDefiSymbols();
  },
  watch: {
    accountInfo: {
      handler() {
        this.getDesignateSymbols();
        this.getDefiSymbols();
      },
      deep: true
    }
  },
  methods: {
    //获取指定交易对列表
    getDesignateSymbols() {
      this.$http.get("/anniversary2020/designateSymbols").then(res => {
        this.$emit("changeStart", res.isStart);

        this.designateSymbols0 = res.designateSymbols;
        this.isStart = res.isStart;
        if (this.accountInfo.designateSymbols) {
          this.designateSymbols_f = [];
          var item = this.accountInfo.designateSymbols.split(",");
          item.forEach(el => {
            let which = el.split("");
            if (which.indexOf("-") != -1) {
              let a = el.split("-");
              a.shift();
              let b = a.join("/");
              this.designateSymbols_f.push(b.toUpperCase());
            } else {
              let a = el.split("_");
              let b = a.join("/");
              this.designateSymbols_f.push(b.toUpperCase());
            }
          });
        }

        if (res.code === 0) {
          this.designateSymbols = [];
          res.designateSymbols.forEach(el => {
            //判断两种字符
            let which = el.split("");
            if (which.indexOf("-") != -1) {
              let a = el.split("-");
              a.shift();
              let b = a.join("/");
              this.designateSymbols.push(b.toUpperCase());
            } else {
              let a = el.split("_");
              let b = a.join("/");
              this.designateSymbols.push(b.toUpperCase());
            }
          });
        }
      });
    },
    //获取Difi交易对列表
    getDefiSymbols() {
      this.$http.get("/anniversary2020/defiSymbols").then(res => {
        this.defiSymbols0 = res.defiSymbols;

        if (this.accountInfo.defiSymbols) {
          this.defiSymbols_f = [];
          var item = this.accountInfo.defiSymbols.split(",");
          item.forEach(el => {
            let which = el.split("");
            if (which.indexOf("-") != -1) {
              let a = el.split("-");
              a.shift();
              let b = a.join("/");
              this.defiSymbols_f.push(b.toUpperCase());
            } else {
              let a = el.split("_");
              let b = a.join("/");
              this.defiSymbols_f.push(b.toUpperCase());
            }
          });
        }

        if (res.code === 0) {
          this.defiSymbols = [];
          res.defiSymbols.forEach(el => {
            //判断两种字符
            let which = el.split("");
            if (which.indexOf("-") != -1) {
              let a = el.split("-");
              a.shift();
              let b = a.join("/");
              this.defiSymbols.push(b.toUpperCase());
            } else {
              let a = el.split("_");
              let b = a.join("/");
              this.defiSymbols.push(b.toUpperCase());
            }
          });
        }
      });
    },
    //去做eos交易
    jumpToEos(i) {
      if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push(`/trade/${this.defiSymbols0[i]}?tab=buy`);
    },
    //去做指定交易
    jumpToDesignate(i) {
      if(this.$store.state.app.accountInfo&&this.$store.state.app.accountInfo.chain!=='eos'){
         this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000
          });
          return
      }
      this.$router.push(`/trade/${this.designateSymbols0[i]}?tab=buy`);
    },
    //   去完成Danchor抵押
    jumpDanchor() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.jumpDanchor();
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
      this.$http.post("/anniversary2020/toDanchor").then(() => {
        let http = "https://defibox.340wan.com";
        if (this.$evn === "test") {
          http = `http://${getReqUrl("ip")}:${process.env.VUE_APP_PORT22}`;
        }
        const lang = this.$store.state.app.language || "en";
        const channel = this.$store.state.app.channel || "scatter";
        const chain =
          this.$store.state.sys.urlChain ||
          this.$store.state.app.accountInfo.chain ||
          "eos";
        document.body.scrollTop = 0
        window.location.href = `${http}/swap?language=${lang}&chain=${chain}&channel=${channel}`;
        //   this.$router.push('/?language=zh-CN&chain=eos&channel=scatter')
      });
    },
    //   去完成Swap抵押
    jumpSwap() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.jumpSwap();
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
      this.$http.post("/anniversary2020/toSwap").then(() => {
        let http = "https://dapp.danchor.io";
        if (this.$evn === "test") {
          http = `http://${getReqUrl("ip")}:${process.env.VUE_APP_PORT22}`;
        }
        const lang = this.$store.state.app.language || "en";
        const channel = this.$store.state.app.channel || "scatter";
        const chain =
          this.$store.state.sys.urlChain ||
          this.$store.state.app.accountInfo.chain ||
          "eos";
        window.location.href = `${http}/?language=${lang}&chain=${chain}&channel=${channel}`;
        //   this.$router.push('/?language=zh-CN&chain=eos&channel=scatter')
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title2 {
  color: #ffd0a9;
  margin-top: 0.3rem;
  span {
    display: inline-block;
    padding: 0 0.16rem;
    font-size: 0.36rem;
    line-height: 0.36rem;
  }
  img {
    height: 0.24rem;
    widows: 0.4rem;
  }
}
.task {
  padding: 0 0.3rem;
  font-size: 0.32rem;
  margin-top: 0.4rem;
  display: flex;
  flex-flow: row wrap;
  > div {
    width: 3.14rem;
    padding-left: 0.2rem;
    height: 2.04rem;
    background: #5a42aa;
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
    .item {
      width: 100%;
      // flex: 1;
    }
  }
  .receive {
    width: 1.3rem;
    height: 0.44rem;
    font-size: 0.24rem;
    line-height: 0.44rem;
    border-radius: 0.3rem;
    text-align: center;
    background: #ffce31;
    color: #513114;
    margin-left: 0.3rem;
  }
  .receive2 {
    color: white;
    background: gray;
  }
}
.tip {
  font-size: 0.24rem;
  margin-top: 0.26rem;
  padding-left: 0.3rem;
  color: #ffd0a9;
}
</style>
