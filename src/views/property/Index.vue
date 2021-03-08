<template>
  <div class="property" @click="select = false" ref="propertyScroll" id="property">
    <mt-loadmore
      class="myLoadMore"
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="$t('public.loadingMoreTip1')"
      :bottomDropText="$t('public.loadingMoreTip2')"
      :bottomLoadingText="$t('public.loadingMoreTip3')"
      :top-method="loadTop"
      :auto-fill="false"
      ref="loadmore"
    >
      <!-- topShow -->
      <Account ref="account"/>

      <!-- tab切换 -->
      <div class="tabBg" ref="tab" :class="{'propertyPosition': isScroll > subTabHeight}">
        <div class="tab" :class="{'border': tab !== 3 }">
          <div @click="tab = 1" :class="{'actived': tab === 1}">{{ $t('merge.propertyDetail') }}</div>
          <div v-if="$appName === 'eosNewdex'" @click="tab = 2" :class="{'actived': tab === 2}">
            {{ $t('more.vipCenter') }}
          </div>
          <div @click="tab = 3" :class="{'actived': tab === 3}">{{ $t('merge.moreContent') }}</div>
        </div>
      </div>
      <div class="tabBg">
        <div :class="{'tab': isScroll > subTabHeight}"></div>
      </div>

      <div v-if="tab === 1">
        <!-- 账户资源 | CPU & NET & RAM -->
        <div class="accountProperty">
          <account-property ref="accountProperty" :isRefresh="isRefresh" :ndxNum="accountTotalStakeNdx" />
        </div>

        <!-- detail -->
        <div class="detail">
          <div class="title" :class="{'propertyPosition': isScroll > topHeight}">
            <div class="select" @click.stop="handleShowSelect" :class="{'color-this': select}">
              <!-- 资产筛选 start -->
              <div class="selectMenu" v-if="select">
                <div class="select color-333">
                  <div
                    @click.stop="handleChangeSelect(1)"
                    v-if="selectActive !== 1"
                  >{{ $t('property.all') }}</div>
                  <!-- <div @click.stop="handleChangeSelect(2)" v-if="selectActive !== 2">{{ $t('property.abled') }}</div> -->
                  <div
                    @click.stop="handleChangeSelect(3)"
                    v-if="selectActive !== 3"
                  >{{ $t('property.notSmall') }}</div>
                  <!-- <div
                    @click.stop="handleChangeSelect(4)"
                    v-if="selectActive !== 4"
                  >{{ $t('property.myFollow') }}</div> -->
                </div>
              </div>
              <!-- 资产筛选 end -->

              <!-- <span class="borderLeft"></span> -->
              <!-- 资产选择 start -->
              <span>
                <span v-if="selectActive === 1">{{ $t('property.all') }}</span>
                <span v-if="selectActive === 2">{{ $t('property.abled') }}</span>
                <span v-if="selectActive === 3">{{ $t('property.notSmall') }}</span>
                <span v-if="selectActive === 4">{{ $t('property.myFollow') }}</span>
              </span>
              <!-- 资产选择 end -->
              <span class="showSubMenuIcon" :class="{'show': select}"></span>
            </div>
            <div class="search">
              <input
                type="text"
                class="searchInput"
                v-model="searchData"
                @focus="handleSearchFocus"
                :placeholder="$t('public.search')"
              >
              <span class="iconfont icon-huaban137 searchIcon"></span>
            </div>
          </div>
          <div class="paddDetail">
              <div :class="{'title': isScroll > topHeight}"></div>

              <!-- list -->
              <div class="scrollDetail">
                <div class="list" v-for="(item, $index) in list" :key="$index" @click="handleShowAction(item)">
                  <div class="valuation tip">
                    <div>
                      <img
                        :src="item.coinImgUrl"
                        @error="handleImgError(item)"
                        :onerror="errorCoinImg"
                        class="coinImg"
                      >
                    </div>
                    <div>
                      <div class="coin color-this">{{ item.code }}</div>
                      <div class="color-999 aboutPrice" :class="{'hidden': item.code === 'EOS'}">
                        {{ $t('property.about') }}：
                        <span class="hiddenSpan">
                          {{ Number(item.valuation) >= 10000000 ? toFixed(Number(item.valuation), 0) :
                          item.valuation || '0.0000' }}{{ handleChainBaseCoin() }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="price">
                    <div class="able">{{ $t('property.balance') }}：{{ item.usableAmount }}</div>
                    <div class="freeze tip" v-if="item.contract === 'newdexissuer' && item.code === 'NDX'">
                      {{ $t('vip.mortgage') }}：{{ toFixed(accountTotalStakeNdx || 0, 4) }}
                    </div>
                    <div class="freeze tip">{{ $t('property.freeze') }}：{{ item.freezeCount }}</div>
                  </div>
                </div>
                <!-- 没有查询数据 -->
                <div class="noData" v-if="!loading && list.length === 0">
                  <img src="/static/img/order/search_keyword_ic.png" class="imgNodata" alt>
                  <div class="noTip color-999">{{ $t('public.noList') }}</div>
                  <div>
                    <button class="btn" @click="handleReSet">{{ $t('public.back') }}</button>
                  </div>
                </div>

                <!-- 右下角提示数据延迟 -->
                <div class="wating" v-if="list.length">
                  <span>{{ $t('property.wait') }}</span>
                </div>
              </div>
          </div>
        </div>
      </div>

      <!-- 会员中心 && 更多服务 -->
      <index-more v-if="tab !== 1" :tab="tab"  />
    </mt-loadmore>

    <!-- 币种操作 start -->
    <mt-popup
      class="dialogOperation"
      popup-transition="popup-fade"
      position="bottom"
      v-model="showOperation"
    >
      <operation-coin
        v-if="showOperation"
        :operationData="operationData"
        @lishenNDX="handleNDX"
        @lishenClose="handleClose"
        @listenShowWithdraw="handleShowWithdraw"
      />
    </mt-popup>
    <!-- 币种操作 end -->

    <!-- 抵押赎回 start -->
    <mt-popup class="mortgageNDX" popup-transition="popup-fade" v-model="mortgageNDX">
      <MortgageNDX
        v-if="mortgageNDX"
        :isMortgageNDX="isMortgageNDX"
        @listenClose="handleCloseMortgageNDX"
      />
    </mt-popup>
    <!-- 抵押赎回 end -->
    <!-- 充提服务暂停 -->
    <mt-popup
      v-model="WithdrawDialogVisible"
      class="popup"
      popup-transition="popup-fade">
      <withdraw-dialog @listenWithdrawDialog="WithdrawDialogVisible = false;"/>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Loadmore } from 'mint-ui';
