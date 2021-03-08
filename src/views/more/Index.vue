<template>
  <div class="morePage" :class="{'isVipDiv': vipInfo.level}" @click="handleCloseSelect">
    <div v-if="$appName === 'eosNewdex'">
         <!-- topShow -->
      <div class="more" v-if="isEosChain">
        <!-- 大使图标 -->
        <div class="ambassadorIconDiv" v-if="$store.state.app.vipInfo.ambassadorType">
          <img v-if="$store.state.app.language === 'zh-CN' || $store.state.app.language === 'zh-TW'"
            src="/static/img/more/icon.png" alt="">
          <img v-if="$store.state.app.language === 'ko'" src="/static/img/more/icon-ko.png" alt="">
          <img v-if="$store.state.app.language === 'en'" src="/static/img/more/icon-en.png" alt="">
        </div>
        <!-- 账户 -->
        <div class="account">
          <div class="badgeDiv" v-if="$store.state.app.vipInfo.ambassadorType">
            <img src="/static/img/more/badge.png" alt="">
          </div>
          <div><vip-tip :level="vipInfo.level" :discountRate="vipInfo.discountRate|| 0.95" /></div>
          <div class="name">{{ $store.state.app.accountInfo ? $store.state.app.accountInfo.account : '' }}</div>
        </div>
        <!-- 等级 -->
        <div class="lvDiv">
          <div class="lv" v-if="!vipInfo.level">{{ $t('vip.notVip') }}</div>
          <div class="lv" v-if="vipInfo.level">VIP {{ vipInfo.level }}</div>
          <div>{{ $t('vip.myLv') }}</div>
        </div>
        <!-- 账户详情 -->
        <div class="accountVipDetail">
          <!-- 会员到期============ -->
          <div class="mortgage" v-if="accountInfo.vipMode === 0">
            <div v-if="vipInfo.level !== 0">{{handleTime(accountInfo.expireTime)}}</div>
            <div v-else>-</div>
            <div>
              <span :class="{Redeem: accountInfo.vipMode !== 0}">{{ $t('vip.vipExpire') }}</span>
            </div>
          </div>
          <div class="mortgage" v-else-if="accountInfo.vipMode === 1">
            <div v-if="Number(accountTotalStakeNdx) < 100000">{{ toFixed(accountTotalStakeNdx, 4) || 0.0000 }} NDX</div>
            <div v-if="Number(accountTotalStakeNdx) >= 100000"
              >{{ toFixed(handleToK(accountTotalStakeNdx, 1000), 2) || 0.0000 }}K NDX</div>
            <div>
             <span v-if="$store.state.app.language !== 'en' && $store.state.app.language !== 'ko'">NDX{{ $t('vip.mortgageNum') }}</span>
              <span v-else>{{ $t('vip.mortgageNum') }} NDX</span>
              <span class="Redeem" @click="mortgageNDX = true">{{ $t('vip.redeem') }}</span>
            </div>
          </div>
          <div class="charge">
            <div>
              <span v-if="$store.state.app.language === 'zh-CN' && vipInfo.level === 0">无</span>
              <span v-if="$store.state.app.language === 'zh-CN' && vipInfo.level !== 0">
                {{ handleGetCharge(vipInfo.discountRate || 1, 10) }}折
              </span>
              <span v-if="$store.state.app.language !== 'zh-CN'">
                {{ handleGetChargeEn(vipInfo.discountRate || 1, 100) }}% off
              </span>
            </div>
            <div>{{ $t('vip.charge') }}</div>
          </div>
          <div class="saveCharge">
            <div v-if="vipInfo.totalSaveAmount < 100000">{{ toFixed(vipInfo.totalSaveAmount, 4) }} EOS</div>
            <div v-if="vipInfo.totalSaveAmount >= 100000">{{ toFixed(vipInfo.totalSaveAmount, 0) }} EOS</div>
            <div>{{ $t('vip.saveCharge') }}</div>
          </div>
        </div>
      </div>

      <!-- bos链显示 start -->
      <div class="more-bos" v-else>
        <div class="center">
          <div class="iconfont icon-huaban23 logoIcon"></div>
          <div class="bannerTitle">{{$t('index.bannerTitle')}}</div>
        </div>
      </div>
      <!-- bos链显示 end -->
    </div>
    <div v-else>
      <div class="more-bos">
        <div class="center">
          <div class="iconfont icon-huaban23 logoIcon"></div>
          <div class="bannerTitle">{{$t('index.tronBannerTitle')}}</div>
          <div class="bannerDesc">
            <div v-if="$store.state.app.language === 'en' || $store.state.app.language == 'ko'">
              <p>{{$t('index.desc1')}} | {{$t('index.desc2')}}</p>
              <p>{{$t('index.desc3')}} | {{$t('index.desc4')}}</p>
            </div>
            <div v-else>{{$t('index.desc1')}} | {{$t('index.desc2')}} | {{$t('index.desc3')}} | {{$t('index.desc4')}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开通会员 & 升级会员 -->
    <div class="toVip" v-if="isEosChain">
      <!-- 会员过期 -->
      <div class="rechargeVip" v-if="vipInfo.level !== 0 && vipInfo.vipMode === 0">
        <div @click="handleToVip(0)">
          <div class="icon">
          <img src="/static/img/more/upgrade1.png"/>
          </div>{{ $t('vip.renewVip') }}</div>
        <div @click="handleToVip(1)">
          <div class="icon">
          <img src="/static/img/more/upgrade2.png"/>
          </div>{{ $t('vip.updataVip') }}</div>
      </div>
      <!-- 开通会员 -->
      <!-- <div class="openVip" v-else>
        <div>
          <span class="title" :class="{'koFontSize': $store.state.app.language === 'ko'}">{{ $t('vip.openVip') }}</span>
          <span class="tip" :class="{'koTipFontSize': $store.state.app.language === 'ko'}">{{ $t('vip.privilege') }}</span>
        </div>
        <div class="openBtn" @click="handleToVipDetail(false)">{{ $t('vip.openShort') }}</div>
      </div> -->
      <!-- 升级会员 -->
      <div class="openVip" v-else>
        <div>
          <span class="title" :class="{'koFontSize': $store.state.app.language === 'ko'}">{{ $t('vip.updataVip') }}</span>
          <span class="tip" :class="{'koTipFontSize': $store.state.app.language === 'ko'}">{{ $t('vip.privilege') }}</span>
        </div>
        <div class="openBtn" v-if="vipInfo.level !== 0" @click="handleToVip(1)">{{ $t('vip.updataShort') }}</div>
        <div class="openBtn" v-else @click="handleToVip(2)">{{ $t('vip.updataShort') }}</div>
      </div>
    </div>

    <!-- list -->
    <div class="list">
      <!-- 会员中心 start -->
      <div class="list-item" v-if="$appName === 'eosNewdex'">
        <div class="subTitle">{{ $t('more.vipCenter') }}</div>
        <!-- 会员说明 -->
        <div class="item" @click="handleToVip(2)" v-if="isEosChain">
          <div>
            <span class="iconfont icon-huaban76 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.vipDetail') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 会员抽奖 -->
        <div class="item" @click="handleToDraw" v-if="isEosChain">
          <div>
            <span class="iconfont icon-huaban84 icon"></span>
          </div>
          <div class="name">
            <span style="position: relative;">
              <span>{{ $t('luckDraw.dailyLuckyDraw') }}</span>
              <!-- <span class="iconfont icon-huaban85 hot"></span> -->
            </span>
            <span class="tip fr">{{ $t('luckDraw.VipExclusive') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 糖果空投 -->
        <div class="item" @click="handleToCandyBox" v-if="isEosChain">
          <div>
            <span class="iconfont icon-huaban96 icon"></span>
          </div>
          <div class="name">
            <span style="position: relative;">
              <span>{{ $t('vip.airdrop') }}</span>
              <!-- <span class="iconfont icon-huaban85 hot"></span> -->
            </span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 免费CPU -->
        <div class="item" @click="handleToCpu" v-if="false">
          <div>
            <span class="iconfont icon-huaban147 icon"></span>
          </div>
          <div class="name">
            <span style="position: relative;">
              <span>{{ $t('vip.freeCpu') }}</span>
              <span class="iconfont icon-huaban85 hot"></span>
            </span>
            <span v-if="$store.state.app.vipInfo.level !== 0">
              <span class="tip fr" v-if="$store.state.app.vipInfo.freeCpuStatus === 0">{{ $t('vip.ableGet') }}</span>
              <span class="tip fr" v-else>{{ $t('vip.got') }}</span>
            </span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 盈亏统计 -->
        <div class="item" @click="handleToCount">
          <div>
            <span class="iconfont icon-huaban93 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('profit.profit') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 行情提醒 -->
        <div class="item" @click="handleToMarketTip">
          <div>
            <span class="iconfont icon-huaban75 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('marketTip.marketTip') }}</span>
            <!-- <span class="tip fr" v-if="$store.state.app.vipInfo.isMarketRemind === 0">{{ $t('vip.closeEmailRemind') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.isMarketRemind !== 0">
              {{ $t('vip.openEmailRemind') }}</span> -->
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 成交提醒 -->
        <div class="item" @click="handleToTransactionTip">
          <div>
            <span class="iconfont icon-huaban86 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.dealRemind') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.isDealRemind === 0">{{ $t('vip.closeEmailRemind') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.isDealRemind !== 0 && $store.state.app.vipInfo.remainDealRemindCount !== 0">
              {{ $t('vip.openEmailRemind') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.isDealRemind !== 0 && $store.state.app.vipInfo.remainDealRemindCount === 0">
              {{ $t('vip.runOutTip') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 匿名交易 -->
        <div class="item" @click="handleToAnonymous" v-if="isEosChain">
          <div>
            <span class="iconfont icon-huaban95 icon anonymous"></span>
          </div>
          <div class="name">
            <span>{{ $t('anonymous.anonymous') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.anonymous === 0">{{ $t('vip.closeEmailRemind') }}</span>
            <span class="tip fr" v-if="$store.state.app.vipInfo.anonymous !== 0">
              {{ $t('vip.openEmailRemind') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

      </div>
      <!-- 会员中心 end -->

      <!-- 客户服务 start -->
      <div class="list-item">
        <div class="subTitle">{{ $t('more.service') }}</div>
        <!-- 委托账户 -->
        <div class="item" @click="handleToAccount">
          <div>
            <span class="iconfont icon-huaban14 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.toAccount') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 帮助中心 -->
        <div class="item" @click="handleToHelpCenter">
          <div>
            <span class="iconfont icon-huaban13 icon smallicon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.help') }}</span>
            <span class="tip fr">{{ $t('more.helpTip') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 提交工单 -->
        <div class="item" @click="handleToForm">
          <div>
            <span class="iconfont icon-huaban34 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.form') }}</span>
            <span class="tip fr">{{ $t('more.formTip') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 下载APP -->
        <div class="item" @click="handleToDownApp" v-if="$appName === 'eosNewdex' && channel !== 'bitpie' && false">
          <div>
            <span class="iconfont icon-huaban97 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.downApp') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>
      </div>
      <!-- 客户服务 start -->

      <!-- 系统设置 start -->
      <div class="list-item">
        <div class="subTitle">{{ $t('more.setting') }}</div>
        <!-- 语言 -->
        <div class="item">
          <div>
            <span class="iconfont icon-huaban28 icon"></span>
          </div>
          <div class="name">
            <select id="lang" v-model="language" class="langSelect" ref="lang" @click.stop="handleFocus">
              <option v-for="(item, $index) in solts" :key="$index" :value="item.key">{{ item.name }}</option>
            </select>
            <span>{{ $t('more.language') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 更新日志 -->
        <div class="item" @click="handleUpdateLog">
          <div>
            <span class="iconfont icon-huaban42 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.updateLog') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 节点 -->
        <!-- <div class="item" @click="handleToNodeList">
          <div>
            <span class="iconfont icon-huaban50 icon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.nodeChoose') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div> -->

        <!-- 关于我们 -->
        <div class="item" @click="handleAboutUs">
          <div>
            <span class="iconfont icon-xinxi icon info"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.aboutUs') }}</span>
          </div>
          <div class="link">
            <span class="iconfont icon-huaban11"></span>
          </div>
        </div>

        <!-- 官方域名 -->
        <div class="item">
          <div>
            <span class="iconfont icon-huaban92 icon smallicon"></span>
          </div>
          <div class="name">
            <span>{{ $t('more.officialName') }}</span>
            <span class="tip fr">
              <div>https://newdex.io</div>
              <div>https://newdex.vip</div>
            </span>
          </div>
          <div class="link">
            <!-- <span class="iconfont icon-huaban11"></span> -->
          </div>
        </div>
      </div>
    </div>

    <!-- dialog account -->
    <mt-popup
      class="dialogAccount"
      popup-transition="popup-fade"
      v-model="showAccount">
      <ToAccount :showAccount = "showAccount" v-if="showAccount" @listenCloseAccount = "handleCloseAccount"/>
    </mt-popup>

    <!-- 抵押赎回 start -->
    <mt-popup
      class="mortgageNDX"
      popup-transition="popup-fade"
      v-model="mortgageNDX">
      <MortgageNDX v-if="mortgageNDX" :isMortgageNDX="isMortgageNDX" @listenClose="handleCloseMortgageNDX" />
    </mt-popup>
    <!-- 抵押赎回 end -->
     <!-- 续费详情弹窗 start -->
    <mt-popup class="mortgageNDX" popup-transition="popup-fade" v-model="isRenew">
      <PopupRenewDetail v-if="isRenew" :vipInfo="vipInfo" @listenClose="handleClose" />
    </mt-popup>
    <!-- 续费详情弹窗 end -->

    <!-- language -->
    <!-- <Language ref="language" class="hidden"/> -->
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
// import Language from '@/components/Language';
import axios from 'axios';
import { Decimal } from 'decimal.js';
import { toFixed, GetUrlPara, toLocalTime, regIsRenew } from '@/utils/public';
import { accountToSign } from '@/utils/publicApi';

import ToAccount from './components/ToAccount';
import MortgageNDX from './components/MortgageNDX';
import VipTip from './components/VipTip';
import PopupRenewDetail from './components/PopupRenewDetail';

export default {
  data() {
    return {
      showAccount: false, // 显示委托账户
      solts: [
        {
          key: 'en',
          name: 'English'
        },
        {
          key: 'zh-CN',
          name: '简体中文',
        },
        {
          key: 'zh-TW',
          name: '繁體中文'
        },
        {
          key: 'ko',
          name: '한국어'
        }
      ],
      language: '',
      changeLanguage: false,
      // isVip: false, // 是否是VIP - true - 是Vip | false - 非Vip - vipInfo.level替代
      mortgageNDX: false, // 是否显示抵押弹窗 true - 显示 | false - 不显示
      isMortgageNDX: false, // 是否抵押NDX true - 抵押 | false - 赎回
      vipInfo: {
        discount: null,
        level: 0,
        makerRate: null,
        maxLevel: null,
        ndxMortgageCount: null,
        takerRate: null,
        totalSaveAmount: 0,
        vipImageUrl: null,
      },
      isRenew: false,
      accountTotalStakeNdx: '0.0000',
      channel: 'scatter',
      accountInfo: {},
    }
  },
  props: [
  ],
  components: {
    ToAccount,
    VipTip,
    MortgageNDX,
    PopupRenewDetail,
    mtPopup: Popup,
    // Language,
  },
  watch: {
    language(newVal) {
      this.handleCheckLang(newVal);
    },
    '$store.state.app.vipInfo': function listen(newVal) {
      this.vipInfo = newVal;
      this.handleStakeInfo();
    },
    // '$store.state.app.node': function listhen() {
    //   this.$router.go(0);
    // },
  },
  computed: {
    isEosChain() {
      if (this.$store.state.app.accountInfo && this.$store.state.app.accountInfo.chain === 'eos') {
        return true;
      }
      return false;
    }
  },
  created() {
  },
  mounted() {
    this.channel = localStorage.getItem('channel');
    this.language = this.$store.state.app.language;
    this.handleCheckLang(this.language);
    this.vipInfo = this.$store.state.app.vipInfo;
    this.handleGetAccountInfo();
    this.handleStakeInfo();

    // 获取url传值 stake: 0 - 不操作 | 1 - 抵押 | 2 - 赎回
    const t = GetUrlPara()
    if (t.stake === '1') {
      this.mortgageNDX = true;
      this.isMortgageNDX = true;
    }
    if (t.stake === '2') {
      this.mortgageNDX = true;
      this.isMortgageNDX = false;
    }
  },
  methods: {
    toFixed(m, n) {
      return toFixed(m, n);
    },
    handleTime(val) {
      if (!val) {
        return '-'
      }
      return toLocalTime(val).substring(0, 10)
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
            let all = Decimal.add(row.self_staked, row.staked_to_others).toString();
            all = Decimal.div(all, 10000).toString();
            this.accountTotalStakeNdx = toFixed(all, 4);
          }
        });
      } catch (error) {
        setTimeout(() => {
          this.handleUnstakeNum();
        }, 200);
      }
    },
    // 按K统计
    handleToK(n, m) {
      return Decimal.div(n, m).toString();
    },
    // 计算折扣
    handleGetCharge(n, m) {
      return Decimal.mul(n, m).toString();
    },
    handleGetChargeEn(n, m) {
      const t = Decimal.mul(n, m);
      return Decimal.sub(100, t).toString();
    },
    // 获取账户会员等级
    handleGetAccountInfo() {
      try {
        const params = {
          account: this.$store.state.app.accountInfo.account
        }
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
          this.accountInfo = res.accountInfo
          this.$store.dispatch('setVipInfo', res.accountInfo);
        })
      } catch (error) {
        setTimeout(() => {
          this.handleGetAccountInfo();
        }, 200);
      }
    },
    // 0跳转消耗 1跳转抵押 2跳转至会员说明页面
    handleToVip(type) {
      switch (type) {
        case 0:
          if (regIsRenew(this.vipInfo)) {
            this.isRenew = true
            break;
          }
          this.$router.push({ name: 'renewalVip' })
          break;
        case 1:
          this.$router.push({ name: 'upgradeVip' })
          break;
        default:
          this.$router.push({ name: 'vipDetail' })
          break;
      }
    },
    // 关闭赎回弹窗
    handleCloseMortgageNDX() {
      this.mortgageNDX = false;
    },
    // 获取焦点
    handleFocus() {
      this.changeLanguage = true;
    },
    /*
    * 语言切换
    * 返回 lang
    */
    handleCheckLang(lang) {
      this.language = lang;
      this.$i18n.locale = lang;
      this.$store.dispatch('setLanguage', lang);
    },
    // 关闭dialog
    handleCloseAccount() {
      this.showAccount = false;
    },
    // 全局取消语言切换
    handleCloseSelect() {
      this.changeLanguage = false;
    },
    handleClose() {
      this.isRenew = false;
    },
    // 抽奖
    handleToDraw() {
      this.$router.push({
        name: 'luckDraw',
      });
    },
    // 成交提醒
    handleToTransactionTip() {
      this.$router.push({
        name: 'transactionTip',
      });
    },
    // 行情提醒
    handleToMarketTip() {
      this.$router.push({
        name: 'marketTip',
      });
    },
    // 盈亏统计
    handleToCount() {
      const token = localStorage.getItem('token');
      if (!token) {
        accountToSign(this, () => {
          this.handleToCount()
        })
        return;
      }
      this.$router.push({
        name: 'profitStatistics',
      });
    },
    // 糖果空投
    handleToCandyBox() {
      this.$router.push({
        name: 'candyBox',
      });
    },
    handleToCpu() {
      this.$router.push({
        name: 'freeCpu'
      })
    },
    // 匿名交易
    handleToAnonymous() {
      this.$router.push({
        name: 'anonymous',
      });
    },
    // 委托账户
    handleToAccount() {
      if (this.changeLanguage) {
        return;
      }
      this.showAccount = true;
    },
    // 语言
    handleShowLanguage() {
      this.$refs.language.handleShow();
    },
    // 更新日志
    handleUpdateLog() {
      this.$router.push({
        name: 'updateLog'
      });
    },
    // 节点选择
    handleToNodeList() {
      if (this.changeLanguage) {
        return;
      }
      this.$router.push('/chooseNode');
    },
    // 帮助中心
    handleToHelpCenter() {
      if (this.changeLanguage) {
        return;
      }
      const lang = this.$store.state.app.language;
      if (lang !== 'en') {
        window.location.href = `https://support.newdex.net/hc/${lang.toLowerCase()}`;
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us';
    },
    // 关于我们
    handleAboutUs() {
      if (this.changeLanguage) {
        return;
      }
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.net/hc/ko/articles/360012388492-%EA%B1%B0%EB%9E%98%EC%86%8C-%EC%86%8C%EA%B0%9C';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.net/hc/zh-cn/articles/360012388492-%E5%B9%B3%E5%8F%B0%E4%BB%8B%E7%BB%8D';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.net/hc/zh-tw/articles/360012388492-%E5%B9%B3%E8%87%BA%E4%BB%8B%E7%B4%B9';
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us/articles/360012388492-About-us';
    },
    // 提交工单
    handleToForm() {
      if (this.changeLanguage) {
        return;
      }
      const lang = this.$store.state.app.language;
      if (lang === 'ko') {
        window.location.href = 'https://support.newdex.net/hc/ko/requests/new';
        return;
      }
      if (lang === 'zh-CN') {
        window.location.href = 'https://support.newdex.net/hc/zh-cn/requests/new';
        return;
      }
      if (lang === 'zh-TW') {
        window.location.href = 'https://support.newdex.net/hc/zh-tw/requests/new';
        return;
      }
      window.location.href = 'https://support.newdex.net/hc/en-us/requests/new';
    },
    // 下载APP
    handleToDownApp() {
      this.$router.push({
        name: 'down',
      });
    },
  },
  beforeDestroy() {
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/public.scss";

.morePage{
  background: #fafafa;
}

.fr{
  margin-right: -.3rem;
}

.langSelect{
  width: 100%;
  font-size: .3rem;
  position: absolute;
  height: 100%;
  background: transparent;
  top: 0;
  left: 0px;
  opacity: 0;
  border: 1px solid black;
}

.more{
  background: url('/static/img/more/bvip-bg.png') no-repeat;
  background-size: contain;
  height: 3.25rem;
  max-width: 100%;
  color: white;
  position: relative;
  font-size: .32rem;
  box-sizing: border-box;
  padding: .15rem .32rem .2rem .32rem;

  .ambassadorIconDiv{
    position: absolute;
    right: .37rem;
    top: .17rem;
    width: 1.47rem;

    img{
      width: 100%;
    }
  }

  .account{
    display: flex;
    align-items: center;

    .badgeDiv{
      display: flex;
      align-items: center;
      margin-right: .05rem;
      width: .78rem;

      img{
        width: 100%;
      }
    }

    .name{
      margin-left: .05rem;
    }
  }

  .lvDiv{
    text-align: center;
    font-size: .21rem;
    margin-top: .17rem;

    .lv{
      font-size: .6rem;
      margin-bottom: .1rem;
    }
  }

  .accountVipDetail{
    position: absolute;
    bottom: 0px;
    width: calc(100% - .64rem);
    font-size: .21rem;
    display: flex;
    text-align: center;

    &>div{
      flex: 1;
      margin-bottom: .2rem;

      &>div:first-child{
        font-size: .27rem;
        margin-bottom: .1rem;
      }
    }

    .mortgage{
      // color: #FFF;
      box-sizing: border-box;

      .Redeem{
        margin-left: .1rem;
        color: #F6C85C;
      }
    }

    // .charge{
    //   text-align: center;
    // }

    // .saveCharge{
    //   text-align: right;
    // }
  }
}

.more-bos{
  // background: url('/static/img/more/Group.png') ;
  background: linear-gradient(to right, rgba(68,92,241,0.96) , rgba(57,82,193,1));
  min-height: 3.1rem;
  max-width: 100%;
  text-align: center;
  color: white;
  position: relative;
  padding: 0.3rem 0;
  // box-shadow: 0px 0px .15rem $color-333;

  .center{
    width: 6rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .logoIcon{
      font-size: .6rem;
      margin-bottom: .2rem;
    }

    .bannerTitle{
      color: rgba(255, 255, 255, .7);
      font-size: 0.32rem;
      font-weight: 300;
    }
    .bannerDesc{
      margin-top: 0.15rem;
      color: rgba(255, 255, 255, .7);
      font-size: 0.28rem;
      p{
        line-height: 0.4rem;
      }
    }
  }
}

// 开通会员 & 升级会员
.toVip{
  font-size: .25rem;
  background: #FFF;
  // 充值会员样式
  .rechargeVip{
    height: 1rem;
    width: 100%;
    display: flex;
    &>div{
      flex: 1;
       display: flex;
       align-items: center;
       justify-content: center;
       position: relative;
       font-size: 0.27rem;
       color: #8B572A;
       &:last-child::before{
         content: '';
         position: absolute;
         left: 0;
         top: 50%;
         transform: translateY(-50%);
         width: 0.02rem;
         height: 0.3rem;
         background: #C7C7C7;
       }
       .icon{
         width: 0.42rem;
         height: 0.42rem;
         border-radius: 50%;
         margin-right: 0.1rem;
        img{
            width:100%;
            height: 100%;
        }
       }
    }
  }
  .openVip{
    padding: .36rem .25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &>div{
      display: flex;
      align-items: center;
    }

    .openBtn{
      width: 1.8rem;
      justify-content: center;
      height: .74rem;;
      background-color: #F6C85C;
      // background-image: linear-gradient(0deg, #E5AE65 0%, #FFEA7A 100%);
      border-radius: 10px;
      color: #8C633E;
      font-size: .32rem;
    }
  }

  .title{
    font-size: .32rem;

    &.koFontSize{
      font-size: .3rem;
    }
  }

  .tip{
    color: $color-999;
    margin-left: .2rem;

    &.koTipFontSize{
      font-size: .23rem;
    }
  }
}

.list{
  margin: 0rem 0rem .36rem 0px;
  font-size: .3rem;
  background: #FFF;
  // padding: 0px .16rem;
  // border-radius: .2rem;
  // box-shadow: 0px 0px .15rem #f0f0f0;

  .subTitle{
    height: .75rem;
    display: flex;
    align-items: center;
    padding-left: .24rem;
    background: #F3F3F3;;
    color: $color-999;
  }

  .item{
    padding: 0px .16rem;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    height: 1.2rem;
    border-bottom: 1px solid $color-e3e3e3;
    background: #fff;
    position: relative;

    &:last-child{
      border-bottom: 1px solid transparent;
    }

    // &:active{
    //   background: #cdcdcd;
    //   opacity: .8;
    //   color: rgba($color: #333, $alpha: 0.8)
    // }

    &>div{
      flex: 1;
      padding: 0px .1rem 0px .24rem;
      position: relative;

      &.name{
        flex: 10;
        padding: 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .hot{
          position: absolute;
          top: 0px;
          right: 0px;
          color: $color-red;
          font-size: .3rem;
          transform: translate(100%, -70%);
        }

        .tip{
          color: $color-999;
          font-size: .25rem;
          margin-left: .3rem;
        }
      }

      &.link{
        text-align: right;
        color: $color-999;
      }

      span{
        font-size: .3rem;
      }

      .icon{
        font-size: .46rem;
        color: $color-this;

        &.anonymous{
          font-size: .21rem;
        }

        &.smallicon{
          font-size: .42rem;
        }
        &.info{
          font-size: .5rem;
        }

      }
    }
  }

  .icon-huaban11{
    color: #A6B6D7;
  }
}

// dialog
.dialogAccount{
  border-radius: .12rem;
}

.hidden{
  position: absolute;
  top: -100px;
}

// 会员样式
.isVipDiv{
  .more{
    background: url('/static/img/more/avip-bg.png') no-repeat;
    background-size: contain;
    color: #F2DBA4;

    .Redeem{
      color: #F5A623 !important;
    }
  }

  .icon{
    color: #F6C85C !important;
  }

  .icon-huaban11{
    color: #F2DBA4 !important;
  }
}
.mortgageNDX{
  background: transparent !important;
}
</style>
