<template>
  <div class="search">
    <div class="tools">
      <span class="iconfont icon-huaban137 searchIcon"></span>
      <span class="inputDiv"><input type="text" ref="search" :placeholder="$t('public.search')" v-model="searchData"></span>
      <span class="iconfont icon-huaban17 closeIcon" @click="handleBack"></span>
    </div>
    <!-- 历史记录 start -->
    <div class="history result" v-if="historyList.length && !searchData">
      <div class="title">
        <span>{{ $t('quotation.searchHistory') }}：</span>
        <span class="iconfont icon-huaban18 clearHistory" @click="deleteAllHistory = true"></span>
      </div>
      <div class="historyList">
        <span class="historyItem" v-for="(item, $index) in historyList" @click="handleToSearch(item)"
          :key="$index">{{ item }}</span>
      </div>
    </div>
    <!-- 历史记录 end -->

    <!-- 搜索结果 start -->
    <div class="result" v-if="!(historyList.length && !searchData)">
      <div class="title" v-show="searchData">{{ $t('public.searchResult') }}</div>
      <div class="resList">
        <!-- 有数据 -->
        <div class="item" v-for="(item, $index) in list" :key="$index" @click="handleToTrad(item)">
          <div class="symbol">
            <img class="coinImg" :src="item.coinImgUrl" @error="handleImgError(item)"
              :onerror="errorCoinImg" alt="">
            <!-- <span class="symbol1">{{ item.symbol1 }}</span><span class="symbol2">/{{ item.symbol2 }}</span> -->
            <div v-if="item.resources !== 'resources'" class="symbol1">
              {{ item.symbol1 }}/{{ item.symbol2 }}
              <div class="chain" v-if="item.showChain" ></div>
            </div>
            <span v-else>
              <span v-if="item.id === 'rex' || item.id === 'ram'">{{ item.symbol1.toUpperCase() }}</span>
              <span v-else>{{ `${item.symbol1.toUpperCase()} & ${item.symbol2.toUpperCase()}` }}</span>
            </span>
          </div>
          <div class="price">{{ item.price }}</div>
          <div class="percent"
            :class="{'color-green': Number(item.change) > 0,'color-red': Number(item.change) < 0,'color-999': Number(item.change) === 0}">
            <span v-if="item.change > 0">+</span>{{ item.change }}%
          </div>
          <!-- <div class="favorite" @click.stop="false" v-if="channelRef === 'dapp'">
            <Favourites :symbol="item.symbol" :id="item.id" :favoriteList="favoriteList"/>
          </div> -->
        </div>
        <!-- 无数据 -->
        <div class="noData" v-if="!loading && list.length === 0">
          <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt="">
          <div class="noTip color-999" v-show="searchData">{{ $t('public.noThisKey') }}</div>
        </div>
        <div class="loading" v-if="loading">
          <mt-spinner type="snake" color="#0094d5" class="color-this"></mt-spinner>
        </div>
      </div>
    </div>
    <!-- 搜索结果 end -->

    <!-- 弹窗 - 确定删除 start -->
    <mt-popup
      class="popup"
      v-model="deleteAllHistory"
      popup-transition="popup-fade">
      <div class="deleteAllHistory">
        <div class="content">{{ $t('quotation.deleteAll') }}</div>
        <div class="btnDiv">
          <div class="popCancel color-999" @click="deleteAllHistory = false">{{ $t('public.cancel') }}</div>
          <div class="popSure color-this" @click="handleDeleteAll">{{ $t('public.sure') }}</div>
        </div>
      </div>
    </mt-popup>
    <!-- 弹窗 - 确定删除 end -->
  </div>
</template>

<script>
// import Io from '@/utils/socket/index';
import { toFixed } from '@/utils/public';
import { Decimal } from 'decimal.js';
import { Popup, Spinner } from 'mint-ui';

