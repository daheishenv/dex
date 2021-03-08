<template>
  <div class="upgrade" @click.stop="selectTime = false">
    <!-- 切换抵押账户 -->
    <div class="tabList">
      <div class="tab" @click="type = 1">
        <span class="tabName" :class="{'actived': type === 1}">
          <span>{{ $t('vip.ownupdataVip') }}</span>
        </span>
      </div>
      <div class="tab" @click="type = 2">
        <span class="tabName" :class="{'actived': type === 2}">
          <span>{{ $t('vip.otherupdataVip') }}</span>
        </span>
      </div>
    </div>

    <div v-if="type === 1 || (type === 2 && hasAccount)">
      <!-- 账户信息 -->
      <div class="mainContent">
        <!-- 账户信息 -->
        <div class="item">
          <div class="title">
            <div>{{ $t('vip.account') }}</div>
            <div class="action" v-if="type === 2" @click="handleChangeAccount">{{ $t('vip.replace') }} ></div>
          </div>
          <div class="accountInfo">
            <div :class="`iconfont vip ${vipCoinClass()}`"></div>
            <span class="account">{{ vipInfo.account }}</span>
            <span class="chain">({{ vipInfo.chain ? vipInfo.chain.toUpperCase() : 'EOS' }})</span>
            <!-- 到期时间 -->
            <span class="date" v-if="func === 1 && vipInfo.toLocalDate && vipInfo.consumeLevel"
              >({{ $t('vip.expire',{time:vipInfo.toLocalDate}) }})</span>
          </div>
        </div>

        <!-- 升级方式 -->
        <div class="item">
          <div class="title">
            <div>{{ $t('vip.upgradeType') }}<span v-if="type === 1">:</span></div>
            <div class="vipType" v-if="type === 1">
              <div v-if="func === 1">{{ $t('vip.consumeNDX') }}</div>
              <div v-else>{{ $t('vip.mortgageNdx') }}</div>
            </div>
            <div class="action" @click="showPopupUpgrade = true" v-if="type === 1">{{ $t('vip.replace') }} ></div>
          </div>
          <div v-if="type === 2">
            <div class="upFunc">
              <div class="func" :class="{'funcActived': func === 1}" @click="func = 1">{{ $t('vip.consumeNDX') }}</div>
              <div class="func" :class="{'funcActived': func === 2}" @click="func = 2">{{ $t('vip.mortgageNdx') }}</div>
            </div>
          </div>
          <!-- <div>
            <div class="noChange" v-if="type === 2">{{ $t('vip.upgradeOther') }}</div>
          </div> -->
        </div>

        <!-- 当前消耗会员不是最高等级 -->
        <div class="maxLv" v-if="isMaxLv">
          {{ $t('vip.upgradeTop') }}
        </div>
        <div v-else>
          <!-- 选择等级 -->
          <div class="item">
            <div class="title">{{ $t('vip.selectUpgrade') }}</div>
            <div class="chooseLv">
              <div class="lists" ref="lvLists">
                <div class="list" :class="{'listActived': chooseLv === item.level, 'disabled': item.noChoose}"
                  @click="handleChooseLv(item)"
                  v-for="(item, $index) in vipList" :key="$index">
                  <div>
                    <div :class="`iconfont vip ${vipCoinClass(item.level)}`"></div>
                    <div class="status">
                      <span v-if="func === 1">{{ $t('vip.consume') }}</span>
                      <span v-else>{{ $t('vip.mortgage') }}</span>
                    </div>
                    <div class="num">
                      <span v-if="func === 2">{{ item.dealNdxStaked }}</span>
                      <span v-else>{{ item.dealNdxConsume}}</span>
                    </div>
                    <div class="perMonth">
                      <span>NDX</span><span v-if="func === 1">/{{ $t('vip.month') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 会员情况下 - 不足一个月提示 | 补差额提示 -->
            <div class="tipDiv" v-if="vipInfo.consumeLevel !== 0 && func === 1">
              <div class="lessMonth" v-if="lastDays < 30">{{ $t('vip.tipUpgrade') }}</div>
              <div class="pay" v-else>{{ $t('vip.payUpgrade') }}</div>
            </div>
            <!-- 抵押会员显示抵押数据 -->
            <div class="stakedInfoDiv" v-if="func === 2">
              <div class="stakedInfo" >
                <div>
                  <div>{{ $t('vip.allMor') }}</div>
                  <div>{{ handleToFixed(vipInfo.ndxStaked || 0, 4) || '0.0000' }} NDX</div>
                </div>
                <div v-if="type === 1">
                  <div>
                    <span>{{ $t('vip.selfShort') }}：</span>
                    <span>{{ stakedInfo.staked || '0.0000' }} NDX</span>
                  </div>
                  <div>
                    <span>{{ $t('vip.otherShort') }}：</span>
                    <span>{{ stakedInfo.otherStaked || '0.0000' }} NDX</span>
                  </div>
                </div>
                <div v-else>
                  <div>{{ $t('vip.otherMortgage') }}：</div>
                  <div>
                    <span>{{ stakedToThisAccount }} NDX</span>
                    <!-- <span class="back" @click="handleShowRefund">赎回＞</span> -->
                  </div>
                </div>
              </div>
              <div class="unstake"><span class="back" @click="handleShowRefund">{{ $t('vip.redeem') }} ></span></div>
            </div>
            <!-- <swiper-lv :func="func" :type="type" :vipInfo="vipInfo" :vipList="vipList" :lastDays="lastDays" /> -->
          </div>

          <!-- 选择有效期 - 续费页面使用 -->
          <div class="item" v-if="vipInfo.consumeLevel === 0 && func === 1">
            <div class="title">
              <div>{{ $t('vip.selectTime') }}</div>
              <div class="icon-box" :class="{iconTri:selectTime}" @click.stop="selectTime= !selectTime">
                 <i class="iconfont icon-huaban31 question"></i>
                <span v-show="selectTime" class="icon-text">{{ $t('vip.monthDay') }}</span>
              </div>
            </div>
            <div class="monthOutDiv">
              <div class="monthDiv" ref="monthLists">
                <div class="month" v-for="(item, index) in periodList" :key="index"
                  :class="{'monthActived': chooseMonth === item.period}"
                  @click="chooseMonth = item.period">
                  <span>{{ item.period }}{{ $t('vip.months') }}</span>
                  <span class="discount" v-if="item.discountRate < 1">{{ handleToDealRate(item.discountRate) }}{{ $t('vip.discount') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 余额 -->
          <div class="item balance">
            <div>
              <span>{{ $t('vip.myBalance') }}：</span>
              <span>{{ ableBalance }}</span>
            </div>
          </div>

          <!-- 选择等级大于当前等级 -->
          <div v-if="countDeal">
            <div>
              <div class="count" v-if="vipInfo.consumeLevel !== 0 || func === 2">
                <span v-if="func === 1">{{ $t('vip.consume') }}</span>
                <span v-else>{{ $t('vip.addMortgage') }}</span>
                <span class="prominent">{{ countNdx }} NDX，</span><span
                  >{{ $t('vip.upgradeTo') }}</span><span
                  class="prominent">VIP {{ chooseLv }}</span>
              </div>
              <div class="count" v-else>
                <div>
                  <span>{{ $t('vip.consume') }}</span>
                  <span class="prominent">{{ countNdx }} NDX</span>
                </div>
                <div>
                  <span>{{ $t('vip.upgradeTo') }}</span>
                  <span class="prominent">VIP {{ chooseLv }}</span>
                  <span>，{{ $t('vip.period') }}</span>
                  <span class="prominent">{{ chooseMonth }}{{ $t('vip.months') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 选择等级小于当前等级 -->
          <div v-else-if="vipInfo.level > chooseLv">
            <div class="count">
              <span>{{ $t('vip.redeem') }}</span>
              <span class="prominent">{{ countNdx }} NDX，</span><span
                >{{ $t('vip.reduceTo') }}</span><span
                class="prominent">VIP {{ chooseLv }}</span>
            </div>
          </div>
          <div class="btn" :class="{'disabled': !nowLv}" @click="handleSure">{{ $t('public.sure') }}</div>
          <div class="tip" v-if="func === 1">{{ $t('vip.consumeTip') }}</div>
          <div class="tip" v-else>*{{ $t('vip.mortgageTip') }}</div>
        </div>
      </div>
    </div>

    <!-- 输入其他账号 - 验证账户状态 -->
    <div v-if="type === 2 && !hasAccount">
      <reg-account :status="status" @listenGetAccount="handleGetAccount" />
    </div>

    <!-- 切换升级方式 start -->
    <mt-popup
      class="popup"
      v-model="showPopupUpgrade"
      popup-transition="popup-fade">
      <popup-upgrade v-if="showPopupUpgrade" :type="func - 1" :stakeNdx="stakedInfo.staked || '0.0000'"
        @listenClose="handleClose" @listenChangeFunc="handleChangeFunc"/>
    </mt-popup>
    <!-- 切换升级方式 end -->

    <!-- 显示不可赎回 start -->
    <mt-popup
      class="popup"
      v-model="showPopupNotUnstaked"
      popup-transition="popup-fade">
      <popup-not-unstaked v-if="showPopupNotUnstaked" :notChooseItem="notChooseItem" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 显示不可赎回 end -->

    <!-- 显示赎回弹窗 start -->
    <mt-popup
      class="popup"
      v-model="showPopupRefund"
      popup-transition="popup-fade">
      <MortgageNDX class="beforeFade" :class="{'fade': showPopupRefundTimer}"
        v-if="showPopupRefund" :isMortgageNDX="false" :controlTab="controlTab" @listenClose="handleClose"/>
    </mt-popup>
    <!-- 显示赎回弹窗 end -->
  </div>
</template>

<script>
import axios from 'axios';
import { Popup } from 'mint-ui';
import { Decimal } from 'decimal.js';
import { toFixed, toLocalTime } from '@/utils/public';
import { getStakedInfo, AppTransfer, AppActions, AppToNdxDialog } from '@/utils/publicApi';
import DApp from '@/utils/wallet';
import RequestApi from '@/utils/requestApi'
import RegAccount from '../components/RegAccount';
import PopupUpgrade from '../components/PopupUpgrade';
import PopupNotUnstaked from '../components/PopupNotUnstaked';
import MortgageNDX from '../components/MortgageNDX';

export default {
  name: 'upgradeVip',
  components: {
    RegAccount,
    PopupUpgrade,
    PopupNotUnstaked,
    MortgageNDX,
    mtPopup: Popup,
  },
  props: {
  },
  data() {
    return {
      status: 'upgrade', // 当前页面时升级 - upgrade | 续费 - renewal 页面
      type: 1, // 切换抵押账户 1 - 为自己 | 2 - 为他人
      func: 1, // 升级方式 1 - 消耗NDX | 2 - 抵押NDX
      chooseLv: 10, // 选择要升级到的等级
      lastDays: 0, // 小于一个月 - <30 | >=30 - 大于一个月
      chooseMonth: 0, // 选择月份
      countNdx: '0.0000', // 消耗 | 抵押的总数量
      vipInfo: {},
      anotherVipInfo: {}, // 另一个账户的会员信息
      vipList: [], // 会员等级列表
      allVipList: [], // 记录所有等级列表
      periodList: [], // 会员选择升级月份
      hasAccount: false, // 其他账户是否可以操作
      stakedInfo: {}, // 抵押信息
      stakedToOther: [], // 替他人抵押列表
      balanceTimer: null, // NDX余额定时器
      balance: '0.0000', // NDX余额
      ableBalance: '0.0000', // NDX可用余额
      notChooseItem: null, // 不可选中等级

      showPopupUpgrade: false, // 显示切换升级方式
      showPopupNotUnstaked: false, // 显示不可赎回
      showPopupRefund: false, // 显示赎回弹窗
      selectTime: false, // 显示选择有效期弹窗
      controlTab: 1, // 显示赎回弹窗的tab
      noChangeFunc: false, // 不改变func
      showPopupRefundTimer: false,
      vipInfoTimer: null, // 会员信息定时器
    }
  },
  mounted() {
    // 进来默认为自己账户操作 - 获取自己账户信息
    this.vipInfo = this.$store.state.app.vipInfo || {};
    this.handleMouted();
    this.handleGetVipList(); // 获取vip列表信息
    this.handleGetAccountStakedInfo(); // 获取账户抵押信息
    this.handleGetBalance(); // 获取账户可用余额
    // this.handleDealAbleStake(); // 获取账户抵押列表

    // 续费页面跳转带账户
    if (this.$route.params && this.$route.params.name) {
      this.type = 2;
      const otherVipInfo = JSON.parse(sessionStorage.getItem('otherVipInfo'));
      this.anotherVipInfo = otherVipInfo;
      this.hasAccount = true;
    }

    window.clearInterval(this.balanceTimer)
    this.balanceTimer = window.setInterval(() => {
      this.handleAfterSure();
    }, 5000);
  },
  beforeDestroy() {
    window.clearInterval(this.balanceTimer)
    window.clearTimeout(this.vipInfoTimer);
  },
  computed: {
    stakedToThisAccount() { // 为当前用户抵押信息
      const thisItem = this.stakedToOther.find(item => item.stakefor === this.vipInfo.account) || {};
      return thisItem.amount || '0.0000';
    },
    countDeal() { // 显示升级等级支付数据
      if (this.func === 1) { // 消耗
        if (this.vipInfo.consumeLevel < this.chooseLv) {
          return true;
        }
        return false;
      }
      // 抵押
      if (this.vipInfo.stakeLevel < this.chooseLv) {
        return true;
      }
      return false;
    },
    nowLv() { // 当前等级
      if (this.func === 2 && this.chooseLv === this.vipInfo.stakeLevel) {
        return false;
      }
      return true;
    },
    isMaxLv() {
      const reg1 = this.func === 1 && this.vipInfo.maxLevel === this.vipInfo.consumeLevel;
      if (this.type === 1) {
        return reg1
      }
      const reg2 = reg1 || (this.func === 2 && this.vipInfo.maxLevel === this.vipInfo.stakeLevel);
      return reg2;
    }
  },
  watch: {
    vipInfo() { // 会员等级发生改变
      this.handleMouted();
      this.handleGetVipListDeal();
    },
    chooseLv() {
      this.handlePayCount()
    },
    func() {
      this.handleGetVipListDeal();
      this.handlePayCount()
      this.handleDealAbleStake();
      const index = this.vipList.findIndex(item => item.noChoose === false)
      if (this.vipInfo.account && index !== -1) {
        this.chooseLv = index + 1;
      }
    },
    chooseMonth() {
      this.handlePayCount()
    },
    stakedInfo() {
      this.handleDealAllVipList()
    },
    allVipList() {
      this.handleDealAllVipList()
    },
    '$store.state.app.vipInfo': function vipInfo(newVal) {
      if (this.type === 2) { // 为其他账户 升级|消耗 时，vipInfo记录其他账户信息 - 直接return
        this.anotherVipInfo = newVal || {};
        return;
      }
      this.vipInfo = newVal || {};
    },
    type() {
      const tInfo = JSON.stringify(this.vipInfo);
      this.vipInfo = this.anotherVipInfo;
      this.anotherVipInfo = JSON.parse(tInfo);
      this.chooseLv = 0;
    },
    hasAccount(newVal) {
      if (newVal) {
        // 查询抵押列表
        this.handleGetStakedList();
      }
    },
    showPopupRefund(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.showPopupRefundTimer = true;
        }, 200);
        return;
      }
      this.showPopupRefundTimer = false;
      this.noChangeFunc = true;
      setTimeout(() => {
        this.handleGetVipInfo();
      }, 500);
    }
  },
  methods: {
    handleMouted() {
      if (this.noChangeFunc) { // 不改变当前func
        return;
      }
      this.chooseLv = this.vipInfo.level + 1 || 0; // 默认自己当前等级
      this.func = this.vipInfo.vipMode ? 2 : 1; // 获取账户当前升级方式 - 默认消耗
      if (this.type === 2 && this.vipInfo.level === 0) { // 替他人升级默认消耗模式
        this.func = 1;
      }
      this.noChangeFunc = false;
      this.handleLessDays(); // 获取会员到期剩余时间
      setTimeout(() => {
        this.handlePosThisLv();
      }, 200);
    },
    // 处理折扣
    handleToDealRate(rate) {
      const lang = this.$store.state.app.language;
      if (lang !== 'en' && lang !== 'ko') {
        const t = Decimal.mul(rate, 10).toString();
        return toFixed(t, 1);
      }
      let t = Decimal.sub(1, rate).toString();
      t = Decimal.mul(t, 100).toString();
      return t
    },
    // 定位当前等级
    handlePosThisLv() {
      const lv = this.$refs.lvLists;
      if (!lv) {
        return;
      }
      if (this.func === 1) {
        lv.scrollLeft = 0;
        return;
      }
      const index = this.vipList.findIndex(item => item.level === this.vipInfo.stakeLevel);
      // const index = 4;
      if (index < 3) {
        lv.scrollLeft = 0;
        return;
      }
      const rem = (screen.width * 100) / 750;
      const scroll = (index - 1) * 1.9 * rem;
      lv.scrollLeft = scroll;
    },
    // 定位当前默认选中月份
    handlePosThisMonth() {
      const monthLists = this.$refs.monthLists;
      if (!monthLists) {
        return;
      }
      if (this.func !== 1 || this.vipInfo.consumeLevel !== 0) {
        return;
      }
      const index = this.periodList.findIndex(item => item.isDefault === 1);
      if (index < 3) {
        monthLists.scrollLeft = 0;
        return;
      }
      const rem = (screen.width * 100) / 750;
      const scroll = (index - 2) * 2.3 * rem;
      monthLists.scrollLeft = scroll;
    },
    // 确认抵押 | 消耗 之后重新查询账户信息
    handleAfterSure() {
      this.handleGetBalance();
      this.handleGetAccountStakedInfo();
      this.handleGetStakedList();
      // this.handleGetVipInfo();
    },
    handleClose() {
      this.showPopupUpgrade = false;
      this.showPopupNotUnstaked = false;
      this.showPopupRefund = false;
    },
    handleChangeFunc(data) {
      if (data.name === 'changeFunc') {
        this.func = data.type + 1;
      }
    },
    handleToFixed(n, l) {
      return toFixed(n, l)
    },
    handleGetVipListDeal() {
      let list = [];
      list = this.allVipList.filter(item => item.level > 0);
      this.vipList = list;
      this.handleDealAllVipList();
    },
    // 获取会员列表
    handleGetVipList() {
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        // 获取到会员列表信息
        const ruleList = res.ruleList;
        ruleList.forEach((item) => {
          if (item.ndxStaked >= 1000) {
            let dealNdxStaked = Decimal.div(item.ndxStaked, 1000).toString();
            dealNdxStaked = toFixed(dealNdxStaked, 0);
            this.$set(item, 'dealNdxStaked', `${dealNdxStaked}K`)
          } else {
            this.$set(item, 'dealNdxStaked', item.ndxStaked)
          }
          if (item.ndxConsume >= 1000) {
            let dealNdxConsume = Decimal.div(item.ndxConsume, 1000).toString();
            dealNdxConsume = toFixed(dealNdxConsume, 0);
            this.$set(item, 'dealNdxConsume', `${dealNdxConsume}K`)
          } else {
            this.$set(item, 'dealNdxConsume', item.ndxConsume)
          }
        });
        this.allVipList = ruleList;
        this.handleGetVipListDeal();
        // 获取升级月份列表
        this.periodList = res.periodList || [];
        // const m = this.periodList.find(v => v.isDefault === 1)
        this.chooseMonth = 1
        // this.handlePayCount();
      })
    },
    // 获取等级样式
    vipCoinClass(item) {
      let index = this.vipInfo.consumeLevel;
      if (!item) {
        if (this.func === 2) {
          index = this.vipInfo.stakeLevel
        }
      } else {
        index = item;
      }
      const coinList = [
        'icon-v vip0',
        'icon-huaban74',
        'icon-huaban73',
        'icon-huaban72',
        'icon-huaban68',
        'icon-huaban71',
        'icon-huaban69',
        'icon-huaban66',
        'icon-huaban70',
        'icon-huaban67',
        'icon-huaban65',
      ]
      return coinList[index];
    },
    // 计算剩余时间
    handleLessDays() { // 小于一个月 - true | false - 大于一个月
      // if (this.func === 2) {
      //   return;
      // }
      // 获取当前日期
      const nowDate = new Date(); // 当前日期
      const now = new Date(nowDate).getTime();

      if (!this.vipInfo.expireTime) {
        this.vipInfo.toLocalDate = '';
        this.lastDays = 0;
        return;
      }
      const toLocalDate = toLocalTime(this.vipInfo.expireTime);
      const expireTime = toLocalDate.replace(/-/g, '/');
      const lastDate = new Date(expireTime).getTime()
      let days = (lastDate - now) / (1000 * 60 * 60 * 24);
      if (days < 0) {
        this.lastDays = 0;
        return;
      }
      // days = Math.ceil(Number(days))
      days = toFixed(days, 0);
      this.lastDays = days;
      this.vipInfo.toLocalDate = toLocalDate.substr(0, 10);
    },
    // 计算总消耗
    handlePayCount() {
      if (this.chooseLv === 0) {
        return;
      }
      if (!this.allVipList.length) {
        return;
      }
      if (this.chooseLv >= 10) {
        this.chooseLv = 10;
      }
      const list = this.allVipList.find(item => item.level === this.chooseLv); // 升级会员等级信息
      if (this.func === 1) { // 消耗
        // 当前是VIP的消耗升级
        const oldList = this.allVipList.find(item => item.level === this.vipInfo.consumeLevel); // 当前等级会员信息
        if (this.vipInfo.consumeLevel !== 0) {
          const days = this.lastDays;
          let count = 0;
          if (this.lastDays < 30) {
            // days < 30: 差额价格计算方式：升级后等级每个月消耗的NDX - （ 原等级每个月消耗的NDX / 30天 x 原有效期的剩余天数）
            const perPrice = Decimal.div((oldList.ndxConsume), 30).toString();
            const oldCount = Decimal.mul(perPrice, days).toString();
            count = Decimal.sub(list.ndxConsume, oldCount).toString();
          } else {
            // days >= 30: 消耗价格计算方式：（升级后等级的每个月消耗的NDX - 原等级的每个月消耗的NDX）/30天 x 有效期的剩余天数
            const perPrice = Decimal.div((list.ndxConsume - oldList.ndxConsume), 30).toString();
            count = Decimal.mul(perPrice, days).toString()
          }
          count = Decimal.mul(count, 10000).toString();
          count = Math.ceil(Number(count))
          count = Decimal.div(count, 10000).toString();
          count = toFixed(count, 4);
          this.countNdx = count;
          return;
        }
        // 当前非会员消耗升级
        const period = this.periodList.find(v => v.period === this.chooseMonth);
        let rate = 1;
        if (period) {
          rate = period.discountRate;
        }
        let count = Decimal.mul(list.ndxConsume, this.chooseMonth).toString();
        count = Decimal.mul(count, rate).toString();
        count = Decimal.mul(count, 10000).toString();
        count = Math.ceil(Number(count))
        count = Decimal.div(count, 10000).toString();
        count = toFixed(count, 4);
        this.countNdx = count;
        return;
      }
      // 抵押
      let count = Decimal.sub(list.ndxStaked, this.vipInfo.ndxStaked).toString();
      if (count < 0) { // 赎回
        count *= -1;
      }
      count = toFixed(count, 4)
      this.countNdx = count;
    },
    // 计算总消耗 | 总抵押
    async handleSure() {
      // 判断是否执行下去
      if (!this.handleRegSure()) {
        return;
      }
      if (this.func === 1) { // 消耗
        const obj = {
          quantity: `${this.countNdx} NDX`,
          memo: `${this.chooseLv}-${this.chooseMonth}-${this.vipInfo.account}`,
        }
        if (this.vipInfo.consumeLevel !== 0) {
          obj.memo = `${this.chooseLv}-1-${this.vipInfo.account}`
        }
        // if (this.type === 1) {
        //   params.choosemode = 0;
        // }
        // 是否是APP打开？
        if (this.$store.state.sys.isAppView) {
          obj.to = 'newdexstaked'; // 接收账户
          obj.contract = 'newdexissuer'; // 转账币种合约
          obj.amount = obj.quantity; // zhuan
          obj.precision = 4; // 币种精度
          obj.coinName = 'NDX'; // 币种名称
          delete obj.quantity;
          AppTransfer(obj)
          return;
        }
        // 合约执行
        const fromName = this.$store.state.app.accountInfo.account;
        const permission = this.$store.state.app.accountInfo.permissions;
        const params = {
          actions: [{ // 切换会员升级状态
            account: 'newdexissuer',
            name: 'transfer',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              from: fromName,
              to: 'newdexstaked',
              quantity: obj.quantity,
              memo: obj.memo, // 1-3-testa2b12345
            },
          }]
        }
        if (obj.choosemode === 0) {
          const chooseActions = { // 选择消耗方式
            account: 'newdexstaked',
            name: 'choosemode',
            authorization: [{
              actor: fromName,
              permission,
            }],
            data: {
              owner: fromName,
              is_staked: false, // 抵押 - 1 | 0 - 消耗
            },
          }
          params.actions.push(chooseActions)
        }
        const transferParams = {
          params,
          useFreeCpu: false
        }
        const result = await DApp.transactionApi(transferParams);
        if (result && result.code !== 0) {
          DApp.handleScatterErrorBack(result, (type, text) => {
            type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
          });
          return;
        }
        this.$toast({
          message: this.$t('vip.upSuccess'),
          position: 'center',
          duration: 2000,
        });
        this.handleAfterSure()
        this.handleGetVipInfo('loop');
        // DApp.consumption(params, (err, res) => {
        //   if (err) {
        //     this.$toast(this.$t('vip.upFail'));
        //     return;
        //   }
        //   if (res) {
        //     this.$toast({
        //       message: this.$t('vip.upSuccess'),
        //       position: 'center',
        //       duration: 2000,
        //     });
        //   }
        //   this.handleAfterSure()
        //   this.handleGetVipInfo('loop');
        // })
        return;
      }
      // 抵押
      this.handleStake();
    },
    // 抵押赎回操作
    async handleStake() {
      const obj = {
        name: 'stake',
        quantity: `${this.countNdx} NDX`,
        blockchain: 'eos',
        stakefor: this.vipInfo.account
      }
      if (this.chooseLv < this.vipInfo.stakeLevel) {
        obj.name = 'unstake'
      }
      // 是否是APP打开？
      if (this.$store.state.sys.isAppView) {
        const newParams = {
          name: obj.name,
          account: 'newdexstaked',
          data: {
            blockchain: 'eos',
            owner: this.$store.state.app.accountInfo.account,
            quantity: obj.quantity,
            stakefor: obj.stakefor,
          }
        }
        AppActions([newParams])
        return;
      }
      // 合约执行
      const fromName = this.$store.state.app.accountInfo.account;
      const permission = this.$store.state.app.accountInfo.permissions;
      const params = {
        actions: [
          {
            account: 'newdexstaked', // 抵押账户
            name: obj.name || 'stake', // stake - 抵押 | unstake - 赎回
            authorization: [{
              actor: fromName, // 转账者
              permission, // 权限 active | owner
            }],
            data: {
              owner: fromName, // 转账者 - 'testtesttest'
              quantity: obj.quantity, // 数量 - '1.0000 NDX'
              blockchain: obj.blockchain, // 抵押账户所属链
              stakefor: obj.stakefor, // 抵押账户
            }
          }
        ]
      };
      const transferParams = {
        params,
        useFreeCpu: false
      }
      const result = await DApp.transactionApi(transferParams);
      if (result && result.code !== 0) {
        // DApp.handleScatterErrorBack(result, (type, text) => {
        //   type === 'lang' ? this.$toast(this.$t(text)) : this.$toast(text);
        // });
        this.$toast(this.$t('vip.mortgageError'));
        return;
      }
      this.$toast({
        message: this.$t('vip.mortgageSuccess'),
        position: 'center',
        duration: 2000,
      });
      this.handleAfterSure()
      this.handleGetVipInfo('loop');
      // DApp.newdexStaked(params, (err, res) => {
      //   this.toast = true;
      //   if (err) {
      //     this.$toast(this.$t('vip.mortgageError'));
      //     return;
      //   }
      //   if (res) {
      //     this.$toast({
      //       message: this.$t('vip.mortgageSuccess'),
      //       position: 'center',
      //       duration: 2000,
      //     });
      //   }
      //   this.handleAfterSure()
      //   this.handleGetVipInfo('loop');
      // })
    },
    // 获取账户会员信息
    handleGetVipInfo(loop) {
      window.clearTimeout(this.vipInfoTimer);
      const params = {
        account: this.vipInfo.account,
      }
      RequestApi.accountInfo(params, (res) => {
      // this.$http.post('/account/getAccountInfo', params).then((res) => {
        if (res.code !== 0) {
          return;
        }
        if (loop) {
          if (this.func === 1 && this.vipInfo.consumeLevel === res.accountInfo.consumeLevel) {
            this.vipInfoTimer = window.setTimeout(() => {
              this.handleGetVipInfo('loop');
            }, 500);
            return;
          }
          if (this.func === 2 && this.vipInfo.stakeLevel === res.accountInfo.stakeLevel) {
            this.vipInfoTimer = window.setTimeout(() => {
              this.handleGetVipInfo('loop');
            }, 500);
            return;
          }
        }
        this.vipInfo = res.accountInfo;
      });
    },
    // 获取到其他账户信息
    handleGetAccount(data) {
      this.vipInfo = data;
      this.hasAccount = true;
    },
    // 获取账户抵押信息
    handleGetAccountStakedInfo() {
      getStakedInfo((err, res) => {
        if (err) {
          return;
        }
        this.stakedInfo = res;
        // 判断他人替自己抵押数量 - 配置选择等级不可选中
        this.handleDealAllVipList();
      })
    },
    // 处理不可选中会员等级
    handleDealAllVipList() {
      // 升级账户和登录账户不同 - 不计算他人抵押等级
      // if (this.vipInfo.account !== this.$store.state.app.accountInfo.account) {
      //   return;
      // }
      // 没有会员等级列表 - 直接return
      if (!this.vipList.length) {
        return;
      }
      // 消耗
      if (this.func === 1 || this.type === 2) {
        let lists = JSON.stringify(this.vipList);
        lists = JSON.parse(lists);
        lists.forEach((item) => {
          const lv = this.func === 1 ? this.vipInfo.consumeLevel : this.vipInfo.stakeLevel;
          if (item.level <= lv) {
            this.$set(item, 'noChoose', true);
            return;
          }
          this.$set(item, 'noChoose', false);
        });
        this.vipList = lists;
        return;
      }
      // 为自己抵押升级
      // 没有他人抵押 - 直接return
      if (!this.stakedInfo.otherStaked) {
        return;
      }
      let lists = JSON.stringify(this.vipList);
      lists = JSON.parse(lists);
      lists.forEach((item) => {
        if (this.func === 2 && item.ndxStaked <= Number(this.stakedInfo.otherStaked)) {
          this.$set(item, 'noChoose', true);
          this.notChooseItem = item;
        } else {
          this.$set(item, 'noChoose', false);
        }
      });
      this.vipList = lists;
    },
    // 获取账户余额
    async handleGetBalance() {
      try {
        // window.clearTimeout(this.balanceTimer);
        const params = {
          code: 'newdexissuer',
          symbol: 'NDX',
          account: this.$store.state.app.accountInfo.account
        }
        const balance = await DApp.getBalance(params);
        if (balance || balance === 0) {
          this.balance = balance;
          this.handleDealAbleStake();
        } else {
          this.balance = `0.0000 ${params.coin}`;
        }
        // DApp.getCurrencyBalance(params, (err, data) => {
        //   if (err) {
        //     return;
        //   }
        //   this.balance = data;
        //   this.handleDealAbleStake();
        // });
      } catch (error) {
        setTimeout(() => {
          this.handleGetBalance();
        }, 200);
      }
    },
    // 可用余额处理
    handleDealAbleStake() {
      const balance = this.balance.split(' ')[0];
      let ableBalance = Decimal.sub(balance, this.stakedInfo.selfStakedAll || 0).toString();
      if (this.func === 1) {
        ableBalance = Decimal.sub(ableBalance, this.stakedInfo.unstakeing || 0).toString();
      }
      if (Number(ableBalance) < 0) {
        this.ableBalance = '0.0000 NDX';
        return;
      }
      this.ableBalance = `${toFixed(ableBalance, 4)} NDX`;
    },
    // 选择等级
    handleChooseLv(item) {
      // 消耗 & 替他人抵押升级时，点击不可选中等级
      if ((this.func === 1 || this.type === 2) && item.noChoose) {
        // console.log('消耗 || 替他人抵押升级时，点击不可选中等级')
        return;
      }
      if (item.noChoose) {
        // 显示弹窗
        this.showPopupNotUnstaked = true;
        return;
      }
      this.chooseLv = item.level;
    },
    // 更换账户
    handleChangeAccount() {
      this.hasAccount = false;
      // this.vipInfo = this.otherVipInfo;
    },
    // 赎回
    handleShowRefund() {
      if (this.$store.state.sys.isAppView) {
        AppToNdxDialog(2)
        return;
      }
      // this.controlTab = 1;
      // if (this.type === 2) {
      //   this.controlTab = 3;
      // }
      // this.showPopupRefund = true;
      this.$router.push({
        name: 'stakeNdx',
        params: {
          type: 'unstake'
        }
      })
    },
    // 查询抵押列表
    handleGetStakedList() {
      try {
        const params = {
          code: 'newdexstaked',
          table: 'stake2others',
          scope: this.$store.state.app.accountInfo.encodeName,
          json: true,
          limit: 1000,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            const list = res.data.rows;
            list.forEach((item) => {
              const amount = toFixed(Decimal.div(item.amount, 10000), 4);
              this.$set(item, 'amount', amount);
              this.$set(item, 'showTool', false);
            });
            this.stakedToOther = list;
            return;
          }
          this.stakedToOther = [];
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetStakedList();
        }, 200);
      }
    },
    // 确认验证
    handleRegSure() {
      if (this.func === 1) { // 消耗
        if (this.chooseLv <= this.vipInfo.consumeLevel) {
          this.$toast(this.$t('vip.chooseLv'))
          return false;
        }
      } else if (this.type === 2) {
        if (this.chooseLv <= this.vipInfo.stakeLevel) {
          this.$toast(this.$t('vip.chooseLv'))
          return false;
        }
      } else if (this.chooseLv <= 0) {
        // if (this.chooseLv <= 0) {
        this.$toast(this.$t('vip.chooseLv'))
        return false;
        // }
      }
      if (!this.nowLv) {
        return false;
      }
      if (Number(this.countNdx) > Number(this.ableBalance.split(' ')[0])) {
        if (this.func === 2 && this.chooseLv < this.vipInfo.stakeLevel) { // 赎回情况下 - 不验证余额
          return true;
        }
        this.$toast(this.$t('quotation.low'))
        return false;
      }
      return true;
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/public.scss";

.prominent{
  color: #f6af39;
}
.vip{
  color: #F6C85C !important;
  font-size: .41rem;

  &.vip0{
    color: $color-999 !important;
  }
}

.upgrade{
  font-size: .24rem;
  background: #FFF;

  .tabList{
    display: flex;
    align-items: center;
    height: .94rem;
    background: #FFF;
    padding: 0 .1rem;
    border-bottom: .1rem solid #fafafa;
    &>div{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      color: $color-999;
      font-size: .27rem;

      &:last-child::before{
        content: '';
        position: absolute;
        border-left: 1px solid $color-input;
        left: 0px;
        height: .27rem;;
      }
    }
    .tabName{
      height: .7rem;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      &.actived{
        color: #8B572A;
      }
    }
  }

  .maxLv{
    text-align: center;
    margin-top: .56rem;
    font-size: .25rem;
    color: #F5A623;
  }

  .mainContent{
    padding: .24rem .36rem .5rem;

    .item{
      margin-bottom: .3rem;
    }

    .title{
      margin-bottom: .3rem;
      font-size: .27rem;
      display: flex;
      align-items: center;

      .vipType{
        margin-left: .2rem;
      }

      .action{
        margin-left: .18rem;
        font-size: .24rem;
        color: #8B572A;
      }
      .icon-box{
        position: relative;
        .icon-text{
          position: absolute;
          white-space: nowrap;
          width:auto;
          font-size: 0.24rem;
          color: #3A3949;
          text-align: center;
          height: 0.5rem;
          line-height: 0.5rem;
          z-index: 10;
          top: 0.44rem;
          right: 50%;
          transform: translateX(50%);
          padding: 0 .27rem;
          background: #F3F3F3;
          border-radius: 0.0369rem;
        }
      }
      .iconTri{
        &::after{
          content: '';
          border: .1rem solid #F3F3F3;
          position: absolute;
          top: 0.4rem;
          right: 0.05rem;
          box-shadow: 0px 0px .07rem rgba(74, 144, 226, .31);
          transform: rotate(45deg);
        }
      }
      .question{
        font-size: .27rem;
        color: $color-999;
        margin-left: .12rem;
      }
    }
    .tipDiv{
      margin-top: .24rem;

      .lessMonth{
        color: #F5A623;
      }
      .pay{
        color: $color-999;
      }
    }
    .stakedInfoDiv{
      background: rgba(242,219,164,0.20);
      border-radius: .08rem;

      .unstake{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 .24rem .2rem;

        .back{
          color: #8B572A;
          font-size: .21rem;
        }
      }
    }
    .stakedInfo{
      display: flex;
      align-items: center;
      // justify-content: space-between;
      margin-top: .24rem;
      // background: rgba(242,219,164,0.20);
      border-radius: .08rem;
      // height: 1.3rem;
      padding: .2rem .24rem;
      font-size: .21rem;

      &>div{
        color: $color-999;
        flex: 1;

        &:last-child{
          padding-left: .5rem;
        }
        &>div{
          margin-bottom: .12rem;
          &:last-child{
            margin-bottom: 0rem;
          }
        }
      }
      .back{
        color: #8B572A;
        margin-left: .14rem;
      }
    }
  }

  .accountInfo{
    display: flex;
    align-items: center;
    .account{
      font-size: .32rem;
      margin: 0 .08rem;
    }
    .chain{
      font-size: .21rem;
    }
    .date{
      margin-left: .25rem;
      font-size: .21rem;
      color: $color-999;
    }
  }

  .upFunc{
    display: flex;

    .func{
      background: #FFF;
      border: 1px solid $color-input;
      border-radius: .1rem;
      height: .74rem;
      width: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: .09rem;
      color: $color-999;

      &.funcActived{
        background: rgba(242,219,164,0.40);
        border: 1px solid #FFC78A;
        color: #F5A623;
      }
    }
  }
  .noChange{
    margin-top: .2rem;
    color: $color-999;
  }

  .chooseLv{
    height: 2.35rem;
    overflow: hidden;

    .lists{
      padding-bottom: .2rem;
      display: flex;
      overflow: auto;

      .list{
        max-width: 1.75rem;
        min-width: 1.75rem;
        height: 2.25rem;
        border: 1px solid $color-input;
        border-radius: .0816rem;
        margin-left: .15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        &.listActived{
          border: 1px solid #F5A623;
          background: rgba(242,219,164,0.37) !important;
        }

        &.disabled{
          background: rgba(0,0,0,0.06);
        }

        &:first-child{
          margin-left: 0rem;
        }
        .num{
          font-size: .32rem;
          color: #8B572A;
        }
        .perMonth,
        .status{
          margin: .12rem 0;
          font-size: .21rem;
          color: $color-999;
        }
      }
    }
  }

  .monthOutDiv{
    height: .85rem;
    overflow: hidden;
  }
  .monthDiv{
    display: flex;
    align-items: center;
    // justify-content: space-between;
    overflow: auto;
    padding-bottom: .2rem;

    .month{
      flex: 1;
      min-width: 1.8rem;
      max-width: 1.8rem;
      height: .72rem;
      margin-right: .2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $color-input;
      border-radius: .1rem;
      color: $color-999;
      position: relative;
      overflow: hidden;

      &.monthActived{
        background: rgba(242,219,164,0.40);
        border: 1px solid #FFC78A;
        color: #8B572A;
      }

      .discount{
        position: absolute;
        right: 0px;
        top: 0px;
        height: .27rem;
        // width: .56rem;
        font-size: .15rem;
        background: $color-red;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: .08rem;
        color: #FFF;
        padding: 0 .1rem;
      }
    }
  }
  .balance{
    // margin-top: -.24rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .back{
      color: #8B572A;
    }
  }

  .count{
    text-align: center;
    font-size: .27rem;
    margin-top: 0.6rem;
  }
  .btn{
    background: #F6C85C;
    // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
    border-radius: .1042rem;
    height: .84rem;
    color: #8B572A;
    font-size: .32rem;
    margin-top: .25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &.disabled{
      background: $color-999;
      color: #fff;
    }
  }
  .tip{
    margin-top: .3rem;
    color: $color-999;
    text-align: center;
  }

}

.popup{
  background: transparent;

  .beforeFade{
    opacity: 0;
  }

  .fade{
    opacity: 1;
  }
}
</style>