import axios from 'axios';
import { Decimal } from 'decimal.js';
import { toFixed, handleChainBaseCoin } from '@/utils/public';

import Account from '@/components/Account';
import WithdrawDialog from '@/components/WithdrawDialog'; // 充提币暂停
import MortgageNDX from '@/views/more/components/MortgageNDX';
import IndexMore from '@/views/more/IndexMore';
import OperationCoin from './components/OperationCoin';
import AccountProperty from './components/AccountProperty';

export default {
  data() {
    return {
      errorCoinImg:
        'this.src="https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png"',
      list: [], // 资产列表
      listOld: [], // 资产列表 - 保存筛选前的列表数据 (只有在 selectActive 改变时进行改变)
      followData: [], // 关注列表数据
      longClickTimer: null,
      positions: {
        left: 0,
        top: 0
      },
      select: false,
      selectActive: 3, // 1 - 全部资产 | 2 - 可交易资产 | 3 - 非小额资产 | 4 - 我的关注
      searchData: '',
      timer: null,
      loading: false,
      showOperation: false,
      operationData: null, // 进行操作的币种

      abledTrade: 0.01, // 可交易最小金额
      box: null,
      subTabHeight: 0,
      topHeight: 0,
      isScroll: 0,
      coinImgUrl:
        'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png',

      mortgageNDX: false, // 是否显示抵押弹窗 true - 显示 | false - 不显示
      isMortgageNDX: false, // 是否抵押NDX true - 抵押 | false - 赎回
      accountTotalStakeNdx: '0.0000',
      tab: 1,
      heightTimer: null,
      isRefresh: false, // 是否正在刷新
      WithdrawDialogVisible: false, // 充提服务暂停
    };
  },
  props: [],
  components: {
    Account,
    OperationCoin,
    AccountProperty,
    MortgageNDX, // 抵押 & 赎回 NDX
    IndexMore,
    WithdrawDialog,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
  },
  watch: {
    '$store.state.app.coinList': function listen() {
      this.$refs.loadmore.onTopLoaded();
      this.isRefresh = false;
      this.handleDealList();
      this.handleChangeList();
    },
    followData() {
      this.handleDealList();
      this.handleChangeList();
    },
    searchData(newVal) {
      window.clearTimeout(this.timer);
      if (newVal === '') {
        this.timer = window.setTimeout(() => {
          this.list = this.listOld;
        }, 500);
        return;
      }
      this.timer = window.setTimeout(() => {
        this.loading = true;
        this.handleSearchData();
      }, 500);
    },
    listOld(newVal) {
      this.list = newVal;
      this.handleSearchData();
    },
  },
  created() {
    if (this.$appName === 'tronNewdex') {
      this.abledTrade = 50
    }
  },
  mounted() {
    this.listOld = this.$store.state.app.coinList;
    this.handleGetFollowList();
    this.handleChangeList();
    this.handleStakeInfo();
    this.handleGetHeight();

    this.box = this.$refs.propertyScroll;
    this.box.addEventListener('scroll', this.listenScroll, false);
  },
  methods: {
    handleGetHeight() {
      setTimeout(() => {
        this.topHeight = this.$refs.account.$el.clientHeight;
        this.subTabHeight = this.topHeight;
        // this.topHeight += this.$refs.tab.clientHeight;
        if (this.$refs.accountProperty) {
          this.topHeight += this.$refs.accountProperty.$el.clientHeight;
        }
      }, 500);
    },
    handleChainBaseCoin() {
      return handleChainBaseCoin();
    },
    toFixed(n, m) {
      return toFixed(n, m);
    },
    // 查询账户抵押信息
    handleStakeInfo() {
      try {
        if (this.$store.state.app.accountInfo.chain === 'eos') {
          const params = {
            code: 'newdexstaked',
            table: 'stakes',
            scope: this.$store.state.app.accountInfo.encodeName,
            lower_bound: this.$store.state.app.accountInfo.chain,
            upper_bound: this.$store.state.app.accountInfo.chain,
            json: true
          };
          axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
            if (res.data.rows.length !== 0) {
              const row = res.data.rows[0];
              let all = Decimal.add(
                row.self_staked,
                row.staked_to_others
              ).toString();
              all = Decimal.div(all, 10000).toString();
              this.accountTotalStakeNdx = toFixed(all, 4);
            }
          });
        }
      } catch (error) {
        setTimeout(() => {
          this.handleUnstakeNum();
        }, 200);
      }
    },
    // 处理图片加载出错
    handleImgError(item) {
      this.$set(
        item,
        'coinImgUrl',
        'https://ndi.340wan.com/upload/20180919/ed752ac2f6174370bf879620ec821eee.png'
      );
    },
    // 搜索框获取焦点时滚动到最顶部
    handleSearchFocus() {
      // setTimeout(() => {
      //   if (!document.getElementById('property')) {
      //     return;
      //   }
      //   document.getElementById('property').scrollTop = 4.86 * ((screen.width / 750) * 100);
      // }, 200);
    },
    // 页面滚动位置
    listenScroll() {
      if (!this.$refs.propertyScroll) {
        return;
      }
      // this.isScroll = this.$refs.propertyScroll.scrollTop / ((screen.width / 750) * 100);
      this.isScroll = this.$refs.propertyScroll.scrollTop;
    },
    // 重置
    handleReSet() {
      this.selectActive = 1;
      this.searchData = '';
      this.handleChangeList();
    },
    // 获取关注列表
    handleGetFollowList() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        };
        this.$http.post('/account/getMyFavorites', params).then((res) => {
          if (res.code !== 0) {
            setTimeout(() => {
              // this.handleGetFollowList();
            }, 500);
            return;
          }
          this.followData = res.list;
        });
      } catch (error) {
        setTimeout(() => {
          // this.handleGetFollowList();
        }, 200);
      }
    },
    // 处理coinList - 是否关注
    handleDealList() {
      const allList = this.$store.state.app.coinList;
      allList.forEach((item) => {
        this.$set(item, 'isFollow', false);
        this.followData.forEach((v) => {
          if (item.coinId === v.coinId) {
            this.$set(item, 'isFollow', true);
          }
        });
      });
      this.$store.dispatch('setCoinList', allList);
    },
    // 下拉刷新 - 账户资产刷新
    loadTop() {
      this.searchData = '';
      this.select = false;
      this.handleGetFollowList();
      this.isRefresh = true;
      this.$refs.account.refresh = true;
      this.$refs.account.handleGetAccountFreeze();
      if (this.$refs.accountProperty) {
        this.$refs.accountProperty.handleGetAccountInfo();
      }
    },
    // 展开下拉列表
    handleShowSelect() {
      this.select = !this.select;
    },
    // 改变select条件
    handleChangeSelect(index) {
      this.select = !this.select;
      this.selectActive = index;
      this.searchData = '';
      // 筛选操作
      this.handleChangeList();
    },
    // 根据 selectActive 筛选列表 | 1 - 全部资产 | 2 - 可交易资产 | 3 - 非小额资产 | 4 - 我的关注 |
    handleChangeList() {
      const allList = this.$store.state.app.coinList;
      // 1 - 全部资产
      if (this.selectActive === 1) {
        this.listOld = allList;
        return;
      }
      // 2 - 可交易资产
      if (this.selectActive === 2) {
        let arr = [];
        arr = allList.filter(
          item => Number(item.usableValuation) >= this.abledTrade
        );
        this.listOld = arr;
        return;
      }
      // 3 - 非小额资产
      if (this.selectActive === 3) {
        let arr = [];
        arr = allList.filter(item => Number(item.valuation) >= this.abledTrade);
        this.listOld = arr;
        return;
      }
      // 4 - 我的关注
      const arr = allList.filter(item => item.isFollow);
      const newArr = []; // 关注排序数组
      this.followData.forEach((item) => {
        arr.forEach((subItem) => {
          if (item.coinId === subItem.coinId) {
            newArr.unshift(subItem);
          }
        });
      });
      this.listOld = newArr;
    },
    // 搜索
    handleSearchData() {
      const list = this.listOld;
      const newList = list.filter((item) => {
        const code = item.code.toLowerCase();
        return code.indexOf(this.searchData.toLowerCase()) !== -1;
      });
      this.list = newList;
      this.loading = false;
    },
    // 点击弹出操作列表
    handleShowAction(item) {
      // if (item.code === 'REX') {
      //   return;
      // }
      if (this.select) {
        return;
      }
      this.showOperation = true;
      const itemStr = JSON.stringify(item);
      this.operationData = JSON.parse(itemStr);
    },
    // 关闭操作弹窗 - res: false | {status: true|false, coinId: 2|3}
    handleClose(res) {
      // 关闭弹窗
      this.showOperation = false;

      // 取消关注 | 添加关注
      if (res) {
        const listItem = this.followData.findIndex(
          item => item.coinId === res.coinId
        );
        const arr = JSON.parse(JSON.stringify(this.followData));
        this.followData = [];
        if (listItem !== -1) {
          arr.splice(listItem, 1);
        } else {
          arr.push({
            coinId: res.coinId
          });
        }
        this.followData = arr;
      }
    },
    // ndx 操作 type : false - 抵押 | true - 赎回
    handleNDX(type) {
      this.mortgageNDX = true;
      this.isMortgageNDX = type;
    },
    // 抵押弹窗关闭
    handleCloseMortgageNDX() {
      this.mortgageNDX = false;
    },
    handleShowWithdraw() {
      this.WithdrawDialogVisible = true;
    }
  },
  beforeDestroy() {
    this.box.removeEventListener('scroll', this.listenScroll, false);
    window.clearTimeout(this.heightTimer)
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .property {
    height: calc(100vh - 1.5rem) !important;
  }
}

