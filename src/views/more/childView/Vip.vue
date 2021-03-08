<template>
  <div class="vipDetailPage">
    <div class="more">
      <!-- 等级 -->
      <div class="lvDiv">
        <div>{{ $t('vip.vipTip') }}</div>
      </div>
      <!-- 账户详情 -->
      <div class="accountVipDetail">
        <!-- 抵押NDX升级方式 -->
        <div class="mortgage">
          <div class="mortgage-title" v-if="vipInfo.vipMode === 0">{{ $t('vip.consumeNDX') }}</div>
          <div class="mortgage-title" v-else-if="vipInfo.vipMode === 1">{{ $t('vip.mortgageNdx') }}</div>
          <div>
            <span>{{ $t('vip.upgradeType') }}</span>
            <span class="Redeem" @click="isUpgrade = true">{{ $t('vip.replace') }}</span>
          </div>
        </div>
        <!-- 会员到期============ -->
        <div class="mortgage" v-if="vipInfo.vipMode === 0">
          <div class="mortgage-title" v-if="vipInfo.level !== 0">{{handleTime(vipInfo.expireTime)}}</div>
          <div class="mortgage-title" v-else>-</div>
          <div>
            <span>{{ $t('vip.vipExpire') }}</span>
          </div>
        </div>
        <div class="mortgage" v-else-if="vipInfo.vipMode === 1">
            <div class="mortgage-title" v-if="Number(accountTotalStakeNdx) < 100000">
              {{ toFixed(Number(accountTotalStakeNdx), 4) || 0.0000 }} NDX</div>
            <div class="mortgage-title" v-if="Number(accountTotalStakeNdx) >= 100000">
              {{ toFixed(handleToK(Number(accountTotalStakeNdx), 1000), 2) || 0.0000 }}K NDX</div>
            <div>
              <span v-if="$store.state.app.language !== 'en' && $store.state.app.language !== 'ko'">NDX{{ $t('vip.mortgageNum') }}</span>
              <span v-else>{{ $t('vip.mortgageNum') }} NDX</span>
              <span class="Redeem" @click="handleShowMor">{{ $t('vip.redeem') }}</span>
            </div>
        </div>
      </div>
      <div @click="isUpgrade = true" class="more-desc" v-if="vipInfo.consumeLevel<vipInfo.stakeLevel && vipInfo.vipMode === 0">
        {{ $t('vip.replaceTip',{num:vipInfo.stakeLevel}) }}</div>
      <div @click="isUpgrade = true" class="more-desc" v-if="vipInfo.consumeLevel>vipInfo.stakeLevel && vipInfo.vipMode === 1">
        {{ $t('vip.replaceTip2',{num:vipInfo.consumeLevel}) }}</div>
    </div>

    <!-- 等级说明 start -->
    <div class="vipLV">
      <!-- <div class="title">{{ $t('vip.lvDetail') }}</div> -->
      <div class="scrollOutDiv">
        <div class="lvScroll" ref="lvScroll">
          <div v-for="(item, $index) in lvList" :key="$index" @click="handleActive($index)">
            <div class="lv" :class="{'active thisLv': vipLVScroll === $index}">
              <span>{{ $index }}</span>
            </div>
            <div class="needNDX" v-if="$index === 0">{{ $t('vip.notVip') }}</div>
            <div class="needNDX" v-if="$index !== 0">VIP{{ $index }}</div>
            <div class="charge color-999" v-if="vipLv === $index">{{ $t('vip.myLv') }}</div>
          </div>
        </div>
      </div>

      <!-- 升级条件 start -->
      <div class="title">{{ $t('vip.vipCondition') }}</div>
      <div class="tableUpVip">
        <!-- 会员说明标题 -->
        <div class="upVip">
                <!-- <div style="border: 0px;" v-if="activeLvInfo.level === 0">＜{{ lvList[1].ndxStaked }} NDX</div>
          <div style="border: 0px;" v-if="activeLvInfo.level !== 0">≥{{ activeLvInfo.ndxStaked }} NDX</div> -->
          <div>{{ $t('vip.vipMode') }}</div>
          <div> {{ activeLvInfo.ndxConsume }} NDX/{{ $t('vip.month') }} </div>
        </div>
        <div class="upVip">
          <div>{{ $t('vip.vipMode2') }}</div>
          <div v-if="activeLvInfo.level !== 0"> ≥{{ activeLvInfo.ndxStaked / 1000 }} K NDX</div>
          <div v-else>&lt;10 K NDX</div>
        </div>
      </div>
      <div class="tableDesc">{{ $t('vip.vipModeTip') }}</div>

      <!-- 开通条件 end -->

      <!-- 会员说明表格 -->
      <div class="title">{{ $t('vip.vipPrivileges') }}</div>
      <div class="tableDiv">
        <!-- 会员说明标题 -->
        <!-- <div class="tableTitle">
          <div>{{ $t('vip.vipInterests') }}</div>
          <div>{{ $t('vip.interestsShow') }}</div>
          <div>{{ $t('vip.enjoy') }}</div>
        </div>-->
        <!-- 手续费优惠 -->
        <div class="tableContent">
          <div>{{ $t('vip.charge') }}</div>
          <div>
            <div>
              <span v-if="$store.state.app.language === 'zh-CN' && activeLvInfo.level === 0">无</span>
              <span
                v-if="$store.state.app.language === 'zh-CN' && activeLvInfo.level !== 0"
              >{{ handleGetCharge(activeLvInfo.discountRate || 1, 10) }}折</span>
              <span
                v-if="$store.state.app.language !== 'zh-CN'"
              >{{ handleGetChargeEn(activeLvInfo.discountRate, 100) }}% off</span>
            </div>
          </div>
          <div>
            <span>—</span>
            <!-- <span v-if="activeLvInfo.dealRemind" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>-->
          </div>
        </div>
        <!-- 领取BOX -->
        <div class="tableContent" v-if="false">
          <div @click="handleReceiveBox">
            {{ $t('db.db1') }}>
          </div>
          <div>
            <span>{{ $t('db.db10') }}</span>
          </div>
          <div>
            <span v-if="$store.state.app.accountInfo.chain !== 'eos'">—</span>
            <span v-else>
              <span v-if="activeLvInfo.drawCount" class="iconfont icon-huaban77"></span>
              <span v-else class="iconfont icon-huaban82"></span>
            </span>
          </div>
        </div>
        <!-- 每日抽奖 -->
        <div class="tableContent">
          <div @click="handleToDraw">
            {{ $t('luckDraw.dailyLuckyDraw') }}>
            <span
              v-if="$store.state.app.accountInfo.chain === 'eos'"
            ></span>
          </div>
          <div>
            <span v-if="activeLvInfo.level === 0">{{ $t('luckDraw.VipExclusive') }}</span>
            <span
              v-if="activeLvInfo.level !== 0"
            >{{ $t('luckDraw.times1') }}{{ activeLvInfo.level }}{{ $t('luckDraw.times2') }}</span>
          </div>
          <div>
            <span v-if="$store.state.app.accountInfo.chain !== 'eos'">—</span>
            <span v-else>
              <span v-if="activeLvInfo.drawCount" class="iconfont icon-huaban77"></span>
              <span v-else class="iconfont icon-huaban82"></span>
            </span>
          </div>
        </div>
        <!-- 专属空投 -->
        <div class="tableContent">
          <div @click="handleToCandyBox">
            {{ $t('vip.airdrop') }}>
            <span v-if="$store.state.app.accountInfo.chain === 'eos'"></span>
          </div>
          <div>{{ $t('vip.airdropTip', {weight: activeLvInfo.weight || 0}) }}</div>
          <div>
            <span v-if="$store.state.app.accountInfo.chain !== 'eos'">—</span>
            <span v-else>
              <span v-if="activeLvInfo.specialAirdrop" class="iconfont icon-huaban77"></span>
              <span v-else class="iconfont icon-huaban82"></span>
            </span>
          </div>
        </div>
        <!-- 免CPU下单 -->
        <div class="tableContent">
          <div>
            {{ $t('trade.freeCpuTitle') }}
            <span v-if="$store.state.app.accountInfo.chain === 'eos'"></span>
          </div>
          <div>{{ $t('luckDraw.mergeTime', {num: activeLvInfo.freeOrderQuota || 0}) }}</div>
          <div>
            <span v-if="$store.state.app.accountInfo.chain !== 'eos'">—</span>
            <span v-else>
              <span v-if="activeLvInfo.freeOrderQuota" class="iconfont icon-huaban77"></span>
              <span v-else class="iconfont icon-huaban82"></span>
            </span>
          </div>
        </div>
        <!-- 免费CPU -->
        <div class="tableContent" v-if="false">
          <div @click="handleToFreeCpu">
            {{ $t('vip.freeCpu') }}>
            <span v-if="$store.state.app.accountInfo.chain === 'eos'"></span>
          </div>
          <div>{{ $t('vip.freeCpuNum', {num: activeLvInfo.freeCpuQuota || 0}) }}</div>
          <div>
            <span v-if="$store.state.app.accountInfo.chain !== 'eos'">—</span>
            <span v-else>
              <span v-if="activeLvInfo.freeCpuQuota" class="iconfont icon-huaban77"></span>
              <span v-else class="iconfont icon-huaban82"></span>
            </span>
          </div>
        </div>
        <!-- 匿名交易 -->
        <div class="tableContent">
          <div>{{ $t('anonymous.anonymous') }}</div>
          <div>{{ $t('anonymous.anonymousTipShort') }}</div>
          <div>
            <span v-if="activeLvInfo.anonymous" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
            <!-- {{ $t('vip.waiting') }} -->
          </div>
        </div>
        <!-- Lab -->
        <div class="tableContent">
          <div>{{ $t('anonymous.lab') }}</div>
          <div>{{ $t('anonymous.labTipShort') }}</div>
          <div>
            <span v-if="activeLvInfo.lab" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
            <!-- {{ $t('vip.waiting') }} -->
          </div>
        </div>
        <!-- 持仓统计 -->
        <div class="tableContent">
          <div>{{ $t('vip.holdStatistics') }}</div>
          <div>{{ $t('vip.inTimeCount') }}</div>
          <div>
            <span v-if="activeLvInfo.holdStatistics" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
            <!-- {{ $t('vip.waiting') }} -->
          </div>
        </div>
        <!-- 成交提醒 -->
        <div class="tableContent">
          <div>{{ $t('more.dealRemind') }}</div>
          <div>
            <!-- <span v-if="activeLvInfo.level === 0">{{ $t('vip.inTimeMarket') }}</span> -->
            <span>{{ $t('vip.inTimeMarket') }}</span>
          </div>
          <div>
            <span v-if="activeLvInfo.dealRemind" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
          </div>
        </div>
        <!-- 行情提醒 -->
        <div class="tableContent">
          <div>{{ $t('vip.marketRemind') }}</div>
          <div>{{ $t('vip.inTimeQuotation') }}</div>
          <div>
            <span v-if="activeLvInfo.marketRemind" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
          </div>
        </div>
        <!-- 订单导出 -->
        <div class="tableContent">
          <div>{{ $t('vip.orderOut') }}</div>
          <div>
            <div>
              <div>{{ $t('vip.exportMarket') }}</div>
              <!-- <div>{{ $t('vip.marketRecord') }}</div> -->
            </div>
          </div>
          <div>
            <span v-if="activeLvInfo.orderReport" class="iconfont icon-huaban77"></span>
            <span v-else class="iconfont icon-huaban82"></span>
            <!-- {{ $t('vip.waiting') }} -->
          </div>
        </div>
      </div>
    </div>
    <!-- 等级说明 end -->

    <!-- 提示说明 start -->
    <div class="tipDiv">
      <div class="title">{{ $t('vip.tipTitle') }}</div>
      <div class="tip">{{ $t('vip.tip1') }}</div>
      <div class="tip">{{ $t('vip.tip2') }}</div>
      <!-- <div class="tip">{{ $t('vip.tip3') }}</div> -->
      <div class="tip">{{ $t('vip.tip4') }}</div>
    </div>
    <!-- 提示说明 end -->
    <!-- 底部升级会员按钮start -->
    <div style="height: 1.4rem"></div>
      <div class="btnDiv">
        <button v-if="vipInfo.level !== 0 && vipInfo.vipMode === 0" class="btn none" @click="handleUpgrade(0)">{{ $t('vip.renewVip') }}
          <span v-if= "topRenew">{{ $t('vip.renewedFee') }}</span>
        </button>

        <button class="btn" @click="handleUpgrade(1)">{{ $t('vip.updataVip') }}</button>
      </div>
    <!-- 底部升级会员按钮 end -->
    <!-- 抵押 & 赎回 start -->
    <mt-popup class="mortgageNDX" popup-transition="popup-fade" v-model="mortgageNDX">
      <MortgageNDX v-if="mortgageNDX" :isMortgageNDX="isMortgageNDX" @handleStakeInfo="handleStakeInfo" @listenClose="handleClose" />
    </mt-popup>
    <!-- 抵押 & 赎回 end -->

    <!-- 升级方式 start -->
    <mt-popup class="mortgageNDX" popup-transition="popup-fade" v-model="isUpgrade">
      <PopupUpgrade v-if="isUpgrade" :type="type" :stakeNdx="stakeNdx" @listenClose="handleClose" />
    </mt-popup>
    <!-- 升级方式 end -->

    <!-- 续费详情弹窗 start -->
    <mt-popup class="mortgageNDX" popup-transition="popup-fade" v-model="isRenew">
      <PopupRenewDetail v-if="isRenew" :vipInfo="vipInfo" @listenClose="handleClose" />
    </mt-popup>
    <!-- 续费详情弹窗 end -->
    <!-- 领取box -->
    <mt-popup
      v-model="receiveBoxVisible"
      class="popup"
      popup-transition="popup-fade">
      <receive-box
        v-if="receiveBoxVisible"
        :receiveBoxVisible="receiveBoxVisible"
        @listenClose="handleClose"/>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import { toFixed, GetUrlPara, toLocalTime, regIsRenew } from '@/utils/public';
