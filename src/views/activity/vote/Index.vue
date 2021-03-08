<template>
  <div class="vote">
    <!-- banner -->
    <div class="banner flexc">
      <img v-if="language === 'zh-CN'" src="@/assets/img/activity/vote/mainTitle-zh-CN.png" alt="">
      <img v-else-if="language === 'zh-TW'" src="@/assets/img/activity/vote/mainTitle-zh-TW.png" alt="">
      <img v-else src="@/assets/img/activity/vote/mainTitle-en.png" alt="">
    </div>
    <!-- Newdex第二季大使 -->
    <div class="mainContent">
      <div class="title flexc">
        <img v-if="language === 'zh-CN'" src="@/assets/img/activity/vote/title1-zh-CN.png" alt="">
        <img v-else-if="language === 'zh-TW'" src="@/assets/img/activity/vote/title1-zh-TW.png" alt="">
        <img v-else src="@/assets/img/activity/vote/title1-en.png" alt="">
      </div>
      <div class="date">{{$t('PX.PX10')}}</div>
      <div class="list" v-if="rankListData.length > 0">
        <div class="top3">
          <div class="top3-2">
            <img class="top3-2-img" src="@/assets/img/activity/vote/no2.png" alt="">
            <div class="infoDiv">
              <img width="100%" src="@/assets/img/activity/vote/no2-2.png" alt="">
              <div class="info">
                <div class="name">{{rankListData[1].name}}</div>
                <div class="subTitle">{{$t('PX.PX20')}}</div>
                <div class="count">{{rankListData[1].vote}}</div>
              </div>
            </div>
          </div>
          <div class="top3-1">
            <img class="top3-1-img" src="@/assets/img/activity/vote/no1.png" alt="">
            <div class="infoDiv">
              <img width="100%" src="@/assets/img/activity/vote/no1-1.png" alt="">
              <div class="info">
                <div class="name">{{rankListData[0].name}}</div>
                <div class="subTitle">{{$t('PX.PX20')}}</div>
                <div class="count">{{rankListData[0].vote}}</div>
              </div>
            </div>
          </div>
          <div class="top3-3">
            <img class="top3-3-img" src="@/assets/img/activity/vote/no3.png" alt="">
            <div class="infoDiv">
              <img width="100%" src="@/assets/img/activity/vote/no3-3.png" alt="">
              <div class="info">
                <div class="name">{{rankListData[2].name}}</div>
                <div class="subTitle">{{$t('PX.PX20')}}</div>
                <div class="count">{{rankListData[2].vote}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tableOut">
          <div class="table">
            <div class="header">
              <div>{{$t('PX.PX21')}}</div>
              <div>{{$t('PX.PX61')}}</div>
              <div>{{$t('PX.PX20')}}</div>
            </div>
            <div class="body">
              <template v-for="(item, index) in rankListData">
                <div class="mylist" :key="index" v-if="index > 2">
                  <div>{{$t('PX.PX49') + $t(`PX.${chinesNum[index + 1]}`) + $t('PX.PX50')}}</div>
                  <div style="width:25%;">{{item.name}}</div>
                  <div>{{item.vote}}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Newdex第二季大使 -->
    <div class="mainContent">
      <div class="title flexc">
        <img v-if="language === 'zh-CN'" src="@/assets/img/activity/vote/title2-zh-CN.png" alt="">
        <img v-else-if="language === 'zh-TW'" src="@/assets/img/activity/vote/title2-zh-TW.png" alt="">
        <img v-else src="@/assets/img/activity/vote/title2-en.png" alt="">
      </div>
      <div class="content">{{$t('PX.PX4')}}</div>
      <div class="award">
        <div class="setting">{{$t('PX.PX5')}}：</div>
        <div class="flex">
          <span>{{$t('PX.PX6')}}</span>
          <span>{{$t('PX.PX7')}}</span>
        </div>
        <div class="flex">
          <span>{{$t('PX.PX8')}}</span>
          <span style="white-space: nowrap;width: 40%">{{$t('PX.PX9')}}</span>
        </div>
      </div>
      <div class="flexb" style="padding: 0 0.2rem 0.2rem">
        <span></span>
        <a @click="showRules=true"  style="color:#fff">{{$t('PX.PX52')}} ></a>
      </div>
      <div class="cards">
        <div class="tools flexb">
          <div class="left">
            <span :class="{actived:item.value === sortMenuChecked}"
              v-for="(item, index) in sortMenu"
              @click="handleSortMenuClick(item)"
              :key="index">{{item.label}}</span>
          </div>
          <div class="right">
            <input v-model="searchData" type="text" :placeholder="$t('PX.PX25')">
            <span @click="handlerSearchData">{{$t('PX.PX26')}}</span>
          </div>
        </div>
        <div class="cardsList flexb">
          <template v-for="(item, index) in listData">
            <div class="card" :key="index">
              <div class="num flexc">{{(item.code * 1) > 9 ? '' : 0}}{{item.code}}</div>
              <div class="tip1">{{item.name}}</div>
              <div class="tip2">{{item.desc}}</div>
              <a style="display: block;" class="link" :href="item.articleUrl" target="_blank">{{$t('PX.PX28')}}＞</a>
              <div class="voteCount">{{item.vote}}{{$t('PX.PX53')}}</div>
              <div class="btn flexc" @click="handlerVoteAction(item)">{{$t('PX.PX27')}}</div>
            </div>
          </template>
        </div>
        <div class="rules">
          <div class="rulesTitle">{{$t('PX.PX12')}}</div>
          <div class="item">
            <span>1{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX13')}}</span>
          </div>
          <div class="item">
            <span>2{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX14')}}</span>
          </div>
          <div class="item">
            <span>3{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX15')}}</span>
          </div>
          <div class="item">
            <span>4{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX16')}}</span>
          </div>
          <div class="item">
            <span>5{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX17')}}</span>
          </div>
          <div class="item">
            <span>6{{$t('PX.PX51')}}</span>
            <span>{{$t('PX.PX18')}}</span>
          </div>
          <div class="spt">{{$t('PX.PX19')}}</div>
        </div>
      </div>
    </div>
    <mt-popup
      class="popup"
      v-model="showRules"
      position="center">
    <rules @listenClose="handleClose"/>
    </mt-popup>

    <mt-popup
      class="popup popupT"
      v-model="showSuccess"
      position="center">
    <success
      :remainVoteCount="remainVoteCount"
      :voteActionCode="voteActionCode"
      @listenSuccessEmit="listenSuccessEmit"/>
    </mt-popup>

    <mt-popup
      class="popup popupT"
      v-model="showFails"
      position="center">
    <fails
      :remainVoteCount="remainVoteCount"
      :voteActionCode="voteActionCode"
      @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import { accountToSign } from '@/utils/publicApi';
import { Popup, Toast } from 'mint-ui';
import { mapState } from 'vuex';
import Rules from './popup/Rules'
import Success from './popup/Success'
import Fails from './popup/Fails'

export default {
  name: 'vote',
  data() {
    return {
      rankLoading: true,
      rankListData: [], // 排名列表数据
      chinesNum: ['PX38', 'PX39', 'PX40', 'PX41', 'PX42', 'PX43', 'PX44', 'PX45', 'PX46', 'PX47', 'PX48'],
      listLoading: true,
      listDataAll: [], // 列表数据
      listData: [], // 列表数据
      listParams: {
        sort: 1, // 排序方式：1-编号；2-票数
      },
      searchData: '',
      sortMenu: [
        {
          value: 1,
          label: this.$t('PX.PX23')
        },
        {
          value: 2,
          label: this.$t('PX.PX24')
        }
      ],
      sortMenuChecked: 1,
      remainVoteCount: 0, // 可投票次数
      nowVoteItem: {},
      showRules: false,
      showSuccess: false,
      showFails: false,
      voteActionCode: 0, //错误码
    }
  },
  components: {
    Rules,
    mtPopup: Popup,
    Fails,
    Success
  },
  computed: {
    ...mapState({
      // 箭头函数可使代码更简练
      accountInfo: state => state.app.accountInfo,
      language: state => state.app.language
    }),
  },
  watch: {
    searchData:function change(val) {
      if (val === '') {
        this.listData = this.listDataAll;
      }
    }
  },
  mounted() {
    this.scatter = this.$store.state.app.scatter;
    // 获取排行榜
    this.handlerRankList()
    // 获取投票列表
    this.handleVoteList();
  },
  methods: {
    // 获取排行榜
    handlerRankList() {
      this.rankLoading = true;
      this.$http.get('/influencersVote/rankList').then((res) => {
        this.$nextTick(() => {
          this.rankLoading = false;
        })
        if (res.code !== 0) return;
        this.rankListData = res.rankList;
      })
    },
    // 获取投票列表
    handleVoteList() {
      this.listLoading = true;
      this.$http.post('/influencersVote/voteList', this.listParams).then((res) => {
        this.$nextTick(() => {
          this.listLoading = false;
        })
        if (res.code !== 0) return;
        this.listDataAll = res.voteList;
        this.listData = this.listDataAll;
      })
    },
    // 选择排序方式
    handleSortMenuClick(item) {
      this.sortMenuChecked = item.value;
      this.listParams.sort = item.value;
      this.handleVoteList();
    },
    // 搜索
    handlerSearchData() {
      const val = this.searchData.trim();
      this.listData = this.listDataAll.filter((v) => {
        const serStr = `0${v.code}${v.name}`;
        return serStr.toLowerCase().indexOf(val.toLowerCase()) !== -1;
      })
    },
    // 投票操作
    handlerVoteAction(item) {
      this.nowVoteItem = item;
      this.voteLoading = true;
      const params = {
        code: this.nowVoteItem.code
      }
      this.$http.post('/influencersVote/vote', params).then((res) => {
        this.$nextTick(() => {
          this.voteLoading = false;
        })
        if (res.code === 1028) {
          Toast({
            message: this.$t('turnTable.plstoEos'),
            position: 'center',
            duration: 2000,
          });
          return
        }
        if (res.code === 401) {
          setTimeout(() => {
            accountToSign(this, () => {
              this.handlerVoteAction(item);
            });
          }, 800);
          return;
        }
        if (res.code === 1031) {
          this.showFails = true;
          this.remainVoteCount = 0;
          this.voteActionCode = res.code;
          return;
        }
        if (res.code === 1029) {
          this.showFails = true;
          this.remainVoteCount = 0;
          this.voteActionCode = res.code;
          return;
        }
        if (res.code !== 0) {
          this.showFails = true;
          this.voteActionCode = res.code;
          return;
        }
        this.showSuccess = true;
        this.remainVoteCount = res.remainVoteCount;
        this.voteActionCode = res.code;
        const bi = this.listDataAll.find(v => v.code === item.code);
        if (bi) {
          bi.vote += 1;
        }
        this.handlerRankList();
      })
    },
    listenSuccessEmit(key) {
      this.showSuccess = false;
      if (key === 'again') {
        this.handlerVoteAction(this.nowVoteItem);
      }
    },
    handleClose() {
      this.showRules = false;
      this.showSuccess = false;
      this.showFails = false;
    },
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-input-placeholder{
  color: #8BA7F2 !important;
}
.vote{
  background-color: #03048C ;
  background-image: url('../../../assets/img/activity/vote/banner-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  font-size: .24rem;
  padding-bottom: .5rem;
  .banner{
    margin: auto;
    width: 6.90rem;
    padding: 80px 0;
    img{
      width: 100%;
    }
  }
  .mainContent{
    text-align: center;
    .title{
      margin: auto;
      width: 6.32rem;
      img{
        width: 100%;
      }
    }
    .date{
      font-size: .24rem;
      margin-top: .20rem;
      color: #CDE4FF;
      letter-spacing: 1px;
    }
    .list{
      background-image: url('../../../assets/img/activity/vote/list-bg.png');
      background-repeat: no-repeat;
      background-position: 0 1.28rem;
      background-size: contain;
      margin: 0rem .20rem;
      .top3{
        // height: 10rem;
        padding: 0 .35rem;
        display: flex;
        justify-content: space-between;
        .top3-2{
          position: relative;
          padding-top: 1.79rem;
          width: 1.80rem;
          .top3-2-img{
            z-index: 1;
            width: 1.22rem;
            position: absolute;
            top: .75rem;
            left: 50%;
            transform: translateX(-45%);
          }
        }
        .top3-1{
          position: relative;
          padding-top: 1.29rem;
          width: 1.80rem;
          .top3-1-img{
            z-index: 1;
            width: 1.22rem;
            position: absolute;
            top: .30rem;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .top3-3{
          position: relative;
          padding-top: 1.98rem;
          width: 1.80rem;
          .top3-3-img{
            z-index: 1;
            width: 1.22rem;
            position: absolute;
            top: .89rem;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .infoDiv{
          position: relative;
          .info{
            position: absolute;
            width: 1.81rem;
            top: .35rem;
            left: 50%;
            transform: translateX(-50%);
            color: #FFF;
            font-size: .24rem;
            .subTitle{
              margin-top: .08rem;
            }
            .subTitle,.count{
              font-size: .18rem;
              color: #FFFF73;
            }
            .count{
              font-size: .21rem;
            }
          }
        }
      }
      .tableOut{
        background: linear-gradient(90deg, #5845FB 0%, #5845F5 100%);
        margin: .28rem;
        padding: 2px;
        border-radius: .08rem;
      }
      .table{
        height: 7.31rem;
        // height: 5.31rem;
        background-image: linear-gradient(90deg, #848EFF 0%, #3452E3 100%);
        border: .05rem solid #5845f7;
        border-radius: .08rem;
        .body{
          // max-height: 4.5rem;
          // overflow: auto;
        }
        .header{
          background: rgba(#6236FF, .18);
        }
        .mylist,
        .header{
          height: .74rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #2B2EAF;
          font-size: .24rem;
          padding: 0 .55rem 0 .37rem;

          &>div{
            flex: 2;
            text-align: left;
            white-space: nowrap;
            &:last-child{
              flex: 3;
              text-align: right;
            }
          }
        }
        .mylist{
          margin-top: .22rem;
          color: #fff;
          height: 0.7rem;

          &>div{
            &:last-child{
              color: #FFF264
            }
          }
        }
      }
    }

    &:last-child{
      margin-top: .40rem;
    }

    .content{
      text-align: left;
      padding: .31rem .45rem .24rem;
      font-size: .27rem;
      color: #FFFFFF;
    }
    .award{
      font-size: .27rem;
      color: #FFF264;
      margin: 0 .47rem;
      padding-bottom: .45rem;
      .flex{
        text-align: left;
        &>span{
          flex: 1
        }
      }
    }
    .cards{
      margin: 0 .20rem;
      border-radius: .08rem;
      background-image: linear-gradient(179deg, rgba(#848EFF, .55) 0%, rgba(#03038B, .55) 100%);
      padding: .30rem .25rem;
      .tools{
        .left{
          font-size: .24rem;
          color: #8BA7F2;
          &>span{
            margin-right: .36rem;
            &:last-child{
              margin-right: 0rem;
            }
          }
          .actived{
            color: #FFF;
          }
        }
        .right{
          input{
            box-sizing: border-box;
            padding-left: .17rem;
            font-size: .21rem;
            height: .45rem;
            width: 2.1rem;
            background: rgba(#FFFFFF, .1);
            border-radius: .225rem;
            color: #fff;
          }
          span{
            height: .45rem;;
            margin-left: .05rem;
            color:  #3E57D3;
            font-size: .21rem;
            padding: .10rem .34rem;
            background: #fff;
            border-radius: .225rem;
          }
        }
      }
      .cardsList{
        margin-top: 5px;
        flex-wrap: wrap;
        .card{
          margin-top: .20rem;
          background: #FFF;
          border-radius: .0725rem;
          padding: .22rem .31rem .36rem;
          width: 3.20rem;
          min-width: 3.2rem;
          box-sizing: border-box;
          .num{
            background: #F6F6F6;
            margin: auto;
            height: 1.1rem;
            width: 1.1rem;
            font-size: .48rem;
            color: #5845F6;
            border-radius: 2rem
          }
          .tip1{
            margin-top: .10rem;
            font-size: .27rem;
            text-align: center;
            white-space: nowrap;
            color: #333333;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 105%;
            line-height: .33rem;
          }
          .tip2{
            text-align: left;
            margin-top: .08rem;
            line-height: .33rem;
            // min-height: 0.6rem;
            height: .6rem;
            font-size: .21rem;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .link{
            margin-top: .10rem;
            font-size: .24rem;
            color: #5845F6;
            text-align: left;
          }
          .voteCount{
            color: #999;
            font-size: .24rem;
            margin: .12rem 0 .10rem;
          }
          .btn{
            position: relative;
            bottom: 0px;
            background-image: linear-gradient(90deg, #5845FB 0%, #5845F5 100%);
            border-radius: .0725rem;
            height: .50rem;
            color: #FFF;
          }
        }
      }
      .rules{
        margin-top: .43rem;
        color: #fff;
        font-size: .24rem;
        text-align: left;
        .rulesTitle{
          font-size: .27rem;
        }
        .item{
          display: flex;
          margin-top: .14rem;
        }
        .spt{
          color: #8BA7F2;
          margin-top: .27rem;
          font-size: .21rem;
        }
      }
    }
  }
}
.popup{
  border-radius: .15rem;
  overflow: hidden;
}
.popupT{
  background: transparent;
}
</style>
