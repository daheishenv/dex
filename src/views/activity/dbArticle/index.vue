<template>
  <div>
    <div class="dbArticle flex-column">
      <select id="lang" v-model="language" class="langSelect" ref="lang">
        <option v-for="(item, $index) in solts" :key="$index" :value="item.key">
          {{
          item.name
          }}
        </option>
      </select>
      <img src="~@/assets/img/activity/twoAnniversary/lang.png" class="lang" />
      <img
        src="~@/assets/img/activity/dbArticle/top-bg.png"
        style="width:7.5rem;height:12.2rem;position:absolute"
        alt
      />
      <img
        src="~@/assets/img/activity/dbArticle/left-1.png"
        style="width:2.48rem;height:1.4rem;position:absolute;left:0;top:0"
        alt
      />
      <img
        src="~@/assets/img/activity/dbArticle/right-1.png"
        style="width:1.37rem;height:1.4rem;position:absolute;right:0;top:0"
        alt
      />
      <img
        v-if="$store.state.app.language=== 'zh-CN'||$store.state.app.language === 'zh-TW'"
        src="~@/assets/img/activity/dbArticle/top-text.png"
        style="width:5.12rem;height:2.97rem;position:absolute;top:0.5rem"
        alt
      />
      <img
        v-else
        src="~@/assets/img/activity/dbArticle/top-text-en.png"
        style="width:6.6rem;height:2.93rem;position:absolute;top:0.5rem"
        alt
      />
      <img
        src="~@/assets/img/activity/dbArticle/top-prize.png"
        style="width:7.5rem;height:15.19rem;position:absolute;"
        alt
      />
      <img
        src="~@/assets/img/activity/dbArticle/right-2.png"
        alt
        style="width:4.47rem;height:6.19rem;position:absolute;right:-1.2rem;top:9.5rem;"
      />
      <img
        src="~@/assets/img/activity/dbArticle/left-2.png"
        alt
        style="width:4.47rem;height:6.19rem;position:absolute;left:0rem;top:19rem;"
      />
      <img
        src="~@/assets/img/activity/dbArticle/left-3.png"
        alt
        style="width:4.47rem;height:6.19rem;position:absolute;left:0rem;top:38rem;"
      />
      <img
        src="~@/assets/img/activity/dbArticle/right-3.png"
        alt
        style="width:2.76rem;height:3.42rem;position:absolute;right:-.5rem;top:38rem;"
      />

      <!-- 征文素材 -->
      <div class="material">
        <div class="border-content flex">
          <!-- 左箭头 -->
          <img
            class="row-left"
            @click="turnLeft"
            src="~@/assets/img/activity/dbArticle/row-left.png"
            alt
          />
          <!-- 中间的图片  -->
          <div class="flex-column flexb" style="flex:1;height:100%;">
            <p style="font-size:0.36rem;margin-top:0.3rem">— {{$t('dbArticle.BOX7')}} —</p>
            <div style="height:2.7rem">
              <transition name="slide-fade">
                <img
                  class="sucai"
                  v-if="show&&(this.$store.state.app.language==='zh-CN'||this.$store.state.app.language==='zh-TW')"
                  :src="imgList[inn]"
                  alt
                />
                <img
                  class="sucai"
                  v-else-if="show&&this.$store.state.app.language!=='zh-CN'&&this.$store.state.app.language!=='zh-TW'"
                  :src="imgListEn[inn]"
                  alt
                />
              </transition>
            </div>
            <div
              v-if="this.$store.state.app.language==='zh-CN'||this.$store.state.app.language==='zh-TW'"
              v-clipboard:copy="imgList[inn]"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="download"
            >{{$t('dbArticle.BOX62')}}</div>
            <div
              v-else
              v-clipboard:copy="imgListEn[inn]"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="download"
            >{{$t('dbArticle.BOX62')}}</div>
          </div>
          <!-- 右箭头 -->
          <img
            class="row-right"
            @click="turnRight"
            src="~@/assets/img/activity/dbArticle/row-right.png"
            alt
          />
        </div>
      </div>
      <!--活动详情  -->
      <!-- <img src="~@/assets/img/activity/dbArticle/top-border.png" class="top-border" alt /> -->
      <div class="detail">
        <img src="~@/assets/img/activity/dbArticle/top-border.png" class="top-border" alt />
        <div class="title">— {{$t('dbArticle.BOX3')}} —</div>
        <p class="content" style="text-indent:0.5rem">{{$t('dbArticle.BOX4')}}</p>
        <p class="content" style="text-indent:0.5rem">{{$t('dbArticle.BOX5')}}</p>
        <p class="content" style="text-indent:0.5rem">{{$t('dbArticle.BOX6')}}</p>
      </div>
      <!--征文要求  -->
      <!-- <img src="~@/assets/img/activity/dbArticle/top-border.png" class="top-border" alt /> -->
      <div class="detail">
        <!-- <div class="top-border"></div> -->
        <img src="~@/assets/img/activity/dbArticle/top-border.png" class="top-border" alt />

        <img class="people1" src="~@/assets/img/activity/dbArticle/people-1.png" alt />
        <div class="title" style="z-index:999">— {{$t('dbArticle.BOX7')}} —</div>
        <p class="content">{{$t('dbArticle.BOX8')}}</p>
        <p class="content">{{$t('dbArticle.BOX9')}}</p>
        <p class="content">{{$t('dbArticle.BOX10')}}</p>
        <p class="content">{{$t('dbArticle.BOX11')}}</p>
        <p class="content">{{$t('dbArticle.BOX12')}}</p>
        <p class="content">{{$t('dbArticle.BOX13')}}</p>
      </div>
      <!-- 底部活动时间 结果公布 评选规则 奖项设置 -->
      <div class="wrap">
        <img class="people2" src="~@/assets/img/activity/dbArticle/people-2.png" alt />
        <div class="title">{{$t('dbArticle.BOX14')}}</div>
        <p class="content">{{$t('dbArticle.BOX15')}}</p>
        <p class="content">{{$t('dbArticle.BOX17')}}</p>
        <!-- 结果公布 -->
        <div class="title">{{$t('dbArticle.BOX18')}}</div>
        <p class="content">{{$t('dbArticle.BOX19')}}</p>
        <p class="content">{{$t('dbArticle.BOX61')}}</p>
        <!-- 评选规则 -->
        <div class="title">{{$t('dbArticle.BOX20')}}</div>
        <p class="content">{{$t('dbArticle.BOX21')}}</p>
        <!-- 奖项设置 -->
        <div class="title">{{$t('dbArticle.BOX22')}}</div>
        <p class="content">{{$t('dbArticle.BOX23')}}</p>
        <p class="content" style="font-size:0.24rem ;color:#32CFFF ">{{$t('dbArticle.BOX24')}}</p>
        <p class="content">{{$t('dbArticle.BOX25')}}</p>
        <p class="content">{{$t('dbArticle.BOX26')}}</p>
        <p class="content">{{$t('dbArticle.BOX27')}}</p>
        <p class="content">{{$t('dbArticle.BOX28')}}</p>
        <p class="content" style="font-size:0.24rem ;color:#32CFFF ">{{$t('dbArticle.BOX29')}}</p>
        <!-- 提交方式 -->
        <div class="title">{{$t('dbArticle.BOX30')}}</div>
        <p class="content">{{$t('dbArticle.BOX31')}}</p>
        <!-- 奖励发放 -->
        <div class="title">{{$t('dbArticle.BOX32')}}</div>
        <p class="content">{{$t('dbArticle.BOX33')}}</p>
      </div>
          <div style="margin-bottom:0.5rem;font-size:0.23rem">{{$t('dbArticle.BOX64')}}</div>

    </div>
    <div class="btn flex-column flexc">
      <div @click="jumpApply">{{$t('dbArticle.BOX54')}}</div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import VueClipboard from "vue-clipboard2";