import { AppToNdxDialog, AppInit } from '@/utils/publicApi';
import { Decimal } from 'decimal.js';
import axios from 'axios';
import ReceiveBox from '../../property/components/ReceiveBox';
import MortgageNDX from '../components/MortgageNDX'; // 废弃标注
import PopupUpgrade from '../components/PopupUpgrade';
import PopupRenewDetail from '../components/PopupRenewDetail';

export default {
  data() {
    return {
      mortgageNDX: false, // 是否显示抵押弹窗 true - 显示 | false - 不显示
      isMortgageNDX: false, // 是否抵押NDX true - 抵押 | false - 赎回
      isUpgrade: false, // 升级方式弹窗
      isRenew: false, // 续费详情弹窗
      topRenew: 0, // 判断条件封顶已续费
      receiveBoxVisible: false, // 领取box
      type: -1, // 0消耗NDX  1抵押NDX 升级方式弹窗用
      vipLv: 0,
      vipLVScroll: 0, // 滚动到第几个等级
      box: null,
      accountTotalStakeNdx: '0.0000', // NDX总抵押量
      stakeNdx: '0.0000', // NDX自己抵押量
      vipInfo: {}, // vuex 账户信息

      lvList: [
        {
          // 等级列表
          dealRemind: 0,
          discount: null,
          holdStatistics: 0,
          level: 0,
          discountRate: 0.001,
          ndxStaked: 0,
          ndxConsume: 0,
          symbolRemindCount: -1,
          takerRate: 0.001
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 1,
          discountRate: 0.95,
          ndxStaked: 10000,
          ndxConsume: 100,
          symbolRemindCount: -1,
          takerRate: 0.00095
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 2,
          discountRate: 0.0009,
          ndxStaked: 5000,
          ndxConsume: 300,
          symbolRemindCount: -1,
          takerRate: 0.0009
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 3,
          discountRate: 0.00085,
          ndxStaked: 10000,
          ndxConsume: 1000,
          symbolRemindCount: -1,
          takerRate: 0.00085
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 4,
          discountRate: 0.0008,
          ndxStaked: 30000,
          ndxConsume: 3000,
          symbolRemindCount: -1,
          takerRate: 0.0008
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 5,
          discountRate: 0.00075,
          ndxStaked: 60000,
          ndxConsume: 6000,
          symbolRemindCount: -1,
          takerRate: 0.00075
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 6,
          discountRate: 0.0007,
          ndxStaked: 100000,
          ndxConsume: 10000,
          symbolRemindCount: -1,
          takerRate: 0.0007
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 7,
          discountRate: 0.00065,
          ndxStaked: 200000,
          ndxConsume: 20000,
          symbolRemindCount: -1,
          takerRate: 0.00065
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 8,
          discountRate: 0.0006,
          ndxStaked: 500000,
          ndxConsume: 50000,
          symbolRemindCount: -1,
          takerRate: 0.0006
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 9,
          discountRate: 0.0006,
          ndxStaked: 800000,
          ndxConsume: 80000,
          symbolRemindCount: -1,
          takerRate: 0.0006
        },
        {
          dealRemind: 1,
          discount: null,
          holdStatistics: 0,
          level: 10,
          discountRate: 0.0006,
          ndxStaked: 1000000,
          ndxConsume: 100000,
          symbolRemindCount: -1,
          takerRate: 0.0006
        }
      ],
      activeLvInfo: {
        // 选中会员等级特权展示
        dealRemind: 0,
        discount: null,
        holdStatistics: 0,
        level: 0,
        discountRate: 1,
        ndxStaked: 0,
        ndxConsume: 0,
        symbolRemindCount: -1,
        takerRate: 0.001,
      }
    };
  },
  watch: {
    vipLVScroll(newVal) {
      this.activeLvInfo = this.lvList[this.vipLVScroll];
      if (newVal === 0 || newVal === 1) {
        this.$refs.lvScroll.scrollLeft = 0;
      }
      if (newVal > 1) {
        this.$refs.lvScroll.scrollLeft =
          ((0.3 + 1.6 * (newVal - 2)) * screen.width * 100) / 750; // eslint-disable-line
      }
    },
    '$store.state.app.vipInfo': {
      handler: function listen(newVal) {
        this.handleStakeInfo()
        this.vipLv = newVal.level || 0;
        this.vipLVScroll = newVal.level || 0; // 滚动到第几个等级
        this.vipInfo = newVal
        this.type = newVal.vipMode
        // this.topRenew = newVal.isRenew
        this.topRenew = regIsRenew(newVal)
      },
      immediate: true,
      deep: true,
    },
    lvList() {
      this.handleActive(this.vipLVScroll);
    }
  },
  mounted() {
    AppInit();
    if (this.$route.params.show) {
      // this.mortgageNDX = true;
    }
    // 获取vuex Vip信息
    // const vipInfo = this.$store.state.app.vipInfo
    // this.vipInfo = vipInfo
    // this.type = vipInfo.vipMode

    this.vipLv = this.$store.state.app.vipInfo.level || 0;
    this.vipLVScroll = this.$store.state.app.vipInfo.level || 0; // 滚动到第几个等级
    this.handleGetVipLvList();
    this.handleStakeInfo();// 查询账户抵押信息

    // 获取url传值 stake: 0 - 不操作 | 1 - 抵押 | 2 - 赎回
    const t = GetUrlPara();
    if (t.stake === '1') {
      this.mortgageNDX = true;
      this.isMortgageNDX = true;
    }
    if (t.stake === '2') {
      this.mortgageNDX = true;
      this.isMortgageNDX = false;
    }
  },
  components: {
    MortgageNDX,
    PopupUpgrade,
    PopupRenewDetail,
    mtPopup: Popup,
    ReceiveBox,
  },
  methods: {
    // 按K统计
    handleToK(n, m) {
      return Decimal.div(n, m).toString();
    },
    toFixed(m, n) {
      return toFixed(m, n);
    },
    // 消耗会员日期
    handleTime(val) {
      if (!val) {
        return '-'
      }
      return toLocalTime(val).substring(0, 10)
    },
    handleShowMor() {
      if (this.$store.state.sys.isAppView) {
        AppToNdxDialog(2)
        return;
      }
      this.$router.push({
        name: 'stakeNdx',
        params: {
          type: 'unstake'
        }
      })
      // this.mortgageNDX = true;
    },
    // 关闭赎回弹窗
    handleClose() {
      this.mortgageNDX = false;
      this.isUpgrade = false;
      this.isRenew = false;
      this.receiveBoxVisible = false;
    },
    // 0续费 1升级按钮 跳转 || 已续费弹窗
    handleUpgrade(val) {
      if (val === 0 && this.topRenew) {
        this.isRenew = true
        return
      } else if (val === 1) {
        this.$router.push({ name: 'upgradeVip' })
        return
      }
      // 续费路由待续
      this.$router.push({ name: 'renewalVip' })
    },
    // 查询账户抵押信息
    handleStakeInfo() {
      try {
        if (this.$store.state.app.accountInfo.chain !== 'eos') {
          return;
        }
        const params = {
          code: 'newdexstaked',
          table: 'stakes',
          scope: this.$store.state.app.accountInfo.encodeName,
          lower_bound: this.$store.state.app.accountInfo.chain,
          upper_bound: this.$store.state.app.accountInfo.chain,
          json: true,
        }
        axios.post(`${this.$store.state.sys.nodeList.eosNode.httpEndpoint}/v1/chain/get_table_rows`, JSON.stringify(params)).then((res) => {
          if (res.data.rows.length !== 0) {
            const row = res.data.rows[0];
            // console.log(row, 'xxxxxxxzzzz')
            let all = Decimal.add(row.self_staked, row.staked_to_others).toString();
            all = Decimal.div(all, 10000).toString();
            this.accountTotalStakeNdx = toFixed(all, 4);
            this.stakeNdx = toFixed(Decimal.div(row.self_staked, 10000).toString(), 4);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleUnstakeNum();
        }, 200);
      }
    },
    // 计算手续费
    handleGetCharge(n, m) {
      return Decimal.mul(n, m).toString();
    },
    // 计算折扣
    handleGetChargeEn(n, m) {
      const t = Decimal.mul(n, m);
      return Decimal.sub(100, t).toString();
    },
    // 选择会员等级
    handleActive(index) {
      this.vipLVScroll = index;
      this.activeLvInfo = this.lvList[index];
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        };
        this.$http.post('/account/getAccountInfo', params).then((res) => {
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
          this.vipLv = res.accountInfo.level;
          this.vipLVScroll = res.accountInfo.level;
        });
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 获取会员等级列表
    handleGetVipLvList() {
      if (this.$appName !== 'eosNewdex') return;
      this.$http.get('/levelRule/list').then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.lvList = res.ruleList;
      });
    },
    // 页面滚动位置
    // listenScroll() {
    //   if (!this.$refs.lvScroll) {
    //     return
    //   }
    //   this.isScroll = this.$refs.lvScroll.scrollLeft / ((screen.width / 750) * 100);
    //   console.log(this.isScroll)
    // },
    // 领取box
    handleReceiveBox() {
      this.receiveBoxVisible = true;
    },
    // 抽奖
    handleToDraw() {
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        return;
      }
      this.$router.push({
        name: 'luckDraw'
      });
    },
    // 糖果空投
    handleToCandyBox() {
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        return;
      }
      this.$router.push({
        name: 'candyBox'
      });
    },
    // 免费CPU
    handleToFreeCpu() {
      if (this.$store.state.app.accountInfo.chain !== 'eos') {
        return;
      }
      this.$router.push({
        name: 'freeCpu'
      });
    },
  }
};
</script>

