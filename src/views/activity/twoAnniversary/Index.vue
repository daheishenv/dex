<template>
  <div class="twoAnniversary flex-column" style="overflow-y:hidden">
    <select id="lang" v-model="language" class="langSelect" ref="lang">
      <option v-for="(item, $index) in solts" :key="$index" :value="item.key">
        {{
        item.name
        }}
      </option>
    </select>
    <img src="~@/assets/img/activity/twoAnniversary/lang.png" class="lang" />
    <div class="flex-column top-bg-zh flexc" style="position:absolute">
      <img
        v-if="language === 'zh-CN'||language === 'zh-TW'"
        class="top-bg-img-zh"
        src="~@/assets/img/activity/twoAnniversary/title.png"
      />
      <img v-else class="top-bg-img-en" src="~@/assets/img/activity/twoAnniversary/title-en.png" />
    </div>
    <div style="width:100%">
      <div class="turntable">
        <div class="luckDraw">
          <!-- 抽奖 -->
          <div class="luckDrawCont turntable-box">
            <div class="btn"></div>
            <div ref="turntable" v-if="turntableShow"></div>
          </div>
        </div>
        <!-- 扭蛋日图标 -->
        <div class="handleMove">
          <img
            src="~@/assets/img/activity/twoAnniversary/egg.png"
            class="egg"
            @click="reciveEnergy"
          />
          <span
            style="display:block;width:1.4rem;text-align:center; position:absolute;z-index:1;top:4.2rem;right:.08rem;font-size:.2rem"
          >{{ $t('ZN.ZN135') }}</span>
        </div>
      </div>
      <div class="myenergy flex flexc">
        <img
          src="~@/assets/img/activity/twoAnniversary/icon_energy.png"
          style="height:0.4rem;width:0.4rem;margin-right:.06rem"
        />
        <span>{{$t("ZN.ZN4")}}{{ accountInfo.energy }}</span>
      </div>
    </div>
    <!-- 底部内容 -->
    <div class="bottom">
      <!-- 大转盘的功能行 -->
      <div class="flex btn">
        <div class="flex-column">
          <img
            src="~@/assets/img/activity/twoAnniversary/help.png"
            style="width:2rem;height:2rem;margin-top:.1rem"
            @click="handleInvite"
          />
          <p>{{$t("ZN.ZN53")}}</p>
        </div>
        <!-- 转一转 -->
        <div class="flex-column">
          <div @click="handleTurntable" style="position:relative">
            <img
              src="~@/assets/img/activity/twoAnniversary/turn.png"
              alt
              style="width:2.42rem;height:1.14rem;cursor:pointer"
            />
            <div style="position:absolute;width:100%;height:100%;top:0;left:0;cursor:pointer">
              <p style="font-size:.4rem">{{ $t('ZN.ZN7') }}</p>
            </div>
          </div>
          <div style="width:2.6rem">{{$t("ZN.ZN8")}}</div>
        </div>
        <div class="flex-column" @click="task">
          <img
            src="~@/assets/img/activity/twoAnniversary/energy.png"
            style="width:2rem;height:2rem;margin-top:.1rem"
          />
          <p>{{$t("ZN.ZN6")}}</p>
        </div>
      </div>
      <!-- 大使祝福 奖品 攻略 -->
      <div class="wrap flexb">
        <!-- 点击弹出视频 -->
        <div class="flex-column flexc" @click="videoPopupVisible = true">
          <img
            src="~@/assets/img/activity/twoAnniversary/ambassador.png"
            style="width:0.56rem;height:0.56rem"
          />
          <p>{{$t("ZN.ZN9")}}</p>
        </div>
        <div class="flex-column flexc" @click="getlastDrawLog">
          <img
            src="~@/assets/img/activity/twoAnniversary/prize.png"
            style="width:0.56rem;height:0.56rem"
          />
          <p>{{$t("ZN.ZN10")}}</p>
        </div>
        <div class="flex-column flexc" @click="strategyVisible=true">
          <img
            src="~@/assets/img/activity/twoAnniversary/strategy.png"
            style="width:0.56rem;height:0.56rem"
          />
          <p>{{$t("ZN.ZN134")}}</p>
        </div>
      </div>
      <div class="flex">
        <img
          v-if="language === 'zh-CN'||language === 'zh-TW'"
          src="~@/assets/img/activity/twoAnniversary/banner.png"
          alt
          @click="$router.push('energy')"
          style="width:7.1rem;margin:0 auto"
        />
        <img
          v-else
          src="~@/assets/img/activity/twoAnniversary/banner-en.png"
          alt
          @click="$router.push('energy')"
          style="width:7.1rem;margin:0 auto"
        />
      </div>

      <!-- 时间线 -->
      <!-- <div style="text-align:center;margin-top:0.4rem">
        <img
          v-if="language === 'zh-CN'"
          src="~@/assets/img/activity/twoAnniversary/time.png"
          style="width:6.6rem;height:1.11rem;"
        />
        <img
          v-else
          src="~@/assets/img/activity/twoAnniversary/time-en.png"
          style="width:6.6rem;height:1.11rem;"
        />
      </div>-->

      <tradeEnergy @changeStart="changeStart" :accountInfo="accountInfo" />
    </div>
    <!-- 点击领取能量弹出的任务框 -->
    <mt-popup
      v-model="popupVisible"
      ref="popupVisible"
      position="bottom"
      class="popup"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-b.png"
        alt
        @click="popupVisible = false"
        class="close"
      />
      <taskEnergy @getAccountInfo="getAccountInfo" :accountInfo="accountInfo" :isStart="isStart" />
    </mt-popup>
    <!-- 奖品列表-->
    <mt-popup
      v-model="prizePopupVisible"
      position="center"
      class="prizePopupVisible"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="prizePopupVisible = false"
        class="close-bottom"
      />
      <div class="prizeTitle">{{$t("ZN.ZN10")}}</div>
      <div class="prizePopup flex-column">
        <div v-if="accountInfo.drawLog.length===0" class="flexc flex-column">
          <img
            src="~@/assets/img/activity/twoAnniversary/no-prize.png"
            style="height:3rem;width:3rem;margin-top:0.5rem"
          />
          <p style="margin-top:30px">{{$t("ZN.ZN147")}}</p>
        </div>
        <div v-else class style="width:100%">
          <div
            v-for="item in accountInfo.drawLog"
            :key="item.id"
            class="flex tttt"
            style="width:100%;"
          >
            <div style="flex:1">{{ item.createTs | dateFormatBIH }}</div>
            <div style="width:2.5rem;line-height:0.8rem">{{ item.reward }}</div>
          </div>
        </div>
      </div>
    </mt-popup>
    <!-- 攻略弹窗-->
    <mt-popup
      v-model="strategyVisible"
      position="center"
      class="strategyVisible"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="strategyVisible = false"
        class="close-bottom"
      />
      <div class="prizeTitle">{{ $t('ZN.ZN134') }}</div>
      <p style="margin-bottom:.2rem">{{ $t('ZN.ZN12') }}</p>
      <ul style="padding:0 .15rem">
        <li style="margin-bottom:.1rem">{{ $t('ZN.ZN13') }}</li>
        <li style="margin-bottom:.1rem">{{ $t('ZN.ZN14') }}</li>
        <li style="margin-bottom:.1rem">{{ $t('ZN.ZN15') }}</li>
        <li style="margin-bottom:.1rem">{{ $t('ZN.ZN16') }}</li>
      </ul>
    </mt-popup>
    <!-- 点击转一转 中奖的弹窗 -->
    <mt-popup
      v-model="turnPopupVisible"
      position="center"
      class="flex-column turnPopupVisible"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <div
        :class="language === 'zh-CN'||language === 'zh-TW'?'prize-bottom':'prize-bottom-en'"
        @click="jumpEnergy"
      ></div>
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="turnPopupVisible = false"
        class="prize-close-bottom"
      />
      <p style="font-size:0.34rem;margin-top:0.5rem">{{$t("ZN.ZN73")}}</p>
      <img
        :src="'/static/img/activity/twoAnniversary/'+ownInfo.coinName+'.png'"
        style="height:2rem;width:2rem;margin-top:0.5rem"
      />
      <p style="margin-top:0.4rem">{{ ownInfo.reward }}</p>
      <div class="flex" style="margin-top:0.75rem;" @click="openTask">
        <img
          src="~@/assets/img/activity/twoAnniversary/right-icon.png"
          style="height:0.16rem;width:0.49rem;margin-right:0.15rem"
        />
        <p style="font-size:0.28rem">{{$t("ZN.ZN30")}}</p>
        <img
          src="~@/assets/img/activity/twoAnniversary/left-icon.png"
          style="height:0.16rem;width:0.49rem;margin-left:0.15rem"
        />
      </div>
    </mt-popup>
    <!-- 未中奖的弹窗 -->
    <mt-popup
      v-model="thankVisible"
      position="center"
      class="thankVisible flex-column"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <div
        :class="language === 'zh-CN'||language === 'zh-TW'?'prize-bottom':'prize-bottom-en'"
        @click="noJumpEnergy"
      ></div>
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="thankVisible = false"
        class="prize-close-bottom"
      />
      <p style="font-size:0.34rem;margin-top:0.5rem">{{$t('ZN.ZN52')}}</p>
      <div class="content">
        <img
          :src="'/static/img/activity/twoAnniversary/'+ownInfo.coinName+'.png'"
          style="height:1.52rem;width:1.52rem"
        />
        <p
          style="width:5rem;color:red;font-size:0.44rem;margin-top:-0.3rem;text-align:center;margin-top:0.9rem;position:absolute"
        >{{$t(ownInfo.title)}}</p>
        <div
          class="flexc flex-column"
          style="color:#000;width:100%;height:100%;over-flow:hidden;justify-content: flex-start;"
        >
          <!-- <p style="text-indent:2em;">{{$t(ownInfo.content)}}</p> -->
          <p
            style="margin:0 1rem;width:80%;word-wrap:break-word;margin-top:1.6rem;line-height:20px"
          >{{$t(ownInfo.content)}}</p>
        </div>
      </div>
    </mt-popup>
    <!-- 视频弹窗 -->
    <mt-popup
      v-model="videoPopupVisible"
      position="center"
      class="videoPopup flex-column"
      lockScroll="true"
      :closeOnClickModal="false"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="videoPopupVisible = false"
        class="close-bottom"
      />
      <video
        v-if="videoPopupVisible&&(language === 'zh-CN'||language === 'zh-TW')"
        src="https://cdn.340wan.com/anniversary2020.mp4"
        style="width:7rem;height:4rem"
        controls="controls"
        poster="~@/assets/img/activity/twoAnniversary/first-img.png"
      >your browser does not support the video tag</video>
      <div v-else-if="videoPopupVisible">
        <iframe
          style="width:7rem;height:4rem"
          src="https://www.youtube.com/embed/30ZVLxoA26c"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </mt-popup>
    <!-- 点击每日助力的弹窗 -->
    <mt-popup
      v-model="invitePopupVisible"
      position="center"
      class="turnPopup flex-column"
      lockScroll="true"
      :closeOnClickModal="false"
      style="padding:.1rem"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-w.png"
        alt
        @click="invitePopupVisible = false"
        class="close-bottom"
      />
      <p style="font-size:0.32rem;margin-top:0.5rem">{{$t("ZN.ZN53")}}</p>
      <p style="font-size:0.24rem;margin-top:0.2rem">{{$t("ZN.ZN54")}}</p>
      <p style="font-size:0.24rem;margin-top:0.1rem">{{$t("ZN.ZN55")}}</p>
      <div style="margin-top:0.37rem;width:80%" class="flexb">
        <img
          src="~@/assets/img/activity/twoAnniversary/invited.png"
          style="height:0.69rem;width:0.69rem"
          v-for="(item, index) in accountInfo.boostTimes"
          :key="index"
        />
        <img
          src="~@/assets/img/activity/twoAnniversary/uninvited.png"
          style="height:0.69rem;width:0.69rem"
          v-for="(item, index) in 5 - accountInfo.boostTimes"
          :key="5 - index"
        />
      </div>
      <div class="flex code">
        <input v-model="inviteCode" :placeholder="$t('ZN.ZN56')" />
        <div class="confirm" @click="boost">{{ $t('Lab.Lab64') }}</div>
      </div>
      <div class="flex" style="font-size:0.23rem;margin-top:0.5rem">
        <img
          src="~@/assets/img/activity/twoAnniversary/hg.png"
          style="height:0.32rem;width:0.32rem;margin-right:0.2rem;margin-left:.1rem"
          alt
        />
        <span>{{$t("ZN.ZN50")}}</span>
      </div>
      <div class="create-btn" style="font-size:.3rem" @click="jumpInviteCode">{{ $t('ZN.ZN107') }}</div>
    </mt-popup>
    <div class="gl">
      <h2>{{$t("ZN.ZN134")}}</h2>
      <p style="margin-bottom:.1rem">{{$t("ZN.ZN12")}}</p>
      <p>{{$t("ZN.ZN13")}}</p>
      <p>{{$t("ZN.ZN14")}}</p>
      <p>{{$t("ZN.ZN15")}}</p>
      <p>{{$t("ZN.ZN16")}}</p>
    </div>
    <p class="bt-text" style="margin-bottom:.8rem">{{$t("ZN.ZN106")}}</p>
  </div>
