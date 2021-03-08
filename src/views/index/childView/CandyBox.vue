<template>
  <div class="candyBox">
    <!-- 糖果盒子 -->
    <mt-loadmore
      class="loadmore"
      :topPullText="$t('public.loadingMoreTip1')"
      :topDropText="$t('public.loadingMoreTip2')"
      :topLoadingText="$t('public.loadingMoreTip3')"
      :bottomPullText="''"
      :bottomDropText="''"
      :bottomLoadingText="''"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false"
      @bottom-status-change="handleBottomStatusChange"
      ref="loadmore"
    >
      <!-- 轮播图 start -->
      <div class="swiper">
        <div class="swiper-container swiper-container_candyBox">
          <div class="swiper-wrapper">
            <div v-if="!bannerList.length" class="swiper-slide slideItem">
              <img width="100%" v-if="$store.state.app.language === 'zh-CN'"
              src="https://nds.340wan.com/static/img/index/candyBox/banner.png" alt="">
              <img width="100%" v-if="$store.state.app.language === 'zh-TW'"
              src="https://nds.340wan.com/static/img/index/candyBox/banner-tw.png" alt="">
              <img width="100%" v-if="$store.state.app.language === 'en'"
              src="https://nds.340wan.com/static/img/index/candyBox/banner-en.png" alt="">
              <img width="100%" v-if="$store.state.app.language === 'ko'"
              src="https://nds.340wan.com/static/img/index/candyBox/banner-ko.png" alt="">
            </div>
            <template v-if="bannerList.length">
              <div class="swiper-slide slideItem" v-for="(item, $index) in bannerList" :key="$index">
              <img width="100%" :src="item.imageUrl" alt="">
            </div>
            </template>
          </div>
          <!-- 如果需要分页器 -->
          <div class="swiper-pagination swiper-pagination_candyBox"></div>
        </div>
      </div>
      <!-- 轮播图 end -->

      <!-- 用户抵押信息 & 全网抵押 start -->
      <div class="stakeInfo">
        <div class="account">
          <span class="accountName" @click="handleToLogin">
            <div class="iconBg" :class="{'notShowBg': $store.state.app.accountInfo
            && $store.state.app.accountInfo.chain !== 'eos'}">
              <vip-tip v-if="$store.state.app.accountInfo &&
                $store.state.app.accountInfo.account &&
                $store.state.app.accountInfo.chain === 'eos'" />
              <span v-else class="iconfont icon-huaban22 icon"></span>
            </div>
            <span>{{ $store.state.app.accountInfo && $store.state.app.accountInfo.account ?
              $store.state.app.accountInfo.account : '—' }}</span>
          </span>
          <!-- 抵押占比 -->
          <!-- <span class="stakeTop" @click="showHide = !showHide">
            <span>{{ $t('candyAirDrop.ratio') }}: {{ precent || '—' }}%</span>
            <span class="down" :class="{'rotate': showHide}"></span>
          </span> -->
          <!-- 权重占比 -->
          <span class="stakeTop" @click="showHide = !showHide">
            <span>{{ $t('candyAirDrop.airRatio') }}: {{ weightRatio || '—' }}%</span>
            <span class="down" :class="{'rotate': showHide}"></span>
          </span>
        </div>
        <!-- <div class="stakeDetail" v-if="showHide">
          <div>
            <div>{{ $t('candyAirDrop.mortgaged') }}</div>
            <div class="num">{{ userStaked || '—' }} NDX</div>
          </div>
          <div>
            <div>{{ $t('candyAirDrop.allMor') }}</div>
            <div class="num">{{ allStaked }}</div>
          </div>
          <div>
            <div style="visibility: hidden;">-</div>
            <div class="toStake" @click="handleMortgageNDX">{{ $t('candyAirDrop.quickMor') }}</div>
          </div>
        </div> -->
        <!-- 糖果规则 -->
        <div class="stakeDetail" v-if="showHide">
          <div>
            <span>{{ $t('candyAirDrop.weight') }}：</span>
            <span>{{ weight }}</span>
            <span class="rules" @click="showCandyRules = true">{{ $t('candyAirDrop.airRules') }} ></span>
          </div>
          <div class="toStake" @click="handleMortgageNDX">{{ $t('candyAirDrop.upLv') }}</div>
        </div>
      </div>
      <!-- 用户抵押信息 & 全网抵押 end -->

      <!-- 空投列表 start -->
      <div class="airPordList">
        <div class="noDataCurrent" v-if="!airList.length">
          <img src="https://nds.340wan.com/static/img/index/candyBox/current.png" alt="">
          <div class="tip">{{ $t('candyAirDrop.willUp') }}</div>
        </div>
        <div class="item colorList" v-for="(item, $index) in airList" :key="$index" @click="handleAirdropDetail(item, $index)">
          <div class="sort">
            {{ `${$t('candyAirDrop.sort1')}${item.period}${$t('candyAirDrop.sort2')}` }}
          </div>
          <div class="itemInfo">
            <div class="candyName">
              <!-- <img class="img" width="100%" src="https://ndi.340wan.com/eos/eosfuntoken1-fun.png"> -->
              <img class="img" width="100%" :src="item.imageUrl">
              <span class="coin">{{ item.code }}</span>
              <img class="hot" v-if="item.isHot" width="100%" src="https://nds.340wan.com/static/img/index/candyBox/hot.png" alt="">
            </div>
            <div class="status">
              <span>{{ $t('candyAirDrop.shortPhoto') }}</span>
                <span>{{ getUTCtime(item.snapshotTime) }}(UTC)</span>
              <!-- <div>已空投</div> -->
            </div>
          </div>
          <div class="itemContent">
            <div class="candyCount">
              <div class="title pfl1">{{ $t('candyAirDrop.airDropAmt') }} ({{ item.code }})</div>
              <div class="pfl1">{{ handleToFixed(item.airdropCount, item.coinDecimal) }}</div>
            </div>
            <div class="userGetCount">
              <div class="title">{{ $t('candyAirDrop.willGet') }} ({{ item.code }})</div>
              <div v-if="!$store.state.app.accountInfo || !$store.state.app.accountInfo.account">—</div>
              <div v-else>{{ handleToFixed(item.expectCount, item.coinDecimal) }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 空投列表 end -->

      <!-- 上架申请 start -->
      <div class="grounding" style="margin-top: .3rem;" @click="handleApply">
        {{ $t('candyAirDrop.applyCandy') }}
      </div>
      <!-- 上架申请 end -->

      <!-- 历史空投 start -->
      <div class="airPordHistory">
        <div class="subTools">
          <div class="title">
            <span class="borderLeft"></span>
            <span>{{ $t('candyAirDrop.hisAir') }}</span>
          </div>
          <div class="subtool" @click="handleShowGet">
            <span class="iconfont checkbox" :class="{'icon-huaban57': checkbox}"></span>
            <span>{{ $t('candyAirDrop.showGot') }}</span>
          </div>
        </div>
        <div class="airPordList">
          <div class="noData" v-if="!airedList.length">{{ $t('public.noData') }}</div>
          <div class="item colorList" v-for="(item, $index) in airedList" :key="$index" @click="handleAirdropDetail(item, $index)">
            <div class="sort">
              {{ `${$t('candyAirDrop.sort1')}${item.period}${$t('candyAirDrop.sort2')}` }}
            </div>
            <div class="itemInfo">
              <div class="candyName">
                <img class="img" width="100%" :src="item.imageUrl">
                <span class="coin">{{ item.code }}</span>
                <span class="get" v-if="item.expectCount">({{ $t('candyAirDrop.got') }})</span>
                <!-- <img class="hot" width="100%" src="https://nds.340wan.com/static/img/index/candyBox/hot.png" alt=""> -->
              </div>
              <div class="status"
              v-if="item && item.airdropTime && item.airdropTime.indexOf(' ') >= 0">
                <span>{{ $t('candyAirDrop.airTime') }}</span>
                <span>{{ item.airdropTime ? item.airdropTime.split(' ')[0] : '-'}}</span>
                <!-- <div>已空投</div> -->
              </div>
            </div>
            <div class="itemContent">
              <div class="candyCount">
                <div class="title pfl1">{{ $t('candyAirDrop.airDropAmt') }} ({{ item.code }})</div>
                <div class="pfl1">{{ handleToFixed(item.airdropCount, item.coinDecimal) }}</div>
              </div>
              <div class="userGetCount">
                <div class="title">{{ $t('candyAirDrop.gotLong') }} ({{ item.code }})</div>
                <div v-if="!$store.state.app.accountInfo || !$store.state.app.accountInfo.account">—</div>
                <div v-else>{{ handleToFixed(item.expectCount, item.coinDecimal) }}</div>
              </div>
            </div>
          </div>
          <div class="noData" v-if="!allLoaded">
            <div class="noTip color-999">
              <span v-if="showLoadMoreStatus === 'pull'">{{ $t('public.loadingMoreTip5') }}</span>
              <span v-if="showLoadMoreStatus === 'drop'">{{ $t('public.loadingMoreTip2') }}</span>
              <span v-if="showLoadMoreStatus === 'loading'">{{ $t('public.loadingMoreTip3') }}</span>
            </div>
          </div>
          <!-- 没有更多记录 -->
          <div class="noData" v-show="allLoaded && airedList.length">
            <div class="noTip color-999">{{ $t('public.noMore') }}</div>
          </div>
        </div>
      </div>
      <!-- 历史空投 end -->
    </mt-loadmore>

    <!-- 抵押赎回 start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="mortgageNDX">
      <MortgageNDX v-if="mortgageNDX" :isMortgageNDX="true" @listenClose="handleClose" />
    </mt-popup>
    <!-- 抵押赎回 end -->

    <!-- appToLogin start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="appToLogin">
      <PopupToLogin @listenClose="handleClose" />
    </mt-popup>
    <!-- appToLogin end -->

    <!-- dialog -->
    <mt-popup
      class="tipPopup"
      v-model="h5ToDapp"
      popup-transition="popup-fade">
      <to-app />
    </mt-popup>

    <!-- appToLogin start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="unabled">
      <PopupUnabled v-if="unabled" @listenClose="handleClose" />
    </mt-popup>
    <!-- appToLogin end -->

    <!-- 空投规则 start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="showCandyRules">
      <popup-candy-rules v-if="showCandyRules" @listenClose="handleClose" />
    </mt-popup>
    <!-- 空投规则 end -->
  </div>
</template>

<script>
import axios from 'axios';
import Swiper from 'swiper';
// import 'swiper/dist/css/swiper.css';
import { Popup, Loadmore } from 'mint-ui';
import Io from '@/utils/socket/index';
import { toFixed, GetUrlPara } from '@/utils/public';
import RequestApi from '@/utils/requestApi';
import { Decimal } from 'decimal.js';
import VipTip from '@/views/more/components/VipTip';
import MortgageNDX from '@/views/more/components/MortgageNDX';
import ToApp from '@/views/market/components/ToApp';
import PopupToLogin from '../components/PopupToLogin';
import PopupUnabled from '../components/PopupUnabled';
import PopupCandyRules from '../components/PopupCandyRules'
import moment from 'moment'

export default {
  data() {
    return {
      precent: '0.00',
      userStaked: '0',
      allStaked: '0',
      swiper: null,
      checkbox: false,
      airList: [], // 空投列表
      airedList: [], // 已空投列表
      mortgageNDX: false,
      showHide: false,
      channelRef: 'dapp',
      appToLogin: false,
      h5ToDapp: false,
      unabled: false,
      urlData: null,
      bannerList: [],
      listenerId: '',
      showCandyRules: false,
      weight: '',
      allLoaded: false,
      page: 1,
      showLoadMoreStatus: 'pull',
    }
  },
  components: {
    VipTip,
    MortgageNDX,
    PopupToLogin,
    ToApp,
    PopupUnabled,
    PopupCandyRules,
    mtPopup: Popup,
    mtLoadmore: Loadmore,
  },
  watch: {
    checkbox(newVal) {
      this.page = 1;
      this.handleHistoryAirdropList(newVal);
    },
    /* -------- 监听dapp账户变化 - 重置所有链接 start -------- */
    // '$store.state.app.accountInfo': function listen() {
    //   this.handleGetAccountInfo();
    // },
    /* -------- 监听dapp账户变化 - 重置所有链接 end -------- */
    // 监听 vipInfo 变化 - 重新计算获取全网抵押 & 抵押占比
    '$store.state.app.vipInfo': function listen(newVal) {
      this.userStaked = newVal.ndxStaked;
      this.handleAllNetStake();
    },
    '$store.state.app.vipInfo.weight': {
      handler: function listen(newVal) {
        this.handleWeight(newVal)
      },
      immediate: true
    }

  },
  computed: {
    weightRatio() {
      if (this.$store.state.app.vipInfo && this.$store.state.app.vipInfo.weightRatio) {
        const ratio = Decimal.mul(this.$store.state.app.vipInfo.weightRatio, 100).toString()
        return toFixed(ratio, 4)
      }
      return '0.0000';
    },
     getUTCtime(){
      // 传入北京时间，转成UTC时间
      return function(time){
        return moment.utc(time).subtract(8, 'hours').format("YYYY-MM-DD HH:mm")
      }
    }
  },
  mounted() {
    this.channelRef = localStorage.getItem('channelRef');
    this.urlData = GetUrlPara();
    this.userStaked = this.$store.state.app.vipInfo.ndxStaked || 0;

    if (this.urlData.source === 'android' || this.urlData.source === 'ios') {
      const data = window.action.getAccountInfo();
      this.handleGetWebAccount(JSON.parse(data))
      // alert(JSON.stringify(data))
    }

    this.handleCandyBannerList();
    this.handleCurrentAirdrop();
    this.handleHistoryAirdropList();
    this.handleAllNetStake();
  },
  methods: {
    handleBottomStatusChange(e) {
      this.showLoadMoreStatus = e;
    },
    // 上啦加载更多
    loadBottom() {
      this.page += 1;
      this.handleHistoryAirdropList(this.checkbox)
    },
    // 上拉加载更多 - 请求结束end
    handleTopage(list) {
      this.$refs.loadmore.onBottomLoaded();
      this.airedList.push(...list)
    },
    // 只显示已获得
    handleShowGet() {
      if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
        this.appToLogin = true;
        return;
      }
      this.checkbox = !this.checkbox;
    },
    // 监听糖果权重变化
    handleWeight(weight) {
      // const weight = this.$store.state.app.vipInfo.weight
      // eslint-disable-next-line eqeqeq
      if (weight == undefined) {
        this.weight = '-'
      } else {
        this.weight = weight
      }
    },
    // 监听账户订单状态
    handleOrderUpdata() {
      Io.addListenerOrder('start', (res) => {
        this.listenerId = res.listenerId;
        if (res.type === 'stakedsuccess') {
          this.handleCurrentAirdrop();
          this.handleHistoryAirdropList();
          this.handleAllNetStake();
        }
      });
    },
    // 显示去登录
    handleToLogin() {
      if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
        this.appToLogin = true;
      }
    },
    handleToShareImg() {
      const params = {
        type: 3,
        content: 'http://ndt.340wan.com/upload/20190424/91c46b0745ec4db39873317feb8608f6.png'
      }
      window.action.goToShare(JSON.stringify(params));
    },
    // 抵押
    handleMortgageNDX() {
      if (this.channelRef === 'h5') {
        if (this.urlData.source === 'android' || this.urlData.source === 'ios') {
          // alert(JSON.stringify(this.$store.state.app.accountInfo))
          if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
            this.appToLogin = true;
          } else {
            // 调用抵押控件
            // window.action.showNdxDialog(1);
            // window.action.goToVipCenter(this.$store.state.app.vipInfo.level)
            this.$router.push({
              name: 'vipDetail',
            })
          }
          return;
        }
        this.h5ToDapp = true;
        return;
      }
      // this.mortgageNDX = true;
      this.$router.push({ name: 'upgradeVip' })
    },
    // 获取web账户事件处理
    handleGetWebAccount(data) {
      const obj = {
        account: '',
        discountRate: 1,
        level: 0,
        maxLevel: 8,
        ndxStaked: 0,
        totalSaveAmount: 0,
        vipImageUrl: '',
        remainDrawCount: 0,
      };
      if (!data.account) {
        localStorage.setItem('token', '');
        this.$store.dispatch('setVipInfo', obj);
        const accountInfo = {
          account: '',
          chain: 'eos'
        }
        this.$store.dispatch('setAccountInfo', accountInfo);
        return;
      }
      localStorage.setItem('token', data.token || '');
      const accountInfo = {
        account: data.account,
        chain: data.chain
      }
      this.$store.dispatch('setAccountInfo', accountInfo);
      obj.account = data.account;
      this.$store.dispatch('setVipInfo', obj);
    },
    handleToFixed(n, l) {
      return toFixed(n, l);
    },
    // 启动swiper
    handleSwiperStart() {
      if (this.$route.name !== 'candyBox') {
        return;
      }
      // swiper
      this.swiper = new Swiper('.swiper-container_candyBox', { // eslint-disable-line
        loop: true,
        autoplay: 3000,
        pagination: '.swiper-pagination_candyBox',
        onClick: (swiper) => {
          const realIndex = swiper.realIndex;
          const eventUrl = this.bannerList[realIndex].eventUrl;
          this.handleToHref(eventUrl);
        }
      })
    },
    // 上架申请
    handleApply() {
      if (this.channelRef === 'h5') {
        if (this.urlData.source === 'android' || this.urlData.source === 'ios') {
          if (!this.$store.state.app.accountInfo || !this.$store.state.app.accountInfo.account) {
            this.appToLogin = true;
            return;
          }
          // 调用抵押控件
          if (this.$store.state.app.accountInfo.chain !== 'eos') {
            this.unabled = true;
            return;
          }
          const url = document.location.toString();
          const urlArr = url.split('?');
          if (!urlArr.length) {
            this.$router.push('/apply')
            return;
          }
          this.$router.push(`/apply?${urlArr[1]}`)
          return;
        }
        this.h5ToDapp = true;
        return;
      }
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        this.unabled = true;
        return;
      }
      this.$router.push({
        name: 'Apply'
      })
    },
    // 空投详情
    handleAirdropDetail(item, index) {
      const newItem = item;
      newItem.bgColorIndex = index;
      sessionStorage.setItem('AirdropDetail', JSON.stringify(newItem))

      if (this.urlData.source === 'android' || this.urlData.source === 'ios') {
        const url = document.location.toString();
        const urlArr = url.split('?');
        if (!urlArr.length) {
          this.$router.push('/airdrop-detail')
          return;
        }
        this.$router.push(`/airdrop-detail?${urlArr[1]}`)
        return;
      }
      this.$router.push({
        name: 'airdropDetail'
      })
    },
    // 关闭弹窗
    handleClose() {
      this.mortgageNDX = false;
      this.h5ToDapp = false;
      this.appToLogin = false;
      this.unabled = false;
      this.showCandyRules = false;
    },
    // 获取历史空投
    handleHistoryAirdropList(type) {
      const params = {
        currPage: this.page || 1,
        pageSize: 10,
        own: type ? 1 : 0
      }
      this.$http.get('/candy/historyAirdrop', { params }).then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.allLoaded = false;
        if (res.candyList.length < 10) {
          this.allLoaded = true;
        }
        if (this.page !== 1) {
          this.handleTopage(res.candyList)
          return;
        }
        this.airedList = res.candyList;
      });
    },
    // 获取当前空投
    handleCurrentAirdrop() {
      this.$http.get('/candy/currentAirdrop').then((res) => {
        if (res.code !== 0) {
          this.$toast({
            message: res.msg,
            position: 'center',
            duration: 2000,
          });
          return;
        }
        this.airList = res.candyList;
      });
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        }
        this.$http.post('/account/getAccountInfo', params).then((res) => {
          // this.weight = res.accountInfo.weight
          if (res.code === 1007) {
            const initVipInfo = this.$store.state.sys.initVipInfo;
            initVipInfo.account = this.$store.state.app.accountInfo.account;
            initVipInfo.chain = this.$store.state.app.accountInfo.chain;
            this.$store.dispatch('setVipInfo', initVipInfo);
            return;
          }
          if (res.code !== 0) {
            return;
          }
          this.$store.dispatch('setVipInfo', res.accountInfo);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 查询全网抵押数量
    handleAllNetStake() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stat',
          scope: 'NDX',
          json: true,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            this.allStaked = res.data.rows[0].total_staked;
            let rate = Decimal.div(Number(this.userStaked), Number(this.allStaked.split(' ')[0]));
            rate = Decimal.mul(rate, 100).toString();
            if (rate > 0.01) {
              this.precent = Number(rate).toFixed(4);
              return;
            }
            this.precent = Number(rate).toFixed(4);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleAllNetStake();
        }, 200);
      }
    },
    // 获取banner列表
    handleCandyBannerList() {
      const params = {
        type: 2
      }
      RequestApi.getCommonBannerList(params, (res) => {
        if (res.code !== 0) {
          return;
        }
        this.bannerList = res.data || [];
        // this.swiper.destroy(false); // 移除所有slide监听事件，所以拖动和click事件失效了。
        if (this.bannerList.length > 1) { // banner 少于2张不执行轮播
          // 延时调用swiper
          setTimeout(() => {
            this.handleSwiperStart(); // 重新渲染swiper
          }, 200);
        }
      })
    },
  },
  beforeDestroy() {
    Io.addListenerOrder({ // 停止监听订单信息
      way: 'stop',
      listenerId: this.listenerId
    });
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";
@import '../../../assets/css/swiper.min.css';

.candyBox{
  font-size: .32rem;
  height: 100vh;
  overflow: auto;
  // background: #FFF;

  /deep/ .mint-loadmore-bottom{
    font-size: .25rem;
  }

  .colorList{
    &:nth-child(4n-2) {
      background-image: linear-gradient(-95deg, #FABC4F 0%, #F76B1C 100%) !important;
    }

    &:nth-child(4n-1) {
      background-image: linear-gradient(90deg, #8007F9 0%, #A54CFF 100%) !important;
    }

    &:nth-child(4n) {
      background-image: linear-gradient(90deg, #FF0948 0%, #FF5D7F 100%) !important;
    }
  }

  // 账户信息
  .stakeInfo{
    padding: 0px .21rem;
    min-height: .94rem;
    background: #FFF;
    box-shadow: 0px 0px .08rem $color-input;

    .account{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: .94rem;

      .accountName{
        display: flex;
        align-items: center;
      }

      .stakeTop{
        font-size: .25rem;
        position: relative;
        padding-right: .25rem;

        .down{
          position: absolute;
          border: .095rem solid transparent;
          border-top: .11rem solid #000;
          right: 0px;
          top: 38%;

          &.rotate{
            transform: rotate(180deg);
            top: 5%;
          }
        }
      }

      .iconBg{
        border-radius: 50%;
        width: .45rem;
        height: .45rem;
        display: flex;
        align-items: center;/*垂直居中*/
        justify-content: center;/*水平居中*/
        margin-right: .05rem;

        &.notShowBg{ // 不显示会员时加上底色
          background: rgba(74,144,226,0.24);
          height: .45rem;

          .icon{
            font-size: .28rem;
          }
        }

        .icon{
          font-size: .32rem;
          color: $color-this;
        }
      }
    }
    .stakeDetail{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .21rem;
      padding-bottom: .16rem;

      .rules{
        margin-left: .3rem;
        color: $color-this;
      }

      .num{
        font-size: .3rem;
      }

      .toStake{
        color: $color-this;
      }
    }
  }

  // 轮播图
  .swiper{
    background: #FFF;

    .swiper-slide{
      height: 3.3rem;
      background: #FFF;
    }
  }

  // 如何获得空投
  .howToGet{
    position: relative;
    font-size: .25rem;
    margin: .21rem .21rem 0px .21rem;
    color: $color-999;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close{
      font-size: .17rem;
    }
  }

  // 空投列表
  .airPordList{
    padding: .0rem .1rem 0px .1rem;
    color: #FFF;

    .noData{
      color: $color-999;
      text-align: center;
      padding: .2rem 0px .5rem;
      font-size: .25rem;
    }

    .noDataCurrent{
      text-align: center;
      padding-top: 1rem;
      padding-bottom: .2rem;
      margin: auto;

      img{
        width: 3rem;
      }

      .tip{
        font-size: .25rem;
        color: $color-999;
      }
    }

    .item{
      // height: 2.06rem;
      background-image: linear-gradient(95deg, #426BFF 0%, #3D9EFF 100%);
      border-radius: .09rem;
      margin: .3rem 0px;
      padding-bottom: .3rem;
      padding-top: .3rem;
      position: relative;
      overflow: hidden;

      .sort{
        position: absolute;
        font-size: .1876rem;
        left: 0px;
        top: 0px;
        padding: 0px .17rem;
        min-width: .96rem;
        height: .4rem;
        background-image: linear-gradient(-89deg, #FF0948 0%, #FF5D7F 100%);
        // background-image: url('https://nds.340wan.com/static/img/index/candyBox/sort.png');
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
        border-radius: .06rem 0 .06rem 0;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, .2);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }

      .itemInfo,
      .itemContent{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px .24rem;

        &>div{
          flex: 4.7;
        }

        .title{
          font-size: .21rem;
          margin-bottom: .12rem;
        }

        .candyCount{
          flex: 5;

          &>div{
            padding-left: .1rem;
          }
        }
      }

      .itemInfo{
        height: .96rem;

        .candyName{
          flex: 5;
          display: flex;
          align-items: center;

          .img{
            display: inline-block;
            width: .42rem;

            background: #FFF;
            border-radius: 10rem;
          }

          .coin{
            margin: 0px .08rem;
          }

          .get{
            font-size: .21rem;
          }

          .hot{
            display: inline-block;
            width: .25rem;
          }
        }

        .status{
          font-size: .21rem;
        }
      }
    }
  }

  // 上架申请
  .grounding{
    margin: 0rem .1rem .3rem .1rem;
    background: #FFF;
    border: 0 solid $color-input;
    border-radius: .11rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    box-sizing: border-box;
    color: $color-this;
    font-size: .3rem;
  }

  // 历史空投
  .airPordHistory{
    .subTools{
      display: flex;
      justify-content: space-between;
      padding: 0px .1rem;

      .title{
        display: flex;
        align-items: center;

        .borderLeft{
          border: 2px solid $color-this;
          height: .28rem;
          margin-right: .12rem;
        }
      }

      .subtool{
        display: flex;
        align-items: center;
        font-size: .25rem;
        padding-right: .1rem;

        .checkbox{
          font-size: .3rem;
          margin-right: .08rem;
          margin-top: .02rem;
          color: $color-this;
          border: 1px solid $color-input;
          height: .3rem;
          width: .3rem;
          border-radius: .0417rem;
          background: #FFF;
        }

        .icon-huaban57{
          border: 0px solid $color-input;
        }
      }
    }
  }
}
.mortgageNDX{
  background: transparent !important;
}

.tipPopup{
  width: 80%;
  border-radius: .1rem;
  font-size: .32rem;
  color: $color-333;
  text-align: center;
}
</style>