<style scoped lang="scss">
@import "../../../assets/css/public.scss";

.vipDetailPage {
  font-size: 0.25rem;
}
.more {
  background: url("/static/img/more/avip-bg.png") no-repeat;
  background-size: 100% 100%;
  color: #f2dba4;
  // min-height: 3.25rem;
  padding: 0 0.56rem 0.33rem;
  box-sizing: border-box;
  .lvDiv {
    width: 100%;
    padding-top: 0.2rem;
    // height: 0.8rem;
    position: relative;
    text-align: center;
    font-size: 0.36rem;
    color: #f2dba4;
  }
  .accountVipDetail {
    margin-top: 0.5rem;
    font-size: 0.21rem;
    display: flex;
    justify-content: space-between;
    .mortgage {
      flex: 1;
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .mortgage-title {
        font-size: 0.3rem;
        height: 0.42rem;
        color: #f2dba4;
        margin-bottom: 0.2rem;
      }
      .Redeem {
        margin-left: 0.1rem;
        color: #f6c85c;
      }
    }
  }
  .more-desc {
    font-size: 0.24rem;
    color: #ffffff;
  }
}

.lvDiv {
  width: 100%;
  padding-top: 0.2rem;
  // height: 0.8rem;
  position: relative;
  text-align: center;
  font-size: 0.36rem;
  color: #f2dba4;
}

