<template>
  <div class="article">
    <div class="show">
      <div class="modelTitle">
        <span>{{ $t('apiTrade.symbolTop') }}</span>
      </div>
      <div class="content">
        <div class="contentIn">
          <div class="tip">
            <div>{{ $t('apiTrade.symbolNewsTip') }}</div>
          </div>
          <div class="btnDiv">
            <div class="btn" @click="handleApplyArticle">{{ $t('apiTrade.submitNews') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章 -->
    <div class="item" v-for="(item, $index) in list" :key="$index">
      <div class="hot" v-if="$index < 3">{{ $t('apiTrade.hot') }}</div>
      <div class="title">{{ item.title }}</div>
      <!-- <div class="info">
        <div class="media">
          <span class="img"></span>
          <span>media</span>
        </div>
        <div class="time">
          <span>时间:</span>
          <span>2019.05.01</span>
        </div>
        <div class="name">
          <span>作者名字</span>
          <span>画外音</span>
        </div>
      </div> -->
      <div class="intro">
        {{ item.introduction }}
      </div>
      <div class="tools">
        <div class="source">
          <span>{{ $t('apiTrade.source') }}</span>
          <span>{{ item.media }}</span>
        </div>
        <div class="add" :class="{'liked': item.liked === 1}" @click="handleLike(item)">
          <span class="iconfont icon-huaban105 addIcon"></span>
          <span v-if="item.liked !== 1">{{ $t('apiTrade.likeCount') }}</span>
          <span v-if="item.liked === 1">{{ $t('apiTrade.liked') }}</span>
          <span>{{ item.likeCount }}</span>
        </div>
        <div class="share"
          v-clipboard:copy="$t('apiTrade.mediaShareUrl')"
          v-clipboard:success="handleCopy"
          v-clipboard:error="handleCopyError">{{ $t('apiTrade.share') }}</div>
      </div>
    </div>

    <!-- 查看更多 -->
    <div class="more" v-if="more" @click="handleMore">{{ $t('index.more') }} ></div>

    <!-- 文章提交 start -->
    <mt-popup
      class="popup"
      v-model="popupArticle"
      popup-transition="popup-fade">
      <ApplyArticle v-if="popupArticle" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 文章提交 end -->

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="h5ToDapp"
      popup-transition="popup-fade">
      <to-app />
    </mt-popup>

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
import { accountToSign, AppToLogin } from '@/utils/publicApi';
import PopupApplySuccess from '@/views/index/components/PopupApplySuccess';
import ToApp from '@/views/market/components/ToApp';
import ApplyArticle from './popup/ApplyArticle';

export default {
  data() {
    return {
      popupArticle: false, // 征文提交弹窗
      list: [],
      allList: [],
      channelRef: 'dapp',
      h5ToDapp: false,
      more: false,
      applySuccess: false,
      first: true, // 首次请求数据
    }
  },
  components: {
    ApplyArticle,
    ToApp,
    PopupApplySuccess,
    mtPopup: Popup
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
    this.handleGetEventsInfo();
  },
  methods: {
    handleMore() {
      this.more = false;
      this.list = this.allList;
    },
    handleClose(type) {
      this.popupArticle = false;
      this.applySuccess = false;
      if (type) {
        this.applySuccess = true;
      }
    },
    // 获取文章列表 - 获取活动信息
    handleGetEventsInfo() {
      const params = {
        eventCode: 'api-trade'
      }
      this.$http.get('/eventArticle/list', { params }).then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.allList = res.articleList || [];
        if (this.first) { // 第一次加载 - 显示more
          this.list = this.allList.slice(0, 5);
          if (this.allList.length > 5) {
            this.more = true;
          }
          this.first = false;
          return;
        }
        // 非第一次加载 - 不改变more的值 & 根据当前more的值来显示文章条数
        if (this.more) {
          this.list = this.allList.slice(0, 5);
          return;
        }
        this.list = this.allList;
      });
    },
    // 征文提交
    handleApplyArticle() {
      this.popupArticle = true;
    },
    // 文章点赞
    handleLike(item) {
      // 判断打开环境
      // 网页打开 - 提示用户去下载APP
      if (this.channelRef === 'h5' && !this.$store.state.sys.isAppView) {
        this.h5ToDapp = true;
        return;
      }
      // 是APP内部打开
      if (this.$store.state.sys.isAppView) {
        // 判断是否登录
        if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
          AppToLogin();
          return;
        }
      }

      // 点赞
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleLike(item)
        })
        return;
      }
      const params = {
        articleId: item.id
      }
      this.$http.get('/eventArticle/like', { params }).then((res) => {
        if (res.code === 1021) {
          this.$toast({
            message: this.$t('apiTrade.liked'),
            position: 'center',
            duration: 2000
          });
          return;
        }
        if (res.code === 401) {
          localStorage.removeItem('token')
          this.$toast({
            message: this.$t('error.token'),
            position: 'center',
            duration: 2000,
          });
          setTimeout(() => {
            accountToSign(this, () => {
              this.handleLike(item)
            })
          }, 1000);
          return;
        }
        if (res.code !== 0) {
          this.$toast({
            message: this.$t('apiTrade.liketError'),
            position: 'center',
            duration: 2000
          });
          return;
        }
        this.$toast({
          message: this.$t('apiTrade.likeSuccess'),
          position: 'center',
          duration: 2000
        });
        this.handleGetEventsInfo();
      });
    },
    // 分享 - 复制文本
    handleCopy() {
      this.$toast({
        message: this.$t('down.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    handleCopyError() {
      this.$toast({
        message: this.$t('down.copyError'),
        position: 'center',
        duration: 2000
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.article{
  font-size: .32rem;
  background: #000;
  box-sizing: border-box;
  padding: .5rem 0px;
  min-height: 100vh;
  color: #fff;

  // 活动项标题
  .modelTitle{
    display: flex;
    justify-content: center;
    align-items: center;
    color: #00F9F9;
    letter-spacing: 3.6px;
    margin-bottom: .16rem;

    &.hasTip{
      margin-bottom: .12rem;
    }
  }

  .show{
    margin-bottom: .75rem;

    .content{
      width: 6.8rem;
      margin: auto;
      border: 1px solid #00F9F9;
      box-shadow: 0 0 .09rem 0 #77F7FA;
      // box-shadow: 0 0 .2rem .03rem #00F9F9 inset;
      border-radius: .1144rem;
      padding: .45rem .26rem .45rem .2rem;
      box-sizing: border-box;

      .contentIn{
        border-radius: .04rem;
        font-size: .21rem;
        // display: flex;
        // justify-content: space-between;
        align-items: center;

        .tip{
          color: #77F7FA;
          font-size: .27rem;
        }

        .btnDiv{
          margin-top: .3rem;
          display: flex;
          justify-content: center;

          &>div{
            width: 2.4rem;
            height: .6rem;
            background: #26ADFC;
            // background-image: linear-gradient(0deg, #426BFF 0%, #00FFFE 100%);
            border-radius: .08rem;
            font-size: .24rem;
            color: #FFF;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .item{
    width: 6.78rem;
    margin: auto;
    margin-top: .21rem;
    box-sizing: border-box;
    // background-image: linear-gradient(87deg, rgba(#30E2EC, .75) 0%, rgba(#117BE1, .75) 100%);
    background-image: linear-gradient(90deg, #1E8DA8 0%, #117BE1 100%);
    border-radius: 11.92px;
    padding: .45rem .22rem .31rem .25rem;
    font-size: .24rem;
    position: relative;

    .hot{
      position: absolute;
      top: 0px;
      left: 0px;
      padding: .06rem .28rem;
      text-align: center;
      background-image: linear-gradient(-90deg, #FAD961 0%, #F76B1C 100%);
      border-radius: .06rem 0 .06rem 0;
      font-size: .1876rem;
      color: #FFF;
    }

    .title{
      font-size: .3rem;
      color: #77F7FA;
    }
    .info{
      margin-top: .21rem;
      display: flex;
      align-items: center;

      &>div{
        flex: 1;
      }

      .media{
        display: flex;
        align-items: center;
        flex: 1;

        .img{
          display: inline-block;
          width: .4rem;
          height: .4rem;
          border-radius: 10rem;
          background: #FFF;
          margin-right: .05rem;
        }
      }

      .name{
        text-align: right;
      }
    }

    .intro{
      margin-top: .19rem;
      word-break: break-all;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
    }
    .tools{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: .3rem;

      &>div{
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow : ellipsis;
      }

      &>div:nth-child(1){
        font-size: .21rem;
      }

      &>div:nth-child(2){
        text-align: right;
        font-size: .24rem;

        &.liked{
          color: #F5A623;
        }

        .addIcon{
          font-size: .32rem;
        }
      }

      .share{
        max-width: 1.64rem;
        width: 1.64rem;
        height: .6rem;
        background: #F5A623;
        // background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
        border-radius: .08rem;
        font-size: .24rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: .54rem;
      }
    }
  }

  .more{
    text-align: right;
    font-size: 24px;
    color: #77F7FA;
    padding-right: .62rem;
    margin-top: .38rem;
  }
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}
.popupModel{
  background: transparent;
}
</style>