.property {
  height: calc(100vh - 1rem);
  font-size: 0.3rem;
  overflow: auto;
  background: #FFF;;

  // .myLoadMore {
  //   overflow: none !important;
  //   height: 100%;
  //   margin-bottom: -.4rem;

  //   /deep/ .mint-loadmore-content{
  //     height: 100%;
  //   }
  // }
}

.selectMenu {
  background: white;
  box-shadow: 0px 0px 0.07rem rgba(74, 144, 226, 0.31);
  width: 2.8rem;
  position: absolute;
  left: 0rem;
  top: 0.65rem;
  border-radius: 0.13rem;
  padding: 0rem 0.33rem;
  text-align: center;
  box-sizing: border-box;

  &::after {
    content: "";
    // border: 10px solid transparent;
    border: 0.1rem solid white;
    position: absolute;
    top: -0.1rem;
    left: 0.4rem;
    box-shadow: 0px 0px 0.07rem rgba(74, 144, 226, 0.31);
    transform: rotate(45deg);
  }

  .select {
    position: relative;
    z-index: 10;
    background: #fff;
    font-size: 0.25rem;

    & > div {
      line-height: 0.86rem;
      height: 0.86rem;
      border-bottom: 1px solid $color-e3e3e3;

      &:last-child {
        border-bottom: 0px solid $color-e3e3e3;
      }
    }
  }
}