.accountVipDetail {
  margin-top: 0.5rem;
  font-size: 0.21rem;
  display: flex;
  justify-content: space-between;
  // text-align: center;

  .mortgage {
    flex: 1;
    margin-bottom: 0.2rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    // &:last-child{
    //   text-align: right;
    // }
    .mortgage-title {
      font-size: 0.3rem;
      height: 0.42rem;
      color: #f2dba4;
      margin-bottom: 0.2rem;
      display: flex;
      align-items: center;
    }
    .Redeem {
      margin-left: 0.1rem;
      color: #f6c85c;
    }
  }
}

// 等级说明
.tipDiv,
.vipLV {
  margin-bottom: 0.3rem;
  margin-top: 0.26rem;

  .title {
    padding: 0px 0.24rem 0px 0.36rem;
    margin-bottom: 0rem;
    font-size: 0.32rem;
    color: #8B572A;
  }

  .scrollOutDiv{
    height: 1.64rem;
    overflow: hidden;
  }

  // 等级滚动条
  .lvScroll {
    width: 6.9rem;
    margin: auto;
    padding-bottom: 0.2rem;
    font-size: 0.36rem;
    display: flex;
    overflow: auto;

    & > div {
      width: 1.6rem;
      min-width: 1.6rem;
      text-align: center;

      &:first-child {
        width: 0.7rem;
        min-width: 1.1rem;
        margin-right: 0.25rem;
      }

      // &:nth-child(1){
      //   font-size: .18rem;
      // }

      &:last-child .lv::after {
        width: 0rem;
        border: 0px solid #f2dba4;
      }

      & > div:nth-child(1) {
        margin: 0.15rem auto 0.2rem;
      }

      .needNDX,
      .charge {
        font-size: 0.21rem;
      }
    }

    .lv {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f2dba4;
      height: 0.65rem;
      width: 0.64rem;
      min-width: 0.66rem;
      border-radius: 100px;
      color: #fff;
      position: relative;
      z-index: 1;

      &::after {
        content: "";
        width: 1.2rem;
        border: 1px solid #f2dba4;
        position: absolute;
        left: 0.6rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
      }

      & > span {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f2dba4;
        z-index: 10;
        border-radius: 100px;
      }

      &.active {
        // 点击
        color: #8b572a;
        background: #f6c85c;

        & > span {
          background: #f6c85c;
        }
      }

      &.thisLv {
        // 自身等级
        & > span {
          border: 2px solid #8b572a;
          box-sizing: border-box;
        }
      }
    }
  }
  .tableUpVip{
    margin: 0.2rem auto;
    width: 6.9rem;
    border: 2px solid $color-input;
    border-radius: 0.08rem;
    font-size: 0.21rem;
    .upVip{
      display: flex;
      border-bottom: 1px solid $color-input;
      &:last-child{
        border-bottom: 0px solid $color-input;
      }
      & > div{
        flex: 1;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid $color-input;
        &:first-child{
          border-left: 0px solid $color-input;
        }
      }
    }
  }
  .tableDesc{
    font-size: 0.25rem;
    color: #9B9B9B;
    text-align: right;
    margin: 0 0.3rem 0.2rem 0;
  }
  // 会员表格
  .tableDiv {
    margin: 0.2rem auto 0.4rem auto;
    width: 6.9rem;
    border: 2px solid $color-input;
    border-radius: 0.08rem;
    font-size: 0.21rem;
    & > div {
      display: flex;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid $color-input;

      &:last-child {
        border-bottom: 0px solid $color-input;
      }
      & > div {
        flex: 1;
        border-right: 1px solid $color-input;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:nth-child(2) {
          flex: 2;
        }

        &:last-child {
          border-right: 0px solid $color-input;
        }
      }
    }

    .tableTitle {
      height: 0.7rem;
      font-size: 0.25rem;

      & > div {
        background: rgba($color: #4a90e2, $alpha: 0.15);
        border-right: 1px solid #d5d5d5;

        &:last-child {
          border-right: 0px solid #d5d5d5;
        }
      }
    }

    .tableContent {
      height: 1rem;

      & > div:nth-child(1) {
        font-size: 0.25rem;
      }
      & > div:nth-child(3) {
        span {
          font-size: 0.2rem;

          &.icon-huaban77 {
            color: $color-green;
          }

          &.icon-huaban82 {
            color: $color-red;
          }
        }
      }
    }
  }
}

// 提示说明
.tipDiv {
  .tip {
    padding: 0.08rem 0.24rem 0px 0.36rem;
  }
}
.btnDiv{
    color: #8B572A;
    text-align: center;
    position: fixed;
    box-sizing: border-box;
    padding: .2rem .15rem .3rem .25rem;
    bottom: 0px;
    width: 100%;
    max-width: 750px;
    background: #FFF;
    z-index: 10;
    box-shadow: 0px -0.01rem .05rem rgba(75, 75, 75, 0.10);
    display: flex;
    align-items: center;
    .btn{
      flex:1;
      height: 0.84rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-right: 0.15rem;
      background: #F6C85C;
      // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: .07rem;
      font-size: 0.28rem;
      color: #8B572A;
    }
    .none{
      background: #FFFFFF;
      border: 0.02rem solid #F6C85C;
      box-sizing: border-box;

      span{
        font-size: 0.21rem;
      }
    }
  }
// 弹窗
.mortgageNDX {
  background: transparent !important;
}
</style>