</template>
<script>
import { accountToSign } from "@/utils/publicApi";
import { Popup } from "mint-ui";
import LotteryTurntable from "lottery-turntable";
import tradeEnergy from "./tradeEnergy";
import taskEnergy from "./taskEnergy";
// 未中奖标语
const wzj = [
  {
    coinName: "BAP",
    name: "ZN.ZN110",
    title: "ZN.ZN119",
  },
  {
    coinName: "VIG",
    name: "ZN.ZN111",
    title: "ZN.ZN120",
  },
  {
    coinName: "XBL",
    name: "ZN.ZN112",
    title: "ZN.ZN121",
  },
  {
    coinName: "FLX",
    name: "ZN.ZN113",
    title: "ZN.ZN122",
  },
  {
    coinName: "BG",
    name: "ZN.ZN114",
    title: "ZN.ZN123",
  },
  {
    coinName: "DICE",
    name: "ZN.ZN115",
    title: "ZN.ZN124",
  },
  {
    coinName: "HASH",
    name: "ZN.ZN116",
    title: "ZN.ZN125",
  },
  {
    coinName: "NDX",
    name: "ZN.ZN117",
    title: "ZN.ZN126",
  },
  {
    coinName: "BOX",
    name: "ZN.ZN118",
    title: "ZN.ZN127",
  },
];
const turnImgSize = Math.floor(
  90 * 0.5 * (document.documentElement.clientWidth / 375)
);
export default {
  name: "TwoAnniversary",
  components: {
    mtPopup: Popup,
    tradeEnergy,
    taskEnergy,
  },
  data() {
    return {
      solts: [
        {
          key: "en",
          name: "English",
        },
        {
          key: "zh-CN",
          name: "简体中文",
        },
        {
          key: "zh-TW",
          name: "繁體中文",
        },
        {
          key: "ko",
          name: "한국어",
        },
      ],
      locationLang: "",
      language: "",
      changeLanguage: false,
      // showLangBox:true, //语言切换是否显示
      accountInfo: {
        boostTimes: 0, // 被助力次数
        danchor: 0, //Danchor完成任意一笔交易：0-未完成；1-已完成 ,
        defi: 0, //完成Defi交易区任务：0-未完成；1-已完成 ,
        depositUsdt: 0, //跨链充值USDT满10：0-未完成；1-已完成 ,
        drawLog: [], //抽奖记录
        energy: 0, //剩余能量
        eosArea: 0, //EOS交易区交易额满5：0-未完成；1-已完成
        invite: 0, //邀请好友：0-未完成；1-已完成
        ndxTrade: 0, // 完成任意一笔NDX/EOS交易：0-未完成；1-已完成
        newUser: 0, //新用户专属：-1-非新用户;0-未领取；1-已领取 ,
        newpool: 0, // Newpool完成任意抵押挖矿：0-未完成；1-已完成
        signIn: 0, //每日签到：0-未完成；1-已完成
        swap: 0, //SWAP完成任意一笔交易：0-未完成；1-已完成
        usdtArea: 0, //USDT交易区交易额满15：0-未完成；1-已完成
        vip3: 0, //VIP3以上专属：-1-非VIP3以上；0-未领取；1-已领取 ,
        vipUpgrade: 0, //升级VIP：0-未完成；1-已完成
      }, //用户的基本信息
      popupVisible: false, //领取能量弹窗
      turnPopupVisible: false, //中奖弹窗
      invitePopupVisible: false, //助力弹窗
      videoPopupVisible: false, //视频弹窗
      strategyVisible: false, //攻略弹窗
      inviteCode: "", //邀请码
      turntable: "",
      lastDrawLog: [], //中奖纪录
      thankVisible: false, //未中奖弹窗
      prizePopupVisible: false, //奖品弹窗
      turntableShow: true, // 抽奖转盘显示
      isClick: true, //大转盘是否可以点击
      ownInfo: {
        awardLevel: "",
        reward: "",
        coinName: "",
        content: "", //未中奖的活动标语,
        title: "", //未中奖时 项目方名称
      },
      isStart: 0, //0 未开始 1 开始 2已结束
    };
  },
  created() {
    if (this.$store.state.app.accountInfo) {
      this.getAccountInfo();
    }
    this.getDesignateSymbols();
    if (this.$route.query.task === "1") {
      setTimeout(() => {
        this.popupVisible = true;
      }, 300);
    }
  },
  computed: {
    getFixed() {
      return function (prize) {
        const arr = prize.split(" ");
        return Number(arr[0]).toFixed(2) + arr[1];
      };
    },
  },
  mounted() {
    this.language = this.$store.state.app.language;
    this.handleCheckLang(this.language);
    this.initTurntable();
    this.locationLang = window.location.search;
    const isFirst = localStorage.getItem("anniversary2020");
    if (isFirst === null) {
      this.videoPopupVisible = true;
      localStorage.setItem("anniversary2020", false);
    }
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
    "$store.state.app.language": function change() {
      this.turntableShow = false;
      setTimeout(() => {
        this.turntableShow = true;
        this.$nextTick(() => {
          this.initTurntable();
        });
      }, 1000);
    },

    invitePopupVisible: function () {
      setTimeout(() => {
        this.inviteCode = "";
      }, 300);
    },
    inviteCode: function () {
      this.handleInviteCode();
    },
  },
  methods: {
    /*
     * 语言切换
     * 返回 lang
     */
    handleCheckLang(lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch("setLanguage", lang);
    },
    openTask() {
      this.turnPopupVisible = false;
      setTimeout(() => {
        this.popupVisible = true;
      }, 300);
    },
    changeStart(isStart) {
      this.isStart = isStart;
    },
    getAccountInfo() {
      // 获取用户活动信息
      if (this.$store.state.app.accountInfo) {
        this.$http.post("/anniversary2020/accountInfo").then((res) => {
          if (res.code === 0) {
            this.accountInfo = res.accountInfo;
            this.isStart = res.isStart;
          }
        });
      }
    },
    // 任务弹窗打开
    task() {
      this.popupVisible = true;
    },
    //跳转集能量界面
    reciveEnergy() {
      this.$router.push("energy");
    },
    //关闭未中奖，跳转集能量界面
    noJumpEnergy() {
      this.thankVisible = false;
      this.$router.push("energy");
    },
    //关闭中奖，跳转集能量界面
    jumpEnergy() {
      this.turnPopupVisible = false;
      this.$router.push("energy");
    },
    // 打开邀请好友弹窗
    handleInvite() {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.handleInvite();
        });
        return;
      }
      this.invitePopupVisible = true;
    },
    //获取指定交易区 交易对
    getDesignateSymbols() {
      this.$http.post("/anniversary2020/designateSymbols").then(() => {
        // console.log("获取指定交易区", res);
      });
    },
    // 限制邀请码输入
    handleInviteCode() {
      if (this.inviteCode.length > 8) {
        this.inviteCode = this.inviteCode.slice(0, 8);
      }
      this.inviteCode = this.inviteCode.replace(/[^0-9a-zA-Z]/, "");
    },
    // 邀请码绑定
    boost() {
      if (this.inviteCode === "") {
        this.$toast({
          message: this.$t("ZN.ZN56"),
          position: "center",
          duration: 2000,
        });
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.boost();
        });
        return;
      }
      this.$http
        .post("/anniversary2020/boost", { inviteCode: this.inviteCode })
        .then((res) => {
          if (res.code === 0) {
            this.$toast({
              message: this.$t("ZN.ZN128"),
              position: "center",
              duration: 2000,
            });
            this.getAccountInfo();
            this.invitePopupVisible = false;
          } else if (res.code == 1028) {
            this.$toast({
              message: this.$t("turnTable.plstoEos"),
              position: "center",
              duration: 2000,
            });
          } else if (res.code == 1037) {
            this.$toast({
              message: this.$t("ZN.ZN91"),
              position: "center",
              duration: 2000,
            });
          } else if (res.code == 1035) {
            this.$toast({
              message: this.$t("ZN.ZN89"),
              position: "center",
              duration: 2000,
            });
          } else if (res.code == 1036) {
            this.$toast({
              message: this.$t("ZN.ZN129"),
              position: "center",
              duration: 2000,
            });
          } else if (res.code == 1038) {
            // boost times exceeded
            this.$toast({
              message: this.$t("ZN.ZN130"),
              position: "center",
              duration: 2000,
            });
          } else if (res.code == 1039) {
            // Cannot bind your own invitation code
            this.$toast({
              message: this.$t("ZN.ZN131"),
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
        });
    },
    // 打开
    getlastDrawLog() {
      this.prizePopupVisible = true;
    },
    // 跳到去升级界面
    jumpVip() {
      this.$router.push("/property/");
    },
    // 跳转邀请码海报界面
    jumpInviteCode() {
      if (this.$store.state.app.accountInfo.chain !== "eos") {
        this.$toast({
          message: this.$t("turnTable.plstoEos"),
          position: "center",
          duration: 2000,
        });
      } else {
        this.$router.push("/events/inviteCode");
      }
    },
    // 转盘初始化
    initTurntable() {
      const size = 600 * 0.5 * (document.documentElement.clientWidth / 375);
      const textSpace = 26 * 0.5 * (document.documentElement.clientWidth / 375);
      const imgSpace = 80 * 0.5 * (document.documentElement.clientWidth / 375);
      this.turntable = new LotteryTurntable({
        type: "transition", // 转盘转动类型
        size, // 转盘尺寸，默认为320
        textSpace, // 奖品名称距离转盘边距，默认为15
        imgSpace, // 奖品图片距离转盘边距，默认为50
        speed: 4, // transition动画持续多长时间，秒为单位
        ring: 8, // 转动多少圈后到达终点，越大转速越快
        values: [
          {
            id: 1, // 奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
            name: "BG", // 奖品名称
            img: {
              src: "/static/img/activity/twoAnniversary/BG.png?v=1.0", // 奖品图片路径
              width: turnImgSize, // 奖品图片宽度，请根据实际情况去设置，避免太大
              height: turnImgSize, // 奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
            },
            bg: "#fff", // 该奖品的在转盘中的扇形背景颜色
            fill: "#333", // 奖品名称的文字颜色
          },
          {
            id: 2,
            name: "DICE",
            img: {
              src: "/static/img/activity/twoAnniversary/DICE.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 3,
            name: "FLX",
            img: {
              src: "/static/img/activity/twoAnniversary/FLX.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 4,
            name: "BAP",
            img: {
              src: "/static/img/activity/twoAnniversary/BAP.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 5,
            name: "HASH",
            img: {
              src: "/static/img/activity/twoAnniversary/HASH.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 6,
            name: "XBL",
            img: {
              src: "/static/img/activity/twoAnniversary/XBL.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 7,
            name: "VIG",
            img: {
              src: "/static/img/activity/twoAnniversary/VIG.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 8,
            name: "NDX",
            img: {
              src: "/static/img/activity/twoAnniversary/NDX.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 9,
            name: "BOX",
            img: {
              src: "/static/img/activity/twoAnniversary/BOX.png?v=1.0",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
          {
            id: 10,
            name: this.$t("turnTable.thankYouFor"),
            img: {
              src: "/static/img/activity/twoAnniversary/thank.png",
              width: turnImgSize,
              height: turnImgSize,
            },
            bg: "#fff",
            fill: "#333",
          },
        ],
        container: this.$refs.turntable,
      });
    },
    // 开始抽奖
    handleTurntable() {
      //  活动还没开始
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.handleTurntable();
        });
        return;
      }
      // if (this.remainDrawCount === 0) {
      //   this.layerNoneHide = true;
      //   return;
      // }
      this.handleStartDraw(); // 开始抽奖
    },
    handleStartDraw() {
      // 防止重复点击
      if (this.isClick) {
        this.isClick = false;
        setTimeout(() => {
          this.isClick = true;
        }, 4000);
      } else {
        return;
      }
      this.$http.post("/anniversary2020/draw").then((res) => {
        if (res.code === 0) {
          const { awardLevel, reward, energy } = res;
          this.turntable.goto(awardLevel, () => {
            if (awardLevel === 10) {
              const random = Math.floor(Math.random() * 9);
              this.thankVisible = true;
              this.accountInfo.energy = energy;
              this.ownInfo = {
                awardLevel,
                reward,
                coinName: wzj[random].coinName,
                content: wzj[random]["name"],
                title: wzj[random]["title"],
              };
            } else {
              this.turnPopupVisible = true;
              this.accountInfo.energy = energy;
              this.ownInfo = {
                awardLevel,
                reward,
                coinName: reward.split(" ")[1],
                content: "",
                title: "",
              };
            }
          });
        } else if (res.code === 1028) {
          this.$toast({
            message: this.$t("turnTable.plstoEos"),
            position: "center",
            duration: 2000,
          });
          return;
        } else if (res.code === 1029) {
          //  not enough energy
          this.$toast({
            message: this.$t("ZN.ZN84"),
            position: "center",
            duration: 2000,
          });
          return;
        } else if (res.code === 1032) {
          //  not enough energy
          this.$toast({
            message: this.$t("ZN.ZN86"),
            position: "center",
            duration: 2000,
          });
          return;
        } else if (res.code === 1041) {
          //  daily limit exceeded
          this.$toast({
            message: this.$t("ZN.ZN133"),
            position: "center",
            duration: 2000,
          });
          return;
        } else {
          this.$toast({
            message: this.$t("ZN.ZN132"),
            position: "center",
            duration: 2000,
          });
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.twoAnniversary {
  background: #320562;
  color: #fff;
  height: 100%;
  .top-bg-zh {
    width: 100%;
    height: 4.3rem;
    position: relative;
    background: url("~@/assets/img/activity/twoAnniversary/star.png") no-repeat
      center 0/6.5rem 4.3rem;
  }
  .top-bg-img-zh {
    width: 6.92rem;
    height: 2.36rem;
    margin-top: -0.5rem;
  }
  .top-bg-img-en {
    width: 6.92rem;
    height: 1.36rem;
    margin-top: -0.5rem;
  }
  .langSelect {
    position: absolute;
    width: 0.45rem;
    height: 0.45rem;
    top: 0.37rem;
    right: 0.3rem;
    border-radius: 0.2rem;
    z-index: 2;
    opacity: 0;
  }
  .lang {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    right: 0.2rem;
    top: 0.3rem;
    z-index: 4;
    pointer-events: none;
  }
  .turntable {
    height: 6.6rem;
    width: 100%;
    padding-top: 3.47rem;
    position: relative;
    .egg {
      width: 1.6rem;
      height: 1.6rem;
      position: absolute;
      right: 0;
      top: 3.2rem;
    }
  }
  .myenergy {
    font-size: 0.3rem;
    margin: 0.45rem 0;
  }
  .bottom {
    width: 100%;
    background: url("~@/assets/img/activity/twoAnniversary/bt-bg.png") no-repeat
      center 0;
    background-size: 7.49rem 11.38rem;
    .btn {
      font-size: 0.32rem;
      justify-content: space-around;
      align-items: flex-start;
      color: #fffbfc;
      > div:nth-child(2) {
        font-size: 0.24rem;
        text-align: center;
        margin-top: 0.96rem;
        p {
          margin-top: 0.22rem;
        }
      }
    }
    .wrap {
      padding: 0.2rem;
      font-size: 0.24rem;
      color: #e5e1ff;
      margin-top: 0.4rem;
      > div {
        width: 2.24rem;
        height: 1.4rem;
        background: #6655a4;
        border-radius: 0.1rem;
      }
      p {
        margin-top: 0.1rem;
      }
    }
    .tip {
      color: #ffd0a9;
      font-size: 0.24rem;
      margin-top: 0.2rem;
      padding-left: 0.3rem;
    }
  }
  .bt-text {
    font-size: 0.24rem;
    margin-top: 0.28rem;
    margin-bottom: 0.4rem;
  }

  .popup {
    width: 100%;
    height: 10.37rem;
    background: #fff;
    overflow-y: auto;
    padding: 0 1px;
    font-size: 0.32rem;
    color: #333333;
  }

  .prizePopupVisible,
  .strategyVisible {
    width: 6.08rem;
    height: 8.4rem;
    background: #8092ff;
    border-radius: 0.4rem;
    font-size: 0.32rem;
    color: #fff;
    padding: 0 0.3rem;
    .prizePopup {
      padding-bottom: 0.2rem;
      overflow-y: auto;
      overflow-x: hidden;
      height: 4.6rem;
      .tttt {
        border-bottom: 1px solid #fff;
        div:nth-last-child(1) {
          border-bottom: none;
        }
      }
    }
    .prizeTitle {
      font-size: 0.34rem;
      margin: 0.37rem 0;
      text-align: center;
    }
  }
  /deep/ .mint-popup.thankVisible {
    top: 40%;
  }
  .thankVisible {
    width: 6rem;
    height: 7.54rem;
    background: #8292ff;
    border-radius: 0.3rem;
    font-size: 0.32rem;
    color: #fff;

    .content {
      width: 5.24rem;
      background: #fff;
      height: 4.72rem;
      position: relative;
      margin-top: 1.3rem;
      border-radius: 0.3rem;
      img {
        position: absolute;
        left: 50%;
        margin: -0.75rem 0 0 -0.75rem;
      }
      p {
        line-height: 30px;
      }
    }
  }
  /deep/ .mint-popup.turnPopupVisible {
    top: 40%;
  }
  .turnPopupVisible {
    width: 6rem;
    height: 6rem;
    background: #8292ff;
    border-radius: 0.3rem;
    font-size: 0.32rem;
    color: #fff;
  }
  .turnPopup {
    width: 6rem;
    height: 6.8rem;
    background: #8292ff;
    border-radius: 0.3rem;
    font-size: 0.32rem;
    color: #fff;
    .receive-btn2 {
      width: 3rem;
      height: 0.81rem;
      font-size: 0.34rem;
      text-align: center;
      line-height: 0.81rem;
      margin-top: 0.28rem;
      background: #f56b92;
      border-radius: 0.4rem;
      box-shadow: 0 0.15rem 5px #7d7be9;
    }
    .create-btn {
      width: 4rem;
      height: 0.81rem;
      font-size: 0.34rem;
      text-align: center;
      line-height: 0.81rem;
      margin-top: 0.4rem;
      background: #f56b92;
      border-radius: 0.4rem;
      box-shadow: 0 0.15rem 5px #7d7be9;
    }
    .code {
      height: 0.73rem;
      width: 95%;
      background: #919ffe;
      border-radius: 0.1rem;
      margin-top: 0.5rem;
      input {
        color: #fff;
        flex: 1;
        height: 0.73rem;
        background: #919ffe;
        font-size: 0.28rem;
        margin: 0 0.2rem;
        min-width: 0;
      }
      input::-webkit-input-placeholder {
        color: #fff !important;
      }
      input::-moz-placeholder {
        color: #fff !important;
      }
      input:-ms-input-placeholder {
        color: #fff !important;
      }
      .confirm {
        background: #ffd43a;
        color: #5e3402;
        font-size: 0.28rem;
        width: 1.12rem;
        height: 0.6rem;
        text-align: center;
        line-height: 0.61rem;
        margin-right: 0.05rem;
        border-radius: 0.1rem;
      }
    }
  }
  .videoPopup {
    width: 6rem;
    height: 4.5rem;
    background: transparent;
    color: #fff;
  }
  .luckDraw {
    .prizeList {
      margin: 0 auto 40px;
      line-height: 35px;
      color: #bbcaff;
      border-radius: 20px;
      padding: 0 40px;
      .noticeScroll {
        transition: transform 0.4s ease-in-out;
        position: absolute;
        width: 550px;
        padding-left: 30px;
      }
    }

    .luckDrawCont {
      position: relative;
      margin: 20px auto 20px;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: #fff;
    }

    .turntable-box {
      width: 6.6rem;
      height: 6.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("../../../assets/img/activity/twoAnniversary/turntable.png?v=0.0.1")
        no-repeat 0 0/6.6rem 6.6rem;
      background-size: 100% 100%;
      position: relative;
      font-size: 0.25rem;
      margin: 0 auto;
      .btn {
        width: 2.7rem;
        height: 2.7rem;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        top: 50%;
        left: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
        background: url("../../../assets/img/activity/twoAnniversary/turntableBtn.png")
          no-repeat 0 0/2.7rem 2.7rem;
        background-size: 100% 100%;
        box-sizing: border-box;
        font-weight: bold;
        font-size: 0.25rem;
        cursor: pointer;
        p {
          margin: 0.2px 0 0.4px 0;
          font-weight: normal;
          font-size: 0.3rem;
          color: #721041;
        }
      }
    }

    .luckDrawBtn {
      justify-content: center;
      margin: 30px 0 100px 0;

      span {
        min-width: 200px;
        line-height: 40px;
        padding: 0 10px;
        text-align: center;
        // background-image: linear-gradient(to right, #5B86F2 0%, #9A94D9 100%);
        background: #5b86f2;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .luckDrawRules {
      width: 1000px;
      margin: 0 auto 0;
      p {
        line-height: 26px;
      }

      .mb40 {
        margin-bottom: 40px;
      }
    }
  }
  .close {
    width: 0.25rem;
    height: 0.25rem;
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    z-index: 999;
  }
  .prize-bottom {
    border-radius: 0.2rem;

    width: 6rem;
    height: 1.51rem;
    margin-top: 0.1rem;
    background: url("~@/assets/img/activity/twoAnniversary/prize-bt.png")
      no-repeat 0 0/100% 100%;
    position: absolute;
    // right: 50%;
    top: 100%;
  }
  .prize-bottom-en {
    border-radius: 0.2rem;
    width: 6rem;
    height: 1.51rem;
    margin-top: 0.1rem;
    background: url("~@/assets/img/activity/twoAnniversary/prize-bt-en.png")
      no-repeat 0 0/100% 100%;
    position: absolute;
    // right: 50%;
    top: 100%;
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
  .prize-close-bottom {
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    right: 50%;
    top: 100%;
    margin-top: 2.1rem;
    margin-right: -0.3rem;
    // margin-left: -0.2rem;
    z-index: 999;
  }
}
.gl {
  width: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
  margin-top: 0.3rem;
  h2 {
    font-size: 0.3rem;
    margin-bottom: 0.2rem;
  }
  p {
    font-size: 0.24rem;
  }
}
// .handleMove{
//   position: relative;
//   top: -6.6rem;
//   left: 0;
//   animation: hung 4s infinite;
// }

// @keyframes hung
// {
//   0%{
//     transform: translate(0,0);
//   }
//   50%{
//     transform: translate(0,-.2rem);
//   }
//   100%{
//     transform: translate(0,0);
//   }
// }
</style>
