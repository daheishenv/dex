<template>
  <div class="articleVote">
    <language></language>
    <div class="top-bg flex-column">
      <img
        v-if="$store.state.app.language === 'zh-CN'||$store.state.app.language === 'zh-TW'"
        src="~@/assets/img/activity/dbArticle/zw.png"
        alt
        style="height:6.77rem;width:100%"
      />
      <img
        v-else
        src="~@/assets/img/activity/dbArticle/zw-en.png"
        alt
        style="height:6.77rem;width:100%"
      />
      <!-- 前三排名 -->
      <div class="flex-column rank">
        <div class="flex top3">
          <!-- 第二名 -->
          <div class="flex-column">
            <div class="dibu-left flex-column">
              <p>{{rankList[1]?rankList[1].name:""}}</p>
              <p>{{$t("ArticleVote.BOXPX43")}}</p>
              <p>{{rankList[1]?rankList[1].vote:0}}</p>
            </div>
            <img
              src="~@/assets/img/activity/dbArticle/second.png"
              alt
              style="height:1.39rem;width:1.22rem;margin-top:-2.95rem"
            />
          </div>
          <!-- 第一名 -->
          <div class="flex-column">
            <div class="dibu-center flex-column">
              <p>{{rankList[0]?rankList[0].name:""}}</p>
              <p>{{$t("ArticleVote.BOXPX43")}}</p>
              <p>{{rankList[0]?rankList[0].vote:0}}</p>
            </div>
            <img
              src="~@/assets/img/activity/dbArticle/first.png"
              alt
              style="height:1.41rem;width:1.4rem;margin-top:-2.95rem"
            />
          </div>
          <!-- 第三名 -->
          <div class="flex-column">
            <div class="dibu-right flex-column">
              <p>{{rankList[2]?rankList[2].name:""}}</p>
              <p>{{$t("ArticleVote.BOXPX43")}}</p>
              <p>{{rankList[2]?rankList[2].vote:0}}</p>
            </div>
            <img
              src="~@/assets/img/activity/dbArticle/third.png"
              alt
              style="height:1.30rem;width:1.15rem;margin-top:-2.83rem"
            />
          </div>
        </div>
        <!-- 表格排名 -->
        <div class="rankList">
          <div class="title flex">
            <div style="width:1.2rem">{{$t("ArticleVote.BOXPX42")}}</div>
            <div style="flex:4">{{$t("ArticleVote.BOXPX44")}}</div>
            <div style="flex:3;text-align:right">{{$t("ArticleVote.BOXPX43")}}</div>
          </div>
          <div class="botoom flex-column">
            <div class="content flex">
              <div style="width:1.2rem">NO.4</div>
              <div style="flex:3">{{rankList[3]?rankList[3].name:""}}</div>
              <div style="flex:1;text-align:right">{{rankList[3]?rankList[3].vote:0}}</div>
            </div>
            <div class="content flex">
              <div style="width:1.2rem">NO.5</div>
              <div style="flex:3">{{rankList[4]?rankList[4].name:""}}</div>
              <div style="flex:1;text-align:right">{{rankList[4]?rankList[4].vote:0}}</div>
            </div>
            <div class="content flex">
              <div style="width:1.2rem">NO.6</div>
              <div style="flex:3">{{rankList[5]?rankList[5].name:""}}</div>
              <div style="flex:1;text-align:right">{{rankList[5]?rankList[5].vote:0}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 投票区 -->
    <div class="best flex-column">
      <img
        v-if="$store.state.app.language === 'zh-CN'||$store.state.app.language === 'zh-TW'"
        src="~@/assets/img/activity/dbArticle/title-center.png"
        style=" width: 5.22rem;height: 1.29rem;margin-top: -0.7rem;"
        alt
      />
      <img
        v-else
        src="~@/assets/img/activity/dbArticle/title-center-en.png"
        style=" width: 6.56rem;height: 1.29rem;margin-top: -0.7rem;"
        alt
      />
      <div style="font-size:0.31rem;color:#F7B500;margin-top:0.26rem">{{$t("ArticleVote.BOXPX7")}}</div>
      <div style="margin:0.2rem 0.28rem 0;font-size:0.27rem">{{$t("ArticleVote.BOXPX8")}}</div>
      <div class="flexb" style="width:6.45rem">
        <div style="color:#F7B500;font-size:0.27rem;width:4.5rem;">{{$t("ArticleVote.BOXPX39")}}</div>
        <div style="color:#99E7F7;font-size:0.24rem" @click="ruleVisible=true">{{$t("ArticleVote.BOXPX11")}}＞</div>
      </div>
      <div class="flex" style="width:6.45rem;margin-top:0.6rem">
        <div
          style="color:#C3D3FF;font-size:0.24rem;width:1.4rem"
          :class="{'isFocus':sort==1}"
          @click="idRank"
        >{{$t("ArticleVote.BOXPX9")}}</div>
        <div
          style="color:#C3D3FF;font-size:0.24rem;flex:1"
          :class="{'isFocus':sort==2}"
          @click="numRank"
        >{{$t("ArticleVote.BOXPX10")}}</div>
        <input type="text" :placeholder="$t('ArticleVote.BOXPX12')" v-model="name" />
        <!-- 搜索  -->
        <div class="search" @click="search">{{$t("ArticleVote.BOXPX13")}}</div>
      </div>
      <div  v-if="voteList.length" class="voteList flexb">
        <div v-for="(item) in voteList" :key="item.code" class="articleItem flex-column">
          <div class="pm">{{getRank(Number(item.code))}}</div>
          <div style="font-size:.26rem;color:#333;font-weight:bold;margin-top:.2rem;line-height:0.25rem;height:0.5rem;text-align:center;width:3rem">{{item.name}}</div>
          <div class="articleContet">{{item.desc}}</div>
          <a
            style="font-size:.24rem;color:#5D76FA;width:2.57rem;margin-top:.12rem"
            :href="item.articleUrl"
          >{{$t("ArticleVote.BOXPX40")}}></a>
          <div
            style="font-size:.24rem;color:#999;margin-top:.12rem"
          >{{item.vote}}{{$t("ArticleVote.BOXPX41")}}</div>
          <div class="vote" @click="handleVote(item)">{{$t("ArticleVote.BOXPX15")}}</div>
        </div>
      </div>
       <div v-else class="flex-column">
        <div style="margin:1.8rem 0;" class="flex-column">
          <img src="~@/assets/img/activity/dbArticle/none.png" style="width:2rem;height:1.4rem" alt="">
          <div style="color:#abb1e9;font-size:0.2rem">{{$t("ArticleVote.BOXPX50")}}</div>
        </div>
      </div>
    </div>
    <!-- 投票规则 -->
    <div class="rule" style="width:6.7rem;margin:.42rem auto 0">
      <div>{{$t("ArticleVote.BOXPX16")}}:</div>
      <div>{{$t("ArticleVote.BOXPX17")}}</div>
      <div>{{$t("ArticleVote.BOXPX18")}}</div>
      <div>{{$t("ArticleVote.BOXPX19")}}</div>
      <div>{{$t("ArticleVote.BOXPX20")}}</div>
      <div>{{$t("ArticleVote.BOXPX21")}}</div>
      <div>{{$t("ArticleVote.BOXPX22")}}</div>
      <div>{{$t("ArticleVote.BOXPX23")}}</div>
      <div class="tip">{{$t("ArticleVote.BOXPX24")}}</div>
    </div>
    <!-- 点击每日助力的弹窗 -->
    <mt-popup
      v-model="ruleVisible"
      position="center"
      class="rulePopup flex-column"
      lockScroll="true"
      :closeOnClickModal="false"
      style="padding:.1rem"
    >
      <img
        src="~@/assets/img/activity/twoAnniversary/close-b.png"
        alt
        @click="ruleVisible = false"
        class="close"
      />
      <div class="ruledialog">
      <div class="title">{{$t("ArticleVote.BOXPX16")}}</div>
      <div>{{$t("ArticleVote.BOXPX17")}}</div>
      <div>{{$t("ArticleVote.BOXPX18")}}</div>
      <div>{{$t("ArticleVote.BOXPX19")}}</div>
      <div>{{$t("ArticleVote.BOXPX20")}}</div>
      <div>{{$t("ArticleVote.BOXPX21")}}</div>
      <div>{{$t("ArticleVote.BOXPX22")}}</div>
      <div>{{$t("ArticleVote.BOXPX23")}}</div>
      <div class="tip">{{$t("ArticleVote.BOXPX24")}}</div>
    </div>
    </mt-popup>
  </div>
</template>

<script>
import Language from "./components/Language.vue";
import { accountToSign } from "@/utils/publicApi";
import { Popup } from "mint-ui";

export default {
  name: "articleVote",
  components: {
  Language,
  mtPopup: Popup,
},
  data() {
    return {
      sort: 1, //1编号排序  2票数排序
      voteList: [],
      rankList: [],
      name: "", //文章名称
      ruleVisible:false, //投票规则
    };
  },
  watch: {
    "$store.state.app.language": {
      handler: function listen() {
          this.getRankList();
          this.getVoteList();
      },
      deep: true,
    },
   },
  computed: {
    getRank() {
      return function (index) {
        if (index > 9) {
          return index;
        } else {
          return "0" + index;
        }
      };
    },
  },
  created() {
    this.getRankList();
    this.getVoteList();
  },
  methods: {
    // 获得投票列表
    getVoteList() {
      let code = this.name
      if(code.substr(0, 1) == "0"){
        code = code.substr(1)
      }
      code = code.trim()
      this.$http
        .post("/eventArticleVote/voteList", {
          sort: this.sort,
          name: code
        })
        .then((res) => {
          if (res.code === 0) {
            this.voteList = res.voteList;
          }
        });
    },
    // 获得排名列表
    getRankList() {
      this.$http.post("/eventArticleVote/rankList").then((res) => {
        if (res.code === 0) {
          this.rankList = res.rankList;
        }
      });
    },
    idRank() {
      this.sort = 1;
      this.getVoteList();
    },
    numRank() {
      this.sort = 2;
      this.getVoteList();
    },
    search() {
      this.getVoteList();
    },
    // 跳转文章
    handleUrl(articleUrl) {
      window.open(articleUrl, "_blank");
      // window.open()
    },
    //投票
    handleVote(item) {
      const token = localStorage.getItem("token");
      if (!token) {
        accountToSign(this, () => {
          this.handleVote();
        });
        return;
      }
      const params = { code: item.code };
      this.$http.post("/eventArticleVote/vote", params).then((res) => {
        if (res.code === 0) {
          this.$toast({
            message: this.$t("ArticleVote.BOXPX25"),
            position: "center",
            duration: 2000,
          });
          this.getRankList();
          this.getVoteList();
        } else if (res.code === 1028) {
            this.$toast({
            message: this.$t("ArticleVote.BOXPX48"),
            position: "center",
            duration: 2000,
          });
        }else if (res.code === 1029) {
           this.$toast({
            message: this.$t("ArticleVote.BOXPX49"),
            position: "center",
            duration: 2000,
          });
        }else if (res.code === 1031) {
          // You vote quota has been used up today
          this.$toast({
            message: this.$t("ArticleVote.BOXPX35"),
            position: "center",
            duration: 2000,
          });
        } else {
          this.$toast({
            message: this.$t("ArticleVote.BOXPX34"),
            position: "center",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.articleVote {
  font-size: 0.2rem;
  padding-bottom: 1rem;
  color: #fff;
  position: relative;
  background-color: #3106c0;

  .top-bg {
    background: url("~@/assets/img/activity/dbArticle/top-bg1.png") no-repeat 0
      0/ 100% 10.45rem;
  }
  .rank {
    margin: 1.5rem auto 0;
    width: 7rem;
    background: url("~@/assets/img/activity/dbArticle/rank.png") no-repeat 0 0/ 7rem
      6.2rem;
    .top3 {
      width: 7rem;
      height: 2.2rem;

      .dibu-left,
      .dibu-right {
        height: 1.81rem;
        width: 1.64rem;
      }
      .dibu-left {
        background: url("~@/assets/img/activity/dbArticle/dibu-left.png")
          no-repeat 0 0/ 1.81rem 1.64rem;
      }
      .dibu-right {
        background: url("~@/assets/img/activity/dbArticle/dibu-right.png")
          no-repeat 0 0/ 1.87rem 1.75rem;
      }
      .dibu-left,
      .dibu-right,
      .dibu-center {
        p:nth-child(1) {
          color: #ffc600;
          font-size: 0.24rem;
          font-weight: bold;
          margin-top: 0.3rem;
          width: 1.4rem;
          text-align: center;
          white-space: nowrap; //不换行
          text-overflow: ellipsis; //省略号
          overflow: hidden; //超出隐藏
          // height: 1rem;
        }
        p:nth-child(2) {
          font-size: 0.18rem;
        }
        p:nth-child(2) {
          font-size: 0.21rem;
        }
      }
      .dibu-center {
        p:nth-child(1) {
          margin-top: 0.42rem;
        }
      }
      .dibu-center {
        height: 1.87rem;
        width: 1.75rem;
        background: url("~@/assets/img/activity/dbArticle/dibu-center.png")
          no-repeat 0 0/ 1.87rem 1.75rem;
      }
      > div {
        flex: 1;
        height: 100%;
      }
      > div:nth-child(1) {
        margin-top: 1rem;
      }
      > div:nth-child(3) {
        margin-top: 1.3rem;
      }
    }
    .rankList {
      width: 6.45rem;
      margin-top: 0.5rem;
      border-radius: 0.1rem;
      overflow: hidden;
      border: 1.5px solid #b1f7ff;
      .botoom {
        padding: 0.2rem 0.37rem;
        background: linear-gradient(
          to bottom,
          rgba($color: #80c3f3, $alpha: 0.04),
          #4592f6
        );
      }
      .title {
        height: 0.74rem;
        padding: 0 0.37rem;
        font-size: 0.24rem;
        background: rgba($color: #b1f7ff, $alpha: 0.4);
      }
      .content {
        line-height: 0.65rem;
        font-size: 0.27rem;
        margin: 0 0.37rem;
        flex: 1;
        width: 100%;
        > div:nth-child(2) {
          color: #ffc600;
        }
      }
    }
  }
  .best {
    width: 7rem;
    margin: 0 auto;
    background: #372bcd;
    // height: 10rem;
    margin-top: 2rem;
    padding-bottom: 0.5rem;
    //   position: relative;
    .isFocus {
      color: #a9fffb !important;
    }
    .top-img {
      width: 5.22rem;
      height: 1.29rem;
      margin-top: -0.7rem;
    }
    .search {
      border-radius: 0.23rem;
      height: 0.45rem;
      width: 1.09rem;
      background: #fff;
      color: #3e57d3;
      line-height: 0.45rem;
      text-align: center;
    }
    .voteList {
      flex-wrap: wrap;
      width: 6.6rem;
      margin-top: 0.34rem;
      .articleItem {
        width: 3.2rem;
        height: 4.3rem;
        background: #fff;
        margin-bottom: 0.2rem;
        border-radius: 0.08rem;
        .pm {
          height: 1.1rem;
          width: 1.1rem;
          background: rgba($color: #feb75e, $alpha: 0.1);
          color: #ff910d;
          font-size: 0.48rem;
          line-height: 1.1rem;
          text-align: center;
          border-radius: 50%;
          margin-top: 0.22rem;
        }
        .articleContet {
          line-height: 0.29rem;
          font-size: 0.21rem;
          color: #333;
          width: 2.57rem;
          height: 0.58rem;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.08rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .vote {
          height: 0.5rem;
          width: 2rem;
          color: #fff;
          background: linear-gradient(to left, #ffb556, #ff9d00);
          line-height: 0.5rem;
          font-size: 0.24rem;
          text-align: center;
          border-radius: 0.08rem;
          margin-top: 0.1rem;
        }
      }
    }
  }
  .rule {
    font-size: 0.24rem;
    > div {
      padding: 0.1rem 0;
    }
    .tip {
      font-size: 0.21rem;
      color: #8ba7f2;
    }
  }
  .ruledialog{
    padding-bottom: 0.7rem;
    .title{
        text-align: center;
        font-size: 0.35rem;
        color: #1463A2;
        margin: 0.4rem 0;
    }
    .tip {
      font-size: 0.2rem;
      color:       #999;
    }
    >div{
      margin-top: .2rem;
    }
    margin: 0 .4rem;
    font-size: 0.24rem;
  }
  input {
    color: #fff;
    width: 1.55rem;
    height: 0.45rem;
    background: rgba(255, 255, 255, 0.1);
    font-size: 0.21rem;
    margin: 0 0.1rem;
    min-width: 0;
    border-radius: 0.3rem;
    padding: 0 0.15rem;
    text-align: center;
  }
  input::-webkit-input-placeholder {
    color: #fff !important;
    text-align: center;
  }
  input::-moz-placeholder {
    color: #fff !important;
  }
  input:-ms-input-placeholder {
    color: #fff !important;
  }
  .rulePopup{
    width: 6.21rem;
    color: #333;
    border-radius: 0.15rem;
  }
  .close {
    width: 0.25rem;
    height: 0.25rem;
    position: absolute;
    right: 0.2rem;
    top: 0.2rem;
    z-index: 999;
  }
}
</style>