// import a from "@/assets/img/activity/dbArticle/a.png";
// import b from "@/assets/img/activity/dbArticle/b.png";
// import c from "@/assets/img/activity/dbArticle/c.png";
// import aen from "@/assets/img/activity/dbArticle/a-en.png";
// import ben from "@/assets/img/activity/dbArticle/b-en.png";
// import cen from "@/assets/img/activity/dbArticle/c-en.png";

export default {
  name: "dbArticle",
  components: {},
  data() {
    return {
      imgList: [
        "https://ndi.340wan.com/WechatIMG43.png",
        "https://ndi.340wan.com/WechatIMG45.png",
        "https://ndi.340wan.com/WechatIMG47.png",
      ],
      imgListEn: [
        "https://ndi.340wan.com/WechatIMG44.png",
        "https://ndi.340wan.com/WechatIMG46.png",
        "https://ndi.340wan.com/WechatIMG48.png",
      ],
      copyList: ["", "", ""],
      inn: 0,
      show: true,
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
      language: "",
    };
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
  },
  methods: {
    handleCheckLang(lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch("setLanguage", lang);
    },

    jumpApply() {
      this.$router.push("/events/articleApply");
    },
    turnRight() {
      if (this.inn === this.imgList.length - 1) {
        this.inn = 0;
      } else {
        this.inn++;
      }
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    turnLeft() {
      if (this.inn === 0) {
        this.inn = this.imgList.length - 1;
      } else {
        this.inn--;
      }
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    // 复制成功时的回调函数
    onCopy() {
      this.$toast({
        message: this.$t("ZN.ZN108"),
        position: "center",
        duration: 2000,
      });
    },
    // 复制失败时的回调函数
    onError() {
      this.$toast({
        message: this.$t("ZN.ZN109"),
        position: "center",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dbArticle {
  height: calc(100vh - 0.9rem);
  position: relative;
  // overflow: hidden;
  overflow-x: hidden;
  overflow-y: auto;
  color: #fff;
  font-size: 0.5rem;
  background-color: rgb(39, 38, 180);
  width: 100%;
  .langSelect {
    position: absolute;
    width: 0.45rem;
    height: 0.45rem;
    top: 0.37rem;
    right: 0.3rem;
    border-radius: 0.2rem;
    z-index: 8;
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
  .top-bg {
    background: blue;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    width: 100%;
  }
  .material {
    width: 6.8rem;
    height: 5.42rem;
    margin-top: 8.5rem;
    background: #5845f5;
    border-radius: 0.1rem;
    z-index: 2;
    .border-content {
      border-radius: 0.1rem;
      margin: 0 auto;
      margin-top: 0.17rem;
      margin-bottom: 0.17rem;
      width: 6.52rem;
      height: 5.08rem;
      border: 1px solid #6163e2;
      .download {
        width: 2.62rem;
        height: 0.7rem;
        text-align: center;
        color: #fff;
        line-height: 0.7rem;
        font-size: 0.28rem;
        background: linear-gradient(to left, #65a8f8, #307be1);
        border-radius: 0.5rem;
        margin-bottom: 0.3rem;
      }
      .row-left,
      .row-right {
        width: 0.34rem;
        height: 0.61rem;
        margin-top: -0.5rem;
      }
      .row-left {
        margin-left: 0.3rem;
      }
      .row-right {
        margin-right: 0.3rem;
      }
      .sucai {
        width: 4.52rem;
        height: 2.52rem;
        border-radius: 0.1rem;
      }
    }
  }
  .detail {
    // margin-top: 1rem;
    width: 6.8rem;
    margin-top: 1.2rem;
    padding-bottom: 0.63rem;
    border-radius: 0 0 0.15rem 0.15rem;
    position: relative;
    // background: url('~@/assets/img/activity/dbArticle/top-border.png') no-repeat 0 0/ 6.8rem 1.4rem;
    background-color: #fff;
    .title {
      font-weight: bold;
      line-height: 0.78rem;
      text-align: center;
      width: 5.96rem;
      height: 0.78rem;
      color: #6236ff;
      font-size: 0.32rem;
      background: rgb(242, 242, 255);
      margin: 0 auto;
      margin-top: 0.3rem;
      z-index: 9;
    }
    .content {
      font-size: 0.27rem;
      color: #333;
      margin: 0.3rem 0.42rem 0 0.42rem;
      line-height: 0.44rem;
    }
    .people1 {
      position: absolute;
      width: 2.76rem;
      height: 2.51rem;
      left: -0.8rem;
      top: -2.1rem;
      z-index: 10;
    }
  }
  .wrap {
    position: relative;
    width: 6.8rem;
    background: linear-gradient(to left, #5845fb, #5845f5);
    margin-top: 0.73rem;
    padding-bottom: 0.6rem;
    border-radius: 0.15rem;
    margin-bottom: 0.5rem;
    .title {
      width: 2.02rem;
      height: 0.69rem;
      line-height: 0.69rem;
      text-align: center;
      color: #f6c85c;
      font-size: 0.3rem;
      background: rgb(76, 60, 231);
      margin-top: 0.3rem;
      border-radius: 0 0.15rem 0.15rem 0;
    }
    .content {
      font-size: 0.27rem;
      margin: 0 0.32rem;
      line-height: 0.44rem;
      margin-top: 0.16rem;
    }
    .people2 {
      position: absolute;
      width: 2.04rem;
      height: 2.32rem;
      right: -0.4rem;
      top: -1.5rem;
    }
  }
  .top-border {
    width: 6.8rem;
    height: 0.54rem;
    // margin-top: -3rem;
    z-index: 9;
    position: absolute;
    top: -0.5rem;
  }

  .slide-fade-enter-active {
    transition: all 0.2s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.2s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
}
.btn {
  width: 100%;
  // position: fixed;
  bottom: 0rem;
  // margin-top: 0.5rem;
  z-index: 10;
  div {
    width: 100%;
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    color: #fff;
    font-size: 0.3rem;
    background: linear-gradient(to left, #ffa63c, #ff8f0e);
  }
}
</style>