export default {
  data() {
    return {
      errorCoinImg: 'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      searchData: '',
      loading: false,
      list: [],
      timer: null,
      favoriteList: [],
      channelRef: 'dapp',
      historyList: [],
      deleteAllHistory: false,
      isEmbed: false,
    }
  },
  components: {
    mtPopup: Popup,
    mtSpinner: Spinner
  },
  watch: {
    searchData(newVal) {
      this.loading = true;
      this.list = []
      window.clearTimeout(this.timer);
      if (newVal === '') {
        this.list = [];
        this.loading = false;
        return;
      }
      this.timer = window.setTimeout(() => {
        this.handleSearchData();
      }, 500);
    },
    '$store.state.app.allSymbolDataChange': function listen() {
      if (!this.searchData) {
        return;
      }
      this.handleSearchData();
    },
  },
  mounted() {
    this.isEmbed = !!this.$route.meta.isEmbed;
    this.channelRef = localStorage.getItem('channelRef');
    this.handleGetSelf();
  },
  methods: {
    // 删除所有历史记录
    handleDeleteAll() {
      this.deleteAllHistory = false;
      this.historyList = [];
      localStorage.removeItem('historyList');
    },
    // 点击历史记录查询
    handleToSearch(item) {
      this.searchData = item;
    },
    // 保存历史记录
    handleSetHistory(data) {
      const index = this.historyList.findIndex(item => item.toUpperCase() === data.toUpperCase());
      // 搜索内容不存在 & 数据小于10 - 直接添加
      if (index < 0) {
        // 数据大于等于10 删除最后一条
        if (this.historyList.length >= 10) {
          this.historyList.pop()
        }
      } else {
        // 数据存在 - 记录排在第一位
        this.historyList.splice(index, 1);
      }
      this.historyList.unshift(data.toUpperCase()); // 展示历史
      localStorage.setItem('historyList', JSON.stringify(this.historyList)); // 本地保存
    },
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(item, 'coinImgUrl', 'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png')
    },
    // 返回
    handleBack() {
      if (!this.searchData) {
        history.back();
      }
      this.searchData = '';
    },
    // 去交易
    handleToTrad(item) {
      // 资源交易对跳转
      if (item.resources === 'resources') {
        if (item.id === 'rex') {
          this.handleSetHistory(`${item.symbol1}`);
          this.$router.push({
            name: this.isEmbed ? 'resourceKlineRexEmbed' : 'resourceKlineRex',
          });
          return;
        }
        if (item.id === 'ram') {
          this.handleSetHistory(`${item.symbol1}`);
          this.$router.push({
            name: this.isEmbed ? 'resourceKlineRamEmbed' : 'resourceKlineRam',
          });
          return;
        }
        this.handleSetHistory(`${item.symbol1} & ${item.symbol2}`);
        this.$router.push({
          name: this.isEmbed ? 'resourceKlineCpuEmbed' : 'resourceKlineCpu',
        });
        return;
      }
      this.handleSetHistory(`${item.symbol1}/${item.symbol2}`);
      this.$router.push({
        name: this.isEmbed ? 'linekEmbed' : 'linek',
        params: {
          symbol: item.symbol, // 交易对名称
        }
      });
    },
    // 获取收藏列表
    handleGetSelf() {
      try {
        // 获取本地搜索历史
        this.historyList = localStorage.getItem('historyList') ? JSON.parse(localStorage.getItem('historyList')) : [];

        this.$refs.search.focus();
        if (this.channelRef === 'h5') {
          return;
        }
        const params = {
          account: this.$store.state.app.accountInfo.account,
        };
        this.$http.post('/account/getFavoriteSymbolList', params).then((res) => {
          if (res.code !== 0) {
            // Toast({
            //   message: res.msg,
            //   position: 'center',
            //   duration: 2000,
            // });
            return;
          }
          // 设置用户是否有自选
          localStorage.setItem('hasFavorite', false);
          if (res.symbolList.length > 0) {
            localStorage.setItem('hasFavorite', true);
          }
          this.favoriteList = res.symbolList;
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetSelf()
        }, 200);
      }
    },
    // 搜索功能
    handleSearchData() {
      this.loading = false;
      // 处理数据
      const allData = [];
      for (const key in this.$store.state.app.allSymbolData) { // eslint-disable-line
        if (key !== 'change' && key !== 'self') {
          allData.push(...this.$store.state.app.allSymbolData[key])
        }
      }
      // 浅拷贝 - 数据处理
      const sourceSymbolList = JSON.stringify(allData);
      const wsList = JSON.parse(sourceSymbolList);
      wsList.forEach((item) => {
        this.$set(item, 'symbol1', item.symbol1.toUpperCase());
        this.$set(item, 'symbol2', item.symbol2.toUpperCase());

        const price = toFixed(item.price, item.precision.price);
        this.$set(item, 'price', price);

        const change = toFixed(Decimal.mul(item.change, 100), 2);
        this.$set(item, 'change', change);
      });
      // 搜索符合symbol1的交易对
      const searchData = this.searchData.toUpperCase().split('/');
      let filterArr = wsList.filter((item) => {
        const index = item.symbol1.indexOf(searchData[0]);
        if (index !== -1) {
          this.$set(item, 'index', index);
          // 补充显示跨链图标
          const chain = item.chain
          const arr = chain.split('-')
          const isChain = arr[0] !== arr[1]
          this.$set(item, 'showChain', isChain)
          return true;
        }
        return false;
      })
      if (searchData.length === 2) {
        filterArr = filterArr.filter((item) => {
          const index = item.symbol2.indexOf(searchData[1]);
          if (index !== -1) {
            this.$set(item, 'index', index);
            return true;
          }
          return false;
        })
      }

      // 对象去重
      let obj = {};
      filterArr = filterArr.reduce((prevArr, v) => {
        obj[v.id] ? '' : obj[v.id] = true && prevArr.push(v);
        return prevArr;
      }, []);

      // 按字母排序 - [a ～ z]
      filterArr.sort((obj1, obj2) => {
        if (obj1.symbol1 >= obj2.symbol1) {
          return 1;
        }
        return -1;
      });

      // 按查询左优先排序
      filterArr.sort((obj1, obj2) => {
        if (obj1.index >= obj2.index) {
          return 1;
        }
        return -1;
      })

      this.list = filterArr;
    },
  },
  activated() {
    this.handleGetSelf();
    if (this.$route.params.reSet === 'reset') {
      this.searchData = '';
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'linek') {
      const newTo = to;
      newTo.params.reSet = 'reset';
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    if (to.name !== 'linek') {
      this.searchData = '';
    }
    next();
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.search{
  font-size: .32rem;

  // 搜索工具样式
  .tools{
    display: flex;
    align-items: center;/*垂直居中*/
    height: .9rem;
    padding: 0px .4rem;
    background: #FFF;

    .searchIcon{
      font-size: .48rem;
      color: $color-999;
    }

    .inputDiv{
      flex: 1;
      margin: 0px .2rem;

      &>input{
        width: 100%;
        height: .9rem;
        font-size: .32rem;
      }
    }

    .closeIcon{
      font-size: .35rem;
      color: $color-999;
    }
  }

  // 搜索历史 style
  .history{
    .clearHistory{
      font-size: .32rem;
      float: right;
      margin-right: .2rem;
    }

    .historyList{
      // margin-top: .24rem;
      display: flex;
      flex-wrap: wrap;

      .historyItem{
        margin-top: .24rem;
        margin-right: .1rem;
        background: rgba($color: #9B9B9B, $alpha: .08);
        padding: .04rem .15rem;
        border-radius: .04rem;
        font-size: .26rem;
      }
    }
  }

  // 搜索结果样式
  .result{
    background: #fafafa;
    padding: .24rem .15rem;

    .title{
      color: $color-999;
    }

    .loading{
      display: block;
      width: 30px;
      margin: auto;
      padding: .3rem 0rem;
    }

    .resList{
      height: calc(100vh - 1.83rem);
      overflow: auto;

      .item{
        display: flex;
        align-items: center;/*垂直居中*/
        justify-content: space-between;
        height: .7rem;;
        .coinImg{
          width: .4rem;
          margin-right: .08rem;
        }
        .symbol1{
          display: flex;
          align-items: center;
        }
        // 跨链
      .chain{
        margin-left: 0.1rem;
        display: flex;
        flex-shrink: 0;
        width: 15px;
        height: 15px;
        background: url('/static/img/market/chain.png') no-repeat;
        background-size: 100% 100%;
        background-position: center center;
      }

        &>div{
          text-align: center;
          flex: 2;

          &:first-child{
            flex: 3.5;
            text-align: left;
            min-width: 2.3rem;
            display: flex;
            align-items: center;/*垂直居中*/
          }

          &:nth-child(4){
            flex: 1;
            min-width: .48rem;
          }
        }

        .price,
        .percent{
          text-align: right;
        }

        .symbol1{
          overflow: hidden;
          word-break: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        //   .symbol2{
        //     font-size: .25rem;
        //     color: $color-999;
        //   }
        }
      }

      .noData{
        margin-top: .9rem;
        text-align: center;

        .noTip{
          font-size: .25rem;
          color: $color-666;
        }

        .imgNodata{
          height: 1.8rem;
          padding-top: .30rem;
          padding-bottom: .1rem;
        }
      }
    }
  }
}

// 弹窗样式
.popup{
  width: 5rem;
  text-align: center;

  .content{
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btnDiv{
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid $color-input;

    &>div{
      flex: 1;
      height: .8rem;
      line-height: .8rem;
    }

    .popSure{
      border-left: 1px solid $color-input;
    }
  }
}
</style>