.detail {
  margin: 0rem 0rem;
  font-size: 0.32rem;
  background: #fff;
  // padding: 0.24rem 0.24rem;
  // box-shadow: 0px 0px 0.15rem #f0f0f0;
  position: relative;
  min-height: calc(100vh - 5.2rem);
  .paddDetail{
    padding: 0 .24rem;
    box-sizing: border-box;
  }
  .title {
    line-height: 0.54rem;
    height: 0.84rem;
    display: flex;
    align-items: center; /*垂直居中*/
    background: #F3F3F3;

    padding: 0 .24rem;
    box-sizing: border-box;

    &.propertyPosition {
      position: fixed;
      // width: 7.02rem;
      width: 7.5rem;
      max-width: 750px;
      // background: #fff;
      background: #F3F3F3;
      top: .8rem;
      padding: 0.15rem .24rem;

    }

    & > div {
      flex: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center; /*垂直居中*/
      position: relative;
    }

    .showSubMenuIcon {
      border: 0.08rem solid transparent;
      border-top: 0.08rem solid black;
      margin-left: 0.15rem;
      margin-top: 0.04rem;

      &.show {
        transform: rotate(180deg);
        margin-top: -0.08rem;
        border-top: 0.08rem solid $color-this;
      }
    }

    .searchInput {
      // background: rgba(216, 216, 216, 0.3);
      background-color: #fff;
      height: 0.54rem;
      font-size: 0.3rem;
      padding: 0px 0.36rem;
      border-radius: 0.3rem;
      width: calc(100% - 0.72rem);
    }

    .searchIcon {
      position: absolute;
      right: 0.2rem;
      font-size: 0.3rem;
    }

    .borderLeft {
      border-left: 2px solid $color-this;
      border-right: 2px solid $color-this;
      display: inline-block;
      height: 0.28rem;
      margin-right: 0.12rem;
    }
  }

  .list {
    display: flex;
    align-items: center; /*垂直居中*/
    height: 1.5rem;
    // padding: .1rem;
    border-bottom: 1px solid $color-e3e3e3;
    font-size: 0.25rem;

    &:last-child {
      border-bottom: 1px solid transparent;
    }

    & > div {
      flex: 5;
      line-height: 0.45rem;
      overflow: hidden;
      white-space: nowrap;

      &:first-child {
        flex: 6;
      }

      .coin {
        font-size: 0.32rem;
      }
    }

    .aboutPrice {
      max-width: 3rem;
      display: flex;
      align-items: center;
    }

    .hiddenSpan {
      display: inline-block;
      max-width: 2.25rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .valuation {
      display: flex;
      align-items: center; /*垂直居中*/

      .coinImg {
        width: 0.6rem;
        margin-right: 0.2rem;
      }
    }

    .hidden {
      display: none;
      visibility: hidden;
    }

    .tip {
      font-size: 0.25rem;
      color: $color-999;
    }
  }

  .noData {
    margin: 0.5rem 0px;
    text-align: center;

    .noTip {
      font-size: 0.25rem;
      color: $color-666;
    }

    .imgNodata {
      height: 1.8rem;
      padding-top: 0.3rem;
      padding-bottom: 0.1rem;
    }

    .btn {
      width: 3.8rem;
      height: 0.8rem;
      font-size: 0.32rem;
      margin-top: 0.4rem;
      border-radius: 0.12rem;
      background: $color-blue;
      color: #fff;
    }
  }

  .wating {
    text-align: right;
    font-size: 0.21rem;
    margin-top: 0.21rem;
    padding-bottom: .21rem;
    color: $color-999;
    position: relative;

    & > span {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 0.0612rem;
        height: 0.0612rem;
        background: #c7c7c7;
        border-radius: 0.1rem;
        left: -0.13rem;
        top: 50%;
        transform: translate(0px, -50%);
      }
    }
  }
}
.dialogOperation {
  background: transparent !important;
  width: 100%;
}
.mortgageNDX {
  background: transparent !important;
  transform: translate3d(-50%, -55%, 0);
}

.tabBg{
  // background: linear-gradient(to right, rgba(68, 92, 241, 0.96), #3952c1);
  background-color: #fff;

  &.propertyPosition {
    position: fixed;
    width: 100%;
    max-width: 750px;
    top: 0rem;
    z-index: 100;
  }

  // margin-bottom: .09rem;
  .tab{
    background: rgba(255, 255, 255, .05);
    height: .8rem;
    display: flex;
    align-items: center;
    // color: rgba(255,255,255,0.50);
    // border-bottom: 1px solid #E1E1E1;
    color: #3A3949;
    font-size: .27rem;
    &.border{
      border-bottom: 1px solid #E1E1E1;
    }

    &>div{
      flex: 1;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      position: relative;

      &.actived{
        // color: #FFF;
        color: $color-this;
        font-weight: 400;
        position: relative;

        &::after{
          content: '';
          width: 1.4rem;
          border-bottom: .04rem solid $color-this;
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }
  }
}
</style>
